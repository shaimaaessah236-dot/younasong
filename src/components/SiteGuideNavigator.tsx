import React, { useState, useRef, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  Send,
  HelpCircle,
  Mic,
  Trophy,
  Music,
  Piano,
  Film,
  Users,
  Tv,
  Heart,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  Smartphone,
  Download,
  Flame,
  Radio
} from 'lucide-react';
import { askSiteGuideAI, SiteGuideResponse } from './geminiService';
import { PWAInstallModal } from './PWAInstallModal';
import { useLanguage } from '../context/LanguageContext';

interface SiteGuideNavigatorProps {
  onNavigate?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedTab?: string;
  suggestedActionText?: string;
  quickSteps?: string[];
  followUpQuestions?: string[];
  time: string;
}

export const SiteGuideNavigator: React.FC<SiteGuideNavigatorProps> = ({ onNavigate }) => {
  const { language, isRtl, t } = useLanguage();
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatCardRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: language === 'ar'
        ? 'أهلاً وسهلاً بك في منصة Yona Songs! أنا مرشدك ورفيقك الذكي التفاعلي، يسعدني جداً الإجابة على أي استفسار، وشرح كيفية استخدام استوديو الغناء والكاريوكي والتسجيل بالمايك، والمشاركة والتصويت في المسابقات، وتلفزيون سبيستون، وجواز السفر، وكيفية تحميل وتثبيت التطبيق على هاتفك. ما الذي تود معرفته أو استكشافه اليوم؟'
        : 'Welcome to YONA SONGS! I am your interactive AI site navigator and companion. Feel free to ask about the live karaoke studio, microphone recording, grand vocal contest & voting, retro Spacetoon TV, hero passport, and audio tools. How can I assist you today?',
      suggestedTab: 'vocal-studio',
      suggestedActionText: language === 'ar' ? 'الذهاب إلى استوديو الغناء والكاريوكي' : 'Go to Vocal Studio',
      quickSteps: language === 'ar' ? [
        'انقر على الزر بالأسفل للانتقال فوراً لاستوديو الغناء والتسجيل مع الكلمات المضاءة',
        'لتثبيت التطبيق على هاتفك: اضغط قسم "حمّل التطبيق" في خريطة الأقسام بالأسفل',
        'أو اضغط على أحد الأسئلة الجاهزة لسماع الإجابة والشرح فوراً!'
      ] : [
        'Click the button below to navigate to the live vocal studio with synchronized glowing lyrics',
        'To install the PWA app on your phone, click "Install App" below',
        'Or click any of the prompt chips below for instant answers!'
      ],
      followUpQuestions: language === 'ar' ? [
        'كيف أحمل وأثبت تطبيق الموقع على الهاتف؟',
        'كيف أسجل صوتي في استوديو الكاريوكي؟',
        'أين أجد مسابقة الأصوات وكيف أصوت؟',
        'أين أجد تلفزيون سبيستون وجواز السفر؟'
      ] : [
        'How to install the PWA app on mobile?',
        'How to record my voice in the vocal studio?',
        'Where is the Grand Contest and how to vote?',
        'Where to find Retro Spacetoon TV?'
      ],
      time: new Date().toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickPromptChips = language === 'ar' ? [
    'كيف أحمل وأثبت تطبيق الموقع على الهاتف؟',
    'كيف أسجل صوتي في استوديو الكاريوكي؟',
    'كيف أصوت وأشارك في مسابقة الأصوات؟',
    'أين أجد تلفزيون كواكب سبيستون؟',
    'كيف أنشئ جواز سفر سبيستون؟',
    'أين أجد أغاني فضل شاكر وفيروز؟',
    'كيف أعزف المقامات على البيانو؟',
    'كيف أصل لقنوات الأفلام والأنمي؟'
  ] : [
    'How to install the web app on mobile?',
    'How to record vocals in the Karaoke Studio?',
    'How to participate & vote in the Grand Contest?',
    'Where is the Retro Spacetoon TV broadcast?',
    'How to customize my Spacetoon Passport?',
    'Where to find classic and tarab songs?',
    'How to play eastern scales on the Piano?',
    'How to access Telegram cinema & movies?'
  ];

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'pwa-install') {
      setShowPwaModal(true);
    } else if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleAsk = async (questionText?: string, directTab?: string, directAction?: string) => {
    const rawText = (questionText || inputQuestion).trim();
    if (!rawText || loading) return;

    // Scroll chat into view so user sees the response on mobile & desktop
    if (chatCardRef.current) {
      chatCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: rawText,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!questionText) setInputQuestion('');
    setLoading(true);

    // Prepare conversation context for multi-turn conversational AI
    const history = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      text: m.text
    }));

    try {
      // Clean emoji symbols for precise reasoning
      const cleanPrompt = rawText.replace(/^[\p{Emoji}\p{Symbol}\s]+/u, '').trim() || rawText;
      const guideRes: SiteGuideResponse = await askSiteGuideAI(cleanPrompt, undefined, history);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: guideRes.reply,
        suggestedTab: guideRes.suggestedTab || directTab,
        suggestedActionText: guideRes.suggestedActionText || directAction,
        quickSteps: guideRes.quickSteps,
        followUpQuestions: guideRes.followUpQuestions,
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error asking site guide:', err);
      const fallbackTab = directTab || 'vocal-studio';
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: `أهلاً بك! بخصوص "${rawText}": يسعدني إرشادك فوراً! يمكنك استخدام استوديو الغناء والكاريوكي للغناء والتسجيل المباشر بالمايك، أو التوجه إلى قسم المسابقات للتصويت والمنافسة، أو استخدام بيانو المقامات لتعلم العزف. اضغط على الزر بالأسفل للانتقال المباشر أو اسألني تفاصيل أكثر:`,
        suggestedTab: fallbackTab,
        suggestedActionText: directAction || ' فتح استوديو الغناء والكاريوكي',
        quickSteps: [
          'اضغط على الزر بالأسفل للانتقال فوراً للقسم المطلوب',
          'أو اختر أي تبويب من الشريط العلوي للتنقل بحرية',
          'يمكنك سؤالي في أي وقت وسأقوم بإرشادك خطوة بخطوة'
        ],
        followUpQuestions: [
          'كيف أسجل صوتي في استوديو الكاريوكي؟',
          'أين أجد مسابقة الأصوات والتصويت؟'
        ],
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const sectionsList = [
    {
      id: 'pwa-install',
      title: 'حمّل التطبيق على هاتفك',
      icon: Smartphone,
      badge: 'تطبيق الهاتف ',
      color: 'from-amber-500 via-yellow-500 to-amber-600',
      border: 'border-amber-400/50 shadow-amber-500/20',
      description: 'ثبّت تطبيق YONA SONGS الرسمي على هاتفك (أندرويد / آيفون / كمبيوتر) بدون متجر، سريع وملء الشاشة ويعمل بدون إنترنت.',
      isModalAction: true
    },
    {
      id: 'vocal-studio',
      title: 'استوديو الغناء والكاريوكي',
      icon: Mic,
      badge: 'تسجيل وتقييم',
      color: 'from-purple-600 to-indigo-700',
      border: 'border-purple-500/40',
      description: 'غنّ بالمايك مع كلمات متزامنة ومضاءة، اختر شارات سبيستون أو فضل شاكر وفيروز، وسجل صوتك مع مؤثرات الصدى وتقييمك الفوري.'
    },
    {
      id: 'community',
      title: 'المسابقات والتصويت',
      icon: Trophy,
      badge: 'جوائز وكويز',
      color: 'from-amber-600 to-rose-700',
      border: 'border-amber-500/40',
      description: 'استمع لأصوات المبدعين في مسابقة الشهر، صوّت لأفضل أداء، شارك بصوتك، ونافس في لوحة المتصدرين واختبار الكويز.'
    },
    {
      id: 'spacetoon-tv',
      title: 'تلفزيون كواكب سبيستون',
      icon: Radio,
      badge: 'بث متواصل ',
      color: 'from-sky-500 via-blue-600 to-indigo-700',
      border: 'border-sky-500/40',
      description: 'شاهد واستمع لبث كواكب سبيستون العشرة (مغامرات، كوميديا، أكشن، زمردة، رياضة، علوم، تاريخ، بون بون، أبجد، أفلام).'
    },
    {
      id: 'passport',
      title: 'جواز سفر سبيستون',
      icon: Flame,
      badge: 'هوية تفاعلية ',
      color: 'from-emerald-500 to-teal-700',
      border: 'border-emerald-500/40',
      description: 'أنشئ جواز سفرك السبيستوني التفاعلي، اختر كوكبك المفضل وشخصيتك ورتبتك وشاركه كبطاقة تذكارية.'
    },
    {
      id: 'directory',
      title: 'الدليل الصوتي والشارات',
      icon: Music,
      badge: 'بدون موسيقى',
      color: 'from-blue-600 to-cyan-700',
      border: 'border-blue-500/40',
      description: 'تصفح مئات الشارات والأغاني بدون موسيقى، الفلاتر الدقيقة حسب نوع الصوت والـ BPM والمقامات مع مشغل صوت مدمج.'
    },
    {
      id: 'tools',
      title: 'بيانو المقامات وعازل الصوت',
      icon: Piano,
      badge: 'عزف وتدريب',
      color: 'from-emerald-600 to-teal-700',
      border: 'border-emerald-500/40',
      description: 'بيانو تفاعلي لتعلم المقامات (نهاوند، كرد، بياتي، صبا)، مدوزن النغمات، وعازل الصوت الذكي بالذكاء الاصطناعي.'
    },
    {
      id: 'telegram',
      title: 'السينما وتيليجرام',
      icon: Film,
      badge: 'مشاهدة وتحميل',
      color: 'from-sky-600 to-blue-800',
      border: 'border-sky-500/40',
      description: 'روابط مباشرة لأفضل قنوات وبوتات تيليجرام لمشاهدة وتحميل الأفلام والمسلسلات والأنمي بجودة عالية 1080p.'
    },
    {
      id: 'artists',
      title: 'دليل الفنانين والملحنين',
      icon: Users,
      badge: 'عمالقة الفن',
      color: 'from-fuchsia-600 to-pink-700',
      border: 'border-fuchsia-500/40',
      description: 'استكشف مسيرة كبار الفنانين: طارق العربي طرقان، رشا رزق، فضل شاكر، إيمي هيتاري، عاصم سكر ومقامات أعمالهم.'
    },
    {
      id: 'anime',
      title: 'دليل الأنمي وسبيستون',
      icon: Tv,
      badge: 'ذكريات الطفولة',
      color: 'from-violet-600 to-purple-800',
      border: 'border-violet-500/40',
      description: 'استعرض مسلسلات الأنمي الكلاسيكية (كونان، القناص، دراغون بول، ريمي) والقصة وقوائم الشارات الخاصة بكل عمل.'
    },
    {
      id: 'favorites',
      title: 'المفضلة المحفوظة',
      icon: Heart,
      badge: 'تسجيلاتك',
      color: 'from-rose-600 to-pink-800',
      border: 'border-rose-500/40',
      description: 'قائمتك الشخصية التي تضم جميع الشارات والأغاني التي قمت بوضع إشارة القلب عليها للاستماع السريع في أي وقت.'
    }
  ];

  const quickFaqItems = [
    {
      q: ' كيف أحمل وأثبت تطبيق YONA SONGS على هاتفي؟',
      targetTab: 'pwa-install',
      actionText: ' فتح نافذة تحميل وتثبيت التطبيق',
      shortAnswer: 'اضغط على زر التثبيت، ثم اختر "إضافة إلى الشاشة الرئيسية" في هاتفك ليصبح التطبيق على شاشتك فوراً.'
    },
    {
      q: ' كيف أستخدم استوديو الغناء وأسجل صوتي؟',
      targetTab: 'vocal-studio',
      actionText: ' الانتقال إلى استوديو الغناء والكاريوكي',
      shortAnswer: 'انتقل لتبويب "استوديو الغناء"، حدد الأغنية، واضغط زر المايكروفون لبدء التسجيل مع الكلمات المضاءة.'
    },
    {
      q: ' أين أجد مسابقة أفضل أداء صوتي وكيف أصوت؟',
      targetTab: 'community',
      actionText: ' الانتقال إلى قسم المسابقات والتصويت',
      shortAnswer: 'في تبويب "المسابقات والتصويت"، استمع لمشاركات المتسابقين واضغط زر التصويت  لمرشحك المفضل.'
    },
    {
      q: ' أين أجد تلفزيون كواكب سبيستون البث المتواصل؟',
      targetTab: 'spacetoon-tv',
      actionText: ' فتح تلفزيون كواكب سبيستون',
      shortAnswer: 'في تبويب "تلفزيون سبيستون"، تنقل بين كواكب مغامرات، كوميديا، زمردة، أكشن واستمتع بالبث المباشر.'
    },
    {
      q: ' كيف أصمم جواز سفر سبيستون التفاعلي؟',
      targetTab: 'passport',
      actionText: ' فتح جواز سفر سبيستون',
      shortAnswer: 'في تبويب "جواز السفر"، اكتب اسمك واختر كوكبك المفضل ورتبتك لتوليد هويتك السبيستونية التذكارية.'
    },
    {
      q: ' أين أجد أغاني وألحان فضل شاكر وفيروز؟',
      targetTab: 'vocal-studio',
      actionText: ' فتح استوديو الغناء لأغاني فضل شاكر وفيروز',
      shortAnswer: 'في "استوديو الغناء" توجد أغاني (يا غايب، لو على قلبي، كان عنا طاحون، سهر الليالي، بتونس بيك).'
    },
    {
      q: ' كيف أتعلم المقامات الموسيقية وأعزف على البيانو؟',
      targetTab: 'tools',
      actionText: ' فتح بيانو المقامات والأدوات الموسيقية',
      shortAnswer: 'افتح تبويب "الأدوات الموسيقية"، اختر المقام (نهاوند/كرد/بياتي) واضغط مفاتيح البيانو التفاعلي لسماع النغمات.'
    },
    {
      q: ' كيف أصل لقنوات وبوتات تيليجرام للأفلام والأنمي؟',
      targetTab: 'telegram',
      actionText: ' فتح قنوات السينما وتيليجرام',
      shortAnswer: 'انتقل لتبويب "تيليجرام وسينما" واضغط على أي قناة أو بوت للفتح الفوري في تطبيق تيليجرام.'
    },
    {
      q: ' كيف أحفظ الشارة في قائمة المفضلة لدي؟',
      targetTab: 'directory',
      actionText: ' الذهاب إلى الدليل الصوتي لاختيار المفضلة',
      shortAnswer: 'في "الدليل الصوتي"، اضغط على أيقونة القلب على أي بطاقة أغنية وستظهر فوراً في تبويب "المفضلة".'
    }
  ];

  return (
    <div className="space-y-8 text-right font-cairo">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10192e] via-[#0d1424] to-[#080d1a] border border-blue-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 animate-spin" />
              <span>دليلك ومرشدك الذكي التفاعلي </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-white flex items-center gap-3">
              <span>مرشد الموقع والمساعد الإرشادي الذكي</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              هل تبحث عن مكان الغناء والكاريوكي؟ تريد المشاركة والتصويت في المسابقات؟ أو ترغب في معرفة كيفية استخدام أي ميزة في الموقع؟ اسألني وسأجيبك فوراً بالخطوات وأزرار الانتقال المباشر!
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <div className="text-xl font-bold text-amber-400">8+</div>
              <div className="text-[11px] text-gray-400">أقسام تفاعلية</div>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-black/40 border border-white/10 text-center">
              <div className="text-xl font-bold text-purple-400">فوري </div>
              <div className="text-[11px] text-gray-400">إرشاد وتوجيه ذكي</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Guide & Chat Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Chat / Q&A Box */}
        <div className="lg:col-span-2 space-y-4">
          <div ref={chatCardRef} className="p-5 sm:p-6 rounded-3xl bg-[#0b1220] border border-blue-500/20 shadow-xl flex flex-col h-[600px]">
            
            {/* Chat Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-600/20">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>محادثة الإرشاد والمساعدة الفورية</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-[11px] text-gray-400">إجابة ذكية وتفاعلية فورية مع إرشاد شامل لجميع الأقسام</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setMessages([
                    {
                      id: `welcome-${Date.now()}`,
                      sender: 'assistant',
                      text: 'أهلاً بك مجدداً! تم بدء محادثة جديدة. ما هو استفسارك أو ما الذي تود تجربته في الموقع؟ ',
                      suggestedTab: 'vocal-studio',
                      suggestedActionText: ' جرب استوديو الغناء والكاريوكي',
                      quickSteps: [
                        'اكتب سؤالك في الصندوق بالأسفل',
                        'أو انقر على أحد الأسئلة السريعة في الشريط أو القائمة الجانبية'
                      ],
                      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
                    }
                  ]);
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer"
                title="محادثة جديدة"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">محادثة جديدة</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 pl-2 text-xs sm:text-sm custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'} space-y-2`}
                >
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] p-4 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-900/30'
                        : 'bg-black/60 border border-white/10 text-gray-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1 border-b border-white/10 text-[10px] text-gray-300">
                      <span className="font-bold flex items-center gap-1">
                        {msg.sender === 'user' ? 'أنت' : ' رفيق Yona Songs الذكي'}
                      </span>
                      <span className="opacity-70">{msg.time}</span>
                    </div>

                    {/* Text Body */}
                    <div className="leading-relaxed whitespace-pre-wrap font-medium text-gray-100 text-xs sm:text-sm">
                      {msg.text}
                    </div>

                    {/* Quick Steps if present */}
                    {msg.quickSteps && msg.quickSteps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <div className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>الخطوات المباشرة:</span>
                        </div>
                        <div className="space-y-1.5">
                          {msg.quickSteps.map((step, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-start gap-2 text-[11px] sm:text-xs text-gray-300 bg-white/5 p-2 rounded-xl border border-white/5"
                            >
                              <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-300 font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <span className="leading-normal">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button if suggested tab */}
                    {msg.suggestedTab && (
                      <div className="mt-3 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.suggestedTab === 'pwa-install') {
                              setShowPwaModal(true);
                            } else if (onNavigate && msg.suggestedTab) {
                              onNavigate(msg.suggestedTab);
                            }
                          }}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-black font-black text-xs sm:text-sm shadow-lg shadow-amber-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-95"
                        >
                          <span>{msg.suggestedActionText || 'الانتقال إلى هذا القسم مباشرة'}</span>
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Follow Up Questions */}
                    {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                        <span className="text-[10px] text-gray-400 font-bold w-full">أسئلة مقترحة:</span>
                        {msg.followUpQuestions.map((fq, fqIdx) => (
                          <button
                            key={fqIdx}
                            type="button"
                            onClick={() => handleAsk(fq)}
                            className="text-[11px] px-2.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-800 text-blue-200 border border-blue-500/30 hover:border-blue-400 transition-all text-right cursor-pointer"
                          >
                             {fq}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="p-3.5 rounded-2xl bg-black/70 border border-blue-500/30 text-blue-200 flex items-center gap-2.5 text-xs shadow-lg">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>جاري التفكير وصياغة الإجابة التفاعلية...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* In-Chat Quick Questions Chips */}
            <div className="pt-2 pb-1">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 custom-scrollbar text-[11px] whitespace-nowrap">
                <span className="text-gray-400 text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>أسئلة جاهزة:</span>
                </span>
                {quickPromptChips.map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    onClick={() => handleAsk(chip)}
                    className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-blue-600/30 border border-white/10 hover:border-blue-400/50 text-gray-300 hover:text-white transition-all text-[11px] cursor-pointer flex-shrink-0"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="pt-2 border-t border-white/10">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAsk();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  placeholder="اسألني أي سؤال: كيف أسجل صوتي؟ أين المسابقات؟ أين أغاني فضل شاكر وفيروز؟..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#060a12] border border-blue-500/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                />
                <button
                  type="submit"
                  disabled={loading || !inputQuestion.trim()}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">إرسال</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Quick FAQ Cards with Direct Action Buttons */}
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#0b1220] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">الأسئلة الشائعة والإرشاد الفوري </h3>
              </div>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
              {quickFaqItems.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="p-3.5 rounded-2xl bg-black/40 hover:bg-blue-950/40 border border-white/5 hover:border-blue-500/30 transition-all text-right space-y-2"
                >
                  <div 
                    onClick={() => handleAsk(faq.q, faq.targetTab, faq.actionText)}
                    className="text-xs font-bold text-gray-200 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    {faq.q}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {faq.shortAnswer}
                  </p>
                  
                  {/* Two Buttons: Ask / Direct Navigate */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleAsk(faq.q, faq.targetTab, faq.actionText)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-900/40 hover:bg-blue-800 text-blue-200 border border-blue-500/30 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>شرح وإجابة</span>
                    </button>

                    {/* Direct Navigate */}
                    <button
                      type="button"
                      onClick={() => handleSectionClick(faq.targetTab)}
                      className="py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                      title="انتقال مباشر للقسم أو فتح التحميل"
                    >
                      <span>{faq.targetTab === 'pwa-install' ? 'تثبيت التطبيق' : 'فتح القسم'}</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Site Sections Directory Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black font-tajawal text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>خريطة وأقسام الموقع الرئيسية (الانتقال المباشر)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">اضغط على أي قسم للانتقال إليه فوراً والبدء باستخدامه أو تحميل التطبيق</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sectionsList.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.id}
                onClick={() => handleSectionClick(sec.id)}
                className={`p-4 rounded-3xl bg-[#090e1a] hover:bg-[#0d1526] border ${sec.border} hover:border-white/40 shadow-lg hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between group transform hover:-translate-y-1 ${
                  sec.id === 'pwa-install' ? 'ring-2 ring-amber-400/40 hover:ring-amber-400' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${sec.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      sec.id === 'pwa-install' 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 animate-pulse' 
                        : 'bg-white/10 text-gray-300 border-white/10'
                    }`}>
                      {sec.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed line-clamp-3">
                      {sec.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-amber-400 transition-colors">
                  <span>{sec.id === 'pwa-install' ? 'تثبيت وتحميل الآن ' : 'فتح القسم الآن'}</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={showPwaModal}
        onClose={() => setShowPwaModal(false)}
      />

    </div>
  );
};
