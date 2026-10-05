import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic,
  Square,
  RefreshCw,
  Download,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Activity,
  CheckCircle2,
  Music,
  Play,
  Pause,
  Copy,
  Check,
  Radio,
  Tv,
  ListMusic,
  Sliders,
  Share2,
  Trophy,
  ExternalLink,
  Info,
  Crown,
  ThumbsUp,
  Heart,
  Star,
  Award,
  ChevronRight,
  Eye,
  Flame,
  Music2,
  Headphones,
  Search,
  Timer,
  FileText,
  Clock,
  Sparkle,
  Piano,
  Keyboard,
  SlidersHorizontal,
  Layers,
  Zap,
  Volume1,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  X,
  Smartphone,
  ShieldCheck,
  Lock,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle
} from 'lucide-react';
import { ContestBoard } from './ContestBoard';
import { ContestEntry } from '../types';
import {
  getContestEntries,
  saveContestEntries,
  addContestEntry,
  deleteContestEntry,
  blobToDataUrl,
  isPlatformOwner,
  INITIAL_CONTEST_ENTRIES
} from '../lib/contestStorage';
import { useAuth } from '../context/AuthContext';
import { getOrCreateKaraokeWavUrl } from '../lib/karaokeSongsData';
import { analyzeVoicePerformance } from '../lib/voiceScoringEngine';
import animeStudioSingersImg from '../assets/images/anime_studio_singers_1789927598798.jpg';
import { OfficialCertificateModal } from './OfficialCertificateModal';
import { SocialStoryCardModal } from './SocialStoryCardModal';
import { SpacetoonMicrophone } from './SpacetoonMicrophone';
import {
  spacetoonDubbingAudio,
  SpacetoonVocalFilterId,
  SPACETOON_VOCAL_FILTERS
} from '../lib/spacetoonDubbingAudio';

// --- PIANO & KEY SIGNATURE DATA STRUCTURES ---
export interface KeyRootOption {
  rootIndex: number; // 0 to 11 (0=C, 1=Db, 2=D, 3=Eb, 4=E, 5=F, 6=Fs, 7=G, 8=Ab, 9=A, 10=Bb, 11=B)
  name: string;
  arabicName: string;
  englishAlt?: string;
}

export const KEY_ROOTS: KeyRootOption[] = [
  { rootIndex: 0, name: 'C', arabicName: 'دو (C)' },
  { rootIndex: 1, name: 'C# / Db', arabicName: 'دو# / ريb (Db)' },
  { rootIndex: 2, name: 'D', arabicName: 'ري (D)' },
  { rootIndex: 3, name: 'D# / Eb', arabicName: 'ري# / ميb (Eb)' },
  { rootIndex: 4, name: 'E', arabicName: 'مي (E)' },
  { rootIndex: 5, name: 'F', arabicName: 'فا (F)' },
  { rootIndex: 6, name: 'F# / Gb', arabicName: 'فا# / صولb (F#)' },
  { rootIndex: 7, name: 'G', arabicName: 'صول (G)' },
  { rootIndex: 8, name: 'G# / Ab', arabicName: 'صول# / لاb (Ab)' },
  { rootIndex: 9, name: 'A', arabicName: 'لا (A)' },
  { rootIndex: 10, name: 'A# / Bb', arabicName: 'لا# / سيb (Bb)' },
  { rootIndex: 11, name: 'B', arabicName: 'سي (B)' },
];

export interface ScaleDefinition {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  intervals: number[]; // semitone steps from root [0..11]
  mood: string;
}

export const SCALE_DEFINITIONS: ScaleDefinition[] = [
  {
    id: 'minor',
    name: 'Natural Minor (نهاوند)',
    arabicName: 'مقام نهاوند (Minor)',
    description: 'لحن عاطفي ووجداني عميق يناسب إيروكا وأنا وأخي وريمي وسالي',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    mood: 'عاطفي ووجداني'
  },
  {
    id: 'major',
    name: 'Major (عجم)',
    arabicName: 'مقام عجم (Major)',
    description: 'لحن بهيج، حماسي وسعيد يناسب القناص ودراغون بول والرمية الملتهبة',
    intervals: [0, 2, 4, 5, 7, 9, 11],
    mood: 'حماسي ومبهج'
  },
  {
    id: 'harmonic_minor',
    name: 'Harmonic Minor (نهاوند معدل)',
    arabicName: 'نهاوند معدل / هارمونيك',
    description: 'طابع درامي سبيستوني عميق وغموض أسطوري وملحمي',
    intervals: [0, 2, 3, 5, 7, 8, 11],
    mood: 'درامي وملحمي'
  },
  {
    id: 'hijaz',
    name: 'Hijaz (حجاز شرقي)',
    arabicName: 'مقام حجاز شرقي أصيل',
    description: 'طابع شرقي عريق يملأ الروح بالشجن والشوق والأصالة',
    intervals: [0, 1, 4, 5, 7, 8, 10],
    mood: 'شرقي شجي'
  },
  {
    id: 'kurd',
    name: 'Kurd (كرد دافئ)',
    arabicName: 'مقام كرد هادئ',
    description: 'مقام حالم ورومانسي يناسب أغاني الطفولة والأمل',
    intervals: [0, 1, 3, 5, 7, 8, 10],
    mood: 'حالم ودافئ'
  },
  {
    id: 'bayati',
    name: 'Bayati (بياتي حنون)',
    arabicName: 'مقام بياتي حنون',
    description: 'عراقة ونقاء يناسب شارات الحنين وذكريات الزمن الجميل',
    intervals: [0, 2, 3, 5, 7, 8, 10],
    mood: 'حنون وتراثي'
  },
  {
    id: 'pentatonic',
    name: 'Pentatonic (خماسي أسطوري)',
    arabicName: 'سلم خماسي شرقي / أنمي',
    description: 'سلم أسطوري خالٍ من النشاز يناسب الارتجال الفوري والعزف السهل',
    intervals: [0, 2, 4, 7, 9],
    mood: 'خفيف ومرن'
  },
  {
    id: 'blues',
    name: 'Blues (جاز وبلوز)',
    arabicName: 'سلم البلوز الإيقاعي',
    description: 'حركة ونبضات سريعة للأغاني الحديثة والإيقاعية السريعة',
    intervals: [0, 3, 5, 6, 7, 10],
    mood: 'إيقاعي حديث'
  }
];

export interface VirtualPianoKey {
  midiNote: number;
  noteName: string;
  arabicName: string;
  isBlack: boolean;
  pcKey: string; // Primary home-row physical key
  pcKeyAlt?: string; // Upper QWERTY row key
  displayKey: string; // Keycap label
  blackOffsetIndex?: number;
}

export const BASE_PIANO_KEYS: VirtualPianoKey[] = [
  { midiNote: 60, noteName: 'C4', arabicName: 'دو', isBlack: false, pcKey: 'a', pcKeyAlt: 'q', displayKey: 'A' },
  { midiNote: 61, noteName: 'Db4', arabicName: 'دو#', isBlack: true, pcKey: 'w', pcKeyAlt: '2', displayKey: 'W', blackOffsetIndex: 0 },
  { midiNote: 62, noteName: 'D4', arabicName: 'ري', isBlack: false, pcKey: 's', pcKeyAlt: 'w', displayKey: 'S' },
  { midiNote: 63, noteName: 'Eb4', arabicName: 'ميb', isBlack: true, pcKey: 'e', pcKeyAlt: '3', displayKey: 'E', blackOffsetIndex: 1 },
  { midiNote: 64, noteName: 'E4', arabicName: 'مي', isBlack: false, pcKey: 'd', pcKeyAlt: 'e', displayKey: 'D' },
  { midiNote: 65, noteName: 'F4', arabicName: 'فا', isBlack: false, pcKey: 'f', pcKeyAlt: 'r', displayKey: 'F' },
  { midiNote: 66, noteName: 'Fs4', arabicName: 'فا#', isBlack: true, pcKey: 't', pcKeyAlt: '5', displayKey: 'T', blackOffsetIndex: 2 },
  { midiNote: 67, noteName: 'G4', arabicName: 'صول', isBlack: false, pcKey: 'g', pcKeyAlt: 't', displayKey: 'G' },
  { midiNote: 68, noteName: 'Ab4', arabicName: 'لاb', isBlack: true, pcKey: 'y', pcKeyAlt: '6', displayKey: 'Y', blackOffsetIndex: 3 },
  { midiNote: 69, noteName: 'A4', arabicName: 'لا', isBlack: false, pcKey: 'h', pcKeyAlt: 'y', displayKey: 'H' },
  { midiNote: 70, noteName: 'Bb4', arabicName: 'سيb', isBlack: true, pcKey: 'u', pcKeyAlt: '7', displayKey: 'U', blackOffsetIndex: 4 },
  { midiNote: 71, noteName: 'B4', arabicName: 'سي', isBlack: false, pcKey: 'j', pcKeyAlt: 'u', displayKey: 'J' },
  { midiNote: 72, noteName: 'C5', arabicName: 'دو', isBlack: false, pcKey: 'k', pcKeyAlt: 'i', displayKey: 'K' },
  { midiNote: 73, noteName: 'Db5', arabicName: 'دو#', isBlack: true, pcKey: 'o', pcKeyAlt: '9', displayKey: 'O', blackOffsetIndex: 5 },
  { midiNote: 74, noteName: 'D5', arabicName: 'ري', isBlack: false, pcKey: 'l', pcKeyAlt: 'o', displayKey: 'L' },
  { midiNote: 75, noteName: 'Eb5', arabicName: 'ميb', isBlack: true, pcKey: 'p', pcKeyAlt: '0', displayKey: 'P', blackOffsetIndex: 6 },
  { midiNote: 76, noteName: 'E5', arabicName: 'مي', isBlack: false, pcKey: ';', pcKeyAlt: 'p', displayKey: ';' },
  { midiNote: 77, noteName: 'F5', arabicName: 'فا', isBlack: false, pcKey: '\'', pcKeyAlt: '[', displayKey: '\'' }
];

export type PianoTimbre = 'grand-piano' | 'strings' | 'oud-qanun' | 'flute' | 'synth-lead' | 'music-box';


export interface KaraokeSong {
  id: string;
  title: string;
  animeOrCategory: string;
  originalArtist: string;
  searchQuery: string;
  youtubeId?: string;
  youtubeUrl: string;
  instagramUrl?: string;
  instagramLabel?: string;
  backingAudioUrl: string;
  duration: string;
  lyrics: string[];
  bpm?: number;
  key?: string;
  difficulty?: 'سهل' | 'متوسط' | 'تحدي حماسي';
  colorGradient?: string;
  maqam?: string;
  songGenre?: string;
  isCustomSong?: boolean;
}

