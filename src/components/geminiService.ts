/**
 * Client-side bridge to call Gemini API endpoints securely via server
 */

export interface LiveWebSource {
  title: string;
  url: string;
  domain?: string;
  snippet?: string;
}

export interface ExternalSearchLink {
  engine: 'google' | 'youtube' | 'wikipedia' | 'myanimelist' | 'imdb' | 'genius' | 'telegram' | 'justwatch' | 'spotify';
  label: string;
  query: string;
  url: string;
  category: 'web' | 'video' | 'anime' | 'encyclopedia' | 'lyrics' | 'cinema' | 'telegram';
  badge?: string;
}

export interface AIMediaSearchResult {
  reply: string;
  mode?: 'web_deep' | 'media' | 'lyrics_chords' | 'create_lyrics';
  searchQueriesUsed?: string[];
  liveWebSources?: LiveWebSource[];
  externalSearchLinks?: ExternalSearchLink[];
  mediaInfo?: {
    found?: boolean;
    title: string;
    englishTitle?: string;
    type: 'movie' | 'series' | 'anime' | 'kdrama' | 'cartoon' | 'song' | 'general';
    releaseYear?: string;
    rating?: string;
    genres?: string[];
    story: string;
    episodesOrDuration?: string;
    directorOrStudio?: string;
    composerOrSinger?: string;
    musicalKey?: string;
    bpm?: number;
  };
  musicAnalysis?: {
    songTitle?: string;
    animeOrSource?: string;
    composer?: string;
    singer?: string;
    musicalScale?: string;
    rhythmOrBpm?: string;
    lyricsExcerpt?: string;
    fullLyricsVerified?: string;
    vocalStyle?: string;
    themes?: string[];
  };
  quickFacts?: string[];
  telegramSources?: Array<{
    name: string;
    url: string;
    handle?: string;
    reason: string;
    type?: 'channel' | 'bot' | 'search_link';
    badge?: string;
  }>;
  youtubeSources?: Array<{
    title: string;
    url: string;
    type: 'trailer' | 'episodes' | 'clips' | 'ost' | 'channel';
    channelName?: string;
    description?: string;
  }>;
  webStreamingSources?: Array<{
    platformName: string;
    url: string;
    availability?: 'subscription' | 'free' | 'database' | 'search_portal';
    notes?: string;
  }>;
  howToWatchGuide?: string[];
  suggestedQueries?: string[];
  // Backwards compatibility
  recommendedChannels?: Array<{
    name: string;
    url: string;
    handle?: string;
    reason: string;
    type?: 'channel' | 'bot';
  }>;
}

export async function searchMediaWithAI(query: string, mode: 'web_deep' | 'media' | 'lyrics_chords' | 'create_lyrics' = 'media'): Promise<AIMediaSearchResult | null> {
  try {
    const response = await fetch('/api/ai/smart-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode }),
    });
    const data = await response.json();
    if (data.success && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('AI Media Search Error:', error);
    return null;
  }
}

export async function getMusicSuggestions(userQuery: string): Promise<string> {
  try {
    const response = await fetch('/api/ai-suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery }),
    });
    const data = await response.json();
    return data.result || 'عذراً، لم أتمكن من جلب الاقتراحات حالياً.';
  } catch (error) {
    console.error('Gemini Service Error:', error);
    return 'حدث خطأ أثناء الاتصال بالمساعد الذكي.';
  }
}

export async function generateLyricsPrompt(topic: string, style: string, scale?: string): Promise<string> {
  try {
    const response = await fetch('/api/ai-generate-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, style, scale }),
    });
    const data = await response.json();
    return data.result || 'تعذر توليد الكلمات، حاول مرة أخرى.';
  } catch (error) {
    console.error('Gemini Service Error:', error);
    return 'حدث خطأ أثناء توليد الكلمات.';
  }
}

