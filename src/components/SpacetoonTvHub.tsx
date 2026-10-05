import React, { useState, useEffect, useRef } from 'react';
import {
  Tv,
  Power,
  Volume2,
  VolumeX,
  Volume1,
  RotateCcw,
  Sparkles,
  Radio,
  Mic,
  MicOff,
  Sliders,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  FileText,
  Clock,
  Info,
  Layers,
  Flame,
  Star,
  ExternalLink,
  Music,
  Share2,
  Check,
  Compass,
  Film,
  Disc,
  Headphones,
  Square,
  Volume,
  AlertCircle
} from 'lucide-react';
import { spacetoonTvAudio } from '../lib/spacetoonTvAudio';
import tvRoomBackdrop from '../assets/images/spacetoon_crt_tv_room_1790293377101.jpg';
import spacetoonWatermarkImg from '../assets/images/spacetoon_screen_watermark_1790294083294.jpg';
import { SpacetoonMicrophone } from './SpacetoonMicrophone';
import { useLanguage } from '../context/LanguageContext';
import { validateAudioFileUpload } from '../lib/securityProtection';

export interface SpacetoonPlanetChannel {
  id: string;
  channelNum: number;
  name: string;
  arabicName: string;
  tagline: string;
  color: string;
  bgColor: string;
  badgeBg: string;
  officialVideoId: string;
  officialSongTitle: string;
  announcerQuote: string;
  funFact: string;
  schedule: string[];
}

// Exact 10 Official Spacetoon Planets provided by user from playlist PLgEFlVFZclx2aPjheFHXUmjnA8wswuyL4
export const SPACETOON_PLANETS: SpacetoonPlanetChannel[] = [
  {
    id: 'action',
    channelNum: 1,
    name: 'Action',
    arabicName: 'كوكب أكشن',
    tagline: 'كوكب الإثارة والغموض',
    color: '#EF4444',
    bgColor: 'from-red-950 via-slate-900 to-black',
    badgeBg: 'bg-red-500/20 text-red-300 border-red-500/40',
    officialVideoId: 'JX4fvH6GG2A',
    officialSongTitle: 'أغنية وشارة كوكب أكشن الأصلية',
    announcerQuote: '«تشاهدون الآن على كوكب أكشن.. كوكب الإثارة والغموض!»',
    funFact: 'شارة كوكب أكشن هي الأكثر حماساً وشهرة، ارتبطت بالمعارك الأسطورية والمحقق كونان ودراجون بول.',
    schedule: [
      '04:00 عصراً: المحقق كونان (الجزء الثالث)',
      '04:30 عصراً: هزيم الرعد (صقر الفضاء)',
      '05:00 مساءً: أجنحة الكاندام',
      '05:30 مساءً: دراجون بول زد'
    ]
  },
  {
    id: 'zomoroda',
    channelNum: 2,
    name: 'Zomoroda',
    arabicName: 'كوكب زمردة',
    tagline: 'كوكب للبنات فقط وعالم الأحلام والرقة',
    color: '#EC4899',
    bgColor: 'from-pink-950 via-slate-900 to-black',
    badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    officialVideoId: 'rg7ln3q_NBE',
    officialSongTitle: 'أغنية وشارة كوكب زمردة الأصلية',
    announcerQuote: '«أهلاً بكن في كوكب زمردة.. كوكب للبنات فقط!»',
    funFact: 'شارة كوكب زمردة أبدعت فيها رشا رزق بصوتها الرقيق الذي عبر عن عالم الأحلام والرقة.',
    schedule: [
      '03:00 عصراً: دروب ريمي (أنتي الأمان)',
      '03:30 عصراً: سالي الصغيرة',
      '04:00 عصراً: أيروكا (رسمت بيتاً)',
      '04:30 عصراً: لحن الحياة'
    ]
  },
  {
    id: 'adventure',
    channelNum: 3,
    name: 'Adventure',
    arabicName: 'كوكب مغامرات',
    tagline: 'كوكب الخيال والتشويق',
    color: '#10B981',
    bgColor: 'from-emerald-950 via-slate-900 to-black',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    officialVideoId: 'cL8XUlMbQhE',
    officialSongTitle: 'أغنية وشارة كوكب مغامرات الأصلية',
    announcerQuote: '«استعدوا للرحيل نحو المجهول.. أنتم تشاهدون كوكب مغامرات، كوكب الخيال والتشويق!»',
    funFact: 'كوكب مغامرات جمع بين أبطال الديجيتال، القناص، وماوكلي في رحلات استكشاف لا تُنسى.',
    schedule: [
      '05:00 مساءً: أبطال الديجيتال (عالم الأرقام)',
      '05:30 مساءً: القناص (قد لمعت عيناه)',
      '06:00 مساءً: الصياد الصغير',
      '06:30 مساءً: بوكيمون'
    ]
  },
  {
    id: 'sports',
    channelNum: 4,
    name: 'Sports',
    arabicName: 'كوكب رياضة',
    tagline: 'كوكب النشاط والتحدي والقوة',
    color: '#0EA5E9',
    bgColor: 'from-sky-950 via-slate-900 to-black',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    officialVideoId: 'qLIAfgfrT3s',
    officialSongTitle: 'أغنية وشارة كوكب رياضة الأصلية',
    announcerQuote: '«هيا بنا إلى الميدان.. كوكب رياضة، كوكب التحدي والقوة!»',
    funFact: 'شارة كوكب رياضة تميزت بالإيقاع الحماسي السريع الذي كان يشعل الحماس قبل مباريات الكابتن ماجد وسلام دانك.',
    schedule: [
      '02:00 ظهراً: الكابتن ماجد ضد بسام',
      '02:30 ظهراً: سلام دانك (المباراة الحاسمة)',
      '03:00 عصراً: بي بليد (صراع البلابل)',
      '03:30 عصراً: شوت'
    ]
  },
  {
    id: 'comedy',
    channelNum: 5,
    name: 'Comedy',
    arabicName: 'كوكب كوميديا',
    tagline: 'كوكب الضحك والمرح',
    color: '#F59E0B',
    bgColor: 'from-amber-950 via-slate-900 to-black',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    officialVideoId: '4SO1Nq2QSmo',
    officialSongTitle: 'أغنية وشارة كوكب كوميديا الأصلية',
    announcerQuote: '«استعدوا للضحك من صميم القلب.. كوكب كوميديا، كوكب الضحك والمرح!»',
    funFact: 'شارة كوكب كوميديا أدخلت البهجة بكلماتها وأصوات الضحكات الطريفة في بداية كل حلقة من كابامارو والضاحكون.',
    schedule: [
      '01:00 ظهراً: نينجا المغامر كابامارو',
      '01:30 ظهراً: القناع الأخضر',
      '02:00 ظهراً: الضاحكون',
      '02:30 ظهراً: توم وجيري'
    ]
  },
  {
    id: 'history',
    channelNum: 6,
    name: 'History',
    arabicName: 'كوكب تاريخ',
    tagline: 'كوكب من قاع الزمان وفرسان الماضي',
    color: '#D97706',
    bgColor: 'from-yellow-950 via-slate-900 to-black',
    badgeBg: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/40',
    officialVideoId: '3ZHBZVAeU3o',
    officialSongTitle: 'أغنية وشارة كوكب تاريخ الأصلية',
    announcerQuote: '«من عَبَق التاريخ والبطولة.. نلتقي بفرسان الماضي على كوكب تاريخ!»',
    funFact: 'شارة كوكب تاريخ حملت نغمة أوركسترالية مهيبة تجعلك تشعر بفروسية عهد الأصدقاء وصقور الأرض وروبن هود.',
    schedule: [
      '06:00 مساءً: عهد الأصدقاء (روميو وألفريدو)',
      '06:30 مساءً: صقور الأرض',
      '07:00 مساءً: روبن هود فتى الغابة',
      '07:30 مساءً: البؤساء'
    ]
  },
  {
    id: 'science',
    channelNum: 7,
    name: 'Science',
    arabicName: 'كوكب علوم',
    tagline: 'كوكب الاكتشاف والمعرفة',
    color: '#6366F1',
    bgColor: 'from-indigo-950 via-slate-900 to-black',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    officialVideoId: 't4dPIuxNd_Y',
    officialSongTitle: 'أغنية وشارة كوكب علوم الأصلية',
    announcerQuote: '«افتحوا عقولكم للاكتشاف.. كوكب علوم، كوكب الاكتشاف والمعرفة!»',
    funFact: 'شارة كوكب علوم رافقت أجيالاً في تعلم أسرار الفضاء والذرة مع باص المدرسة العجيب ودودة الكتب.',
    schedule: [
      '11:00 صباحاً: باص المدرسة العجيب',
      '11:30 صباحاً: أسرار المحيط والأعماق',
      '12:00 ظهراً: موسوعة الفضاء مع دودة الكتب',
      '12:30 ظهراً: فلونة في الجزيرة'
    ]
  },
  {
    id: 'bonbon',
    channelNum: 8,
    name: 'Bon Bon',
    arabicName: 'كوكب بون بون',
    tagline: 'كوكب الأبطال الكبار والصغار',
    color: '#F97316',
    bgColor: 'from-orange-950 via-slate-900 to-black',
    badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    officialVideoId: 'D_VvcNBGy78',
    officialSongTitle: 'أغنية وشارة كوكب بون بون الأصلية',
    announcerQuote: '«إلى أحبائنا الصغار والأبطال الكبار.. كوكب بون بون يرحب بكم!»',
    funFact: 'شارة كوكب بون بون كانت الرفيق الصباحي الدافئ كل يوم جمعة مع بابار ودبدوب المحبوب.',
    schedule: [
      '09:00 صباحاً: بابار الفيل',
      '09:30 صباحاً: دبدوب المحبوب',
      '10:00 صباحاً: حكايات ما أحلاها',
      '10:30 صباحاً: فيفي والزهرات'
    ]
  },
  {
    id: 'movies',
    channelNum: 9,
    name: 'Movies',
    arabicName: 'كوكب أفلام',
    tagline: 'كوكب السينما السبيستونية الكبرى',
    color: '#8B5CF6',
    bgColor: 'from-purple-950 via-slate-900 to-black',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    officialVideoId: 'LYbBL7MR-DQ',
    officialSongTitle: 'أغنية وشارة كوكب أفلام الأصلية',
    announcerQuote: '«سهرة الجمعة مع سبيستون بيكتشرز.. كوكب أفلام، سينما الطفولة!»',
    funFact: 'شارة كوكب أفلام أعلنت عن سهرات السينما الأسبوعية وأفلام كونان ودراجون بول الطويلة.',
    schedule: [
      '08:00 مساءً: فيلم المحقق كونان السينمائي',
      '10:00 مساءً: فيلم دراجون بول زد (المعركة الكبرى)',
      '11:30 مساءً: فيلم صقور الأرض الخاص'
    ]
  },
  {
    id: 'abjad',
    channelNum: 10,
    name: 'Abjad',
    arabicName: 'كوكب أبجد',
    tagline: 'كوكب الأرقام والحروف والبدايات',
    color: '#14B8A6',
    bgColor: 'from-teal-950 via-slate-900 to-black',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    officialVideoId: '_Y27AAE29rc',
    officialSongTitle: 'أغنية وشارة كوكب أبجد الأصلية',
    announcerQuote: '«ألف باء تاء ثاء.. كوكب أبجد ينير عقول الصغار بأجمل الحروف وأصدق الكلمات!»',
    funFact: 'شارة كوكب أبجد حفظتها ملايين العائلات كأول لحن تعليمي مرح للحروف العربية والأرقام.',
    schedule: [
      '08:00 صباحاً: افتح يا سمسم',
      '08:30 صباحاً: تعلم الحروف مع كوكب أبجد',
      '09:00 صباحاً: حكايات عالمية'
    ]
  }
];

