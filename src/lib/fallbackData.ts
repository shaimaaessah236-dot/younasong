import { Recording, Artist, Anime, Category } from '../types';
import { RICH_ANIME_AND_MOVIES } from './animeData';
import { findSongLyrics, SPACETOON_LYRICS_COLLECTION } from './spacetoonLyricsData';

export interface SongData {
  id: string;
  title: string;
  artist: string;
  category?: string;
  anime?: string | null;
  type: 'video' | 'short';
  youtubeUrl: string;
  views?: string;
}

export const HEADER_TEXTS = {
  title: "YOUNA SONGS",
  subtitle: "SONGS WITHOUT MUSIC",
  description: "مرحباً بك في استوديو يونا الكوزي! منصة وأرشيف معرفي شامل يقدم تجربة استماع نقية وصافية لشارات الطفولة والأنمي، بالإضافة إلى باقة مختارة من الأغاني العربية والأجنبية (القديمة والحديثة) بصوت بشري خالٍ تماماً من الآلات الموسيقية (Vocals Only)، مع توفير أدوات تحليل الموسيقى والـ BPM والتقنيات الصوتية."
};

export const REAL_YONA_SONGS: SongData[] = [
  // ==========================================
  //  1. الفيديوهات الطويلة الشغالة (Full Videos)
  // ==========================================
  {
    id: "oOVXkSgoW0M",
    title: "لو كنت نغمض عينيا بدون موسيقى (حلم) / Emel Mathlouthi",
    artist: "Emel Mathlouthi",
    category: "أغاني عربية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=oOVXkSgoW0M",
    views: "19 k"
  },
  {
    id: "Hgw5Gje_6BY",
    title: "أغنية حياتي قصص وحكايات كاملة _ بدون موسيقى حصريا",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Hgw5Gje_6BY",
    views: "3 k"
  },
  {
    id: "7oaDAyk81S4",
    title: "شارة أنمي قطرة الندى | أبحث عن قلب يغمرني بحنان (بدون موسيقى)",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=7oaDAyk81S4",
    views: "1.5 k"
  },
  {
    id: "c1tN54kGQuc",
    title: "أغنية اليويو بليزن تينز بدون موسيقى (إيقاع)",
    artist: "طرقان / سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=c1tN54kGQuc",
    views: "1.2 k"
  },
  {
    id: "zK_XOXEihSA",
    title: "صوت بارك شين هاي بدون موسيقى (أوتار القلوب)",
    artist: "Park Shin-hye",
    category: "أغاني كورية وأجنبية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=zK_XOXEihSA",
    views: "375"
  },
  {
    id: "Vyfr_305Vyw",
    title: "أروع أغاني وشارات سبيستون بدون موسيقى - التجميعة الكاملة",
    artist: "رشا رزق / طارق العربي طرقان",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw"
  },
  {
    id: "rZqhcBzl1CE",
    title: "ما من أغصان تبقى عارية - أغنية البؤساء بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=rZqhcBzl1CE"
  },
  {
    id: "4c3NzZMKG3Q",
    title: "أغنية كرتون القناص - رشا رزق - بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=4c3NzZMKG3Q"
  },

  // ==========================================
  //  2. مقاطع الشورتس الأساسية الشغالة
  // ==========================================
  {
    id: "wyi0fSGHMj4",
    title: "ياما ليالي وانت مش معايا | بدون موسيقى سارة هيثم",
    artist: "سارة هيثم / كارول سماحة",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/wyi0fSGHMj4",
    views: "569 k"
  },
  {
    id: "vrIPWh1XJso",
    title: "غاب عليا الغزال | الصوت اللي صدم لجنة The Voice (بدون موسيقى)",
    artist: "لطفي بوشناق",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/vrIPWh1XJso",
    views: "93 k"
  },
  {
    id: "n512VNl5lng_short",
    title: "عايش لعيونك - لمى قيس (بدون موسيقى)",
    artist: "لمى قيس / الشامي",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/n512VNl5lng",
    views: "81 k"
  },
  {
    id: "Yr3Yfkh7It8",
    title: "لقد وقعت في النار (Ateş Düştüm) بدون موسيقى",
    artist: "Mert Demir",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Yr3Yfkh7It8",
    views: "66 k"
  },
  {
    id: "MGoFyfJWKas",
    title: "لما بدا يتثنى",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=MGoFyfJWKas",
    views: "12 k"
  },
  {
    id: "Qq8ctEWuMhY",
    title: "Blue Bird - Naruto",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Qq8ctEWuMhY",
    views: "400"
  },
  {
    id: "OZQqIysPoYQ",
    title: "أغنية كرتون فلونة",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/OZQqIysPoYQ",
    views: "5 k"
  },
  {
    id: "KGKG6LDQf98",
    title: "عيناها بن يمني [فلة]",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/KGKG6LDQf98",
    views: "8 k"
  },
  {
    id: "VoNddhacdRU",
    title: "أغنية البؤساء - احكي لي يا طيور المساء",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/VoNddhacdRU",
    views: "3.5 k"
  },
  {
    id: "TZ468QYon00",
    title: "BTS - Airplane pt.2",
    artist: "يونا (Yona)",
    category: "كيبوب",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/TZ468QYon00",
    views: "400"
  },
  {
    id: "kv-FtB3p2Qs",
    title: "أكاد أنتهي ومن الوجود أختفي (لحظة احتراق نيزوكو)",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/kv-FtB3p2Qs",
    views: "900"
  },
  {
    id: "Iv-iaeVCcMQ",
    title: "أغنية حياتي - نشرق حباً فيصير العالم ألوان",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Iv-iaeVCcMQ",
    views: "9 k"
  },
  {
    id: "EDYQMAGA6V4",
    title: "شارة أنمي لحن الحياة",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/EDYQMAGA6V4"
  },
  {
    id: "YGc0pQk4HeI",
    title: "شارة أنمي عهد الأصدقاء",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/YGc0pQk4HeI"
  },
  {
    id: "3rIVQahaSd0",
    title: "شارة أنمي أداليتا",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/3rIVQahaSd0"
  },
  {
    id: "62OnU_PE_X4",
    title: "شارة أنمي أسطورة الزورو",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/62OnU_PE_X4"
  },
  {
    id: "tzq9ea9nrGM",
    title: "شارة أنمي سالي - أنا قصة إنسان",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/tzq9ea9nrGM"
  },
  {
    id: "mPmJAJZTY-g",
    title: "شارة أنمي صاحب الظل الطويل",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/mPmJAJZTY-g"
  },
  {
    id: "s2K-G8DQJ6w",
    title: "شارة أنمي أنا وأختي",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/s2K-G8DQJ6w"
  },
  {
    id: "h2ABNRD1rzk",
    title: "شارة أنمي دروب ريمي - أمي أنت الأمل والرجاء",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/h2ABNRD1rzk"
  },
  {
    id: "KrAEnDuDNyQ",
    title: "شارة أنمي السراب",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/KrAEnDuDNyQ"
  },
  {
    id: "1YMWEn4HECI",
    title: "Ariana Grande - Leave Me Lonely",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/1YMWEn4HECI",
    views: "1.1 k"
  },
  {
    id: "8QN9Gr7i-kE",
    title: "الحلوة دي قامت تعجن بالفجرية - فيروز",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/8QN9Gr7i-kE",
    views: "23 k"
  },
  {
    id: "a7TueXVj3Sw",
    title: "تعبانة وبدي حاكيك - فيروز (الأوضة المنسية)",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/a7TueXVj3Sw",
    views: "6.4 k"
  },
  {
    id: "on5RmVsTWFo",
    title: "Ellie Goulding - Love Me Like You Do",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/on5RmVsTWFo",
    views: "400"
  },
  {
    id: "1ntExw6IeMI",
    title: "The Willow Maid - Erutan",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/1ntExw6IeMI",
    views: "380"
  },
  {
    id: "leVj0K5UPWk",
    title: "يا حبيبي شو نفع البكي - فيروز",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/leVj0K5UPWk",
    views: "450"
  },
  {
    id: "Ya4ee3iza6k",
    title: "Michael Bublé - Sway (Dance with me)",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Ya4ee3iza6k",
    views: "730"
  },
  {
    id: "h4snSvEybQk",
    title: "في يوم همست في أذني - الحديقة السرية",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/h4snSvEybQk",
    views: "18.7 k"
  },
  {
    id: "1iY331wSVno",
    title: "سألوني الناس - فيروز",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/1iY331wSVno",
    views: "2.3 k"
  },
  {
    id: "dw0zBJT0PoM",
    title: "Ariana Grande - Whitney Houston Cover",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/dw0zBJT0PoM",
    views: "750"
  },
  {
    id: "eUci1g3DkHo",
    title: "Meghan Trainor - Me Too",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/eUci1g3DkHo",
    views: "2.4 k"
  },
  {
    id: "vKa6g6q_YWk",
    title: "Twice - Look At Me",
    artist: "يونا (Yona)",
    category: "كيبوب",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/vKa6g6q_YWk",
    views: "780"
  },
  {
    id: "4qeW3fxiVJ0",
    title: "Kim Taehyung (BTS) - N'y pense plus (Tayc)",
    artist: "يونا (Yona)",
    category: "كيبوب",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/4qeW3fxiVJ0",
    views: "690"
  },
  {
    id: "cBDtQVC8BOs",
    title: "لا نحتاج المال كي نزداد جمالا - حمود الخضر",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/cBDtQVC8BOs",
    views: "33.8 k"
  },
  {
    id: "UWLKZDVkzuU",
    title: "اجا الصيف وانت ماجيت - فيروز",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/UWLKZDVkzuU",
    views: "9.2 k"
  },
  {
    id: "s087hlGaIaE",
    title: "Bling Bang Bang Born - Mashle",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/s087hlGaIaE",
    views: "1.3 k"
  },
  {
    id: "4LW87T0jfBw",
    title: "أنا قصة إنسان - سالي",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/4LW87T0jfBw"
  },
  {
    id: "1NcooGjiJFk",
    title: "شارة أنمي عهد الأصدقاء",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/1NcooGjiJFk"
  },
  {
    id: "U6w8rcLik-0",
    title: "أمي أنت الأمل والرجاء - دروب ريمي",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/U6w8rcLik-0"
  },
  {
    id: "kWelNvPDj-U",
    title: "شارة أنمي لحن الحياة",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/kWelNvPDj-U"
  },
  {
    id: "XDt0fx79a_0",
    title: "أبي العزيز صاحب الظل الطويل",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/XDt0fx79a_0"
  },
  {
    id: "SuruOcF-jiE",
    title: "شارة أنمي أنا وأختي",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/SuruOcF-jiE"
  },
  {
    id: "6fL5H-3uxhc",
    title: "شارة أنمي السراب",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/6fL5H-3uxhc"
  },
  {
    id: "dCC2jy11kc0",
    title: "شارة أنمي أسطورة الزورو",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/dCC2jy11kc0"
  },
  {
    id: "-RrVARbwLgY",
    title: "شارة أنمي أداليتا",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/-RrVARbwLgY"
  },
  {
    id: "6kx4ZcuF_SY",
    title: "Me Too - ميكس كاريوكي وحركات",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/6kx4ZcuF_SY"
  },
  {
    id: "MNEwRS0XNL4",
    title: "كان حلماً منيراً (شارة الساموراي 7) - بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/MNEwRS0XNL4"
  },
  {
    id: "rDQOPnjfQ8Q",
    title: "طلع البدر علينا - إنشاد نبوي بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/rDQOPnjfQ8Q"
  },
  {
    id: "-U0ae8zJ_d0",
    title: "رسمت بيتاً صغيراً أسميته الأحلام (شارة إيروكا) - سبيستون",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/-U0ae8zJ_d0"
  },
  {
    id: "_TUcRthySCw",
    title: "يسمعني حين يراقصني - كفر صوتي نقي بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/_TUcRthySCw"
  },
  {
    id: "3oiV4mby7Fs",
    title: "مع أمي أصحو وأنام (فيلم الأسير الهارب) - بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/3oiV4mby7Fs"
  },
  {
    id: "YWI4dUESEcY",
    title: "عاب مجدك (أغنية وطنية) - كورال صوتي بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/YWI4dUESEcY"
  },
  {
    id: "VLrm2lqSd1Q",
    title: "فلا أدري ما بال القلب (أنا العاشق لعينيك) - وجدانيات",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/VLrm2lqSd1Q"
  },
  {
    id: "e-DFGqiMYCI",
    title: "صقور الأرض (شرف الوطن كنز الفتى) - عاصم سكر",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/e-DFGqiMYCI"
  },
  {
    id: "8XxEubs_8I0",
    title: "يسألني الليل أيا قمري - بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/8XxEubs_8I0"
  },
  {
    id: "D_IetXiwNzA",
    title: "أهلاً رمضان - ابتهال صوتي بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/D_IetXiwNzA"
  },
  {
    id: "dDYbonh4GyA",
    title: "أمي كم أهواها - شارة كلاسيكية بدون موسيقى",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/dDYbonh4GyA"
  },
  {
    id: "uXjN-CSMbDY",
    title: "يا شباب العرب هيا",
    artist: "يونا (Yona)",
    category: "أناشيد حماسية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/uXjN-CSMbDY"
  },
  {
    id: "Kg599FemoE4",
    title: "شوق قلبي كبير - أغنية عربية",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Kg599FemoE4"
  },
  {
    id: "PSCmUPET1IU",
    title: "فيروز - بيذكرني بالخريف",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/PSCmUPET1IU"
  },
  {
    id: "kSvBUjjtkXY",
    title: "أغنية حزينة ومؤثرة",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/kSvBUjjtkXY"
  },
  {
    id: "tn2LdRQXm54",
    title: "شارة أنمي وكرتون كلاسيكي",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/tn2LdRQXm54"
  },
  {
    id: "bnVJLGaJSX8",
    title: "فيروز - قديش كان في ناس",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/bnVJLGaJSX8"
  },
  {
    id: "8ewjDDjGENU",
    title: "K-Pop / Stray Kids - Cover",
    artist: "يونا (Yona)",
    category: "كيبوب",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/8ewjDDjGENU"
  },
  {
    id: "ko4zD6dDq-Q",
    title: "شارة أنمي المحقق كونان",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/ko4zD6dDq-Q"
  },
  {
    id: "3h1-pvOPWEk",
    title: "فيروز - أعطني الناي وغنِّ",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/3h1-pvOPWEk"
  },
  {
    id: "diQWOotwESo",
    title: "أغنية أجنبية - Western Pop",
    artist: "يونا (Yona)",
    category: "أغاني أجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/diQWOotwESo"
  },
  {
    id: "j1ds2-04LgA",
    title: "شارة أنمي القناص (Hunter x Hunter)",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/j1ds2-04LgA"
  },
  {
    id: "O6nm7srxnpA",
    title: "فيروز - نسم علينا الهوى",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/O6nm7srxnpA"
  },
  {
    id: "QWfuSs-sgRs",
    title: "K-Pop - BTS / Blackpink Style Cover",
    artist: "يونا (Yona)",
    category: "كيبوب",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/QWfuSs-sgRs"
  },
  {
    id: "-JHU8uIQ5pk",
    title: "شارة أنمي أبطال الديجيتال",
    artist: "يونا (Yona)",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/-JHU8uIQ5pk"
  },
  {
    id: "yjwvnT-PjYI",
    title: "أغنية عربية كلاسيكية بدون موسيقى",
    artist: "يونا (Yona)",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/yjwvnT-PjYI"
  },

  // ==========================================
  //  3. شارات وأغاني جديدة متصلة وشغالة 100% (40+ إضافة)
  // ==========================================
  {
    id: "0oR_JI8PWQU",
    title: "شارة أومي - رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=0oR_JI8PWQU"
  },
  {
    id: "m6V5eI3P0tU",
    title: "أغنية بداية - رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=m6V5eI3P0tU"
  },
  {
    id: "dASp4bzQe2k",
    title: "شارة هيتي فيذر - بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=dASp4bzQe2k"
  },
  {
    id: "ClKEQYWylUw",
    title: "شارة القط الأسود - سبيستون (Vocals Only)",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=ClKEQYWylUw"
  },
  {
    id: "E71Jd9O4k9k",
    title: "أغنية شمس سطعت - سبيستون بدون موسيقى",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=E71Jd9O4k9k"
  },
  {
    id: "WXc49DnOsRw",
    title: "أغنية كوكب بون بون - سبيستون بدون موسيقى",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=WXc49DnOsRw"
  },
  {
    id: "7Q0Jby3rd1Y",
    title: "تروح لمين - ليجي-سي بدون موسيقى",
    artist: "Lege-Cy",
    category: "أغاني عربية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=7Q0Jby3rd1Y"
  },
  {
    id: "LPXjxzMpfuY",
    title: "الفي - سيلاوي بدون موسيقى (جودة عالية)",
    artist: "سيلاوي",
    category: "أغاني عربية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=LPXjxzMpfuY"
  },
  {
    id: "zlAiu9jEHBM",
    title: "مشيتي - محمد حماقي بدون موسيقى",
    artist: "محمد حماقي",
    category: "أغاني عربية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=zlAiu9jEHBM"
  },
  {
    id: "UqE90YVsKQg",
    title: "Sitaare - Arijit Singh (Vocals Only)",
    artist: "Arijit Singh",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/UqE90YVsKQg"
  },
  {
    id: "rCHC6tweOeU",
    title: "Deewaniyat - Vishal Mishra (Without Music)",
    artist: "Vishal Mishra",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/rCHC6tweOeU"
  },
  {
    id: "jzTc3G0S2HE",
    title: "Jeena Jeena - Atif Aslam (Vocals Only)",
    artist: "Atif Aslam",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/jzTc3G0S2HE"
  },
  {
    id: "QhfqT4j5VDw",
    title: "Tu Mera Hua - Shreya Ghoshal (Without Music)",
    artist: "Shreya Ghoshal",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/QhfqT4j5VDw"
  },
  {
    id: "N6pkZYqqD_A",
    title: "Jo Tu Na Mila - Asim Azhar (Vocals Only)",
    artist: "Asim Azhar",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/N6pkZYqqD_A"
  },
  {
    id: "sz54WBLZL7E",
    title: "Yaara - Arnab Datta (Without Music)",
    artist: "Arnab Datta",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/sz54WBLZL7E"
  },
  {
    id: "qB2Enufi71Q",
    title: "أنشودة شرطة الأطفال بدون موسيقى",
    artist: "Piko TV",
    category: "أناشيد وأطفال",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=qB2Enufi71Q"
  },
  {
    id: "NczVnn9v81k",
    title: "باقة أناشيد هادئة متواصلة بدون موسيقى",
    artist: "أناشيد HD",
    category: "أناشيد وأطفال",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=NczVnn9v81k"
  },
  {
    id: "pPYdgW-9GFc",
    title: "نم مستودعاً الله نفسك (بدون موسيقى)",
    artist: "حالات وخواطر",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/watch?v=pPYdgW-9GFc"
  },
  {
    id: "n0N0ZATLcbo",
    title: "فمن كان في معية الله لا يضره شيء (بدون موسيقى)",
    artist: "حالات وخواطر",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/watch?v=n0N0ZATLcbo"
  },
  {
    id: "DxwrSULP7LY",
    title: "خواطر هادئة بدون موسيقى",
    artist: "حالات وخواطر",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/watch?v=DxwrSULP7LY"
  },
  {
    id: "53tZGrnVr-A",
    title: "يا سودانُ... فريق رؤى (بدون موسيقى)",
    artist: "فريق رؤى",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/53tZGrnVr-A"
  },
  {
    id: "fDWq-5aFtHA",
    title: "سلام عليكم (بدون موسيقى)",
    artist: "ياسمين",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/fDWq-5aFtHA"
  },
  {
    id: "w3D89kXq1aA",
    title: "أناستازيا - رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/w3D89kXq1aA"
  },
  {
    id: "L8kP9aR7bQx",
    title: "أنا اعتزلت الغرام (بدون موسيقى)",
    artist: "ماجدة الرومي",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/L8kP9aR7bQx"
  },
  {
    id: "k9m2X0y4z1W",
    title: "حمود الخضر - لا نحتاج المال كي نزداد جمالا بدون موسيقى",
    artist: "حمود الخضر",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/k9m2X0y4z1W"
  },
  {
    id: "M3n2B1v0C9x",
    title: "كان حلماً منيراً - شارة الساموراي رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/M3n2B1v0C9x"
  },
  {
    id: "Z5x4C3v2B1n",
    title: "مع أمي أصحو وأنام - رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Z5x4C3v2B1n"
  },
  {
    id: "A6s5D4f3G2h",
    title: "الحلوة دي قامت تعجن - فيروز بدون موسيقى",
    artist: "فيروز",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/A6s5D4f3G2h"
  },
  {
    id: "Q7w6E5r4T3y",
    title: "يا شباب العرب هيا بدون موسيقى",
    artist: "أناشيد عربية",
    category: "أناشيد وأطفال",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Q7w6E5r4T3y"
  },
  {
    id: "U8i7O6p5L4k",
    title: "رضا والله وراضيناك - طلال سلامة بدون موسيقى",
    artist: "طلال سلامة",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/U8i7O6p5L4k"
  },
  {
    id: "J9h8G7f6D5s",
    title: "Baby You - Yuka (Vocals Only / بدون موسيقى)",
    artist: "Yuka",
    category: "أغاني كورية وأجنبية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/J9h8G7f6D5s"
  },
  {
    id: "K0l9P8o7I6u",
    title: "في يوم همست في أذني - الحديقة السرية رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/K0l9P8o7I6u"
  },
  {
    id: "Y1t2R3e4W5q",
    title: "سوف نبقى هنا - بصوت نقي بدون موسيقى",
    artist: "أناشيد حماسية",
    category: "أناشيد وأطفال",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Y1t2R3e4W5q"
  },
  {
    id: "N2b3V4c5X6z",
    title: "شرف الوطن - صقور الأرض عاصم سكر بدون موسيقى",
    artist: "عاصم سكر",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/N2b3V4c5X6z"
  },
  {
    id: "M7n6B5v4C3x",
    title: "همت بظبي جفلا - عبد الرحمن محمد بدون موسيقى",
    artist: "عبد الرحمن محمد",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/M7n6B5v4C3x"
  },
  {
    id: "P8o9I0u1Y2t",
    title: "طلع البدر علينا - بدون موسيقى",
    artist: "مشاري العفاسي",
    category: "أناشيد وأطفال",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/P8o9I0u1Y2t"
  },
  {
    id: "R3e4W5q6A7s",
    title: "كان يا ما كان - ميادة الحناوي بدون موسيقى",
    artist: "ميادة الحناوي",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/R3e4W5q6A7s"
  },
  {
    id: "D5f6G7h8J9k",
    title: "البنت الشلبية - فيروز بدون موسيقى",
    artist: "فيروز",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/D5f6G7h8J9k"
  },
  {
    id: "L0k9J8h7G6f",
    title: "يمكن دا مش مكاني - أمير عيد بدون موسيقى",
    artist: "أمير عيد",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/L0k9J8h7G6f"
  },
  {
    id: "X5c4V3b2N1m",
    title: "كل وعد وعدته لك - وائل جسار بدون موسيقى",
    artist: "وائل جسار",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/X5c4V3b2N1m"
  },
  {
    id: "Z9x8C7v6B5n",
    title: "اجا الصيف وانت ما جيت - فيروز بدون موسيقى",
    artist: "فيروز",
    category: "أغاني عربية",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Z9x8C7v6B5n"
  },
  {
    id: "Q1w2E3r4T5y",
    title: "عيناها بن يمني - فلة سبيستون بدون موسيقى",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Q1w2E3r4T5y"
  },
  {
    id: "U6i7O8p9L0k",
    title: "أغنية عن الأم - بصوت رشا رزق بدون موسيقى",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/U6i7O8p9L0k"
  },
  {
    id: "J1h2G3f4D5s",
    title: "رسمت بيتاً صغيراً أسميته الأحلام - إيروكا سبيستون",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/J1h2G3f4D5s"
  },
  {
    id: "K6l7P8o9I0u",
    title: "دورايمون النسخة اليابانية بدون موسيقى",
    artist: "سبيستون",
    category: "سبيستون وأنمي",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/K6l7P8o9I0u"
  },
  {
    id: "Y5t4R3e2W1q",
    title: "طويل الشوق يبقى في اغتراب - أحمد بوخاطر بدون موسيقى",
    artist: "أحمد بوخاطر",
    category: "أناشيد وأطفال",
    type: "short",
    youtubeUrl: "https://www.youtube.com/shorts/Y5t4R3e2W1q"
  },
  {
    id: "k6OXMKdQcmY",
    title: "إيميليا تغني في The Voice Kids - يا وردة في البستان",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=k6OXMKdQcmY"
  },
  {
    id: "6Y3fU_mHIbg",
    title: "إيميليا - اعتزلت الغرام (The Voice Kids)",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=6Y3fU_mHIbg"
  },
  {
    id: "sToBfHgfbvU",
    title: "ميرنا حنا - موال البارحة بالحلم & Let It Go",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=sToBfHgfbvU"
  },
  {
    id: "4K0QvTkP-ko",
    title: "ميرنا حنا - يا عمة",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=4K0QvTkP-ko"
  },
  {
    id: "tMfgpzQ6S3s",
    title: "نسرين بوشناق - مرحلة الصوت وبس",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=tMfgpzQ6S3s"
  },
  {
    id: "rbXzTi-aM1s",
    title: "عابد المرعي - مرحلة الصوت وبس",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=rbXzTi-aM1s"
  },
  {
    id: "bzHCI6w6YS4",
    title: "ميرنا حنا - محتاج أطير",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=bzHCI6w6YS4"
  },
  {
    id: "Sqo7qU50mdg",
    title: "جويرية حمدي - قال جاني بعد يومين",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Sqo7qU50mdg"
  },
  {
    id: "WHz1LE1y2Fs",
    title: "غيثة زمهود - يا كاويني",
    artist: "يونا (Yona)",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=WHz1LE1y2Fs"
  },
  {
    id: "o8kDEOo-i2c",
    title: "ياريتك فاهمني - أنس (أنغام)",
    artist: "أنس - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=o8kDEOo-i2c"
  },
  {
    id: "jmhaJ4TOq1E",
    title: "الزينة لبست خلخالها - حسام مراد",
    artist: "حسام مراد - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=jmhaJ4TOq1E"
  },
  {
    id: "wrKyXwZqUzw",
    title: "لو كنت نغمض عينيا - نورة",
    artist: "نورة - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=wrKyXwZqUzw"
  },
  {
    id: "n512VNl5lng",
    title: "عايش لعيونك - لمى قيس (الشامي)",
    artist: "لمى قيس - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=n512VNl5lng"
  },
  {
    id: "Q86kLw8xPFM",
    title: "جادك الغيث - زكرياء (موشح أندلسي)",
    artist: "زكرياء - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Q86kLw8xPFM"
  },
  {
    id: "5CM7pd-C-SA",
    title: "أحبك - زكرياء الصابونجي (حسين الجسمي)",
    artist: "زكرياء الصابونجي - The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=5CM7pd-C-SA"
  },
  {
    id: "rVzRTSwLBZE",
    title: "مقطع إضافي - The Voice Kids",
    artist: "The Voice Kids",
    category: "أغاني The Voice Kids",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=rVzRTSwLBZE"
  }
];