export interface YounaSongComposition {
  title: string;
  englishTitle: string;
  topic: string;
  songLanguage?: 'ar' | 'en';
  genreStyle: string;
  vocalStyle: string;
  musicalMaqam: string;
  westernScale: string;
  bpm: number;
  rhythmName: string;
  instrumentation: string;
  mood: string;
  studioPrompt?: string;
  sunoPrompt?: string;
  lyrics: string;
  productionBreakdown: {
    poeticMeterAndRhyme: string;
    maqamAnalysis: string;
    harmonicStructure: string;
    arrangementUsed: string;
  };
  melodyGuide: {
    keyNotes: string;
    vocalRange: string;
    chorusPeak: string;
    chords: string[];
    performanceNotes: string;
  };
  audioMelodySequence: Array<{ note: string; freq: number; duration: number }>;
  singingTips: string[];
}

export type SunoSongComposition = YounaSongComposition;

// Helper function to create an instant high-quality local song composition
function createLocalSongComposition(params: {
  topic: string;
  title?: string;
  songLanguage?: 'ar' | 'en';
  style?: string;
  vocalType?: string;
  scale?: string;
  bpm?: number;
  mood?: string;
  customLyrics?: string;
  instrumentalOnly?: boolean;
}): YounaSongComposition {
  const words = (params.topic || '').split(/\s+/).filter(w => w.length > 2);
  const mainTopic = params.topic?.trim() || 'الأمل والمستقبل';
  const keyword1 = words[0] || 'الأمل';
  const keyword2 = words[1] || 'النجوم';
  const songTitle = params.title || (params.songLanguage === 'en' ? `Wings of ${keyword1}` : `ملحمة ${keyword1} و${keyword2}`);
  const selectedMaqam = params.scale || 'مقام نهاوند (C Minor)';
  const selectedStyle = params.style || 'شارة سبيستون كلاسيكية / أصوات بشرية ناصعة';
  const selectedBpm = params.bpm || 108;
  const isEnglish = params.songLanguage === 'en';

  if (isEnglish) {
    return {
      title: songTitle,
      englishTitle: songTitle,
      topic: mainTopic,
      songLanguage: 'en',
      genreStyle: selectedStyle,
      vocalStyle: params.vocalType || 'Heroic anime vocals with warm backing choir',
      musicalMaqam: 'C Minor (Nahawand)',
      westernScale: 'C Minor',
      bpm: selectedBpm,
      rhythmName: 'Epic 4/4 March',
      instrumentation: 'Soaring Strings, Acoustic Grand Piano, Acapella Choir Harmonies',
      mood: params.mood || 'Heroic, Inspiring, Nostalgic',
      studioPrompt: `Studio Youna anime soundtrack about ${mainTopic}, heroic English vocals, 108 BPM, C Minor, orchestral choir`,
      lyrics: `[Intro]
(Soft choir humming ascending in C Minor harmony)
Through the endless sky we find our way...
Carrying the promise of a brighter day...

[Verse 1]
From the deepest dream we take our stand
Walking together hand in hand
When the dark of night begins to fade
Every spark of courage has been made!

[Pre-Chorus]
Listen to the call across the sea
Rise my friend, we are forever free!

[Chorus]
Fly up high and touch the glowing light!
Through the storm we will ignite the night!
Side by side we conquer every fear
Victory and hope are drawing near!

[Verse 2]
Though the road is long and skies are gray
Nothing will ever turn our hearts away
We will shine like stars across the sky
Spreading our wings as we learn to fly!

[Bridge]
No wind can break the bond we hold
A story of bravery waiting to be told!

[Chorus]
Fly up high and touch the glowing light!
Through the storm we will ignite the night!
Side by side we conquer every fear
Victory and hope are drawing near!

[Outro]
Forever united, champions of light...
Always and forever...
[Fade Out]
[End]`,
      productionBreakdown: {
        poeticMeterAndRhyme: 'Iambic meter with dynamic AABB and ABAB end-rhymes for maximum lyrical hook and melodic flow.',
        maqamAnalysis: 'C Minor (Nahawand) harmonic scale with emotional leaps to Eb4 and G4, transitioning to major resolution in Chorus.',
        harmonicStructure: 'Progression: Cm -> Fm -> Bb -> Eb -> Ab -> G7 -> Cm',
        arrangementUsed: 'Layered 4-part choir (SATB) combined with acoustic grand piano, orchestral strings, and vocal acapella bassline.'
      },
      melodyGuide: {
        keyNotes: 'C4 -> Eb4 -> G4 -> F4 -> Eb4 -> D4 -> C4',
        vocalRange: 'C4 to G5 (Comfortable chest voice with powerful soaring head voice in chorus)',
        chorusPeak: 'G5 peak on "Fly up high" with resonant vibrato',
        chords: ['Cm', 'Fm', 'Bb', 'Eb', 'Ab', 'G7', 'Cm'],
        performanceNotes: 'Start the intro with an intimate warm whisper, building passion into an explosive heroic chorus.'
      },
      audioMelodySequence: [
        { note: 'C4', freq: 261.63, duration: 0.5 },
        { note: 'Eb4', freq: 311.13, duration: 0.5 },
        { note: 'G4', freq: 392.00, duration: 0.75 },
        { note: 'F4', freq: 349.23, duration: 0.5 },
        { note: 'Eb4', freq: 311.13, duration: 0.5 },
        { note: 'D4', freq: 293.66, duration: 0.5 },
        { note: 'C4', freq: 261.63, duration: 1.0 }
      ],
      singingTips: [
        'Take a deep breath from your diaphragm before the chorus.',
        'Emphasize the rhyming consonants on each bar.',
        'Smooth transition between verse chest voice and chorus soaring highs.'
      ]
    };
  }

  return {
    title: songTitle,
    englishTitle: `Theme of ${keyword1} (Studio Youna)`,
    topic: mainTopic,
    songLanguage: 'ar',
    genreStyle: selectedStyle,
    vocalStyle: params.vocalType || 'صوت شجي دافئ وبطولي مع كورس جماعي',
    musicalMaqam: selectedMaqam,
    westernScale: 'C Minor (نهاوند الدو)',
    bpm: selectedBpm,
    rhythmName: 'إيقاع مقسوم حماسي 4/4',
    instrumentation: 'أصوات بشرية أكابيلا ناصعة، بيانو كلاسيكي، كورس شبابي ملهم، وتوزيع هوائي شجي',
    mood: params.mood || 'حماسي، وجداني، نوستالجيا ملهمة',
    studioPrompt: `Studio Youna: Spacetoon anime theme song about ${mainTopic}, emotional and heroic Arabic vocals, ${selectedBpm} BPM, C Minor Nahawand maqam`,
    lyrics: `[Intro]
(همهمات كورال صوتي دافئ بنغمات مقام نهاوند الشجية)
في عالمِ ${keyword1} يبتسمُ الرجاء...
نحملُ في الأعماقِ عهداً للوفاء...

[Verse 1]
من نبضِ الحلمِ خطونا في رحابِ ${keyword1}
نكسرُ الصمتَ ونمضي نحو أفقِ العنان
كلما لاحت خُطانا في طريقِ ${keyword2}
أشرقت في الروحِ أنوارُ الأمان!

[Pre-Chorus]
(تصاعد لحني تدريجي مع دخول النبض الإيقاعي)
اسمع صدى صوتكَ في المدى ينادي
هيا انهض يا صديقي.. هذا فجرُ بلادي!

[Chorus]
طر في العلا.. عانق ضياءَ السحر
واكتب على الغيمِ حكاياتِ الظفر!
مهما اشتدت الرياحُ.. نحنُ لا نهاب
في قلوبنا شعلةٌ.. تكسرُ الضباب!

[Verse 2]
عبرَ المدى والزمنِ البعيد
نحيا معاً في عهدٍ جديد
صوتُ الإخاءِ يوحّدُ المسار
والعزمُ فينا يصنعُ الانتصار!

[Bridge]
(أكابيلا أصوات بشرية صافية وهارموني هادئ)
لا انكسار.. لا رجوع..
بالأملِ تمحى الدموع!

[Chorus]
طر في العلا.. عانق ضياءَ السحر
واكتب على الغيمِ حكاياتِ الظفر!
مهما اشتدت الرياحُ.. نحنُ لا نهاب
في قلوبنا شعلةٌ.. تكسرُ الضباب!

[Outro]
نحنُ الأبطال.. نحمي الضياء...
معاً إلى الأبد...
[Fade Out]
[End]`,
    productionBreakdown: {
      poeticMeterAndRhyme: 'بحر الرمل التام (فاعلاتن فاعلاتن فاعلاتن) مع قوافٍ ثنائية متناسقة ونهايات رنانة.',
      maqamAnalysis: `${selectedMaqam} - انتقال وجداني حنون من جنس النهاوند على الدو إلى الكرد والحجاز في مقطع التحدي، ثم العودة لقرار النهاوند.`,
      harmonicStructure: 'التدرج الهارموني: Cm -> Fm -> Bb -> Eb -> Ab -> G7 -> Cm',
      arrangementUsed: 'توزيع صوتي متكامل: كورس بشري أكابيلا، بيانو كلاسيكي گراند، وتريات هادئة مع صنجات إيقاعية عند ذروة الكورس.'
    },
    melodyGuide: {
      keyNotes: 'C4 -> D4 -> Eb4 -> F4 -> G4 -> Ab4 -> G4 -> F4 -> Eb4 -> D4 -> C4',
      vocalRange: 'من قرار الدو (C4) إلى جواب الصول (G5) مع أداء دافئ وصوت رنان',
      chorusPeak: 'قمة اللحن عند كلمة (طر في العلا) على نغمة الصول المرتفعة G5',
      chords: ['Cm', 'Fm', 'Bb', 'Eb', 'Ab', 'G7', 'Cm'],
      performanceNotes: 'أداء صوتي شجي نقي؛ هادئ ومؤثر في البداية، ثم ينطلق بقوة وفخامة في الكورس.'
    },
    audioMelodySequence: [
      { note: 'C4', freq: 261.63, duration: 0.6 },
      { note: 'Eb4', freq: 311.13, duration: 0.6 },
      { note: 'G4', freq: 392.00, duration: 0.9 },
      { note: 'Ab4', freq: 415.30, duration: 0.6 },
      { note: 'F4', freq: 349.23, duration: 0.6 },
      { note: 'G4', freq: 392.00, duration: 1.2 }
    ],
    singingTips: [
      'تنفس بعمق من الحجاب الحاجز قبل الدخول في مقطع الكورس.',
      'احرص على مد الحروف الصوتية عند نهايات القوافي لإعطاء طابع الشارة الكلاسيكية.',
      'حافظ على نقاء مخارج الحروف العربية الفصحى.'
    ]
  };
}

