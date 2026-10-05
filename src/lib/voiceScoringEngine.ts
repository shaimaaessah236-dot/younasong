// ============================================================================
// Voice Scoring & Anti-Randomness Audio Engine (محرك التحكيم الصوتي الصارم)
// يمنع التقييم العشوائي، ويكتشف الصمت والضوضاء، ويطابق الكلمات الحقيقية
// ============================================================================

export interface VoiceAnalysisResult {
  hasHumanVoice: boolean;
  voiceType: string;
  pitchTier: string;
  avgFrequencyHz: number;
  confidence: number;
  clarity: string;
  emoji: string;
  tonalMatch: string;
  overallScore: number;
  detectedLyricsText: string;
  lyricsMatchPercent: number;
  matchedKeywords: string[];
  critiqueNotes: string;
  isSilentOrNoise: boolean;
  dynamicRange: number;
  pitchStability: number;
}

// تنظيف وتوحيد النصوص العربية لمقارنة الكلمات الصوتية بدقة متناهية
export function normalizeArabicWords(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u064B-\u065F\u0670]/g, '') // إزالة التشكيل
    .replace(/[أإآء]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/[^a-zA-Z0-9\u0621-\u064A\s]/g, ' ')
    .toLowerCase()
    .trim();
}

// قائمة الكلمات الشائعة التي لا تعتبر كلمات مفتاحية فريدة
const ARABIC_STOPWORDS = new Set([
  'في', 'من', 'على', 'عن', 'إلى', 'الى', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'هو', 'هي', 'هم',
  'نحن', 'انا', 'أنا', 'انت', 'أنت', 'كان', 'كانت', 'ما', 'لا', 'لم', 'لن', 'ان', 'أن', 'إن',
  'ثم', 'أو', 'او', 'بل', 'حتى', 'كل', 'قد', 'غير', 'بين', 'عند'
]);

/**
 * تحليل دقيق وصارم للتسجيل الصوتي:
 * 1. فحص طاقة الصوت ومستوى الصمت والضوضاء المحيطة.
 * 2. قياس البصمة الترددية وحساب الدورية التوافقية (Harmonic Autocorrelation) للتفريق بين الصوت البشري وضجيج المروحة/الميكروفون.
 * 3. فحص الكلمات المنطوقة والمغناة ومطابقتها حرفياً مع كلمات الشارة.
 * 4. منع إعطاء نقاط عالية (80% فما فوق) إلا لصوت بشري حقيقي جميل يغني كلمات الشارة بثبات مقامي.
 */
