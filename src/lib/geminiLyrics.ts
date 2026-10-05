import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface YounaSongComposition {
  title: string;
  englishTitle: string;
  topic: string;
  songLanguage: 'ar' | 'en';
  genreStyle: string;
  vocalStyle: string;
  musicalMaqam: string;
  westernScale: string;
  bpm: number;
  rhythmName: string;
  instrumentation: string;
  mood: string;
  studioPrompt: string;
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

// For backward compatibility
export type SunoSongComposition = YounaSongComposition;

export interface ComposeSongParams {
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
}

// دالة تأليف أغنية وشارة متكاملة من الصفر باللحن والكلمات وتفاصيل الإنتاج في استوديو يونا (Studio Youna)
export async function composeFullSongWithYounaStudio(params: ComposeSongParams): Promise<YounaSongComposition> {
  const {
    topic,
    title,
    songLanguage = 'ar',
    style = 'شارة أنمي وسبيستون كلاسيكية ملهمة / أكابيلا أصوات بشرية ناصعة',
    vocalType = 'صوت شجي دافئ وبطولي مع كورس جماعي',
    scale = 'مقام نهاوند (C Minor)',
    bpm = 108,
    mood = 'حماسي، وجداني، نوستالجيا ملهمة',
    customLyrics,
    instrumentalOnly = false
  } = params;

  const isEnglish = songLanguage === 'en';

  const prompt = `You are the master composer and lyricist of Studio Youna (استوديو يونا), specialized in creating original, timeless anime themes, heroic orchestral anthems, and acapella vocal masterworks.
Task: Compose a 100% brand-new, unique song and melody tailored precisely to the user's topic and specifications.

Request Details:
- Topic / Story: "${topic}"
${title ? `- Proposed Title: "${title}"` : ''}
- Song Language: ${isEnglish ? 'English' : 'Arabic (اللغة العربية الفصحى الموزونة)'}
- Musical Style: "${style}"
- Vocal Type: "${vocalType}"
- Musical Maqam / Scale: "${scale}"
- Tempo (BPM): ${bpm}
- Mood & Emotion: "${mood}"
${customLyrics ? `- Starting custom verses from user: "${customLyrics}"` : ''}
${instrumentalOnly ? '- Instrumental Piece only' : `- Full Vocal Song with rhyming lyrics in ${isEnglish ? 'English' : 'Arabic'}`}

Mandatory Rules:
1. Lyrics: ${isEnglish 
    ? 'Write vivid, rhyming, rhythmic English anime theme song lyrics with memorable chorus, heroic verses, and emotional bridge.' 
    : 'اكتب قصيدة غنائية عربية فصحى متكاملة وموزونة بقوافٍ ثنائية أو رباعية متناسقة وغير مكررة.'}
2. Structure Tags: Divide the lyrics with professional Studio tags:
[Intro]
[Verse 1]
[Pre-Chorus]
[Chorus]
[Verse 2]
[Bridge]
[Chorus]
[Outro]
[End]
3. Production Breakdown (ماذا استُخدم لإنتاج هذه الأغنية بالكامل): Explain exactly the poetic meter/rhyme scheme, musical maqam/scale, chord progression, and instrumentation/vocal arrangement.
4. Output valid JSON matching this schema:
{
  "title": "${isEnglish ? 'Eng Title' : 'العنوان بالعربية'}",
  "englishTitle": "English Title",
  "topic": "${topic.replace(/"/g, "'")}",
  "songLanguage": "${songLanguage}",
  "genreStyle": "${style}",
  "vocalStyle": "${vocalType}",
  "musicalMaqam": "${scale}",
  "westernScale": "Equivalent Western Scale like C Minor or D Minor",
  "bpm": ${bpm},
  "rhythmName": "Rhythm Name and Meter (e.g. Maqsum 4/4 or 6/8)",
  "instrumentation": "Vocal harmonies, choir, and instruments used",
  "mood": "${mood}",
  "studioPrompt": "Studio Youna Master Prompt: Spacetoon anime theme song about ${topic.replace(/"/g, '')}, heroic vocals, ${scale}, ${bpm} BPM, emotional orchestra",
  "lyrics": "[Intro]\\n...\\n[Verse 1]\\n...\\n[Pre-Chorus]\\n...\\n[Chorus]\\n...\\n[Verse 2]\\n...\\n[Bridge]\\n...\\n[Chorus]\\n...\\n[Outro]\\n...\\n[End]",
  "productionBreakdown": {
    "poeticMeterAndRhyme": "${isEnglish ? 'Iambic meter with AABB/ABAB rhyme scheme' : 'تفصيل البحر الشعري والقوافي'}",
    "maqamAnalysis": "Scale/Maqam analysis and emotive transitions",
    "harmonicStructure": "Harmonic chords progression (e.g. Cm -> Fm -> Bb -> Eb -> Ab -> G7 -> Cm)",
    "arrangementUsed": "Vocal choir arrangement and instruments used"
  },
  "melodyGuide": {
    "keyNotes": "Key melody notes sequence",
    "vocalRange": "Recommended vocal range (e.g. C4 - G5)",
    "chorusPeak": "Peak note in chorus",
    "chords": ["Cm", "Fm", "Bb", "Eb", "Ab", "G7", "Cm"],
    "performanceNotes": "Vocalist interpretation and emotional guidelines"
  },
  "audioMelodySequence": [
    {"note": "C4", "freq": 261.63, "duration": 0.5},
    {"note": "Eb4", "freq": 311.13, "duration": 0.5},
    {"note": "G4", "freq": 392.00, "duration": 0.75},
    {"note": "F4", "freq": 349.23, "duration": 0.5},
    {"note": "Eb4", "freq": 311.13, "duration": 0.5},
    {"note": "D4", "freq": 293.66, "duration": 0.5},
    {"note": "C4", "freq": 261.63, "duration": 1.0}
  ],
  "singingTips": [
    "Singing tip 1",
    "Singing tip 2",
    "Singing tip 3"
  ]
}`;

  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.6-flash', 'gemini-3.8-flash', 'gemini-3.5-flash'];

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.92,
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      if (parsed && parsed.title && parsed.lyrics) {
        if (!parsed.productionBreakdown) {
          parsed.productionBreakdown = {
            poeticMeterAndRhyme: isEnglish ? 'AABB Rhyme Scheme with melodic cadence' : 'بحر الخبب المتدارك بنظام قوافي ثنائية متناسقة',
            maqamAnalysis: `${scale} مع ارتكاز على درجة الأساس والتحليق نحو الجواب`,
            harmonicStructure: 'تدرج هارموني متوازن (Cm -> Fm -> Bb -> Eb -> G7 -> Cm)',
            arrangementUsed: 'أصوات بشرية أكابيلا ناصعة، بيانو شجي، وكورس كورال ملهم'
          };
        }
        if (!parsed.studioPrompt) {
          parsed.studioPrompt = parsed.sunoPrompt || `Studio Youna: Theme of ${parsed.title}, ${scale}, ${bpm} BPM`;
        }
        return parsed as YounaSongComposition;
      }
    } catch (modelErr) {
      console.warn(`Model ${modelName} failed for Studio Youna composer, trying next:`, modelErr);
    }
  }

  return generateFallbackYounaComposition(params);
}

