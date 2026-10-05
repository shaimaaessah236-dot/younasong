import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Share2,
  Check,
  RotateCcw,
  Compass,
  Star,
  Shield,
  Award,
  Zap,
  Heart,
  Music,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Copy,
  Printer,
  Sparkle
} from 'lucide-react';
import heroBadgeImg from '../assets/images/spacetoon_hero_badge_1790292862519.jpg';
import galaxyBannerImg from '../assets/images/spacetoon_galaxy_banner_1790292876427.jpg';

export interface SpacetoonHeroProfile {
  id: string;
  name: string;
  arabicName: string;
  title: string;
  planet: string;
  planetColor: string;
  planetArabic: string;
  planetSlug: string;
  code: string;
  quote: string;
  traits: string[];
  themeSongTitle: string;
  themeSongArtist: string;
  stats: {
    courage: number;
    loyalty: number;
    wisdom: number;
    hope: number;
  };
  avatarUrl: string;
  badgeAccent: string;
}

import { useLanguage } from '../context/LanguageContext';

export const SPACETOON_HEROES: SpacetoonHeroProfile[] = [
  {
    id: 'conan',
    name: 'Detective Conan',
    arabicName: 'المحقق كونان',
    title: 'المحقق الأسطوري وعين العدالة الفضائية',
    planet: 'Action',
    planetArabic: 'كوكب أكشن',
    planetColor: '#EF4444',
    planetSlug: 'action',
    code: 'SP-ACT-CONAN-994',
    quote: 'الحقيقة دائماً واحدة.. والعدالة لا تنام مهما كان الخصم بارعاً!',
    traits: ['ذكاء استثنائي', 'هدوء تحت الضغط', 'تحليل فوري', 'ضمير يقظ'],
    themeSongTitle: 'شارة المحقق كونان (بدون موسيقى)',
    themeSongArtist: 'رشا رزق',
    stats: {
      courage: 94,
      loyalty: 96,
      wisdom: 99,
      hope: 92
    },
    avatarUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#3B82F6'
  },
  {
    id: 'gon',
    name: 'Gon Freecss',
    arabicName: 'غون فريكس (القناص)',
    title: 'صياد الآفاق وحامي درب الصداقة النقية',
    planet: 'Adventures',
    planetArabic: 'كوكب مغامرات',
    planetColor: '#10B981',
    planetSlug: 'adventure',
    code: 'SP-ADV-GON-405',
    quote: 'قد لمعت عيناه بالعزم انتفضت يمناه.. في هدوء الليل صامد مغامر!',
    traits: ['إصرار لا يقهر', 'طيبة قلب فطرية', 'شجاعة مطلقة', 'وفاء للأصدقاء'],
    themeSongTitle: 'شارة القناص (قد لمعت عيناه)',
    themeSongArtist: 'رشا رزق',
    stats: {
      courage: 99,
      loyalty: 100,
      wisdom: 84,
      hope: 98
    },
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#10B981'
  },
  {
    id: 'romeo',
    name: 'Romeo & Alfredo',
    arabicName: 'روميو وألفريدو (عهد الأصدقاء)',
    title: 'فارس عهد الأصدقاء ونبراس الوفاء الأبدي',
    planet: 'History',
    planetArabic: 'كوكب تاريخ',
    planetColor: '#F59E0B',
    planetSlug: 'history',
    code: 'SP-HIS-ROMEO-777',
    quote: 'حلمنا نهار، نهارنا عمل، نملك الخيار، وخيارنا الأمل!',
    traits: ['نبل الفرسان', 'تضحية وإيثار', 'أمل متجدد', 'صداقة خالدة'],
    themeSongTitle: 'شارة عهد الأصدقاء (حلمنا نهار)',
    themeSongArtist: 'رشا رزق',
    stats: {
      courage: 96,
      loyalty: 100,
      wisdom: 93,
      hope: 100
    },
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#F59E0B'
  },
  {
    id: 'remi',
    name: 'Remi & Sara',
    arabicName: 'ريمي وسالي',
    title: 'أميرة الصبر والقلب النقي المتلألئ',
    planet: 'Zomoroda',
    planetArabic: 'كوكب زمردة',
    planetColor: '#EC4899',
    planetSlug: 'zomoroda',
    code: 'SP-ZOM-REMI-101',
    quote: 'سأرسم في السماء نجمة، تضيء عتمة الدرب الطويل وتنسينا الآلام!',
    traits: ['صبر لا ينفد', 'رقة وحنان', 'صوت ملائكي', 'عزيمة هادئة'],
    themeSongTitle: 'شارة دروب ريمي (أنتي الأمان)',
    themeSongArtist: 'رشا رزق',
    stats: {
      courage: 92,
      loyalty: 98,
      wisdom: 95,
      hope: 100
    },
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#EC4899'
  },
  {
    id: 'hazim',
    name: 'Thunder Jet',
    arabicName: 'هزيم الرعد (صقر الفضاء)',
    title: 'صقر المجرة الموحد وقائد فرسان الحق',
    planet: 'Action',
    planetArabic: 'كوكب أكشن',
    planetColor: '#8B5CF6',
    planetSlug: 'action',
    code: 'SP-ACT-HAZIM-888',
    quote: 'أبرقي أرعدي أبطالاً وعدوك أنبل وعد.. جاؤوك بصوت الحق الهادر!',
    traits: ['شجاعة الملوك', 'فروسية أصيلة', 'قيادة كاريزمية', 'عدالة صارمة'],
    themeSongTitle: 'شارة هزيم الرعد (أبرقي أرعدي)',
    themeSongArtist: 'طارق العربي طرقان',
    stats: {
      courage: 100,
      loyalty: 95,
      wisdom: 91,
      hope: 96
    },
    avatarUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#8B5CF6'
  },
  {
    id: 'majed',
    name: 'Captain Majed',
    arabicName: 'الكابتن ماجد',
    title: 'هداف النجوم وقائد العزيمة الرياضية الذهبية',
    planet: 'Sports',
    planetArabic: 'كوكب رياضة',
    planetColor: '#0EA5E9',
    planetSlug: 'sports',
    code: 'SP-SPO-MAJED-010',
    quote: 'سجل أهدافاً لا تيأس.. الكرة صديقي والملعب ساحة أحلامنا!',
    traits: ['روح رياضية', 'تركيز حديدي', 'قيادة الفريق', 'إيمان بالفوز'],
    themeSongTitle: 'شارة الكابتن ماجد',
    themeSongArtist: 'طارق العربي طرقان',
    stats: {
      courage: 95,
      loyalty: 97,
      wisdom: 89,
      hope: 98
    },
    avatarUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#0EA5E9'
  },
  {
    id: 'digimon',
    name: 'Digimon Champions',
    arabicName: 'أبطال الديجيتال (أمجد وصقر)',
    title: 'المختار الأول لقلائد الشجاعة والنور الرقمي',
    planet: 'Adventures',
    planetArabic: 'كوكب مغامرات',
    planetColor: '#F97316',
    planetSlug: 'adventure',
    code: 'SP-ADV-DIGI-1999',
    quote: 'في عالم الأرقام نلتقي.. خطوة وراء خطوة نعبر نحو الغد!',
    traits: ['شجاعة القلب', 'تطور مستمر', 'روابط لا تنقطع', 'حماية الضعفاء'],
    themeSongTitle: 'شارة أبطال الديجيتال (الجزء الأول)',
    themeSongArtist: 'سونيا بيطار',
    stats: {
      courage: 98,
      loyalty: 99,
      wisdom: 90,
      hope: 97
    },
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#F97316'
  },
  {
    id: 'kabamaru',
    name: 'Kabamaru Ninja',
    arabicName: 'نينجا المغامر (كابامارو)',
    title: 'نينجا الشومين وسفير البهجة والضحكات العابرة للمجرات',
    planet: 'Comedy',
    planetArabic: 'كوكب كوميديا',
    planetColor: '#EAB308',
    planetSlug: 'comedy',
    code: 'SP-COM-KABA-333',
    quote: 'ضحكة واحدة قادرة على هزيمة أكبر أشرار المجرة وألذ صحن ياكيسوبا!',
    traits: ['مرح لا ينضب', 'سرعة بديهة', 'عفوية مطلقة', 'قلب أبيض'],
    themeSongTitle: 'شارة نينجا المغامر',
    themeSongArtist: 'طارق العربي طرقان',
    stats: {
      courage: 91,
      loyalty: 94,
      wisdom: 86,
      hope: 99
    },
    avatarUrl: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?auto=format&fit=crop&w=400&q=80',
    badgeAccent: '#EAB308'
  }
];

