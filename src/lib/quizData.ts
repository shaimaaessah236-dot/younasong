import { QuizQuestion, QuizQuestionType, SpacetoonCharacterMascot } from '../types';

export interface QuizCategoryOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const QUIZ_CATEGORIES: QuizCategoryOption[] = [
  {
    id: 'all',
    name: 'تحدي شامل ومتنوع (Mix)',
    icon: '',
    description: 'مزيج عشوائي متجدد من ألحان الشارات، إكمال الكلمات، وأسرار فناني سبيستون.'
  },
  {
    id: 'audio_snippet',
    name: 'تحدي الألحان المسجلة (Acoustic Blind)',
    icon: '',
    description: 'استمع للحن بيانو أو جيتار حقيقي مسجل بدون غناء، ويتوقف عند موضع السؤال!'
  },
  {
    id: 'lyrics_riddle',
    name: 'تحدي الكلمات والشعر الأصلي',
    icon: '',
    description: 'أكمل بيوت الشعر الناقصة بكلماتها الأصلية الصحيحة والدقيقة 100%.'
  },
  {
    id: 'artist_trivia',
    name: 'تحدي عمالقة الفن وسبيستون',
    icon: '',
    description: 'أسئلة حول رشا رزق، طارق العربي طرقان، عاصم سكر، والملحنين الكبار.'
  },
  {
    id: 'anime_lore',
    name: 'تحدي كواكب سبيستون والذكريات',
    icon: '',
    description: 'ألغاز مشوقة عن شخصيات سبيستون، أسرار الحلقات، ومعاني الصداقة والبطولة.'
  }
];

// Web Audio FX Engine for Clicks, Correct/Wrong Chimes, and Fanfare
class QuizSoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  play(type: 'correct' | 'wrong' | 'win' | 'click' | 'countdown' | 'reveal') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'click') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'correct') {
        // Melodic celebratory arpeggio: C5 -> E5 -> G5 -> C6
        const freqs = [523.25, 659.25, 783.99, 1046.5];
        freqs.forEach((freq, idx) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.35);
        });
      } else if (type === 'wrong') {
        // Low dissonance buzzer
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'win') {
        // Trumpet victory chord
        const chordNotes = [523.25, 659.25, 783.99, 1046.5];
        chordNotes.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 1.2);
        });
      } else if (type === 'countdown') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (_e) {
      // Audio autoplay gracefully handled
    }
  }
}

export const quizSoundEngine = new QuizSoundEngine();

// =========================================================================
//  SPACETOON CHARACTER MASCOTS WITH LIVELY MOTIVATIONAL PHRASES
// =========================================================================
export const SPACETOON_MASCOTS: SpacetoonCharacterMascot[] = [
  {
    name: 'المحقق كونان',
    series: 'المحقق كونان',
    planet: 'كوكب أكشن',
    planetColor: 'from-rose-500 to-amber-500',
    avatarEmoji: '',
    encouragement: 'حظاً طيباً يا بطل سبيستون! ركز جيداً.. الحقيقة دائماً واحدة! ',
    lowTimeAlert: 'انتبه للوقت يا صديقي! الثواني تمر كسباق التحقيق.. اختر إجابتك الآن! ',
    successCheer: 'استنتاج عبقري وفي محله تماماً! أحسنت يا ذكي! ',
    wrongCheer: 'لا بأس يا مقدام، المحقق البارع يتعلم من كل قرينة! ركز في السؤال التالي '
  },
  {
    name: 'غون فريكس',
    series: 'القناص',
    planet: 'كوكب مغامرات',
    planetColor: 'from-emerald-500 to-teal-400',
    avatarEmoji: '',
    encouragement: 'بالعزم انتفضت يمناه! حظاً طيباً يا صديقي، ثق بإحساسك وانطلق! ',
    lowTimeAlert: 'الوقت يقترب من النهاية! أطلق ضربتك فوراً ولا تتردد! ',
    successCheer: 'يا له من صيد رائع! إجابة صحيحة تثبت أنك صياد سبيستوني محترف! ',
    wrongCheer: 'لا تفقد الأمل أبداً، المغامرة مستمرة والعزيمة تصنع المستحيل! '
  },
  {
    name: 'روميو',
    series: 'عهد الأصدقاء',
    planet: 'كوكب مغامرات',
    planetColor: 'from-sky-500 to-blue-600',
    avatarEmoji: '',
    encouragement: 'حلمنا نهار ونهارنا عمل! الأمل يضيء طريقنا، حظاً موفقاً يا أخي! ',
    lowTimeAlert: 'انتبه للوقت يا رفيقي، الدقائق كريح ميلانو العابرة! ',
    successCheer: 'عهد الأصدقاء لا يخيب أبداً! إجابة صحيحة ومؤثرة جداً! ',
    wrongCheer: 'سنظل أصدقاء ونتجاوز الصعاب معاً، القادم أفضل بإذن الله! '
  },
  {
    name: 'ريمي',
    series: 'دروب ريمي',
    planet: 'كوكب زمردة',
    planetColor: 'from-pink-500 to-rose-400',
    avatarEmoji: '',
    encouragement: 'بصوت القلب والأمل نصل دائماً! حظاً طيباً وركز في النغمات العذبة ',
    lowTimeAlert: 'انتبهي للوقت يا وردة سبيستون، خذي نفساً عميقاً وأجيبي بسرعة! ',
    successCheer: 'أمي كم أهواها.. إجابة عذبة ملأت قلوبنا بهجة ونوراً! ',
    wrongCheer: 'امسحي دمعتك وتابعي المسير، النصر حليفك في الأسئلة القادمة! '
  },
  {
    name: 'كابتن ماجد',
    series: 'كابتن ماجد',
    planet: 'كوكب رياضة',
    planetColor: 'from-amber-400 to-orange-500',
    avatarEmoji: '',
    encouragement: 'الوقت كالدقائق الأخيرة في الشوط الثاني! سدد إجابتك بقوة وثقة! ',
    lowTimeAlert: 'صافرة الحكم تقترب! صوب نحو المرمى قبل فوات الأوان! ',
    successCheer: 'جووووول أسطوري في المقص الأيمن! إجابة مذهلة يا كابتن! ',
    wrongCheer: 'الكرة ما زالت في الملعب! ركز في الهجمة القادمة وسنسجل بالتأكيد! '
  },
  {
    name: 'سالي',
    series: 'سالي',
    planet: 'كوكب زمردة',
    planetColor: 'from-violet-500 to-fuchsia-400',
    avatarEmoji: '',
    encouragement: 'أنا سالي.. أعيش في حنين لوقع المطر! حظاً طيباً وأتمنى لك أعلى الدرجات ',
    lowTimeAlert: 'انتبه للوقت يا طيب القلب، لا تدع عقارب الساعة تفاجئك! ',
    successCheer: 'كرم الأخلاق والذكاء ينتصران دائماً! إجابة ممتازة وراقية! ',
    wrongCheer: 'الصبر مفتاح الفرج، لا تيأس وثق بأن القادم أجمل بكثير! '
  },
  {
    name: 'ماوكلي',
    series: 'ماوكلي فتى الأدغال',
    planet: 'كوكب مغامرات',
    planetColor: 'from-lime-500 to-emerald-600',
    avatarEmoji: '',
    encouragement: 'قانون الغابة يقول: إخلاصٌ حبٌ وتفان! حظاً طيباً يا بطل الطبيعة ',
    lowTimeAlert: 'النمر شريخان يقترب! انتبه للوقت وأجب بسرعة البرق! ',
    successCheer: 'زئير الانتصار يتردد في كل الأدغال! أحسنت صنعاً يا ماوكلي! ',
    wrongCheer: 'الدب بالو يخبرك: تعلم من أخطائك فالحياة درس مستمر! '
  },
  {
    name: 'سون غوكو',
    series: 'دراجون بول',
    planet: 'كوكب أكشن',
    planetColor: 'from-orange-500 to-red-600',
    avatarEmoji: '',
    encouragement: 'أطلق طاقتك القصوى كالسوبر سايان! علّمهم كيف الأفكار تبني صرحاً من أنوار! ',
    lowTimeAlert: 'طاقتك توشك على النفاد! أطلق الكامي هامي ها الآن! ',
    successCheer: 'قوة هائلة لا تصد! إجابة مدمرة وصحيحة 100%! ',
    wrongCheer: 'انهض يا مقاتل! محاربو السايان يزدادون قوة بعد كل تحدٍ! '
  },
  {
    name: 'هزيم الرعد',
    series: 'هزيم الرعد',
    planet: 'كوكب أكشن',
    planetColor: 'from-indigo-600 to-purple-600',
    avatarEmoji: '',
    encouragement: 'في قبضتك المجد.. ومداك الصدق ومرمى عينيك! كن حاسماً كالسيف ولا تتردد! ',
    lowTimeAlert: 'معركة المجرة لا تنتظر! انتبه للوقت وأصدر قرارك الحاسم! ',
    successCheer: 'ما عاش الظالم يسبيك! نصرٌ مؤزر وإجابة تاريخية يا هزيم! ',
    wrongCheer: 'الفارس الصنديد لا يهاب الكبوات.. استل سيفك وركز في القادم! '
  },
  {
    name: 'أمجد (تايتشي)',
    series: 'أبطال الديجيتال',
    planet: 'كوكب مغامرات',
    planetColor: 'from-amber-500 to-blue-500',
    avatarEmoji: '',
    encouragement: 'قلادة الشجاعة تضيء طريقنا في عالم الأرقام! حظاً طيباً يا بطل الديجيتال ',
    lowTimeAlert: 'البوابة الرقمية توشك على الإغلاق! انتبه للثواني الأخيرة! ',
    successCheer: 'تطور رقمي خارق! أصبت الهدف بدقة منقطعة النظير! ',
    wrongCheer: 'العمل معاً هو سر النجاة! اتحد مع السؤال القادم وستفوز! '
  }
];