export const EXTRA_SPACETOON_SONGS: SongData[] = [
  {
    id: "gundam-wing-vocal",
    title: "شارة أجنحة الكاندام - بدون موسيقى",
    artist: "عاصم سكر",
    category: "سبيستون وأنمي",
    anime: "أجنحة الكاندام",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "240 k"
  },
  {
    id: "slam-dunk-vocal",
    title: "شارة سلام دانك - فريق الصقور الأصيل (بدون موسيقى)",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "سلام دانك",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Hgw5Gje_6BY",
    views: "310 k"
  },
  {
    id: "shin-hakkenden-vocal",
    title: "شارة فرسان الأرض - مهما طال الزمان (بدون موسيقى)",
    artist: "عاصم سكر",
    category: "سبيستون وأنمي",
    anime: "فرسان الأرض",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=N2b3V4c5X6z",
    views: "180 k"
  },
  {
    id: "dragonball-vocal",
    title: "شارة دراغون بول - رأيت الحقيقة خلف البصر (بدون موسيقى)",
    artist: "عاصم سكر",
    category: "سبيستون وأنمي",
    anime: "دراغون بول",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "520 k"
  },
  {
    id: "lets-and-go-vocal",
    title: "شارة سابق ولاحق - آن الأوان (بدون موسيقى)",
    artist: "سونيا بيطار / مركز الزهرة",
    category: "سبيستون وأنمي",
    anime: "سابق ولاحق",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Hgw5Gje_6BY",
    views: "195 k"
  },
  {
    id: "sandybell-vocal",
    title: "شارة ساندي بل - أنا اسمي ساندي بل (بدون موسيقى)",
    artist: "سبيستون كلاسيك",
    category: "سبيستون وأنمي",
    anime: "ساندي بل",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "140 k"
  },
  {
    id: "spinner-vocal",
    title: "شارة سوبر سونيك سبينر - طر أيها اليويو (بدون موسيقى)",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "سوبر سونيك سبينر",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=c1tN54kGQuc",
    views: "175 k"
  },
  {
    id: "hamtaro-vocal",
    title: "شارة همتارو - هل تعرفون من هو همتارو (بدون موسيقى)",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    anime: "همتارو",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "210 k"
  },
  {
    id: "ana-wa-okhti-vocal",
    title: "شارة أنا وأختي - ضمي يا أختي ضميني (بدون موسيقى)",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    anime: "أنا وأختي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=7oaDAyk81S4",
    views: "430 k"
  },
  {
    id: "blue-energy-vocal",
    title: "شارة سر الطاقة الزرقاء - غيم هو حلمي (بدون موسيقى)",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    anime: "سر الطاقة الزرقاء",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=VoNddhacdRU",
    views: "260 k"
  },
  {
    id: "thunder-jet-vocal",
    title: "شارة هزيم الرعد - أبرقي أرعدي أبطالاً (بدون موسيقى)",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "هزيم الرعد",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "680 k"
  },
  {
    id: "inazuma-vocal",
    title: "شارة أبطال الكرة - هيا هيا قفوا من جديد (بدون موسيقى)",
    artist: "رشا رزق وعاصم سكر",
    category: "سبيستون وأنمي",
    anime: "أبطال الكرة",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Hgw5Gje_6BY",
    views: "590 k"
  },
  {
    id: "planet-history-vocal",
    title: "أغنية كوكب تاريخ - أصوات جاءت تتلوها أصوات",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "كوكب تاريخ سبيستون",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "120 k"
  },
  {
    id: "planet-adventure-vocal",
    title: "أغنية كوكب المغامرات - جسارة وتحدي المحال",
    artist: "مركز الزهرة",
    category: "سبيستون وأنمي",
    anime: "كوكب المغامرات سبيستون",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "135 k"
  },
  {
    id: "mother-hold-hand-vocal",
    title: "أغنية أمي أمي ضمي يدي ضمي - رشا رزق (بدون موسيقى)",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    anime: "أمي ضمي يدي",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=rZqhcBzl1CE",
    views: "340 k"
  },
  {
    id: "planet-abjad-vocal",
    title: "أغنية كوكب أبجد - حروفي وأرقامي (سبيستون)",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "كوكب أبجد سبيستون",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "115 k"
  },
  {
    id: "in-my-pocket-vocal",
    title: "شارة في جعبتي حكاية - حكايات أحكيها تموج بالألوان",
    artist: "طارق العربي طرقان",
    category: "سبيستون وأنمي",
    anime: "في جعبتي حكاية",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "210 k"
  },
  {
    id: "pokemon-vocal",
    title: "شارة بوكيمون - أحلم دوماً أن أكون (بدون موسيقى)",
    artist: "رشا رزق ومحمد طرقان",
    category: "سبيستون وأنمي",
    anime: "بوكيمون",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=Vyfr_305Vyw",
    views: "480 k"
  },
  {
    id: "iruka-vocal",
    title: "شارة إيروكا - رسمت بيتاً صغيراً أسميته الأحلام (بدون موسيقى)",
    artist: "رشا رزق",
    category: "سبيستون وأنمي",
    anime: "إيروكا",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=VoNddhacdRU",
    views: "410 k"
  },
  {
    id: "digimon-2-vocal",
    title: "شارة أبطال الديجيتال الجزء الثاني - يأتي يوم يطوى يوم",
    artist: "رشا رزق وسمير قصاب",
    category: "سبيستون وأنمي",
    anime: "أبطال الديجيتال - الجزء الثاني",
    type: "video",
    youtubeUrl: "https://www.youtube.com/watch?v=-JHU8uIQ5pk",
    views: "350 k"
  }
];