export const KARAOKE_SONGS_CATALOG: KaraokeSong[] = [
  {
    id: 'hunter-x-hunter',
    title: 'شارة القناص (قد لمعت عيناه)',
    animeOrCategory: 'أنمي سبيستون كلاسيك',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة القناص رشا رزق سبيستون كاملة',
    youtubeId: 'z7To_I8aPCw',
    youtubeUrl: 'https://www.youtube.com/watch?v=z7To_I8aPCw',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:45',
    bpm: 132,
    key: 'D Minor (ري صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-amber-600 to-rose-700',
    lyrics: [
      'قد لمعت عيناه.. بالعزم انتفضت يمناه',
      'في هدوء الليل.. من هو الصامد المغامر؟',
      'في وجه السيل.. يبعد عن عينيه الراحة',
      'يتحدى خصماً في الساحة',
      'يرمي ويصيب الأهداف.. يسعى دوماً لتحقيق الإنصاف',
      'وخيال أبيه في الأحلام.. يوقظ في القلب الحساس',
      'حب الخير لكل الناس.. مهما كان الثمن من الصعاب',
      'سيظل البطل القناص.. بكل الصبر والإخلاص',
      'يعمل باجتهاد.. وعلى أهبة الاستعداد',
      'يرمي ويصيب الأهداف.. يسعى دوماً للإنصاف!'
    ]
  },
  {
    id: 'ana-wa-akhi',
    title: 'شارة أنا وأخي (شوق يدفعني لأراها)',
    animeOrCategory: 'سبيستون وجداني',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة انا واخي رشا رزق سبيستون',
    youtubeId: 'Hjj-K56Ksdc',
    youtubeUrl: 'https://www.youtube.com/watch?v=Hjj-K56Ksdc',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '02:10',
    bpm: 78,
    key: 'A Major (لا كبير)',
    difficulty: 'سهل',
    colorGradient: 'from-sky-600 to-indigo-700',
    lyrics: [
      'شوقٌ يدفعني لأراها.. أمي ذكرى لا أنساها',
      'طيفٌ أنقى.. من زبد الأيام أبقى',
      'أمي.. أمي.. أمي..',
      'همساتها أحلى من ناي.. سكنت قلبي',
      'كلماتها باتت نجواي.. تضيء دربي',
      'لا تنس أخاك.. ترعاه يداك',
      'لو سرقت منا الأيام قلباً معطاءً بسام',
      'لن نستسلم للآلام.. لن نستسلم للآلام!',
      'لا تنس أخاك.. ترعاه يداك!'
    ]
  },
  {
    id: 'ahd-al-asdiqa',
    title: 'شارة عهد الأصدقاء (حلمنا نهار)',
    animeOrCategory: 'صداقة وأمل سبيستون',
    originalArtist: 'رشا رزق وطارق العربي طرقان',
    searchQuery: 'شارة عهد الاصدقاء رشا رزق سبيستون',
    youtubeId: 'YGc0pQk4HeI',
    youtubeUrl: 'https://www.youtube.com/watch?v=YGc0pQk4HeI',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '02:05',
    bpm: 90,
    key: 'F Major (فا كبير)',
    difficulty: 'سهل',
    colorGradient: 'from-emerald-600 to-teal-800',
    lyrics: [
      'حلمنا نهار.. نهارنا عمل',
      'نملك الخيار.. وخيارنا الأمل',
      'وتهدينا الحياة أضواءً في آخر النفق',
      'تدعونا كي ننسى ألمًا عشناه',
      'نستسلم لكن لا ما دمنا أحياء نرزق',
      'ما دام الأمل طريقاً فسنحياه!',
      'بيننا صديق.. لا يعرف الكلل',
      'مخلصٌ رقيق.. إن قال فعل',
      'روميو صديقي يحفظ عهد الأصدقاء.. يعرف كيف يكون الوفاء!'
    ]
  },
  {
    id: 'eruka-dreams',
    title: 'إيروكا (رسمت بيتاً صغيراً)',
    animeOrCategory: 'أنمي وإلهام',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة ايروكا رسمت بيتا صغيرا رشا رزق',
    youtubeId: 'IDqXdMDX3No',
    youtubeUrl: 'https://www.youtube.com/watch?v=IDqXdMDX3No',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg',
    duration: '02:00',
    bpm: 85,
    key: 'C Major (دو كبير)',
    difficulty: 'متوسط',
    colorGradient: 'from-pink-600 to-purple-700',
    lyrics: [
      'رسمتُ بيتاً صغيراً أسميته الأحلام',
      'في قلبي ينمو ويحيا سعادةً وأمان',
      'أرجوحةٌ من زهور.. ووردةٌ من ندى',
      'ترسم فجري الجديد.. وشمسي في المدى',
      'يا صوتي سافر مع الرياح.. يا صوتي واملأ الدنيا بالأفراح',
      'يا صوتي سافر مع الرياح.. واملأ الدنيا بالأفراح',
      'غنِّ للحب والسلام.. غنِّ للأمل.. غنِّ للأحلام!'
    ]
  },
  {
    id: 'eruka-memories-past',
    title: 'إيروكا (حين أعود للوراء)',
    animeOrCategory: 'وجداني وألم وعودة',
    originalArtist: 'رشا رزق',
    searchQuery: 'ايروكا حين اعود للوراء رشا رزق',
    youtubeId: 'IDqXdMDX3No',
    youtubeUrl: 'https://www.youtube.com/watch?v=IDqXdMDX3No',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '02:15',
    bpm: 75,
    key: 'G Minor (صول صغير)',
    difficulty: 'متوسط',
    colorGradient: 'from-violet-700 to-purple-900',
    lyrics: [
      'حين أعود للوراء.. تأتيني صور من الماضي',
      'أطياف ذكريات.. قد صارت حكايات.. تأتي ثم تمضي',
      'أنظر بعيون أخرى.. قد تغيرت الألوان',
      'تحدثني تعلمني.. أن قد كان كان',
      'يا زمان سأرسمك في النسيان زهور بستان.. تتفتح عندما يأتي الأوان',
      'يا زمان سوف أكتب الدموع والأحزان.. في كتاب ليس له عنوان',
      'لن أعود للوراء.. لن يكون لي معه لقاء!'
    ]
  },
  {
    id: 'conan-theme',
    title: 'شارة المحقق كونان (الحقيقة دائماً واحدة)',
    animeOrCategory: 'أكشن وغموض وذكاء',
    originalArtist: 'طارق العربي طرقان',
    searchQuery: 'شارة المحقق كونان طارق العربي طرقان سبيستون',
    youtubeId: 'ko4zD6dDq-Q',
    youtubeUrl: 'https://www.youtube.com/shorts/ko4zD6dDq-Q',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:50',
    bpm: 128,
    key: 'G Minor (صول صغير)',
    difficulty: 'متوسط',
    colorGradient: 'from-blue-700 to-cyan-800',
    lyrics: [
      'يكتشف الغامض والمثير.. يستنتج بالعقل الكبير',
      'كونان الرجل الصغير.. يسعى دائماً',
      'الصمت المطبق حوله.. يرسم خطة في الأرجاء',
      'لا يخشى المحن.. يواجه الصعاب',
      'أحداث وألغاز.. وحقائق لا تغيب',
      'الحقيقة دوماً واحدة.. صوت العدالة ينتصر',
      'المحقق كونان.. بطل الألغاز والذكاء!'
    ]
  },
  {
    id: 'les-miserables',
    title: 'البؤساء (ما من أغصان تبقى عارية)',
    animeOrCategory: 'دراما وتاريخ إنساني',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة البؤساء ما من اغصان رشا رزق سبيستون',
    youtubeId: 'VoNddhacdRU',
    youtubeUrl: 'https://www.youtube.com/shorts/VoNddhacdRU',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '02:20',
    bpm: 72,
    key: 'E Minor (مي صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-purple-800 to-slate-900',
    lyrics: [
      'حلمتُ حلماً في زمان.. ما كان فيه للظلم مكان',
      'وجاء وحشٌ كاسر.. بدد أحلامي في ثوان',
      'لكن صوتاً هامساً يناديني..',
      'ما من أغصانٍ تبقى عاريةً من دون أوراق',
      'ما من أشجارٍ تبقى حزينةً طول الفراق',
      'تأتي الأزهار وتملأ الدروب.. وتغسل الأوجاع من القلوب',
      'حلمٌ يولد من ركام الألم.. ونورٌ يسطع في قمة القمم',
      'غداً تشرق الشمس ببهائها.. وتبتسم الأرض لضيائها!'
    ]
  },
  {
    id: 'remi-nobody-boy',
    title: 'شارة ريمي (أنتِ الأمان.. أمي كم أهواها)',
    animeOrCategory: 'سبيستون كلاسيك وأمومة',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة ريمي انت الامان رشا رزق سبيستون',
    youtubeId: 'SuruOcF-jiE',
    youtubeUrl: 'https://www.youtube.com/shorts/SuruOcF-jiE',
    instagramUrl: 'https://www.instagram.com/reel/DdOku9soVpb/?utm_source=ig_web_copy_link&stkn=NTc4MTIwNjQ2YQ==',
    instagramLabel: 'عزف بيانو لحن ريمي (إنستغرام ريلز )',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '01:55',
    bpm: 80,
    key: 'G Major (صول كبير) / A Minor',
    difficulty: 'سهل',
    colorGradient: 'from-rose-500 to-amber-700',
    lyrics: [
      'أنتِ الأمان.. أنتِ الحنان',
      'من تحت قدميكِ لنا الجنان',
      'عندما تضحكين تضحك الحياة',
      'تزهر الآمال في طريقنا.. وننسى كل الآهات',
      'أمي كم أهواها.. أشتاق لرؤياها',
      'وأحن لألقاها.. وأقبل يمناها',
      'أمي هي نبع الحنان.. هي بلسم الأزمان',
      'في حضنها الأمان.. يفيض بالإحسان!'
    ]
  },
  {
    id: 'slam-dunk',
    title: 'طريق السلام / سلام دانك (سرابٌ دليلي)',
    animeOrCategory: 'حماس ورياضة سبيستون',
    originalArtist: 'طارق العربي طرقان',
    searchQuery: 'شارة سلام دانك طريق السلام سبيستون',
    youtubeId: '6fL5H-3uxhc',
    youtubeUrl: 'https://www.youtube.com/shorts/6fL5H-3uxhc',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:40',
    bpm: 135,
    key: 'A Minor (لا صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-red-600 to-orange-700',
    lyrics: [
      'سرابٌ دليلي في الفلا.. ويكاد يقتلني الظمأ',
      'والفكر شرد في الفضاء.. أمضي إلى درب النقاء',
      'طريقي نحو الانتصار.. إصرارٌ يعلو كالفنار',
      'لن أنثني.. لن أستكين.. مهما طال بي المسير!',
      'سلام دانك.. في الملعب نحن الأبطال!'
    ]
  },
  {
    id: 'sally-theme',
    title: 'شارة سالي (أنا قصة إنسان)',
    animeOrCategory: 'دراما وسبيستون عريق',
    originalArtist: 'سهير فهد',
    searchQuery: 'شارة سالي سبيستون انا قصة انسان',
    youtubeId: 'O6nm7srxnpA',
    youtubeUrl: 'https://www.youtube.com/shorts/O6nm7srxnpA',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '02:00',
    bpm: 82,
    key: 'C Minor (دو صغير)',
    difficulty: 'سهل',
    colorGradient: 'from-pink-700 to-rose-900',
    lyrics: [
      'أنا قصة إنسان.. أنا جرح الزمان',
      'أنا سالي سالي..',
      'أعيش في حنين.. لوقع المطر',
      'لضوء القمر.. ورسم القدر',
      'سالي سالي.. سالي سالي',
      'مهما طال ليل الأحزان.. فالصبر زادي والأمان',
      'سالي.. أملٌ يشرق في كل مكان!'
    ]
  },
  {
    id: 'digimon-adventures',
    title: 'أبطال الديجيتال (في فخ غريب وقعنا)',
    animeOrCategory: 'مغامرات وأرقام خيالية',
    originalArtist: 'رشا رزق و سونيا بيطار',
    searchQuery: 'شارة ابطال الديجيتال الجزء الاول سبيستون',
    youtubeId: '-JHU8uIQ5pk',
    youtubeUrl: 'https://www.youtube.com/shorts/-JHU8uIQ5pk',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:50',
    bpm: 130,
    key: 'D Minor (ري صغير)',
    difficulty: 'متوسط',
    colorGradient: 'from-cyan-600 to-blue-800',
    lyrics: [
      'في فخٍ غريبٍ وقعنا.. في عالم الأرقام ضِعنا',
      'كيف الخروج؟ كيف الخروج من أين الطريق؟',
      'عالمٌ ساحرٌ أسرنا.. بالخطر دوماً يحاصرنا',
      'أبطال الديجيتال.. معاً في رحلة الأخطار',
      'نحمي الوفاء والقرار.. نصنع المعجزات',
      'أبطال الديجيتال.. صمود وأمل لا ينكسر!'
    ]
  },
  {
    id: 'lama-bada',
    title: 'لما بدا يتثنى (موشح أندلسي أصيل)',
    animeOrCategory: 'تراث وعربي كلاسيك',
    originalArtist: 'تراث أندلسي / يونا',
    searchQuery: 'موشح لما بدا يتثنى بدون موسيقى',
    youtubeId: 'MGoFyfJWKas',
    youtubeUrl: 'https://www.youtube.com/watch?v=MGoFyfJWKas',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg',
    duration: '02:15',
    bpm: 96,
    key: 'D Hijaz (حجاز النوى)',
    difficulty: 'متوسط',
    colorGradient: 'from-amber-700 to-orange-900',
    lyrics: [
      'لما بدا يتثنى.. حبي جماله فتنا',
      'أمرٌ ما بلحظه أسرنا.. غصنٌ ثنى حين مال',
      'وعدي ويا حيرتي.. ما لي نصيرٌ في هواي',
      'إلا البكاء والنواح..',
      'يا ليل طل لا أشتكي.. إلا لمن خلق الجمال!'
    ]
  },
  {
    id: 'flone',
    title: 'شارة كرتون فلونة',
    animeOrCategory: 'سبيستون مغامرات',
    originalArtist: 'سبيستون',
    searchQuery: 'شارة كرتون فلونة سبيستون',
    youtubeId: 'OZQqIysPoYQ',
    youtubeUrl: 'https://www.youtube.com/shorts/OZQqIysPoYQ',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:30',
    bpm: 110,
    key: 'G Major (صول كبير)',
    difficulty: 'سهل',
    colorGradient: 'from-emerald-600 to-green-800',
    lyrics: [
      'على جزيرة غريبة مثيرة',
      'أخذنا الموج ورسونا',
      'سأروي قصتي أنا وعائلتي',
      'روبنسون كروزو واسمي فلونة',
      'فلونة.. أنا اسمي فلونة',
      'يعرفني الموج والشمس والرمال.. فلونة!',
      'نضيف لوناً بسحر دنيا باهية الجمال!'
    ]
  },
  {
    id: 'lahn-al-hayat',
    title: 'شارة أنمي لحن الحياة',
    animeOrCategory: 'سبيستون وأنمي',
    originalArtist: 'سبيستون',
    searchQuery: 'شارة انمي لحن الحياة سبيستون',
    youtubeId: 'EDYQMAGA6V4',
    youtubeUrl: 'https://www.youtube.com/shorts/EDYQMAGA6V4',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '01:45',
    bpm: 95,
    key: 'C Major (دو كبير)',
    difficulty: 'سهل',
    colorGradient: 'from-teal-600 to-cyan-800',
    lyrics: [
      'صوت الموسيقى يعلو في الأرجاء',
      'يرسم البسمة في وجوه الأبرياء',
      'مع الآنسة صفاء نحيا بالأمل',
      'نغني ونعزف أحلى الجمل',
      'دو ري مي فا صول لا سي دو.. لحن الحياة!'
    ]
  },
  {
    id: 'naruto-blue-bird',
    title: 'Blue Bird - Naruto',
    animeOrCategory: 'أنمي ياباني مترجم',
    originalArtist: 'Ikimono Gakari',
    searchQuery: 'Blue Bird Naruto theme',
    youtubeId: 'Qq8ctEWuMhY',
    youtubeUrl: 'https://www.youtube.com/watch?v=Qq8ctEWuMhY',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:30',
    bpm: 140,
    key: 'F# Minor',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-blue-600 to-indigo-800',
    lyrics: [
      'Habataitara modoranai to itte',
      'Mezashita no wa aoi aoi ano sora',
      'Kanashimi wa mada oboerarezu',
      'Setsunasa wa ima tsukami hajimeta',
      'Anata e to idaku kono kanjou mo',
      'Ima kotoba ni kawatte iku.. Fly Away!'
    ]
  },
  {
    id: 'hazim-al-ra3d',
    title: 'شارة هزيم الرعد (أبرقي أرعدي أبطالاً)',
    animeOrCategory: 'سبيستون حماسي وشجاعة',
    originalArtist: 'طارق العربي طرقان',
    searchQuery: 'شارة هزيم الرعد طارق العربي طرقان سبيستون',
    youtubeId: 'O_397e5j5nQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=O_397e5j5nQ',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:45',
    bpm: 138,
    key: 'D Minor (ري صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-amber-600 to-red-800',
    lyrics: [
      'أبرقي أرعدي أبطالاً وعدوكِ أنبل وعد',
      'جاؤوكِ بصوت الحق الهادر كهزيم الرعد',
      'بسيوف انبعثت من ظُلم الرّدى.. صرخت كبركانٍ ملأ المدى',
      'ما عاش الظالم يسبيكِ في يومٍ أبداً',
      'هزيم الرعد.. هزيم الرعد.. هزيم الرعد!'
    ]
  },
  {
    id: 'dragonball-theme',
    title: 'دراغون بول (رأيت الحقيقة خلف البصر)',
    animeOrCategory: 'سبيستون أكشن وبطولة',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة دراغون بول رشا رزق سبيستون',
    youtubeId: 'i_y09Ncrv1s',
    youtubeUrl: 'https://www.youtube.com/watch?v=i_y09Ncrv1s',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:50',
    bpm: 136,
    key: 'C Minor (دو صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-orange-600 to-red-700',
    lyrics: [
      'رأيت الحقيقة خلف البصر.. رسمت الحروف بعزم الشرر',
      'طريقي طويل وفيه الخطر.. لكني عازم على الظفر',
      'دراغون بول.. دراغون بول!',
      'في ساحات البطولة والتحدي.. لا نبالي بأي اعتداء',
      'بقوة الصداقة والنقاء.. نحمي الأرض والسماء!',
      'دراغون بول!'
    ]
  },
  {
    id: 'simba-theme',
    title: 'سيمبا (سيمبا قادم.. سر الحياة)',
    animeOrCategory: 'سبيستون ومشاعر الطفولة',
    originalArtist: 'طارق العربي طرقان',
    searchQuery: 'شارة سيمبا طارق العربي طرقان سبيستون',
    youtubeId: 'Jg7sP4-VzWk',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jg7sP4-VzWk',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '01:40',
    bpm: 92,
    key: 'G Major (صول كبير)',
    difficulty: 'سهل',
    colorGradient: 'from-amber-500 to-yellow-700',
    lyrics: [
      'سيمبا قادم.. سيمبا جاء',
      'سيمبا عند التحدي.. يخطو نحو العلاء',
      'في الغابة الواسعة.. يحيا بالوفاء',
      'ينشر السلام والرجاء.. هذا هو سر الحياة',
      'سيمبا بطل الغابة العظيم!'
    ]
  },
  {
    id: 'captain-majed',
    title: 'الكابتن ماجد (سجل أهدافاً لا تيأس)',
    animeOrCategory: 'سبيستون رياضة وحماس',
    originalArtist: 'سهير فهد / طارق العربي طرقان',
    searchQuery: 'شارة الكابتن ماجد سبيستون الجزء الثاني',
    youtubeId: 'qQ5H9l_aW0Q',
    youtubeUrl: 'https://www.youtube.com/watch?v=qQ5H9l_aW0Q',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:35',
    bpm: 130,
    key: 'F Major (فا كبير)',
    difficulty: 'متوسط',
    colorGradient: 'from-blue-600 to-emerald-700',
    lyrics: [
      'كابتن ماجد عاد إليكم من جديد.. يطوي دروب المجد بعزم من حديد',
      'سجل هدفاً.. حقق فوزاً.. لا تستسلم للأحزان',
      'بالإصرار وبالعزيمة.. نرسم أجمل الألحان',
      'مرر سدد نحو المرمى.. نحو الفوز الكبير!',
      'كابتن ماجد.. بطل الملاعب!'
    ]
  },
  {
    id: 'sakura-cardcaptor',
    title: 'أبطال الكرة / ساكورا (أسرار وبطولة)',
    animeOrCategory: 'سبيستون حديث ورائج',
    originalArtist: 'رشا رزق',
    searchQuery: 'شارة ابطال الكرة رشا رزق سبيستون',
    youtubeId: '8dKzU5sQ1bM',
    youtubeUrl: 'https://www.youtube.com/watch?v=8dKzU5sQ1bM',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:40',
    bpm: 134,
    key: 'E Minor (مي صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-teal-600 to-blue-800',
    lyrics: [
      'هيا بنا معاً ننطلق إلى الأمام.. بالحب والإخلاص نصنع السلام',
      'في ملعب الأبطال نلتقي.. نرفع الرايات في الأفق',
      'مهما كانت الصعاب في الطريق.. لا نتراجع أبداً كفريق!',
      'أبطال الكرة.. رمز الإصرار والتحدي!'
    ]
  },
  {
    id: 'tokyo-ghoul-unravel',
    title: 'Unravel - Tokyo Ghoul (شارة طوكيو غول الرائجة)',
    animeOrCategory: 'أنمي رائج وعالمي',
    originalArtist: 'TK from Ling Tosite Sigure',
    searchQuery: 'Tokyo Ghoul Unravel acoustic',
    youtubeId: '7aMOurgDB-o',
    youtubeUrl: 'https://www.youtube.com/watch?v=7aMOurgDB-o',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    duration: '01:55',
    bpm: 135,
    key: 'G Minor (صول صغير)',
    difficulty: 'تحدي حماسي',
    colorGradient: 'from-purple-800 to-red-950',
    lyrics: [
      'Oshiete oshiete yo sono shikumi wo',
      'Boku no naka ni dare ga iru no?',
      'Kowareta kowareta yo kono sekai de',
      'Kimi ga warau nanimo miezu ni',
      'Yureta yuganda sekai ni dandan boku wa',
      'Sukitootte mienaku natte',
      'Mitsukenaide boku no koto wo.. mitsumenaide',
      'Dareka ga kaita sekai no naka de!',
      'Oboeteite boku no koto wo.. azayaka na mama!'
    ]
  },
  {
    id: 'fadel-shaker-ya-ghayeb',
    title: 'يا غايب (كاريوكي ولحن)',
    animeOrCategory: 'طرب ورومانسية - فضل شاكر',
    originalArtist: 'فضل شاكر (Fadel Shaker)',
    searchQuery: 'كاريوكي يا غايب فضل شاكر',
    youtubeId: 'tTrkFtOf5Pc',
    youtubeUrl: 'https://www.youtube.com/watch?v=tTrkFtOf5Pc',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '03:30',
    bpm: 88,
    key: 'C Minor (مقام كرد / نهاوند)',
    difficulty: 'متوسط',
    colorGradient: 'from-rose-700 to-indigo-900',
    lyrics: [
      'يا غايب ليه ما تسأل.. ع حبابك اللي يحبونك',
      'ما ينام الليل لعيونك.. أنا بفكر فيك',
      'تبعد عني وتنساني.. محتاجك حن والقاك',
      'وحشني صوتك وعينيك.. وعيونك الحلوين',
      'حبيبي لو تغيب عني.. تظل الروح تناديلك',
      'ولا غيرك سكن بالبال.. ولا غيرك يواسيني',
      'يا غايب.. تعال ورجع البسمة لقلبي المشتاق'
    ]
  },
  {
    id: 'fadel-shaker-law-ala-albi',
    title: 'لو على قلبي (الأغنية الأصلية)',
    animeOrCategory: 'طرب ورومانسية - فضل شاكر',
    originalArtist: 'فضل شاكر (كلمات: ربيع السيوفي)',
    searchQuery: 'فضل شاكر لو على قلبي',
    youtubeId: 'elKpkk_I-_U',
    youtubeUrl: 'https://www.youtube.com/watch?v=elKpkk_I-_U',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '04:10',
    bpm: 84,
    key: 'D Minor (مقام نهاوند)',
    difficulty: 'سهل',
    colorGradient: 'from-pink-700 to-purple-950',
    lyrics: [
      'لو على قلبي داب في هواك وكفاية.. ليل وسهر وعناد ويايا',
      'جوه عيوني حنين وغرام مشتاق لعينيك',
      'قلبي نادالك حن في يوم وتعالى.. وأديك روحي بس تعالى',
      'يا اللي بحبك قرب طمن قلبي عليك',
      'بتغيب أيام وليالي.. وإنت ما بتغيب عن بالي',
      'وتروح وتسيبني عليك مشغول',
      'بحلم بعينيك وغرامك.. وبدوب في هواك وكلامك',
      'ولا ليلة أنا ليه لياليا علي تطول',
      'اسمع مني وعيش مع قلبي زماني.. وتدوب فيا وأحبك تاني',
      'كفاية عشت كتير من قبلك بحلم بيك',
      'تبعد عني ليه طب ما أنا قدامك.. بسأل قلبك إيه أحلامك',
      'لو تتمنى الدنيا بحالها تكون في إيديك'
    ]
  },
  {
    id: 'fadel-shaker-law-ala-albi-melody',
    title: 'لو على قلبي (اللحن والكاريوكي )',
    animeOrCategory: 'طرب ولحن - فضل شاكر',
    originalArtist: 'فضل شاكر (ألحان: نادر نور)',
    searchQuery: 'لو على قلبي فضل شاكر لحن موسيقى',
    youtubeId: 't85n-q95dT4',
    youtubeUrl: 'https://www.youtube.com/watch?v=t85n-q95dT4',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '04:00',
    bpm: 84,
    key: 'D Minor (مقام نهاوند)',
    difficulty: 'متوسط',
    colorGradient: 'from-amber-600 to-rose-900',
    lyrics: [
      'لو على قلبي داب في هواك وكفاية.. ليل وسهر وعناد ويايا',
      'جوه عيوني حنين وغرام مشتاق لعينيك',
      'قلبي نادالك حن في يوم وتعالى.. وأديك روحي بس تعالى',
      'يا اللي بحبك قرب طمن قلبي عليك',
      'بتغيب أيام وليالي.. وإنت ما بتغيب عن بالي',
      'وتروح وتسيبني عليك مشغول',
      'بحلم بعينيك وغرامك.. وبدوب في هواك وكلامك',
      'ولا ليلة أنا ليه لياليا علي تطول',
      'اسمع مني وعيش مع قلبي زماني.. وتدوب فيا وأحبك تاني',
      'كفاية عشت كتير من قبلك بحلم بيك',
      'تبعد عني ليه طب ما أنا قدامك.. بسأل قلبك إيه أحلامك',
      'لو تتمنى الدنيا بحالها تكون في إيديك'
    ]
  },
  {
    id: 'fairouz-kan-enna-tahoun',
    title: 'كان عنا طاحون (سهر الليالي - كاريوكي + كورس )',
    animeOrCategory: 'طرب وأصالة فيروزية',
    originalArtist: 'السيدة فيروز (كلمات وألحان: إلياس الرحباني)',
    searchQuery: 'كان عنا طاحون سهر الليالي كاريوكي فيروز كورس',
    youtubeId: 'XDFLi9gmBp0',
    youtubeUrl: 'https://www.youtube.com/watch?v=XDFLi9gmBp0',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '03:45',
    bpm: 116,
    key: 'A Minor (لا صغير / نهاوند)',
    difficulty: 'متوسط',
    colorGradient: 'from-emerald-700 via-teal-800 to-indigo-950',
    lyrics: [
      'شو كانت حلوة الليالي.. والهوى يبقى ناطرنا',
      'وتيجي تلاقيني وياخدنا بعيد.. هدير المي والليل',
      'كان عنا طاحون ع نبع المي.. قدامه ساحات مزروعة فيّ',
      'وجدي كان يطحن للحي قمح وسهريات',
      'ويبقوا الناس بهالساحات.. شي معهن كياس شي عربيات',
      'رايحين جايين ع طول الطريق.. تهدر غنيات',
      'آه يا سهر الليالي.. آه يا حلو على بالي',
      'نغني آه.. نغني آه.. نغني على الطرقات',
      'ياي ياي ياي يا سهر الليالي.. ياي ياي ياي يا حلو على بالي',
      'وراحت الأيام وشوي شوي.. سكت الطاحون ع كتف المي',
      'وجدي صار طاحون الذكريات.. يطحن شمس وفيّ',
      'يا سهر الليالي.. آه يا حلو على بالي.. نغني على الطرقات!'
    ]
  },
  {
    id: 'fairouz-sahar-el-layali',
    title: 'سهر الليالي (آه يا حلو على بالي - لحن وكاريوكي )',
    animeOrCategory: 'طرب وأصالة فيروزية',
    originalArtist: 'السيدة فيروز (فيروزيات خالدة)',
    searchQuery: 'سهر الليالي فيروز كاريوكي كورس',
    youtubeId: 'XDFLi9gmBp0',
    youtubeUrl: 'https://www.youtube.com/watch?v=XDFLi9gmBp0',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '03:45',
    bpm: 116,
    key: 'A Minor (لا صغير / نهاوند)',
    difficulty: 'سهل',
    colorGradient: 'from-teal-600 via-cyan-800 to-slate-900',
    lyrics: [
      'آه يا سهر الليالي.. آه يا حلو على بالي',
      'نغني آه.. نغني آه.. نغني على الطرقات',
      'ياي ياي ياي يا سهر الليالي.. ياي ياي ياي يا حلو على بالي',
      'نغني آه.. نغني آه.. نغني على الطرقات',
      'كان عنا طاحون ع نبع المي.. قدامه ساحات مزروعة فيّ',
      'وجدي كان يطحن للحي قمح وسهريات',
      'ويبقوا الناس بهالساحات.. شي معهن كياس شي عربيات',
      'رايحين جايين ع طول الطريق تهدر غنيات',
      'آه يا سهر الليالي.. آه يا حلو على بالي.. نغني على الطرقات!'
    ]
  },
  {
    id: 'asabaka-eshq',
    title: 'أصابك عشق (أم رُميت بأسهمِ - كاريوكي )',
    animeOrCategory: 'طرب وقصائد شعرية',
    originalArtist: 'عبدالرحمن محمد (شعر: يزيد بن معاوية)',
    searchQuery: 'كاريوكي اصابك عشق عبد الرحمن محمد',
    youtubeId: 'ij_LVpSvwLQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=ij_LVpSvwLQ',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '04:15',
    bpm: 78,
    key: 'C Minor (مقام كُرد / نهاوند)',
    difficulty: 'متوسط',
    colorGradient: 'from-amber-800 via-rose-900 to-stone-950',
    lyrics: [
      'أصابك عشقٌ أم رُميت بأسهمِ؟.. فما هذه إلا سجيّة مغرمِ',
      'ألا فاسقني كاساتِ راحٍ وغنِّ لي.. بذكرِ سُلَيْمة والكمانِ ونغّمي',
      'أيا داعياً بذكر العامرية أنني.. أغارُ عليها من فمِ المتكلِّمِ',
      'أغارُ عليها من ثيابها إذا.. كست جسمها الناعم فوق المنعَّمِ',
      'ليل يا ليل.. ليل الليل يا ليل.. يا ليل يا ليل',
      'أغارُ عليها من أبيها وأمها.. إذا حدّثاها بالكلام المغمغمِ',
      'وأحسدُ كاساتٍ تقبِّلن ثغرها.. إذا وضعتها موضع اللثمِ في الفمِ',
      'ليل يا ليل.. ليل الليل يا ليل.. يا ليل يا ليل'
    ]
  },
  {
    id: 'warda-batwanes-beek',
    title: 'بتونس بيك (موسيقى فقط - كاريوكي )',
    animeOrCategory: 'طرب وزمن جميل - وردة',
    originalArtist: 'وردة الجزائرية (ألحان: صلاح الشرنوبي - كلمات: عمر بطيشة)',
    searchQuery: 'وردة بتونس بيك كاريوكي موسيقى فقط',
    youtubeId: 'AB3SZhGblhg',
    youtubeUrl: 'https://www.youtube.com/watch?v=AB3SZhGblhg',
    backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    duration: '04:30',
    bpm: 102,
    key: 'D Minor (مقام كُرد / نهاوند)',
    difficulty: 'متوسط',
    colorGradient: 'from-amber-600 via-rose-700 to-red-950',
    lyrics: [
      'بتونس بيك وإنت معايا.. وبتونس بيك وبلاقي في قربك دنيايا',
      'لما تقرب أنا بتونس بيك.. ولما بتبعد أنا بتونس بيك',
      'وخيالك بيكون ويايا ويايا',
      'وإن جاه صوتك.. صوتك بيونسني',
      'وهواك في البعد.. في البعد بيحرسني',
      'والشوق يناديلك جوايا',
      'وأنا وأنا وأنا وأنا وأنا.. بتونس بيك وإنت معايا',
      'بتمر ساعات بعد لقانا.. والروح عطشانة لروياك',
      'عيشتني في حبك أجمل أيام.. ولقيت في عيونك أحلى غرام',
      'وبتونس بيك وإنت معايا.. وبلاقي في قربك دنيايا!'
    ]
  }
];