// Helper: Shuffles an array randomly (Fisher-Yates)
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// =========================================================================
//  STAGE 1 DEDICATED POOL: شارات البداية والذكريات السبيستونية (18 أسئلة حصرية)
// شرط التأهل: 70% للمرور للمرحلة الثانية
// =========================================================================
export const STAGE_1_QUESTIONS: QuizQuestion[] = [
  {
    id: 's1-q1',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'ana-wa-akhi',
    melodyPresetId: 'ana-wa-akhi',
    questionText: 'استمع لعزف البيانو الأكوستيك المسجل لبداية هذه الشارة الدافئة.. ما اسم هذه الشارة النوستالجية؟',
    options: ['أنا وأخي', 'ريمي', 'سالي', 'عهد الأصدقاء'],
    correctIndex: 0,
    hint: 'شارة مؤثرة تروي قصة وسام ورعاية شقيقه الأكبر له بعد رحيل الأم.',
    songTitle: 'أنا وأخي',
    animeTitle: 'أنا وأخي',
    explanation: 'شارة "أنا وأخي" الخالدة من غناء السوبرانو رشا رزق، وتعد أيقونة المشاعر الصادقة في سبيستون.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's1-q2',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'conan-detective',
    melodyPresetId: 'conan-detective',
    questionText: 'استمع للحن البيانو والغموض البوليسي المسجل.. لأي محقق فذ ينتمي هذا اللحن المشوق؟',
    options: ['المحقق كونان', 'كايتو كيد', 'بلاك كات', 'المتحري الذكي'],
    correctIndex: 0,
    hint: 'عبارته الشهيرة: "الحقيقة دائماً واحدة!".',
    songTitle: 'المحقق كونان',
    animeTitle: 'المحقق كونان',
    explanation: 'شارة "المحقق كونان" من ألحان وغناء طارق العربي طرقان وعُرضت على كوكب زمردة وأكشن.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's1-q3',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'romeo-blue-skies',
    melodyPresetId: 'romeo-blue-skies',
    questionText: 'استمع للحن الجيتار الدافئ الذي يجسد أسمى معاني الوفاء.. ما اسم هذه الشارة؟',
    options: ['عهد الأصدقاء', 'طريق السلام', 'صاحب الظل الطويل', 'لحن الحياة'],
    correctIndex: 0,
    hint: 'قصة الصداقة الخالدة بين روميو وألفريدو ومنظفي المداخن في سماء ميلانو.',
    songTitle: 'عهد الأصدقاء',
    animeTitle: 'عهد الأصدقاء',
    explanation: 'شارة "عهد الأصدقاء" من غناء رشا رزق وألحان طارق العربي طرقان، رمز الصداقة الخالدة.',
    characterMascot: SPACETOON_MASCOTS[2]
  },
  {
    id: 's1-q4',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'captain-majed',
    melodyPresetId: 'captain-majed',
    questionText: 'استمع للحن البيانو الرياضي الحماسي المسجل.. شارة أي أسطورة كرة قدم هذه؟',
    options: ['الكابتن ماجد', 'كابتن رابح', 'شوت', 'أوفسايد'],
    correctIndex: 0,
    hint: 'فتى حلمه مع الكرة، يتدرب مع فريقه المجد ومدربه فواز.',
    songTitle: 'الكابتن ماجد',
    animeTitle: 'الكابتن ماجد (كوكب رياضة)',
    explanation: 'شارة "الكابتن ماجد" بصوت عمار الشريعي والنسخ السبيستونية الأيقونية على كوكب رياضة.',
    characterMascot: SPACETOON_MASCOTS[4]
  },
  {
    id: 's1-q5',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'mowgli-jungle-book',
    melodyPresetId: 'mowgli-jungle-book',
    questionText: 'استمع للحن الجيتار النوستالجي المسجل الذي يجسد نداء الطبيعة.. شارة أي عمل كلاسيكي هذه؟',
    options: ['ماوكلي فتى الأدغال', 'سيمبا', 'فليبر ولوبكا', 'سندباد'],
    correctIndex: 0,
    hint: 'فتى ربته الذئاب في أحضان الغابة وعاش مع الدب بالو والنمر باغيلا.',
    songTitle: 'ماوكلي',
    animeTitle: 'ماوكلي فتى الأدغال',
    explanation: 'شارة "ماوكلي" من ألحان وأداء طارق العربي طرقان، وتتميز بكلماتها الفلسفية عن حب الغابة.',
    characterMascot: SPACETOON_MASCOTS[6]
  },
  {
    id: 's1-q6',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'remi-mother',
    melodyPresetId: 'remi-mother',
    questionText: 'استمع للحن البيانو الحنون والباكي المسجل.. ما اسم نشيد الأم الخالد هذا؟',
    options: ['أمي كم أهواها (دروب ريمي)', 'ماروكو الصغيرة', 'سالي', 'هايدي'],
    correctIndex: 0,
    hint: '"أنتِ الأمان.. أنتِ الحنان.. من تحت قدميكِ لنا الجنان".',
    songTitle: 'أمي كم أهواها',
    animeTitle: 'دروب ريمي',
    explanation: 'أغنية "أمي كم أهواها" شارة النهاية لأنمي دروب ريمي بصوت رشا رزق، وتعد من أعظم أناشيد الأم.',
    characterMascot: SPACETOON_MASCOTS[3]
  },
  {
    id: 's1-q7',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "سالي" على كوكب زمردة، أكمل البيت الأصلي: "أنا سالي سالي.. أعيش في حنين.. لوقع (...) لضوء القمر.. ورسم يطير حراً في الفضاء"؟',
    options: ['المطر', 'الشجر', 'البشر', 'الوتر'],
    correctIndex: 0,
    hint: 'قطرات السماء العذبة التي كانت ترقبها سالي من نافذة عليتها البسيطة.',
    songTitle: 'سالي',
    animeTitle: 'سالي (كوكب زمردة)',
    explanation: 'الكلمات الأصلية: "أنا سالي سالي.. أعيش في حنين.. لوقع المطر.. لضوء القمر.. ورسم يطير حراً في الفضاء".',
    characterMascot: SPACETOON_MASCOTS[5]
  },
  {
    id: 's1-q8',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'secret-garden',
    melodyPresetId: 'secret-garden',
    questionText: 'استمع لعزف صندوق الموسيقى الرقيق المسجل.. ما اسم هذه الشارة الهادئة عن الزهور والربيع؟',
    options: ['الحديقة السرية', 'فلونة', 'ساندي بيل', 'ليدي ليدي'],
    correctIndex: 0,
    hint: '"في يدنا أزهار.. وفي قلوبنا أنهار.. تصب في حديقة.. مخفية الأسرار".',
    songTitle: 'الحديقة السرية',
    animeTitle: 'الحديقة السرية',
    explanation: 'شارة "الحديقة السرية" من أداء الفنانة رشا رزق على كوكب زمردة، وتعبر عن شفاء القلوب بالطبيعة.',
    characterMascot: SPACETOON_MASCOTS[5]
  },
  {
    id: 's1-q9',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "أنا وأخي"، أكمل الشطر الشهير: "شوقٌ يدفعني لأراها.. أمي ذكرى لا أنساها.. طيفٌ أنقى من (...) يرسم بسمته أمامي"؟',
    options: ['زبد الأيام', 'ضوء القمر', 'ماء المطر', 'نسيم الصباح'],
    correctIndex: 0,
    hint: 'تشبيه بلاغي نادر مستوحى من نقاء وبياض موج البحر.',
    songTitle: 'أنا وأخي',
    animeTitle: 'أنا وأخي',
    explanation: 'الكلمات الأصلية: "طيفٌ أنقى من زبد الأيام.. يرسم بسمته أمامي.. يمسح جرحي وينير ظلامي".',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's1-q10',
    questionType: 'anime_lore',
    questionText: 'إلى أي كوكب من كواكب سبيستون الشهيرة تنتمي برامج وأنميات الفتيات والبطولات الهادئة مثل "سالي" و"ريمي"؟',
    options: ['كوكب زمردة', 'كوكب أكشن', 'كوكب رياضة', 'كوكب مغامرات'],
    correctIndex: 0,
    hint: 'شعار الكوكب باللون الوردي والأرجواني، ويُعرف بـ "كوكب للبنات فقط".',
    songTitle: 'كواكب سبيستون',
    animeTitle: 'كوكب زمردة',
    explanation: 'كوكب زمردة هو كوكب الفتيات المحبوب على سبيستون، وعُرضت عليه روائع سالي وريمي ولحن الحياة والحديقة السرية.',
    characterMascot: SPACETOON_MASCOTS[3]
  },
  {
    id: 's1-q11',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "المحقق كونان"، أكمل البيت: "يكتشف الغامض والمثير.. يستنتج بالعقل الكبير.. كونان الرجل الصغير.. يسعى دائماً.. لا يخشى (...)؟"',
    options: ['المحن', 'الظلام', 'الخطر', 'الشرور'],
    correctIndex: 0,
    hint: 'الشدائد والابتلاءات الصعبة التي يصمد أمامها كونان.',
    songTitle: 'المحقق كونان',
    animeTitle: 'المحقق كونان',
    explanation: 'الكلمات الأصلية: "كونان الرجل الصغير يسعى دائماً.. لا يخشى المحن.. يكتشف الغامض والمثير.. يستنتج بالعقل الكبير".',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's1-q12',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'babar-elephant',
    melodyPresetId: 'babar-elephant',
    questionText: 'استمع للحن صندوق الموسيقى الطفولي اللطيف المسجل.. شارة أي فيل ملكي محب للسلام هذه؟',
    options: ['بابار الفيل', 'دبدوب المقالب', 'بينكي وبرين', 'سنوبي'],
    correctIndex: 0,
    hint: 'فيل طيب يرتدي بدلة خضراء وتاجاً ذهبياً ويعلم الصغار المحبة والتعاون.',
    songTitle: 'بابار الفيل',
    animeTitle: 'بابار (كوكب بون بون)',
    explanation: 'شارة "بابار" أداء طارق العربي طرقان وعُرضت على كوكب بون بون للأطفال الصغار.',
    characterMascot: SPACETOON_MASCOTS[6]
  },
  {
    id: 's1-q13',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "عهد الأصدقاء"، ما هي الكلمة الأصلية في البيت: "حلمنا نهار.. نهارنا (...).. نملك الخيار وخيارنا الأمل"؟',
    options: ['عمل', 'أمل', 'سلام', 'كفاح'],
    correctIndex: 0,
    hint: 'ترمز إلى الجد والاجتهاد اليومي لمنظفي المداخن.',
    songTitle: 'عهد الأصدقاء',
    animeTitle: 'عهد الأصدقاء',
    explanation: 'الكلمات الأصلية: "حلمنا نهار.. نهارنا عمل.. نملك الخيار وخيارنا الأمل.. وتهدينا الحياة أضواءً في آخر النفق".',
    characterMascot: SPACETOON_MASCOTS[2]
  },
  {
    id: 's1-q14',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "ماوكلي"، ما هي القيم الثلاث الأصلية المكملة للبيت: "في الغابة قانون يسري في كل مكان.. قانون أهمله البشر ونسوه الآن.. (...)؟"',
    options: [
      'إخلاصٌ حبٌ وتفان',
      'عدلٌ أمنٌ وأمان',
      'صبرٌ عزمٌ وعنفوان',
      'شوقٌ عطفٌ وحنان'
    ],
    correctIndex: 0,
    hint: 'ثلاث قيم إنسانية راقية تبدأ بكلمة الإخلاص.',
    songTitle: 'ماوكلي',
    animeTitle: 'ماوكلي فتى الأدغال',
    explanation: 'الكلمات الأصلية: "في الغابة قانون يسري في كل مكان.. قانون أهمله البشر ونسوه الآن.. إخلاصٌ حبٌ وتفان".',
    characterMascot: SPACETOON_MASCOTS[6]
  },
  {
    id: 's1-q15',
    questionType: 'anime_lore',
    questionText: 'في أنمي "دروب ريمي"، ما هو اسم الكلب الوفي الذكي الأكبر الذي يرتدي قبعة ويقود فرقة حيوانات العم فيتالس؟',
    options: ['كابي (Capi)', 'زيربينو', 'دولتشي', 'جويلكور'],
    correctIndex: 0,
    hint: 'كلب حكيم وشجاع قاد ريمي وحماها في الثلوج والبرد القارس.',
    songTitle: 'دروب ريمي',
    animeTitle: 'دروب ريمي',
    explanation: 'الكلب "كابي" هو قائد فرقة العم فيتالس والرفيق الأكثر وفاءً وتضحية لريمي طوال مسيرتها.',
    characterMascot: SPACETOON_MASCOTS[3]
  },
  {
    id: 's1-q16',
    questionType: 'anime_lore',
    questionText: 'في رائعة "عهد الأصدقاء"، ما هو اسم التحالف الأخوي الذي أسسه روميو وألفريدو لحماية رفاقهم في ميلانو؟',
    options: ['منظفو المداخن', 'فرسان السماء', 'الذئاب البيضاء', 'أصدقاء الغد'],
    correctIndex: 0,
    hint: 'المهنة الشاقة التي كانوا يعملون بها في تنظيف مداخن البيوت وسط الدخان الأسود.',
    songTitle: 'عهد الأصدقاء',
    animeTitle: 'عهد الأصدقاء',
    explanation: 'أسس ألفريدو وروميو تحالف "منظفي المداخن" للدفاع عن الأطفال ومواجهة عصابة الذئاب.',
    characterMascot: SPACETOON_MASCOTS[2]
  },
  {
    id: 's1-q17',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "الكابتن ماجد (الجزء الثاني)"، أكمل الشطر الحماسي: "سجل أهدافاً لا تيأس.. لا ترضى بغير (...) كابتن ماجد نجم الملعب"؟',
    options: ['الفوز', 'النصر', 'المجد', 'الكأس'],
    correctIndex: 0,
    hint: 'الانتصار وتحقيق الغلبة في المباراة.',
    songTitle: 'الكابتن ماجد',
    animeTitle: 'الكابتن ماجد',
    explanation: 'الكلمات الأصلية: "سجل أهدافاً لا تيأس.. لا ترضى بغير الفوز.. كابتن ماجد نجم الملعب.. كابتن ماجد هداف ماهر".',
    characterMascot: SPACETOON_MASCOTS[4]
  },
  {
    id: 's1-q18',
    questionType: 'anime_lore',
    questionText: 'ما هو الاسم الرمزي للدمية المفضلة والوحيدة التي بقيت تؤنس سالي في غرفة العلية بعد فقدان والدها وثروتها؟',
    options: ['إيميلي (Emily)', 'لورا', 'كاتي', 'بياتريس'],
    correctIndex: 0,
    hint: 'دمية جميلة أهداها إياها والدها كابتن كرو في عيد ميلادها الأخير.',
    songTitle: 'سالي',
    animeTitle: 'سالي',
    explanation: 'الدمية "إيميلي" كانت رمز الأمل والوفاء لسالي ورفيقتها الصامتة طوال فترة قسوة الآنسة منشن.',
    characterMascot: SPACETOON_MASCOTS[5]
  }
];