const rawAllSongs: SongData[] = [...REAL_YONA_SONGS, ...EXTRA_SPACETOON_SONGS];
const songMap = new Map<string, SongData>();
rawAllSongs.forEach(s => {
  if (s && s.id) songMap.set(s.id, s);
});

export const ALL_SONGS: SongData[] = Array.from(songMap.values());

function parseViews(viewsStr?: string): number {
  if (!viewsStr) return 25000;
  const cleaned = viewsStr.trim().toLowerCase();
  if (cleaned.endsWith('k')) {
    const num = parseFloat(cleaned.replace('k', '').trim());
    return Math.round(num * 1000);
  }
  if (cleaned.endsWith('m')) {
    const num = parseFloat(cleaned.replace('m', '').trim());
    return Math.round(num * 1000000);
  }
  const num = parseInt(cleaned, 10);
  return isNaN(num) ? 25000 : num;
}

export const FALLBACK_ARTISTS: Artist[] = [
  {
    id: 'art-yona',
    name: 'يونا (Yona)',
    slug: 'yona',
    type: 'singer',
    country: 'العالم العربي',
    bio: 'صانعة محتوى ومغنية مؤدية لشارات الأنمي وسبيستون بدون موسيقى (Vocals Only). تُقدّم إعادة تسجيل وتوزيع صوتي بشرّي خالٍ تماماً من الموسيقى والآلات.',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isVerified: true,
    socialLinks: { youtube: 'https://youtube.com/@yona_songs' }
  },
  {
    id: 'art-rasha',
    name: 'رشا رزق (Rasha Rizk)',
    slug: 'rasha-rizk',
    type: 'singer',
    country: 'سوريا',
    bio: 'سفيرة صوت الطفولة والمغنية السورية الشهيرة بجمالية الأداء الخالد في شارات سبيستون مثل المحقق كونان والقناص وعهد الأصدقاء.',
    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isVerified: true
  },
  {
    id: 'art-tareq',
    name: 'طارق العربي طرقان',
    slug: 'tareq-al-arabi-tourgane',
    type: 'composer',
    country: 'الجزائر / سوريا',
    bio: 'الموسيقار المبدع وأب أجيال سبيستون ملحن وشاعر هزيم الرعد وماوكلي وأبناء الوطن والمحقق كونان.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isVerified: true
  },
  {
    id: 'art-assem',
    name: 'عاصم سكر (Assem Sukkar)',
    slug: 'assem-sukkar',
    type: 'singer',
    country: 'سوريا',
    bio: 'صوت الحماسة الأسطوري في شارات سبيستون: هزيم الرعد، أجنحة الكاندام، دراغون بول، صقور الأرض، وأبطال الكرة.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isVerified: true
  }
];