export interface VoiceAnalysis {
  voiceType: 'ذكر (Male)' | 'أنثى (Female)' | 'طفل (Child)' | 'لم يُرصد صوت بشري (No Voice)';
  pitchTier: string;
  avgFrequencyHz: number;
  confidence: number;
  clarity: string;
  emoji: string;
  tonalMatch: string;
  overallScore: number;
  hasHumanVoice: boolean;
  detectedLyricsText?: string;
  lyricsMatchPercent?: number;
  critiqueNotes?: string;
  isSupervisorOverridden?: boolean;
  overrideSongTitle?: string;
}

// محرك التحليل الصوتي الصارم (كشف الصمت + مطابقة الكلمات الحقيقية + استقرار التردد)
async function analyzeVoicePitch(blob: Blob, song: KaraokeSong, spokenTranscript?: string): Promise<VoiceAnalysis> {
  const result = await analyzeVoicePerformance(
    blob,
    song.title,
    song.lyrics || [],
    spokenTranscript
  );

  return {
    voiceType: result.voiceType as any,
    pitchTier: result.pitchTier,
    avgFrequencyHz: result.avgFrequencyHz,
    confidence: result.confidence,
    clarity: result.clarity,
    emoji: result.emoji,
    tonalMatch: result.tonalMatch,
    overallScore: result.overallScore,
    hasHumanVoice: result.hasHumanVoice,
    detectedLyricsText: result.detectedLyricsText,
    lyricsMatchPercent: result.lyricsMatchPercent,
    critiqueNotes: result.critiqueNotes
  };
}