// =========================================================================
//  STAGE 2 DEDICATED POOL: تحدي الكلمات والألحان وكواكب سبيستون (18 أسئلة حصرية)
// شرط الفوز والتأهل: 71% (واحد وسبعون بالمئة) للمرور للمرحلة النهائية
// =========================================================================
export const STAGE_2_QUESTIONS: QuizQuestion[] = [
  {
    id: 's2-q1',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'hunter-qannas',
    melodyPresetId: 'hunter-qannas',
    questionText: 'استمع لنغمات الجيتار الحماسية المسجلة.. شارة أي أنمي شهير هذه قبل أن يبدأ الغناء؟',
    options: ['القناص', 'المحقق كونان', 'دراجون بول', 'هزيم الرعد'],
    correctIndex: 0,
    hint: 'شارة أسطورية تبدأ كلماتها بـ "قد لمعت عيناه.. بالعزم انتفضت يمناه".',
    songTitle: 'القناص',
    animeTitle: 'القناص (Hunter x Hunter)',
    explanation: 'شارة "القناص" من ألحان وغناء طارق العربي طرقان بالاشتراك مع رشا رزق، وتعد أيقونة الحماس.',
    characterMascot: SPACETOON_MASCOTS[1]
  },
  {
    id: 's2-q2',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'dragon-ball',
    melodyPresetId: 'dragon-ball',
    questionText: 'استمع للحن البيانو السريع المسجل.. إلى أي أنمي قتالي تنتمي هذه الشارة الملحمية على كوكب أكشن؟',
    options: ['دراجون بول', 'القناص', 'بي بليد', 'سوبر سونيك سبينر'],
    correctIndex: 0,
    hint: 'شارة خالدة تبدأ بـ "ردد للأبطال قصيدة.. علّمهم معنى الإصرار".',
    songTitle: 'دراجون بول',
    animeTitle: 'دراجون بول (كوكب أكشن)',
    explanation: 'شارة دراجون بول غناء الفنان زياد الرفاعي وتعد من أقوى شارات الإصرار والبطولة.',
    characterMascot: SPACETOON_MASCOTS[7]
  },
  {
    id: 's2-q3',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'hazim-alraad',
    melodyPresetId: 'hazim-alraad',
    questionText: 'استمع للحن الجيتار القوي والملحمي المسجل.. شارة أي فارس فضاء عربي هذه؟',
    options: ['هزيم الرعد', 'صقور الأرض', 'أجنحة كاندام', 'داي الشجاع'],
    correctIndex: 0,
    hint: '"هزيم الرعد.. ما عاش الظالم يسبيك.. في قبضتك المجد.. ومداك الصدق ومرمى عينيك".',
    songTitle: 'هزيم الرعد',
    animeTitle: 'هزيم الرعد (كوكب أكشن)',
    explanation: 'شارة هزيم الرعد بصوت الفنان القدير عاصم سكر، ملحمة عربية في الفضاء والعدالة والحرية.',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's2-q4',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "القناص"، أكمل البيت الأصلي بدقة: "قد لمعت عيناه.. بالعزم انتفضت يمناه.. في هدوء الليل.. من هو الصامد المغامر في وجه (...)؟"',
    options: ['السيل', 'الريح', 'الموج', 'الليل'],
    correctIndex: 0,
    hint: 'تدفق المياه الجارف والقوي الذي يصمد أمامه البطل غون.',
    songTitle: 'القناص',
    animeTitle: 'القناص (كوكب مغامرات)',
    explanation: 'الكلمات الأصلية: "من هو الصامد المغامر في وجه السيل؟ يبعد عن عينيه أحلاماً.. يبعد عن عينيه النوم.. صامتٌ كالحجر".',
    characterMascot: SPACETOON_MASCOTS[1]
  },
  {
    id: 's2-q5',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "دراجون بول"، أكمل الشطر الأصلي: "ردد للأبطال قصيدة.. علّمهم معنى الإصرار.. علّمهم كيف (...) تبني صرحاً من أنوار"؟',
    options: ['الأفكار', 'الأسرار', 'الأقدار', 'الأنوار'],
    correctIndex: 0,
    hint: 'العقل والتفكير والوعي الذي يبني الحضارات.',
    songTitle: 'دراجون بول',
    animeTitle: 'دراجون بول',
    explanation: 'الكلمات الأصلية: "علّمهم كيف الأفكار.. تبني صرحاً من أنوار.. لا تحيا إلا الأحرار.. في صرح بني بالإصرار".',
    characterMascot: SPACETOON_MASCOTS[7]
  },
  {
    id: 's2-q6',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "هزيم الرعد"، ما هي العبارة الأصلية التي تلي: "هزيم الرعد.. ما عاش الظالم يسبيك.. (...) ومداك الصدق ومرمى عينيك"؟',
    options: [
      'في قبضتك المجد',
      'سيفك للحق فداك',
      'صوتك يعلو في الآفاق',
      'نحن جميعاً نفديك'
    ],
    correctIndex: 0,
    hint: 'تصف الشرف والقوة والسيادة في الفضاء.',
    songTitle: 'هزيم الرعد',
    animeTitle: 'هزيم الرعد',
    explanation: 'الكلمات الأصلية: "هزيم الرعد.. ما عاش الظالم يسبيك.. في قبضتك المجد.. ومداك الصدق ومرمى عينيك".',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's2-q7',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "صانع السلام"، ما هي الكلمة الأصلية في البيت: "لا تبكِ يا صغيري.. لا انظر نحو السماء.. من قلبك الحريري.. لا تقطع (...)؟"',
    options: ['الرجاء', 'البكاء', 'الدعاء', 'النداء'],
    correctIndex: 0,
    hint: 'الأمل والتفاؤل وعدم القنوط.',
    songTitle: 'صانع السلام',
    animeTitle: 'صانع السلام (كوكب مغامرات)',
    explanation: 'الكلمات الأصلية: "لا تبكِ يا صغيري لا انظر نحو السماء.. من قلبك الحريري لا تقطع الرجاء.. إن الأمل جهد عمل والجهد لا يضيع".',
    characterMascot: SPACETOON_MASCOTS[1]
  },
  {
    id: 's2-q8',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "طريق السلام"، أكمل البيت: "خطواتك تدنو تبعدنا.. نبتسم ونخفي (...) نبحث عن أرض نسكنها.. ونسيم يحمل فرحتنا"؟',
    options: ['دمعتنا', 'لهفتنا', 'حيرتنا', 'وحشتنا'],
    correctIndex: 0,
    hint: 'الحزن الدفين والدموع المخبأة خلف الابتسامة المشرقة.',
    songTitle: 'طريق السلام',
    animeTitle: 'طريق السلام',
    explanation: 'الكلمات الأصلية: "خطواتك تدنو تبعدنا.. نبتسم ونخفي دمعتنا.. نبحث عن أرض نسكنها.. ونسيم يحمل فرحتنا".',
    characterMascot: SPACETOON_MASCOTS[2]
  },
  {
    id: 's2-q9',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "صقور الأرض"، ما الهتاف الأصلي الذي يردده الكورال بحماس: "شرف الوطن أغلى منا.. ومن ما قد يجول بفكرنا.. (...)؟"',
    options: [
      'عاش الوطن.. عاش الوطن',
      'في يدنا نحمي الحمى',
      'بأرواحنا نفديك يا وطن',
      'صقور الأرض تحلق في الفضاء'
    ],
    correctIndex: 0,
    hint: 'هتاف وطني جهوري وفدائي بصوت عاصم سكر.',
    songTitle: 'صقور الأرض',
    animeTitle: 'صقور الأرض (كوكب مغامرات)',
    explanation: 'الكلمات الأصلية: "شرف الوطن أغلى منا ومن ما قد يجول بفكرنا.. عاش الوطن.. عاش الوطن.. صقور الأرض لا تهاب المنون".',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's2-q10',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "بي بليد (الجزء الأول)"، أكمل المقطع الحماسي: "في حلبة النزال.. تدور (...) في حلبة النزال.. يشتد المحال"؟',
    options: ['البلابل', 'المعارك', 'الأبطال', 'العجلات'],
    correctIndex: 0,
    hint: 'البلبل الدوار الذي يخوض به منصور ورفاقه البطولات.',
    songTitle: 'بي بليد',
    animeTitle: 'بي بليد (كوكب رياضة)',
    explanation: 'الكلمات الأصلية: "في حلبة النزال.. تدور البلابل.. في حلبة النزال.. يشتد المحال.. والأبطال تسعى للفوز لا تبالي".',
    characterMascot: SPACETOON_MASCOTS[4]
  },
  {
    id: 's2-q11',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "سيمبا الشبل الأسد"، ما هو اللقب الأصلي الذي يُنادى به سيمبا: "سيمبا.. قادم سيمبا.. جاء سيمبا.. (...) يتحدى الأشرار"؟',
    options: ['حامي الغاب', 'ملك الغاب', 'نسر الغاب', 'بطل الغاب'],
    correctIndex: 0,
    hint: 'الدرع الحامي والمدافع عن أمن حيوانات الغابة.',
    songTitle: 'سيمبا',
    animeTitle: 'سيمبا الشبل الأسد',
    explanation: 'الكلمات الأصلية: "سيمبا.. قادم سيمبا.. جاء سيمبا.. حامي الغاب.. يتحدى الأشرار.. في كل مكان".',
    characterMascot: SPACETOON_MASCOTS[6]
  },
  {
    id: 's2-q12',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "داي الشجاع"، أكمل مطلع الشارة: "مرت سنين والأرض في (...) وساد بين الناس الأمان.. إلى أن ظهر الوحش الشرير"؟',
    options: ['سلام', 'وئام', 'أمان', 'سرور'],
    correctIndex: 0,
    hint: 'حالة الطمأنينة وغياب الحروب والصراعات.',
    songTitle: 'داي الشجاع',
    animeTitle: 'داي الشجاع (كوكب مغامرات)',
    explanation: 'الكلمات الأصلية: "مرت سنين والأرض في سلام.. وساد بين الناس الأمان.. إلى أن ظهر الوحش الشرير هادلر".',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's2-q13',
    questionType: 'audio_snippet',
    acousticSnippetKey: 'digimon-heroes',
    melodyPresetId: 'digimon-heroes',
    questionText: 'استمع للحن البيانو الإلكتروني السريع المسجل.. شارة أي أبطال في عالم الأرقام هذه؟',
    options: ['أبطال الديجيتال', 'أجنحة كاندام', 'بي بليد', 'كراش جير'],
    correctIndex: 0,
    hint: '"في فخ غريب وقعنا.. في عالم الأرقام ضِعنا.. كيف الخروج من أين الطريق؟".',
    songTitle: 'أبطال الديجيتال',
    animeTitle: 'أبطال الديجيتال (الجزء 1)',
    explanation: 'شارة "أبطال الديجيتال" من أداء طارق العربي طرقان وسونيا بيطار، علامة فارقة في كوكب مغامرات.',
    characterMascot: SPACETOON_MASCOTS[9]
  },
  {
    id: 's2-q14',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "حكايات ما أحلاها"، أكمل الشطر: "في جعبتي حكاية.. تنبض بالجمال.. تدعو إلى (...) والخير والكمال"؟',
    options: ['التفاؤل', 'التواصل', 'التآخي', 'التسامح'],
    correctIndex: 0,
    hint: 'النظرة الإيجابية والأمل في الحياة والمستقبل.',
    songTitle: 'حكايات ما أحلاها',
    animeTitle: 'حكايات ما أحلاها (كوكب بون بون)',
    explanation: 'الكلمات الأصلية: "في جعبتي حكاية.. تنبض بالجمال.. تدعو إلى التفاؤل.. والخير والكمال".',
    characterMascot: SPACETOON_MASCOTS[5]
  },
  {
    id: 's2-q15',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "فرسان الأرض"، ما هي الكلمة الأصلية في البيت: "مهما طال (...) كبّر.. فغداً يأتي النصر المبين.. فرسان الأرض ترفرف رايتهم"؟',
    options: ['الظلم', 'الليل', 'الوهم', 'القيد'],
    correctIndex: 0,
    hint: 'الجور والعدوان الذي يواجهه فرسان الأرض.',
    songTitle: 'فرسان الأرض',
    animeTitle: 'فرسان الأرض',
    explanation: 'شارة "فرسان الأرض" غناء هالة الصباغ وعاصم سكر على كوكب أكشن.',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's2-q16',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "ساندي بيل"، أكمل البيت الشهير: "ساندي بيل.. ساندي بيل.. أنا اسمي ساندي بيل.. أبحث عن (...) في كل مكان"؟',
    options: ['أمي', 'أبي', 'صديقي', 'أخي'],
    correctIndex: 0,
    hint: 'الأم الحبيبة التي تبحث عنها ساندي بيل بالكاميرا الوفية في ربوع بريطانيا.',
    songTitle: 'ساندي بيل',
    animeTitle: 'ساندي بيل (كوكب زمردة)',
    explanation: 'الكلمات الأصلية: "ساندي بيل ساندي بيل.. أنا اسمي ساندي بيل.. أبحث عن أمي في كل مكان.. ومعي كلبي مارك الوفي".',
    characterMascot: SPACETOON_MASCOTS[5]
  },
  {
    id: 's2-q17',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "أجنحة كاندام"، ما هي العبارة التأسيسية التي تصدح بها الشارة: "نداء للعدالة والحرية.. نداء إلى (...) في كل أرجاء الفضاء"؟',
    options: ['الأبطال', 'الإنسان', 'الشجعان', 'السلام'],
    correctIndex: 0,
    hint: 'الفرسان الشجعان الذين يقودون مركبات الكاندام الفضائية.',
    songTitle: 'أجنحة كاندام',
    animeTitle: 'أجنحة كاندام (كوكب أكشن)',
    explanation: 'شارة "أجنحة كاندام" بصوت زياد الرفاعي ورشا رزق، من أضخم الشارات الملحمية على كوكب أكشن.',
    characterMascot: SPACETOON_MASCOTS[7]
  },
  {
    id: 's2-q18',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "كراش جير"، أكمل البيت الحماسي: "في حلبة السباق نلتقي.. بالعزم والمهارة نرتقي.. سيارتي كراش جير (...) في المنعطفات"؟',
    options: ['تنطلق كالسهم', 'تدور كالإعصار', 'تسير كالنمر', 'تطير في الهواء'],
    correctIndex: 0,
    hint: 'السرعة الفائقة الشبيهة بالسهم المنطلق.',
    songTitle: 'كراش جير',
    animeTitle: 'كراش جير (كوكب رياضة)',
    explanation: 'شارة "كراش جير" من ألحان وغناء طارق العربي طرقان على كوكب رياضة.',
    characterMascot: SPACETOON_MASCOTS[4]
  }
];