export async function analyzeVoicePerformance(
  blobOrBuffer: Blob | ArrayBuffer,
  songTitle: string,
  songLyrics: string[] | string,
  spokenTranscript?: string
): Promise<VoiceAnalysisResult> {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const audioContext = new AudioCtx();

    let arrayBuffer: ArrayBuffer;
    if (blobOrBuffer instanceof Blob) {
      arrayBuffer = await blobOrBuffer.arrayBuffer();
    } else {
      arrayBuffer = blobOrBuffer;
    }

    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const bufferLength = channelData.length;
    const durationSeconds = audioBuffer.duration;

    const windowSize = 2048;
    const stepSize = 1024;
    const detectedPitches: number[] = [];
    const rmsList: number[] = [];

    let totalRms = 0;
    let peakRms = 0;
    let frameCount = 0;
    let harmonicFramesCount = 0;

    // فحص الإطارات الزمنية وحساب الطاقة والترددات
    for (let offset = 0; offset < bufferLength - windowSize; offset += stepSize) {
      let sumSquares = 0;
      for (let i = 0; i < windowSize; i++) {
        const val = channelData[offset + i];
        sumSquares += val * val;
      }
      const rms = Math.sqrt(sumSquares / windowSize);
      rmsList.push(rms);
      totalRms += rms;
      if (rms > peakRms) peakRms = rms;
      frameCount++;

      // عتبة الطاقة الدنيا للصوت البشري المسموع (فوق ضجيج الدوائر والميكروفون 0.02)
      if (rms < 0.022) continue;

      let bestCorrelation = 0;
      let bestPeriod = -1;
      const minPeriod = Math.floor(sampleRate / 550); // الحد الأقصى لصوت السوبرانو/الطفل ~550Hz
      const maxPeriod = Math.floor(sampleRate / 75);  // الحد الأدنى لصوت الباص البشري ~75Hz

      for (let period = minPeriod; period <= maxPeriod; period++) {
        let correlation = 0;
        for (let i = 0; i < windowSize - period; i++) {
          correlation += channelData[offset + i] * channelData[offset + i + period];
        }
        correlation = correlation / (sumSquares || 1);

        if (correlation > bestCorrelation && correlation > 0.55) {
          bestCorrelation = correlation;
          bestPeriod = period;
        }
      }

      if (bestPeriod > 0) {
        const frequency = sampleRate / bestPeriod;
        // استبعاد ترددات الكهرباء الثابتة (طنين 50Hz و 60Hz ومضاعفاتها)
        const isElectricalHum =
          (frequency >= 48 && frequency <= 52) ||
          (frequency >= 58 && frequency <= 62) ||
          (frequency >= 98 && frequency <= 102) ||
          (frequency >= 118 && frequency <= 122);

        if (!isElectricalHum && frequency >= 80 && frequency <= 500) {
          detectedPitches.push(frequency);
          if (bestCorrelation > 0.65) {
            harmonicFramesCount++;
          }
        }
      }
    }

    await audioContext.close().catch(() => {});

    const avgRms = totalRms / (frameCount || 1);
    const dynamicRange = peakRms / Math.max(0.005, avgRms);
    const voicedFrames = detectedPitches.length;
    const voicedRatio = voicedFrames / (frameCount || 1);

    // -------------------------------------------------------------
    // 1. الفحص الصارم للصمت وغياب الصوت البشري تماماً
    // -------------------------------------------------------------
    const isTooShort = durationSeconds < 1.2;
    const isVeryLowEnergy = avgRms < 0.016 && peakRms < 0.038;
    const isFlatNoise = dynamicRange < 1.7 && avgRms < 0.045; // ضوضاء مروحة أو سكون
    const lacksHarmonicVoice = voicedFrames < 12 || voicedRatio < 0.12;

    const isSilenceOrAmbientNoise = isTooShort || isVeryLowEnergy || isFlatNoise || lacksHarmonicVoice;

    if (isSilenceOrAmbientNoise) {
      // إعطاء تنقيط متدنٍ جداً (بين 10 و 18 من 100 فقط) لمنع العشوائية
      const veryLowScore = Number((10 + Math.random() * 6).toFixed(1));
      return {
        hasHumanVoice: false,
        isSilentOrNoise: true,
        voiceType: 'لم يُرصد صوت بشري (No Voice)',
        pitchTier: 'تسجيل صامت / ضوضاء محيطة فقط',
        avgFrequencyHz: 0,
        confidence: 8,
        clarity: 'ميكروفون صامت أو ضجيج خافت',
        emoji: '🔇',
        tonalMatch: 'غير متطابق (لم يتم الغناء)',
        overallScore: veryLowScore,
        detectedLyricsText: spokenTranscript?.trim() || '',
        lyricsMatchPercent: 0,
        matchedKeywords: [],
        dynamicRange: Number(dynamicRange.toFixed(2)),
        pitchStability: 0,
        critiqueNotes:
          '🔇 لم يتم رصد صوت غناء بشري حقيقي في التسجيل (تم رصد صمت أو هواء محيطي فقط). للحصول على تقييم ونقاط في المسابقة، يجب الغناء بصوت مسموع وواضح ومطابق لكلمات الشارة.'
      };
    }

    // -------------------------------------------------------------
    // 2. تحليل الكلمات المنطوقة ومطابقتها حرفياً مع كلمات الشارة
    // -------------------------------------------------------------
    let rawSongLyrics = '';
    if (Array.isArray(songLyrics)) {
      rawSongLyrics = songLyrics.join(' ');
    } else if (typeof songLyrics === 'string') {
      rawSongLyrics = songLyrics;
    }
    // دمج عنوان الشارة في بنك الكلمات المرجعية
    const fullReferenceText = `${songTitle} ${rawSongLyrics}`;
    const normalizedSong = normalizeArabicWords(fullReferenceText);
    const normalizedUser = normalizeArabicWords(spokenTranscript || '');

    const songWords = new Set(
      normalizedSong
        .split(/\s+/)
        .filter((w) => w.length >= 2 && !ARABIC_STOPWORDS.has(w))
    );

    const userWords = normalizedUser
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !ARABIC_STOPWORDS.has(w));

    const matchedWordsList: string[] = [];
    userWords.forEach((word) => {
      if (songWords.has(word) && !matchedWordsList.includes(word)) {
        matchedWordsList.push(word);
      }
    });

    const expectedKeywordsCount = Math.max(3, Math.min(12, Math.floor(songWords.size * 0.4)));
    
    // إذا لم ينطق المستخدم أي كلمة، أو لم تتطابق أي كلمة، تكون النسبة 0% تماماً
    let lyricsMatchPercent = 0;
    if (userWords.length > 0 && expectedKeywordsCount > 0) {
      lyricsMatchPercent = Math.min(100, Math.round((matchedWordsList.length / expectedKeywordsCount) * 100));
    }

    // -------------------------------------------------------------
    // 3. تحليل التردد واستقرار النغمات (Pitch Stability)
    // -------------------------------------------------------------
    const sortedPitches = [...detectedPitches].sort((a, b) => a - b);
    const medianPitch = Math.round(sortedPitches[Math.floor(sortedPitches.length / 2)] || 180);

    const meanPitch = detectedPitches.reduce((a, b) => a + b, 0) / detectedPitches.length;
    const variance =
      detectedPitches.reduce((a, b) => a + Math.pow(b - meanPitch, 2), 0) / detectedPitches.length;
    const pitchStdDev = Math.sqrt(variance);

    // الغناء الموسيقي المتناسق يتميز بانحراف نغمي يتنقل بين المقامات بتناغم (بين 12 و 55)
    const isMusicallyStable = pitchStdDev >= 10 && pitchStdDev <= 60;
    const pitchStabilityScore = Math.max(0, Math.min(100, Math.round(100 - Math.abs(pitchStdDev - 32) * 1.5)));

    // -------------------------------------------------------------
    // 4. تصنيف الطبقة الصوتية البشرية الحقيقية
    // -------------------------------------------------------------
    let voiceType = 'صوت بشري';
    let pitchTier = '';
    let emoji = '🎤';

    if (medianPitch < 120) {
      voiceType = 'ذكر (Male)';
      pitchTier = 'باص (Bass) - رخيم وعميق';
      emoji = '🎙️';
    } else if (medianPitch < 155) {
      voiceType = 'ذكر (Male)';
      pitchTier = 'باريتون (Baritone) - دافئ متوازن';
      emoji = '🎵';
    } else if (medianPitch < 195) {
      voiceType = 'ذكر (Male)';
      pitchTier = 'تينور (Tenor) - ساطع وحماسي';
      emoji = '✨';
    } else if (medianPitch < 240) {
      voiceType = 'أنثى (Female)';
      pitchTier = 'ألتو (Alto) - عميق ووجداني';
      emoji = '🌟';
    } else if (medianPitch < 300) {
      voiceType = 'أنثى (Female)';
      pitchTier = 'ميزو سوبرانو (Mezzo) - سبيستون كلاسيك';
      emoji = '💫';
    } else if (medianPitch < 380) {
      voiceType = 'أنثى (Female)';
      pitchTier = 'سوبرانو (Soprano) - نقي وعالي';
      emoji = '🎶';
    } else {
      voiceType = 'طفل (Child)';
      pitchTier = 'طبقة طفولية مشرقة (Treble)';
      emoji = '🎈';
    }

    // -------------------------------------------------------------
    // 5. حساب النتيجة الصارمة الموزونة ومنع التقييم العشوائي
    // -------------------------------------------------------------
    // قاعدة البداية لوجود صوت بشري فعلي:
    let calculatedScore = 25;

    // طاقة الصوت وحضور الميكروفون (حتى 20 نقطة):
    const energyBonus = Math.min(20, Math.max(5, Math.round((avgRms / 0.07) * 18)));
    calculatedScore += energyBonus;

    // استقرار النغمة والتحكم الصوتي المقامي (حتى 20 نقطة):
    if (isMusicallyStable) {
      calculatedScore += 18;
    } else {
      calculatedScore += 8;
    }

    // مطابقة الكلمات الفعلية المغناة مع الشارة (حتى 35 نقطة):
    if (userWords.length === 0) {
      // لم يتعرف المتصفح على أي كلام منطوق (صوت همهمة أو لحن بدون ألفاظ)
      calculatedScore += 4;
    } else if (lyricsMatchPercent >= 60) {
      calculatedScore += 35;
    } else if (lyricsMatchPercent >= 35) {
      calculatedScore += 24;
    } else if (lyricsMatchPercent >= 15) {
      calculatedScore += 14;
    } else {
      // نطق كلمات ولكنها لا علاقة لها بالشارة نهائياً
      calculatedScore += 5;
    }

    // -------------------------------------------------------------
    // 6. قواعد وضوابط الجودة النهائية (Quality Caps & Gates)
    // -------------------------------------------------------------
    let finalOverall = calculatedScore;

    // إذا كانت الكلمات لا تطابق الشارة أو لم ينطق المتسابق كلمات الشارة:
    // يستحيل أن يتجاوز التقييم 48%!
    if (lyricsMatchPercent === 0 && matchedWordsList.length === 0) {
      finalOverall = Math.min(42.0, finalOverall);
    } else if (lyricsMatchPercent < 30) {
      finalOverall = Math.min(64.0, finalOverall);
    }

    // الدرجات العالية جداً (85% إلى 97%) محجوزة حصرياً للأصوات الجميلة الموهوبة:
    // التي تطابق كلمات الشارة بنسبة عالية مع استقرار مقامي وطاقة واضحة
    if (lyricsMatchPercent >= 50 && isMusicallyStable && avgRms > 0.035 && durationSeconds >= 4.0) {
      finalOverall = Math.min(97.5, Math.max(86.0, finalOverall));
    }

    finalOverall = Number(Math.max(18.0, Math.min(98.0, finalOverall)).toFixed(1));

    // -------------------------------------------------------------
    // 7. صياغة تقرير لجنة التحكيم الموجه بدقة
    // -------------------------------------------------------------
    let tonalMatch = '';
    let critiqueNotes = '';

    if (lyricsMatchPercent >= 60) {
      tonalMatch = `تطابق ممتاز ومتقن مع كلمات وألحان ${songTitle}`;
      critiqueNotes =
        finalOverall >= 90
          ? `أداء غنائي موهوب ومتميز جداً! تم التعرف على كلمات الشارة بدقة مع تنغيم مقامي نقي وروح سبيستونية أصيلة.`
          : `أداء جميل ومطابق لكلمات ${songTitle}، يُنصح بمزيد من الثبات عند القفلات الصوتية لرفع الدرجة للأعلى.`;
    } else if (lyricsMatchPercent >= 25) {
      tonalMatch = `تطابق جزئي مع مقاطع من شارة ${songTitle}`;
      critiqueNotes = `تم رصد غناء صوتي جميل مع مطابقة لبعض كلمات الشارة (${matchedWordsList.join('، ')}). للحصول على وسام الصدارة يُرجى إتقان الشارة كاملة.`;
    } else if (userWords.length > 0) {
      tonalMatch = `صوت بشري غير مطابق لكلمات (${songTitle})`;
      critiqueNotes = `تم رصد صوت بشري، لكن الكلمات المنطوقة لم تتطابق مع كلمات شارة (${songTitle}). للحصول على تقييم مرتفع في المسابقة يجب غناء كلمات الشارة المحددة.`;
    } else {
      tonalMatch = `همهمة أو لحن حر بدون كلمات واضحة`;
      critiqueNotes = `تم رصد نبرة صوتية، لكن لم يتم التعرف على أي كلمات واضحة من شارة (${songTitle}). التقييم منخفض لأن معايير المسابقة تشترط وضوح الكلمات المغناة.`;
    }

    const confidence = Math.min(98, Math.max(30, Math.round(voicedRatio * 100)));
    const clarity = avgRms > 0.045 ? 'نقاء صوتي متقدم وحضور واضح' : 'صوت متوسط النقاء';

    return {
      hasHumanVoice: true,
      isSilentOrNoise: false,
      voiceType,
      pitchTier,
      avgFrequencyHz: medianPitch,
      confidence,
      clarity,
      emoji,
      tonalMatch,
      overallScore: finalOverall,
      detectedLyricsText: spokenTranscript?.trim() || '',
      lyricsMatchPercent,
      matchedKeywords: matchedWordsList,
      dynamicRange: Number(dynamicRange.toFixed(2)),
      pitchStability: pitchStabilityScore,
      critiqueNotes
    };
  } catch (err) {
    console.error('Audio analysis engine error:', err);
    return {
      hasHumanVoice: false,
      isSilentOrNoise: true,
      voiceType: 'تعذر الفحص الدقيق',
      pitchTier: 'فحص تجريبي',
      avgFrequencyHz: 0,
      confidence: 10,
      clarity: 'غير واضح',
      emoji: '⚠️',
      tonalMatch: 'تعذر القياس الصوتي',
      overallScore: 20.0,
      detectedLyricsText: '',
      lyricsMatchPercent: 0,
      matchedKeywords: [],
      dynamicRange: 1.0,
      pitchStability: 0,
      critiqueNotes: 'حدث تعذر أثناء تحليل التسجيل، أو أن صيغة الصوت غير متوافقة.'
    };
  }
}