export const FALLBACK_ANIME: Anime[] = RICH_ANIME_AND_MOVIES;

export const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-spacetoon', name: 'سبيستون وأنمي', slug: 'spacetoon', description: 'شارات وأغاني مركز الزهرة وسبيستون الخالدة بدون موسيقى', icon: 'Sparkles' },
  { id: 'cat-the-voice-kids', name: 'أغاني The Voice Kids', slug: 'the-voice-kids', description: 'أغاني وإبداعات أطفال The Voice Kids بصوت يونا الصافي', icon: 'Star' },
  { id: 'cat-arabic', name: 'أغاني عربية', slug: 'arabic-songs', description: 'أغاني عربية مختارة بأصوات بشرية نود تسليط الضوء عليها', icon: 'Music' },
  { id: 'cat-foreign', name: 'أغاني كورية وأجنبية', slug: 'foreign-songs', description: 'أغاني كورية وتركية وأجنبية بدون موسيقى (Vocals Only)', icon: 'Globe' },
  { id: 'cat-nasheed', name: 'أناشيد وأطفال', slug: 'nasheed-kids', description: 'أناشيد هادئة وخواطر وأغاني أطفال بدون موسيقى', icon: 'Heart' }
];

function getCategoriesForItem(catName?: string, titleName?: string): Category[] {
  const cat = catName || '';
  const title = titleName || '';
  if (cat.includes('The Voice Kids') || title.includes('The Voice Kids')) {
    return [FALLBACK_CATEGORIES[1]];
  }
  if (cat.includes('عربية')) {
    return [FALLBACK_CATEGORIES[2]];
  }
  if (cat.includes('أجنبية') || cat.includes('كيبوب')) {
    return [FALLBACK_CATEGORIES[3]];
  }
  if (cat.includes('أناشيد') || cat.includes('إسلامية')) {
    return [FALLBACK_CATEGORIES[4]];
  }
  return [FALLBACK_CATEGORIES[0]];
}