// =========================================================================
//  STAGE 3 DEDICATED POOL: امتحان أساطير سبيستون الذهبي (18 أسئلة حصرية)
// شرط النجاح ونيل الشهادة الرسمية: 93% فأكثر
// أسئلة أسطورية دقيقة وتاريخية لعمالقة الفن والملحنين وأندر الأبيات
// =========================================================================
export const STAGE_3_QUESTIONS: QuizQuestion[] = [
  {
    id: 's3-q1',
    questionType: 'artist_trivia',
    questionText: 'من هو الفنان والمؤلف السوري-الجزائري الملقب بـ "أب شارات سبيستون" الذي لحن شارات ماوكلي والقناص وكونان وبابار ورسم هوية القناة الموسيقية؟',
    options: ['طارق العربي طرقان', 'عاصم سكر', 'سامي كلارك', 'مروان خوري'],
    correctIndex: 0,
    hint: 'أستاذ شارات الطفولة ومؤلفها ووالد محمد وديما وتالا.',
    songTitle: 'روائع طارق العربي طرقان',
    animeTitle: 'مؤسسو شارات سبيستون',
    explanation: 'طارق العربي طرقان هو المؤسس الفعلي للهوية الموسيقية لسبيستون منذ تسعينات القرن الماضي بمركز الزهرة بدمشق.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's3-q2',
    questionType: 'artist_trivia',
    questionText: 'السوبرانو السورية العالمية صاحبة الصوت الأوبرالي الأسطوري التي غنت "أنا وأخي"، "دروب ريمي"، "القناص"، و"عهد الأصدقاء" هي:',
    options: ['رشا رزق', 'هالة الصباغ', 'عنان الخياط', 'أمل حويجة'],
    correctIndex: 0,
    hint: 'أستاذة الغناء الأوبرالي بالمعهد العالي للموسيقى بدمشق ونجمة سبيس باور وسبيستون.',
    songTitle: 'رشا رزق',
    animeTitle: 'سيدة الصوت السبيستوني',
    explanation: 'رشا رزق صُنفت من أعظم الأصوات السوبرانو العربية وساهمت في أكثر من 60 شارة كرتون نوستالجية خالدة.',
    characterMascot: SPACETOON_MASCOTS[3]
  },
  {
    id: 's3-q3',
    questionType: 'artist_trivia',
    questionText: 'الفنان صاحب الصوت الباريتوني الفخم والمزلزل الذي غنى شارات الفروسية والملاحم التاريخية "هزيم الرعد" و"صقور الأرض" و"فرسان الأرض" هو:',
    options: ['عاصم سكر', 'طارق العربي طرقان', 'جهاد الأطرش', 'مأمون الرفاعي'],
    correctIndex: 0,
    hint: 'صوت الشهامة والحماس والبطولة الصادقة في مركز الزهرة وسبيستون.',
    songTitle: 'عاصم سكر',
    animeTitle: 'صوت الفروسية',
    explanation: 'الفنان عاصم سكر بصوته الرخيم الصادح طبع مرحلة شارات الأكشن التاريخية بطابع العزة والكرامة.',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's3-q4',
    questionType: 'artist_trivia',
    questionText: 'المطربة السورية التي فازت بالجائزة الذهبية بمهرجان ميلانو للأطفال وغنت شارة "أمي تـشـدو" و"فرسان الأرض" و"حكايات ما أحلاها" هي:',
    options: ['هالة الصباغ', 'رشا رزق', 'سونيا بيطار', 'نور العربي'],
    correctIndex: 0,
    hint: 'غنت "يا أطفال العالم" وتوجت في سن مبكرة جداً بالجائزة الذهبية في إيطاليا.',
    songTitle: 'هالة الصباغ',
    animeTitle: 'أصوات الطفولة الذهبية',
    explanation: 'هالة الصباغ مثلت سوريا في ميلانو وفازت بالجائزة الأولى، وأبدعت في شارات سبيستون في طفولتها وشبابها.',
    characterMascot: SPACETOON_MASCOTS[3]
  },
  {
    id: 's3-q5',
    questionType: 'artist_trivia',
    questionText: 'الفنان الراحل وأحد أعظم فرسان الدوبلاج العربي في مركز الزهرة الذي جسد بصوته "هزيم الرعد"، "ترين هارتنت (بلاك كات)"، وغنى شارة "دراجون بول" هو:',
    options: ['زياد الرفاعي رحمه الله', 'مأمون الرفاعي', 'مروان فرحات', 'رأفت بازو'],
    correctIndex: 0,
    hint: 'صوته ارتبط بنبرة الشجاعة والشجن وتوفي في حادث سير أليم عام 2009 تاركاً إرثاً لا ينسى.',
    songTitle: 'زياد الرفاعي',
    animeTitle: 'أساطير مركز الزهرة',
    explanation: 'زياد الرفاعي رحمه الله كان من أكثر الأصوات تأثيراً في قلوب جيل سبيستون ورمزاً للإصرار والبطولة النبيلة.',
    characterMascot: SPACETOON_MASCOTS[7]
  },
  {
    id: 's3-q6',
    questionType: 'artist_trivia',
    questionText: 'الممثلة القديرة ومؤدية الصوت الأسطورية لشخصية "المحقق كونان" في كافة أجزاء دبلجة مركز الزهرة منذ عام 1998 هي:',
    options: ['آمال سعد الدين', 'أمل حويجة', 'بثينة شيا', 'مجد ظاظا'],
    correctIndex: 0,
    hint: 'صوتها المميز بنبرته الطفولية الذكية ارتبط بعبارة "اسمي كونان إيدوجاوا.. متحرٍ خاص!".',
    songTitle: 'آمال سعد الدين',
    animeTitle: 'صوت كونان الخالد',
    explanation: 'الفنانة آمال سعد الدين أتقنت شخصية كونان بتقمص صوتي واستنتاجي فريد جعله جزءاً من الذاكرة العربية.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's3-q7',
    questionType: 'artist_trivia',
    questionText: 'المؤلف الموسيقي والموزع السوري العبقري الذي وضع الموسيقى التصويرية الخالدة لأنمي "المحقق كونان" (المقطوعات الحزينة ومقطوعات التحقيق البوليسي) هو:',
    options: ['إياد الريماوي', 'طارق العربي طرقان', 'إبراهيم سليماني', 'رضوان نصري'],
    correctIndex: 0,
    hint: 'مؤلف مقطوعة "لحن التحقيق" والبيانو الحزين التراجيدي في كونان.',
    songTitle: 'إياد الريماوي',
    animeTitle: 'موسيقى التحقيق والتراجيديا',
    explanation: 'الموسيقار إياد الريماوي أبدع مقطوعات كونان التصويرية الداخلية بالاشتراك مع مركز الزهرة، وحققت شهرة عربية واسعة.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's3-q8',
    questionType: 'artist_trivia',
    questionText: 'المطربة ومؤدية الصوت التي غنت الشارة الخالدة لـ "أبطال الديجيتال (الجزء الأول)" بالاشتراك مع طارق العربي طرقان بصوتها الدافئ هي:',
    options: ['سونيا بيطار', 'رشا رزق', 'هالة الصباغ', 'عنان الخياط'],
    correctIndex: 0,
    hint: 'صوت الصداقة والطفولة في افتتاحية "في فخ غريب وقعنا".',
    songTitle: 'سونيا بيطار',
    animeTitle: 'أبطال الديجيتال وسبيستون',
    explanation: 'الفنانة سونيا بيطار أدت مقاطع أبطال الديجيتال الأولى ببراعة وإحساس عالي رسخ معاني العمل الجماعي.',
    characterMascot: SPACETOON_MASCOTS[9]
  },
  {
    id: 's3-q9',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "أبطال الديجيتال (الجزء الأول)"، ما هي القيمة الحقيقية التي تؤكد الشارة أنها الوحيدة القادرة على إعادتهم من عالم الديجيتال: "نعلم أنّا لن يعيدنا الأمل.. من عالم الديجيتال بل (...)"؟',
    options: [
      'بالعمل معاً',
      'بالصبر والأمل',
      'بالسعي والكفاح',
      'بالحب والوفاء'
    ],
    correctIndex: 0,
    hint: 'الجهد المشترك والعمل الجماعي بين الأصدقاء.',
    songTitle: 'أبطال الديجيتال',
    animeTitle: 'أبطال الديجيتال 1',
    explanation: 'الكلمات الأصلية: "نعلم أنّا لن يعيدنا الأمل.. من عالم الديجيتال بل بالعمل معاً.. أبطال الديجيتال يداً بيد".',
    characterMascot: SPACETOON_MASCOTS[9]
  },
  {
    id: 's3-q10',
    questionType: 'artist_trivia',
    questionText: 'عميد المخرجين الإذاعيين وشيخ المدبلجين في مركز الزهرة والمشرف الفني العام على سلاسل المحقق كونان وعهد الأصدقاء وهزيم الرعد هو:',
    options: ['مأمون الرفاعي', 'مروان فرحات', 'يحيى الكفري', 'عادل أبو حسون'],
    correctIndex: 0,
    hint: 'مخرج الروائع ومؤدي صوت العم فيتالس وموري كوغورو وسينشي كودو الكبير.',
    songTitle: 'مأمون الرفاعي',
    animeTitle: 'عميد إخراج مركز الزهرة',
    explanation: 'الأستاذ مأمون الرفاعي وضع المعايير اللغوية والأدائية الصارمة التي ميزت دبلجة مركز الزهرة وسبيستون عربياً.',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's3-q11',
    questionType: 'lyrics_riddle',
    questionText: 'في خاتمة شارة "القناص" الأسطورية، ما هو البيت الختامي النادر الذي يختم به طارق العربي طرقان الشارة: "وجهته تشرق في الآفاق.. (...) في وجه السيل"؟',
    options: [
      'صامد كالحجر يبعد عن عينيه النوم',
      'راكض في الليل يبحث عن ضياء',
      'ماضٍ في الدرب لا يخشى الردى',
      'فارس مقدام في وجه الخطر'
    ],
    correctIndex: 0,
    hint: 'يصف غون كالصخرة الصامدة التي ترفض الاستسلام للنوم حتى يبلغ هدفه.',
    songTitle: 'القناص',
    animeTitle: 'القناص',
    explanation: 'الكلمات الأصلية الختامية: "صامت كالحجر.. يبعد عن عينيه أحلاماً.. يبعد عن عينيه النوم.. صامد كالحجر في وجه السيل".',
    characterMascot: SPACETOON_MASCOTS[1]
  },
  {
    id: 's3-q12',
    questionType: 'artist_trivia',
    questionText: 'الفنانة القديرة التي أبدعت بأداء شخصية "ماوكلي فتى الأدغال" والفتى رامي في "نصف بطل" بصوتها الطفولي الصادق هي:',
    options: ['أمل حويجة', 'آمال سعد الدين', 'فاطمة سعد', 'أنجي اليوسف'],
    correctIndex: 0,
    hint: 'رائدة مسرح الطفل وأحد أعمدة الدبلجة السورية في التسعينات.',
    songTitle: 'أمل حويجة',
    animeTitle: 'ماوكلي ورامي',
    explanation: 'الفنانة أمل حويجة تميزت بصوتها الفطري العفوي الذي رسخ شخصية ماوكلي في أذهان الملايين.',
    characterMascot: SPACETOON_MASCOTS[6]
  },
  {
    id: 's3-q13',
    questionType: 'anime_lore',
    questionText: 'في كواكب سبيستون العشرة، ما هو الكوكب المخصص حصرياً للبرامج الوثائقية والقصص التراثية القديمة وعجائب الحضارات؟',
    options: ['كوكب تاريخ', 'كوكب علوم', 'كوكب مغامرات', 'كوكب أبجد'],
    correctIndex: 0,
    hint: 'شعار الكوكب خوذة رومانية وسيف أو ساعة رملية ومخطوطة صفراء.',
    songTitle: 'كواكب سبيستون',
    animeTitle: 'كوكب تاريخ',
    explanation: 'كوكب تاريخ هو كوكب الحكايات والقصص التاريخية مثل "صقور الأرض"، "إيكوسان"، و"سندباد التراثي".',
    characterMascot: SPACETOON_MASCOTS[8]
  },
  {
    id: 's3-q14',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة نهاية "عهد الأصدقاء" الحزينة "وداعاً ألفريدو"، أكمل الشطر الباكي: "وداعاً يا صديقي.. يا شمعة في طريقي.. ذكراك في (...) ستبقى دوماً معي"؟',
    options: ['قلبي الحزين', 'روحي دائماً', 'صدري ووجداني', 'عيني بالدموع'],
    correctIndex: 0,
    hint: 'القلب الذي يحفظ العهد والذكرى الصادقة للأبد.',
    songTitle: 'وداعاً ألفريدو',
    animeTitle: 'عهد الأصدقاء (شارة النهاية)',
    explanation: 'شارة النهاية "وداعاً ألفريدو" بصوت رشا رزق تعد من أكثر اللحظات تأثيراً وإبكاءً في تاريخ سبيستون.',
    characterMascot: SPACETOON_MASCOTS[2]
  },
  {
    id: 's3-q15',
    questionType: 'artist_trivia',
    questionText: 'الممثل السوري القدير مؤدي صوت المحقق الشهير "توغو موري" وصوت "غوغو" والراوي الحكيم في العديد من شارات وأعمال سبيستون هو:',
    options: ['مروان فرحات', 'مأمون الرفاعي', 'أيمن السالك', 'محمد خرماشو'],
    correctIndex: 0,
    hint: 'صوت النبل والوقار في كرتون سبيستون وسفير اللغة العربية الفصحى.',
    songTitle: 'مروان فرحات',
    animeTitle: 'فرسان مركز الزهرة',
    explanation: 'الفنان مروان فرحات قدم أدواراً تاريخية خالدة كتوغو موري وزورو وغوكو، ولغته العربية الفصحى الفائقة أثرت أجيالاً.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's3-q16',
    questionType: 'lyrics_riddle',
    questionText: 'في شارة "صانع السلام"، ما هي المقولة الحكمية الأصلية التي يؤكدها البيت الأخير: "إن الأمل (...) والجهد لا يضيع"؟',
    options: ['جهد عمل', 'نور أمل', 'سر نجاح', 'درب فلاح'],
    correctIndex: 0,
    hint: 'تربط الأمل بالعمل الجاد والاجتهاد الحقيقي وليس التمني فقط.',
    songTitle: 'صانع السلام',
    animeTitle: 'صانع السلام',
    explanation: 'الكلمات الأصلية لطارق العربي طرقان: "إن الأمل جهد عمل.. والجهد لا يضيع.. يا صغيري".',
    characterMascot: SPACETOON_MASCOTS[1]
  },
  {
    id: 's3-q17',
    questionType: 'artist_trivia',
    questionText: 'الشعار التأسيسي الشفهي الأيقوني الذي انطلقت به قناة سبيستون عام 2000 وصاحب أجيالها منذ 25 عاماً هو:',
    options: [
      'سبيستون.. قناة شباب المستقبل',
      'سبيستون.. عالم الكرتون العربي',
      'سبيستون.. كوكب الذكريات',
      'سبيستون.. صوت الطفولة الدائم'
    ],
    correctIndex: 0,
    hint: 'اللقب الأشهر الذي يفتخر به كل من كبر مع سبيستون "جيل شباب المستقبل".',
    songTitle: 'سبيستون',
    animeTitle: 'قناة شباب المستقبل',
    explanation: 'شعار "سبيستون قناة شباب المستقبل" هو الهوية الرسمية التاريخية للقناة التي ربت أجيالاً على القيم والأمل.',
    characterMascot: SPACETOON_MASCOTS[0]
  },
  {
    id: 's3-q18',
    questionType: 'lyrics_riddle',
    questionText: 'في أنشودة "أمي كم أهواها" بريمي، أكمل البيت الختامي: "أنتِ الأمان.. أنتِ الحنان.. من تحت قدميكِ (...) ودمتِ لنا أملاً وأمان"؟',
    options: ['لنا الجنان', 'يفيض الحنان', 'يعم السلام', 'ينير الزمان'],
    correctIndex: 0,
    hint: 'الجنان ورضا الرحمن المستوحى من الحديث النبوي الشريف.',
    songTitle: 'أمي كم أهواها',
    animeTitle: 'دروب ريمي',
    explanation: 'الكلمات الأصلية: "أنتِ الأمان.. أنتِ الحنان.. من تحت قدميكِ لنا الجنان.. أمي أمي أمي".',
    characterMascot: SPACETOON_MASCOTS[3]
  }
];