// Classic Vintage Bumpers compilation videos
const VINTAGE_SPACETOON_BUMPERS_VIDEO_ID = 'PI7dv0hlxF4';
const VINTAGE_SANOUD_OUDNA_VIDEO_ID = 'r5VLzdgVMVQ';

// Famous Spacetoon Narrator Quotes for instant playback
const FAMOUS_ANNOUNCER_PHRASES = [
  { text: 'سبيستون.. قناة شباب المستقبل', title: 'شعار القناة الرسمي' },
  { text: 'تشاهدون الآن على كوكب أكشن.. كوكب الإثارة والغموض!', title: 'فاصل كوكب أكشن' },
  { text: 'أهلاً بكن في كوكب زمردة.. كوكب للبنات فقط!', title: 'فاصل كوكب زمردة' },
  { text: 'استعدوا للرحيل نحو المجهول.. على كوكب مغامرات!', title: 'فاصل كوكب مغامرات' },
  { text: 'هيا بنا إلى الميدان.. كوكب رياضة، كوكب التحدي والقوة!', title: 'فاصل كوكب رياضة' },
  { text: 'سبيستون.. سنعود بعد قليل!', title: 'فاصل سنعود بعد قليل' },
  { text: 'عُــــدنــــا!', title: 'فاصل عُـــدنـــا' }
];

export interface VintageArchiveTape {
  id: string;
  title: string;
  category: string;
  videoId: string;
  icon: string;
  badge: string;
  description: string;
}