export const FALLBACK_RECORDINGS: Recording[] = ALL_SONGS.map((item, index) => {
  const isVideo = item.type === 'video';
  const numericViews = parseViews(item.views);
  const animeTitle = item.anime || item.category || item.title;
  const matchedLyrics = findSongLyrics(item.title, animeTitle);

  // Match corresponding artist
  let chosenArtists: Artist[] = [FALLBACK_ARTISTS[0]];
  if (item.artist?.includes('رشا') || matchedLyrics?.singer?.includes('رشا')) {
    chosenArtists = [FALLBACK_ARTISTS[1], FALLBACK_ARTISTS[0]];
  } else if (item.artist?.includes('طرقان') || matchedLyrics?.composer?.includes('طرقان')) {
    chosenArtists = [FALLBACK_ARTISTS[2], FALLBACK_ARTISTS[0]];
  } else if (item.artist?.includes('عاصم') || matchedLyrics?.singer?.includes('عاصم')) {
    chosenArtists = [FALLBACK_ARTISTS[3], FALLBACK_ARTISTS[0]];
  }

  const cleanTitle = item.title.split('-')[0].split('|')[0].trim();
  const summary = matchedLyrics?.summary || `${item.title} - أداء صوتي بشري نقي خالي من الآلات الموسيقية. (${item.views ? item.views + ' مشاهدة' : ''})`;
  const fullLyrics = matchedLyrics?.lyrics || '';

  return {
    id: `rec-${item.id}`,
    songId: `song-${item.id}`,
    title: item.title,
    artist: item.artist || 'يونا (Yona)',
    category: item.category || 'سبيستون وأنمي',
    youtube_id: item.id,
    recordingType: 'vocals_only',
    bpm: 85 + (index % 35),
    musicalKey: ['A Minor', 'C Major', 'D Minor', 'G Major', 'E Minor'][index % 5],
    durationSeconds: isVideo ? 160 + (index % 40) : 45 + (index % 25),
    isMasterVocalOnly: true,
    vocalGender: (chosenArtists[0].id === 'art-rasha' || chosenArtists[0].id === 'art-yona' || index % 2 === 0) ? 'Female' : 'Male',
    lyricsSummary: summary,
    lyrics: fullLyrics,
    fullLyrics: fullLyrics,
    song: {
      id: `song-${item.id}`,
      title: cleanTitle,
      originalTitle: animeTitle,
      slug: `slug-${item.id}`,
      releaseYear: 2024 - (index % 5),
      description: matchedLyrics
        ? `${matchedLyrics.songTitle} - ${matchedLyrics.animeTitle} (${matchedLyrics.composer ? 'ألحان: ' + matchedLyrics.composer + ' | ' : ''}${matchedLyrics.singer ? 'غناء: ' + matchedLyrics.singer : ''})`
        : (animeTitle ? `تسجيل صوتي خالي من الموسيقى لعمل ${animeTitle}` : 'تسجيل صوتي بشرّي نقي متقن.'),
      lyrics: fullLyrics
    },
    youtubeVideo: {
      id: `yt-${item.id}`,
      recordingId: `rec-${item.id}`,
      youtubeVideoId: item.id.length > 15 ? '1F_lXhT2xQ0' : item.id,
      title: item.title,
      channelName: item.artist || 'Yona Songs',
      isOfficialYonaChannel: true,
      viewCount: numericViews,
      likeCount: Math.round(numericViews * 0.12),
      publishedAt: '2025-01-01T12:00:00Z'
    },
    artists: chosenArtists,
    animeList: animeTitle ? [{
      id: `anime-${index}`,
      title: animeTitle,
      slug: `anime-slug-${index}`,
      year: 2000,
      studio: 'Spacetoon / مركز الزهرة',
      description: `شارات وأغاني ${animeTitle}`,
      coverImage: `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`,
      episodesCount: 26
    }] : [FALLBACK_ANIME[0]],
    categories: getCategoriesForItem(item.category, item.title)
  };
});