// =========================================================================
//  MASTER COMBINED QUESTION BANK (54 Fully Unique, Non-repeating Questions)
// =========================================================================
export const MASTER_QUIZ_BANK: QuizQuestion[] = [
  ...STAGE_1_QUESTIONS,
  ...STAGE_2_QUESTIONS,
  ...STAGE_3_QUESTIONS
];

// Helper: Picks N non-repeating questions, and scrambles options so correct answers aren't fixed!
export function getRandomQuizRound(count = 10, category = 'all'): QuizQuestion[] {
  let pool = MASTER_QUIZ_BANK;
  if (category && category !== 'all') {
    pool = MASTER_QUIZ_BANK.filter((q) => q.questionType === category);
    if (pool.length < count) {
      pool = MASTER_QUIZ_BANK;
    }
  }

  const shuffledPool = shuffleArray(pool);
  const selected = shuffledPool.slice(0, Math.min(count, shuffledPool.length));

  // Scramble options for each question so correctIndex changes every single time!
  return selected.map((q, idx) => {
    const originalCorrectOption = q.options[q.correctIndex];
    const scrambledOptions = shuffleArray(q.options);
    const newCorrectIndex = scrambledOptions.indexOf(originalCorrectOption);
    const mascot = q.characterMascot || SPACETOON_MASCOTS[idx % SPACETOON_MASCOTS.length];

    return {
      ...q,
      options: scrambledOptions,
      correctIndex: newCorrectIndex,
      characterMascot: mascot
    };
  });
}