// Backward compatibility alias
export const composeFullSongWithSunoFormat = composeFullSongWithYounaStudio;

export function generateFallbackYounaComposition(params: ComposeSongParams): YounaSongComposition {
  const words = (params.topic || '').split(/\s+/).filter(w => w.length > 2);
  const mainTopic = params.topic?.trim() || 'الأمل والمستقبل';
  const keyword1 = words[0] || 'الأمل';
  const keyword2 = words[1] || 'النجوم';
  const songTitle = params.title || (params.songLanguage === 'en' ? `Wings of ${keyword1}` : `ملحمة ${keyword1} و${keyword2}`);
  const selectedMaqam = params.scale || 'مقام نهاوند (C Minor)';
  const selectedStyle = params.style || 'شارة سبيستون كلاسيكية / أكابيلا أصوات بشرية ناصعة';
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
    englishTitle: `Theme of ${keyword1} (Studio Youna Master)`,
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
(صوت كورال قوي مفعم بالطاقة والبهجة)
حلّق في الأعالي.. وتحدَّ المستحيل!
صوتُ ${keyword1} ينادي.. في دربنا الجميل!
معاً يداً بيد.. سنصنعُ الغدَ الأكيد
نكتبُ قصةَ ${keyword2} بنبضٍ جديد!

[Verse 2]
مهما استطالَ الدربُ وامتدَّ المدى
يبقى الوفاءُ بقلبنا أحلى ندى
نصنعُ مجداً لا يزولُ مع الزمان
ونظلُّ دوماً للعلى في كل آن!

[Bridge]
(هدوء شجي مع صولو بيانو ثم تصاعد كورس جماعي ملحمي)
مهما اشتدت الرياح.. نحنُ لها صامدون
إلى شمسِ النجاح.. دوماً ماضون!

[Chorus]
حلّق في الأعالي.. وتحدَّ المستحيل!
صوتُ ${keyword1} ينادي.. في دربنا الجميل!
معاً يداً بيد.. سنصنعُ الغدَ الأكيد
نكتبُ قصةَ ${keyword2} بنبضٍ جديد!

[Outro]
(همهمات دافئة تتلاشى بنعومة ورجاء)
سنظلُّ معاً.. أصدقاءَ النور...
دائماً وأبداً...
[Fade Out]
[End]`,
    productionBreakdown: {
      poeticMeterAndRhyme: `بحر الخبب المتدارك (فَعِلُنْ فَعِلُنْ) مع قوافي رائية وميمية متناسقة مستوحاة من مفردات (${keyword1} و${keyword2})`,
      maqamAnalysis: `${selectedMaqam} - الارتكاز على درجة الأساس (الدو) مع قفزات شجية إلى المي بيمول والصول، وتحويل عابر لكورد الري`,
      harmonicStructure: 'تدرج كوردات شارات سبيستون الكلاسيكية: (Cm -> Fm -> Bb -> Eb -> Ab -> G7 -> Cm)',
      arrangementUsed: 'هارموني صوتي كورالي متعدد الطبقات (SATB) مع خلفية بيانو وأصوات بشرية أكابيلا وتوزيع ستيريو متسع'
    },
    melodyGuide: {
      keyNotes: 'C4 -> Eb4 -> G4 -> F4 -> Eb4 -> D4 -> C4',
      vocalRange: 'C4 إلى G5 (طبقة مريحة مع تصاعد حماسي في اللازمة)',
      chorusPeak: 'قمة النغمة في اللازمة عند G5 مع نبرة عالية وصوت صدري دافئ',
      chords: ['Cm', 'Fm', 'Bb', 'Eb', 'Ab', 'G7', 'Cm'],
      performanceNotes: 'ابدأ المطلع بهدوء وهمس شعوري، ثم تصاعد مع دخول اللازمة باندفاع صوتي قوي وواضح الحروف.'
    },
    audioMelodySequence: [
      { note: 'C4', freq: 261.63, duration: 0.5 },
      { note: 'Eb4', freq: 311.13, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.75 },
      { note: 'F4', freq: 349.23, duration: 0.5 },
      { note: 'Eb4', freq: 311.13, duration: 0.5 },
      { note: 'D4', freq: 293.66, duration: 0.5 },
      { note: 'C4', freq: 261.63, duration: 0.8 },
      { note: 'F4', freq: 349.23, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'Bb4', freq: 466.16, duration: 0.75 },
      { note: 'Ab4', freq: 415.30, duration: 0.5 },
      { note: 'G4', freq: 392.00, duration: 0.5 },
      { note: 'F4', freq: 349.23, duration: 0.5 },
      { note: 'Eb4', freq: 311.13, duration: 0.5 },
      { note: 'D4', freq: 293.66, duration: 0.5 },
      { note: 'C4', freq: 261.63, duration: 1.2 }
    ],
    singingTips: [
      'التنفس من الحجاب الحاجز قبل جملة اللازمة الطويلة.',
      'التركيز على مخارج الحروف العربية وضبط القوافي.',
      'التنقل السلس بين القرار في المقطع الأول والجواب في الكورس.'
    ]
  };
}

// وظيفة تأليف كلمات الأغاني للتوافق
export async function generateSongLyrics(prompt: string, style?: string, scale?: string): Promise<string> {
  const result = await composeFullSongWithYounaStudio({
    topic: prompt,
    style,
    scale
  });
  return result.lyrics;
}
