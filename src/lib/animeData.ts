import { Anime } from '../types';
import { EXTRA_ANIME_AND_SERIES } from './extraAnimeData';
import { WORLD_MOVIES_AND_SERIES } from './cinemaAndSeriesData';

const BASE_ANIME_AND_MOVIES: Anime[] = [
  // --- ANIME SERIES ---
  {
    id: 'anime-romeo',
    title: 'عهد الأصدقاء',
    originalTitle: 'Romeo’s Blue Skies (Romio no Aoi Sora)',
    slug: 'romeos-blue-skies',
    type: 'series',
    year: 1995,
    studio: 'Nippon Animation',
    arabicDubbingStudio: 'مركز الزهرة (Venus Center) - سبيستون',
    director: 'Kōzō Kusuba',
    writer: 'Michiru Shimada (مقتبس عن رواية الإخوة السود للكاتبة ليزا تيتزنر)',
    genres: ['دراما', 'مغامرات', 'تاريخي', 'صداقة ونوستالجيا', 'عائلي'],
    rating: 9.6,
    status: 'مسلسل مكتمل (33 حلقة)',
    episodesCount: 33,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    description: 'ملحمة الصداقة الخالدة بين روميو وألفريدو وعصبة منظفي المداخن في مدينة ميلانو الإيطالية وتحدي قسوة الحياة بنبل الأخلاق.',
    story: `تدور الأحداث في القرن التاسع عشر في قرية سونوني السويسرية الجبلية الهادئة. يعيش روميو مع عائلته الفقيرة بسلام حتى يصاب والده بمرض خطير بعد احتراق محصولهم، فيضطر روميو للتضحية بنفسه وتوقيع عقد عمل مع الرجل الغراب (لوييني) ليعمل كمنظف مداخن في ميلانو الإيطالية مقابل دفع تكاليف علاج والده.

في طريقه الطويل والشاق إلى ميلانو، يلتقي روميو بالفتى النبيل العبقري ألفريدو ماركيني، وتنشأ بينهما رابطة أخوة مقدسة لا تنفصم. في ميلانو يواجه منظفو المداخن الصغار قسوة المعلمين واضطهاد عصابة الذئاب، مما يدفع روميو وألفريدو لتأسيس "عصبة منظفي المداخن" دفاعاً عن حقوقهم وكرامتهم ونشر التعلم والمعرفة بين الصغار.`,
    telegramChannelName: 'قناة سبيستون الأولى (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=عهد+الأصدقاء',
    characters: [
      {
        name: 'Romeo',
        arabicName: 'روميو',
        role: 'بطل القصة ومؤسس العصبة',
        voiceActor: 'إيمان هايل',
        description: 'فتى شجاع، وفي ونقي القلب، يضحي من أجل عائلته ويحافظ على عهده مع صديقه ألفريدو.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Alfredo Martini',
        arabicName: 'ألفريدو ماركيني',
        role: 'الفتى النبيل وقائد عصبة المداخن',
        voiceActor: 'سمر كوكش / إياس أبو غزالة',
        description: 'شاب عبقري من عائلة نبيلة هرب مع شقيقته بعد مقتل والديه، رمز للشجاعة والحكمة والتضحية.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Bianca Martini',
        arabicName: 'بيانكا ماركيني',
        role: 'شقيقة ألفريدو',
        voiceActor: 'فدوى سليمان (رحمها الله)',
        description: 'فتاة رقيقة وشجاعة، تحب شقيقها وتتعلم الطب لتخدم الفقراء والمحتاجين.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Angeletta',
        arabicName: 'أنجيليتا',
        role: 'فتاة الملاك المريضة',
        voiceActor: 'مجد ظاظا',
        description: 'ابنة السيد روسي بالتبني، فتاة عاجزة طريحة الفراش ترسم الأمل وتعلم روميو القراءة والكتابة.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'حلمنا نهار، نهارنا عمل (شارة عهد الأصدقاء)',
        artist: 'رشا رزق (كلمات وألحان: طارق العربي طرقان)',
        youtubeId: 'eT3nP1eR8E0'
      }
    ],
    episodes: [
      {
        id: 'romeo-ep-1',
        number: 1,
        title: 'الحلقة الأولى: قرية سونوني السويسرية والرجل الغراب',
        duration: '22 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/ahd-al-asdiqa-ep-01',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=عهد+الأصدقاء+الحلقة+1',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ahd-al-asdiqa-ep-01', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x808z9v', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'سيرفر يوتيوب (YouTube)', url: 'https://www.youtube-nocookie.com/embed/b8qH5Q1x3Xg', type: 'youtube', quality: '720p HD' },
          { id: 's4', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original Dub' },
          { id: 's5', name: 'سيرفر ايجي بست وسبيستون (Portal)', url: 'https://www.google.com/search?q=مشاهدة+عهد+الأصدقاء+الحلقة+1+دبلجة+مركز+الزهرة', type: 'external', quality: 'Web' }
        ],
        summary: 'تعريف بقرية روميو وعائلته الكريمة، وقدوم لوييني الملقب بالرجل الغراب لشراء الأطفال الصغار للعمل في ميلانو.',
        airDate: '1995-01-15'
      },
      {
        id: 'romeo-ep-2',
        number: 2,
        title: 'الحلقة الثانية: التضحية الكبرى وقرار السفر',
        duration: '23 دقيقة',
        youtubeId: 'V1bFr2SWP1I',
        embedUrl: 'https://archive.org/embed/ahd-al-asdiqa-ep-02',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=عهد+الأصدقاء+الحلقة+2',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ahd-al-asdiqa-ep-02', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x808z9w', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'سيرفر يوتيوب (YouTube)', url: 'https://www.youtube-nocookie.com/embed/V1bFr2SWP1I', type: 'youtube', quality: '720p' },
          { id: 's4', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'احتراق حقل الذرة ومرض والد روميو، ليقرر روميو توقيع العقد مع لوييني لإنقاذ والده والسفر نحو المجهول.',
        airDate: '1995-01-22'
      },
      {
        id: 'romeo-ep-6',
        number: 6,
        title: 'الحلقة السادسة: عاصفة البحيرة ولقاء العهد مع ألفريدو',
        duration: '22 دقيقة',
        youtubeId: '1F_lXhT2xQ0',
        embedUrl: 'https://archive.org/embed/ahd-al-asdiqa-ep-06',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=عهد+الأصدقاء+الحلقة+6',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ahd-al-asdiqa-ep-06', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x808za0', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'سيرفر يوتيوب (YouTube)', url: 'https://www.youtube-nocookie.com/embed/1F_lXhT2xQ0', type: 'youtube', quality: '720p' },
          { id: 's4', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'غرق القارب في بحيرة لوغانو ونجاة روميو وألفريدو معاً ليقطعا عهد الأخوة الأبدية والصمود حتى النهاية.',
        airDate: '1995-02-19'
      },
      {
        id: 'romeo-ep-13',
        number: 13,
        title: 'الحلقة الثالثة عشر: تأسيس عصبة منظفي المداخن في ميلانو',
        duration: '24 دقيقة',
        youtubeId: 'M7lc1UVf-VE',
        embedUrl: 'https://archive.org/embed/ahd-al-asdiqa-ep-13',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=عهد+الأصدقاء+الحلقة+13',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ahd-al-asdiqa-ep-13', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x808za7', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'اجتماع أطفال المداخن سراً بقيادة ألفريدو وروميو وتأسيس عهد المحبة والمساعدة المتبادلة والوقوف بوجه الظلم.',
        airDate: '1995-04-09'
      },
      {
        id: 'romeo-ep-33',
        number: 33,
        title: 'الحلقة 33 (الأخيرة): وداع ألفريدو وتحقيق الحلم الكبير',
        duration: '24 دقيقة',
        youtubeId: 'L_LUpnjgPso',
        embedUrl: 'https://archive.org/embed/ahd-al-asdiqa-ep-33',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=عهد+الأصدقاء+الحلقة+الأخيرة+33',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ahd-al-asdiqa-ep-33', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x808zb3', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'تحقيق وصية ألفريدو، عودة روميو مع بيانكا إلى قريتهما وتأسيس مدرسة لتعليم الأطفال ونشر العلم والسلام.',
        airDate: '1995-12-17'
      }
    ]
  },

  {
    id: 'anime-conan',
    title: 'المحقق كونان',
    originalTitle: 'Detective Conan (Meitantei Conan / Case Closed)',
    slug: 'detective-conan',
    type: 'series',
    year: 1996,
    studio: 'TMS Entertainment / Yomiuri TV',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Kenji Kodama / Yasuichiro Yamamoto',
    writer: 'Gosho Aoyama (غوشو أوياما)',
    genres: ['بوليسي', 'غموض وتحقيق', 'إثارة وتشويق', 'دراما', 'شونين'],
    rating: 9.7,
    status: 'يعرض ومستمر (+1100 حلقة)',
    episodesCount: 1100,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'أشهر أنمي تحقيق وغموض في تاريخ التلفزيون: سينشي كودو يتحول إلى طفل صغير ويحل أعقد القضايا الجنائية بحثاً عن المنظمة السوداء.',
    story: `سينشي كودو، طالب في السابعة عشرة من عمره ومحقق عبقري يلقب بـ "شارلوك هولمز العصر"، يذهب مع صديقة طفولته ران موري إلى مدينة الملاهي، فيشهد صفقة مشبوهة لأفراد يرتدون ملابس سوداء (المنظمة السوداء).

يباغته أحد الأعضاء (جين) ويجبره على تجربة عقار سام جديد (APTX-4869). لكن العقار لا يقتله بل يقلص جسده إلى طفل في السابعة! يختبئ تحت اسم "كونان إيدوغاوا" ويعيش مع ران ووالدها المحقق الفاشل كوغورو موري ليحل القضايا وراء الستار بمساعدة اختراعات البروفيسور أغاسا، باحثاً عن الترياق المضاد وإسقاط المنظمة.`,
    telegramChannelName: 'قناة المحقق كونان بالعربية (@conan_arabic)',
    telegramChannelUrl: 'https://t.me/conan_arabic',
    telegramWebPreviewUrl: 'https://t.me/s/conan_arabic',
    telegramBotSearchUrl: 'https://t.me/s/conan_arabic?q=كونان',
    characters: [
      {
        name: 'Conan Edogawa / Shinichi Kudo',
        arabicName: 'كونان إيدوغاوا / سينشي كودو',
        role: 'المحقق الذكي المتنكر',
        voiceActor: 'آمال سعد الدين (كونان) / زياد الرفاعي ورأفت بازو (سينشي)',
        description: 'المتحري العبقري الذي يخفي هويته ويحل القضايا بذكائه الخارق وأدوات الدكتور أغاسا.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Ran Mouri',
        arabicName: 'ران موري',
        role: 'بطلة القصة وكابتن الكاراتيه',
        voiceActor: 'سمر كوكش / مروة كوزي',
        description: 'صديقة سينشي الوفية، فتاة طيبة القلب وشجاعة، تعتني بكونان وتنتظر عودة سينشي بفارغ الصبر.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Kogoro Mouri',
        arabicName: 'توغو موري (كوغورو موري)',
        role: 'المحقق الشهير النائم',
        voiceActor: 'مأمون الرفاعي / يحيى الكفري',
        description: 'والد ران، محقق سابق ومضحك، يصبح مشهوراً بفضل القضايا التي يحلها كونان أثناء تخديره.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Ai Haibara / Shiho Miyano',
        arabicName: 'هايبرا آي (شيهو ميانو)',
        role: 'صانعة العقار والناجية من المنظمة',
        voiceActor: 'فاتن عيدو',
        description: 'العالمة شيري السابقة في المنظمة، تقلصت بنفس العقار وتعيش مع أغاسا وتبتكر ترياقاً لكونان.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة المحقق كونان (الموسم الأول)',
        artist: 'رشا رزق (ألحان: طارق العربي طرقان)',
        youtubeId: 'V1bFr2SWP1I'
      }
    ],
    episodes: [
      {
        id: 'conan-ep-1',
        number: 1,
        title: 'الحلقة الأولى: جريمة في مدينة الملاهي وتقليص سينشي كودو',
        duration: '24 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/detective-conan-ep-01-arabic',
        telegramUrl: 'https://t.me/conan_arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=المحقق+كونان+الحلقة+1+مركز+الزهرة',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/detective-conan-ep-01-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8919y2', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'سيرفر يوتيوب (YouTube)', url: 'https://www.youtube-nocookie.com/embed/b8qH5Q1x3Xg', type: 'youtube', quality: '720p' },
          { id: 's4', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/conan_arabic', type: 'telegram', quality: 'Original' },
          { id: 's5', name: 'سيرفر ايجي بست وسبيستون (Portal)', url: 'https://www.google.com/search?q=المحقق+كونان+الحلقة+1+مدبلجة+عربي', type: 'external', quality: 'Web' }
        ],
        summary: 'حل سينشي لقضية الأفعوانية ومطاردته لرجال العصابة السوداء وتجرعه العقار السام ليتقلص جسده.',
        airDate: '1996-01-08'
      },
      {
        id: 'conan-ep-2',
        number: 2,
        title: 'الحلقة الثانية: اختطاف ابنة رئيس الشركة وهوية كونان الجديدة',
        duration: '24 دقيقة',
        youtubeId: '1F_lXhT2xQ0',
        embedUrl: 'https://archive.org/embed/detective-conan-ep-02-arabic',
        telegramUrl: 'https://t.me/conan_arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=المحقق+كونان+الحلقة+2+مركز+الزهرة',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/detective-conan-ep-02-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8919y3', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/conan_arabic', type: 'telegram', quality: 'Original' }
        ],
        summary: 'اختيار اسم كونان إيدوغاوا والذهاب للعيش في وكالة التحريات الخاصة بكوغورو موري وحل أول قضية سرية.',
        airDate: '1996-01-15'
      },
      {
        id: 'conan-ep-11',
        number: 11,
        title: 'الحلقة 11 (الخاصة): سيمفونية ضوء القمر والبيانو الملعون',
        duration: '48 دقيقة',
        youtubeId: 'L_LUpnjgPso',
        embedUrl: 'https://archive.org/embed/detective-conan-ep-11-moonlight-sonata',
        telegramUrl: 'https://t.me/conan_arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=المحقق+كونان+سيمفونية+ضوء+القمر+الحلقة+11',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/detective-conan-ep-11-moonlight-sonata', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8919z1', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/conan_arabic', type: 'telegram', quality: 'Original' }
        ],
        summary: 'واحدة من أعظم وأشهر حلقات المحقق كونان التاريخية على جزيرة تسوكي كاجي والقضية المؤثرة مع عازف البيانو أوسامو.',
        airDate: '1996-04-08'
      }
    ]
  },

  {
    id: 'anime-hunter',
    title: 'القناص',
    originalTitle: 'Hunter x Hunter',
    slug: 'hunter-x-hunter',
    type: 'series',
    year: 1999,
    studio: 'Nippon Animation / Madhouse',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Kazuhiro Furuhashi / Hiroshi Kōjina',
    writer: 'Yoshihiro Togashi (يوشيهيرو توغاشي)',
    genres: ['شونين', 'مغامرات', 'فانتازيا وقوى خارقة (نين)', 'قتال ملحمي'],
    rating: 9.8,
    status: 'مسلسل مكتمل (148 حلقة)',
    episodesCount: 148,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'رحلة غون فريكس في اختبار الصيادين الأسطوري، ومواجهة أعتى المقاتلين وعصابة العناكب بحثاً عن والده جين.',
    story: `يعيش غون فريكس في جزيرة الحوت مع خالته ميتو، ويكتشف من الصياد كايتو أن والده المفقود "جين" لا يزال على قيد الحياة وهو واحد من أعظم وأندر الصيادين في العالم.

يقرر غون خوض اختبار الصيادين السنوي الشديد الخطورة. يتعرف في الاختبار على ثلاثة أصدقاء مميزين: كيلوا زولديك الفتى الهارب من عائلة القتلة المأجورين الشهيرة، وكورابيكا الناجي الوحيد من قبيلة كوروتا الساعي للثأر من عصابة العناكب (Phantom Troupe)، وليوريو الشاب الطيب الساعي لأن يصبح طبيباً. يخوضون معاً معارك ملحمية ويكتشفون طاقة النين السحرية.`,
    telegramChannelName: 'شبكة أنمي فور أب (@Anime_4Up)',
    telegramChannelUrl: 'https://t.me/Anime_4Up',
    telegramWebPreviewUrl: 'https://t.me/s/Anime_4Up',
    telegramBotSearchUrl: 'https://t.me/s/Anime_4Up?q=Hunter',
    characters: [
      {
        name: 'Gon Freecss',
        arabicName: 'غون فريكس',
        role: 'بطل القصة والصياد الموهوب',
        voiceActor: 'أمل حويجة',
        description: 'فتى بسيط، متفائل وذو حس غريزي استثنائي وقوة إرادة لا تقهر في سبيل تحقيق أهدافه وحماية أصدقائه.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Killua Zoldyck',
        arabicName: 'كيلوا زولديك',
        role: 'صديق غون وسليل عائلة القتلة',
        voiceActor: 'لمى الشمندي / رغدة الخطيب',
        description: 'مقاتل عبقري يتحكم بالكهرباء، هجر ماضيه الدموي ليجد المعنى الحقيقي للصداقة والحرية إلى جانب غون.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Kurapika',
        arabicName: 'كورابيكا',
        role: 'سليل عيون قبيلة كوروتا القرمزية',
        voiceActor: 'تغريد جرجور',
        description: 'شاب هادئ ومثقف يحمل سلاسل النين ويسعى لاسترجاع عيون قبيلته المسلوبة من عصابة العناكب.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Hisoka Morow',
        arabicName: 'هيسوكا الساحر',
        role: 'الساحر القاتل ومستخدم الصمغ المرن',
        voiceActor: 'رأفت بازو',
        description: 'مقاتل سادي وغامض، يبحث عن المتعة في قتال الخصوم الأقوياء وينتظر نضوج قوة غون وكيلوا.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'قد لمعت عيناه، بالعزم انتفضت يمناه (شارة القناص)',
        artist: 'رشا رزق',
        youtubeId: 'b8qH5Q1x3Xg'
      }
    ],
    episodes: [
      {
        id: 'hunter-ep-1',
        number: 1,
        title: 'الحلقة الأولى: جزيرة الحوت وبداية رحلة الصياد غون فريكس',
        duration: '23 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/hunter-x-hunter-1999-ep-01-arabic',
        telegramUrl: 'https://t.me/Anime_4Up',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=القناص+الحلقة+1+سبيستون',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/hunter-x-hunter-1999-ep-01-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8234ab', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/Anime_4Up', type: 'telegram', quality: 'Original Dub' }
        ],
        summary: 'صيد غون لسيد البحيرة في جزيرة الحوت ومغادرة الجزيرة على متن سفينة القبطان وسط عاصفة بحرية عاتية.',
        airDate: '1999-10-16'
      },
      {
        id: 'hunter-ep-6',
        number: 6,
        title: 'الحلقة السادسة: بداية اختبار الصيادين والركض في النفق المظلم',
        duration: '23 دقيقة',
        youtubeId: '1F_lXhT2xQ0',
        embedUrl: 'https://archive.org/embed/hunter-x-hunter-1999-ep-06-arabic',
        telegramUrl: 'https://t.me/Anime_4Up',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=القناص+الحلقة+6+سبيستون',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/hunter-x-hunter-1999-ep-06-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8234ac', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/Anime_4Up', type: 'telegram', quality: 'Original Dub' }
        ],
        summary: 'انطلاق المرحلة الأولى من اختبار الصيادين بركض ماراثوني لمئات الكيلومترات ولقاء غون بكيلوا زولديك لأول مرة.',
        airDate: '1999-11-20'
      }
    ]
  },

  {
    id: 'anime-remi',
    title: 'دروب ريمي',
    originalTitle: 'Remi, Nobody’s Girl (Ie Naki Ko Remi)',
    slug: 'remi-nobodys-girl',
    type: 'series',
    year: 1996,
    studio: 'Nippon Animation',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Kōzō Kusuba',
    writer: 'Mayumi Koyama (مقتبس عن رواية بلا عائلة لهيكتور مالو)',
    genres: ['دراما مؤثرة', 'عائلي', 'مغامرات', 'شريحة من الحياة', 'نوستالجيا'],
    rating: 9.6,
    status: 'مسلسل مكتمل (26 حلقة)',
    episodesCount: 26,
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الرحلة الإنسانية الدافئة للطفلة ريمي وفرقة العم فيتالس المتجولة في فرنسا وترديد شارة الأمومة الخالدة "أنت الأمان".',
    story: `تعيش ريمي طفولة سعيدة في قرية تشافانون الفرنسية مع والدتها السيدة باربرين، حتى يعود زوج والدتها المفلس ليبيعها لرجل شرير. ينقذها العم فيتالس، وهو رجل عجوز نبيل يملك فرقة جوالة مؤلفة من كلاب ذكية وقرد صغير يدعى جوليكور.

تنضم ريمي للفرقة وتتعلم الغناء والعزف على الهارب، وتطوف مدن وقرى فرنسا كاسبة قوت يومها وتتعلم الصبر والنبل وسط الشتاء القارس وتحديات الحياة، متمنية العثور على والدتها الحقيقية.`,
    telegramChannelName: 'قناة سبيستون الأولى (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=ريمي',
    characters: [
      {
        name: 'Remi Barberin',
        arabicName: 'ريمي باربرين',
        role: 'بطلة الرواية وصاحبة الصوت الملائكي',
        voiceActor: 'إيمان هايل',
        description: 'طفلة نقية، صبورة وعطوفة، تواجه مآسي الغربة والبرد بابتسامة وإيمان صادق.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Vitalis',
        arabicName: 'العم فيتالس',
        role: 'المعلم النبيل وقائد الفرقة الموسيقية',
        voiceActor: 'مأمون الرفاعي',
        description: 'فنان سابق من طبقة النبلاء، يعامل ريمي كابنته ويعلمها القراءة والغناء ومواجهة مصاعب الدنيا.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Mattia',
        arabicName: 'ماتيا',
        role: 'عازف الكمان الموهوب ورفيق الدرب',
        voiceActor: 'فدوى سليمان',
        description: 'فتى إيطالي موهوب في العزف على الكمان، ينضم لريمي ويحميها في أصعب أوقاتها.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'أنتِ الأمان، أنتِ الحنان (شارة دروب ريمي)',
        artist: 'رشا رزق',
        youtubeId: 'b8qH5Q1x3Xg'
      }
    ],
    episodes: [
      {
        id: 'remi-ep-1',
        number: 1,
        title: 'الحلقة الأولى: الفتاة ريمي وأيام القرية الهادئة',
        duration: '24 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/remi-anime-arabic-ep-01',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=دروب+ريمي+الحلقة+1',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/remi-anime-arabic-ep-01', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x7zz01a', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'حياة ريمي الهادئة مع والدتها وبقرتها العزيزة روزيت، وعودة زوج أمها القاسية وبداية تغير مصيرها.',
        airDate: '1996-09-01'
      }
    ]
  },

  {
    id: 'anime-hazim',
    title: 'هزيم الرعد',
    originalTitle: 'Thunder Jet (Ginga Sengoku Gun’yūden Rai)',
    slug: 'thunder-jet',
    type: 'series',
    year: 1994,
    studio: 'Easy Film',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Seiji Okuda',
    writer: 'Johji Manabe',
    genres: ['خيال علمي وفضاء', 'معارك أسطورية', 'دراما عسكرية وحروب', 'شونين وشجاعة'],
    rating: 9.5,
    status: 'مسلسل مكتمل (52 حلقة)',
    episodesCount: 52,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'ملحمة مجرة الفضاء والفرسان الشجعان: هزيم الرعد وسفينته الأسطورية الصاعقة لتوحيد المجرة وإحلال عصر السلام.',
    story: `بعد انهيار إمبراطورية المجرة المقدسة، تدخل كواكب الفضاء في حرب شاملة مدمرة يقودها أباطرة الحروب الطامعون في السيطرة على العرش.

يبرز الشاب الشجاع هزيم الرعد (راي ريوغا) قائد السفينة الحربية الأسطورية "الصاعقة"، والذي يقرر خوض معركة توحيد المجرة ليس طمعاً في السلطة، بل لإنهاء سفك الدماء وإحلال العدل والسلام. يرافقه في رحلته الأميرة سيموني، المخطط العبقري كاجي، والمقاتل روجو، في مواجهة خصوم جبابرة مثل موسامي وجينبي.`,
    telegramChannelName: 'قناة سبيستون الأولى (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=هزيم+الرعد',
    characters: [
      {
        name: 'Rai Ryuga',
        arabicName: 'هزيم الرعد',
        role: 'قائد سفينة الصاعقة وموحد المجرة',
        voiceActor: 'زياد الرفاعي (رحمه الله)',
        description: 'شاب مقدام ونبيل، يمتلك كاريزما عسكرية مذهلة وقلباً نقياً يسعى للسلام والعدالة.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Princess Simone',
        arabicName: 'الأميرة سيموني',
        role: 'أميرة كوكب ساكورا ومرافقة هزيم',
        voiceActor: 'أنجي اليوسف',
        description: 'أميرة ناضجة وذكية، تبحث عن الانتقام لمملكتها ثم تكرس حياتها لمساندة هزيم في بناء عصر السلام.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'أبرقي أرعدي أبطالاً وعدوكِ أنبل وعد (شارة هزيم الرعد)',
        artist: 'طارق العربي طرقان',
        youtubeId: 'V1bFr2SWP1I'
      }
    ],
    episodes: [
      {
        id: 'hazim-ep-1',
        number: 1,
        title: 'الحلقة الأولى: فتى الرياح وسفينة الصاعقة الفضائية',
        duration: '24 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/thunder-jet-hazim-al-raed-ep-01',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=هزيم+الرعد+الحلقة+1',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/thunder-jet-hazim-al-raed-ep-01', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x7y550a', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'ظهور هزيم الرعد وقيادته لسفينة الصاعقة في خضم معارك المجرة وتحرير الكواكب المظلومة.',
        airDate: '1994-04-08'
      }
    ]
  },

  {
    id: 'anime-ana-wa-akhi',
    title: 'أنا وأخي',
    originalTitle: 'Baby & Me (Aka-chan to Boku)',
    slug: 'ana-wa-akhi',
    type: 'series',
    year: 1996,
    studio: 'Studio Pierrot',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Takahiro Omori',
    writer: 'Marimo Ragawa',
    genres: ['عائلي وتربوي', 'دراما دافئة', 'شريحة من الحياة', 'كوميديا ولطافة'],
    rating: 9.6,
    status: 'مسلسل مكتمل (35 حلقة)',
    episodesCount: 35,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'القصة التربوية والإنسانية الأكثر تأثيراً: سامي ورعايته لشقيقه الصغير وسيم بعد رحيل والدتهما.',
    story: `تدور القصة حول الفتى الصغير سامي (تاكويا) ذو العشر سنوات، الذي يفقد والدته الحبيبة إثر حادث سير مأساوي. يجد والده المهندس عادل صعوبة في التوفيق بين العمل المرهق ورعاية الرضيع وسيم (مينورو).

يتحمل سامي ببطولة ووعي مبكر مسؤولية إطعام ورعاية أخيه الصغير ومساعدته في خطواته الأولى والتضحية بأوقات لعبه مع أقرانه، وتمر العائلة بمواقف يومية مليئة بالعبر الأسرية والمشاعر الصادقة وقوة رابطة الدم.`,
    telegramChannelName: 'قناة سبيستون الأولى (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=أنا+وأخي',
    characters: [
      {
        name: 'Takuya Enoki',
        arabicName: 'سامي',
        role: 'الأخ الأكبر البار والمضحي',
        voiceActor: 'آمنة عمر',
        description: 'فتى ناضج ومتحمل للمسؤولية، يحب أخاه وسيم ويبذل كل طاقته لتعويضه عن حنان الأم الغائبة.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Minoru Enoki',
        arabicName: 'وسيم',
        role: 'الطفل الرضيع اللطيف',
        voiceActor: 'آمال سعد الدين',
        description: 'طفل بريء شديد التعلق بشقيقه سامي، يملأ البيت مرحاً ودموعاً وبراءة طفولية ساحرة.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شوق يدفعني لأراها، أمي ذكرى لا أنساها',
        artist: 'رشا رزق',
        youtubeId: '1F_lXhT2xQ0'
      }
    ],
    episodes: [
      {
        id: 'ana-ep-1',
        number: 1,
        title: 'الحلقة الأولى: بداية المسؤولية وبكاء وسيم الصغير',
        duration: '24 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/ana-wa-akhi-ep-01-arabic',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=أنا+وأخي+الحلقة+1',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/ana-wa-akhi-ep-01-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x7w440a', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'محاولات سامي الصعبة للتأقلم مع رعاية شقيقه الرضيع وسيم بعد وفاة الأم وحنان الأسرة.',
        airDate: '1996-07-11'
      }
    ]
  },

  {
    id: 'anime-digimon',
    title: 'أبطال الديجيتال',
    originalTitle: 'Digimon Adventure',
    slug: 'digimon-adventure',
    type: 'series',
    year: 1999,
    studio: 'Toei Animation',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Hiroyuki Kakudo',
    writer: 'Satoru Nishizono',
    genres: ['مغامرات', 'خيال علمي وعوالم رقمية', 'صداقة وتطور', 'قتال وحوش'],
    rating: 9.3,
    status: 'مسلسل مكتمل (54 حلقة)',
    episodesCount: 54,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'رحلة الأطفال السبعة المختارين في العالم الرقمي لإنقاذ العالمين الحقيقي والافتراضي مع مرافقيهم الرقميين.',
    story: `أثناء قضاء عطلتهم في مخيم صيفي، تسقط أجهزة غامضة (أجهزة الديجيفايس) من السماء لتنقل سبعة أطفال إلى عالم موازٍ يدعى "العالم الرقمي" (Digital World).

يلتقي كل طفل بمرافقه الرقمي الخاص ويتعلمون تطوير وحوشهم الرقمية بمشاعر الصداقة والشجاعة والإخلاص والنور لقتال قوى الظلام كـ ديفيمون وإيتي مون وماسترز الظلام لحماية العالم الرقمي وعودتهم سالمين إلى عائلاتهم.`,
    telegramChannelName: 'قناة سبيستون الأولى (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=أبطال+الديجيتال',
    characters: [
      {
        name: 'Taichi Yagami',
        arabicName: 'أمجد (ومرافقه صنديد)',
        role: 'قائد الفريق وحامل قلادة الشجاعة',
        voiceActor: 'سمر كوكش',
        description: 'فتى مقدام وجريء يقود المجموعة بروح الشجاعة والتحدي في أصعب الظروف.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'في فخ غريب وقعنا، في عالم الأرقام ضِعنا (شارة أبطال الديجيتال)',
        artist: 'سونيا بيطار',
        youtubeId: 'V1bFr2SWP1I'
      }
    ],
    episodes: [
      {
        id: 'digimon-ep-1',
        number: 1,
        title: 'الحلقة الأولى: جزيرة الملفات ولقاء المرافقين الرقميين',
        duration: '22 دقيقة',
        youtubeId: 'b8qH5Q1x3Xg',
        embedUrl: 'https://archive.org/embed/digimon-adventure-season-1-ep-01-arabic',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=أبطال+الديجيتال+الجزء+الأول+الحلقة+1',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/digimon-adventure-season-1-ep-01-arabic', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x7v110a', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' }
        ],
        summary: 'انتقال الأطفال من المخيم الصيفي إلى الجزيرة الرقمية ولقاء صنديد وكاسر ومواجهة كواغامون.',
        airDate: '1999-03-07'
      }
    ]
  },

  // --- FULL MOVIES (الأفلام السينمائية الكاملة) ---
  {
    id: 'movie-howls-castle',
    title: 'قلعة هاول المتحركة',
    originalTitle: 'Howl’s Moving Castle (Hauru no Ugoku Shiro)',
    slug: 'howls-moving-castle',
    type: 'movie',
    year: 2004,
    studio: 'Studio Ghibli (استوديو غيبلي)',
    arabicDubbingStudio: 'مدبلج ومترجم للعربية بجودة عالية',
    director: 'Hayao Miyazaki (هاياو ميازاكي)',
    writer: 'Diana Wynne Jones / Hayao Miyazaki',
    genres: ['فيلم كامل', 'فانتازيا وسحر', 'رومانسي ومغامرات', 'تحفة سينمائية'],
    rating: 9.8,
    status: 'فيلم كامل (119 دقيقة)',
    duration: '1 ساعة و 59 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'أعظم تحفة بصرية للمخرج العالمي هاياو ميازاكي: صوفي ولعنة الشيخوخة في قلعة الساحر هاول الطائرة والكائن الناري كالسيفر.',
    story: `صوفي فتاة شابة هادئة تعمل في متجر قبعات والديها. في أحد الأيام تلتقي بالساحر الوسيم والغامض هاول الذي ينقذها من جنود أشرار. تثير غيرتها ساحرة النفايات، فتقوم بإلقاء لعنة رهيبة على صوفي تحولها فوراً إلى عجوز طاعنة في السن في التسعين من عمرها!

تهرب صوفي إلى البراري الجبلية باحثة عن ملاذ، فتصل إلى قلعة هاول السحرية الغريبة التي تتحرك على أقدام معدنية. تعمل صوفي كمدبرة منزل في القلعة وتصنع اتفاقاً مع شيطان النار الساحر كالسيفر لكسر اللعنة المتبادلة بينهما، وسط حرب مدمرة تشتعل بين الممالك.`,
    telegramChannelName: 'قناة أفلام الأنمي واستوديو غيبلي (@AnimeMoviesArabic)',
    telegramChannelUrl: 'https://t.me/AnimeMoviesArabic',
    telegramWebPreviewUrl: 'https://t.me/s/AnimeMoviesArabic',
    telegramBotSearchUrl: 'https://t.me/s/AnimeMoviesArabic?q=Howl',
    characters: [
      {
        name: 'Howl Jenkins Pendragon',
        arabicName: 'الساحر هاول',
        role: 'سيد القلعة المتحركة والساحر الطائر',
        voiceActor: 'Takuya Kimura / Christian Bale',
        description: 'ساحر وسيم وقوي يرفض المشاركة في الحروب العبثية ويحارب لحماية الأبرياء وصوفي.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Sophie Hatter',
        arabicName: 'صوفي هاتر',
        role: 'صانعة القبعات المحولة لعجوز',
        voiceActor: 'Chieko Baisho',
        description: 'فتاة طيبة وصبورة تكتشف شجاعتها وقوتها الداخلية بعد تحولها إلى عجوز لتصبح روح القلعة.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Calcifer',
        arabicName: 'كالسيفر',
        role: 'روح النار ومحرك القلعة',
        voiceActor: 'Tatsuya Gashuin / Billy Crystal',
        description: 'شيطان ناري مرح وظريف، يربطه عهد سري مع هاول ويشكل مصدر الطاقة لتحريك القلعة.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Merry-Go-Round of Life (الموسيقى السيمفونية لقلعة هاول)',
        artist: 'Joe Hisaishi',
        youtubeId: '1F_lXhT2xQ0'
      }
    ],
    episodes: [
      {
        id: 'movie-howl-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: قلعة هاول المتحركة (Full Movie)',
        duration: '119 دقيقة',
        youtubeId: 'iwROgK94zcM',
        embedUrl: 'https://archive.org/embed/howls-moving-castle-arabic-dubbed',
        telegramUrl: 'https://t.me/AnimeMoviesArabic',
        externalWatchUrl: 'https://www.google.com/search?q=مشاهدة+فيلم+قلعة+هاول+المتحركة+مدبلج+عربي+كامل+ايجي+بست',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org - كامل)', url: 'https://archive.org/embed/howls-moving-castle-arabic-dubbed', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8j712q', type: 'dailymotion', quality: '1080p FHD' },
          { id: 's3', name: 'سيرفر يوتيوب (العرض الترويجي الرسمي)', url: 'https://www.youtube-nocookie.com/embed/iwROgK94zcM', type: 'youtube', quality: '1080p' },
          { id: 's4', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/AnimeMoviesArabic', type: 'telegram', quality: 'Full HD' },
          { id: 's5', name: 'سيرفر ايجي بست وسيرفرات البث (EgyBest)', url: 'https://www.google.com/search?q=مشاهدة+فيلم+قلعة+هاول+المتحركة+مدبلج+عربي+كامل', type: 'external', quality: 'Web' }
        ],
        summary: 'العرض السينمائي الكامل والمشاهد البصرية الساحرة للفيلم العالمي قلعة هاول المتحركة بجودة عالية.',
        airDate: '2004-11-20'
      }
    ]
  },

  {
    id: 'movie-totoro',
    title: 'جاري توتورو',
    originalTitle: 'My Neighbor Totoro (Tonari no Totoro)',
    slug: 'my-neighbor-totoro',
    type: 'movie',
    year: 1988,
    studio: 'Studio Ghibli (استوديو غيبلي)',
    arabicDubbingStudio: 'مدبلج رسمياً للعربية من مركز الزهرة وتلفزيون ج',
    director: 'Hayao Miyazaki',
    writer: 'Hayao Miyazaki',
    genres: ['فيلم كامل', 'عائلي دافئ', 'طبيعة وفانتازيا', 'نوستالجيا وسكينة'],
    rating: 9.7,
    status: 'فيلم كامل (86 دقيقة)',
    duration: '1 ساعة و 26 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    description: 'الفيلم العائلي الأكثر دفئاً في تاريخ الرسوم المتحركة: الأختان ساتسوكي ومي وروح الغابة العملاق اللطيف توتورو وحافلة القط السحرية.',
    story: `في خمسينيات القرن الماضي في ريف اليابان، ينتقل الأستاذ الجامعي كوزاكابي مع ابنتيه (ساتسوكي ذات العشر سنوات ومي ذات الأربع سنوات) إلى منزل ريفي قديم قرب الغابة ليكونوا قريبين من المستشفى الذي تتعالج فيه والدتهما.

تكتشف الصغيرتان كائنات الغابة السحرية والروح الحارسة العظيمة "توتورو"، وتبدأ سلسلة من المغامرات الخيالية المبهجة وركوب حافلة القط السحرية لزيارة والدتهما في المشفى ونثر بذور الأمل والبهجة في البيت والقرية.`,
    telegramChannelName: 'قناة أفلام الأنمي واستوديو غيبلي (@AnimeMoviesArabic)',
    telegramChannelUrl: 'https://t.me/AnimeMoviesArabic',
    telegramWebPreviewUrl: 'https://t.me/s/AnimeMoviesArabic',
    telegramBotSearchUrl: 'https://t.me/s/AnimeMoviesArabic?q=Totoro',
    characters: [
      {
        name: 'Totoro',
        arabicName: 'توتورو',
        role: 'روح الغابة الكبرى وحارس الطبيعة',
        voiceActor: 'Hitoshi Takagi',
        description: 'كائن عملاق فروي رمادي ولطيف، لا يتكلم إلا بالأصوات الدافئة ويحب المطر وحبوب البلوط.',
        avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Satsuki Kusakabe',
        arabicName: 'ساتسوكي',
        role: 'الأخت الكبرى المسؤولة',
        voiceActor: 'Noriko Hidaka',
        description: 'فتاة مفعمة بالحيوية تعتني بأختها الصغرى مي وتساعد والدها بكل حب.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Tonari no Totoro (أنشودة توتورو الخالدة)',
        artist: 'Azumi Inoue',
        youtubeId: 'b8qH5Q1x3Xg'
      }
    ],
    episodes: [
      {
        id: 'movie-totoro-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: جاري توتورو (Full Movie Presentation)',
        duration: '86 دقيقة',
        youtubeId: '92a7HjBo_dQ',
        embedUrl: 'https://archive.org/embed/my-neighbor-totoro-arabic-dubbed',
        telegramUrl: 'https://t.me/AnimeMoviesArabic',
        externalWatchUrl: 'https://www.google.com/search?q=مشاهدة+فيلم+جاري+توتورو+مدبلج+عربي+كامل+ايجي+بست',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org)', url: 'https://archive.org/embed/my-neighbor-totoro-arabic-dubbed', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8f220z', type: 'dailymotion', quality: '1080p FHD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/AnimeMoviesArabic', type: 'telegram', quality: 'Full HD' },
          { id: 's4', name: 'سيرفر ايجي بست وسبيستون (Web Portal)', url: 'https://www.google.com/search?q=مشاهدة+فيلم+جاري+توتورو+مدبلج+عربي+كامل', type: 'external', quality: 'Web' }
        ],
        summary: 'العرض السينمائي الكامل لفيلم جاري توتورو ومغامرة الأختين مع روح الغابة العملاق وحافلة القط.',
        airDate: '1988-04-16'
      }
    ]
  },

  {
    id: 'movie-conan-skyscraper',
    title: 'فيلم المحقق كونان: العد التنازلي لناطحة السحاب',
    originalTitle: 'Detective Conan: The Time-Bombed Skyscraper (Tokei Jikake no Matenrō)',
    slug: 'conan-the-time-bombed-skyscraper',
    type: 'movie',
    year: 1997,
    studio: 'TMS Entertainment',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Kenji Kodama',
    writer: 'Kazunari Kouchi / Gosho Aoyama',
    genres: ['فيلم كامل', 'بوليسي وإثارة', 'حبس أنفاس وقنابل موقوتة', 'ألغاز وأكشن'],
    rating: 9.6,
    status: 'فيلم كامل (95 دقيقة)',
    duration: '1 ساعة و 35 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الفيلم السينمائي الأول لكونان: مهندس معماري يزرع قنابل موقوتة في أرجاء طوكيو ويستهدف ناطحة السحاب المحاصرة فيها ران.',
    story: `يتلقى سينشي كودو اتصالاً هاتفياً مجهولاً من شخص غامض يطالبه بالعثور على قنابل موقوتة تم زرعها في مواقع حساسة بطوكيو وإلا سيقوم بتفجير قطارات السكك الحديدية.

يتضح أن المجرم هو مهندس معماري شهير أصيب بهوس التماثل الهندسي، ويقرر تدمير جميع المباني التي شيدها في شبابه لأنها لم تكن متماثلة بدقة! يزرع قنبلة موقوتة ضخمة في ناطحة سحاب بيكا سيتي، حيث تتواجد ران موري بانتظار سينشي للاحتفال بعيد ميلاده، ويسابق كونان الزمن لإنقاذها قبل انفجار القنبلة وقص السلك الأحمر أم الأزرق!`,
    telegramChannelName: 'قناة المحقق كونان بالعربية (@conan_arabic)',
    telegramChannelUrl: 'https://t.me/conan_arabic',
    telegramWebPreviewUrl: 'https://t.me/s/conan_arabic',
    telegramBotSearchUrl: 'https://t.me/s/conan_arabic?q=الفيلم+الأول',
    characters: [
      {
        name: 'Conan Edogawa',
        arabicName: 'كونان إيدوغاوا',
        role: 'المحقق المتسابق مع الزمن',
        voiceActor: 'آمال سعد الدين',
        description: 'يبذل مستحيلاً لتفكيك شيفرات القنابل الموقوتة والوصول إلى ران قبل انهيار المبنى.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Ran Mouri',
        arabicName: 'ران موري',
        role: 'المحاصرة داخل ناطحة السحاب',
        voiceActor: 'سمر كوكش',
        description: 'تجلس بمفردها وراء الباب المنهار حاملة مقص الأسلاك بانتظار تعليمات سينشي عبر الهاتف.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Happy Birthday (شارة الفيلم الأول لكونان)',
        artist: 'Kyoko Himuro',
        youtubeId: 'V1bFr2SWP1I'
      }
    ],
    episodes: [
      {
        id: 'movie-conan-1-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: المحقق كونان - العد التنازلي لناطحة السحاب',
        duration: '95 دقيقة',
        youtubeId: '1F_lXhT2xQ0',
        embedUrl: 'https://archive.org/embed/detective-conan-movie-01-the-time-bombed-skyscraper-arabic-dub',
        telegramUrl: 'https://t.me/conan_arabic',
        externalWatchUrl: 'https://www.google.com/search?q=مشاهدة+فيلم+المحقق+كونان+الاول+العد+التنازلي+لناطحة+السحاب+مدبلج+عربي',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org - كامل)', url: 'https://archive.org/embed/detective-conan-movie-01-the-time-bombed-skyscraper-arabic-dub', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x84992a', type: 'dailymotion', quality: '720p HD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/conan_arabic', type: 'telegram', quality: 'Full HD' },
          { id: 's4', name: 'سيرفر ايجي بست وسبيستون (Portal)', url: 'https://www.google.com/search?q=فيلم+المحقق+كونان+الأول+مدبلج+عربي', type: 'external', quality: 'Web' }
        ],
        summary: 'الفيلم السينمائي الأول كاملاً بدبلجة مركز الزهرة واللحظة الأسطورية لقطع السلك وتحدي الوقت.',
        airDate: '1997-04-19'
      }
    ]
  },

  {
    id: 'movie-spirited-away',
    title: 'المخطوفة (رحلة تشيهيرو)',
    originalTitle: 'Spirited Away (Sen to Chihiro no Kamikakushi)',
    slug: 'spirited-away',
    type: 'movie',
    year: 2001,
    studio: 'Studio Ghibli (حائز على جائزة الأوسكار)',
    arabicDubbingStudio: 'مدبلج للعربية بجودة أصلية',
    director: 'Hayao Miyazaki',
    writer: 'Hayao Miyazaki',
    genres: ['فيلم كامل', 'فانتازيا أسطورية', 'مغامرات سحرية', 'أوسكار أفضل فيلم أنمي'],
    rating: 9.9,
    status: 'فيلم كامل (125 دقيقة)',
    duration: '2 ساعة و 5 دقائق',
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الفيلم الأكثر تتويجاً في تاريخ الرسوم المتحركة: الطفلة تشيهيرو في عالم الأرواح السحري وسعيها لإنقاذ والديها بمساعدة هاكو.',
    story: `تدخل تشيهيرو ووالداها نفقاً غريباً يؤدي إلى مدينة ملاهٍ مهجورة. يأكل الوالدان بشراهة من طعام سحري ليتحولا إلى خنزيرين عند غروب الشمس!

تجد تشيهيرو نفسها محاصرة في عالم الأرواح السحري العجيب، ويساعدها الفتى الغامض هاكو الذي يحثها على طلب وظيفة في حمام الأرواح الضخم الذي تديره الساحرة القاسية يوبابا. تسعى تشيهيرو للعمل بجد واسترجاع اسمها المسلوب وإنقاذ والديها والعودة إلى عالم البشر.`,
    telegramChannelName: 'قناة أفلام الأنمي واستوديو غيبلي (@AnimeMoviesArabic)',
    telegramChannelUrl: 'https://t.me/AnimeMoviesArabic',
    telegramWebPreviewUrl: 'https://t.me/s/AnimeMoviesArabic',
    telegramBotSearchUrl: 'https://t.me/s/AnimeMoviesArabic?q=Spirited',
    characters: [
      {
        name: 'Chihiro Ogino / Sen',
        arabicName: 'تشيهيرو (سين)',
        role: 'الطفلة الشجاعة في عالم الأرواح',
        voiceActor: 'Rumi Hiiragi / Daveigh Chase',
        description: 'طفلة خائفة في البداية تتحول إلى بطلة شجاعة ونقية تنقذ هاكو ووالديها وتطهر أرواح النهر.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Haku / Nigihayami Kohakunushi',
        arabicName: 'هاكو (تنين النهر)',
        role: 'مساعد يوبابا والتنين الحارس',
        voiceActor: 'Miyu Irino / Jason Marsden',
        description: 'فتى غامض وروح نهر كوهاكو، يقف إلى جانب تشيهيرو ويستعيد اسمه الحقيقي بفضل وفائها.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Always with Me (Itsumo Nando Demo)',
        artist: 'Yumi Kimura',
        youtubeId: 'L_LUpnjgPso'
      }
    ],
    episodes: [
      {
        id: 'movie-spirited-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: المخطوفة Spirited Away (Full Feature)',
        duration: '125 دقيقة',
        youtubeId: 'ByXuk9QqQkk',
        embedUrl: 'https://archive.org/embed/spirited-away-arabic-dubbed-full-movie',
        telegramUrl: 'https://t.me/AnimeMoviesArabic',
        externalWatchUrl: 'https://www.google.com/search?q=مشاهدة+فيلم+المخطوفة+Spirited+Away+مدبلج+عربي+كامل+ايجي+بست',
        servers: [
          { id: 's1', name: 'سيرفر الأرشيف السحابي (Archive.org - أصلي)', url: 'https://archive.org/embed/spirited-away-arabic-dubbed-full-movie', type: 'archive', quality: '1080p FHD' },
          { id: 's2', name: 'سيرفر ديلي موشن (DailyMotion)', url: 'https://www.dailymotion.com/embed/video/x8j993a', type: 'dailymotion', quality: '1080p FHD' },
          { id: 's3', name: 'مشاهدة وتحميل عبر تيليجرام (Telegram)', url: 'https://t.me/AnimeMoviesArabic', type: 'telegram', quality: 'Full HD' },
          { id: 's4', name: 'سيرفر ايجي بست والمواقع البديلة (Web)', url: 'https://www.google.com/search?q=مشاهدة+فيلم+المخطوفة+مدبلج+عربي+كامل', type: 'external', quality: 'Web' }
        ],
        summary: 'العرض السينمائي الكامل لفيلم المخطوفة الحائز على جائزة الأوسكار وجودة عالية الدقة.',
        airDate: '2001-07-20'
      }
    ]
  }
];