// =========================================================================
//  REPORT & PERCENTAGE SCORING ENGINE (3-STAGE PROGRESSION SYSTEM)
// =========================================================================
export interface QuizStageMeta {
  id: number;
  title: string;
  subtitle: string;
  requiredPercentage: number;
  description: string;
  badge: string;
  icon: string;
}

export const QUIZ_STAGES: QuizStageMeta[] = [
  {
    id: 1,
    title: 'المرحلة 1: شارات البداية والذكريات',
    subtitle: 'مستوى المبتدئ والمحبين — مطلوب 70% للتأهل',
    requiredPercentage: 70,
    description: 'أشهر شارات البداية والذكريات الأيقونية (كونان، ريمي، أنا وأخي، عهد الأصدقاء، ماوكلي). حقق 70% على الأقل للمرور للمرحلة الثانية.',
    badge: 'مستكشف الذكريات ',
    icon: ''
  },
  {
    id: 2,
    title: 'المرحلة 2: تحدي الكلمات والألحان',
    subtitle: 'مستوى الخبير — مطلوب 71% (واحد وسبعون) للفوز والتأهل',
    requiredPercentage: 71,
    description: 'إكمال الكلمات الأصلية، نغمات كواكب سبيستون، وشارات الأكشن والحماس (القناص، دراجون بول، هزيم الرعد). حقق 71% (واحد وسبعون بالمئة) للفوز والتأهل للمرحلة النهائية.',
    badge: 'خبير الشارات ',
    icon: ''
  },
  {
    id: 3,
    title: 'المرحلة 3: امتحان أساطير سبيستون الذهبي',
    subtitle: 'المرحلة النهائية — مطلوب 90% لنيل شهادة سبيستون الرسمية',
    requiredPercentage: 90,
    description: 'تحدي الأساطير الأخير لعمالقة الفن والملحنين (طارق العربي طرقان، رشا رزق، عاصم سكر) وأندر الأبيات وأسرار مركز الزهرة. حقق 90% (9 إجابات صحيحة من 10) لتنال شهادة سبيستون الرسمية المعتمدة!',
    badge: 'أسطورة سبيستون ',
    icon: ''
  }
];