// Complete Nostalgic Archive Tapes requested by user
export const VINTAGE_SPACETOON_TAPES: VintageArchiveTape[] = [
  {
    id: 'bumpers-classic',
    title: 'فواصل كواكب سبيستون القديمة الأصلية 2000-2005',
    category: 'فواصل كلاسيكية',
    videoId: 'PI7dv0hlxF4',
    icon: '',
    badge: 'شريط الكواكب',
    description: 'تجميعة نادرة لجميع فواصل كواكب سبيستون وشعاراتها الأولى.'
  },
  {
    id: 'bumpers-extra',
    title: 'المزيد من فواصل سبيس القديمة والنادرة',
    category: 'أرشيف تلفزيوني',
    videoId: 'HkDIRU9nA1Y',
    icon: '',
    badge: 'فواصل إضافية',
    description: 'نوادر فواصل سبيستون وإعلانات البرامج وشريط الذكريات القديم.'
  },
  {
    id: 'sanoud-oudna',
    title: 'فواصل «سبيستون.. سنعود بعد قليل» و «عُـــدنـــا!»',
    category: 'فواصل البث',
    videoId: 'r5VLzdgVMVQ',
    icon: '',
    badge: 'سنعود بعد قليل',
    description: 'الفاصل الأشهر في تاريخ القناة عند الذهاب للإعلانات والعودة.'
  },
  {
    id: 'doll-haya',
    title: 'أغاني الدمية هيا الشهيرة (كوكب بون بون وزمردة)',
    category: 'أغاني الأطفال',
    videoId: 'p5638FHo8as',
    icon: '',
    badge: 'الدمية هيا',
    description: 'أجمل أغاني الدمية هيا التفاعلية المحبوبة لجيل سبيستون.'
  },
  {
    id: 'moda-mody',
    title: 'تجميعة أغاني مودا ومودي التوعوية المرحة',
    category: 'أغاني وسلوكيات',
    videoId: 'OJ8rL0BWiwI',
    icon: '',
    badge: 'مودا ومودي',
    description: 'مغامرات وأغاني التوأم مودا ومودي مع النصائح والأناشيد الجميلة.'
  },
  {
    id: 'folfol-song',
    title: 'أغنية «اسمي فلفول» الفيل المحبوب',
    category: 'أغاني بون بون',
    videoId: 'mngydiyVLrg',
    icon: '',
    badge: 'اسمي فلفول',
    description: 'الأغنية الفردية الأصلية لفلفول الفيل الصغير الطريف.'
  },
  {
    id: 'folfol-collection',
    title: 'تجميعة أغاني فلفول الكاملة والمرحة',
    category: 'أغاني الأطفال',
    videoId: 'Qe4WjnAimxY',
    icon: '',
    badge: 'أغاني فلفول',
    description: 'باقة كاملة من أغاني ومقاطع فلفول المحبوبة لجميع الأطفال.'
  },
  {
    id: 'iruka-collection',
    title: 'تجميعة أغاني إيروكا الأسطورية (رشا رزق)',
    category: 'شارة وأغاني الأنمي',
    videoId: 'lhV6kaoZE5E',
    icon: '',
    badge: 'نجمة الأحلام',
    description: 'رسمت بيتاً، خذني إلى الشمس، لا تبكِ يا صغيري.. كاملة بصوت رشا رزق.'
  },
  {
    id: 'space-power',
    title: 'تجميعة شارات قناة سبيس باور (Space Power)',
    category: 'سبيس باور للشباب',
    videoId: '_1cLkKR2vZA',
    icon: '',
    badge: 'سبيس باور',
    description: 'شارات القناة الشقيقة سبيس باور (ناروتو، بليتش، صانع السلام، شينوبي).'
  }
];

interface SpacetoonTvHubProps {
  onNavigateToStudio?: () => void;
  onNavigateToSongs?: () => void;
}