export const StudioRecorder: React.FC = () => {
  const { user } = useAuth();
  const isPlatformOwnerAuthenticated = user?.email === 'shaimaaessah236@gmail.com' || isPlatformOwner();

  // Speech Recognition state & refs
  const speechRecognitionRef = useRef<any>(null);
  const recognizedTranscriptRef = useRef<string>('');

  // Hidden Supervisor / Owner Panel State
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [supervisorPasscode, setSupervisorPasscode] = useState('');
  const [isSupervisorUnlocked, setIsSupervisorUnlocked] = useState<boolean>(() => {
    return isPlatformOwner() || (typeof window !== 'undefined' && localStorage.getItem('yona_supervisor_unlocked') === 'true');
  });
  const [supervisorError, setSupervisorError] = useState('');
  const [overrideScore, setOverrideScore] = useState<number>(92);
  const [overrideSongTitle, setOverrideSongTitle] = useState<string>('');
  const [overrideVoiceType, setOverrideVoiceType] = useState<string>('');
  const [overridePitchTier, setOverridePitchTier] = useState<string>('');
  const [overrideJuryNotes, setOverrideJuryNotes] = useState<string>('');
  const [supervisorSuccessToast, setSupervisorSuccessToast] = useState<string | null>(null);

  const [selectedSong, setSelectedSong] = useState<KaraokeSong>(KARAOKE_SONGS_CATALOG[0]);
  const [activeTab, setActiveTab] = useState<'sing' | 'spacetoon_mic' | 'piano' | 'contest_board'>('sing');
  const [showSpacetoonMicDrawer, setShowSpacetoonMicDrawer] = useState(false);
  const [selectedVocalFilter, setSelectedVocalFilter] = useState<SpacetoonVocalFilterId>('radio');
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<VoiceAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evalStage, setEvalStage] = useState<'idle' | 'evaluating' | 'revealed'>('idle');
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalStepText, setEvalStepText] = useState('');
  const [userDecision, setUserDecision] = useState<'none' | 'kept' | 'deleted'>('none');
  const [submittedEntryId, setSubmittedEntryId] = useState<string | null>(null);
  const evalTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [recorderError, setRecorderError] = useState<string | null>(null);
  const [playerMode, setPlayerMode] = useState<'youtube' | 'builtInAudio'>('youtube');
  const [isPlayingBacking, setIsPlayingBacking] = useState(false);
  const [backingVolume, setBackingVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // إمكانية تخصيص أو استبدال فيديو يوتيوب برابط أو بحث مخصص
  const [customYouTubeQuery, setCustomYouTubeQuery] = useState('');
  const [activeYouTubeQuery, setActiveYouTubeQuery] = useState('');

  // --- CUSTOM SONG (غناء أغنية حرة من اختيار المتسابق) ---
  const [customSongs, setCustomSongs] = useState<KaraokeSong[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('yona_custom_karaoke_songs');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading custom songs:', e);
      }
    }
    return [];
  });
  const [showCustomSongModal, setShowCustomSongModal] = useState(false);
  const [editingCustomSongId, setEditingCustomSongId] = useState<string | null>(null);
  const [customSongTitle, setCustomSongTitle] = useState('');
  const [customSongArtist, setCustomSongArtist] = useState('');
  const [customSongMaqam, setCustomSongMaqam] = useState('نهاوند');
  const [customSongGenre, setCustomSongGenre] = useState('طربية كلاسيكية ');
  const [customSongLyrics, setCustomSongLyrics] = useState('');
  const [customSongYouTubeUrl, setCustomSongYouTubeUrl] = useState('');

  // --- ADVANCED AUDIO TOOLS (BPM, SCALES & PIANO) COLLAPSIBLE DRAWER ---
  const [isAdvancedToolsOpen, setIsAdvancedToolsOpen] = useState(false);
  const [tempoMultiplier, setTempoMultiplier] = useState<number>(1.0);
  
  // Helper to parse key from song description
  const parseKeyFromSong = (songKey?: string): { rootIndex: number; scaleId: string } => {
    if (!songKey) return { rootIndex: 2, scaleId: 'minor' }; // Default D Minor
    const lower = songKey.toLowerCase();
    
    let rootIndex = 0;
    if (lower.includes('c#') || lower.includes('db') || lower.includes('دو#')) rootIndex = 1;
    else if (lower.includes('d#') || lower.includes('eb') || lower.includes('ميb') || lower.includes('ري#')) rootIndex = 3;
    else if (lower.includes('f#') || lower.includes('gb') || lower.includes('فا#')) rootIndex = 6;
    else if (lower.includes('g#') || lower.includes('ab') || lower.includes('لاb') || lower.includes('صول#')) rootIndex = 8;
    else if (lower.includes('a#') || lower.includes('bb') || lower.includes('سيb') || lower.includes('لا#')) rootIndex = 10;
    else if (lower.includes('d') || lower.includes('ري')) rootIndex = 2;
    else if (lower.includes('e') || lower.includes('مي')) rootIndex = 4;
    else if (lower.includes('f') || lower.includes('فا')) rootIndex = 5;
    else if (lower.includes('g') || lower.includes('صول')) rootIndex = 7;
    else if (lower.includes('a') || lower.includes('لا')) rootIndex = 9;
    else if (lower.includes('b') || lower.includes('سي')) rootIndex = 11;
    else if (lower.includes('c') || lower.includes('دو')) rootIndex = 0;

    let scaleId = 'minor';
    if (lower.includes('major') || lower.includes('عجم') || lower.includes('كبير')) scaleId = 'major';
    else if (lower.includes('hijaz') || lower.includes('حجاز')) scaleId = 'hijaz';
    else if (lower.includes('bayati') || lower.includes('بياتي')) scaleId = 'bayati';
    else if (lower.includes('kurd') || lower.includes('كرد')) scaleId = 'kurd';
    else if (lower.includes('harmonic') || lower.includes('معدل')) scaleId = 'harmonic_minor';
    else if (lower.includes('pentatonic') || lower.includes('خماسي')) scaleId = 'pentatonic';
    else if (lower.includes('blues') || lower.includes('بلوز')) scaleId = 'blues';
    else scaleId = 'minor';

    return { rootIndex, scaleId };
  };

  const initialKeyInfo = parseKeyFromSong(KARAOKE_SONGS_CATALOG[0].key);
  const [pianoRootIndex, setPianoRootIndex] = useState<number>(initialKeyInfo.rootIndex);
  const [pianoScaleId, setPianoScaleId] = useState<string>(initialKeyInfo.scaleId);
  const [transposeSemitones, setTransposeSemitones] = useState<number>(0);
  const [octaveShift, setOctaveShift] = useState<number>(0); // -1, 0, +1
  const [pianoTimbre, setPianoTimbre] = useState<PianoTimbre>('grand-piano');
  const [pianoVolume, setPianoVolume] = useState<number>(0.9);
  const [sustainPedal, setSustainPedal] = useState<boolean>(false);
  const [activePressedMidi, setActivePressedMidi] = useState<number | null>(null);
  const [activePressedPcKey, setActivePressedPcKey] = useState<string | null>(null);
  const [lastPlayedNoteInfo, setLastPlayedNoteInfo] = useState<{
    noteName: string;
    arabicName: string;
    freq: number;
    degreeLabel: string;
    isRoot: boolean;
  } | null>(null);
  const [showKeyboardGuide, setShowKeyboardGuide] = useState<boolean>(false);

  const pianoAudioCtxRef = useRef<AudioContext | null>(null);

  // Calculate current scale definition and effective root
  const currentScaleDef = SCALE_DEFINITIONS.find((s) => s.id === pianoScaleId) || SCALE_DEFINITIONS[0];
  const effectiveRootIndex = (pianoRootIndex + transposeSemitones + 120) % 12;
  const effectiveRootOption = KEY_ROOTS.find((r) => r.rootIndex === effectiveRootIndex) || KEY_ROOTS[0];

  // Auto-sync piano key with currently selected song
  const handleSyncWithSongKey = () => {
    const parsed = parseKeyFromSong(selectedSong.key);
    setPianoRootIndex(parsed.rootIndex);
    setPianoScaleId(parsed.scaleId);
    setTransposeSemitones(0);
  };

  // Real-time zero-latency instrument synthesis
  const playPianoNote = useCallback(
    (
      baseMidi: number,
      noteName: string,
      arabicName: string,
      degreeLabel: string,
      isRoot: boolean,
      pcKeyLabel?: string
    ) => {
      setActivePressedMidi(baseMidi);
      if (pcKeyLabel) setActivePressedPcKey(pcKeyLabel.toLowerCase());

      setTimeout(() => {
        setActivePressedMidi((prev) => (prev === baseMidi ? null : prev));
        setActivePressedPcKey((prev) => (prev === pcKeyLabel?.toLowerCase() ? null : prev));
      }, 300);

      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!pianoAudioCtxRef.current || pianoAudioCtxRef.current.state === 'closed') {
          pianoAudioCtxRef.current = new AudioCtx();
        }
        const ctx = pianoAudioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const effectiveMidi = baseMidi + octaveShift * 12 + transposeSemitones;
        const freq = 440 * Math.pow(2, (effectiveMidi - 69) / 12);
        const now = ctx.currentTime;

        setLastPlayedNoteInfo({
          noteName,
          arabicName,
          freq: Math.round(freq),
          degreeLabel,
          isRoot
        });

        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gainNode = ctx.createGain();

        const sustainMultiplier = sustainPedal ? 1.9 : 1.0;
        const vol = pianoVolume * 0.55;

        if (pianoTimbre === 'grand-piano') {
          osc.type = 'triangle';
          osc2.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 2.0, now);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(3600, now);

          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol, now + 0.015);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.6 * sustainMultiplier);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 1.7 * sustainMultiplier);
          osc2.stop(now + 1.7 * sustainMultiplier);
        } else if (pianoTimbre === 'strings') {
          osc.type = 'sawtooth';
          osc2.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 1.006, now);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2200, now);

          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol * 0.8, now + 0.12);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2 * sustainMultiplier);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 2.3 * sustainMultiplier);
          osc2.stop(now + 2.3 * sustainMultiplier);
        } else if (pianoTimbre === 'oud-qanun') {
          osc.type = 'square';
          osc2.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 2, now);
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(freq * 1.8, now);
          filter.Q.setValueAtTime(3.2, now);

          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol, now + 0.01);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.3 * sustainMultiplier);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 1.4 * sustainMultiplier);
          osc2.stop(now + 1.4 * sustainMultiplier);
        } else if (pianoTimbre === 'flute') {
          osc.type = 'sine';
          osc2.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 3, now);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(2800, now);

          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol * 0.9, now + 0.06);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8 * sustainMultiplier);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 1.9 * sustainMultiplier);
          osc2.stop(now + 1.9 * sustainMultiplier);
        } else if (pianoTimbre === 'synth-lead') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, now);
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(3800, now);

          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol * 0.85, now + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4 * sustainMultiplier);

          osc.connect(filter);
          filter.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 1.5 * sustainMultiplier);
        } else {
          // Music Box / Celesta
          osc.type = 'sine';
          osc2.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          osc2.frequency.setValueAtTime(freq * 4, now);
          gainNode.gain.setValueAtTime(0.001, now);
          gainNode.gain.linearRampToValueAtTime(vol, now + 0.005);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0 * sustainMultiplier);

          osc.connect(gainNode);
          osc2.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(now);
          osc2.start(now);
          osc.stop(now + 2.1 * sustainMultiplier);
          osc2.stop(now + 2.1 * sustainMultiplier);
        }
      } catch (err) {
        console.warn('Piano synth error:', err);
      }
    },
    [octaveShift, transposeSemitones, pianoTimbre, pianoVolume, sustainPedal]
  );

  // Play a full harmonic triad/seventh chord corresponding to scale degree (0 to 7)
  const playChordByIndex = useCallback(
    (degreeIndex: number) => {
      const intervals = currentScaleDef.intervals;
      const numDegrees = intervals.length;
      
      const rootInterval = intervals[degreeIndex % numDegrees];
      const thirdInterval = intervals[(degreeIndex + 2) % numDegrees];
      const fifthInterval = intervals[(degreeIndex + 4) % numDegrees];

      const baseMidi = 60 + effectiveRootIndex;
      const chordMidis = [
        baseMidi + rootInterval,
        baseMidi + (thirdInterval < rootInterval ? thirdInterval + 12 : thirdInterval),
        baseMidi + (fifthInterval < rootInterval ? fifthInterval + 12 : fifthInterval)
      ];

      chordMidis.forEach((midi, idx) => {
        setTimeout(() => {
          playPianoNote(
            midi,
            `Chord-${degreeIndex + 1}`,
            `كورد الدرجة ${degreeIndex + 1}`,
            `كورد الدرجة ${degreeIndex + 1}`,
            degreeIndex === 0,
            (degreeIndex + 1).toString()
          );
        }, idx * 20);
      });
    },
    [currentScaleDef, effectiveRootIndex, playPianoNote]
  );

  // PHYSICAL COMPUTER KEYBOARD LISTENER (Full mapping: Home row, QWERTY, Chords 1-8, Octaves Z/X, Transpose -/+)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (
        ['input', 'textarea', 'select'].includes(targetTag) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Octave Shift shortcuts: Z (down), X (up)
      if (key === 'z') {
        setOctaveShift((prev) => Math.max(-1, prev - 1));
        return;
      }
      if (key === 'x') {
        setOctaveShift((prev) => Math.min(1, prev + 1));
        return;
      }

      // Transpose shortcuts: - (down 1 semitone), + / = (up 1 semitone)
      if (key === '-' || key === '_') {
        setTransposeSemitones((prev) => Math.max(-12, prev - 1));
        return;
      }
      if (key === '=' || key === '+') {
        setTransposeSemitones((prev) => Math.min(12, prev + 1));
        return;
      }

      // Sustain Pedal shortcut: Spacebar
      if (e.code === 'Space') {
        e.preventDefault();
        setSustainPedal((prev) => !prev);
        return;
      }

      // Chords shortcuts: 1 through 8
      const num = parseInt(key);
      if (!isNaN(num) && num >= 1 && num <= 8) {
        e.preventDefault();
        playChordByIndex(num - 1);
        return;
      }

      // Piano Notes mapped to Computer Keyboard keys
      const matchedKey = BASE_PIANO_KEYS.find(
        (k) => k.pcKey.toLowerCase() === key || k.pcKeyAlt?.toLowerCase() === key
      );

      if (matchedKey) {
        const effectiveMidi = matchedKey.midiNote + octaveShift * 12 + transposeSemitones;
        const noteSemitone = ((effectiveMidi % 12) + 12) % 12;
        const intervalFromRoot = (noteSemitone - effectiveRootIndex + 120) % 12;
        const scaleDegreeIndex = currentScaleDef.intervals.indexOf(intervalFromRoot);
        const isRoot = scaleDegreeIndex === 0;
        const degreeLabel =
          scaleDegreeIndex !== -1
            ? isRoot
              ? 'درجة الأساس  (Tonic)'
              : `درجة ${scaleDegreeIndex + 1}`
            : 'خارج المقام';

        playPianoNote(
          matchedKey.midiNote,
          matchedKey.noteName,
          matchedKey.arabicName,
          degreeLabel,
          isRoot,
          matchedKey.displayKey
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    effectiveRootIndex,
    currentScaleDef,
    octaveShift,
    transposeSemitones,
    playPianoNote,
    playChordByIndex
  ]);

  // حالة مسابقة الأسبوع وتخزين المشاركات
  const [contestEntries, setContestEntries] = useState<ContestEntry[]>(() => {
    return getContestEntries();
  });

  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [contestantName, setContestantName] = useState('');
  const [contestantCity, setContestantCity] = useState('');
  const [contestantComment, setContestantComment] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [effectiveBackingUrl, setEffectiveBackingUrl] = useState<string>('');

  // مراجع عناصر الصوت والفيديو
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordedBlobRef = useRef<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  // تحديث رابط اللحن الموسيقي المضمون والتوليد الفوري
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = getOrCreateKaraokeWavUrl(selectedSong.id, selectedSong.title, selectedSong.lyrics);
      setEffectiveBackingUrl(url || selectedSong.backingAudioUrl);
    }
  }, [selectedSong]);

  // مزامنة المشاركات واستقبال أي تحديثات فورية
  useEffect(() => {
    const handleUpdate = () => {
      setContestEntries(getContestEntries());
    };
    window.addEventListener('yona_contest_updated', handleUpdate);
    return () => window.removeEventListener('yona_contest_updated', handleUpdate);
  }, []);

  // تنظيف الموارد عند مغادرة الصفحة
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {}
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
      }
    };
  }, []);

  // التحكم بمستوى صوت وسرعة اللحن
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : backingVolume;
      bgAudioRef.current.playbackRate = tempoMultiplier;
    }
  }, [backingVolume, isMuted, tempoMultiplier]);

  // تبديل الأغنية وإعادة ضبط السطر المختار
  const handleSelectSong = (song: KaraokeSong) => {
    setSelectedSong(song);
    setActiveLineIdx(0);
    setActiveYouTubeQuery('');
    setCustomYouTubeQuery('');
    resetRecording();
    const url = getOrCreateKaraokeWavUrl(song.id, song.title, song.lyrics);
    setEffectiveBackingUrl(url || song.backingAudioUrl);
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.currentTime = 0;
      if (url) bgAudioRef.current.src = url;
      setIsPlayingBacking(false);
    }
  };

  // فتح نافذة إنشاء شارة جديدة
  const handleOpenAddCustomSong = () => {
    setEditingCustomSongId(null);
    setCustomSongTitle('');
    setCustomSongArtist('');
    setCustomSongMaqam('نهاوند');
    setCustomSongGenre('طربية كلاسيكية ');
    setCustomSongLyrics('');
    setCustomSongYouTubeUrl('');
    setShowCustomSongModal(true);
  };

  // فتح نافذة تعديل شارة مخصصة حالية وإضافة/تعديل الكلمات
  const handleEditCustomSong = (song: KaraokeSong, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingCustomSongId(song.id);
    setCustomSongTitle(song.title);
    setCustomSongArtist(song.originalArtist || '');
    setCustomSongMaqam(song.maqam || 'نهاوند');
    setCustomSongGenre(song.songGenre || 'طربية كلاسيكية ');

    // التحقق هل الكلمات الحالية هي مجرد نصوص تلقائية بديلة
    const isPlaceholder =
      song.lyrics.length <= 4 &&
      song.lyrics.some((l) => l.includes('أداء:') || l.includes('مقام:') || l.includes('استوديو يونا'));

    setCustomSongLyrics(isPlaceholder ? '' : song.lyrics.join('\n'));
    setCustomSongYouTubeUrl(
      song.youtubeUrl && !song.youtubeUrl.includes('search_query=') ? song.youtubeUrl : ''
    );
    setShowCustomSongModal(true);
  };

  // حفظ أو تحديث شارة أو أغنية حرة من اختيار المتسابق مع كلماتها
  const handleSaveCustomSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSongTitle.trim()) return;

    const lyricsLines = customSongLyrics
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const defaultLyrics =
      lyricsLines.length > 0
        ? lyricsLines
        : [
            `${customSongTitle.trim()}`,
            `أداء: ${customSongArtist.trim() || 'غناء حر'}`,
            `مقام: ${customSongMaqam} • نوع: ${customSongGenre}`,
            `أداء وغناء المتسابق في استوديو يونا للمسابقات `
          ];

    if (editingCustomSongId) {
      // تحديث شارة موجودة بالفعل
      const updated = customSongs.map((s) => {
        if (s.id === editingCustomSongId) {
          const updatedSong: KaraokeSong = {
            ...s,
            title: customSongTitle.trim(),
            animeOrCategory: `${customSongGenre} • مقام ${customSongMaqam}`,
            originalArtist: customSongArtist.trim() || 'اختيار المتسابق',
            searchQuery: `${customSongTitle.trim()} ${customSongArtist.trim()} كاريوكي`,
            youtubeUrl:
              customSongYouTubeUrl.trim() ||
              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                customSongTitle.trim() + ' كاريوكي'
              )}`,
            lyrics: defaultLyrics,
            maqam: customSongMaqam,
            songGenre: customSongGenre
          };
          return updatedSong;
        }
        return s;
      });

      setCustomSongs(updated);
      try {
        localStorage.setItem('yona_custom_karaoke_songs', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      const editedSong = updated.find((s) => s.id === editingCustomSongId);
      if (editedSong && selectedSong.id === editingCustomSongId) {
        handleSelectSong(editedSong);
      }

      setShowCustomSongModal(false);
      setEditingCustomSongId(null);
      setCustomSongTitle('');
      setCustomSongArtist('');
      setCustomSongLyrics('');
      setCustomSongYouTubeUrl('');
      return;
    }

    // إضافة شارة جديدة
    const newSong: KaraokeSong = {
      id: `custom-song-${Date.now()}`,
      title: customSongTitle.trim(),
      animeOrCategory: `${customSongGenre} • مقام ${customSongMaqam}`,
      originalArtist: customSongArtist.trim() || 'اختيار المتسابق',
      searchQuery: `${customSongTitle.trim()} ${customSongArtist.trim()} كاريوكي`,
      youtubeUrl: customSongYouTubeUrl.trim() || `https://www.youtube.com/results?search_query=${encodeURIComponent(customSongTitle.trim() + ' كاريوكي')}`,
      backingAudioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
      duration: '02:00',
      difficulty: 'متوسط',
      lyrics: defaultLyrics,
      maqam: customSongMaqam,
      songGenre: customSongGenre,
      isCustomSong: true,
      colorGradient: 'from-fuchsia-600 via-purple-600 to-indigo-600'
    };

    const updated = [newSong, ...customSongs];
    setCustomSongs(updated);
    try {
      localStorage.setItem('yona_custom_karaoke_songs', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    handleSelectSong(newSong);
    setShowCustomSongModal(false);
    setCustomSongTitle('');
    setCustomSongArtist('');
    setCustomSongLyrics('');
    setCustomSongYouTubeUrl('');
  };

  const handleDeleteCustomSong = (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customSongs.filter((s) => s.id !== songId);
    setCustomSongs(updated);
    try {
      localStorage.setItem('yona_custom_karaoke_songs', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (selectedSong.id === songId) {
      handleSelectSong(KARAOKE_SONGS_CATALOG[0]);
    }
  };

  // تشغيل / إيقاف اللحن المدمج بدقة متناهية
  const toggleBackingAudio = async () => {
    if (!bgAudioRef.current) return;
    if (isPlayingBacking) {
      bgAudioRef.current.pause();
      setIsPlayingBacking(false);
    } else {
      try {
        let url = effectiveBackingUrl;
        if (!url) {
          url = getOrCreateKaraokeWavUrl(selectedSong.id, selectedSong.title, selectedSong.lyrics);
          setEffectiveBackingUrl(url);
          bgAudioRef.current.src = url;
        }
        await bgAudioRef.current.play();
        setIsPlayingBacking(true);
      } catch (e) {
        console.warn('Direct audio play failed, generating fresh synthesized WAV:', e);
        const freshUrl = getOrCreateKaraokeWavUrl(selectedSong.id, selectedSong.title, selectedSong.lyrics);
        if (bgAudioRef.current && freshUrl) {
          bgAudioRef.current.src = freshUrl;
          try {
            await bgAudioRef.current.play();
            setIsPlayingBacking(true);
          } catch (err) {
            console.error('Final playback attempt failed:', err);
          }
        }
      }
    }
  };

  // حساب رابط التضمين المضمون والمباشر
  const getEmbedUrl = () => {
    // 1. إذا قام المستخدم بالبحث المخصص أو إدخال رابط
    if (activeYouTubeQuery) {
      if (activeYouTubeQuery.includes('youtube.com') || activeYouTubeQuery.includes('youtu.be')) {
        const match = activeYouTubeQuery.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
        if (match && match[1]) {
          return `https://www.youtube-nocookie.com/embed/${match[1]}?autoplay=0&rel=0&enablejsapi=1`;
        }
      }
      if (activeYouTubeQuery.length === 11 && !activeYouTubeQuery.includes(' ')) {
        return `https://www.youtube-nocookie.com/embed/${activeYouTubeQuery}?autoplay=0&rel=0&enablejsapi=1`;
      }
      return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(activeYouTubeQuery)}`;
    }

    // 2. إذا تم اختيار أغنية من الكتالوج (الافتراضي المؤكد والدقيق)
    if (selectedSong.youtubeId && selectedSong.youtubeId.length === 11) {
      return `https://www.youtube-nocookie.com/embed/${selectedSong.youtubeId}?autoplay=0&rel=0&enablejsapi=1`;
    }

    // 3. كخيار احتياطي للبحث
    const query = selectedSong.searchQuery || `${selectedSong.title} رشا رزق سبيستون`;
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${encodeURIComponent(query)}`;
  };

  // رابط الفتح أو البحث المباشر على يوتيوب
  const getDirectYouTubeSearchUrl = () => {
    if (activeYouTubeQuery) {
      if (activeYouTubeQuery.includes('youtube.com') || activeYouTubeQuery.includes('youtu.be')) {
        return activeYouTubeQuery;
      }
      return `https://www.youtube.com/results?search_query=${encodeURIComponent(activeYouTubeQuery)}`;
    }
    if (selectedSong.youtubeUrl) {
      return selectedSong.youtubeUrl;
    }
    if (selectedSong.youtubeId) {
      return `https://www.youtube.com/watch?v=${selectedSong.youtubeId}`;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedSong.searchQuery || selectedSong.title)}`;
  };

  // بدء التسجيل الصوتي النقي مع عزل التردد والصدى
  const startRecording = async () => {
    try {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
      setAnalysis(null);
      setSubmissionSuccess(false);
      setRecordingSeconds(0);
      setActiveLineIdx(0);

      // طلب الميكروفون مع عزل الصدى المتقدم وآليات الأمان التلقائية
      const constraints: MediaStreamConstraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      };

      let stream: MediaStream | null = null;
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch (_complexErr) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          } catch (_simpleErr) {
            // will try legacy
          }
        }
      }

      if (!stream) {
        const legacyGUM =
          (navigator as any).getUserMedia ||
          (navigator as any).webkitGetUserMedia ||
          (navigator as any).mozGetUserMedia;
        if (legacyGUM) {
          stream = await new Promise((resolve) => {
            legacyGUM.call(
              navigator,
              { audio: true },
              (s: MediaStream) => resolve(s),
              () => resolve(null)
            );
          });
        }
      }

      if (!stream) {
        throw new Error('تعذر الوصول إلى الميكروفون. يرجى التأكد من السماح بالمايك في المتصفح.');
      }

      streamRef.current = stream;
      audioChunksRef.current = [];
      recognizedTranscriptRef.current = '';

      // تفعيل التعرف على الكلمات المنطوقة والمغناة عبر محرك SpeechRecognition
      const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRec) {
        try {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'ar-SA';
          rec.onresult = (ev: any) => {
            let transcript = '';
            for (let i = 0; i < ev.results.length; i++) {
              transcript += ev.results[i][0].transcript + ' ';
            }
            recognizedTranscriptRef.current = transcript.trim();
          };
          rec.onerror = () => {};
          rec.start();
          speechRecognitionRef.current = rec;
        } catch (speechErr) {
          console.warn('Speech recognition not available or blocked:', speechErr);
        }
      }

      // بدء العداد الزمني والتمرير التلقائي للكلمات
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          const next = prev + 1;
          // تغيير السطر المظلل كل 6 ثوانٍ تقريباً ليتزامن مع الغناء
          if (next % 6 === 0) {
            setActiveLineIdx((cur) => (cur + 1) % selectedSong.lyrics.length);
          }
          return next;
        });
      }, 1000);

      // رسم النبضات الصوتية المباشرة على الـ Canvas
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const drawWave = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#EC4899');
          gradient.addColorStop(0.5, '#8B5CF6');
          gradient.addColorStop(1, '#F59E0B');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }

        animationFrameRef.current = requestAnimationFrame(drawWave);
      };
      drawWave();

      // تشغيل اللحن في الخلفية إذا كان المستخدم قد فعّله
      if (playerMode === 'builtInAudio' && bgAudioRef.current) {
        bgAudioRef.current.currentTime = 0;
        bgAudioRef.current.play().then(() => setIsPlayingBacking(true)).catch(() => {});
      }

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        evalTimeoutsRef.current.forEach(clearTimeout);
        evalTimeoutsRef.current = [];

        let audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        // Apply Spacetoon Radio / Vocal Filter if selected
        if (selectedVocalFilter && selectedVocalFilter !== 'none') {
          try {
            audioBlob = await spacetoonDubbingAudio.renderFilteredBlob(audioBlob, selectedVocalFilter);
          } catch (filterErr) {
            console.warn('Could not apply vocal filter:', filterErr);
          }
        }

        recordedBlobRef.current = audioBlob;
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // بدء مرحلة تحكيم وتقييم الأداء في أجواء المسابقة الحماسية
        setEvalStage('evaluating');
        setEvalProgress(20);
        setEvalStepText('فحص البصمة الصوتية ونقاء الميكروفون وعزل الصدى...');
        setIsAnalyzing(true);

        try {
          const result = await analyzeVoicePitch(audioBlob, selectedSong, recognizedTranscriptRef.current);
          setAnalysis(result);

          // خطوات محاكاة لجنة التحكيم التشويقية
          const t1 = setTimeout(() => {
            setEvalProgress(50);
            setEvalStepText(
              result.hasHumanVoice
                ? 'مطابقة التردد الصوتي والطبقة والكلمات مع ألحان الشارة...'
                : 'فحص التردد... لم يتم رصد صوت بشري مسموع في التسجيل'
            );
          }, 850);

          const t2 = setTimeout(() => {
            setEvalProgress(80);
            setEvalStepText(
              result.hasHumanVoice
                ? 'تدقيق مخارج الحروف وثبات النبرة ومقياس التناغم...'
                : 'تأكيد قياسات الطاقة وعزل الميكروفون...'
            );
          }, 1700);

          const t3 = setTimeout(() => {
            setEvalProgress(100);
            setEvalStepText(
              result.hasHumanVoice
                ? 'اكتمل تقييم لجنة التحكيم.. إعلان النتيجة ودخول سباق الأسبوع!'
                : 'اكتمل الفحص: التسجيل صامت أو خافت جداً'
            );
          }, 2500);

          const t4 = setTimeout(() => {
            setEvalStage('revealed');
            setIsAnalyzing(false);
          }, 3100);

          evalTimeoutsRef.current = [t1, t2, t3, t4];
        } catch (err) {
          console.error('Error analyzing pitch:', err);
          setIsAnalyzing(false);
          setEvalStage('revealed');
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      setRecorderError('يرجى السماح بالوصول إلى الميكروفون لتسجيل صوتك في استوديو يونا.');
      setTimeout(() => setRecorderError(null), 5000);
    }
  };

  // كشف النتيجة فوراً وتخطي مدة التشويق
  const skipEvaluation = () => {
    evalTimeoutsRef.current.forEach(clearTimeout);
    evalTimeoutsRef.current = [];
    setEvalProgress(100);
    setEvalStage('revealed');
    setIsAnalyzing(false);
  };

  // إيقاف التسجيل
  const stopRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      setIsPlayingBacking(false);
    }
    setIsRecording(false);
  };

  // إعادة التسجيل
  const resetRecording = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {}
    }
    recognizedTranscriptRef.current = '';
    evalTimeoutsRef.current.forEach(clearTimeout);
    evalTimeoutsRef.current = [];
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAnalysis(null);
    setEvalStage('idle');
    setEvalProgress(0);
    setEvalStepText('');
    setSubmissionSuccess(false);
    setShowCertificate(false);
    setRecordingSeconds(0);
    setUserDecision('none');
    audioChunksRef.current = [];
  };

  // حذف الإنجاز ومسح المشاركة بقرار المتسابق وحريته
  const handleDeleteMyRecording = () => {
    evalTimeoutsRef.current.forEach(clearTimeout);
    evalTimeoutsRef.current = [];

    if (submittedEntryId) {
      deleteContestEntry(submittedEntryId);
      setSubmittedEntryId(null);
    }

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    recordedBlobRef.current = null;
    audioChunksRef.current = [];
    setAnalysis(null);
    setEvalStage('idle');
    setEvalProgress(0);
    setEvalStepText('');
    setSubmissionSuccess(false);
    setShowCertificate(false);
    setRecordingSeconds(0);
    setUserDecision('deleted');

    setTimeout(() => {
      setUserDecision('none');
    }, 4500);
  };

  // نسخ الكلمات
  const handleCopyLyrics = () => {
    navigator.clipboard.writeText(selectedSong.lyrics.join('\n'));
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2500);
  };

  // تنسيق عداد الوقت
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // تقديم وتثبيت التسجيل في مسابقة الأسبوع
  const handleSubmitToContest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contestantName.trim() || !audioUrl || !analysis) return;

    let finalAudioUrl = audioUrl;
    if (recordedBlobRef.current) {
      try {
        finalAudioUrl = await blobToDataUrl(recordedBlobRef.current);
      } catch (err) {
        console.error('Error converting blob to permanent data URL:', err);
      }
    }

    const entryId = `entry-user-${Date.now()}`;
    const newEntry: ContestEntry = {
      id: entryId,
      singerName: contestantName.trim(),
      countryOrCity: contestantCity.trim() || 'صوت موهوب',
      songTitle: selectedSong.title,
      songId: selectedSong.id,
      audioUrl: finalAudioUrl,
      score: analysis.overallScore,
      voiceType: analysis.voiceType,
      pitchTier: analysis.pitchTier,
      votes: 1,
      hasVoted: true,
      date: 'الآن',
      comment: contestantComment.trim() || 'أداء رائع ومشارك في مسابقة يونا الأسبوعية!',
      isUserRecording: true
    };

    addContestEntry(newEntry);
    setSubmittedEntryId(entryId);
    setUserDecision('kept');
    setContestEntries(getContestEntries());
    setShowSubmitModal(false);
    setSubmissionSuccess(true);
  };

  // التصويت لمشارك في المسابقة
  const handleVoteForEntry = (entryId: string) => {
    setContestEntries((prev) =>
      prev.map((item) => {
        if (item.id === entryId) {
          const alreadyVoted = item.hasVoted;
          return {
            ...item,
            votes: alreadyVoted ? item.votes - 1 : item.votes + 1,
            hasVoted: !alreadyVoted
          };
        }
        return item;
      })
    );
  };

  // تطبيق البحث المخصص على يوتيوب
  const handleApplyCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customYouTubeQuery.trim()) {
      setActiveYouTubeQuery(customYouTubeQuery.trim());
      setPlayerMode('youtube');
    }
  };

  // ترتيب المتسابقين حسب النقاط الإجمالية والتصويت
  const sortedEntries = [...contestEntries].sort(
    (a, b) => b.votes * 0.4 + b.score * 0.6 - (a.votes * 0.4 + a.score * 0.6)
  );
  const currentLeader = sortedEntries[0] || INITIAL_CONTEST_ENTRIES[0];

  // --- VIRTUAL PIANO WORKSTATION UI COMPONENT ---
  const renderVirtualPianoWorkstation = (isFullTab: boolean = false) => {
    // 11 White keys & 7 Black keys
    const whiteKeys = BASE_PIANO_KEYS.filter((k) => !k.isBlack);
    const blackKeys = BASE_PIANO_KEYS.filter((k) => k.isBlack);

    // Get note information according to active scale and transposition
    const getKeyScaleInfo = (key: VirtualPianoKey) => {
      const effectiveMidi = key.midiNote + octaveShift * 12 + transposeSemitones;
      const noteSemitone = ((effectiveMidi % 12) + 12) % 12;
      const intervalFromRoot = (noteSemitone - effectiveRootIndex + 120) % 12;
      const scaleDegreeIndex = currentScaleDef.intervals.indexOf(intervalFromRoot);
      const isInScale = scaleDegreeIndex !== -1;
      const isRoot = scaleDegreeIndex === 0;
      const scaleDegree = scaleDegreeIndex + 1;
      const degreeLabel = isInScale
        ? isRoot
          ? 'درجة الأساس '
          : `درجة ${scaleDegree}`
        : 'خارج المقام';

      return {
        effectiveMidi,
        noteSemitone,
        isInScale,
        isRoot,
        scaleDegree,
        degreeLabel
      };
    };

    // Black keys positions relative to 11 white keys (each white key = 100% / 11)
    const blackKeyPositions: { [key: string]: string } = {
      Db4: '9.09%',
      Eb4: '18.18%',
      Fs4: '36.36%',
      Ab4: '45.45%',
      Bb4: '54.55%',
      Db5: '72.73%',
      Eb5: '81.82%'
    };

    return (
      <div
        className={`rounded-3xl bg-gradient-to-b from-[#0c1222] via-[#10172e] to-[#080d1a] border-2 border-purple-500/40 p-5 sm:p-7 shadow-2xl space-y-6 ${
          isFullTab ? 'max-w-6xl mx-auto' : ''
        }`}
      >
        {/* Top Header of Piano Section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-white/10 text-right">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
              <Piano className="w-3.5 h-3.5 text-amber-400" />
              <span>محرّك المقامات والبيانو التفاعلي (Key Signature & Scale Engine)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>بيانو المقامات والعزف الذكي </span>
            </h3>
            <p className="text-xs text-gray-300">
              اعزف باستخدام لوحة مفاتيح الكمبيوتر (PC Keyboard) أو باللمس مع إبراز درجات المقام المختار تلقائياً
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSyncWithSongKey}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black text-xs font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              title="مزامنة نغمة ومقام الأغنية الحالية تلقائياً"
            >
              <Zap className="w-3.5 h-3.5 fill-black" />
              <span>مزامنة مقام الشارة: {selectedSong.title} </span>
            </button>

            <button
              onClick={() => setShowKeyboardGuide((prev) => !prev)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showKeyboardGuide
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5 text-purple-400" />
              <span>دليل الكيبورد </span>
            </button>

            <button
              onClick={() => {
                setTransposeSemitones(0);
                setOctaveShift(0);
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
              title="إعادة ضبط التحويل والأوكتاف"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* CONTROLS BAR: Key Root, Scale/Maqam, Transpose, Timbre, Octave, Sustain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Key Signature Root Selector */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-right">
            <label className="block text-[11px] font-bold text-amber-300 flex items-center justify-between">
              <span>نغمة الأساس (Key Root):</span>
              <span className="font-mono text-white text-xs">{effectiveRootOption.name}</span>
            </label>
            <select
              value={pianoRootIndex}
              onChange={(e) => setPianoRootIndex(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-[#141b30] border border-purple-500/30 text-white text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {KEY_ROOTS.map((root) => (
                <option key={root.rootIndex} value={root.rootIndex}>
                  {root.arabicName}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Scale / Maqam Selector */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-right">
            <label className="block text-[11px] font-bold text-purple-300 flex items-center justify-between">
              <span>المقام الموسيقي (Scale):</span>
              <span className="text-[10px] text-pink-300 font-bold">{currentScaleDef.mood}</span>
            </label>
            <select
              value={pianoScaleId}
              onChange={(e) => setPianoScaleId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141b30] border border-purple-500/30 text-white text-xs font-bold focus:outline-none focus:border-purple-400 cursor-pointer"
            >
              {SCALE_DEFINITIONS.map((scale) => (
                <option key={scale.id} value={scale.id}>
                  {scale.arabicName}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Transpose Semitones Control */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-right">
            <label className="block text-[11px] font-bold text-emerald-300 flex items-center justify-between">
              <span>تحويل الطبقة (Transpose):</span>
              <span className="font-mono text-white text-xs font-black">
                {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones} نصف درجة
              </span>
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTransposeSemitones((prev) => Math.max(-12, prev - 1))}
                className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold cursor-pointer transition-colors"
                title="إنقاص نصف درجة [Shortcut: -]"
              >
                -1
              </button>
              <button
                onClick={() => setTransposeSemitones(0)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  transposeSemitones === 0
                    ? 'bg-purple-600/40 border-purple-400 text-white'
                    : 'bg-white/5 border-white/10 text-gray-300'
                }`}
                title="إعادة للصفر"
              >
                0
              </button>
              <button
                onClick={() => setTransposeSemitones((prev) => Math.min(12, prev + 1))}
                className="flex-1 py-1.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold cursor-pointer transition-colors"
                title="زيادة نصف درجة [Shortcut: +]"
              >
                +1
              </button>
            </div>
          </div>

          {/* 4. Timbre / Sound Selector */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 text-right">
            <label className="block text-[11px] font-bold text-cyan-300 flex items-center justify-between">
              <span>صوت الآلة (Timbre):</span>
              <span className="text-[10px] text-gray-400">ستوديو نقي</span>
            </label>
            <select
              value={pianoTimbre}
              onChange={(e) => setPianoTimbre(e.target.value as PianoTimbre)}
              className="w-full px-3 py-2 rounded-xl bg-[#141b30] border border-purple-500/30 text-white text-xs font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
            >
              <option value="grand-piano"> بيانو استوديو (Grand Piano)</option>
              <option value="strings"> وتريات أوركسترا (Strings)</option>
              <option value="oud-qanun"> عود وقانون شرقي (Oud / Qanun)</option>
              <option value="flute"> ناي وفلوت حالم (Flute)</option>
              <option value="synth-lead"> سينث أنمي إلكتروني (Synth Lead)</option>
              <option value="music-box"> صندوق موسيقى (Music Box)</option>
            </select>
          </div>
        </div>

        {/* SECONDARY BAR: Octave Shift + Sustain Pedal + Volume + Active Scale Notes Overview */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#090e1c] border border-white/10 text-xs">
          {/* Octave Shifter */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-bold">الأوكتاف (Octave):</span>
            <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setOctaveShift(-1)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  octaveShift === -1 ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="أوكتاف منخفض [Z]"
              >
                -1 [Z]
              </button>
              <button
                onClick={() => setOctaveShift(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  octaveShift === 0 ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="أوكتاف طبيعي"
              >
                0 عادي
              </button>
              <button
                onClick={() => setOctaveShift(1)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  octaveShift === 1 ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
                title="أوكتاف مرتفع [X]"
              >
                +1 [X]
              </button>
            </div>
          </div>

          {/* Sustain Pedal Toggle */}
          <button
            onClick={() => setSustainPedal((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              sustainPedal
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
            }`}
            title="دواسة استمرار الصوت [Spacebar]"
          >
            <Sparkles className={`w-3.5 h-3.5 ${sustainPedal ? 'text-emerald-400' : 'text-gray-400'}`} />
            <span>دواسة الصدى (Sustain) [Space]</span>
          </button>

          {/* Piano Volume Slider */}
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-purple-400" />
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={pianoVolume}
              onChange={(e) => setPianoVolume(parseFloat(e.target.value))}
              className="w-20 sm:w-28 accent-purple-500 cursor-pointer"
            />
            <span className="font-mono text-[11px] text-gray-300">{Math.round(pianoVolume * 100)}%</span>
          </div>

          {/* Last Played Note Real-time Status Banner */}
          {lastPlayedNoteInfo && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-950/60 border border-purple-500/40 text-[11px] text-purple-200 animate-in fade-in">
              <span className="font-bold text-amber-300">{lastPlayedNoteInfo.arabicName} ({lastPlayedNoteInfo.noteName})</span>
              <span className="text-gray-400 font-mono">• {lastPlayedNoteInfo.freq} Hz</span>
              <span
                className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                  lastPlayedNoteInfo.isRoot
                    ? 'bg-amber-500 text-black'
                    : 'bg-purple-500/40 text-purple-200'
                }`}
              >
                {lastPlayedNoteInfo.degreeLabel}
              </span>
            </div>
          )}
        </div>

        {/* SCALE OVERVIEW & IN-SCALE NOTES LIST */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-black/40 border border-purple-500/20 text-right space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <Sparkle className="w-4 h-4 text-amber-400" />
              <span>المقام النشط الحالي:</span>
              <span className="text-amber-300 font-black text-sm">
                {effectiveRootOption.arabicName} - {currentScaleDef.arabicName}
              </span>
              {transposeSemitones !== 0 && (
                <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                  معدل {transposeSemitones > 0 ? `+${transposeSemitones}` : transposeSemitones}
                </span>
              )}
            </div>

            <span className="text-[11px] text-gray-300 italic">{currentScaleDef.description}</span>
          </div>

          {/* In-Scale Note Badges */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-gray-400 font-bold ml-1">النغمات المتناسقة في المقام:</span>
            {currentScaleDef.intervals.map((interval, idx) => {
              const semitone = (effectiveRootIndex + interval) % 12;
              const rootOpt = KEY_ROOTS.find((r) => r.rootIndex === semitone) || KEY_ROOTS[0];
              const isTonic = idx === 0;

              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-lg text-[11px] font-bold flex items-center gap-1 border transition-all ${
                    isTonic
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm shadow-amber-500/20 font-black'
                      : 'bg-purple-500/15 border-purple-500/30 text-purple-200'
                  }`}
                >
                  {isTonic && <span></span>}
                  <span>{rootOpt.name}</span>
                  <span className="text-[9px] opacity-75 font-normal">({idx === 0 ? 'أساس' : `د${idx + 1}`})</span>
                </span>
              );
            })}
          </div>
        </div>

        {/* KEYBOARD MAPPING GUIDE (COLLAPSIBLE MODAL / PANEL) */}
        {showKeyboardGuide && (
          <div className="p-4 rounded-2xl bg-[#090e1c] border-2 border-purple-500/40 text-right space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                <Keyboard className="w-4 h-4 text-amber-400" />
                <span>دليل مفاتيح الكمبيوتر (PC Keyboard Mapping Guide):</span>
              </div>
              <button
                onClick={() => setShowKeyboardGuide(false)}
                className="text-gray-400 hover:text-white text-xs"
              >
                 إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-amber-400 font-bold block text-[11px]"> المفاتيح البيضاء:</span>
                <p className="text-gray-300 font-mono text-[11px] tracking-wider">
                  A, S, D, F, G, H, J, K, L, ;, '
                </p>
                <span className="text-[10px] text-gray-400 block">أو صف QWERTY العلوي</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-pink-400 font-bold block text-[11px]"> المفاتيح السوداء (الدييز/البيمول):</span>
                <p className="text-gray-300 font-mono text-[11px] tracking-wider">
                  W, E, T, Y, U, O, P
                </p>
                <span className="text-[10px] text-gray-400 block">أو الأرقام 2, 3, 5, 6, 7, 9, 0</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-cyan-400 font-bold block text-[11px]"> كوردات المقام التلقائية:</span>
                <p className="text-gray-300 font-mono text-[11px] tracking-wider">
                  الأرقام 1, 2, 3, 4, 5, 6, 7, 8
                </p>
                <span className="text-[10px] text-gray-400 block">تعزف كورد ثلاثي كامل لكل درجة</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-emerald-400 font-bold block text-[11px]"> التحكم بالطبقة والصدى:</span>
                <p className="text-gray-300 font-mono text-[11px]">
                  [Z] / [X]: أوكتاف | [-] / [+]: تحويل | [Space]: صدى
                </p>
                <span className="text-[10px] text-gray-400 block">تفاعل فوري بدون تأخير صوتي</span>
              </div>
            </div>
          </div>
        )}

        {/* INTERACTIVE PIANO KEYS CANVAS / STAGE */}
        <div className="relative w-full overflow-x-auto pb-4 select-none">
          <div className="relative min-w-[720px] max-w-5xl mx-auto h-52 sm:h-56 bg-slate-950 rounded-2xl p-2.5 shadow-2xl border-4 border-slate-800 flex justify-between">
            {/* 11 White Keys */}
            {whiteKeys.map((key) => {
              const { isInScale, isRoot, scaleDegree, degreeLabel } = getKeyScaleInfo(key);
              const isPressed =
                activePressedMidi === key.midiNote ||
                activePressedPcKey === key.displayKey.toLowerCase();

              return (
                <button
                  key={key.midiNote}
                  onClick={() =>
                    playPianoNote(
                      key.midiNote,
                      key.noteName,
                      key.arabicName,
                      degreeLabel,
                      isRoot,
                      key.displayKey
                    )
                  }
                  className={`relative flex-1 h-full mx-[2px] rounded-b-xl transition-all flex flex-col justify-end pb-3 items-center cursor-pointer border shadow-md active:translate-y-1 ${
                    isPressed
                      ? 'bg-gradient-to-t from-pink-500 via-purple-300 to-white border-pink-400 shadow-xl shadow-pink-500/50 translate-y-1.5'
                      : isRoot
                      ? 'bg-gradient-to-t from-amber-100 via-amber-50 to-white border-2 border-amber-400 shadow-amber-400/30'
                      : isInScale
                      ? 'bg-gradient-to-t from-purple-100 via-purple-50 to-white border-purple-400/80'
                      : 'bg-white hover:bg-slate-100 border-slate-300 opacity-70'
                  }`}
                  title={`${key.arabicName} (${key.noteName}) - درجة ${scaleDegree} - اضغط [${key.displayKey}]`}
                >
                  {/* Root / Degree indicator pill */}
                  {isInScale && (
                    <div className="absolute top-3 inset-x-1 flex justify-center">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-black leading-none ${
                          isRoot
                            ? 'bg-amber-500 text-black shadow-sm shadow-amber-500/50'
                            : 'bg-purple-600 text-white'
                        }`}
                      >
                        {isRoot ? ' أساس' : `د${scaleDegree}`}
                      </span>
                    </div>
                  )}

                  {/* Note Arabic Name */}
                  <span
                    className={`font-black text-xs leading-none ${
                      isRoot ? 'text-amber-950 font-black' : 'text-slate-900'
                    }`}
                  >
                    {key.arabicName}
                  </span>

                  {/* Note English & Keycap */}
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-[10px] text-slate-500 font-mono font-bold">
                      {key.noteName}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-black text-[10px] shadow-sm">
                      {key.displayKey}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* 7 Black Keys overlaid accurately */}
            {blackKeys.map((key) => {
              const { isInScale, isRoot, scaleDegree, degreeLabel } = getKeyScaleInfo(key);
              const isPressed =
                activePressedMidi === key.midiNote ||
                activePressedPcKey === key.displayKey.toLowerCase();
              const leftPos = blackKeyPositions[key.noteName] || '10%';

              return (
                <button
                  key={key.midiNote}
                  onClick={() =>
                    playPianoNote(
                      key.midiNote,
                      key.noteName,
                      key.arabicName,
                      degreeLabel,
                      isRoot,
                      key.displayKey
                    )
                  }
                  style={{
                    position: 'absolute',
                    left: leftPos,
                    transform: 'translateX(-50%)',
                    zIndex: 20
                  }}
                  className={`w-7 sm:w-10 h-32 sm:h-36 rounded-b-xl transition-all flex flex-col justify-end pb-2.5 items-center cursor-pointer shadow-2xl active:translate-y-1 ${
                    isPressed
                      ? 'bg-gradient-to-t from-pink-600 via-purple-600 to-slate-900 border-2 border-pink-400 shadow-pink-500/60 translate-y-1'
                      : isRoot
                      ? 'bg-gradient-to-t from-amber-600 via-slate-900 to-black border-2 border-amber-400 shadow-amber-500/30'
                      : isInScale
                      ? 'bg-gradient-to-t from-purple-700 via-slate-900 to-black border border-purple-400'
                      : 'bg-gradient-to-t from-slate-950 to-slate-900 border border-slate-700 opacity-80'
                  }`}
                  title={`${key.arabicName} (${key.noteName}) - درجة ${scaleDegree} - اضغط [${key.displayKey}]`}
                >
                  {/* Degree badge */}
                  {isInScale && (
                    <div className="absolute top-2 inset-x-0.5 flex justify-center">
                      <span
                        className={`px-1 py-0.5 rounded text-[8px] font-black leading-none ${
                          isRoot ? 'bg-amber-400 text-black' : 'bg-purple-500 text-white'
                        }`}
                      >
                        {isRoot ? '' : `د${scaleDegree}`}
                      </span>
                    </div>
                  )}

                  {/* Note Arabic Name */}
                  <span className="font-bold text-[10px] text-white leading-none">
                    {key.arabicName}
                  </span>

                  {/* Keycap Badge */}
                  <span className="mt-1 px-1.5 py-0.5 rounded bg-slate-800 border border-white/20 text-yellow-300 font-mono font-black text-[9px] shadow-sm">
                    {key.displayKey}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* CHORDS ACCOMPANIMENT BAR (PADS 1 TO 8) */}
        <div className="space-y-2 text-right">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>كوردات المقام المصاحبة (Chords Bar):</span>
            </h4>
            <span className="text-[10px] text-gray-400 font-mono">
              اضغط الأرقام [1] إلى [8] في لوحة المفاتيح
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((degreeIdx) => {
              const isTonic = degreeIdx === 0 || degreeIdx === 7;
              const chordNum = degreeIdx + 1;

              return (
                <button
                  key={degreeIdx}
                  onClick={() => playChordByIndex(degreeIdx)}
                  className={`p-3 rounded-2xl text-center transition-all border flex flex-col justify-between items-center gap-1 cursor-pointer active:scale-95 ${
                    isTonic
                      ? 'bg-gradient-to-b from-amber-500/25 to-yellow-600/10 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10 hover:border-amber-300'
                      : 'bg-white/5 hover:bg-purple-600/20 border-white/10 hover:border-purple-400 text-gray-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full text-[10px] font-mono text-gray-400">
                    <span>كورد {chordNum}</span>
                    <span className="px-1.5 py-0.2 rounded bg-white/10 text-amber-300 font-bold font-mono">
                      [{chordNum}]
                    </span>
                  </div>

                  <span className="text-xs font-black text-white">
                    {degreeIdx === 0
                      ? ` كورد ${effectiveRootOption.name}`
                      : `درجة ${degreeIdx + 1}`}
                  </span>

                  <span className="text-[9px] text-purple-300">
                    {degreeIdx === 0
                      ? 'أساس المقام'
                      : degreeIdx === 4
                      ? 'مهيمن (Dominant)'
                      : `تناغم ${chordNum}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Background Audio element for zero-latency instrumental backing track */}
      <audio
        ref={bgAudioRef}
        src={effectiveBackingUrl || selectedSong.backingAudioUrl}
        loop
        preload="auto"
        onTimeUpdate={(e) => {
          const current = (e.target as HTMLAudioElement).currentTime;
          if (selectedSong.lyrics.length > 0) {
            // Advance active line every 5.5s to match melodic phrasing
            const lineIdx = Math.min(
              selectedSong.lyrics.length - 1,
              Math.floor(current / 5.5) % selectedSong.lyrics.length
            );
            setActiveLineIdx(lineIdx);
          }
        }}
        onEnded={() => setIsPlayingBacking(false)}
      />

      {/* Main Studio Header with Tabs and Anime Artwork */}
      <div className="relative overflow-hidden rounded-3xl yona-glass border border-white/[0.08] p-5 sm:p-7 lg:p-8 shadow-2xl bg-gradient-to-b from-[#111728]/95 via-[#0e1422]/90 to-[#090d16]/95 backdrop-blur-xl">
        {/* Ambient Warm Studio Glows */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Info and Tab Switchers */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full gold-subtle-pill text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#E5C07B]">YONA Vocal Studio & Weekly Karaoke Contest</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-100 tracking-tight font-tajawal leading-tight">
              استوديو يونا للغناء والكاريوكي ومسابقة الأسبوع
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed font-medium">
              اختر شارتك المفضلة، غنِّ مع الكلمات واللحن التفاعلي، وسجّل صوتك بنقاء استوديو كامل بدون صدى وشارك في مسابقة الأصوات الذهبية لمعرفة الفائز أسبوعياً!
            </p>

            {/* Tab switchers: Studio Singing vs Virtual Piano vs Contest Leaderboard */}
            <div className="pt-2 flex items-center gap-2 bg-[#0a0d14]/85 p-2 rounded-2xl border border-white/[0.07] flex-wrap w-fit shadow-inner">
              <button
                onClick={() => setActiveTab('sing')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === 'sing'
                    ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>استوديو الكاريوكي</span>
              </button>

              <button
                onClick={() => setActiveTab('spacetoon_mic')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === 'spacetoon_mic'
                    ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>ميكروفون ودبلجة سبيستون</span>
              </button>

              <button
                onClick={() => setActiveTab('piano')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === 'piano'
                    ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent'
                }`}
              >
                <Piano className="w-3.5 h-3.5" />
                <span>بيانو المقامات والعزف</span>
              </button>

              <button
                onClick={() => setActiveTab('contest_board')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  activeTab === 'contest_board'
                    ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.05] border-transparent'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>لوحة المسابقة والفائزين</span>
              </button>
            </div>
          </div>

          {/* Anime Studio Musicians Artwork Card */}
          <div className="lg:col-span-5 xl:col-span-4 flex justify-center lg:justify-end">
            <div className="group relative w-full max-w-md rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-[#090d16] shadow-xl hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300">
              {/* Top Floating Badge */}
              <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-[#D4AF37]/40 backdrop-blur-md text-[11px] font-bold text-[#E5C07B] shadow-md">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>جلسة إبداع وغناء</span>
              </div>

              {/* Anime Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={animeStudioSingersImg}
                  alt="شاب وفتاة أنمي يغنيان ويعزفان بجانب البيانو والغيتار ولوحة الفائزين"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none image-overlay dark:opacity-100 opacity-20" />
              </div>

              {/* Bottom Caption Overlay */}
              <div className="p-3 bg-[#0a0e1a]/95 border-t border-white/[0.06] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200 font-bold">
                  <Trophy className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>طرب وغيتار وبيانو • لوحة الفائزين</span>
                </div>
                <button
                  onClick={() => setActiveTab('contest_board')}
                  className="text-[11px] font-bold text-purple-300 hover:text-purple-200 underline transition-colors cursor-pointer"
                >
                  استعرض الفائزين ←
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeTab === 'sing' && (
        <>
          {/* Song Selection Carousel / Catalog */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c1220] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-purple-400" />
                <span>اختر شارتك للغناء (كتالوج الكاريوكي الفوري):</span>
              </h3>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                {KARAOKE_SONGS_CATALOG.length} شارات كاملة ومضبوطة الكلمات
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
              {/* بطاقة اختيار شارة أو أغنية حرة من اختيار المتسابق (اختياري) */}
              <button
                type="button"
                onClick={handleOpenAddCustomSong}
                className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between gap-2 cursor-pointer border relative overflow-hidden group ${
                  selectedSong.isCustomSong
                    ? 'bg-gradient-to-b from-amber-500/25 via-purple-600/30 to-pink-600/30 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]'
                    : 'bg-gradient-to-b from-purple-950/40 via-black to-[#13122b] hover:from-purple-900/50 border-purple-500/40 hover:border-amber-400/80 text-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-black text-[9px] font-black flex items-center gap-1 shadow">
                      <Sparkles className="w-2.5 h-2.5 fill-black" />
                      <span>اختياري</span>
                    </span>
                    <Plus className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-90 transition-transform" />
                  </div>
                  <h4 className="text-xs font-black text-amber-300 group-hover:text-amber-200 mt-1">
                    أغنية من اختياري
                  </h4>
                  <span className="text-[10px] text-gray-300 block line-clamp-1">
                    حدد المغني، المقام، والنوع
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-amber-300/80 pt-1.5 border-t border-purple-500/30">
                  <span>شارة حرة</span>
                  <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[9px] text-amber-300 font-bold border border-amber-400/40">
                    تخصيص +
                  </span>
                </div>
              </button>

              {/* الشارات المخصصة التي أضافها المتسابق سابقاً */}
              {customSongs.map((song) => {
                const isSelected = selectedSong.id === song.id;
                return (
                  <div
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between gap-2 cursor-pointer border relative group ${
                      isSelected
                        ? 'bg-gradient-to-b from-purple-600/50 to-pink-600/50 border-pink-400 shadow-lg shadow-pink-500/25 scale-[1.02]'
                        : 'bg-purple-950/30 hover:bg-purple-950/50 border-purple-500/30 text-gray-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="block text-[10px] text-amber-300 font-bold truncate flex-1">
                          {song.animeOrCategory}
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => handleEditCustomSong(song, e)}
                            title="تعديل أو كتابة كلمات هذه الشارة"
                            className="p-1 rounded-md bg-white/10 hover:bg-amber-400/30 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCustomSong(song.id, e)}
                            title="حذف هذه الشارة المخصصة"
                            className="p-1 rounded-md bg-white/10 hover:bg-rose-500/30 text-gray-300 hover:text-rose-400 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-1 mt-1">
                        {song.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 block mt-0.5 truncate">
                        الأصل: {song.originalArtist}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-300 pt-2 border-t border-white/10 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => handleEditCustomSong(song, e)}
                        className="flex-1 py-1 px-2.5 rounded-xl bg-amber-400/25 hover:bg-amber-400/40 text-amber-200 hover:text-white text-[11px] font-bold border border-amber-400/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                        title="انقر لتعديل الكلمات أو إضافتها أو تغيير اسم الأغنية والمغني"
                      >
                        <Edit3 className="w-3 h-3 text-amber-300" />
                        <span>تعديل الكلمات والبيانات</span>
                      </button>
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/30 text-[10px] text-purple-200 font-bold shrink-0">
                        اختيارك
                      </span>
                    </div>
                  </div>
                );
              })}

              {KARAOKE_SONGS_CATALOG.map((song) => {
                const isSelected = selectedSong.id === song.id;
                return (
                  <button
                    key={song.id}
                    onClick={() => handleSelectSong(song)}
                    className={`p-3 rounded-2xl text-right transition-all flex flex-col justify-between gap-2 cursor-pointer border ${
                      isSelected
                        ? 'bg-gradient-to-b from-purple-600/40 to-pink-600/40 border-pink-400 shadow-lg shadow-pink-500/20 scale-[1.02]'
                        : 'bg-white/5 hover:bg-white/10 border-white/5 text-gray-300'
                    }`}
                  >
                    <div>
                      <span className="block text-[10px] text-purple-300 font-bold truncate">
                        {song.animeOrCategory}
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                        {song.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 block mt-0.5">
                        الأصل: {song.originalArtist}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 border-t border-white/5">
                      <span>{song.duration}</span>
                      <span className="px-1.5 py-0.5 rounded bg-black/40 text-[9px] text-amber-300 font-medium">
                        {song.difficulty}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN TWO-COLUMN STUDIO LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Column 1 (7 Cols): Video / Backing Player & Mic Recording Console */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Media Player Container with YouTube & Direct Audio Fallback */}
              <div className="rounded-2xl overflow-hidden bg-black border border-purple-500/30 shadow-xl">
                
                {/* Player Top Navigation Bar & Custom Search */}
                <div className="p-3 bg-[#111625] border-b border-white/10 space-y-2.5">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="font-bold text-white line-clamp-1">{selectedSong.title}</span>
                      <span className="text-gray-400 text-[11px] hidden sm:inline">
                        ({selectedSong.originalArtist})
                      </span>
                    </div>

                    {/* Mode buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPlayerMode('youtube')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          playerMode === 'youtube'
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Tv className="w-3 h-3" />
                        <span>فيديو يوتيوب</span>
                      </button>

                      <button
                        onClick={() => setPlayerMode('builtInAudio')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          playerMode === 'builtInAudio'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-white/5 text-gray-400 hover:text-white'
                        }`}
                      >
                        <Music className="w-3 h-3" />
                        <span>لحن مدمج (سريع)</span>
                      </button>

                      <a
                        href={getDirectYouTubeSearchUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer border border-red-500/30"
                        title="فتح الأغنية مباشرة في موقع يوتيوب"
                      >
                        <span>يوتيوب الأصلي</span>
                        <ExternalLink className="w-3 h-3 text-red-400" />
                      </a>

                      {selectedSong.instagramUrl && (
                        <a
                          href={selectedSong.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer shadow-sm border border-pink-500/30"
                          title="فتح عزف لحن ريمي على إنستغرام ريلز"
                        >
                          <span>عزف إنستغرام </span>
                          <ExternalLink className="w-3 h-3 text-pink-200" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* YouTube Search Bar: Allows User to pick any custom song, karaoke, or piano version */}
                  <form onSubmit={handleApplyCustomSearch} className="flex items-center gap-2 pt-1">
                    <div className="relative flex-1">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={customYouTubeQuery}
                        onChange={(e) => setCustomYouTubeQuery(e.target.value)}
                        placeholder={`ابحث عن نسخة محددة (مثال: كاريوكي ${selectedSong.title} أو الصق رابط)...`}
                        className="w-full pl-3 pr-9 py-1.5 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex-shrink-0 cursor-pointer transition-colors"
                    >
                      تغيير الفيديو
                    </button>
                    {activeYouTubeQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveYouTubeQuery('');
                          setCustomYouTubeQuery('');
                        }}
                        className="px-2 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs cursor-pointer"
                        title="إعادة ضبط الفيديو للشارة الأصلية"
                      >
                        إلغاء
                      </button>
                    )}
                  </form>
                </div>

                {/* Embedded YouTube Frame or Built-in Backing Audio Visualizer */}
                {playerMode === 'youtube' ? (
                  <div className="relative aspect-video w-full bg-black">
                    <iframe
                      key={`${selectedSong.id}-${selectedSong.youtubeId || ''}-${activeYouTubeQuery}`}
                      src={getEmbedUrl()}
                      title={selectedSong.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="no-referrer-when-downgrade"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                    
                    {/* Bottom Quick Help Bar */}
                    <div className="p-2.5 bg-[#0d1322] border-t border-white/10 flex items-center justify-between text-[11px] text-gray-300 flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 text-amber-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>اضغط زر التشغيل بالفيديو أعلاه للغناء مع الشارة</span>
                      </span>

                      <a
                        href={getDirectYouTubeSearchUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 cursor-pointer bg-red-950/40 px-2 py-0.5 rounded border border-red-500/20"
                      >
                        <span>إذا واجهتك قيود يوتيوب: اضغط هنا للفتح المباشر </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video w-full bg-gradient-to-br from-[#0e1628] to-[#1a0f2e] flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-pulse">
                      <Music2 className="w-8 h-8 text-purple-300" />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{selectedSong.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">
                        اللحن الموسيقي الموزون بدون غناء للتدرب والتسجيل المباشر
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleBackingAudio}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer transition-all"
                      >
                        {isPlayingBacking ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4 fill-white" />
                        )}
                        <span>{isPlayingBacking ? 'إيقاف اللحن' : 'تشغيل اللحن الموسيقي'}</span>
                      </button>

                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                        title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        ) : (
                          <Volume2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Clean Mic Recording Console */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#111827] to-[#0d121f] border border-purple-500/30 shadow-xl space-y-5 text-center">
                
                {/* Spacetoon Dubbing Mic Quick Toggle Button */}
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_#ef4444]" />
                    <span className="text-xs font-bold text-amber-300">ميكروفون دبلجة سبيستون وفلاتر الراديو والمعلق</span>
                  </div>
                  <button
                    onClick={() => setShowSpacetoonMicDrawer((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      showSpacetoonMicDrawer
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showSpacetoonMicDrawer ? 'إخفاء ميكروفون سبيستون ▲' : 'فتح ميكروفون وفلاتر دبلجة سبيستون (ON AIR) ▼'}</span>
                  </button>
                </div>

                {/* Inline Spacetoon Microphone Dubbing Console */}
                {showSpacetoonMicDrawer && (
                  <div className="my-4 text-right animate-in fade-in duration-300">
                    <SpacetoonMicrophone
                      standalone={false}
                      onClose={() => setShowSpacetoonMicDrawer(false)}
                      onApplyAudioToRecorder={(blob) => {
                        recordedBlobRef.current = blob;
                        const url = URL.createObjectURL(blob);
                        setAudioUrl(url);
                        setShowSpacetoonMicDrawer(false);
                        setIsAnalyzing(true);
                        analyzeVoicePitch(blob, selectedSong)
                          .then((res) => setAnalysis(res))
                          .catch((e) => console.error(e))
                          .finally(() => setIsAnalyzing(false));
                      }}
                    />
                  </div>
                )}

                {/* Glowing Studio ON-AIR Visual Animation Effect & Vocal Filter Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10">
                  {/* ON AIR Lightbox Sign */}
                  <div className={`px-4 py-2 rounded-xl border-2 font-mono font-black text-xs flex items-center gap-2.5 transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-950/95 border-red-500 text-white shadow-[0_0_35px_#ef4444,inset_0_0_15px_#dc2626] animate-pulse scale-105'
                      : 'bg-zinc-900/80 border-zinc-700/60 text-zinc-400 shadow-inner'
                  }`}>
                    <span className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      isRecording ? 'bg-red-500 shadow-[0_0_12px_#ef4444] animate-ping' : 'bg-zinc-600'
                    }`} />
                    <span className="text-xs sm:text-sm font-black tracking-widest text-red-100">
                      {isRecording ? '● ON AIR • استوديو سبيستون على الهواء' : '○ STANDBY • جاهز للتسجيل'}
                    </span>
                  </div>

                  {/* Vocal Filter Quick Selector */}
                  <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
                    <span className="text-amber-300 text-[11px] font-bold ml-1 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-amber-400" />
                      <span>فلتر الصوت:</span>
                    </span>
                    {SPACETOON_VOCAL_FILTERS.map((f) => {
                      const isSel = selectedVocalFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setSelectedVocalFilter(f.id)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                            isSel
                              ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-105'
                              : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                          }`}
                          title={f.tagline}
                        >
                          <span>{f.icon}</span>
                          <span>{f.arabicName.split(' ')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Audio Waveform Canvas */}
                <div className="h-16 w-full rounded-xl bg-black/60 border border-white/5 overflow-hidden flex items-center justify-center relative shadow-inner">
                  {isRecording ? (
                    <canvas ref={canvasRef} width={400} height={64} className="w-full h-full" />
                  ) : (
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-pink-400 animate-pulse" />
                      <span>مؤشر التردد والنبضات الصوتية (سيعمل فور الضغط على الميكروفون)</span>
                    </div>
                  )}

                  {/* Timer Overlay */}
                  {isRecording && (
                    <div className="absolute top-2 right-3 px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse shadow-md">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      <span>{formatTime(recordingSeconds)}</span>
                    </div>
                  )}
                </div>

                {/* Big Recording Button */}
                <div className="flex flex-col items-center justify-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="group p-6 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-2xl shadow-rose-600/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      title="بدء الغناء والتسجيل"
                    >
                      <Mic className="w-10 h-10 group-hover:animate-bounce" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="p-6 rounded-full bg-slate-700 hover:bg-slate-600 text-white shadow-2xl shadow-slate-900/60 animate-pulse hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
                      title="إيقاف التسجيل والاستماع"
                    >
                      <Square className="w-10 h-10" />
                    </button>
                  )}

                  <div>
                    <h4 className="text-base font-bold text-white">
                      {isRecording
                        ? 'جاري تسجيل صوتك النقي فوق الشارة...'
                        : 'اضغط على الميكروفون للبدء في الغناء والتسجيل'}
                    </h4>
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>تقنية عزل الصدى المزدوج لمنع تردد الصوت أثناء تشغيل الأغنية</span>
                    </p>
                  </div>

                  {recorderError && (
                    <div className="w-full max-w-md mx-auto p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold text-center animate-in fade-in">
                      {recorderError}
                    </div>
                  )}
                </div>

                {/* Feedback when user deletes their achievement */}
                {userDecision === 'deleted' && (
                  <div className="w-full max-w-xl mx-auto p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-right space-y-2 animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>تم مسح التسجيل وحذف النتيجة بنجاح</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      لديك كامل الحرية في المحاولة مجدداً في أي وقت. اضغط على الميكروفون بالأعلى لبدء تسجيل جديد.
                    </p>
                  </div>
                )}

                {/* Post-Recording Result & AI Voice Classifier & Contest Atmosphere */}
                {audioUrl && !isRecording && (
                  <div className="p-4 sm:p-6 rounded-2xl bg-[#090e1a] border border-purple-500/40 text-right space-y-5 animate-in fade-in duration-300 shadow-2xl">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تم التسجيل بنجاح! استمع لأدائك الصوتي:</span>
                      </span>
                      <span className="text-gray-400 font-mono text-[11px]">{formatTime(recordingSeconds)}</span>
                    </div>

                    <audio src={audioUrl} controls className="w-full rounded-lg" />

                    {/* PHASE 1: Dramatic Contest Judging Sequence */}
                    {evalStage === 'evaluating' && (
                      <div className="p-5 rounded-2xl bg-gradient-to-b from-[#16122c] to-[#0c0d1c] border-2 border-amber-500/40 space-y-4 text-right animate-in zoom-in-95">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                            <span>غرفة تحكيم المسابقة الصوتية (Judging Stage)</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-amber-400">
                            {evalProgress}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 transition-all duration-300 ease-out"
                            style={{ width: `${evalProgress}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-200 font-medium animate-pulse">
                            {evalStepText || 'جارٍ تقييم الأداء بالذكاء الاصطناعي ولجنة التحكيم...'}
                          </span>
                          <button
                            type="button"
                            onClick={skipEvaluation}
                            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-[11px] cursor-pointer"
                          >
                            كشف النتيجة الآن
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[11px] text-gray-300">
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>عزل الصدى ونقاء التسجيل</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>مطابقة الطبقة والمقام للشارة</span>
                          </div>
                          <div className="p-2 rounded-xl bg-black/40 border border-white/5 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                            <span>مخارج الحروف والتناغم الصوتي</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PHASE 2: Revealed Score & Competition Atmosphere */}
                    {evalStage === 'revealed' && analysis && (
                      <div className="space-y-4">
                        {/* Score & Pitch Breakdown Card */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#12182b] to-[#181133] border border-amber-500/40 space-y-3 text-xs">
                          <div className="flex items-center justify-between pb-2 border-b border-white/10">
                            <div className="flex items-center gap-1.5 font-bold text-amber-300">
                              <Trophy className="w-4 h-4 text-amber-400" />
                              <span>تقييم الأداء الصوتي الرسمي (YONA Voice Engine):</span>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm font-black font-mono">
                              النتيجة: {analysis.overallScore} من 100
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-right">
                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-[10px] text-gray-400 block">نوع وطبقة الصوت:</span>
                              <div className="font-bold text-white text-xs mt-0.5">
                                {analysis.voiceType}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5">
                              <span className="text-[10px] text-gray-400 block">التردد الأساسي (Pitch):</span>
                              <span className="font-mono font-bold text-amber-300 text-xs mt-0.5 block">
                                {analysis.avgFrequencyHz} Hz
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 col-span-2 sm:col-span-1">
                              <span className="text-[10px] text-gray-400 block">التصنيف الغنائي:</span>
                              <span className="font-bold text-purple-300 text-xs mt-0.5 block truncate">
                                {analysis.pitchTier.split(' - ')[0]}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                            <span className="text-gray-300">{analysis.pitchTier}</span>
                            <span className="text-emerald-300 font-bold">{analysis.tonalMatch}</span>
                          </div>
                        </div>

                        {/* Weekly Contest Atmosphere Box (جو المسابقة وتتويج أبطال الأسبوع) */}
                        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171c2d] via-[#1f162e] to-[#251522] border-2 border-amber-400/50 shadow-xl space-y-3 text-right">
                          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/10">
                            <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
                              <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                              <span>أجواء منافسة الأسبوع وتتويج الأبطال الثلاثة</span>
                            </div>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-xs font-mono">
                              ينتهي موسم الأسبوع الحالي خلال: 3 أيام و14 ساعة
                            </span>
                          </div>

                          <p className="text-xs text-slate-200 leading-relaxed font-medium">
                            أهلاً بك في حلبة المنافسة! لقد حققت نتيجة <strong>({analysis.overallScore} من 100)</strong> في شارة «{selectedSong.title}».
                            خلال هذا الأسبوع سنتابع باقي المتسابقين والأصوات المشاركة، وفي نهاية الأسبوع سيتم فرز الأصوات وتتويج المتسابقين الثلاثة الحائزين على أعلى النقاط كـ <strong>أبطال الأسبوع</strong> وتقليدهم أوسمة الشرف في لوحة المتصدرين!
                          </p>

                          {/* Contestant Freedom of Choice Box: KEEP or DELETE */}
                          <div className="p-3 rounded-xl bg-black/50 border border-white/10 space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-gray-200">
                                حرية الاختيار للمتسابق (إبقاء الإنجاز أو حذفه):
                              </span>
                              {userDecision === 'kept' && (
                                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>تم تثبيت مشاركتك في المسابقة بنجاح</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2.5 flex-wrap">
                              {userDecision !== 'kept' ? (
                                <>
                                  <button
                                    onClick={() => setShowSubmitModal(true)}
                                    className="flex-1 min-w-[200px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer transition-all hover:scale-[1.02]"
                                  >
                                    <Trophy className="w-4 h-4 fill-black" />
                                    <span>تثبيت وإبقاء نتيجتي في منافسة الأسبوع</span>
                                  </button>

                                  <button
                                    onClick={handleDeleteMyRecording}
                                    className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    title="حذف هذا التسجيل والدرجة ومسح المشاركة"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-300" />
                                    <span>حذف إنجازي ومسح المشاركة</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => setActiveTab('contest_board')}
                                    className="flex-1 min-w-[180px] py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                                  >
                                    <Trophy className="w-4 h-4" />
                                    <span>الانتقال للوحة المتصدرين ومتابعة ترتيبك</span>
                                  </button>

                                  <button
                                    onClick={handleDeleteMyRecording}
                                    className="py-2.5 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 border border-rose-500/40 text-rose-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                                    title="حذف مشاركتك من لوحة المسابقة"
                                  >
                                    <Trash2 className="w-4 h-4 text-rose-300" />
                                    <span>حذف مشاركتي من لوحة المسابقة</span>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions: Download, Certificate, Story, Re-record */}
                    {evalStage === 'revealed' && (
                      <div className="flex items-center justify-between gap-2.5 flex-wrap pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={audioUrl}
                            download={`yona_${selectedSong.id}_recording.webm`}
                            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>تنزيل التسجيل</span>
                          </a>

                          <button
                            onClick={() => setShowCertificate(!showCertificate)}
                            className="px-3 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Award className="w-3.5 h-3.5 text-purple-400" />
                            <span>{showCertificate ? 'إخفاء الشهادة' : 'شهادة الأداء الرسمية'}</span>
                          </button>

                          <button
                            onClick={() => setShowStoryModal(true)}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md shadow-pink-600/20 transition-all hover:scale-105"
                            title="توليد بطاقة ستوري وتيك توك سينمائية"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-pink-200" />
                            <span>بطاقة ستوري وتيك توك</span>
                          </button>
                        </div>

                        <button
                          onClick={resetRecording}
                          className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>تسجيل جديد</span>
                        </button>
                      </div>
                    )}

                    {/* Official Digital Certificate of Performance */}
                    {showCertificate && analysis && (
                      <OfficialCertificateModal
                        isOpen={showCertificate}
                        onClose={() => setShowCertificate(false)}
                        data={{
                          singerName: contestantName.trim() || 'صوت موهوب',
                          countryOrCity: contestantCity.trim() || 'العالم العربي',
                          songTitle: selectedSong.title,
                          score: analysis.overallScore,
                          pitchTier: analysis.pitchTier,
                          exactTimestamp: Date.now(),
                          badge: analysis.overallScore >= 95 ? 'وسام التفوق الذهبي' : 'وسام الإبداع الصوتي',
                          juryNotes: `أداء متميز في شارة "${selectedSong.title}" مع دقة في مخارج الحروف وثبات متميز في التردد الصوتي.`
                        }}
                      />
                    )}

                    {/* Social Story Card Modal for Instagram / TikTok */}
                    {showStoryModal && analysis && (
                      <SocialStoryCardModal
                        isOpen={showStoryModal}
                        onClose={() => setShowStoryModal(false)}
                        data={{
                          singerName: contestantName.trim() || 'صوت موهوب في الاستوديو',
                          songTitle: selectedSong.title,
                          animeOrCategory: selectedSong.animeOrCategory,
                          score: analysis.overallScore,
                          pitchTier: analysis.pitchTier,
                          rankTitle: analysis.overallScore >= 95 ? 'وسام التفوق الذهبي' : 'موهبة صوتية واعدة',
                          audioUrl: audioUrl || undefined,
                          animeImageUrl: selectedSong.youtubeId ? `https://img.youtube.com/vi/${selectedSong.youtubeId}/hqdefault.jpg` : undefined
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Column 2 (5 Cols): Prominent Full Interactive Synced Lyrics Teleprompter */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#0e1424] border-2 border-purple-500/40 shadow-2xl space-y-4 text-right">
                
                {/* Header of Lyrics Box */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Music className="w-5 h-5 text-amber-400" />
                      <span>كلمات الشارة المختارة (Lyrics):</span>
                    </h4>
                    <span className="text-xs text-purple-300 font-medium">اقرأ وغنِّ متزامناً مع اللحن</span>
                  </div>

                  {/* Font Size controls & Copy */}
                  <div className="flex items-center gap-1.5">
                    {selectedSong.isCustomSong && (
                      <button
                        type="button"
                        onClick={() => handleEditCustomSong(selectedSong)}
                        className="px-2.5 py-1 rounded-xl bg-amber-400/20 hover:bg-amber-400/35 text-amber-200 hover:text-amber-100 border border-amber-400/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer mr-1 shadow-sm"
                        title="تعديل أو كتابة كلمات هذه الشارة"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-300" />
                        <span>تعديل كلمات الشارة</span>
                      </button>
                    )}

                    <div className="flex items-center bg-black/50 rounded-lg p-0.5 border border-white/10">
                      <button
                        onClick={() => setLyricsFontSize('sm')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lyricsFontSize === 'sm' ? 'bg-purple-600 text-white' : 'text-gray-400'
                        }`}
                      >
                        A-
                      </button>
                      <button
                        onClick={() => setLyricsFontSize('md')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lyricsFontSize === 'md' ? 'bg-purple-600 text-white' : 'text-gray-400'
                        }`}
                      >
                        A
                      </button>
                      <button
                        onClick={() => setLyricsFontSize('lg')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lyricsFontSize === 'lg' ? 'bg-purple-600 text-white' : 'text-gray-400'
                        }`}
                      >
                        A+
                      </button>
                    </div>

                    <button
                      onClick={handleCopyLyrics}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
                      title="نسخ كلمات الأغنية"
                    >
                      {copiedLyrics ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Song Meta Badges & Collapsible Advanced Tools Trigger */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold">
                      {selectedSong.animeOrCategory}
                    </span>
                    {selectedSong.bpm && (
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-bold">
                        سرعة الإيقاع: {Math.round(selectedSong.bpm * tempoMultiplier)} BPM
                        {tempoMultiplier !== 1.0 && ` (${tempoMultiplier}x)`}
                      </span>
                    )}
                    {selectedSong.key && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
                        المقام: {selectedSong.key}
                      </span>
                    )}
                  </div>

                  {/* Collapsible Toolbar Trigger */}
                  <button
                    onClick={() => setIsAdvancedToolsOpen((prev) => !prev)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      isAdvancedToolsOpen
                        ? 'bg-gradient-to-r from-amber-500/20 to-purple-500/20 border-[#D4AF37] text-amber-300 shadow-[#D4AF37]/10'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
                    }`}
                    title="فتح أو طي شريط أدوات الضبط المتقدمة"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>أدوات الضبط (BPM والمقامات والبيانو)</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isAdvancedToolsOpen ? 'rotate-180 text-[#D4AF37]' : 'text-slate-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Custom Song Notice & Quick Edit Lyrics Banner */}
                {selectedSong.isCustomSong && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-amber-950/70 border border-amber-400/40 text-xs space-y-2 animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>شارة من اختيارك: «{selectedSong.title}»</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEditCustomSong(selectedSong)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-400/20 transition-all hover:scale-105 shrink-0 self-start sm:self-auto"
                      >
                        <Edit3 className="w-3.5 h-3.5 fill-black" />
                        <span>إضافة أو تعديل كلمات الشارة</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      إذا لم تكتب الكلمات سابقاً أو ترغب في تعديلها، اضغط على زر <strong>(إضافة أو تعديل كلمات الشارة)</strong> لكتابة الكلمات لتظهر متزامنة أمامك في الشاشة أثناء الغناء ويتعرف عليها الذكاء الاصطناعي بدقة!
                    </p>
                  </div>
                )}

                {/* Empty Lyrics Prompt for Custom Song */}
                {selectedSong.isCustomSong &&
                  (selectedSong.lyrics.length === 0 ||
                    selectedSong.lyrics.some((l) => l.includes('استوديو يونا للمسابقات') || l.includes('غناء حر'))) && (
                    <div
                      onClick={() => handleEditCustomSong(selectedSong)}
                      className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-purple-950/40 to-slate-900 border-2 border-dashed border-amber-400/60 hover:border-amber-400 text-center space-y-3 cursor-pointer transition-all hover:scale-[1.01] my-2 group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-300 group-hover:scale-110 transition-transform">
                        <Edit3 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm sm:text-base">
                          كتبت المغني والأغنية دون كلمات؟ انقر هنا لإضافة الكلمات! ✍️
                        </h4>
                        <p className="text-xs text-amber-200/90 mt-1 max-w-md mx-auto leading-relaxed">
                          انقر هنا لكتابة أو لصق كلمات الشارة بيتاً بيتاً الآن، لتظهر أمامك في هذه الشاشة متزامنة وتغني معها، ويتعرف الذكاء الاصطناعي على نطقك ونقاء صوتك!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCustomSong(selectedSong);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black font-black text-xs inline-flex items-center gap-2 shadow-lg shadow-amber-400/30 transition-all hover:scale-105 cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4 fill-black" />
                        <span>فتح خانة كتابة وتعديل الكلمات الآن</span>
                      </button>
                    </div>
                  )}

                {/* Interactive Lyrics Teleprompter Area */}
                <div
                  ref={lyricsContainerRef}
                  className="max-h-[480px] overflow-y-auto space-y-2.5 pr-1 pl-2 text-right scroll-smooth"
                >
                  {selectedSong.lyrics.map((line, idx) => {
                    const isCurrentActive = idx === activeLineIdx;
                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveLineIdx(idx)}
                        className={`p-3.5 rounded-xl transition-all border cursor-pointer ${
                          isCurrentActive
                            ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-400 shadow-md shadow-purple-500/20 scale-[1.02]'
                            : 'bg-white/[0.03] border-white/5 hover:border-purple-500/30 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`font-tajawal leading-relaxed ${
                              isCurrentActive ? 'text-white font-extrabold' : 'text-gray-200'
                            } ${
                              lyricsFontSize === 'sm'
                                ? 'text-xs'
                                : lyricsFontSize === 'lg'
                                ? 'text-base font-bold'
                                : 'text-sm font-medium'
                            }`}
                          >
                            {line}
                          </p>

                          {isCurrentActive && (
                            <span className="px-2 py-0.5 rounded-md bg-pink-500 text-white text-[10px] font-bold animate-pulse flex-shrink-0 flex items-center gap-1">
                              <Radio className="w-2.5 h-2.5" />
                              <span>الآن</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Studio Pro Tips */}
                <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs text-purple-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <Headphones className="w-4 h-4" />
                    <span>نصيحة يونا للغناء باحترافية:</span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    ضع سماعات الأذن (Headphones) حتى تسمع اللحن بوضوح دون أن يلتقطه الميكروفون، وسيقوم النظام بعزل الصدى تلقائياً لضمان أعلى درجة نقاء وتقييم في المسابقة!
                  </p>
                </div>

              </div>
            </div>

            {/* COLLAPSIBLE TOOLBAR DRAWER: BPM, Scales, & Virtual Piano (Progressive Disclosure) */}
            {isAdvancedToolsOpen && (
              <div className="rounded-3xl bg-gradient-to-b from-[#0c1222] via-[#10172e] to-[#080d1a] border-2 border-[#D4AF37]/50 p-5 sm:p-7 shadow-2xl space-y-6 animate-in slide-in-from-top-4 duration-300 text-right">
                
                {/* Drawer Header with Close Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-white font-tajawal flex items-center gap-2">
                        <span>شريط أدوات الضبط الموسيقي المتقدم (Collapsible Toolbar)</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-mono">BPM & Scales & Piano</span>
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        تحكم في سرعة الإيقاع وتدريب الأداء، وتعديل المقامات، ومزامنة البيانو الافتراضي
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsAdvancedToolsOpen(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-end sm:self-auto"
                  >
                    <span>إخفاء شريط الأدوات</span>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick BPM / Tempo Speed Control Bar */}
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-300 font-bold block">سرعة الإيقاع وتدريب الأداء (Tempo & BPM):</span>
                      <span className="text-xs text-indigo-300 font-mono">
                        {Math.round((selectedSong.bpm || 118) * tempoMultiplier)} BPM (السرعة الحالية: {tempoMultiplier}x)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {[0.8, 0.9, 1.0, 1.1, 1.25].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setTempoMultiplier(speed)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer ${
                          tempoMultiplier === speed
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                            : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                        }`}
                      >
                        {speed === 1.0 ? '1.0x (الأصلي)' : `${speed}x`}
                      </button>
                    ))}
                    {tempoMultiplier !== 1.0 && (
                      <button
                        onClick={() => setTempoMultiplier(1.0)}
                        className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10 text-xs transition-colors cursor-pointer"
                        title="إعادة ضبط السرعة للأصلية"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Embedded Piano Workstation inside Collapsible Drawer */}
                {renderVirtualPianoWorkstation(false)}
              </div>
            )}
          </div>
        </>
      )}

      {/* TAB 2: Dedicated Spacetoon Microphone & Radio Dubbing Console */}
      {activeTab === 'spacetoon_mic' && (
        <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
          <SpacetoonMicrophone
            standalone={true}
            onApplyAudioToRecorder={(blob) => {
              recordedBlobRef.current = blob;
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);
              setActiveTab('sing');
              setIsAnalyzing(true);
              analyzeVoicePitch(blob, selectedSong)
                .then((res) => setAnalysis(res))
                .catch((e) => console.error(e))
                .finally(() => setIsAnalyzing(false));
            }}
          />
        </div>
      )}

      {/* TAB 3: Dedicated Virtual Piano Workstation */}
      {activeTab === 'piano' && renderVirtualPianoWorkstation(true)}

      {/* TAB 4: Weekly Contest Leaderboard */}
      {activeTab === 'contest_board' && (
        <ContestBoard onNavigateToStudio={() => setActiveTab('sing')} />
      )}

      {/* MODAL: Submit Recording to Contest */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#12192b] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl text-right space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400">
                <Trophy className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">تقديم أدائك لمسابقة الأسبوع </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              سيتم نشر تسجيلك الصوتي في لوحة المتنافسين ليتمكن الجمهور والذكاء الاصطناعي من تقييمك والتصويت لك للفوز بجائزة الأسبوع!
            </p>

            {/* Clear Privacy & Name Guidance Box for Contestant */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 via-[#0e1828] to-purple-950/80 border border-emerald-500/50 text-emerald-200 text-xs space-y-2.5 text-right shadow-xl">
              <div className="flex items-center gap-2 font-black text-emerald-300 text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span> تنبيه مهم للمتسابق قبل تعبئة البيانات:</span>
              </div>

              <div className="space-y-2 text-xs text-gray-200 leading-relaxed pr-1">
                <p className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-100">
                   <strong>هذه الشهادة محمية ولا يمكن عرضها للعامة:</strong> شهادتك الرسمية والـ PDF محمية تماماً ومخصصة لك ولا يمكن للعامة أو الزوار الاطلاع عليها للحفاظ على خصوصيتك.
                </p>
                <p className="p-2 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-100">
                   <strong>تخصيص اسم العرض للعامة:</strong> في خانة التتويج (التي تضم اسم المتسابق، اسم الشهادة، خيار الستوري Story، والنتائج)، لك الحرية الكاملة بين نشر اسمك الحقيقي أو اختيار اسم جديد/لقب مستعار ليظهر للجميع على المنصة.
                </p>
                <p className="p-2 rounded-xl bg-amber-950/60 border border-amber-500/30 text-amber-100">
                   <strong>التحكم والتعديل لاحقاً:</strong> يمكنك في أي وقت فتح بطاقة الشهادة وتغيير الاسم المطبوع عليها أو تعديل خصوصية العرض للعامة بنقرة زر واحدة.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitToContest} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1">اسمك أو لقبك الفني *</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: ريم الموسوي / صوت الأمل"
                  value={contestantName}
                  onChange={(e) => setContestantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">البلد أو المدينة (اختياري)</label>
                <input
                  type="text"
                  placeholder="مثال: الجزائر  / الرياض"
                  value={contestantCity}
                  onChange={(e) => setContestantCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-bold mb-1">كلمة أو إهداء للجمهور</label>
                <textarea
                  rows={2}
                  placeholder="أهدي هذا الأداء لعشاق سبيستون ويونا..."
                  value={contestantComment}
                  onChange={(e) => setContestantComment(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 text-xs resize-none"
                />
              </div>

              {analysis && (
                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
                  <span className="text-gray-300">الدرجة الصوتية المسجلة:</span>
                  <span className="font-mono font-black text-amber-300 text-sm">{analysis.overallScore}%</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 text-black font-black flex items-center gap-1.5 shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>تأكيد المشاركة في المسابقة </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Custom Song Choice by Contestant (اختياري) */}
      {showCustomSongModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0f172a] border-2 border-purple-500/60 rounded-3xl p-6 shadow-2xl text-right space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-purple-400">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">
                  {editingCustomSongId
                    ? `تعديل شارة «${customSongTitle || 'المخصصة'}» وإضافة الكلمات`
                    : 'إعداد شارة أو أغنية حرة من اختيارك للمسابقة'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowCustomSongModal(false);
                  setEditingCustomSongId(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              {editingCustomSongId
                ? 'يمكنك هنا إضافة أو تعديل كلمات الأغنية سطر بسطر ليتمكن الذكاء الاصطناعي من فحص مطابقتها أثناء غنائك، كما يمكنك تعديل اسم الأغنية أو المغني أو المقام الموسيقي.'
                : 'إذا رغبت في غناء شارة أو أغنية غير موجودة في الكتالوج، املأ بياناتها هنا لتظهر باسمها ومقامها ونوعها بالكامل في لوحة المتنافسين والشهادة الرسمية!'}
            </p>

            <form onSubmit={handleSaveCustomSong} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-200 font-bold mb-1">
                  اسم الأغنية أو الشارة *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: طلع البدر علينا / أمي كم أهواها / أنت الأمان / شارة دراغون بول"
                  value={customSongTitle}
                  onChange={(e) => setCustomSongTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-bold mb-1">
                  المغني أو المؤدي الأصلي *
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: رشا رزق / طارق العربي طرقان / فيروز / غناء حر"
                  value={customSongArtist}
                  onChange={(e) => setCustomSongArtist(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-200 font-bold mb-1">
                    المقام الموسيقي للأغنية *
                  </label>
                  <select
                    value={customSongMaqam}
                    onChange={(e) => setCustomSongMaqam(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-400 text-xs"
                  >
                    <option value="نهاوند">مقام نهاوند (شجي، عاطفي، وإنساني) </option>
                    <option value="كورد">مقام كورد (حزين، عميق، وعصري) </option>
                    <option value="بياتي">مقام بياتي (أصيل، طربي، ومفعم بالشجن) </option>
                    <option value="رست">مقام رست (ملك المقامات، فخم ومبهج) </option>
                    <option value="صبا">مقام صبا (شديد الحزن والشوق والتأثير) </option>
                    <option value="سيكاه">مقام سيكاه / هزام (طربي، تراثي، كلاسيكي) </option>
                    <option value="عجم">مقام عجم (ماجور، حماسي، وفرح) </option>
                    <option value="حجاز">مقام حجاز (روحاني، شجي، ومؤثر) </option>
                    <option value="حر">غناء حر / أكابيلا (بدون مقام محدد) </option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-200 font-bold mb-1">
                    نوع وطابع الأغنية *
                  </label>
                  <select
                    value={customSongGenre}
                    onChange={(e) => setCustomSongGenre(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white focus:outline-none focus:border-purple-400 text-xs"
                  >
                    <option value="طربية كلاسيكية ">طربية كلاسيكية </option>
                    <option value="شارة سبيستون أو أنمي ">شارة سبيستون أو أنمي </option>
                    <option value="وجدانية وشوق وأمومة ">وجدانية وشوق وأمومة </option>
                    <option value="حماسية وبطولية ">حماسية وبطولية </option>
                    <option value="طفولية وتعليمية ">طفولية وتعليمية </option>
                    <option value="وطنية وتراثية ">وطنية وتراثية </option>
                    <option value="هادئة وتأملية ">هادئة وتأملية </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-200 font-bold mb-1">
                  كلمات الأغنية (سطر لكل بيت - لتظهر أمامك أثناء الغناء):
                </label>
                <textarea
                  rows={4}
                  placeholder={`اكتب أو الصق الكلمات هنا سطر بسطر...\nمثال:\nطلع البدر علينا\nمن ثنيات الوداع\nوجب الشكر علينا...`}
                  value={customSongLyrics}
                  onChange={(e) => setCustomSongLyrics(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-gray-200 font-bold mb-1">
                  رابط كاريوكي أو يوتيوب للحن (اختياري):
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customSongYouTubeUrl}
                  onChange={(e) => setCustomSongYouTubeUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomSongModal(false);
                    setEditingCustomSongId(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-medium cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-black flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>
                    {editingCustomSongId
                      ? 'حفظ وتحديث كلمات الشارة الآن'
                      : 'اعتماد الأغنية وبدء الغناء والتسجيل '}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