export interface QuizScoreReport {
  score: number;
  correctCount: number;
  totalCount: number;
  percentage: number;
  stage: number; // 1 | 2 | 3
  isPassed: boolean;
  canAdvance: boolean;
  earnedCertificate: boolean;
  passingPercentage: number;
  passingScore: number;
  gradeTitle: string;
  gradeBadge: string;
  gradeColor: string;
  gradeTextColor: string;
  quote: string;
}

export function calculateQuizScoreReport(
  correctCount: number,
  totalCount: number,
  score: number,
  stage: number = 1
): QuizScoreReport {
  const safeTotal = Math.max(1, totalCount);
  const percentage = Math.round((correctCount / safeTotal) * 100);

  // Exact Stage Passing Requirements per User Constitution:
  // Stage 1: >= 70% to qualify to Stage 2
  // Stage 2: >= 71% to win and qualify to Stage 3 (واحد وسبعون بالمئة)
  // Stage 3: >= 90% (e.g. 9/10 correct answers) to pass and earn the Official Spacetoon Certificate!
  let passingPercentage = 70;
  if (stage === 2) passingPercentage = 71;
  else if (stage === 3) passingPercentage = 90;

  const passingScore = Math.ceil((safeTotal * passingPercentage) / 100);
  const isPassed = percentage >= passingPercentage;
  const canAdvance = isPassed && stage < 3;
  const earnedCertificate = stage === 3 && isPassed;

  let gradeTitle = '';
  let gradeBadge = '';
  let gradeColor = '';
  let gradeTextColor = '';
  let quote = '';

  if (stage === 1) {
    if (isPassed) {
      gradeTitle = ' مبروك! تأهلت للمرحلة الثانية (المتقدمة)';
      gradeBadge = 'Stage 1 Cleared';
      gradeColor = 'from-emerald-400 to-teal-500';
      gradeTextColor = 'text-emerald-400';
      quote = `أداء رائع! حققت ${percentage}% وتجاوزت شرط التأهل (70%). لقد تأهلت رسمياً للمرحلة الثانية!`;
    } else {
      gradeTitle = ' لم تتجاوز المرحلة الأولى (مطلوب 70%)';
      gradeBadge = 'Stage 1 Incomplete';
      gradeColor = 'from-amber-500 to-orange-600';
      gradeTextColor = 'text-amber-400';
      quote = `حققت ${percentage}%، ولكن لتتأهل للمرحلة التالية يلزمك 70% على الأقل. أعد المحاولة واستعد الذكريات!`;
    }
  } else if (stage === 2) {
    if (isPassed) {
      gradeTitle = ' فوز ساحق! تأهلت للمرحلة الثالثة والنهائية';
      gradeBadge = 'Stage 2 Champion';
      gradeColor = 'from-purple-400 via-indigo-400 to-blue-500';
      gradeTextColor = 'text-purple-300';
      quote = `إنجاز بطولي! حققت ${percentage}% وتجاوزت شرط الـ 71% (واحد وسبعون بالمئة) وفزت بالمرحلة الثانية وتأهلت لامتحان الأساطير الأخير للمنافسة على الشهادة الرسمية!`;
    } else {
      gradeTitle = ' لم تتجاوز المرحلة الثانية (مطلوب 71%)';
      gradeBadge = 'Stage 2 Try Again';
      gradeColor = 'from-rose-500 to-amber-600';
      gradeTextColor = 'text-rose-400';
      quote = `حققت ${percentage}%، ولكن للفوز بالمرحلة الثانية والتأهل للمرحلة النهائية يلزمك 71% (واحد وسبعون بالمئة) على الأقل. أعد المحاولة!`;
    }
  } else {
    // Stage 3 - The Ultimate Certificate Stage
    if (earnedCertificate) {
      gradeTitle = ' أسطورة سبيستون المعتمد (حائز على الشهادة الرسمية)';
      gradeBadge = 'Grand Spacetoon Legend';
      gradeColor = 'from-amber-300 via-yellow-400 to-amber-500';
      gradeTextColor = 'text-amber-300';
      quote = `مبارك من القلب! حققت ${percentage}% (9 إجابات صحيحة أو أكثر) وتجاوزت نسبة التأهل وأتممت اختبار احزر الشارة سبيستون بالكامل! استلم شهادتك الرسمية المعتمدة الآن !`;
    } else {
      gradeTitle = ' خبير متقدم (يلزمك 90% لنيل الشهادة)';
      gradeBadge = 'Almost Legend';
      gradeColor = 'from-blue-400 to-indigo-500';
      gradeTextColor = 'text-blue-300';
      quote = `أداء مميز جداً! حققت ${percentage}%، ولكن لنيل شهادة إتمام اختبار احزر الشارة سبيستون الرسمية يجب تحقيق 90% على الأقل (9 من 10). أعد المحاولة لترفع الشهادة الذهبية!`;
    }
  }

  return {
    score,
    correctCount,
    totalCount: safeTotal,
    percentage,
    stage,
    isPassed,
    canAdvance,
    earnedCertificate,
    passingPercentage,
    passingScore,
    gradeTitle,
    gradeBadge,
    gradeColor,
    gradeTextColor,
    quote
  };
}