export async function composeSongWithYounaStudio(params: {
  topic: string;
  title?: string;
  songLanguage?: 'ar' | 'en';
  style?: string;
  vocalType?: string;
  scale?: string;
  bpm?: number;
  mood?: string;
  customLyrics?: string;
  instrumentalOnly?: boolean;
}): Promise<YounaSongComposition | null> {
  try {
    const response = await fetch('/api/ai/compose-song-youna', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const text = await response.text();
    if (text && text.trim().startsWith('{')) {
      try {
        const data = JSON.parse(text);
        if (data.success && data.composition) {
          return data.composition;
        }
      } catch (parseErr) {
        // fall through to local generator
      }
    }
  } catch (error) {
    // Network or rate limit notice - smooth fallback to local composition
  }

  // Guaranteed fallback: return clean structured song
  return createLocalSongComposition(params);
}

export const composeSongWithSunoAI = composeSongWithYounaStudio;

export interface SingingVoiceAudioResult {
  audioDataUrl: string;
  lineAudios: Array<{ line: string; isHeader: boolean; audioUrl: string }>;
  totalLines: number;
}

// Client-side fallback audio generator for offline / network issues
function createClientVocalWavDataUrl(text: string, durationSec = 2.2, baseFreq = 261.63, voiceType = 'female'): string {
  if (typeof window === 'undefined') return '';
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * Math.max(1.0, durationSec));
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  const freq = voiceType === 'male' ? baseFreq * 0.75 : voiceType === 'choir' ? baseFreq * 0.9 : baseFreq * 1.1;
  const vibratoRate = 5.2;
  const vibratoDepth = 3.5;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const currentFreq = freq + Math.sin(2 * Math.PI * vibratoRate * t) * vibratoDepth;
    let env = 1.0;
    if (t < 0.08) env = t / 0.08;
    else if (t > durationSec - 0.12) env = Math.max(0, (durationSec - t) / 0.12);

    const fundamental = Math.sin(2 * Math.PI * currentFreq * t);
    const harmonic2 = 0.45 * Math.sin(2 * Math.PI * currentFreq * 2 * t);
    const harmonic3 = 0.22 * Math.sin(2 * Math.PI * currentFreq * 3 * t);

    let sample = (fundamental + harmonic2 + harmonic3) * 0.6 * env;
    sample = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, Math.floor(sample * 32767), true);
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