interface QuizQuestion {
  id: number;
  question: string;
  subtitle: string;
  options: {
    text: string;
    description: string;
    heroId: string;
    icon: string;
  }[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'ما هو سلاحك الأقوى عندما تواجهك عاصفة أو موقف صعب؟',
    subtitle: 'اختبر غريزتك الأولى التي تعتمد عليها في المواقف المفصلية',
    options: [
      {
        text: 'الذكاء والتحليل المنطقي الهادئ',
        description: 'أبحث عن التفاصيل الصغيرة التي يغفل عنها الجميع وأكشف الحقيقة',
        heroId: 'conan',
        icon: ''
      },
      {
        text: 'العزيمة النقية والإصرار الذي لا يتراجع',
        description: 'أتقدم للأمام بقلب شجاع ولا أستسلم مهما بلغت قوة الخصم',
        heroId: 'gon',
        icon: ''
      },
      {
        text: 'الوفاء للأصدقاء والإيثار النبيل',
        description: 'أضع يدي بيد صديقي، فمعاً نستطيع قهر المستحيل',
        heroId: 'romeo',
        icon: ''
      },
      {
        text: 'الصبر الجميل والأمل الصادق في فجر جديد',
        description: 'أواجه القسوة بالرحمة، والظلام بابتسامة تضيء قلوب من حولي',
        heroId: 'remi',
        icon: ''
      },
      {
        text: 'الفروسية والشجاعة المباشرة لنصرة المظلوم',
        description: 'أبرق كالرعد دفاعاً عن الحق وأقود الميدان بلا تردد',
        heroId: 'hazim',
        icon: ''
      }
    ]
  },
  {
    id: 2,
    question: 'أي كوكب من كواكب سبيستون كنت تجلس أمامه بلهفة لا توصف؟',
    subtitle: 'الكوكب الذي ارتبطت به طفولتك وتتردد نغماته في ذاكرتك',
    options: [
      {
        text: 'كوكب أكشن (كوكب الإثارة والغموض)',
        description: 'حيث المغامرات البوليسية والسيوف والمعارك الأسطورية',
        heroId: 'conan',
        icon: ''
      },
      {
        text: 'كوكب مغامرات (كوكب الخيال والتشويق)',
        description: 'السفر عبر الجزر والعوالم المجهولة والبحث عن المجهول',
        heroId: 'gon',
        icon: ''
      },
      {
        text: 'كوكب زمردة (كوكب للبنات فقط وعالم الأحلام والرقة)',
        description: 'القصص الإنسانية المؤثرة ودفء المشاعر والعزيمة الصامتة',
        heroId: 'remi',
        icon: ''
      },
      {
        text: 'كوكب تاريخ (كوكب فرسان الماضي وقصص الشعوب)',
        description: 'عهد الأصدقاء، صقور الأرض، وبطولات من عبق الزمان',
        heroId: 'romeo',
        icon: ''
      },
      {
        text: 'كوكب رياضة (كوكب النشاط والتحدي)',
        description: 'حماس الملاعب والكرة التي تجمعنا والشغف الرياضي',
        heroId: 'majed',
        icon: ''
      },
      {
        text: 'كوكب كوميديا (كوكب الضحك والمرح)',
        description: 'الضحك من القلب والمواقف الطريفة التي ترسم البسمة',
        heroId: 'kabamaru',
        icon: ''
      }
    ]
  },
  {
    id: 3,
    question: 'إذا تعثرت أو خسرت في معركة أو تحدٍ، ماذا تفعل؟',
    subtitle: 'ردة فعلك الحقيقية بعد السقوط هي التي تحدد رتبتك الفضائية',
    options: [
      {
        text: 'أحلل أسباب التعثر كقضية معقدة وأعود بحل لا يخطر على بال',
        description: 'لا أكرر الخطأ نفسه مرتين، فالفشل مجرد معلومة جديدة',
        heroId: 'conan',
        icon: ''
      },
      {
        text: 'أنهض في اللحظة نفسها بصرخة عزم تهز المكان!',
        description: 'الألم يوقظ قوتي الحقيقية ويزيدني إصراراً',
        heroId: 'gon',
        icon: ''
      },
      {
        text: 'أبتسم رغم الدموع لأنني أعلم أن غداً أجمل بكثير',
        description: 'الشدائد تصنع قلباً أقوى وأكثر حناناً',
        heroId: 'remi',
        icon: ''
      },
      {
        text: 'أشد على يد رفاقي وأقول: رحلتنا بدأت للتو ولن نفترق!',
        description: 'قوتي مستمدة من وفائي لعهدي مع الأصدقاء',
        heroId: 'romeo',
        icon: ''
      },
      {
        text: 'أعود إلى التمارين وأسدد مائة كرة حتى أتقن الضربة القاضية',
        description: 'التدريب المستمر هو الجسر الوحيد نحو القمة',
        heroId: 'majed',
        icon: ''
      }
    ]
  },
  {
    id: 4,
    question: 'اختر الشعار الأقرب إلى روحك من شارات سبيستون الخالدة:',
    subtitle: 'البيت الشعري الذي تشعر أنه كُتب خصيصاً ليصف حياتك',
    options: [
      {
        text: '«الحقيقة دائماً واحدة.. لا شيء يبقى مستحيلاً أمام العقل!»',
        description: 'شعار المحقق كونان وعالم أكشن',
        heroId: 'conan',
        icon: ''
      },
      {
        text: '«قد لمعت عيناه بالعزم انتفضت يمناه.. في هدوء الليل صامد مغامر!»',
        description: 'شعار القناص وعالم المغامرات',
        heroId: 'gon',
        icon: ''
      },
      {
        text: '«حلمنا نهار، نهارنا عمل، نملك الخيار، وخيارنا الأمل!»',
        description: 'شعار عهد الأصدقاء الخالد',
        heroId: 'romeo',
        icon: ''
      },
      {
        text: '«سأرسم في السماء نجمة، تضيء عتمة الدرب الطويل!»',
        description: 'شعار ريمي وسالي في كوكب زمردة',
        heroId: 'remi',
        icon: ''
      },
      {
        text: '«أبرقي أرعدي أبطالاً وعدوك أنبل وعد.. جاؤوك بصوت الحق الهادر!»',
        description: 'شعار هزيم الرعد وفرسان الفضاء',
        heroId: 'hazim',
        icon: ''
      },
      {
        text: '«في عالم الأرقام نلتقي.. خطوة وراء خطوة نعبر نحو عالم أفضل!»',
        description: 'شعار أبطال الديجيتال وعالم الأرقام',
        heroId: 'digimon',
        icon: ''
      }
    ]
  }
];

