import { Anime } from '../types';

export const EXTRA_ANIME_AND_SERIES: Anime[] = [
  // 1. دراغون بول زد
  {
    id: 'anime-dragon-ball-z',
    title: 'دراغون بول زد (Dragon Ball Z)',
    originalTitle: 'Dragon Ball Z (Doragon Bōru Zetto)',
    slug: 'dragon-ball-z',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 1989,
    studio: 'Toei Animation',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Daisuke Nishio',
    writer: 'Akira Toriyama (أكيرا تورياما)',
    genres: ['أكشن خارق', 'شونين', 'قتال ومغامرات', 'خيال علمي', 'فنون قتالية'],
    rating: 9.8,
    status: 'سلسلة مكتملة (291 حلقة)',
    episodesCount: 291,
    coverImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    description: 'ملحمة غوكو ومحاربي الزد للدفاع عن كوكب الأرض والكون ضد غزاة الفضاء والأشرار، من ملحمة السايان وفريزا إلى سيل وماجين بو.',
    story: `تبدأ الأحداث بعد خمس سنوات من زواج سون غوكو وإنجابه لابنه غوهان، عندما يصل راديتز غازياً من الفضاء كاشفاً حقيقة غوكو بأنه من سلالة السايان الفضائية المقاتلة.
تتوالى المعارك الطاحنة مع أمير السايان فيجيتا، ثم الرحلة الأسطورية إلى كوكب ناميك لمواجهة الطاغية فريزا حيث يتحول غوكو إلى السوبر سايان الأسطوري لأول مرة.`,
    telegramChannelName: 'قناة دراغون بول بالعربية (@DragonBall_Ar)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    telegramBotSearchUrl: 'https://t.me/s/SpacetoonTV?q=dragonball',
    characters: [
      {
        name: 'Son Goku',
        arabicName: 'سون غوكو',
        role: 'البطل السايان الأسطوري وحامي الأرض',
        voiceActor: 'رأفت بازو / مأمون الرفاعي',
        description: 'مقاتل ذو قلب نقي يسعى دوماً لتجاوز حدوده والدفاع عن أصدقائه وكوكب الأرض.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Vegeta',
        arabicName: 'فيجيتا',
        role: 'أمير السايان الفخور ومنافس غوكو',
        voiceActor: 'عادل أبو حسون / مروان فرحات',
        description: 'أمير مقاتلي السايان، يتسم بالكبرياء والشجاعة ويتحول لحليف عظيم للأرض.',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة دراغون بول (أقبلت تدعو إلينا كوكب المغامرة)',
        artist: 'طارق العربي طرقان / رشا رزق',
        youtubeId: 'b6v_5z9xR_k'
      }
    ],
    episodes: [
      {
        id: 'dbz-ep-01',
        number: 1,
        title: 'الحلقة 1: ظهور راديتز وسر أصل غوكو السايان',
        duration: '24 دقيقة',
        youtubeId: 'GHnfX1RmZX8',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=دراغون+بول+زد+سبيستون+الحلقة+1+كاملة',
        servers: [
          { id: 'dbz-s1', name: 'سيرفر يوتيوب HD (العرض الرسمي)', url: 'https://www.youtube-nocookie.com/embed/GHnfX1RmZX8?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'dbz-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة فوراً)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'dbz-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=دراغون+بول+زد+سبيستون+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'هبوط مركبة فضائية غامضة يخرج منها المقاتل راديتز كاشفاً سر غوكو وماضيه ومختطفاً ابنه غوهان.',
        airDate: '1989-04-26'
      }
    ]
  },

  // 2. ون بيس
  {
    id: 'anime-one-piece',
    title: 'ون بيس (One Piece)',
    originalTitle: 'One Piece (Wan Pīsu)',
    slug: 'one-piece',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 1999,
    studio: 'Toei Animation',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Kônosuke Uda',
    writer: 'Eiichiro Oda (إييتشيرو أودا)',
    genres: ['شونين ملحمي', 'قراصنة ومغامرات', 'كوميديا وخيال', 'أعظم قصة أنمي'],
    rating: 9.9,
    status: 'سلسلة أسطورية مستمرة (+1100 حلقة)',
    episodesCount: 1100,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'رحلة مونكي دي لوفي ليصبح ملك القراصنة بالعثور على الكنز الأسطوري ون بيس برفقة طاقم قبعة القش عبر الغراند لاين.',
    story: `أطلق ملك القراصنة غول دي روجر قبل إعدامه كلماته الخالدة معلناً أن كنزه الأعظم "ون بيس" متروك في مكان ما من هذا العالم لمن يستطيع الوصول إليه.
ينطلق الفتى المطاطي لوفي في البحر باحثاً عن طاقم استثنائي ليجوبوا البحار السبعة.`,
    telegramChannelName: 'قناة ون بيس الرسمية (@OnePiece_Ar)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Monkey D. Luffy',
        arabicName: 'مونكي دي لوفي',
        role: 'قائد قراصنة قبعة القش وصاحب الإرادة الحديدية',
        voiceActor: 'Mayumi Tanaka / زياد الرفاعي',
        description: 'شاب شجاع تناول فاكهة غومو غومو نو مي ويحلم بأن يصبح ملك القراصنة بحرية مطلقة.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة ون بيس سبيستون (في الفضاء البعيد خيالي)',
        artist: 'رشا رزق',
        youtubeId: 'S8_YwFLCh4U'
      }
    ],
    episodes: [
      {
        id: 'op-ep-01',
        number: 1,
        title: 'الحلقة 1: أنا لوفي! الرجل الذي سيصبح ملك القراصنة!',
        duration: '24 دقيقة',
        youtubeId: 'S8_YwFLCh4U',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=ون+بيس+سبيستون+الحلقة+1+كاملة',
        servers: [
          { id: 'op-s1', name: 'سيرفر يوتيوب HD (العرض الرسمي)', url: 'https://www.youtube-nocookie.com/embed/S8_YwFLCh4U?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'op-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'op-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=ون+بيس+سبيستون+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'ظهور لوفي من برميل خشبي وإنقاذه لكوبي ومواجهة القرصانة ألفيدا.',
        airDate: '1999-10-20'
      }
    ]
  },

  // 3. ناروتو شيبودن
  {
    id: 'anime-naruto',
    title: 'ناروتو شيبودن (Naruto Shippuden)',
    originalTitle: 'Naruto Shippūden (طريق النينجا)',
    slug: 'naruto-shippuden',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 2007,
    studio: 'Studio Pierrot',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Hayato Date',
    writer: 'Masashi Kishimoto (ماساشي كيشيموتو)',
    genres: ['نينجا وشونين', 'فنون قتالية وسحر تشاكرا', 'دراما وصداقة', 'أسطورة الأنمي'],
    rating: 9.8,
    status: 'سلسلة مكتملة (500 حلقة)',
    episodesCount: 500,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'عودة ناروتو أوزوماكي إلى قرية كونوها بعد عامين ونصف من التدريب القاسي لحماية القرية واستعادة صديقه ساسكي من قبضة أوروتشيمارو ومواجهة منظمة الأكاتسكي الغامضة.',
    story: `يعود ناروتو شاباً أقوى وأكثر عزيمة، ليكتشف أن منظمة الأكاتسكي بدأت في اصطياد وحوش البيجو ذوي الذيول التسعة.
يخوض ناروتو معارك طاحنة من أجل السلام وإنقاذ العالم النينجا وتحقيق حلمه في أن يصبح الهوكاغي.`,
    telegramChannelName: 'قناة ناروتو بالعربية (@Naruto_Arabic)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Naruto Uzumaki',
        arabicName: 'ناروتو أوزوماكي',
        role: 'جينشوريكي الكيوبي وبطل كونوها',
        voiceActor: 'إياس أبو غزالة',
        description: 'نينجا لا يستسلم أبداً، سلاحه طريق النينجا الخاص به والوفاء لأصدقائه.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'Blue Bird & شارة ناروتو شيبودن الرسمية',
        artist: 'Ikimono-gakari',
        youtubeId: '1dmVICnca88'
      }
    ],
    episodes: [
      {
        id: 'naruto-ep-01',
        number: 1,
        title: 'الحلقة 1: العودة إلى الوطن (اللقاء في كونوها بعد غياب)',
        duration: '24 دقيقة',
        youtubeId: '1dmVICnca88',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=ناروتو+شيبودن+الحلقة+1+كاملة+مترجمة',
        servers: [
          { id: 'nar-s1', name: 'سيرفر يوتيوب HD (العرض الرسمي)', url: 'https://www.youtube-nocookie.com/embed/1dmVICnca88?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'nar-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'nar-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=ناروتو+شيبودن+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'عودة ناروتو برفقة جيرايا إلى كونوها ولقاء ساكورا وكاكاشي وبداية اختبار الأجراس الجديد.',
        airDate: '2007-02-15'
      }
    ]
  },

  // 4. سلام دانك
  {
    id: 'anime-slam-dunk',
    title: 'سلام دانك (Slam Dunk)',
    originalTitle: 'Slam Dunk (Suramu Danku)',
    slug: 'slam-dunk',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 1993,
    studio: 'Toei Animation',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Nobutaka Nishizawa',
    writer: 'Takehiko Inoue (تاكيهيكو إينوي)',
    genres: ['رياضة وكرة سلة', 'كوميديا مدرسية', 'حماس وعزيمة', 'كلاسيكيات سبيستون'],
    rating: 9.7,
    status: 'سلسلة مكتملة (101 حلقة)',
    episodesCount: 101,
    coverImage: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'قصة حسان الفتى المشاغب الذي ينضم لفريق مدرسة الصقور لكرة السلة من أجل إثارة إعجاب ميسون، ليتحول إلى لاعب عبقري ومقاتل حقيقي في البطولة الوطنية.',
    story: `يدخل حسان (هاناميتشي ساكوراغي) ثانوية الصقور بسجل حافل من المشاجرات، لكن شغفه بكرة السلة يولد حين يرى سحر اللعبة تحت قيادة الكابتن سعد ومنافسه البارد فادي.`,
    telegramChannelName: 'قناة سلام دانك بالعربية (@SlamDunk_Ar)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Hanamichi Sakuragi',
        arabicName: 'حسان (العبقري المتمرد)',
        role: 'لاعب الارتكاز وبطل المرتدات',
        voiceActor: 'مروان فرحات',
        description: 'الفتى الموهوب ذو الشعر الأحمر صاحب الطاقة المتفجرة وحركات السلام دانك.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة سلام دانك (أكون أو لا أكون، أنا اللاعب الموهوب)',
        artist: 'طارق العربي طرقان',
        youtubeId: '6vQp8gq9jQE'
      }
    ],
    episodes: [
      {
        id: 'sd-ep-01',
        number: 1,
        title: 'الحلقة 1: ولادة العبقري حسان وانضمامه لفريق الصقور',
        duration: '23 دقيقة',
        youtubeId: '6vQp8gq9jQE',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=سلام+دانك+سبيستون+الحلقة+1+كاملة',
        servers: [
          { id: 'sd-s1', name: 'سيرفر يوتيوب HD (العرض والشارة الرسمية)', url: 'https://www.youtube-nocookie.com/embed/6vQp8gq9jQE?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'sd-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'sd-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=سلام+دانك+سبيستون+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'لقاء حسان مع ميسون في صالة الألعاب الرياضية وتحديه الأول للكابتن سعد.',
        airDate: '1993-10-16'
      }
    ]
  },

  // 5. الكابتن ماجد
  {
    id: 'anime-captain-tsubasa',
    title: 'الكابتن ماجد (Captain Tsubasa)',
    originalTitle: 'Captain Tsubasa (Kyaputen Tsubasa)',
    slug: 'captain-tsubasa',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 1983,
    studio: 'Tsuchida Production / David Production',
    arabicDubbingStudio: 'مركز الزهرة (سبيستون)',
    director: 'Hiroyoshi Mitsunobu',
    writer: 'Yōichi Takahashi (يويتشي تاكاهاشي)',
    genres: ['كرة قدم ورياضة', 'ضربات خارقة وأساطير', 'طموح وصداقة', 'ذكريات الطفولة'],
    rating: 9.6,
    status: 'سلسلة أسطورية مكتملة (128 حلقة)',
    episodesCount: 128,
    coverImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'أسطورة كرة القدم: الفتى ماجد كامل الذي يعتبر الكرة صديقته الوفية، يقود فريق المجد في مباريات بطولية ضد بسام ووليد وياسين للوصول لكأس العالم.',
    story: `ينتقل ماجد إلى بلدة جديدة ويصادق وليد حارس المرمى العملاق، ويتدرب تحت إشراف النجم البرازيلي فواز ليطور ركلة الصقر الأسطورية ويوحد الملاعب في ملحمة رياضية خالدة.`,
    telegramChannelName: 'قناة الكابتن ماجد (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Tsubasa Oozora',
        arabicName: 'الكابتن ماجد كامل',
        role: 'صانع الألعاب ونجم فريق المجد',
        voiceActor: 'أمل حويجة / سهير فهد',
        description: 'صاحب الشغف اللامحدود وركلة الصقر الشهيرة، يعتبر كرة القدم صديقته المخلصة.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة الكابتن ماجد الجزء الأول (سجل أهدافاً لا تيأس)',
        artist: 'طارق العربي طرقان',
        youtubeId: 'C9U5V81N4e4'
      }
    ],
    episodes: [
      {
        id: 'tsubasa-ep-01',
        number: 1,
        title: 'الحلقة 1: الكرة صديقتي! لقاء ماجد والحارس وليد',
        duration: '24 دقيقة',
        youtubeId: 'C9U5V81N4e4',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=الكابتن+ماجد+الجزء+الاول+سبيستون+الحلقة+1',
        servers: [
          { id: 'tsu-s1', name: 'سيرفر يوتيوب HD (العرض والشارة الرسمية)', url: 'https://www.youtube-nocookie.com/embed/C9U5V81N4e4?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'tsu-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'tsu-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=الكابتن+ماجد+الجزء+الاول+سبيستون+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'تحدي ماجد الأول لوليد وتسديدته الخارقة من فوق تلة البلدة لتستقر بين يدي وليد.',
        airDate: '1983-10-10'
      }
    ]
  },

  // 6. سالي
  {
    id: 'anime-princess-sarah',
    title: 'سالي (Princess Sarah)',
    originalTitle: 'Princess Sarah (Shōkōjo Sēra)',
    slug: 'princess-sarah',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 1985,
    studio: 'Nippon Animation',
    arabicDubbingStudio: 'المركز العربي للخدمات السمعية والبصرية',
    director: 'Fumio Kurokawa',
    writer: 'Frances Hodgson Burnett (فرانسيس هودسون برنيت)',
    genres: ['دراما إنسانية مؤثرة', 'صبر وأخلاق نبيلة', 'كلاسيكيات عالمية', 'مأساة وأمل'],
    rating: 9.8,
    status: 'سلسلة مكتملة (46 حلقة)',
    episodesCount: 46,
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'قصة سالي كرو، الفتاة الرقيقة والثرية التي تفقد والدها وثروته لتتحول إلى خادمة في مدرسة الآنسة منشن، لكنها تحتفظ بنبل أخلاقها ورقتها حتى تبتسم لها الحياة من جديد.',
    story: `تصل سالي من الهند إلى لندن لتلتحق بمعهد الآنسة منشن، وتحظى بمعاملة الأميرة بفضل ثراء والدها، لكن وفاة والدها وإفلاسه يحول حياتها لجحيم من القسوة، لتقابل المعاناة بصبر نادر وإحسان للجميع.`,
    telegramChannelName: 'قناة كرتون سبيستون القديم (@SpacetoonTV)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Sarah Crewe',
        arabicName: 'سالي كرو',
        role: 'الأميرة الصغيرة ورمز الصبر والنبل',
        voiceActor: 'إيمان هايل',
        description: 'فتاة طيبة القلب تعامل الجميع بلطف مهما قست عليها الظروف والآنسة منشن.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة سالي (أنا قصة إنسان، أنا جرح الزمان)',
        artist: 'سهير فهد',
        youtubeId: 'GZc3b77vW5k'
      }
    ],
    episodes: [
      {
        id: 'sarah-ep-01',
        number: 1,
        title: 'الحلقة 1: الوصول إلى مدرسة الآنسة منشن في لندن',
        duration: '24 دقيقة',
        youtubeId: 'GZc3b77vW5k',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=سالي+الحلقة+1+كاملة+النسخة+الأصلية',
        servers: [
          { id: 'sar-s1', name: 'سيرفر يوتيوب HD (الشارة والعرض الرسمي)', url: 'https://www.youtube-nocookie.com/embed/GZc3b77vW5k?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'sar-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'sar-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=سالي+الحلقة+1+كاملة+مدبلج+عربي', type: 'external', quality: 'Web HD' }
        ],
        summary: 'وصول سالي مع والدها كابتن كرو إلى لندن وشراء الدمية إميلي وبدء دراستها في المعهد.',
        airDate: '1985-01-06'
      }
    ]
  },

  // 7. هجوم العمالقة
  {
    id: 'anime-attack-on-titan',
    title: 'هجوم العمالقة (Attack on Titan)',
    originalTitle: 'Shingeki no Kyojin',
    slug: 'attack-on-titan',
    type: 'series',
    mediaCategory: 'anime-series',
    year: 2013,
    studio: 'WIT Studio / MAPPA',
    arabicDubbingStudio: 'مترجم رسمي عالي الدقة',
    director: 'Tetsurō Araki',
    writer: 'Hajime Isayama (هاجيمي إيساياما)',
    genres: ['أكشن وظلامي', 'عمالقة ورعب نفسي', 'حروب وألغاز فلسفية', 'تحفة العصر'],
    rating: 9.9,
    status: 'سلسلة مكتملة أسطورية (89 حلقة)',
    episodesCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'بعد اختراق العملاق الضخم لجدار ماريا، يقسم إيرين ييغر على إبادة جميع العمالقة، ليكتشف أسرار العالم الخارجي والحرية وصراع الإلديان والمارلي.',
    story: `يعيش ما تبقى من البشرية خلف ثلاثة أسوار ضخمة تحميهم من العمالقة المفترسين، حتى ينهار جدار ماريا فجأة، وتنقلب حياة إيرين وميكاسا وأرمين للأبد.`,
    telegramChannelName: 'قناة هجوم العمالقة (@AOT_Ar)',
    telegramChannelUrl: 'https://t.me/kkjsiixhhh',
    telegramWebPreviewUrl: 'https://t.me/s/kkjsiixhhh',
    characters: [
      {
        name: 'Eren Yeager',
        arabicName: 'إيرين ييغر',
        role: 'حامل العملاق المهاجم وعملاق المؤسس',
        voiceActor: 'Yūki Kaji',
        description: 'المقاتل الذي يضحي بكل شيء في سبيل الوصول للحرية المطلقة.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'Guren no Yumiya (شارة هجوم العمالقة الأسطورية)',
        artist: 'Linked Horizon',
        youtubeId: 'MGRm4IzK1SQ'
      }
    ],
    episodes: [
      {
        id: 'aot-ep-01',
        number: 1,
        title: 'الحلقة 1: إليك بعد ألفي عام: سقوط شيغانشينا',
        duration: '24 دقيقة',
        youtubeId: 'MGRm4IzK1SQ',
        telegramUrl: 'https://t.me/kkjsiixhhh',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=هجوم+العمالقة+الموسم+الاول+الحلقة+1+مترجم',
        servers: [
          { id: 'aot-s1', name: 'سيرفر يوتيوب HD (Official Trailer & Intro)', url: 'https://www.youtube-nocookie.com/embed/MGRm4IzK1SQ?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'aot-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/kkjsiixhhh', type: 'telegram', quality: 'Original' },
          { id: 'aot-s3', name: 'سيرفر البحث والمشاهدة للحلقة كاملة HD', url: 'https://www.youtube.com/results?search_query=هجوم+العمالقة+الموسم+الاول+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'ظهور العملاق الهائل واختراق السور وهروب إيرين وميكاسا بعد مأساة والدتهما.',
        airDate: '2013-04-07'
      }
    ]
  },

  // 8. فيلم قبر اليراعات (استوديو غيبلي)
  {
    id: 'movie-grave-of-fireflies',
    title: 'قبر اليراعات (Grave of the Fireflies)',
    originalTitle: 'Grave of the Fireflies (Hotaru no Haka)',
    slug: 'grave-of-the-fireflies',
    type: 'movie',
    mediaCategory: 'anime-movie',
    year: 1988,
    studio: 'Studio Ghibli',
    arabicDubbingStudio: 'دبلجة وترجمة احترافية كاملة',
    director: 'Isao Takahata (إيساو تاكاهاتا)',
    writer: 'Akiyuki Nosaka',
    genres: ['دراما إنسانية مؤثرة', 'تاريخي وحروب', 'استوديو غيبلي', 'تحفة سينمائية'],
    rating: 9.9,
    status: 'فيلم سينمائي كامل (89 دقيقة)',
    episodesCount: 1,
    duration: '89 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    description: 'الفيلم الأكثر تأثيراً وإنسانية في تاريخ السينما العالمية: الشقيقان سيتا وسيتسوكو وصراعهما للبقاء على قيد الحياة برقة وحب في ظل مآسي الحرب في اليابان.',
    story: `تدور أحداث التحفة السينمائية لاستوديو غيبلي في مدينة كوبي خلال الأشهر الأخيرة من الحرب العالمية الثانية.
يفقد الصبي سيتا وشقيقته الصغيرة سيتسوكو والدتهما ومنزلهما، فيلجآن إلى ملجأ مهجور بجانب بركة مليئة باليراعات المضيئة، حيث يحاول سيتا حماية براءة شقيقته وسعادتها وسط قسوة العالم.`,
    telegramChannelName: 'قناة أومينيتشي لأفلام الأنمي (@ominichi)',
    telegramChannelUrl: 'https://t.me/SpacetoonTV',
    telegramWebPreviewUrl: 'https://t.me/s/SpacetoonTV',
    characters: [
      {
        name: 'Seita',
        arabicName: 'سيتا',
        role: 'الأخ الأكبر المحب والمضحي',
        voiceActor: 'Tsutomu Tatsumi',
        description: 'فتى شجاع يكرس حياته وطاقته لرعاية شقيقته سيتسوكو وإدخال البهجة لقلبها.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Setsuko',
        arabicName: 'سيتسوكو',
        role: 'الطفلة الصغيرة البريئة صاحبة علبة الحلوى',
        voiceActor: 'Ayano Shiraishi',
        description: 'طفلة ذات براءة ساحرة تحب حلوى الفواكه وضياء اليراعات في الليل.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Home Sweet Home & Setsuko and Seita Main Theme',
        artist: 'Michio Mamiya',
        youtubeId: '4vPeTSRd580'
      }
    ],
    episodes: [
      {
        id: 'fireflies-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: قبر اليراعات (Grave of the Fireflies) مترجم HD',
        duration: '89 دقيقة',
        youtubeId: '4vPeTSRd580',
        telegramUrl: 'https://t.me/SpacetoonTV',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=فيلم+قبر+اليراعات+كامل+مترجم+عربي',
        servers: [
          { id: 'fir-s1', name: 'سيرفر يوتيوب الرسمي (Official Studio Ghibli Trailer)', url: 'https://www.youtube-nocookie.com/embed/4vPeTSRd580?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'fir-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة الفيلم كاملاً)', url: 'https://t.me/SpacetoonTV', type: 'telegram', quality: 'Original' },
          { id: 'fir-s3', name: 'سيرفر البحث والمشاهدة للفيلم كاملاً HD', url: 'https://www.youtube.com/results?search_query=فيلم+قبر+اليراعات+مترجم+كامل+عالي+الدقة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'العرض السينمائي الكامل للفيلم الكلاسيكي الخالد قبر اليراعات بدقة عالية.',
        airDate: '1988-04-16'
      }
    ]
  },

  // 9. فيلم ون بيس ريد
  {
    id: 'movie-one-piece-red',
    title: 'فيلم ون بيس: ريد (One Piece Film: Red)',
    originalTitle: 'One Piece Film: Red',
    slug: 'one-piece-film-red',
    type: 'movie',
    mediaCategory: 'anime-movie',
    year: 2022,
    studio: 'Toei Animation',
    arabicDubbingStudio: 'مترجم ومدبلج رسمي',
    director: 'Gorō Taniguchi',
    writer: 'Tsutomu Kuroiwa & Eiichiro Oda',
    genres: ['موسيقى وأكشن', 'قراصنة ومغامرات', 'حفلات وغناء', 'شونين سينمائي'],
    rating: 9.3,
    status: 'فيلم سينمائي كامل (115 دقيقة)',
    episodesCount: 1,
    duration: '115 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'الحدث السينمائي الضخم لقراصنة قبعة القش: المغنية الأسطورية أوتا ابنة الإمبراطور ذو الشعر الأحمر شانكس تقيم أول حفل موسيقي مباشر يقلب موازين العالم.',
    story: `تجتمع قوى البحرية والقراصنة في جزيرة إيليجيا لحضور أول حفل مباشر للمغنية الأكثر شهرة في العالم "أوتا".
يكتشف لوفي أن أوتا هي صديقة طفولته وابنة القرصان الأسطوري شانكس، لكن صوتها الساحر يخفي سراً خطيراً يهدد بحبس العالم بأسره في حلم أبدي.`,
    telegramChannelName: 'قناة أومينيتشي لأفلام الأنمي (@ominichi)',
    telegramChannelUrl: 'https://t.me/Anime_4Up',
    telegramWebPreviewUrl: 'https://t.me/s/Anime_4Up',
    characters: [
      {
        name: 'Uta',
        arabicName: 'أوتا',
        role: 'مغنية العالم وابنة شانكس بالتبني',
        voiceActor: 'Kaori Nazuka / Ado (غناء)',
        description: 'مغنية صاحبة صوت ساحر بفاكهة أوتا أوتا نو مي، تأسر القلوب بغنائها.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'New Genesis (Shin Jidai) - أغنية أوتا الأسطورية',
        artist: 'Ado',
        youtubeId: '89JkW82XC84'
      }
    ],
    episodes: [
      {
        id: 'op-red-full',
        number: 1,
        title: 'مشاهدة الفيلم الكامل: ون بيس ريد (One Piece Film: Red) مترجم FHD',
        duration: '115 دقيقة',
        youtubeId: '89JkW82XC84',
        telegramUrl: 'https://t.me/Anime_4Up',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=فيلم+ون+بيس+ريد+كامل+مترجم+عربي',
        servers: [
          { id: 'red-s1', name: 'سيرفر يوتيوب HD (العرض الرسمي للفيلم والأغاني)', url: 'https://www.youtube-nocookie.com/embed/89JkW82XC84?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'red-s2', name: 'سيرفر تيليجرام السحابي (تحميل ومشاهدة)', url: 'https://t.me/Anime_4Up', type: 'telegram', quality: 'Original' },
          { id: 'red-s3', name: 'سيرفر البحث والمشاهدة للفيلم كاملاً HD', url: 'https://www.youtube.com/results?search_query=فيلم+ون+بيس+ريد+مترجم+كامل+عالي+الدقة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'العرض السينمائي الكامل لفيلم ون بيس ريد بجودة Full HD مع استعراض الأغاني الأسطورية.',
        airDate: '2022-08-06'
      }
    ]
  }
];