export async function generateSingingVoiceAudio(
  lyrics: string,
  voiceType: 'female' | 'male' | 'choir' = 'female',
  speed: 'normal' | 'slow' | 'fast' = 'normal'
): Promise<SingingVoiceAudioResult | null> {
  if (!lyrics || typeof lyrics !== 'string' || !lyrics.trim()) {
    return null;
  }

  const lines = lyrics
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('(') && !l.startsWith('[Fade') && !l.startsWith('[End'));

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('/api/ai/sing-song-audio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lyrics, voiceType, speed }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.success && data.lineAudios?.length) {
        return {
          audioDataUrl: data.audioDataUrl || data.lineAudios[0]?.audioUrl || '',
          lineAudios: data.lineAudios || [],
          totalLines: data.totalLines || data.lineAudios.length
        };
      }
    }
  } catch (error: any) {
    // Network or timeout notice - smooth client-side synthesis fallback
  }

  // Generate resilient client-side vocal audio result
  const baseFreqs = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
  const clientLineAudios = lines.map((line, idx) => {
    const isHeader = line.startsWith('[') && line.endsWith(']');
    const audioUrl = createClientVocalWavDataUrl(line, 2.0, baseFreqs[idx % baseFreqs.length], voiceType);
    return {
      line,
      isHeader,
      audioUrl
    };
  });

  return {
    audioDataUrl: clientLineAudios[0]?.audioUrl || '',
    lineAudios: clientLineAudios,
    totalLines: clientLineAudios.length
  };
}