interface SpacetoonPassportHubProps {
  onNavigateToStudio?: (songTitle?: string) => void;
  onNavigateToSongs?: () => void;
}

export const SpacetoonPassportHub: React.FC<SpacetoonPassportHubProps> = ({
  onNavigateToStudio,
  onNavigateToSongs,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();

  // Quiz & View state
  const [currentStep, setCurrentStep] = useState<'quiz' | 'result'>('quiz');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  
  // User Personalization
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('yona_spacetoon_passport_name') || 'فارس سبيستون';
  });
  const [customRank, setCustomRank] = useState<string>('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Selected / Discovered Hero
  const [activeHero, setActiveHero] = useState<SpacetoonHeroProfile>(() => {
    const savedHeroId = localStorage.getItem('yona_spacetoon_hero_id');
    const found = SPACETOON_HEROES.find(h => h.id === savedHeroId);
    return found || SPACETOON_HEROES[0];
  });

  // Card view mode: 'id-card' or 'passport'
  const [cardFormat, setCardFormat] = useState<'id-card' | 'passport'>('id-card');
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate winner hero from answers
  const finishQuiz = (answers: Record<number, string>) => {
    const tally: Record<string, number> = {};
    Object.values(answers).forEach((hId) => {
      tally[hId] = (tally[hId] || 0) + 1;
    });

    let bestHeroId = SPACETOON_HEROES[0].id;
    let maxVotes = -1;
    Object.entries(tally).forEach(([hId, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        bestHeroId = hId;
      }
    });

    const chosen = SPACETOON_HEROES.find(h => h.id === bestHeroId) || SPACETOON_HEROES[0];
    setActiveHero(chosen);
    try {
      localStorage.setItem('yona_spacetoon_hero_id', chosen.id);
    } catch (_e) {}
    setCurrentStep('result');
  };

  const handleSelectOption = (heroId: string) => {
    const updated = { ...selectedAnswers, [QUIZ_QUESTIONS[currentQuestionIndex].id]: heroId };
    setSelectedAnswers(updated);

    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz(updated);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentStep('quiz');
  };

  const handleDirectSelectHero = (hero: SpacetoonHeroProfile) => {
    setActiveHero(hero);
    try {
      localStorage.setItem('yona_spacetoon_hero_id', hero.id);
    } catch (_e) {}
    setCurrentStep('result');
  };

  const saveUserName = (val: string) => {
    const clean = val.trim() || 'فارس سبيستون';
    setUserName(clean);
    setIsEditingName(false);
    try {
      localStorage.setItem('yona_spacetoon_passport_name', clean);
    } catch (_e) {}
  };

  // High-Resolution Canvas Card Generator & Exporter
  const handleDownloadHDCard = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isPassport = cardFormat === 'passport';
      const width = 1600;
      const height = isPassport ? 1000 : 960;
      canvas.width = width;
      canvas.height = height;

      // 1. Futuristic Space Background (Deep Midnight Nebula)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#070a14');
      bgGrad.addColorStop(0.45, '#0b1329');
      bgGrad.addColorStop(0.8, '#101c3d');
      bgGrad.addColorStop(1, '#050811');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Starfield dots
      for (let i = 0; i < 160; i++) {
        const sx = (i * 137) % width;
        const sy = (i * 89) % height;
        const radius = (i % 3) + 0.8;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(251, 191, 36, 0.6)' : 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Planet Glow Orb based on Hero's planet color
      const glowGrad = ctx.createRadialGradient(width - 250, 220, 20, width - 250, 220, 340);
      glowGrad.addColorStop(0, `${activeHero.planetColor}55`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width - 250, 220, 340, 0, Math.PI * 2);
      ctx.fill();

      // 2. High-Tech Holographic Frame
      ctx.strokeStyle = activeHero.planetColor;
      ctx.lineWidth = 6;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(45, 45, width - 90, height - 90);

      // 3. Top Header Bar
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';
      ctx.font = 'bold 32px Tajawal, sans-serif';
      ctx.fillStyle = '#F59E0B';
      ctx.fillText('منظمة استكشاف كواكب سبيستون الرسمية • SPACETOON GALAXY FEDERATION', width - 80, 95);

      ctx.font = '20px Tajawal, sans-serif';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText('جواز سفر وهوية البطل السبيستوني المعتمد • كود التحقق المجري', width - 80, 130);

      // Top Left: Planet Pill
      ctx.textAlign = 'left';
      ctx.direction = 'ltr';
      ctx.fillStyle = activeHero.planetColor;
      ctx.font = 'bold 24px Tajawal, sans-serif';
      ctx.fillText(`PLANET: ${activeHero.planet.toUpperCase()}`, 80, 95);
      ctx.font = 'bold 18px monospace';
      ctx.fillStyle = '#CBD5E1';
      ctx.fillText(`ID: ${activeHero.code}`, 80, 125);

      // 4. Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(80, 160);
      ctx.lineTo(width - 80, 160);
      ctx.stroke();

      // 5. Hero Photo / Avatar Box (Left Area)
      const photoX = 90;
      const photoY = 190;
      const photoW = 340;
      const photoH = 430;

      ctx.fillStyle = '#0F172A';
      ctx.fillRect(photoX, photoY, photoW, photoH);
      ctx.strokeStyle = activeHero.planetColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(photoX, photoY, photoW, photoH);

      // Draw avatar photo
      const avatarImg = new Image();
      avatarImg.crossOrigin = 'anonymous';
      avatarImg.src = activeHero.avatarUrl;
      await new Promise((resolve) => {
        avatarImg.onload = resolve;
        avatarImg.onerror = resolve;
      });

      try {
        if (avatarImg.complete && avatarImg.naturalWidth > 0) {
          ctx.drawImage(avatarImg, photoX + 10, photoY + 10, photoW - 20, photoH - 20);
        } else {
          ctx.fillStyle = '#1E293B';
          ctx.fillRect(photoX + 10, photoY + 10, photoW - 20, photoH - 20);
        }
      } catch (_e) {}

      // Official Stamped Watermark on photo
      ctx.save();
      ctx.translate(photoX + photoW / 2, photoY + photoH - 70);
      ctx.rotate(-0.25);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.strokeRect(-120, -25, 240, 50);
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 20px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('معتمد من سبيستون ', 0, 8);
      ctx.restore();

      // 6. Right Side: Identity Details & Stats
      ctx.direction = 'rtl';
      ctx.textAlign = 'right';

      // User Full Name
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px Tajawal, sans-serif';
      ctx.fillText('اسم المستكشف / البطل:', width - 90, 220);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 50px Tajawal, sans-serif';
      ctx.fillText(userName, width - 90, 280);

      // Hero Persona Match
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px Tajawal, sans-serif';
      ctx.fillText('الشخصية المطابقة:', width - 90, 335);

      ctx.fillStyle = activeHero.planetColor;
      ctx.font = 'bold 36px Tajawal, sans-serif';
      ctx.fillText(`${activeHero.arabicName} (${activeHero.planetArabic})`, width - 90, 380);

      // Official Space Rank
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 20px Tajawal, sans-serif';
      ctx.fillText('الرتبة المجرية الرسمية:', width - 90, 435);

      ctx.fillStyle = '#FBBF24';
      ctx.font = 'bold 26px Tajawal, sans-serif';
      ctx.fillText(customRank || activeHero.title, width - 90, 475);

      // 7. Hero Stats Grid (Courage, Loyalty, Wisdom, Hope)
      const statsY = 530;
      const statColW = 240;
      const statsList = [
        { label: 'الشجاعة', val: activeHero.stats.courage, color: '#EF4444' },
        { label: 'الوفاء', val: activeHero.stats.loyalty, color: '#10B981' },
        { label: 'الذكاء', val: activeHero.stats.wisdom, color: '#3B82F6' },
        { label: 'الأمل', val: activeHero.stats.hope, color: '#F59E0B' }
      ];

      statsList.forEach((st, idx) => {
        const xPos = width - 90 - (idx * statColW);
        ctx.fillStyle = '#0F172A';
        ctx.fillRect(xPos - 220, statsY, 220, 80);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.strokeRect(xPos - 220, statsY, 220, 80);

        ctx.fillStyle = '#94A3B8';
        ctx.font = 'bold 16px Tajawal, sans-serif';
        ctx.fillText(st.label, xPos - 20, statsY + 30);

        ctx.fillStyle = st.color;
        ctx.font = 'bold 30px Tajawal, sans-serif';
        ctx.fillText(`${st.val}%`, xPos - 20, statsY + 65);
      });

      // 8. Iconic Quote Box
      const quoteBoxY = 640;
      const quoteBoxW = width - 180;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.fillRect(90, quoteBoxY, quoteBoxW, 95);
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.strokeRect(90, quoteBoxY, quoteBoxW, 95);

      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 18px Tajawal, sans-serif';
      ctx.fillText('شعارك السبيستوني الأبدي:', width - 115, quoteBoxY + 34);

      ctx.fillStyle = '#E2E8F0';
      ctx.font = 'italic bold 22px Tajawal, sans-serif';
      ctx.fillText(`« ${activeHero.quote} »`, width - 115, quoteBoxY + 70);

      // 9. Bottom Bar: Barcode, Hologram & Signature
      const bottomY = 760;
      // Draw Barcode lines
      ctx.textAlign = 'left';
      ctx.direction = 'ltr';
      ctx.fillStyle = '#FFFFFF';
      for (let b = 0; b < 52; b++) {
        const bw = (b % 4 === 0) ? 5 : (b % 2 === 0 ? 3 : 1.5);
        ctx.fillRect(90 + (b * 9), bottomY + 20, bw, 65);
      }
      ctx.font = '14px monospace';
      ctx.fillStyle = '#94A3B8';
      ctx.fillText(`*${activeHero.code}*`, 90, bottomY + 110);

      // Central Official Gold Seal
      ctx.save();
      ctx.translate(width / 2, bottomY + 55);
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 50, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 15px Tajawal, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ختم الاعتماد', 0, -8);
      ctx.fillText('سبيستون 2000-2026', 0, 16);
      ctx.restore();

      // Right: Issue Date & Signature
      ctx.textAlign = 'right';
      ctx.direction = 'rtl';
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 16px Tajawal, sans-serif';
      ctx.fillText('تاريخ الإصدار الفضائي:', width - 90, bottomY + 35);
      ctx.fillStyle = '#F8FAFC';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }), width - 90, bottomY + 65);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px Tajawal, sans-serif';
      ctx.fillText('توقيع قائد الكوكب: طارق العربي طرقان ورشا رزق', width - 90, bottomY + 100);

      // Export canvas to download
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `Spacetoon_Passport_${userName.replace(/\s+/g, '_')}_${activeHero.planet}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Error generating HD Passport:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShareStory = async () => {
    const text = ` استخرجت جواز سفر كواكب سبيستون الرسمي!\nشخصيتي هي: ${activeHero.arabicName} على ${activeHero.planetArabic} \nشجاعتي: ${activeHero.stats.courage}% | وفائي: ${activeHero.stats.loyalty}%\nجرب اختبارك واكتشف بطلك السبيستوني الآن:`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `جواز سفر سبيستون - ${userName}`,
          text: text,
          url: url
        });
        return;
      } catch (_e) {}
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (_e) {}
  };

  return (
    <div className="space-y-10 animate-fade-in text-right font-cairo">
      
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0e172a] via-[#0b1120] to-[#070b14] shadow-2xl p-6 sm:p-10">
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
          <img
            src={galaxyBannerImg}
            alt="Spacetoon Galaxy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className={`space-y-4 max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>{language === 'ar' ? 'ميزة حصرية جديدة • عيش نوستالجيا الطفولة' : 'Exclusive Feature • Childhood Nostalgia'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-tajawal text-white tracking-tight leading-tight">
              {t('passportHeroTitle', 'Official Spacetoon Hero Passport')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">
                {language === 'ar' ? 'وبطاقة هوية البطل الرسمي' : '& Official Hero Identity Card'}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'أجب عن 4 أسئلة سريعة لنحدد كوكبك وشخصيتك الكرتونية التي كبرت معها، واستخرج بطاقة هويتك الفضائية الرسمية المعتمدة بختم سبيستون لتحميلها ومشاركتها في ستوري إنستغرام وتيك توك!'
                : 'Answer 4 quick questions to discover your matching Spacetoon hero and planet, then issue and download your high-resolution passport badge!'}
            </p>

            {currentStep === 'result' && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleRetakeQuiz}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'إعادة الاختبار' : 'Retake Quiz'}</span>
                </button>
                <button
                  onClick={handleDownloadHDCard}
                  disabled={isDownloading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isDownloading ? (language === 'ar' ? 'جاري تجهيز الهوية...' : 'Generating HD Badge...') : (language === 'ar' ? 'تحميل البطاقة الرسمية HD' : 'Download HD Badge')}</span>
                </button>
              </div>
            )}
          </div>

          {/* Golden Spacetoon Badge Display */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition duration-700" />
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-black/60 shadow-2xl p-2 flex items-center justify-center">
              <img
                src={heroBadgeImg}
                alt="Spacetoon Badge"
                className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-3 inset-x-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-center border border-amber-400/30 text-[11px] font-bold text-amber-300">
                منظمة فرسان سبيستون 2000
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Quiz OR Result View */}
      {currentStep === 'quiz' ? (
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Progress Bar */}
          <div className="p-6 rounded-2xl bg-[#0e1422] border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-400">السؤال {currentQuestionIndex + 1} من {QUIZ_QUESTIONS.length}</span>
              <span className="text-slate-400">
                نسبة الإنجاز: {Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-500 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Question Card */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0e1422] border border-white/10 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                <span>تحليل بوصلة الطفولة</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-white">
                {QUIZ_QUESTIONS[currentQuestionIndex].question}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {QUIZ_QUESTIONS[currentQuestionIndex].subtitle}
              </p>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {QUIZ_QUESTIONS[currentQuestionIndex].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(opt.heroId)}
                  className="group relative p-4 sm:p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-amber-400/50 text-right transition-all duration-300 cursor-pointer flex items-start gap-4 hover:translate-y-[-2px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                    {opt.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                      {opt.text}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom Controls */}
            {currentQuestionIndex > 0 && (
              <div className="pt-4 border-t border-white/5 flex justify-start">
                <button
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السؤال السابق</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Character Picker (If user already knows their hero) */}
          <div className="p-6 rounded-2xl bg-[#0a0f1d] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                <span>أو اختر بطلك المفضل مباشرة وتخطَّ الاختبار:</span>
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {SPACETOON_HEROES.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleDirectSelectHero(h)}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-amber-400/40 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: h.planetColor }} />
                  <span>{h.arabicName}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* Result & Passport / ID Card View */
        <div className="space-y-8 max-w-5xl mx-auto">
          
          {/* Action Bar: Toggle Formats & User Customization */}
          <div className="p-4 sm:p-6 rounded-2xl bg-[#0e1422] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* User Name input & edit */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-slate-400 block font-medium">اسم حامل الجواز:</span>
                {isEditingName ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      defaultValue={userName}
                      id="passport-name-input"
                      className="px-3 py-1 bg-black/60 border border-amber-400/50 rounded-lg text-sm text-white focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const el = document.getElementById('passport-name-input') as HTMLInputElement;
                        saveUserName(el?.value || userName);
                      }}
                      className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-lg cursor-pointer"
                    >
                      حفظ
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{userName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                    >
                      (تعديل الاسم)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Format Switcher: ID Card vs Full Passport */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10">
              <button
                onClick={() => setCardFormat('id-card')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cardFormat === 'id-card'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                بطاقة الهوية الفضائية
              </button>
              <button
                onClick={() => setCardFormat('passport')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  cardFormat === 'passport'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                جواز السفر المفتوح
              </button>
            </div>

            {/* Export & Share Buttons */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={handleShareStory}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="مشاركة على وسائل التواصل"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-sky-400" />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'مشاركة الستوري'}</span>
              </button>

              <button
                onClick={handleDownloadHDCard}
                disabled={isDownloading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'جاري التحميل...' : 'تحميل صورة HD'}</span>
              </button>
            </div>

          </div>

          {/* OFFICIAL SPACETOON PASSPORT / ID CARD CONTAINER */}
          <div className="relative group">
            
            {/* Subtle glow border */}
            <div
              className="absolute -inset-1 rounded-3xl opacity-50 blur-xl transition duration-500 group-hover:opacity-75"
              style={{ background: `linear-gradient(to right, ${activeHero.planetColor}, #D4AF37, #38BDF8)` }}
            />

            {/* CARD BODY */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#090e1c] via-[#0d152a] to-[#060a14] border-2 border-amber-400/50 shadow-2xl p-6 sm:p-10 space-y-8">
              
              {/* Card Holographic Watermark / Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-400/40 p-1 flex items-center justify-center">
                    <img src={heroBadgeImg} alt="Emblem" className="w-full h-full object-contain rounded-xl" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black font-tajawal text-white tracking-wide">
                      منظمة استكشاف كواكب سبيستون
                    </h3>
                    <span className="text-[11px] text-amber-400 font-mono tracking-wider block">
                      SPACETOON GALAXY FEDERATION • OFFICIAL PASSPORT
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-left font-mono">
                    <span className="text-[10px] text-slate-400 block">ID CODE</span>
                    <span className="text-xs font-bold text-amber-300">{activeHero.code}</span>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black border"
                    style={{
                      backgroundColor: `${activeHero.planetColor}20`,
                      borderColor: activeHero.planetColor,
                      color: activeHero.planetColor
                    }}
                  >
                    {activeHero.planetArabic}
                  </span>
                </div>
              </div>

              {/* Identity & Hero Details Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Photo / Avatar Column */}
                <div className="md:col-span-4 flex flex-col items-center space-y-3">
                  <div className="relative w-48 h-60 sm:w-56 sm:h-72 rounded-2xl overflow-hidden border-2 border-amber-400/40 bg-slate-900 shadow-xl group/photo">
                    <img
                      src={activeHero.avatarUrl}
                      alt={activeHero.arabicName}
                      className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Planet Logo Stamp */}
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/20 text-[10px] font-bold text-white flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: activeHero.planetColor }} />
                      <span>{activeHero.planet}</span>
                    </div>

                    {/* Stamped Seal */}
                    <div className="absolute bottom-3 left-3 transform -rotate-12 px-3 py-1 rounded-lg border-2 border-amber-400 bg-amber-500/20 backdrop-blur-md text-[10px] font-black text-amber-300 shadow-md">
                      معتمد سبيستون 
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    VERIFIED SPACE EXPLORER #{activeHero.code.slice(-4)}
                  </span>
                </div>

                {/* Identity Info Column */}
                <div className="md:col-span-8 space-y-6">
                  
                  {/* Name & Title */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>الاسم المعتمد:</span>
                      <span className="text-amber-400 font-bold">{userName}</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-black font-tajawal text-white">
                      {activeHero.arabicName}
                    </h2>
                    <p className="text-sm font-bold text-amber-300">
                      {activeHero.title}
                    </p>
                  </div>

                  {/* Character Traits */}
                  <div className="flex flex-wrap gap-2">
                    {activeHero.traits.map((trait, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-xs text-slate-200 font-medium"
                      >
                         {trait}
                      </span>
                    ))}
                  </div>

                  {/* Radar / Stats Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">الشجاعة</span>
                      <span className="text-lg font-black text-rose-400 font-tajawal">{activeHero.stats.courage}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">الوفاء للأصدقاء</span>
                      <span className="text-lg font-black text-emerald-400 font-tajawal">{activeHero.stats.loyalty}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">الذكاء والتحليل</span>
                      <span className="text-lg font-black text-sky-400 font-tajawal">{activeHero.stats.wisdom}%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <span className="text-[10px] text-slate-400 block font-bold">طاقة الأمل</span>
                      <span className="text-lg font-black text-amber-400 font-tajawal">{activeHero.stats.hope}%</span>
                    </div>
                  </div>

                  {/* Iconic Quote */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-400/20 relative">
                    <span className="text-[11px] text-amber-400 font-bold block mb-1">
                      مقولتك السبيستونية الأسطورية:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-medium italic leading-relaxed">
                      « {activeHero.quote} »
                    </p>
                  </div>

                  {/* Sing in Studio CTA */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    {onNavigateToStudio && (
                      <button
                        onClick={() => onNavigateToStudio(activeHero.themeSongTitle)}
                        className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Music className="w-4 h-4 text-purple-400" />
                        <span>غنِّ {activeHero.themeSongTitle} في الاستوديو </span>
                      </button>
                    )}
                  </div>

                </div>

              </div>

              {/* Card Footer: Barcode & Space Explorer Security Stamp */}
              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-3 font-mono">
                  <div className="flex gap-1 h-8 items-end">
                    {[12, 28, 16, 32, 20, 10, 24, 30, 15, 22, 18, 32, 10, 28].map((h, i) => (
                      <div key={i} className="w-1 bg-white/70" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-500">{activeHero.code}</span>
                </div>

                <div className="flex items-center gap-4 text-center sm:text-right">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>صالح للتنقل عبر كافة كواكب مجرة سبيستون</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Change Hero Selector Bar */}
          <div className="p-6 rounded-2xl bg-[#0e1422] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>هل تشعر أن شخصيتك تشبه بطلاً آخر؟ بدِّل شخصيتك فوراً:</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {SPACETOON_HEROES.map((hero) => {
                const isActive = hero.id === activeHero.id;
                return (
                  <button
                    key={hero.id}
                    onClick={() => setActiveHero(hero)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      isActive
                        ? 'bg-amber-500/15 border-amber-400 text-amber-300 font-bold shadow-md'
                        : 'bg-white/[0.02] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                      <img src={hero.avatarUrl} alt={hero.arabicName} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs truncate w-full">{hero.arabicName.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
