import { Artist, Anime, Category, Collection, CommunityEvent, Recording, Song, WebTool, QuizQuestion, Article } from '../types';
import { MASTER_QUIZ_BANK } from './quizData';

import { FALLBACK_RECORDINGS, FALLBACK_ARTISTS, FALLBACK_ANIME, FALLBACK_CATEGORIES } from './fallbackData';

export const INITIAL_ARTISTS: Artist[] = FALLBACK_ARTISTS;
export const INITIAL_ANIME: Anime[] = FALLBACK_ANIME;
export const INITIAL_CATEGORIES: Category[] = FALLBACK_CATEGORIES;
export const INITIAL_RECORDINGS: Recording[] = FALLBACK_RECORDINGS;


export const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: 'col-spacetoon-90s',
    title: 'ذكريات التسعينات - سبيستون كلاسيك',
    slug: 'spacetoon-90s-hits',
    description: 'مجموعة النوستالجيا الدافئة لشارات سبيستون التسعينات بصوت بشري خالٍ تماماً من الموسيقى.',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    recordingIds: ['rec-ana-wa-akhi', 'rec-hunter', 'rec-romeo', 'rec-conan']
  },
  {
    id: 'col-sad-vocals',
    title: 'صوتيات وجدانية وهادئة (Sad & Peaceful Vocals)',
    slug: 'sad-peaceful-vocals',
    description: 'تشكيلة صامتة وهادئة تساعد على التركيز، المذاكرة والاطمئنان الروحي.',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
    isFeatured: true,
    recordingIds: ['rec-do-not-cry', 'rec-ana-wa-akhi', 'rec-les-mis']
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'event-vote-next',
    title: 'تصويت الشارة القادمة لقناة Yona Songs ',
    eventType: 'voting',
    description: 'اقترح وصوّت للشارات والأغاني التي تتمنى أن تقوم يونا بتسجيلها وتوزيعها بشرّياً بدون موسيقى في الفيديو القادم!',
    startsAt: '2026-08-01T00:00:00Z',
    endsAt: '2026-08-31T23:59:59Z',
    isActive: true,
    entries: [
      { id: 'entry-1', eventId: 'event-vote-next', title: 'شارة دراجون بول زد (الحزء الأول)', originalArtist: 'طارق العربي طرقان', votesCount: 342, createdAt: '2026-08-02T10:00:00Z' },
      { id: 'entry-2', eventId: 'event-vote-next', title: 'أنا والماسي (سبيس باور)', originalArtist: 'رشا رزق', votesCount: 289, createdAt: '2026-08-03T11:30:00Z' },
      { id: 'entry-3', eventId: 'event-vote-next', title: 'حلمي تحطم واختفى', originalArtist: 'إيمي هيتاري', votesCount: 412, createdAt: '2026-08-01T08:15:00Z' },
      { id: 'entry-4', eventId: 'event-vote-next', title: 'شارة أجنحة الكاندام', originalArtist: 'عاصم سكر', votesCount: 198, createdAt: '2026-08-04T14:20:00Z' }
    ]
  }
];

export const INITIAL_WEB_TOOLS: WebTool[] = [
  {
    id: 'tool-tap-bpm',
    name: 'حاسبة إيقاع الصوت (Tap BPM Counter)',
    slug: 'tap-bpm-calculator',
    description: 'اضغط بانتظام مع إيقاع الصوت البشري لتحديد درجة الـ BPM بدقة عالية على المتصفح.',
    iconName: 'Activity'
  },
  {
    id: 'tool-key-finder',
    name: 'مكتشف السلم والمقام الموسيقي (Key & Scale Detector)',
    slug: 'key-scale-detector',
    description: 'عزف افتراضي ومكتشف المفتاح الموسيقي (A minor, G minor...) لمطابقة الصوتيات والمقامات.',
    iconName: 'Music'
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'فلسفة الصوت البشري النقّي (Acapella) في شارات سبيستون والأنمي',
    slug: 'philosophy-of-human-vocals-spacetoon',
    content: 'يعد الاعتماد على الصوت البشري والكورال الصافي طريقة ممتازة للاستمتاع بجمالية الألحان والكلمات الملهمة دون الحاجة لآلات موسيقية...',
    authorName: 'فريق يونا سوينغز',
    publishedAt: '2026-07-20T10:00:00Z',
    readTimeMinutes: 4,
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_QUIZ_QUESTIONS: QuizQuestion[] = MASTER_QUIZ_BANK;