import { findLocalGuideMatch } from './siteGuideKnowledge';

export interface SiteGuideResponse {
  reply: string;
  suggestedTab?: string;
  suggestedActionText?: string;
  quickSteps?: string[];
  followUpQuestions?: string[];
}

export async function askSiteGuideAI(
  question: string,
  currentTab?: string,
  history?: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<SiteGuideResponse> {
  const cleanQ = (question || '').trim();
  if (!cleanQ) {
    return {
      reply: 'مرحباً بك! أنا رفيقك ومرشدك الذكي. يمكنك سؤالي عن أي شارة أو فنان أو أداة، أو إرشادك لكيفية الغناء والتسجيل في الكاريوكي.',
      suggestedTab: 'vocal-studio',
      suggestedActionText: ' الذهاب إلى استوديو الغناء والكاريوكي',
      quickSteps: ['اختر القسم المطلوب من القائمة العلوية'],
      followUpQuestions: ['كيف أغني في استوديو الكاريوكي؟', 'أين أجد مسابقة الأصوات؟']
    };
  }

  // First attempt: Server-side Gemini 3.8 Flash / 3.1 Flash Lite with history context
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);

    const response = await fetch('/api/ai/site-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: cleanQ, currentTab, history }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.data && data.data.reply) {
        return data.data;
      }
    }
  } catch (error) {
    console.warn('Backend askSiteGuideAI server error or timeout, switching to local knowledge engine:', error);
  }

  // Second attempt: Instant local knowledge base match
  const localMatch = findLocalGuideMatch(cleanQ);
  if (localMatch) {
    return localMatch;
  }

  // Third attempt: Context-aware intelligent fallback based on keywords
  const lowerQ = cleanQ.toLowerCase();

  // 1. Vocal studio, recording, karaoke
  if (
    lowerQ.includes('استوديو') ||
    lowerQ.includes('كاريوكي') ||
    lowerQ.includes('غناء') ||
    lowerQ.includes('اغني') ||
    lowerQ.includes('اسجل') ||
    lowerQ.includes('تسجيل') ||
    lowerQ.includes('مايك') ||
    lowerQ.includes('ميكروفون') ||
    lowerQ.includes('لحن') ||
    lowerQ.includes('كلمات مضاءة') ||
    lowerQ.includes('صدى') ||
    (lowerQ.includes('صوت') && !lowerQ.includes('تصويت') && !lowerQ.includes('مسابق'))
  ) {
    return {
      reply: ` **استوديو الغناء والكاريوكي**: يتيح لك الاستوديو تسجيل صوتك مباشرة عبر المايكروفون مع الألحان الموسيقية والكلمات المضاءة المتزامنة، مع تفعيل مؤثرات الصدى (Echo/Reverb) وضبط السرعة (BPM)، واستلام تقييم فوري بالدرجات لأدائك الصوتي!`,
      suggestedTab: 'vocal-studio',
      suggestedActionText: ' الذهاب إلى استوديو الغناء والكاريوكي',
      quickSteps: [
        'انتقل لتبويب "استوديو الغناء" من الشريط العلوي',
        'اختر الشارة أو الأغنية المفضلة لديك',
        'اضغط على زر التسجيل الأخضر وابدأ الغناء مع الكلمات المضاءة',
        'اضغط إيقاف لحفظ تسجيلك وسماع النتيجة فوراً'
      ],
      followUpQuestions: [
        'كيف أحفظ وأحمل تسجيلي الصوتي؟',
        'كيف أتحكم بمؤثر الصدى وسرعة اللحن؟',
        'أين أجد أغاني فضل شاكر وفيروز في الاستوديو؟'
      ]
    };
  }

  // 2. Competitions and voting
  if (
    lowerQ.includes('مسابق') ||
    lowerQ.includes('تصويت') ||
    lowerQ.includes('اصوت') ||
    lowerQ.includes('كويز') ||
    lowerQ.includes('فائز') ||
    lowerQ.includes('صدارة')
  ) {
    return {
      reply: ` **قسم المسابقات والتصويت**: يمكنك الاستماع للمتسابقين، التصويت للمواهب بالقلب ، المشاركة بصوتك في مسابقة الشهر، والمنافسة في كويز معلومات الأنمي وسبيستون!`,
      suggestedTab: 'community',
      suggestedActionText: ' الذهاب إلى المسابقات والتصويت الآن',
      quickSteps: [
        'انتقل إلى قسم المسابقات والتصويت',
        'استمع للمشاركين وصوّت لصوتك المفضل بالقلب ',
        'اضغط "شارك بصوتك" لرفع تسجيلك ومنافسة المتسابقين'
      ],
      followUpQuestions: ['كيف أرفع تسجيلي لمسابقة الشهر؟', 'كيف أحل كويز الأنمي وسبيستون؟']
    };
  }

  // 3. Piano and instruments
  if (lowerQ.includes('بيانو') || lowerQ.includes('مقام') || lowerQ.includes('عزف') || lowerQ.includes('عازل') || lowerQ.includes('دوزن') || lowerQ.includes('أدوات') || lowerQ.includes('ادوات')) {
    return {
      reply: ` **قسم الأدوات وبيانو المقامات**: يوفر لك بيانو تفاعلي لتعلم المقامات (نهاوند، كورد، بياتي، صبا، راست، حجاز، عجم)، ومدوزن نغمات الصوت وعازل الصوت الذكي.`,
      suggestedTab: 'tools',
      suggestedActionText: ' فتح بيانو المقامات والأدوات الموسيقية',
      quickSteps: [
        'افتح تبويب "الأدوات الموسيقية"',
        'اختر المقام الموسيقي واضغط على مفاتيح البيانو للعزف',
        'استخدم عازل الصوت لتدريب نبرة صوتك'
      ],
      followUpQuestions: ['ما هو المقام الأنسب لشارات سبيستون؟', 'كيف يعمل عازل الصوت؟']
    };
  }

  // 4. Cinema and telegram
  if (lowerQ.includes('سينما') || lowerQ.includes('فيلم') || lowerQ.includes('افلام') || lowerQ.includes('مسلسل') || lowerQ.includes('تيليجرام') || lowerQ.includes('بوت') || lowerQ.includes('تحميل')) {
    return {
      reply: ` **قسم السينما وقنوات تيليجرام**: يتيح لك الوصول المباشر لقنوات وبوتات تيليجرام لمشاهدة وتحميل الأفلام والمسلسلات والأنمي بجودة 1080p و 4K بضغطة زر.`,
      suggestedTab: 'telegram',
      suggestedActionText: ' فتح قنوات السينما وتيليجرام',
      quickSteps: [
        'انتقل لتبويب "تيليجرام وسينما"',
        'اختر التصنيف المفضل لديك',
        'اضغط على القناة أو البوت للفتح المباشر في تيليجرام'
      ],
      followUpQuestions: ['أين أجد بوت البحث الفوري عن الأفلام؟', 'كيف أشاهد الأنمي بجودة 1080p؟']
    };
  }

  // 5. Classic Tarab songs
  if (lowerQ.includes('فضل شاكر') || lowerQ.includes('فيروز') || lowerQ.includes('وردة') || lowerQ.includes('يا غايب') || lowerQ.includes('طاحون')) {
    return {
      reply: ` **أغاني الطرب في استوديو الغناء**: روائع فضل شاكر (يا غايب، لو على قلبي)، وفيروز (كان عنا طاحون، سهر الليالي)، ووردة (بتونس بيك) مدمجة باللحن والكلمات والكاريوكي لتغنيها بالمايك مباشرة!`,
      suggestedTab: 'vocal-studio',
      suggestedActionText: ' فتح أغاني الطرب في استوديو الغناء',
      quickSteps: [
        'افتح تبويب "استوديو الغناء"',
        'اختر الأغنية الطربية المفضلة من أعلى القائمة',
        'شغل اللحن وابدأ الغناء والتسجيل مع الكلمات المضاءة!'
      ],
      followUpQuestions: ['كيف أضبط مقام الأغنية ومستوى الصوت؟', 'هل يمكنني تحميل تسجيلي الصوتي؟']
    };
  }

  return {
    reply: `أهلاً بك يا صديقي في Yona Songs!  بخصوص استفسارك عن: "${cleanQ}".. أنا رفيقك الذكي ويمكنني إجابتك على أي سؤال حول شارات الأنمي، الغناء، المقامات، أو كيفية استخدام أي قسم بالموقع. يمكنك أيضاً تجربة استوديو الغناء أو خوض المسابقات فوراً!`,
    suggestedTab: 'vocal-studio',
    suggestedActionText: ' بدء التجربة في استوديو الغناء والكاريوكي',
    quickSteps: [
      'اختر التبويب المناسب من الشريط العلوي بالموقع',
      'أو انقر على الزر بالأسفل للانتقال فوراً لاستوديو الكاريوكي والغناء',
      'اطرح عليّ أي سؤال تريده في أي وقت وسأجيبك فوراً!'
    ],
    followUpQuestions: [
      'كيف أسجل صوتي في استوديو الكاريوكي؟',
      'أين أجد مسابقة الأصوات والتصويت؟',
      'أين أجد أغاني فضل شاكر وفيروز؟'
    ]
  };
}