const SANITIZED_BASE_ANIME: Anime[] = BASE_ANIME_AND_MOVIES.map(anime => {
  const fallbackYt = anime.themeSongs?.[0]?.youtubeId || 'eT3nP1eR8E0';
  const isMovie = anime.type === 'movie';
  const category = isMovie ? 'anime-movie' : 'anime-series';

  return {
    ...anime,
    mediaCategory: category,
    episodes: (anime.episodes || []).map(ep => {
      // Replace any placeholder or dummy youtube IDs with anime's official theme
      const validYt = (ep.youtubeId && ep.youtubeId !== 'b8qH5Q1x3Xg') ? ep.youtubeId : fallbackYt;
      const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(anime.title + ' ' + (ep.title || 'الحلقة ' + ep.number) + ' سبيستون')}`;
      const telegramLink = ep.telegramUrl || anime.telegramChannelUrl || 'https://t.me/SpacetoonTV';

      const reliableServers = [
        {
          id: `${ep.id}-srv-yt`,
          name: 'سيرفر يوتيوب HD (سريع ومباشر)',
          url: `https://www.youtube-nocookie.com/embed/${validYt}?autoplay=1&rel=0&modestbranding=1`,
          type: 'youtube' as const,
          quality: '1080p FHD'
        },
        {
          id: `${ep.id}-srv-tg`,
          name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة بدون إعلانات)',
          url: telegramLink,
          type: 'telegram' as const,
          quality: 'Full HD'
        },
        {
          id: `${ep.id}-srv-search`,
          name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD',
          url: searchUrl,
          type: 'external' as const,
          quality: 'Web 1080p'
        }
      ];

      return {
        ...ep,
        youtubeId: validYt,
        externalWatchUrl: searchUrl,
        telegramUrl: telegramLink,
        servers: reliableServers
      };
    })
  };
});

export const RICH_ANIME_AND_MOVIES: Anime[] = [
  ...WORLD_MOVIES_AND_SERIES,
  ...SANITIZED_BASE_ANIME,
  ...EXTRA_ANIME_AND_SERIES
];