// Stage Question Selector: Strictly uses dedicated non-overlapping question pools!
export function getStageQuizRound(stage: number = 1, count: number = 10): QuizQuestion[] {
  let stagePool = STAGE_1_QUESTIONS;

  if (stage === 1) {
    stagePool = STAGE_1_QUESTIONS;
  } else if (stage === 2) {
    stagePool = STAGE_2_QUESTIONS;
  } else if (stage === 3) {
    stagePool = STAGE_3_QUESTIONS;
  }

  const shuffled = shuffleArray(stagePool);
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((q, idx) => {
    const originalCorrectOption = q.options[q.correctIndex];
    const scrambledOptions = shuffleArray(q.options);
    const newCorrectIndex = scrambledOptions.indexOf(originalCorrectOption);
    const mascot = q.characterMascot || SPACETOON_MASCOTS[idx % SPACETOON_MASCOTS.length];

    return {
      ...q,
      options: scrambledOptions,
      correctIndex: newCorrectIndex,
      characterMascot: mascot
    };
  });
}

// Local Storage for High Score and Game Stats
const HIGH_SCORE_KEY = 'yona_quiz_high_score';
const QUIZ_GAMES_COUNT_KEY = 'yona_quiz_games_count';

export function getQuizHighScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
  } catch {
    return 0;
  }
}

export function saveQuizHighScore(score: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const currentHigh = getQuizHighScore();
    if (score > currentHigh) {
      localStorage.setItem(HIGH_SCORE_KEY, score.toString());
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function incrementQuizGamesCount(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const count = parseInt(localStorage.getItem(QUIZ_GAMES_COUNT_KEY) || '0', 10) + 1;
    localStorage.setItem(QUIZ_GAMES_COUNT_KEY, count.toString());
    return count;
  } catch {
    return 1;
  }
}