export const SpacetoonTvHub: React.FC<SpacetoonTvHubProps> = ({
  onNavigateToStudio,
  onNavigateToSongs,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();

  // TV Power State (يطفيو ويشعلو)
  const [isTvOn, setIsTvOn] = useState(true);
  const [activeChannelIndex, setActiveChannelIndex] = useState(0);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  
  // Media Display Mode:
  // 'tv-video': Full Audio + Video inside CRT Television (شغلهم في التلفاز بالصوت والصورة وبطابع قديم)
  // 'tapes-archive': Vintage Nostalgia Tapes (فواصل وأشرطة سبيستون النادرة)
  // 'audio-only': Audio Only mode with Retro Radio / Cassette Tuner (دير ليهم غير الصوت عوض لحن)
  // 'announcer-studio': Spacetoon Announcer Voice Studio & Dubbing Mic (استوديو معلق سبيستون مع الصورة والمايك)
  const [mediaMode, setMediaMode] = useState<'tv-video' | 'tapes-archive' | 'audio-only' | 'announcer-studio'>('tv-video');
  const [selectedTapeId, setSelectedTapeId] = useState<string>('bumpers-classic');

  // Video and Timestamp
  const [currentVideoId, setCurrentVideoId] = useState<string>(SPACETOON_PLANETS[0].officialVideoId);
  const [currentTimestamp, setCurrentTimestamp] = useState<number>(0);

  // Visual Effects
  const [hasScanlines, setHasScanlines] = useState(true);
  const [isChannelTuning, setIsChannelTuning] = useState(false);
  const [showOsd, setShowOsd] = useState(true);
  const [osdMessage, setOsdMessage] = useState('');
  
  // Interstitial States (الفواصل التفاعلية)
  const [interstitialState, setInterstitialState] = useState<'none' | 'sanoud' | 'oudna'>('none');
  const [showProgramTicker, setShowProgramTicker] = useState(true);
  
  // Announcer Voice Recording State (الميكروفون وتسجيل صوت المعلق)
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordedVoiceBlob, setRecordedVoiceBlob] = useState<Blob | null>(null);
  const [recordedVoiceUrl, setRecordedVoiceUrl] = useState<string | null>(null);
  const [isAnnouncerAudioPlaying, setIsAnnouncerAudioPlaying] = useState(false);
  const [announcerActivePhrase, setAnnouncerActivePhrase] = useState('');
  const [tvCustomAnnouncerText, setTvCustomAnnouncerText] = useState('');
  const [showTvMicTroubleshooter, setShowTvMicTroubleshooter] = useState(false);
  const [micErrorMessage, setMicErrorMessage] = useState<string | null>(null);

  const tvVoiceUploadRef = useRef<HTMLInputElement | null>(null);
  const osdTimeoutRef = useRef<number | null>(null);

  const activePlanet = SPACETOON_PLANETS[activeChannelIndex] || SPACETOON_PLANETS[0];

  // Trigger OSD popup message
  const triggerOsd = (msg: string) => {
    setOsdMessage(msg);
    setShowOsd(true);
    if (osdTimeoutRef.current) clearTimeout(osdTimeoutRef.current);
    osdTimeoutRef.current = window.setTimeout(() => {
      setShowOsd(false);
    }, 3800);
  };

  // Toggle Power (يطفي ويشعل التلفزيون)
  const togglePower = () => {
    const nextState = !isTvOn;
    spacetoonTvAudio.playCrtPowerClick(nextState);
    setIsTvOn(nextState);
    if (!nextState) {
      setInterstitialState('none');
      setIsAnnouncerAudioPlaying(false);
    } else {
      triggerOsd(`CH 0${activePlanet.channelNum}: ${activePlanet.name.toUpperCase()} • POWER ON`);
    }
  };

  // Channel Switching via Remote or Dials
  const handleSwitchChannel = (newIndex: number) => {
    if (!isTvOn) return;
    if (newIndex === activeChannelIndex && mediaMode !== 'announcer-studio') return;

    setIsChannelTuning(true);
    spacetoonTvAudio.playChannelSwitchStatic();
    setActiveChannelIndex(newIndex);
    setInterstitialState('none');

    const nextPlanet = SPACETOON_PLANETS[newIndex];

    if (mediaMode === 'bumpers-archive') {
      setCurrentVideoId(VINTAGE_SPACETOON_BUMPERS_VIDEO_ID);
      setCurrentTimestamp(0);
    } else if (mediaMode === 'announcer-studio') {
      // In announcer studio, channel buttons set the announcer context
      triggerOsd(` استوديو المعلق: ${nextPlanet.arabicName}`);
    } else {
      // Load the exact official planet video provided by the user
      setCurrentVideoId(nextPlanet.officialVideoId);
      setCurrentTimestamp(0);
    }

    triggerOsd(`CH 0${nextPlanet.channelNum}: ${nextPlanet.name.toUpperCase()} [${nextPlanet.arabicName}]`);

    setTimeout(() => {
      setIsChannelTuning(false);
    }, 350);
  };

  const nextChannel = () => {
    const next = (activeChannelIndex + 1) % SPACETOON_PLANETS.length;
    handleSwitchChannel(next);
  };

  const prevChannel = () => {
    const prev = (activeChannelIndex - 1 + SPACETOON_PLANETS.length) % SPACETOON_PLANETS.length;
    handleSwitchChannel(prev);
  };

  // Interstitial: "سنعود بعد قليل" (using exact video r5VLzdgVMVQ)
  const triggerSanoudBreak = () => {
    if (!isTvOn) return;
    spacetoonTvAudio.playSanoudChime();
    setInterstitialState('sanoud');
    setCurrentVideoId(VINTAGE_SANOUD_OUDNA_VIDEO_ID);
    setCurrentTimestamp(0);
    triggerOsd(' سبيستون.. سنعود بعد قليل');
  };

  // Interstitial: "عُـدنـا!" (using exact video r5VLzdgVMVQ)
  const triggerOudnaReturn = () => {
    if (!isTvOn) return;
    spacetoonTvAudio.playOudnaFanfare();
    setInterstitialState('oudna');
    setCurrentVideoId(VINTAGE_SANOUD_OUDNA_VIDEO_ID);
    setCurrentTimestamp(3);
    triggerOsd('▶ عُـــدنـــا إلى البرنامج!');
    setTimeout(() => {
      setInterstitialState('none');
    }, 4000);
  };

  // Select Tape from Nostalgia Archive
  const handleSelectTape = (tape: VintageArchiveTape) => {
    if (!isTvOn) return;
    setSelectedTapeId(tape.id);
    setIsChannelTuning(true);
    spacetoonTvAudio.playChannelSwitchStatic();
    setCurrentVideoId(tape.videoId);
    setCurrentTimestamp(0);
    setMediaMode('tapes-archive');
    triggerOsd(` ${tape.title}`);
    setTimeout(() => setIsChannelTuning(false), 320);
  };

  // Switch display mode
  const handleSetMode = (mode: 'tv-video' | 'tapes-archive' | 'audio-only' | 'announcer-studio') => {
    setMediaMode(mode);
    setIsChannelTuning(true);
    spacetoonTvAudio.playChannelSwitchStatic();

    if (mode === 'tapes-archive') {
      const tape = VINTAGE_SPACETOON_TAPES.find((t) => t.id === selectedTapeId) || VINTAGE_SPACETOON_TAPES[0];
      setCurrentVideoId(tape.videoId);
      setCurrentTimestamp(0);
      triggerOsd(` ${tape.title}`);
    } else if (mode === 'announcer-studio') {
      triggerOsd(' استوديو ميكروفون معلق سبيستون الفخم');
    } else {
      setCurrentVideoId(activePlanet.officialVideoId);
      setCurrentTimestamp(0);
      if (mode === 'audio-only') {
        triggerOsd(` راديو الكواكب: صوت ${activePlanet.arabicName} المسجل الأصلي`);
      } else {
        triggerOsd(` تلفزيون سبيستون: شارة ${activePlanet.arabicName} بالصوت والصورة`);
      }
    }

    setTimeout(() => setIsChannelTuning(false), 300);
  };

  // USER RECORDING ACTIONS (تسجيل صوت المستخدم بالميكروفون وتحويله لصوت المعلق الفخم)
  const handleStartRecording = async () => {
    if (!isTvOn) {
      setIsTvOn(true);
      spacetoonTvAudio.playCrtPowerClick(true);
    }
    setMediaMode('announcer-studio');
    setMicErrorMessage(null);

    const success = await spacetoonTvAudio.startVoiceRecording();
    if (success) {
      setIsRecordingVoice(true);
      triggerOsd(' جاري التسجيل... تحدث الآن في الميكروفون!');
    } else {
      setMicErrorMessage('تعذر تشغيل الميكروفون المباشر. قد يكون المتصفح حظر الوصول أو تحتاج للسماح بالإذن.');
      setShowTvMicTroubleshooter(true);
      triggerOsd(' تعذر تشغيل المايك المباشر - استخدم المحاكي التلقائي أدناه');
    }
  };

  const handleStopRecordingAndPlay = async () => {
    setIsRecordingVoice(false);
    triggerOsd(' تم الحفظ! جاري تطبيق صدى المعلق الفخم...');
    const blob = await spacetoonTvAudio.stopVoiceRecording();
    if (blob) {
      setRecordedVoiceBlob(blob);
      const url = URL.createObjectURL(blob);
      setRecordedVoiceUrl(url);

      // Play through broadcaster announcer DSP
      setIsAnnouncerAudioPlaying(true);
      triggerOsd(' استمع لصوتك الآن في التلفاز كمعلق سبيستون!');
      await spacetoonTvAudio.playWithAnnouncerFilter(blob);
      setTimeout(() => setIsAnnouncerAudioPlaying(false), 5000);
    }
  };

  // Play again recorded voice
  const handleReplayAnnouncerVoice = async () => {
    if (!recordedVoiceBlob) return;
    setIsAnnouncerAudioPlaying(true);
    triggerOsd(' إعادة تشغيل صوتك كمعلق سبيستون مع الصدى');
    await spacetoonTvAudio.playWithAnnouncerFilter(recordedVoiceBlob);
    setTimeout(() => setIsAnnouncerAudioPlaying(false), 5000);
  };

  // Upload and play audio file as Spacetoon Announcer
  const handleTvVoiceUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFileUpload(file, 25);
    if (!validation.valid) {
      triggerOsd(validation.error || 'الملف الصوتي المرفوع غير صالح أو يتجاوز 25 ميجابايت.');
      if (e.target) e.target.value = '';
      return;
    }

    if (!isTvOn) {
      setIsTvOn(true);
      spacetoonTvAudio.playCrtPowerClick(true);
    }
    setMediaMode('announcer-studio');
    setRecordedVoiceBlob(file);
    const url = URL.createObjectURL(file);
    setRecordedVoiceUrl(url);

    setIsAnnouncerAudioPlaying(true);
    triggerOsd(' تشغيل التسجيل الصوتي في التلفاز كمعلق سبيستون!');
    await spacetoonTvAudio.playWithAnnouncerFilter(file);
    setTimeout(() => setIsAnnouncerAudioPlaying(false), 5000);
  };

  // Speak custom text in TV
  const handleTvCustomPhraseSpeak = () => {
    if (!tvCustomAnnouncerText.trim()) return;
    handlePlayFamousPhrase(tvCustomAnnouncerText.trim());
  };

  // Play pre-recorded iconic Spacetoon phrases (auto power-on TV)
  const handlePlayFamousPhrase = (phrase: string) => {
    if (!isTvOn) {
      setIsTvOn(true);
      spacetoonTvAudio.playCrtPowerClick(true);
    }
    setMediaMode('announcer-studio');
    spacetoonTvAudio.playSanoudChime();
    setAnnouncerActivePhrase(phrase);
    setIsAnnouncerAudioPlaying(true);
    triggerOsd(` المعلق: «${phrase}»`);
    spacetoonTvAudio.speakAnnouncerLine(phrase);
    setTimeout(() => {
      setIsAnnouncerAudioPlaying(false);
    }, 4500);
  };

  return (
    <div className={`space-y-10 animate-fade-in ${isRtl ? 'text-right font-cairo' : 'text-left font-sans'}`}>
      
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#111625] via-[#0b0f19] to-[#070a12] shadow-2xl p-6 sm:p-10">
        <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
          <img src={tvRoomBackdrop} alt="90s Room" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className={`space-y-3 max-w-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
              <Tv className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{t('tvHeroSubtitle', 'Official Spacetoon Planets Video & Audio Broadcast')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-tajawal text-white tracking-tight leading-tight">
              {t('tvHeroTitle', 'Spacetoon Retro CRT TV & Time Machine')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-sky-400">
                {language === 'ar' ? 'بالصوت والصورة واستوديو المعلق' : 'Live Retro Video & Voice Studio'}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {language === 'ar'
                ? 'شاهد شارات كواكب سبيستون العشرة الرسمية، فواصل «سنعود بعد قليل» و «عُدنا!»، وسجّل صوتك بالميكروفون لتسمعه في التلفاز بصدى وضخامة صوت معلق سبيستون الأسطوري مع لوغو القناة!'
                : 'Experience the 10 official Spacetoon planet channels, "Be Right Back" bumpers, and record your voice through the vintage broadcaster microphone filter!'}
            </p>
          </div>

          {/* Quick TV Control Quick Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={togglePower}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 border transition-all cursor-pointer shadow-lg ${
                isTvOn
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
            >
              <Power className="w-4 h-4" />
              <span>{isTvOn ? (language === 'ar' ? 'إطفاء التلفزيون (Power Off)' : 'Turn TV Off') : (language === 'ar' ? 'تشغيل التلفزيون' : 'Turn TV On')}</span>
            </button>

            <button
              onClick={() => handleSetMode(mediaMode === 'announcer-studio' ? 'tv-video' : 'announcer-studio')}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs flex items-center gap-2 border transition-all cursor-pointer shadow-lg ${
                mediaMode === 'announcer-studio'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-amber-500/30 animate-pulse'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/15'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>{mediaMode === 'announcer-studio' ? (language === 'ar' ? 'الرجوع لبث التلفزيون' : 'Return to TV') : (language === 'ar' ? 'استوديو صوت المعلق' : 'Announcer Studio')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Arena: Retro CRT Television + Remote Control */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* ========================================================= */}
        {/* RETRO CRT TELEVISION APPARATUS (Col 8) */}
        {/* ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Mode Switcher: Full TV Video vs Audio-Only vs Announcer Studio */}
          <div className="p-3.5 rounded-2xl bg-[#0e1422] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">{language === 'ar' ? 'اختر طريقة العرض:' : 'Display Mode:'}</span>
            </div>
            
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-white/10 w-full sm:w-auto justify-center flex-wrap">
              <button
                onClick={() => handleSetMode('tv-video')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaMode === 'tv-video'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'التلفزيون بالصوت والصورة' : 'TV Video'}</span>
              </button>

              <button
                onClick={() => handleSetMode('announcer-studio')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaMode === 'announcer-studio'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'ميكروفون المعلق' : 'Announcer Mic'}</span>
              </button>

              <button
                onClick={() => handleSetMode('audio-only')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaMode === 'audio-only'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'صوت الكواكب' : 'Audio Only'}</span>
              </button>

              <button
                onClick={() => handleSetMode('tapes-archive')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mediaMode === 'tapes-archive'
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'أشرطة نوستالجيا' : 'Nostalgia Tapes'}</span>
              </button>
            </div>
          </div>

          {/* Wooden / Charcoal TV Outer Cabinet */}
          <div className="relative rounded-[40px] p-6 sm:p-8 bg-gradient-to-b from-[#2d2a26] via-[#1f1d1a] to-[#12110f] border-4 border-[#3f3b35] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_rgba(0,0,0,0.8)]">
            
            {/* TV Brand Plate Header */}
            <div className="flex items-center justify-between pb-4 px-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                <span className="font-bold text-amber-200/90 tracking-widest text-[11px]">
                  SPACETOON COLOR CRT • TRINITRON 2000
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                  isTvOn ? 'bg-emerald-400 shadow-[0_0_10px_#10b981]' : 'bg-red-600 shadow-[0_0_8px_#dc2626]'
                }`} />
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {isTvOn ? 'POWER ON' : 'STANDBY'}
                </span>
              </div>
            </div>

            {/* CURVED GLASS CATHODE RAY TUBE (CRT Screen) */}
            <div className={`relative rounded-[30px] overflow-hidden aspect-[4/3] border-4 border-[#18181b] shadow-inner transition-all duration-700 ${
              isTvOn ? 'bg-black' : 'bg-[#080808]'
            }`}>
              
              {/* CRT Glass Curvature Vignette Shadow */}
              <div className="absolute inset-0 pointer-events-none z-30 shadow-[inset_0_0_60px_rgba(0,0,0,0.85),inset_0_0_20px_rgba(0,0,0,0.95)]" />

              {/* CRT Glass Reflection / Glare */}
              <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-white/10 to-transparent blur-2xl pointer-events-none z-30 transform rotate-12" />

              {/* Scanlines Effect Overlay */}
              {hasScanlines && isTvOn && (
                <div
                  className="absolute inset-0 pointer-events-none z-20 opacity-25 mix-blend-overlay"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
                    backgroundSize: '100% 4px'
                  }}
                />
              )}

              {/* USER REQUESTED: Spacetoon Logo Watermark in the Bottom Corner of the Screen */}
              {isTvOn && !isChannelTuning && mediaMode !== 'announcer-studio' && (
                <div className="absolute bottom-4 right-4 z-40 pointer-events-none flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-amber-400/30 shadow-2xl animate-fade-in group/logo">
                  <img
                    src={spacetoonWatermarkImg}
                    alt="Spacetoon TV Logo"
                    className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]"
                  />
                  <div className="text-right">
                    <span className="block text-[11px] font-black text-amber-300 font-tajawal drop-shadow">سبيستون</span>
                    <span className="block text-[8px] font-mono text-slate-300 tracking-wider">SPACE TOON</span>
                  </div>
                </div>
              )}

              {/* SCREEN CONTENT */}
              {isTvOn ? (
                isChannelTuning ? (
                  /* Channel Switch Static Fuzz */
                  <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 animate-pulse text-slate-400 font-mono text-sm space-y-2">
                    <span className="text-4xl animate-spin"></span>
                    <span className="tracking-widest">TUNING PLANET FREQUENCY...</span>
                    <span className="text-xs text-amber-400">{activePlanet.arabicName}</span>
                  </div>
                ) : mediaMode === 'announcer-studio' ? (
                  /* ANNOUNCER STUDIO SCREEN (استوديو معلق سبيستون مع الصورة والمايك) */
                  <div className="relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b from-[#180f28] via-[#0d071a] to-black overflow-hidden text-center">
                    
                    {/* Background Cosmic Atmosphere */}
                    <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                    {/* Top TV Studio Header */}
                    <div className="relative z-10 flex items-center justify-between w-full text-xs font-mono">
                      <span className="px-3 py-1 rounded-full bg-red-600/30 border border-red-500 text-red-300 flex items-center gap-1.5 font-bold animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>ON AIR • استوديو المعلق</span>
                      </span>
                      <span className="text-amber-300 font-bold">
                        صوت معلق سبيستون الفخم
                      </span>
                    </div>

                    {/* Center: The User's Uploaded Spacetoon Image with Cosmic Ring & VU Meter */}
                    <div className="relative z-10 my-auto space-y-4 max-w-sm mx-auto">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto flex items-center justify-center">
                        <div className={`absolute -inset-3 rounded-full border-2 border-dashed border-amber-400/50 ${
                          isAnnouncerAudioPlaying ? 'animate-spin' : ''
                        }`} style={{ animationDuration: '8s' }} />
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-sky-500 p-1 shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                          <img
                            src={spacetoonWatermarkImg}
                            alt="Spacetoon Announcer Logo"
                            className="w-full h-full object-cover rounded-full bg-black"
                          />
                        </div>
                      </div>

                      {/* Display Phrase or Status */}
                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-black font-tajawal text-white">
                          {isRecordingVoice ? ' جاري الاستماع وتسجيل صوتك...' : 'استوديو المعلق الرسمي'}
                        </h3>
                        <p className="text-xs text-amber-300 italic px-2">
                          {announcerActivePhrase || 'تحدث في الميكروفون ليخرج صوتك في التلفاز مضخماً كمعلق القناة!'}
                        </p>
                      </div>

                      {/* Animated Audio Equalizer Bars */}
                      <div className="flex items-center justify-center gap-1.5 h-8">
                        {[50, 85, 40, 100, 70, 45, 90, 60, 95, 55, 80, 65].map((h, bIdx) => (
                          <div
                            key={bIdx}
                            className={`w-1.5 rounded-full transition-all duration-300 ${
                              isAnnouncerAudioPlaying || isRecordingVoice
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-white/20'
                            }`}
                            style={{
                              height: isAnnouncerAudioPlaying || isRecordingVoice ? `${h}%` : '20%',
                              animationDelay: `${bIdx * 0.1}s`
                            }}
                          />
                        ))}
                      </div>

                    </div>

                    {/* Bottom Status text */}
                    <div className="relative z-10 text-[10px] text-slate-400 font-mono">
                      <span>SPACETOON BROADCASTER DSP • REVERB & DELAY ACTIVE</span>
                    </div>

                  </div>
                ) : mediaMode === 'audio-only' ? (
                  /* AUDIO-ONLY CASSETTE / RADIO MODE (صوت الكواكب المسجل فقط) */
                  <div className={`relative w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-b ${activePlanet.bgColor} overflow-hidden text-center`}>
                    
                    {/* Planet Glow */}
                    <div
                      className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
                      style={{ backgroundColor: activePlanet.color }}
                    />

                    {/* Top Radio HUD */}
                    <div className="relative z-10 flex items-center justify-between w-full text-xs font-mono">
                      <span className="px-2 py-1 rounded bg-black/60 border border-white/20 text-amber-300">
                         RETRO AUDIO TUNER • 88.5 FM
                      </span>
                      <span
                        className="px-3 py-1 rounded-full font-bold border"
                        style={{
                          backgroundColor: `${activePlanet.color}25`,
                          borderColor: activePlanet.color,
                          color: activePlanet.color
                        }}
                      >
                        {activePlanet.arabicName}
                      </span>
                    </div>

                    {/* Center: Vintage Cassette Reel & Audio Waveform */}
                    <div className="relative z-10 my-auto space-y-4 max-w-md mx-auto">
                      
                      {/* Cassette Graphic */}
                      <div className="w-48 sm:w-56 h-28 rounded-2xl bg-black/80 border-2 border-white/20 mx-auto p-3 flex flex-col justify-between shadow-2xl relative">
                        <div className="flex justify-between items-center text-[10px] text-amber-300 font-mono">
                          <span>SPACETOON TAPE 2000</span>
                          <span>STEREO A</span>
                        </div>

                        {/* Tape Spools */}
                        <div className="flex items-center justify-center gap-8 py-2">
                          <div className="w-10 h-10 rounded-full border-4 border-dashed border-amber-400 animate-spin flex items-center justify-center" style={{ animationDuration: '4s' }}>
                            <div className="w-3 h-3 rounded-full bg-white/40" />
                          </div>
                          <div className="w-10 h-10 rounded-full border-4 border-dashed border-amber-400 animate-spin flex items-center justify-center" style={{ animationDuration: '4s' }}>
                            <div className="w-3 h-3 rounded-full bg-white/40" />
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 font-bold truncate">
                          {activePlanet.officialSongTitle}
                        </div>
                      </div>

                      {/* Planet Title & Announcer Quote */}
                      <div className="space-y-1">
                        <h2 className="text-xl sm:text-2xl font-black font-tajawal text-white">
                          {activePlanet.officialSongTitle}
                        </h2>
                        <p className="text-xs text-amber-300 italic">
                          {activePlanet.announcerQuote}
                        </p>
                      </div>

                      {/* Animated Audio Equalizer Bars */}
                      <div className="flex items-center justify-center gap-1.5 h-8">
                        {[60, 90, 40, 100, 75, 50, 85, 65, 95, 45, 80, 70].map((h, bIdx) => (
                          <div
                            key={bIdx}
                            className="w-1.5 rounded-full bg-amber-400 animate-pulse"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${bIdx * 0.1}s`,
                              animationDuration: '0.8s'
                            }}
                          />
                        ))}
                      </div>

                    </div>

                    {/* Hidden Audio Player for the official planet audio */}
                    <iframe
                      key={`audio-${currentVideoId}`}
                      src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&rel=0&playsinline=1`}
                      title="Planet Audio Stream"
                      className="w-1 h-1 opacity-0 pointer-events-none absolute bottom-0 left-0"
                      allow="autoplay"
                    />

                    {/* Bottom Status */}
                    <div className="relative z-10 text-[11px] text-slate-300 font-mono">
                      <span> PLAYING RECORDED PLANET AUDIO: {activePlanet.name.toUpperCase()}</span>
                    </div>

                  </div>
                ) : (
                  /* FULL TV VIDEO BROADCAST (شغلهم في التلفاز بالصوت والصورة وبطابع قديم) */
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      key={`${currentVideoId}-${currentTimestamp}`}
                      src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&start=${currentTimestamp}&enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
                      title="Spacetoon Vintage TV Broadcast"
                      className="w-full h-full object-cover border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )
              ) : (
                /* TV IS OFF (Cathode tube shut off completely) */
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 font-mono text-xs space-y-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600/40" />
                  <span className="tracking-widest">POWER OFF • STANDBY</span>
                  <button
                    onClick={togglePower}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 cursor-pointer mt-2"
                  >
                    اضغط لتشغيل الشاشة 
                  </button>
                </div>
              )}

              {/* OSD (On-Screen Display: Green phosphor HUD text) */}
              {showOsd && isTvOn && (
                <div className="absolute top-4 left-4 z-40 px-3 py-1.5 rounded-lg bg-black/75 border border-emerald-500/60 backdrop-blur-md text-emerald-400 font-mono text-xs font-bold shadow-lg animate-fade-in flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{osdMessage || `CH 0${activePlanet.channelNum}: ${activePlanet.name.toUpperCase()} [${activePlanet.arabicName}]`}</span>
                </div>
              )}

            </div>

            {/* TV LOWER CONTROL PANEL & STEREO SPEAKER GRILLE */}
            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-12 gap-4 items-center px-2">
              
              {/* Speaker Grille (Vintage acoustic slots) */}
              <div className="col-span-6 flex flex-col gap-1.5 opacity-60">
                {[1, 2, 3, 4].map((bar) => (
                  <div key={bar} className="h-1 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                ))}
              </div>

              {/* TV Physical Dials & Switches */}
              <div className="col-span-6 flex items-center justify-end gap-3">
                
                {/* Scanlines Toggle Button */}
                <button
                  onClick={() => setHasScanlines(!hasScanlines)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    hasScanlines
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                  title="تفعيل/تعطيل خطوط المسح التلفزيوني (Scanlines)"
                >
                  خطوط المسح
                </button>

                {/* Channel Dial Knobs */}
                <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={prevChannel}
                    disabled={!isTvOn}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs cursor-pointer disabled:opacity-30"
                    title="القناة السابقة"
                  >
                    ◀
                  </button>
                  <span className="px-2 font-mono font-black text-xs text-amber-400">
                    CH {activePlanet.channelNum}
                  </span>
                  <button
                    onClick={nextChannel}
                    disabled={!isTvOn}
                    className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xs cursor-pointer disabled:opacity-30"
                    title="القناة التالية"
                  >
                    ▶
                  </button>
                </div>

                {/* Mechanical Power Button (يطفي ويشعل) */}
                <button
                  onClick={togglePower}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white border-2 shadow-lg transition-transform active:scale-90 cursor-pointer ${
                    isTvOn
                      ? 'bg-red-600 hover:bg-red-500 border-red-400 shadow-red-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 shadow-emerald-500/30'
                  }`}
                  title="زر التشغيل والإطفاء الرئيسي"
                >
                  <Power className="w-5 h-5" />
                </button>

              </div>
            </div>

          </div>

          {/* Quick Interstitials Bar Below TV */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0e1422] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>فواصل سبيستون الأصلية التفاعلية:</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={triggerSanoudBreak}
                disabled={!isTvOn}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30"
              >
                <span>فاصل: سنعود بعد قليل</span>
              </button>

              <button
                onClick={triggerOudnaReturn}
                disabled={!isTvOn}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-30"
              >
                <span>فاصل: عُـــدنـــا!</span>
              </button>

              <button
                onClick={() => setShowProgramTicker(!showProgramTicker)}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{showProgramTicker ? 'إخفاء جدول البرامج' : 'إظهار جدول البرامج'}</span>
              </button>
            </div>
          </div>

          {/* Program Schedule Ticker below */}
          {showProgramTicker && (
            <div className="p-3 rounded-2xl bg-[#0F172A]/80 backdrop-blur-md border border-emerald-500/30 flex items-center gap-3 overflow-hidden">
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white text-xs font-black shrink-0 shadow-sm">
                جدول برامج {activePlanet.arabicName}
              </span>
              <div className="whitespace-nowrap overflow-x-auto text-xs text-slate-200 font-bold space-x-6 flex items-center scrollbar-none">
                {activePlanet.schedule.map((slot, sIdx) => (
                  <span key={sIdx} className="inline-block ml-6">
                     {slot}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* VINTAGE NOSTALGIA TAPES RACK (فواصل سبيستون، الدمية هيا، مودا ومودي، فلفول، إيروكا، سبيس باور) */}
          <div className="p-5 sm:p-6 rounded-3xl bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between pb-3 border-b border-white/10 gap-2">
              <div className="flex items-center gap-2">
                <Disc className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="font-bold text-sm text-white">
                  أشرطة نوستالجيا سبيستون وفواصل الأرشيف الذهبي 
                </h3>
              </div>
              <span className="text-[11px] text-emerald-300 font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                9 أشرطة أصلية كلاسيكية
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              اختر أي شريط كاسيت لتشغيله مباشرة بالصوت والصورة داخل شاشة تلفزيون الـ CRT مع اللوغو والريموت:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {VINTAGE_SPACETOON_TAPES.map((tape) => {
                const isActive = currentVideoId === tape.videoId;
                return (
                  <button
                    key={tape.id}
                    onClick={() => handleSelectTape(tape)}
                    disabled={!isTvOn}
                    className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-2.5 group hover:translate-y-[-2px] disabled:opacity-40 ${
                      isActive
                        ? 'bg-emerald-600/25 border-emerald-400 text-emerald-100 shadow-lg shadow-emerald-500/20 font-bold'
                        : 'bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] border-white/10 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{tape.icon}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-black/40 text-slate-300 border-white/10'
                      }`}>
                        {tape.badge}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-white group-hover:text-emerald-200 transition-colors line-clamp-1">
                        {tape.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {tape.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{tape.category}</span>
                      <span className={`font-bold group-hover:underline flex items-center gap-1 ${
                        isActive ? 'text-emerald-300' : 'text-slate-300 group-hover:text-emerald-300'
                      }`}>
                        {isActive ? 'يعرض الآن ' : 'تشغيل الشريط ▶'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DEDICATED SPACETOON DUBBING MICROPHONE COMPONENT (ON AIR & RADIO FILTERS) */}
          <div className="my-6">
            <SpacetoonMicrophone standalone={false} />
          </div>

          {/* LIVE ANNOUNCER MIC RECORDING STUDIO CONTROL PANEL */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181126] to-[#0c0816] border border-amber-400/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold text-sm text-white">
                  استوديو معلق سبيستون (سجّل صوتك وتحدث في التلفاز) 
                </h3>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/30">
                تأثير الصدى وضخامة الصوت
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              كيف يعمل؟ اضغط على زر التسجيل وتحدث في الميكروفون بأي جملة (مثلاً: <span className="text-amber-300 font-bold">«تشاهدون الآن كوكب أكشن.. كوكب الإثارة والغموض!»</span>). فور إيقاف التسجيل، يقوم التلفزيون بتشغيل صوتك بصدى وضخامة معلق سبيستون الأسطوري مع ظهور اللوغو وأمواج الصوت!
            </p>

            {/* Recording Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {!isRecordingVoice ? (
                <button
                  onClick={handleStartRecording}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                  <span> ابدأ التسجيل وتحدث الآن بالميكروفون</span>
                </button>
              ) : (
                <button
                  onClick={handleStopRecordingAndPlay}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/30 transition-all cursor-pointer animate-pulse"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span> إيقاف وتشغيل الصوت في التلفاز كمعلق سبيستون!</span>
                </button>
              )}

              <input
                type="file"
                ref={tvVoiceUploadRef}
                onChange={handleTvVoiceUpload}
                accept="audio/*"
                className="hidden"
              />

              <button
                onClick={() => tvVoiceUploadRef.current?.click()}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                title="رفع ملف صوتي من الهاتف أو الكمبيوتر للبث في التلفاز بصوت المعلق"
              >
                <Disc className="w-4 h-4 text-amber-400" />
                <span>رفع تسجيل صوتي (MP3/فويس) </span>
              </button>

              {recordedVoiceBlob && !isRecordingVoice && (
                <button
                  onClick={handleReplayAnnouncerVoice}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>إعادة استماع صوتك كمعلق </span>
                </button>
              )}
            </div>

            {/* Troubleshooting Alert & Permission Guide */}
            {micErrorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>تنبيه أذونات الميكروفون:</span>
                  </div>
                  <button
                    onClick={() => setShowTvMicTroubleshooter((p) => !p)}
                    className="px-2 py-0.5 rounded bg-rose-500/30 text-[11px] font-bold text-rose-200 border border-rose-400/40 cursor-pointer"
                  >
                    {showTvMicTroubleshooter ? 'إخفاء الإرشادات ▲' : 'كيفية تفعيل المايك في المتصفح ▼'}
                  </button>
                </div>
                <p className="text-[11px] leading-relaxed">{micErrorMessage}</p>

                {showTvMicTroubleshooter && (
                  <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 text-[11px] text-slate-300 space-y-1.5">
                    <p><strong className="text-white">آيفون (Safari):</strong> انقر زر <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">aA</code> في شريط العنوان &gt; «إعدادات موقع الويب» &gt; الميكروفون: <strong className="text-emerald-400">سماح (Allow)</strong>.</p>
                    <p><strong className="text-white">أندرويد (Chrome):</strong> انقر على القفل  بجوار الرابط &gt; «الأذونات» &gt; فعل الميكروفون.</p>
                    <p><strong className="text-white">الكمبيوتر:</strong> انقر على رمز القفل  يسار الرابط &gt; Microphone: <strong className="text-emerald-400">Allow</strong> ثم حدّث الصفحة.</p>
                  </div>
                )}
                <p className="text-[11px] text-amber-300 font-bold">
                   يمكنك تشغيل أي جملة كمعلق أو كتابة أي نص أدناه وسيعمل فوراً بالصوت والصورة داخل التلفاز!
                </p>
              </div>
            )}

            {/* Custom Announcer Text Dubbing Input */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <span className="text-[11px] font-bold text-amber-300 block">
                 أو اكتب أي جملة ليقولها المعلق في التلفاز فوراً بصوت سبيستون الفخم:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={tvCustomAnnouncerText}
                  onChange={(e) => setTvCustomAnnouncerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTvCustomPhraseSpeak();
                  }}
                  placeholder="اكتب أي جملة هنا (مثال: أهلاً بكم في سبيستون.. سنعود بعد قليل)..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleTvCustomPhraseSpeak}
                  disabled={!tvCustomAnnouncerText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 shadow-md shadow-amber-500/20"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>بث كمعلق في التلفاز </span>
                </button>
              </div>
            </div>

            {/* Instant Soundboard: Famous Spacetoon Narrator Phrases */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-amber-300 block">
                أو اختر جملة جاهزة لتسمعها بصوت معلق سبيستون الفخم في التلفاز فوراً:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {FAMOUS_ANNOUNCER_PHRASES.map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlayFamousPhrase(phrase.text)}
                    className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-amber-500/20 text-slate-200 hover:text-amber-200 border border-white/10 hover:border-amber-400/40 text-right text-xs font-bold transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span className="truncate"> {phrase.text}</span>
                    <Volume className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================= */}
        {/* SPACETOON RETRO REMOTE CONTROL & PLANET BUTTONS (Col 4) */}
        {/* ========================================================= */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* THE RETRO REMOTE CONTROL UNIT (جهاز التحكم السبيستوني) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#1c1d22] via-[#14151a] to-[#0d0e12] border-2 border-[#2b2c34] shadow-2xl space-y-5">
            
            {/* Remote Infrared Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_#ef4444]" />
                <span className="font-bold text-slate-300 text-[11px]">SPACETOON REMOTE</span>
              </div>
              <button
                onClick={togglePower}
                className="w-7 h-7 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-md shadow-red-600/30"
                title="تشغيل/إطفاء (Power)"
              >
                <Power className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Planets Channels Grid (1 to 10) */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">
                أزرار الكواكب (1 إلى 10):
              </span>

              <div className="grid grid-cols-2 gap-2">
                {SPACETOON_PLANETS.map((planet, pIdx) => {
                  const isActive = activeChannelIndex === pIdx;
                  return (
                    <button
                      key={planet.id}
                      onClick={() => handleSwitchChannel(pIdx)}
                      disabled={!isTvOn}
                      className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer flex items-center gap-2.5 disabled:opacity-40 hover:translate-x-[-2px] ${
                        isActive
                          ? 'border shadow-md font-bold'
                          : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] text-slate-300 hover:text-white'
                      }`}
                      style={{
                        borderColor: isActive ? planet.color : undefined,
                        backgroundColor: isActive ? `${planet.color}20` : undefined,
                        color: isActive ? planet.color : undefined,
                        boxShadow: isActive ? `0 0 16px ${planet.color}30` : undefined
                      }}
                    >
                      <span
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors"
                        style={{
                          backgroundColor: isActive ? planet.color : 'rgba(255, 255, 255, 0.08)',
                          color: isActive ? '#fff' : '#94a3b8'
                        }}
                      >
                        {planet.channelNum}
                      </span>
                      <span className="text-xs truncate font-medium">
                        {planet.arabicName.replace('كوكب ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fast Bumper Buttons on Remote */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
              <button
                onClick={triggerSanoudBreak}
                disabled={!isTvOn}
                className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <span> سنعود بعد قليل</span>
              </button>
              <button
                onClick={triggerOudnaReturn}
                disabled={!isTvOn}
                className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer disabled:opacity-30"
              >
                <span>▶ عُـــدنـــا!</span>
              </button>
            </div>

            {/* Quick Vintage Tapes Bar on Remote */}
            <div className="pt-2 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                <span>أشرطة الذكريات (كاسيت ):</span>
                <span className="text-[9px] text-slate-400">9 أشرطة</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {VINTAGE_SPACETOON_TAPES.map((tape) => {
                  const isCurrent = currentVideoId === tape.videoId;
                  return (
                    <button
                      key={tape.id}
                      onClick={() => handleSelectTape(tape)}
                      disabled={!isTvOn}
                      className={`p-1.5 rounded-lg border text-right text-[10px] font-bold transition-all truncate flex items-center gap-1.5 cursor-pointer disabled:opacity-30 ${
                        isCurrent
                          ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md shadow-amber-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                      title={tape.title}
                    >
                      <span className="shrink-0">{tape.icon}</span>
                      <span className="truncate">{tape.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume & Controls on Remote */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              
              {/* Mute Button */}
              <button
                onClick={() => {
                  setIsMuted(!isMuted);
                  triggerOsd(isMuted ? ' إلغاء كتم الصوت' : ' كتم الصوت');
                }}
                disabled={!isTvOn}
                className={`p-2.5 rounded-xl text-xs font-bold border cursor-pointer disabled:opacity-30 ${
                  isMuted ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-white/10 text-white border-white/10'
                }`}
                title="كتم الصوت"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Volume Slider */}
              <div className="flex-1 flex items-center gap-2">
                <Volume1 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  disabled={!isTvOn}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVolume(val);
                    triggerOsd(`VOL: ${val}%`);
                  }}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-30"
                />
                <span className="text-[10px] font-mono text-slate-400 w-8 text-left">
                  {volume}%
                </span>
              </div>

            </div>

          </div>

          {/* Planet Trivia & Announcer Quote Card */}
          <div className="p-6 rounded-3xl bg-[#0e1422] border border-white/10 shadow-xl space-y-4 text-right">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs font-bold text-white">
                جملة المعلق الأسطوري لـ {activePlanet.arabicName}:
              </h4>
            </div>

            <p className="text-xs text-amber-300 italic leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 font-tajawal">
              {activePlanet.announcerQuote}
            </p>

            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold block">معلومة نوستالجية من الأرشيف:</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activePlanet.funFact}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
