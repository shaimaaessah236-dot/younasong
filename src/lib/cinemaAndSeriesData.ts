import { Anime } from '../types';

export const WORLD_MOVIES_AND_SERIES: Anime[] = [
  // ==========================================
  //  أفلام سينمائية عالمية كبرى (World Cinema)
  // ==========================================
  {
    id: 'movie-interstellar',
    title: 'إنترستيلار (Interstellar)',
    originalTitle: 'Interstellar (عبر النجوم)',
    slug: 'interstellar',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2014,
    studio: 'Paramount Pictures / Warner Bros. / Syncopy',
    director: 'Christopher Nolan (كريستوفر نولان)',
    writer: 'Jonathan Nolan & Christopher Nolan',
    genres: ['خيال علمي ملحمي', 'فيزياء وفضاء', 'دراما إنسانية عائلية', 'سفر عبر الزمن'],
    rating: 9.8,
    status: 'فيلم سينمائي كامل (169 دقيقة)',
    episodesCount: 1,
    duration: '169 دقيقة (ساعتان و49 دقيقة)',
    coverImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'التحفة العلمية لكريستوفر نولان: رحلة رواد فضاء عبر ثقب دودي بالقرب من زحل بحثاً عن كوكب صالح للحياة لإنقاذ البشرية من الفناء مع استكشاف أبعاد النسبية والثقوب السوداء.',
    story: `في مستقبل ديستوبي تضرب فيه العواصف الترابية والأوبئة الزراعية كوكب الأرض وتهدد البشرية بالمجاعة والانقراض، يُكلَّف الطيار السابق لوكالة ناسا "جوزيف كوبر" بقيادة مهمة سرية عبر ثقب دودي اكتُشف حديثاً بالقرب من كوكب زحل.
يسافر الطاقم بين عوالم مائية وجليدية بجوار الثقب الأسود العملاق "غارغانتوا" حيث تتمدد الأزمنة، وتمر ساعات على الكوكب تعادل عقوداً على الأرض، في صراع درامي عاطفي بين حب الأب لابنته "ميرف" والواجب لإنقاذ سلالة الإنسان.`,
    telegramChannelName: 'قناة سينما الأفلام والمسلسلات العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    telegramBotSearchUrl: 'https://t.me/s/ggigg090?q=Interstellar',
    characters: [
      {
        name: 'Joseph Cooper',
        arabicName: 'جوزيف كوبر',
        role: 'طيار ناسا وقائد مهمة إندورانس',
        voiceActor: 'Matthew McConaughey (ماثيو ماكونهي)',
        description: 'أب ومهندس وطيار استثنائي يخاطر بكل شيء في الفضاء السحيق ليعود لابنته.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Dr. Amelia Brand',
        arabicName: 'د. أميليا براند',
        role: 'عالمة أحياء ورواد الفضاء',
        voiceActor: 'Anne Hathaway (آن هاثاواي)',
        description: 'عالمة تؤمن بأن الحب هو القوة الوحيدة القادرة على تجاوز أبعاد الزمان والمكان.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Murphy Cooper (Murph)',
        arabicName: 'ميرف كوبر',
        role: 'ابنة كوبر وعالمة الفيزياء الفذة',
        voiceActor: 'Jessica Chastain (جيسيكا شاستاين)',
        description: 'الطفلة التي تفك معادلة الجاذبية في كبرها لإنقاذ ما تبقى من سكان الأرض.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Cornfield Chase & First Step (الموسيقى التصويرية الأيقونية)',
        artist: 'Hans Zimmer (هانز زيمر)',
        youtubeId: '1V_xRb0x9aw'
      }
    ],
    episodes: [
      {
        id: 'interstellar-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم إنترستيلار (Interstellar) مترجم HD',
        duration: '169 دقيقة',
        youtubeId: 'zSWdZVtXT7E',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Interstellar+movie+full+hd+arabic',
        servers: [
          { id: 'int-s1', name: 'سيرفر يوتيوب الرسمي (العرض الدعائي بدقة 4K)', url: 'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '4K UHD' },
          { id: 'int-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر بدون إعلانات)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'int-s3', name: 'سيرفر البحث والمشاهدة المباشرة للفيلم كاملاً', url: 'https://www.youtube.com/results?search_query=Interstellar+movie+full+hd+arabic+subtitles', type: 'external', quality: 'Web HD' }
        ],
        summary: 'فيلم الخيال العلمي الحائز على جائزة الأوسكار للمؤثرات البصرية وموسيقى هانز زيمر الأسطورية.',
        airDate: '2014-11-07'
      }
    ]
  },

  {
    id: 'movie-inception',
    title: 'البداية (Inception)',
    originalTitle: 'Inception (ازدراع الأحلام)',
    slug: 'inception',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2010,
    studio: 'Warner Bros. / Legendary Pictures',
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    genres: ['إثارة نفسية', 'خيال علمي', 'أكشن وغموض', 'عالم الأحلام'],
    rating: 9.7,
    status: 'فيلم سينمائي كامل (148 دقيقة)',
    episodesCount: 1,
    duration: '148 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    description: 'دوم كوب سارق محترف يقتحم أحلام الآخرين لسرقة أسرارهم الباطنية، يُكلَّف بالمهمة المستحيلة المعاكسة: زرع فكرة داخل عقل وريث إمبراطورية تجارية ضخمة.',
    story: `يعمل دوم كوب وفريقه الماهر من صانعي الأحلام والمخادعين في مجال التجسس المشترك عبر الأحلام.
للحصول على تبرئة تتيح له العودة إلى أطفاله في الولايات المتحدة، يوافق على تنفيذ عملية "البداية" لزرع فكرة في عقل روبرت فيشر، لكن مواجهة شبح زوجته الراحلة "مال" داخل طبقات الحلم المنهارة تهدد بحبس الفريق في اللانهاية (الليمبو).`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'Dom Cobb',
        arabicName: 'دوم كوب',
        role: 'المستخرج وقائد فريق اختراق الأحلام',
        voiceActor: 'Leonardo DiCaprio (ليوناردو دي كابريو)',
        description: 'لص ماهر مطارد بالذكريات يسعى للعودة لوطنه وأولاده.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Ariadne',
        arabicName: 'أريادني',
        role: 'مهندسة المعمار وتصميم عوالم الأحلام',
        voiceActor: 'Elliot Page',
        description: 'طالبة هندسة عبقرية تبني متاهات وأكوان خيالية داخل عقول الحالمين.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Time (موسيقى هانز زيمر الخالدة)',
        artist: 'Hans Zimmer',
        youtubeId: 'RxabLA7UQ9k'
      }
    ],
    episodes: [
      {
        id: 'inception-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم البداية (Inception) مترجم FHD',
        duration: '148 دقيقة',
        youtubeId: 'YoHD9XEInc0',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Inception+movie+full+arabic+subtitles',
        servers: [
          { id: 'inc-s1', name: 'سيرفر يوتيوب الرسمي (Official Trailer HD)', url: 'https://www.youtube-nocookie.com/embed/YoHD9XEInc0?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'inc-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'inc-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Inception+movie+full+arabic+subtitles', type: 'external', quality: 'Web HD' }
        ],
        summary: 'واحد من أعظم أفلام السينما المعاصرة الحائز على 4 جوائز أوسكار.',
        airDate: '2010-07-16'
      }
    ]
  },

  {
    id: 'movie-lord-of-the-rings',
    title: 'سيد الخواتم: رفقة الخاتم',
    originalTitle: 'The Lord of the Rings: The Fellowship of the Ring',
    slug: 'lord-of-the-rings-fellowship',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2001,
    studio: 'New Line Cinema / WingNut Films',
    director: 'Peter Jackson (بيتر جاكسون)',
    writer: 'J.R.R. Tolkien & Fran Walsh',
    genres: ['فانتازيا ملحمية', 'مغامرات وأساطير', 'حروب وسيوف', 'الأرض الوسطى'],
    rating: 9.9,
    status: 'فيلم سينمائي كامل (178 دقيقة)',
    episodesCount: 1,
    duration: '178 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الملحمة الأسطورية الأضخم في تاريخ الفانتازيا: فرودو باجنز ينطلق مع رفقة مكونة من البشر والجان والأقزام لتدمير خاتم القوة الأوحد في جبل الهلاك وإنقاذ الأرض الوسطى من ساورون.',
    story: `يستيقظ لورد الظلام ساورون ويسعى لاستعادة خاتمه الأوحد الذي يحكم به شعوب الأرض الوسطى.
تقع مسؤولية تدمير الخاتم على عاتق الهوبيت الصغير فرودو باجنز، فينضم إليه الساحر غاندالف الأبيض، ووريث عرش غوندور أراغورن، والرامي ليغولاس، والمحارب القزم غيملي، وبرومير في رحلة محفوفة بالوحوش والفرسان السود نحو أرض موردور.`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'Frodo Baggins',
        arabicName: 'فرودو باجنز',
        role: 'حامل الخاتم والهوبيت الشجاع',
        voiceActor: 'Elijah Wood (إيليا وود)',
        description: 'هوبيت ذو قلب نقي يتحمل عبء الخاتم المظلم لإنقاذ وطنه والأرض الوسطى.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Gandalf the Grey',
        arabicName: 'غاندالف الرمادي',
        role: 'الساحر الحكيم ومرشد الرفقة',
        voiceActor: 'Ian McKellen (إيان ماكيلين)',
        description: 'ساحر قديم يواجه الوحش بالروغ بشجاعة ويحمي أصدقاءه بحكمته وعصاه.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Aragorn',
        arabicName: 'أراغورن',
        role: 'سيد الحراس ووريث عرش غوندور',
        voiceActor: 'Viggo Mortensen (فيغو مورتينسين)',
        description: 'مقاتل عظيم ذو نبل وشجاعة يقود معارك الدفاع عن العالم الحر.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Concerning Hobbits (موسيقى شاير الخالدة)',
        artist: 'Howard Shore (هوارد شور)',
        youtubeId: 'b7k0a5hYnSI'
      }
    ],
    episodes: [
      {
        id: 'lotr-fellowship-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم سيد الخواتم: رفقة الخاتم Extended FHD',
        duration: '178 دقيقة',
        youtubeId: 'V75dMMIW2B4',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=The+Lord+of+the+Rings+The+Fellowship+of+the+Ring+full+movie+arabic',
        servers: [
          { id: 'lotr-s1', name: 'سيرفر يوتيوب الرسمي (Official 4K Remastered Trailer)', url: 'https://www.youtube-nocookie.com/embed/V75dMMIW2B4?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '4K UHD' },
          { id: 'lotr-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'lotr-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Lord+of+the+rings+fellowship+of+the+ring+full+movie+arabic', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الجزء الأول من الثلاثية التاريخية الفائزة بـ 17 جائزة أوسكار.',
        airDate: '2001-12-19'
      }
    ]
  },

  {
    id: 'movie-oppenheimer',
    title: 'أوبنهايمر (Oppenheimer)',
    originalTitle: 'Oppenheimer (أب القنبلة الذرية)',
    slug: 'oppenheimer',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2023,
    studio: 'Universal Pictures / Syncopy',
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan & Kai Bird',
    genres: ['سيرة ذاتية وتاريخ', 'دراما سياسية وفكرية', 'فيزياء وحرب عالمية', 'أوسكار 2024'],
    rating: 9.6,
    status: 'فيلم سينمائي كامل (180 دقيقة)',
    episodesCount: 1,
    duration: '180 دقيقة (3 ساعات)',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'قصة الفيزيائي روبرت أوبنهايمر ودوره في قيادة مشروع مانهاتن لتطوير أول سلاح نووي في التاريخ وما تلا ذلك من محاكمات وتأنيب ضمير وجودي غير مسار البشرية.',
    story: `يركز الفيلم على حياة الفيزيائي النظري جيه روبرت أوبنهايمر، من دراساته في كامبريدج وغوتينغن، إلى تكليفه من الجنرال غروفز بإدارة مختبر لوس ألاموس السري في نيو مكسيكو.
يصل العمل لذروته في اختبار ترينيتي النووي الأول، قبل أن يتحول لصراع سياسي واتهامات بالولاء للشيوعية بقيادة لويس ستراوس في جلسات استماع أمنية سرية ومؤثرة.`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'J. Robert Oppenheimer',
        arabicName: 'روبرت أوبنهايمر',
        role: 'مدير مشروع مانهاتن وأب القنبلة الذرية',
        voiceActor: 'Cillian Murphy (كيليان ميرفي)',
        description: 'عالم عبقري يدرك هول ما صنعه مردداً: الآن أصبحت الموت، مدمر العوالم.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Can You Hear The Music (موسيقى لودفيغ غورانسون)',
        artist: 'Ludwig Göransson',
        youtubeId: '4JZ-o3iAJv4'
      }
    ],
    episodes: [
      {
        id: 'oppenheimer-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم أوبنهايمر (Oppenheimer) مترجم 4K',
        duration: '180 دقيقة',
        youtubeId: 'uYPbbksJxIg',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Oppenheimer+full+movie+arabic+subtitles',
        servers: [
          { id: 'opp-s1', name: 'سيرفر يوتيوب الرسمي (Official 4K Trailer)', url: 'https://www.youtube-nocookie.com/embed/uYPbbksJxIg?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '4K UHD' },
          { id: 'opp-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل فوري)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'opp-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Oppenheimer+full+movie+arabic', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الفيلم الحائز على 7 جوائز أوسكار لعام 2024 بما فيها أفضل فيلم وأفضل مخرج وممثل.',
        airDate: '2023-07-21'
      }
    ]
  },

  {
    id: 'movie-the-dark-knight',
    title: 'فارس الظلام (The Dark Knight)',
    originalTitle: 'The Dark Knight (باتمان والجوكر)',
    slug: 'the-dark-knight',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2008,
    studio: 'Warner Bros. / DC Comics / Syncopy',
    director: 'Christopher Nolan',
    writer: 'Jonathan Nolan & Christopher Nolan',
    genres: ['أكشن وجريمة', 'إثارة نفسية وفلسفية', 'شخصيات كوميكس واقعية', 'أعظم أفلام التاريخ'],
    rating: 9.9,
    status: 'فيلم سينمائي كامل (152 دقيقة)',
    episodesCount: 1,
    duration: '152 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    description: 'الصراع الملحمي بين باتمان والمحقق غوردون والمدعي العام هارفي دينت ضد الفوضوي العبقري "الجوكر" الذي يختبر أخلاق مدينة غوثام ويكشف هشاشة العدالة.',
    story: `عندما يظهر مجرم خطير وغامض يعرف باسم "الجوكر" في مدينة غوثام، يغرق المدينة في فوضى عارمة واضطرابات لا تنتهي.
يُجبر باتمان على مواجهة أحد أعظم الاختبارات النفسية والجسدية لقدرته على محاربة الظلم دون الانحدار إلى مستوى الوحوش التي يقاتلها.`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'The Joker',
        arabicName: 'الجوكر',
        role: 'أمير الجريمة ورائد الفوضى العارمة',
        voiceActor: 'Heath Ledger (هيث ليدجر - أوسكار)',
        description: 'الأداء الأسطوري الخالد الذي سحر العالم بمقولة: Why So Serious?',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Bruce Wayne / Batman',
        arabicName: 'بروس واين / باتمان',
        role: 'فارس الظلام وحامي غوثام الصامت',
        voiceActor: 'Christian Bale (كريستيان بيل)',
        description: 'البطل الذي يضحي بسمعته ليبقى الحارس الخفي الذي تحتاجه المدينة.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Why So Serious? & Like a Dog Chasing Cars',
        artist: 'Hans Zimmer & James Newton Howard',
        youtubeId: 'Y9j3EN4pn-s'
      }
    ],
    episodes: [
      {
        id: 'dark-knight-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم فارس الظلام (The Dark Knight) مترجم FHD',
        duration: '152 دقيقة',
        youtubeId: 'EXeTwQWrcwY',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=The+Dark+Knight+full+movie+arabic+subtitles',
        servers: [
          { id: 'dk-s1', name: 'سيرفر يوتيوب الرسمي (Official 4K Trailer)', url: 'https://www.youtube-nocookie.com/embed/EXeTwQWrcwY?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'dk-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'dk-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=The+Dark+Knight+full+movie+arabic', type: 'external', quality: 'Web HD' }
        ],
        summary: 'أحد أعلى الأفلام تقييماً في تاريخ موقع IMDb والسينما العالمية.',
        airDate: '2008-07-18'
      }
    ]
  },

  {
    id: 'movie-gladiator',
    title: 'المحارب (Gladiator)',
    originalTitle: 'Gladiator (مكسيموس ومجد روما)',
    slug: 'gladiator',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 2000,
    studio: 'DreamWorks / Universal Pictures',
    director: 'Ridley Scott (ريدلي سكوت)',
    writer: 'David Franzoni & John Logan',
    genres: ['دراما تاريخية ملحمية', 'حروب وسيوف ورماة', 'روما القديمة', 'انتقام وشرف'],
    rating: 9.8,
    status: 'فيلم سينمائي كامل (155 دقيقة)',
    episodesCount: 1,
    duration: '155 دقيقة',
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الجنرال الروماني مكسيموس ديسيموس ميريديوس الذي يُخان ويُقتل أهله ويُباع عبداً ليقاتل كمصارع في حلبة الكولوسيوم بروما ليثأر من الإمبراطور الغادر كومودوس.',
    story: `يقود مكسيموس جيوش الإمبراطور الصالح ماركوس أوريليوس لتحقيق النصر على القبائل الجرمانية، فيختاره الإمبراطور ليكون وصياً على روما وإعادة الجمهورية.
يغدر الابن كومودوس بوالده ويأمر بإعدام مكسيموس وعائلته، لكن مكسيموس ينجو ويتحول لأعظم مصارع يحظى بهتافات الجماهير في قلب روما.`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'Maximus Decimus Meridius',
        arabicName: 'مكسيموس',
        role: 'الجنرال العظيم وقاهر الحلبات',
        voiceActor: 'Russell Crowe (راسل كرو - أوسكار)',
        description: 'قائد وفيّ وشجاع لا يهاب الموت يسعى لشرف روما واللقاء بعائلته في الآخرة.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'Now We Are Free (أغنية الحرية والخلود)',
        artist: 'Hans Zimmer & Lisa Gerrard',
        youtubeId: 'NBE-uBgtINg'
      }
    ],
    episodes: [
      {
        id: 'gladiator-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم المحارب (Gladiator) مترجم 4K',
        duration: '155 دقيقة',
        youtubeId: 'P5ieIbInFpg',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Gladiator+full+movie+arabic+subtitles',
        servers: [
          { id: 'glad-s1', name: 'سيرفر يوتيوب الرسمي (Official 4K Trailer)', url: 'https://www.youtube-nocookie.com/embed/P5ieIbInFpg?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'glad-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'glad-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Gladiator+2000+full+movie+arabic', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الفيلم الحائز على 5 جوائز أوسكار وأيقونة السينما التاريخية للمخرج ريدلي سكوت.',
        airDate: '2000-05-05'
      }
    ]
  },

  {
    id: 'movie-titanic',
    title: 'تيتانيك (Titanic)',
    originalTitle: 'Titanic (السفينة التي لا تغرق)',
    slug: 'titanic',
    type: 'movie',
    mediaCategory: 'world-movie',
    year: 1997,
    studio: 'Paramount Pictures / 20th Century Fox',
    director: 'James Cameron (جيمس كاميرون)',
    writer: 'James Cameron',
    genres: ['رومانسية ودراما ملحمية', 'تاريخ وكوارث بحرية', 'أسطورة السينما', '11 جائزة أوسكار'],
    rating: 9.8,
    status: 'فيلم سينمائي كامل (194 دقيقة)',
    episodesCount: 1,
    duration: '194 دقيقة (3 ساعات و14 دقيقة)',
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'قصة الحب الأسطورية بين الرسام الفقير جاك والفتاة الأرستقراطية روز على متن سفينة تيتانيك العملاقة في رحلتها الأولى عبر المحيط الأطلسي عام 1912 حتى اصطدامها بالجبل الجليدي.',
    story: `يلتقي الشاب جاك داوسون بالفتاة الثرية روز ديويت بوكاتر على متن السفينة الملكية تيتانيك، وتنشأ بينهما علاقة حب عميقة تتحدى الفروق الطبقية، قبل أن تواجه السفينة الكارثة البحرية الأكثر شهرة في التاريخ.`,
    telegramChannelName: 'قناة الأفلام والسينما العالمية (@ggigg090)',
    telegramChannelUrl: 'https://t.me/ggigg090',
    telegramWebPreviewUrl: 'https://t.me/s/ggigg090',
    characters: [
      {
        name: 'Jack Dawson',
        arabicName: 'جاك داوسون',
        role: 'الرسام الشاب والمحب المضحي',
        voiceActor: 'Leonardo DiCaprio',
        description: 'شاب حر القلب يفوز بتذكرة تيتانيك ويمنح روز معنى الحرية والحياة الحقيقية.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Rose DeWitt Bukater',
        arabicName: 'روز',
        role: 'الفتاة المتمردة والناجية من الغرق',
        voiceActor: 'Kate Winslet (كيت وينسلت)',
        description: 'فتاة شابة ترفض القيود الاجتماعية وتعيش قصة حب خالدة لا ينساها الزمن.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة الفيلم',
        title: 'My Heart Will Go On (شارة سيلين ديون الأسطورية)',
        artist: 'Celine Dion',
        youtubeId: 'F2RnxZnubVQ'
      }
    ],
    episodes: [
      {
        id: 'titanic-movie',
        number: 1,
        title: 'العرض السينمائي الكامل لفيلم تيتانيك (Titanic) مترجم 4K',
        duration: '194 دقيقة',
        youtubeId: 'kVrqfYjkTdQ',
        telegramUrl: 'https://t.me/ggigg090',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Titanic+1997+full+movie+arabic+subtitles',
        servers: [
          { id: 'tit-s1', name: 'سيرفر يوتيوب الرسمي (Official 25th Anniversary 4K Trailer)', url: 'https://www.youtube-nocookie.com/embed/kVrqfYjkTdQ?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '4K UHD' },
          { id: 'tit-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/ggigg090', type: 'telegram', quality: '1080p FHD' },
          { id: 'tit-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Titanic+1997+full+movie+arabic', type: 'external', quality: 'Web HD' }
        ],
        summary: 'واحد من أكثر الأفلام تحقيقاً للإيرادات وحصداً للجوائز (11 جائزة أوسكار) في تاريخ السينما.',
        airDate: '1997-12-19'
      }
    ]
  },

  // ==========================================
  //  مسلسلات درامية وتاريخية عالمية وعربية (World & Arabic Series)
  // ==========================================
  {
    id: 'series-vikings',
    title: 'مسلسل فايكنجز (Vikings)',
    originalTitle: 'Vikings (ملحمة راغنار لوثبروك)',
    slug: 'vikings-saga',
    type: 'series',
    mediaCategory: 'world-series',
    year: 2013,
    studio: 'MGM Television / History / Netflix',
    arabicDubbingStudio: 'مترجم ومدبلج رسمي نتفلكس',
    director: 'Michael Hirst',
    writer: 'Michael Hirst (مايكل هيرست)',
    genres: ['دراما تاريخية ملحمية', 'حروب وسفن الفايكنج', 'أساطير وإثارة', 'نتفلكس'],
    rating: 9.7,
    status: 'مسلسل مكتمل لجميع المواسم (89 حلقة)',
    episodesCount: 89,
    coverImage: 'https://images.unsplash.com/photo-1533240332313-0db49b459ad0?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'الملحمة التاريخية الأكثر إثارة: راغنار لوثبروك الفلاح الشجاع الذي يبحر بسفنه نحو إنجلترا وفرنسا ليصبح ملك الفايكنج الأسطوري وسيد البحار الشمالية.',
    story: `يستند المسلسل إلى أساطير راغنار لوثبروك، الفايكنج الإسكندنافي الأكثر شهرة وغموضاً.
يبدأ راغنار مزارعاً حراً ومحارباً يمتلك طموحاً لاكتشاف الأراضي الغربية وراء البحر بمساعدة صديقه المبتكر فلوكي وزوجته المقاتلة لاغيرثا، ليقود غزوات أسطورية نحو سواحل بريطانيا ومملكة وسكس وعاصمة الفرنجة باريس، ممهداً الطريق لأبنائه بيورن وإيفار لمواصلة غزو العالم القديم.`,
    telegramChannelName: 'قناة نتفلكس مسلسلات وأفلام (@NetFlix_Arabic)',
    telegramChannelUrl: 'https://t.me/NetFlix_Arabic',
    telegramWebPreviewUrl: 'https://t.me/s/NetFlix_Arabic',
    telegramBotSearchUrl: 'https://t.me/s/NetFlix_Arabic?q=Vikings',
    characters: [
      {
        name: 'Ragnar Lothbrok',
        arabicName: 'راغنار لوثبروك',
        role: 'ملك الفايكنج الأسطوري والمستكشف الفذ',
        voiceActor: 'Travis Fimmel (ترافيس فيميل)',
        description: 'محارب صاحب رؤية ثاقبة يطمح لاستكشاف أراضٍ جديدة وتغيير مصير شعبه.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Lagertha',
        arabicName: 'لاغيرثا',
        role: 'فتاة الدرع والمحاربة الشجاعة والملكة',
        voiceActor: 'Katheryn Winnick (كاثرين وينيك)',
        description: 'مقاتلة لا تعرف الخوف تقود الجيوش دفاعاً عن شرفها وشعبها.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Bjorn Ironside',
        arabicName: 'بيورن آيرونسايد',
        role: 'الابن البكر لراغنار وقائد الغزوات الكبرى',
        voiceActor: 'Alexander Ludwig',
        description: 'المحارب الفولاذي المنيع الذي يبحر في البحر المتوسط ويحكم كاتيغات.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'If I Had a Heart (موسيقى الفايكنج الأيقونية)',
        artist: 'Fever Ray',
        youtubeId: 'EBAzlNJonO8'
      }
    ],
    episodes: [
      {
        id: 'vikings-s1-ep01',
        number: 1,
        title: 'الموسم 1 الحلقة 1: مراسم البلوغ والرؤيا الغربية (Rites of Passage)',
        duration: '44 دقيقة',
        youtubeId: 'mfl3j6k1k4w',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=مسلسل+فايكنجز+الموسم+الاول+الحلقة+1+مترجم',
        servers: [
          { id: 'vik-s1', name: 'سيرفر يوتيوب الترويجي والافتتاحية الرسمية (HD)', url: 'https://www.youtube-nocookie.com/embed/mfl3j6k1k4w?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'vik-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل فوراً بدون إعلانات)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'vik-s3', name: 'سيرفر البحث والمشاهدة السحابية HD', url: 'https://www.youtube.com/results?search_query=مسلسل+فايكنجز+الموسم+الاول+الحلقة+1+كاملة', type: 'external', quality: 'Web 4K' }
        ],
        summary: 'بداية حلم راغنار لوثبروك في الإبحار غرباً وبناء فلوكي للسفينة الخشبية السريعة.',
        airDate: '2013-03-03'
      },
      {
        id: 'vikings-s1-ep02',
        number: 2,
        title: 'الموسم 1 الحلقة 2: غزو الدير الأول في إنجلترا (Wrath of the Northmen)',
        duration: '44 دقيقة',
        youtubeId: 'mfl3j6k1k4w',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=مسلسل+فايكنجز+الموسم+الاول+الحلقة+2+مترجم',
        servers: [
          { id: 'vik-s2-1', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل فوراً)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'vik-s2-2', name: 'سيرفر البحث والمشاهدة السحابية HD', url: 'https://www.youtube.com/results?search_query=مسلسل+فايكنجز+الموسم+الاول+الحلقة+2+كاملة', type: 'external', quality: 'Web 4K' }
        ],
        summary: 'وصول سفينة الفايكنج لسواحل نورثمبريا في إنجلترا ولقاء الراهب أثيلستان وتغيير مجرى التاريخ.',
        airDate: '2013-03-10'
      }
    ]
  },

  {
    id: 'series-game-of-thrones',
    title: 'صراع العروش (Game of Thrones)',
    originalTitle: 'Game of Thrones (أغنية الجليد والنار)',
    slug: 'game-of-thrones',
    type: 'series',
    mediaCategory: 'world-series',
    year: 2011,
    studio: 'HBO / Warner Bros.',
    director: 'David Benioff & D.B. Weiss',
    writer: 'George R.R. Martin (جورج ر. ر. مارتن)',
    genres: ['فانتازيا درامية وسياسية', 'حروب الممالك السبع', 'تنانين وموتى سائرون', 'أعظم مسلسلات التلفزيون'],
    rating: 9.8,
    status: 'مسلسل مكتمل لجميع المواسم (73 حلقة)',
    episodesCount: 73,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    description: 'تسع عائلات نبيلة تتصارع من أجل السيطرة على العرش الحديدي في قارة ويستروس، بينما ينهض عدو قديم خلف الجدار الجليدي الشمالي وتهدد دنيرس تارجارين بالتنانين من الشرق.',
    story: `تبدأ الأحداث في وينترفيل مع لورد الشمال نيد ستارك الذي يُدعى إلى كينجز لاندينج ليصبح ساعد الملك.
تشتعل حرب الملوك الخمسة بعد مقتل الملك روبرت، وتتوالى المؤامرات والخيانات بين اللانستر والستارك والباراثيون، بينما تسعى أم التنانين لاستعادة إرث أجدادها.`,
    telegramChannelName: 'قناة نتفلكس وHBO (@NetFlix_Arabic)',
    telegramChannelUrl: 'https://t.me/NetFlix_Arabic',
    telegramWebPreviewUrl: 'https://t.me/s/NetFlix_Arabic',
    characters: [
      {
        name: 'Jon Snow',
        arabicName: 'جون سنو',
        role: 'لورد كوماندر وحامي الشمال',
        voiceActor: 'Kit Harington (كيت هارينغتون)',
        description: 'ابن نيد ستارك الذي يقف في طليعة مواجهة خطر الموتى السائرين (الوايت ووكرز).',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Daenerys Targaryen',
        arabicName: 'دنيرس تارجارين',
        role: 'أم التنانين وكاسرة السلاسل',
        voiceActor: 'Emilia Clarke (إميليا كلارك)',
        description: 'آخر سلالة التارجارين التي تفقس بيض التنانين الثلاثة وتبني جيشاً لاستعادة العرش.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'Game of Thrones Main Theme (الموسيقى التشيلو الخالدة)',
        artist: 'Ramin Djawadi (رامين جوادي)',
        youtubeId: 's7L2PVdrb_8'
      }
    ],
    episodes: [
      {
        id: 'got-s1-ep01',
        number: 1,
        title: 'الموسم 1 الحلقة 1: الشتاء قادم (Winter Is Coming)',
        duration: '61 دقيقة',
        youtubeId: 'KPLWWIOCOOQ',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Game+of+Thrones+season+1+episode+1+arabic',
        servers: [
          { id: 'got-s1', name: 'سيرفر يوتيوب الرسمي (Official Season 1 Trailer HD)', url: 'https://www.youtube-nocookie.com/embed/KPLWWIOCOOQ?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'got-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'got-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Game+of+Thrones+season+1+episode+1+arabic+sub', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الحلقة الافتتاحية للمسلسل الأكثر مشاهدة وجدلاً في العقد الأخير.',
        airDate: '2011-04-17'
      }
    ]
  },

  {
    id: 'series-breaking-bad',
    title: 'بريكنغ باد (Breaking Bad)',
    originalTitle: 'Breaking Bad (اختلال ضال)',
    slug: 'breaking-bad',
    type: 'series',
    mediaCategory: 'world-series',
    year: 2008,
    studio: 'Sony Pictures Television / AMC',
    director: 'Vince Gilligan (فينس غيليغان)',
    writer: 'Vince Gilligan',
    genres: ['جريمة ودراما نفسية', 'تحول الشخصيات المعقدة', 'تشويق وإثارة', 'تقييم 9.5 على IMDb'],
    rating: 9.9,
    status: 'مسلسل مكتمل لجميع المواسم (62 حلقة)',
    episodesCount: 62,
    coverImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    description: 'والتر وايت معلم كيمياء بالمدرسة الثانوية يُشخَّص بسرطان الرئة القاتل، فيتحالف مع طالبه السابق جيسي بينكمان لإنتاج مادة كيميائية نقية لتأمين مستقبل عائلته المالي، متحوّلاً إلى إمبراطور المخدرات القاسي "هايزنبرغ".',
    story: `يقدم المسلسل دراسة نفسية مذهلة لتحول الإنسان العادي والمسالم إلى وحش كاسر مدفوعاً بالكبرياء والرغبة في السيطرة في ولاية نيو مكسيكو، مع مطاردات شرسة من شقيق زوجته العميل في مكافحة المخدرات هانك شريدر والبارون غوستافو فرينغ.`,
    telegramChannelName: 'قناة نتفلكس مسلسلات وأفلام (@NetFlix_Arabic)',
    telegramChannelUrl: 'https://t.me/NetFlix_Arabic',
    telegramWebPreviewUrl: 'https://t.me/s/NetFlix_Arabic',
    characters: [
      {
        name: 'Walter White / Heisenberg',
        arabicName: 'والتر وايت (هايزنبرغ)',
        role: 'أستاذ الكيمياء وإمبراطور الجريمة',
        voiceActor: 'Bryan Cranston (برايان كرانستون - 4 جوائز إيمي)',
        description: 'عبقري كيمياء يتحول لأخطر رجل في الجنوب الغربي الأمريكي.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Jesse Pinkman',
        arabicName: 'جيسي بينكمان',
        role: 'الشريك الشاب صاحب الضمير المعذب',
        voiceActor: 'Aaron Paul (آرون بول - 3 جوائز إيمي)',
        description: 'شاب تائه يدخل في دوامة مظلمة محاولاً الحفاظ على إنسانيته.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'Breaking Bad Main Theme (موسيقى ديف بورتر)',
        artist: 'Dave Porter',
        youtubeId: 'bmtbg5b7wg8'
      }
    ],
    episodes: [
      {
        id: 'bb-s1-ep01',
        number: 1,
        title: 'الموسم 1 الحلقة 1: البداية والتشخيص (Pilot)',
        duration: '58 دقيقة',
        youtubeId: 'HhesaQXLuRY',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=Breaking+Bad+season+1+episode+1+arabic+sub',
        servers: [
          { id: 'bb-s1', name: 'سيرفر يوتيوب الرسمي (Official Series Trailer HD)', url: 'https://www.youtube-nocookie.com/embed/HhesaQXLuRY?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'bb-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'bb-s3', name: 'سيرفر البحث والمشاهدة المباشرة HD', url: 'https://www.youtube.com/results?search_query=Breaking+Bad+season+1+episode+1+arabic+subtitles', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الحلقة الأولى من المسلسل الحائز على أعلى تقييم نقدي في التاريخ بموسوعة غينيس.',
        airDate: '2008-01-20'
      }
    ]
  },

  {
    id: 'series-omar',
    title: 'مسلسل عمر (Omar Series)',
    originalTitle: 'مسلسل الفاروق عمر بن الخطاب رضي الله عنه',
    slug: 'omar-series',
    type: 'series',
    mediaCategory: 'world-series',
    year: 2012,
    studio: 'MBC Group / تلفزيون قطر',
    director: 'حاتم علي (المخرج السوري الراحل)',
    writer: 'د. وليد سيف',
    genres: ['دراما تاريخية إسلامية كبرى', 'تاريخ وسيرة وسيريال', 'إنتاج سينمائي ضخم', 'حاتم علي'],
    rating: 9.9,
    status: 'مسلسل مكتمل (31 حلقة)',
    episodesCount: 31,
    coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    description: 'أضخم إنتاج تلفزيوني وسينمائي في تاريخ الدراما العربية: سيرة الفاروق عمر بن الخطاب رضي الله عنه ونشأة الدولة الإسلامية والفتوحات الكبرى من إخراج المبدع حاتم علي وكتابة وليد سيف.',
    story: `يتناول المسلسل بتوثيق تاريخي دقيق حياة أمير المؤمنين عمر بن الخطاب رضي الله عنه، بدءاً من شبابه في مكة ورعايته للإبل وتجارته، ثم إسلامه الحاسم الذي أعز الله به الإسلام.
تتوالى الحلقات في رصد عهد النبوة والهجرة، ثم خلافة أبي بكر الصديق وحروب الردة، وصولاً إلى خلافة عمر وإرساء قواعد العدل والشورى والفتوحات الكبرى لبلاد الشام وفارس ومصر.`,
    telegramChannelName: 'قناة المسلسلات التاريخية (@NetFlix_Arabic)',
    telegramChannelUrl: 'https://t.me/NetFlix_Arabic',
    telegramWebPreviewUrl: 'https://t.me/s/NetFlix_Arabic',
    characters: [
      {
        name: 'Omar ibn al-Khattab',
        arabicName: 'عمر بن الخطاب (الفاروق)',
        role: 'أمير المؤمنين وخليفة رسول الله الثاني',
        voiceActor: 'سامر إسماعيل / أداء صوتي: أسعد خليفة',
        description: 'رمز العدالة والزهد والقوة في الحق، قيل فيه: حكمت فعدلت فأمنت فنمت.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Abu Bakr al-Siddiq',
        arabicName: 'أبو بكر الصديق',
        role: 'أول الخلفاء الراشدين ورفيق الغار',
        voiceActor: 'غسان مسعود (النجم العالمي)',
        description: 'الصاحب الوفي ذو الإيمان الراسخ والقرارات الحاسمة في حروب الردة.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'الموسيقى التصويرية لمسلسل عمر (ألحان فهد كنعان)',
        artist: 'الأوركسترا السيمفونية العالمية',
        youtubeId: '5P2Xh4u6M70'
      }
    ],
    episodes: [
      {
        id: 'omar-ep-01',
        number: 1,
        title: 'الحلقة 1: مكة في الجاهلية وشباب عمر ورعاية الإبل',
        duration: '47 دقيقة',
        youtubeId: '5P2Xh4u6M70',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=مسلسل+عمر+الحلقة+1+كاملة+شاهد',
        servers: [
          { id: 'om-s1', name: 'سيرفر يوتيوب الرسمي (شاهد MBC الرسمية HD)', url: 'https://www.youtube-nocookie.com/embed/5P2Xh4u6M70?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'om-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر بدون إعلانات)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'om-s3', name: 'سيرفر البحث والمشاهدة المباشرة للحلقة كاملة', url: 'https://www.youtube.com/results?search_query=مسلسل+عمر+بن+الخطاب+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الحلقة الأولى من العمل التاريخي الأضخم في الوطن العربي من إخراج حاتم علي.',
        airDate: '2012-07-20'
      }
    ]
  },

  {
    id: 'series-taghriba-falastiniya',
    title: 'التغريبة الفلسطينية',
    originalTitle: 'ملحمة التغريبة الفلسطينية (دراما التاريخ والذاكرة)',
    slug: 'al-taghriba-al-falastiniya',
    type: 'series',
    mediaCategory: 'world-series',
    year: 2004,
    studio: 'تلفزيون سوريا / سورية الدولية للإنتاج الفني',
    director: 'حاتم علي',
    writer: 'د. وليد سيف',
    genres: ['دراما إنسانية تاريخية', 'ذاكرة ونضال وشرف', 'تحفة الدراما العربية الخالدة'],
    rating: 9.9,
    status: 'مسلسل مكتمل (31 حلقة)',
    episodesCount: 31,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    description: 'أعظم ملحمة درامية في تاريخ التلفزيون العربي: قصة أسرة فلسطينية ريفية عبر عقود الاحتلال البريطاني والنكبة ومقاومة التهجير بمزيج باهر من الواقعية والشاعرية والألم والأمل.',
    story: `يروي المسلسل بصوت الأكاديمي "علي" سيرة عائلته القروية من قرية ريفية قريبة من حيفا.
يضحي الأخ الأكبر "أبو صالح" والفلاح المكافح "أحمد" بكل شيء لتعليم أصغر إخوانهم، ليعيش المشاهد تفاصيل الثورة الفلسطينية الكبرى عام 1936، ونكبة 1948 ومخيمات اللجوء، بصدق وأداء تمثيلي يلامس الوجدان.`,
    telegramChannelName: 'قناة الدراما العربية التاريخية (@NetFlix_Arabic)',
    telegramChannelUrl: 'https://t.me/NetFlix_Arabic',
    telegramWebPreviewUrl: 'https://t.me/s/NetFlix_Arabic',
    characters: [
      {
        name: 'Abu Saleh',
        arabicName: 'أبو صالح',
        role: 'الأخ الأكبر وقائد ثوار القرية',
        voiceActor: 'جمال سليمان (أداء أسطوري)',
        description: 'رجل شهامة ونضال يقود الفدائيين ويضحي بحياته دفاعاً عن أرضه وكرامة أهله.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      },
      {
        name: 'Abu Ahmad',
        arabicName: 'أبو أحمد (الجد المكافح)',
        role: 'كبير العائلة ورمز التشبث بالأرض',
        voiceActor: 'خالد تاجا (فنان الشعب)',
        description: 'الفلاح العجوز الذي تشهد ملامحه على تجذر الإنسان في أرض آبائه وأجداده.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
      }
    ],
    themeSongs: [
      {
        type: 'شارة البداية',
        title: 'شارة التغريبة الفلسطينية (يا طالعين ع الجبل)',
        artist: 'طارق الناصر (مجموعة رم)',
        youtubeId: 'jVl5Q5L5q8s'
      }
    ],
    episodes: [
      {
        id: 'taghriba-ep-01',
        number: 1,
        title: 'الحلقة 1: أرض القرية وسنوات الانتداب وثقل الديون',
        duration: '48 دقيقة',
        youtubeId: 'jVl5Q5L5q8s',
        telegramUrl: 'https://t.me/NetFlix_Arabic',
        externalWatchUrl: 'https://www.youtube.com/results?search_query=مسلسل+التغريبة+الفلسطينية+الحلقة+1+كاملة',
        servers: [
          { id: 'tag-s1', name: 'سيرفر يوتيوب الرسمي (الشارة والافتتاحية الرسمية HD)', url: 'https://www.youtube-nocookie.com/embed/jVl5Q5L5q8s?autoplay=1&rel=0&modestbranding=1', type: 'youtube', quality: '1080p FHD' },
          { id: 'tag-s2', name: 'سيرفر تيليجرام السحابي (مشاهدة وتحميل مباشر)', url: 'https://t.me/NetFlix_Arabic', type: 'telegram', quality: '1080p FHD' },
          { id: 'tag-s3', name: 'سيرفر البحث والمشاهدة المباشرة للحلقة كاملاً HD', url: 'https://www.youtube.com/results?search_query=مسلسل+التغريبة+الفلسطينية+الحلقة+1+كاملة', type: 'external', quality: 'Web HD' }
        ],
        summary: 'الحلقة الأولى من درة الأعمال الدرامية للمخرج الراحل حاتم علي.',
        airDate: '2004-10-15'
      }
    ]
  }
];
