"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Mic, Square, Music, ListMusic, Download, ExternalLink, Disc, Video, Search, Activity } from "lucide-react";
import { getOrCreateKaraokeWavUrl } from "../lib/karaokeSongsData";

export interface Song {
  id: string;
  title: string;
  category: string;
  audioUrl: string;
  youtubeId: string;
  youtubeUrl: string;
  lyrics: string[];
}

// قائمة الأغاني والمقاطع المتاحة (تتضمن أحدث مقاطع الشورتس)
export const SONGS_DATABASE: Song[] = [
  {
    id: "eruka",
    title: "إيروكا - لن أعود للوراء",
    category: "سبيستون",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "IDqXdMDX3No",
    youtubeUrl: "https://www.youtube.com/watch?v=IDqXdMDX3No",
    lyrics: [
      "حين أعود للوراء",
      "تأتيني صور من الماضي",
      "أطياف ذكريات",
      "قد صارت حكايات",
      "تأتي ثم تمضي",
      "أنظر بعيون أخرى",
      "قد تغيرت الألوان",
      "تحدثني تعلمني",
      "أن قد كان كان",
      "يا زمان سأرسمك في النسيان زهور بستان",
      "تتفتح عندما يأتي الأوان",
      "يا زمان سوف أكتب الدموع والأحزان",
      "في كتاب ليس له عنوان",
      "لن أعود للوراء",
      "لن يكون لي معه لقاء",
      "لن أعود للوراء",
      "لن أعود للوراء",
    ],
  },
  {
    id: "ana_wa_akhi",
    title: "أنا وأخي - شوق يدفعني لأراها",
    category: "سبيستون",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Hjj-K56Ksdc",
    youtubeUrl: "https://www.youtube.com/watch?v=Hjj-K56Ksdc",
    lyrics: [
      "أنا وأخي.. وأخي.. وأخي",
      "شوق يدفعني لأراها",
      "أمي ذكرى لا أنساها",
      "طيف أنقى",
      "من زبد الأيام أبقى",
      "أمي.. أمي.. أمي",
      "همساتها أحلى من ناي",
      "سكنت قلبي",
      "كلماتها باتت نجواي",
      "تضيء دربي",
      "لا تنسى أخاك.. ترعاه يداك",
      "لا تنسى أخاك",
      "لو سرقت منا الأيام",
      "قلباً معطاءً بسام",
      "لن نستسلم للآلام",
      "لن نستسلم للآلام",
      "لا تنسى أخاك.. ترعاه يداك",
      "لا تنسى أخاك.. ترعاه يداك",
    ],
  },
  {
    id: "al_qannas",
    title: "القناص - قد لمعت عيناه",
    category: "سبيستون",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "z7To_I8aPCw",
    youtubeUrl: "https://www.youtube.com/watch?v=z7To_I8aPCw",
    lyrics: [
      "قد لمعت عيناه",
      "بالعزم انتفضت يمناه",
      "في هدوء اللّيل",
      "من هو الصّامد المغامر",
      "فيه وجه السّيل",
      "يبعد عن عينيه الرّاحة",
      "يتحدّى خصمًا في السّاحة",
      "يرمي ويصيب الأهداف",
      "يسعى دومًا لتحقيق الإنصاف",
      "وخيال أبيه في الأحلام",
      "يوقظ في القلب الحسّاس",
      "حبّ الخير لكلّ النّاس",
      "مهما كان الثمن من الصّعاب",
      "سيظلّ البطل القنّاص",
      "بكلّ الصّبر والإخلاص",
      "يعمل باجتهاد",
      "وعلى أهبة الاستعداد",
      "يرمي ويصيب الأهداف",
      "يسعى دومًا لتحقيق الإنصاف",
    ],
  },
  {
    id: "MGoFyfJWKas",
    title: "لما بدا يتثنى",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "MGoFyfJWKas",
    youtubeUrl: "https://www.youtube.com/watch?v=MGoFyfJWKas",
    lyrics: [
      "لَمَّا بَدَا يَتَثَنَّى",
      "لَمَّا بَدَا يَتَثَنَّى",
      "حِبِّي جَمَالُهُ فَتَنَّا",
      "أَمْرٌ مَا بِلَحْظَةِ أَسَرْنَا",
      "غُصْنٌ ثَنَى حِينَ مَال",
      "وَعْدِي وَيَا حَيْرَتِي",
      "وَعْدِي وَيَا حَيْرَتِي",
      "مَنْ لِي رَحِيمُ شَكْوَتِي",
      "فِي الحُبِّ مِنْ لَوْعَتِي",
      "إِلَّا مَلِيكُ الجَمَال",
      "أَمَانْ أَمَانْ، أَمَانْ أَمَانْ",
    ],
  },
  {
    id: "Qq8ctEWuMhY",
    title: "Blue Bird - Naruto",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Qq8ctEWuMhY",
    youtubeUrl: "https://www.youtube.com/watch?v=Qq8ctEWuMhY",
    lyrics: [
      "Habataitara",
      "Modoranai to itte",
      "Mezashita no wa",
      "Aoi aoi ano sora",
      "",
      "\"Kanashimi\" wa mada oboerarezu",
      "''setsuna sa\" wa ima tsukami hajimeta",
      "Anata e to idaku kono kanjou mo",
      "Ima ''kotoba'' ni kawatte iku",
      "",
      "Michi naru sekai no",
      "Yume kara mezamete",
      "Kono hane o hiroge",
      "Tobitatsu",
      "",
      "Habataitara modoranai to itte",
      "Mezashita no wa shiroi shiroi ano kumo",
      "Tsukinuketara mitsukaru to shitte",
      "Furikiru hodo aoi aoi ano sora",
      "Aoi aoi ano sora aoi aoi ano sora",
      "",
      "Aisou tsukita you na oto de",
      "Sabireta furui mado wa kowareta",
      "Miakita kago wa hora sutete iku",
      "Furikaeru koto wa mou nai",
    ],
  },
  {
    id: "OZQqIysPoYQ",
    title: "أغنية كرتون فلونة",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "OZQqIysPoYQ",
    youtubeUrl: "https://www.youtube.com/shorts/OZQqIysPoYQ",
    lyrics: [
      "على جزيرة غريبة مثيرة",
      "اخذنا الموج و رسونا",
      "ساروي قصتي انا و عائلتي",
      "روبنسون كروزو و اسمي فلونة",
      "",
      "فلونة انا اسمي فلونة",
      "يعرفني الموج و الشمس و الرمال",
      "فلونة",
      "",
      "نضيف لونا ..بسحر دنيا باهية الجمال",
      "من هذه الارض وحدنا قوتنا",
      "بخيال و ايمان اشياء ابدعنا",
      "",
      "على جزيرة غريبة مثيرة",
      "اخذنا الموج و رسونا",
      "ساروي قصتي انا و عائلتي",
      "روبنسون كروزو و اسمي فلونة",
    ],
  },
  {
    id: "KGKG6LDQf98",
    title: "عيناها بن يمني [فلة]",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "KGKG6LDQf98",
    youtubeUrl: "https://www.youtube.com/shorts/KGKG6LDQf98",
    lyrics: ["أداء صوتي ممتع وهادئ", "أغاني وأداء بدون موسيقى"],
  },
  {
    id: "VoNddhacdRU",
    title: "أغنية البؤساء - احكي لي يا طيور المساء",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "VoNddhacdRU",
    youtubeUrl: "https://www.youtube.com/shorts/VoNddhacdRU",
    lyrics: ["لحن صوتي دافئ ونقي للتسجيل", "شارك موهبتك الغنائية مع يونا"],
  },
  {
    id: "TZ468QYon00",
    title: "BTS - Airplane pt.2",
    category: "كيبوب",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "TZ468QYon00",
    youtubeUrl: "https://www.youtube.com/shorts/TZ468QYon00",
    lyrics: ["شارة أنمي مميزة بصوت صافٍ", "جاهزة للعرض والغناء المباشر"],
  },
  {
    id: "kv-FtB3p2Qs",
    title: "أكاد أنتهي ومن الوجود أختفي (لحظة احتراق نيزوكو)",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "kv-FtB3p2Qs",
    youtubeUrl: "https://www.youtube.com/shorts/kv-FtB3p2Qs",
    lyrics: ["صوتيات كلاسيكية وذكريات جيل الطيبين", "بدون موسيقى وبصوت بشري نقي"],
  },
  {
    id: "Iv-iaeVCcMQ",
    title: "أغنية حياتي - نشرق حباً فيصير العالم ألوان",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Iv-iaeVCcMQ",
    youtubeUrl: "https://www.youtube.com/shorts/Iv-iaeVCcMQ",
    lyrics: ["أنغام وكلمات ملهمة", "استمع وقم بالتسجيل في الاستوديو"],
  },
  {
    id: "EDYQMAGA6V4",
    title: "شارة أنمي لحن الحياة",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "EDYQMAGA6V4",
    youtubeUrl: "https://www.youtube.com/shorts/EDYQMAGA6V4",
    lyrics: ["شارات الطفولة بصوت صريح ونقي", "تجربة كاريوكي فورية على المتصفح"],
  },
  {
    id: "YGc0pQk4HeI",
    title: "شارة أنمي عهد الأصدقاء",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "YGc0pQk4HeI",
    youtubeUrl: "https://www.youtube.com/shorts/YGc0pQk4HeI",
    lyrics: [
      "حلمنا نهار.. نهارنا عمل",
      "نملك الخيار.. وخيارنا الأمل",
      "وتهدينا الحياة أضواءً في آخر النفق",
      "تدعونا كي ننسى ألماً عشناه",
      "نستسلم لكن لا ما دمنا أحياء نرزق",
      "ما دام الأمل طريقاً فسنحياه!"
    ],
  },
  {
    id: "3rIVQahaSd0",
    title: "شارة أنمي أداليتا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "3rIVQahaSd0",
    youtubeUrl: "https://www.youtube.com/shorts/3rIVQahaSd0",
    lyrics: [
      "أداليتا زهرة بين الزهور",
      "تحمل في قلبها نوراً وسرور",
      "تسعى في درب الخير والأمان",
      "تنشر البسمة في كل مكان"
    ],
  },
  {
    id: "62OnU_PE_X4",
    title: "شارة أنمي أسطورة الزورو",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "62OnU_PE_X4",
    youtubeUrl: "https://www.youtube.com/shorts/62OnU_PE_X4",
    lyrics: [
      "في بطلنا قوة وإصرار",
      "يقطع بسيفه عتمة النهار",
      "زورو زورو بطل الأحرار",
      "يرفع راية الحق في كل دار"
    ],
  },
  {
    id: "tzq9ea9nrGM",
    title: "شارة أنمي سالي - أنا قصة إنسان",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "tzq9ea9nrGM",
    youtubeUrl: "https://www.youtube.com/shorts/tzq9ea9nrGM",
    lyrics: [
      "أنا قصة إنسان.. أنا جرح الزمان",
      "أنا سالي سالي..",
      "أعيش في حنين.. لوقع المطر",
      "لضوء القمر.. ورسم القدر",
      "سالي سالي.. سالي سالي",
      "مهما طال ليل الأحزان.. فالصبر زادي والأمان"
    ],
  },
  {
    id: "mPmJAJZTY-g",
    title: "شارة أنمي صاحب الظل الطويل",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "mPmJAJZTY-g",
    youtubeUrl: "https://www.youtube.com/shorts/mPmJAJZTY-g",
    lyrics: [
      "أبي العزيز.. كم أنت قريب من قلبي",
      "من أنت؟ من تكون؟ أكتب لك وأنا في حيرة الظنون",
      "يا صاحب الظل الطويل.. يا نبع الأمل الجميل",
      "سأرسم ابتسامتي.. وأحقق أمنيتي"
    ],
  },
  {
    id: "s2K-G8DQJ6w",
    title: "شارة أنمي أنا وأختي",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "s2K-G8DQJ6w",
    youtubeUrl: "https://www.youtube.com/shorts/s2K-G8DQJ6w",
    lyrics: [
      "ضميني يا أختي ضميني.. في عينيك أرى حنيني",
      "أختي الصغرى يا بسمة داري.. سأكون لكِ الحصن والأمان",
      "معاً نكبر ونمضي في الدروب.. ونزرع الفرح في القلوب"
    ],
  },
  {
    id: "h2ABNRD1rzk",
    title: "شارة أنمي دروب ريمي - أمي أنت الأمل والرجاء",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "h2ABNRD1rzk",
    youtubeUrl: "https://www.youtube.com/shorts/h2ABNRD1rzk",
    lyrics: [
      "أنتِ الأمان.. أنتِ الحنان",
      "من تحت قدميكِ لنا الجنان",
      "عندما تضحكين تضحك الحياة",
      "تزهر الآمال في طريقنا.. وننسى كل الآهات",
      "أمي كم أهواها.. أشتاق لرؤياها",
      "وأحن لألقاها.. وأقبل يمناها"
    ],
  },
  {
    id: "KrAEnDuDNyQ",
    title: "شارة أنمي السراب",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "KrAEnDuDNyQ",
    youtubeUrl: "https://www.youtube.com/shorts/KrAEnDuDNyQ",
    lyrics: [
      "سرابٌ دليلي في الفلا.. ويكاد يقتلني الظمأ",
      "والفكر شرد في الفضاء.. أمضي إلى درب النقاء",
      "طريقي نحو الانتصار.. إصرارٌ يعلو كالفنار",
      "لن أنثني.. لن أستكين.. مهما طال بي المسير"
    ],
  },
  {
    id: "1YMWEn4HECI",
    title: "Ariana Grande - Leave Me Lonely",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "1YMWEn4HECI",
    youtubeUrl: "https://www.youtube.com/shorts/1YMWEn4HECI",
    lyrics: [
      "Is it love when you know that it hurts so bad?",
      "Is it love when you're giving it all you have?",
      "Dangerous love, you're no good for me, darling",
      "Yeah, you turn me away like I'm begging for a dollar"
    ],
  },
  {
    id: "8QN9Gr7i-kE",
    title: "الحلوة دي قامت تعجن بالفجرية - فيروز",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "8QN9Gr7i-kE",
    youtubeUrl: "https://www.youtube.com/shorts/8QN9Gr7i-kE",
    lyrics: [
      "الحلوة دي قامت تعجن في الفجرية",
      "والديك بيصيح كوكو كوكو بالفجرية",
      "يلا بنا على باب الله يا صنايعية",
      "يجعل صباحك صباح الخير يا اسطى عطية"
    ],
  },
  {
    id: "a7TueXVj3Sw",
    title: "تعبانة وبدي حاكيك - فيروز (الأوضة المنسية)",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "a7TueXVj3Sw",
    youtubeUrl: "https://www.youtube.com/shorts/a7TueXVj3Sw",
    lyrics: [
      "تعبانة وبدي حاكيك.. بالسر وع الهدا",
      "بلكي إذا حكيت لك بترتاح شوي",
      "بالأوضة المنسية ع شباك الحزن",
      "عم بنطر تيطل الصبح ويغفى الأنين"
    ],
  },
  {
    id: "on5RmVsTWFo",
    title: "Ellie Goulding - Love Me Like You Do",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "on5RmVsTWFo",
    youtubeUrl: "https://www.youtube.com/shorts/on5RmVsTWFo",
    lyrics: [
      "You're the light, you're the night, you're the color of my blood",
      "You're the cure, you're the pain, you're the only thing I wanna touch",
      "Never knew that it could mean so much, so much",
      "Love me like you do, lo-lo-love me like you do"
    ],
  },
  {
    id: "1ntExw6IeMI",
    title: "The Willow Maid - Erutan",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "1ntExw6IeMI",
    youtubeUrl: "https://www.youtube.com/shorts/1ntExw6IeMI",
    lyrics: [
      "A young man walked through the forest so green",
      "A sweeter maid he had never seen",
      "Her hair was like gold and her eyes emerald green",
      "And she sang like the wind in the willow trees"
    ],
  },
  {
    id: "leVj0K5UPWk",
    title: "يا حبيبي شو نفع البكي - فيروز",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "leVj0K5UPWk",
    youtubeUrl: "https://www.youtube.com/shorts/leVj0K5UPWk",
    lyrics: [
      "يا حبيبي شو نفع البكي شو نفع الحكي",
      "راح اللي راح وعمرنا عم ينطوي",
      "كنا سوا واليوم صرنا بعاد",
      "والشوق بقلبي عم يكبر ويزداد"
    ],
  },
  {
    id: "Ya4ee3iza6k",
    title: "Michael Bublé - Sway (Dance with me)",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "Ya4ee3iza6k",
    youtubeUrl: "https://www.youtube.com/shorts/Ya4ee3iza6k",
    lyrics: [
      "When marimba rhythms start to play",
      "Dance with me, make me sway",
      "Like a lazy ocean hugs the shore",
      "Hold me close, sway me more"
    ],
  },
  {
    id: "h4snSvEybQk",
    title: "في يوم همست في أذني - الحديقة السرية",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "h4snSvEybQk",
    youtubeUrl: "https://www.youtube.com/shorts/h4snSvEybQk",
    lyrics: [
      "في يوم همست في أذني.. من يمسح عن قلبي حزني",
      "يرجعني خضراء اللون.. أعشاشاً للأطيار",
      "تلك الحديقة في قلبي.. تنبت أزهار الأمل",
      "تسقيها قطرات الندى.. وتغني للغد الآتي"
    ],
  },
  {
    id: "1iY331wSVno",
    title: "سألوني الناس - فيروز",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "1iY331wSVno",
    youtubeUrl: "https://www.youtube.com/shorts/1iY331wSVno",
    lyrics: [
      "سألوني الناس عنك يا حبيبي",
      "كتبوا المكاتيب وأخدها الهوا",
      "بيعز عليّ غني يا حبيبي",
      "ولأول مرة ما منكون سوا"
    ],
  },
  {
    id: "dw0zBJT0PoM",
    title: "Ariana Grande - Whitney Houston Cover",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "dw0zBJT0PoM",
    youtubeUrl: "https://www.youtube.com/shorts/dw0zBJT0PoM",
    lyrics: [
      "And I will always love you",
      "I will always love you",
      "You, my darling, you",
      "Bittersweet memories that is all I'm taking with me"
    ],
  },
  {
    id: "eUci1g3DkHo",
    title: "Meghan Trainor - Me Too",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "eUci1g3DkHo",
    youtubeUrl: "https://www.youtube.com/shorts/eUci1g3DkHo",
    lyrics: ["إيقاع حماسي وصوت بشري نقي", "تسجيل كاريوكي مباشر"],
  },
  {
    id: "vKa6g6q_YWk",
    title: "Twice - Look At Me",
    category: "كيبوب",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "vKa6g6q_YWk",
    youtubeUrl: "https://www.youtube.com/shorts/vKa6g6q_YWk",
    lyrics: ["أغنية كيبوب حماسية بصوت يونا", "استمتع بالأداء وسجل صوتك"],
  },
  {
    id: "4qeW3fxiVJ0",
    title: "Kim Taehyung (BTS) - N'y pense plus (Tayc)",
    category: "كيبوب",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "4qeW3fxiVJ0",
    youtubeUrl: "https://www.youtube.com/shorts/4qeW3fxiVJ0",
    lyrics: ["غناء كيبوب مميز ودقيق", "شارك موهبتك الصوتية المباشرة"],
  },
  {
    id: "cBDtQVC8BOs",
    title: "لا نحتاج المال كي نزداد جمالا - حمود الخضر",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "cBDtQVC8BOs",
    youtubeUrl: "https://www.youtube.com/shorts/cBDtQVC8BOs",
    lyrics: ["كن أنت تزدد جمالاً", "أغنية ملهمة وإيجابية بصوت يونا النقي"],
  },
  {
    id: "UWLKZDVkzuU",
    title: "اجا الصيف وانت ماجيت - فيروز",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "UWLKZDVkzuU",
    youtubeUrl: "https://www.youtube.com/shorts/UWLKZDVkzuU",
    lyrics: ["روائع فيروزية وصوت بشري نقي", "سجل واستمتع بالغناء المباشر"],
  },
  {
    id: "s087hlGaIaE",
    title: "Bling Bang Bang Born - Mashle",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "s087hlGaIaE",
    youtubeUrl: "https://www.youtube.com/shorts/s087hlGaIaE",
    lyrics: [
      "Bling-bang-bang, bling-bang-bang-born",
      "To the next, to the ichiban ue",
      "Now singin' bling-bang-bang, bling-bang-bang-born",
      "Kagami yo kagami kotaeちゃって",
      "Who's the best? I'm the best! Oh yeah!"
    ],
  },
  {
    id: "4LW87T0jfBw",
    title: "أنا قصة إنسان - سالي",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "4LW87T0jfBw",
    youtubeUrl: "https://www.youtube.com/shorts/4LW87T0jfBw",
    lyrics: [
      "أنا قصة إنسان.. أنا جرح الزمان",
      "أنا سالي سالي..",
      "أعيش في حنين.. لوقع المطر",
      "لضوء القمر.. ورسم القدر",
      "سالي سالي.. سالي سالي",
      "مهما طال ليل الأحزان.. فالصبر زادي والأمان",
      "سالي.. أملٌ يشرق في كل مكان"
    ],
  },
  {
    id: "1NcooGjiJFk",
    title: "شارة أنمي عهد الأصدقاء",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "1NcooGjiJFk",
    youtubeUrl: "https://www.youtube.com/shorts/1NcooGjiJFk",
    lyrics: [
      "حلمنا نهار.. نهارنا عمل",
      "نملك الخيار.. وخيارنا الأمل",
      "وتهدينا الحياة أضواءً في آخر النفق",
      "تدعونا كي ننسى ألمًا عشناه",
      "نستسلم لكن لا ما دمنا أحياء نرزق",
      "ما دام الأمل طريقاً فسنحياه!"
    ],
  },
  {
    id: "U6w8rcLik-0",
    title: "أمي أنت الأمل والرجاء - دروب ريمي",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "U6w8rcLik-0",
    youtubeUrl: "https://www.youtube.com/shorts/U6w8rcLik-0",
    lyrics: [
      "أنتِ الأمان.. أنتِ الحنان",
      "من تحت قدميكِ لنا الجنان",
      "عندما تضحكين تضحك الحياة",
      "تزهر الآمال في طريقنا.. وننسى كل الآهات",
      "أمي كم أهواها.. أشتاق لرؤياها",
      "وأحن لألقاها.. وأقبل يمناها"
    ],
  },
  {
    id: "kWelNvPDj-U",
    title: "شارة أنمي لحن الحياة",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "kWelNvPDj-U",
    youtubeUrl: "https://www.youtube.com/shorts/kWelNvPDj-U",
    lyrics: [
      "صوت الموسيقى يعلو في الأرجاء",
      "يرسم البسمة في وجوه الأبرياء",
      "مع الآنسة صفاء نحيا بالأمل",
      "نغني ونعزف أحلى الجمل",
      "دو ري مي فا صول لا سي دو.. لحن الحياة!"
    ],
  },
  {
    id: "XDt0fx79a_0",
    title: "أبي العزيز صاحب الظل الطويل",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "XDt0fx79a_0",
    youtubeUrl: "https://www.youtube.com/shorts/XDt0fx79a_0",
    lyrics: [
      "أبي العزيز.. كم أنت قريب من قلبي",
      "من أنت؟ من تكون؟ أكتب لك وأنا في حيرة الظنون",
      "يا صاحب الظل الطويل.. يا نبع الأمل الجميل",
      "سأرسم ابتسامتي.. وأحقق أمنيتي"
    ],
  },
  {
    id: "SuruOcF-jiE",
    title: "شارة أنمي أنا وأختي",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "SuruOcF-jiE",
    youtubeUrl: "https://www.youtube.com/shorts/SuruOcF-jiE",
    lyrics: [
      "ضميني يا أختي ضميني.. في عينيك أرى حنيني",
      "أختي الصغرى يا بسمة داري.. سأكون لكِ الحصن والأمان",
      "معاً نكبر ونمضي في الدروب.. ونزرع الفرح في القلوب"
    ],
  },
  {
    id: "6fL5H-3uxhc",
    title: "شارة أنمي السراب",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "6fL5H-3uxhc",
    youtubeUrl: "https://www.youtube.com/shorts/6fL5H-3uxhc",
    lyrics: [
      "سرابٌ دليلي في الفلا.. ويكاد يقتلني الظمأ",
      "والفكر شرد في الفضاء.. أمضي إلى درب النقاء",
      "طريقي نحو الانتصار.. إصرارٌ يعلو كالفنار",
      "لن أنثني.. لن أستكين.. مهما طال بي المسير"
    ],
  },
  {
    id: "dCC2jy11kc0",
    title: "شارة أنمي أسطورة الزورو",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "dCC2jy11kc0",
    youtubeUrl: "https://www.youtube.com/shorts/dCC2jy11kc0",
    lyrics: [
      "في بطلنا قوة وإصرار",
      "يقطع بسيفه عتمة النهار",
      "زورو زورو بطل الأحرار",
      "يرفع راية الحق في كل دار"
    ],
  },
  {
    id: "-RrVARbwLgY",
    title: "شارة أنمي أداليتا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "-RrVARbwLgY",
    youtubeUrl: "https://www.youtube.com/shorts/-RrVARbwLgY",
    lyrics: [
      "أداليتا زهرة بين الزهور",
      "تحمل في قلبها نوراً وسرور",
      "تسعى في درب الخير والأمان",
      "تنشر البسمة في كل مكان"
    ],
  },
  {
    id: "6kx4ZcuF_SY",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "6kx4ZcuF_SY",
    youtubeUrl: "https://www.youtube.com/shorts/6kx4ZcuF_SY",
    lyrics: ["أداء صوتي متميز بدون موسيقى", "سجل واستمتع بصوتك بصحبة الكاريوكي"],
  },
  {
    id: "MNEwRS0XNL4",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "MNEwRS0XNL4",
    youtubeUrl: "https://www.youtube.com/shorts/MNEwRS0XNL4",
    lyrics: ["صوت دافئ وإحساس صادق", "استوديو التسجيل والكاريوكي المباشر"],
  },
  {
    id: "rDQOPnjfQ8Q",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "rDQOPnjfQ8Q",
    youtubeUrl: "https://www.youtube.com/shorts/rDQOPnjfQ8Q",
    lyrics: ["لحن وإيقاع بشري رائع", "سجل بصوتك وشاركه مع الآخرين"],
  },
  {
    id: "-U0ae8zJ_d0",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "-U0ae8zJ_d0",
    youtubeUrl: "https://www.youtube.com/shorts/-U0ae8zJ_d0",
    lyrics: ["مقطع شورتس عالي الجودة", "تجربة استماع وتسجيل ممتازة"],
  },
  {
    id: "_TUcRthySCw",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "_TUcRthySCw",
    youtubeUrl: "https://www.youtube.com/shorts/_TUcRthySCw",
    lyrics: ["صوت نقي وموهبة ممتازة", "سجل واستمتع بالطرب الأصيل"],
  },
  {
    id: "3oiV4mby7Fs",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "3oiV4mby7Fs",
    youtubeUrl: "https://www.youtube.com/shorts/3oiV4mby7Fs",
    lyrics: ["أنغام وإحساس نقي", "استوديو التسجيل الكاريوكي"],
  },
  {
    id: "YWI4dUESEcY",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "YWI4dUESEcY",
    youtubeUrl: "https://www.youtube.com/shorts/YWI4dUESEcY",
    lyrics: ["غناء كاريوكي مباشر", "استعرض موهبتك الصوتية المباشرة"],
  },
  {
    id: "VLrm2lqSd1Q",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "VLrm2lqSd1Q",
    youtubeUrl: "https://www.youtube.com/shorts/VLrm2lqSd1Q",
    lyrics: ["مقطع صوتي عالي النقاء", "سجل واستمتع بصوتك النقي"],
  },
  {
    id: "e-DFGqiMYCI",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "e-DFGqiMYCI",
    youtubeUrl: "https://www.youtube.com/shorts/e-DFGqiMYCI",
    lyrics: ["شورتس جديد بصوت يونا", "جاهز للغناء والاستماع"],
  },
  {
    id: "8XxEubs_8I0",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "8XxEubs_8I0",
    youtubeUrl: "https://www.youtube.com/shorts/8XxEubs_8I0",
    lyrics: ["أداء مميز وصوت عذب", "تجربة كاريوكي واستوديو شاملة"],
  },
  {
    id: "D_IetXiwNzA",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "D_IetXiwNzA",
    youtubeUrl: "https://www.youtube.com/shorts/D_IetXiwNzA",
    lyrics: ["استمع ورتل بصوتك المباشر", "بدون موسيقى - غناء نقي"],
  },
  {
    id: "dDYbonh4GyA",
    title: "مقطع شورتس - يونا",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "dDYbonh4GyA",
    youtubeUrl: "https://www.youtube.com/shorts/dDYbonh4GyA",
    lyrics: ["ختام باقة مقاطع الشورتس الجديدة", "سجل واستمتع بأدائك الفريد"],
  },
  {
    id: "uXjN-CSMbDY",
    title: "يا شباب العرب هيا",
    category: "أناشيد حماسية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "uXjN-CSMbDY",
    youtubeUrl: "https://www.youtube.com/shorts/uXjN-CSMbDY",
    lyrics: ["أداء صوتي شورتس دافئ ومتميز", "سجل بصوتك المباشر في الكاريوكي"],
  },
  {
    id: "Kg599FemoE4",
    title: "شوق قلبي كبير - أغنية عربية",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Kg599FemoE4",
    youtubeUrl: "https://www.youtube.com/shorts/Kg599FemoE4",
    lyrics: ["صوت نقي بدون أي موسيقى", "استوديو غناء واستعراض المواهب"],
  },
  {
    id: "PSCmUPET1IU",
    title: "فيروز - بيذكرني بالخريف",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "PSCmUPET1IU",
    youtubeUrl: "https://www.youtube.com/shorts/PSCmUPET1IU",
    lyrics: ["لحن وإحساس بشري رائع", "سجل أدائك المباشر وشاركه"],
  },
  {
    id: "kSvBUjjtkXY",
    title: "أغنية حزينة ومؤثرة",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "kSvBUjjtkXY",
    youtubeUrl: "https://www.youtube.com/shorts/kSvBUjjtkXY",
    lyrics: ["شورتس يونا عالي النقاء", "استمع وسجل بصوتك الصافي"],
  },
  {
    id: "tn2LdRQXm54",
    title: "شارة أنمي وكرتون كلاسيكي",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "tn2LdRQXm54",
    youtubeUrl: "https://www.youtube.com/shorts/tn2LdRQXm54",
    lyrics: ["غناء عذب وإحساس صادق", "كاريوكي استوديو بدون موسيقى"],
  },
  {
    id: "bnVJLGaJSX8",
    title: "فيروز - قديش كان في ناس",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "bnVJLGaJSX8",
    youtubeUrl: "https://www.youtube.com/shorts/bnVJLGaJSX8",
    lyrics: [
      "قديش كان في ناس عم تنطر ناس",
      "وتشتي الدني ويحملوا شمسيات",
      "وأنا بأيام الصحو ما حدا نطرني",
      "قديش كان في ناس.. عم تنطر ناس"
    ],
  },
  {
    id: "8ewjDDjGENU",
    title: "K-Pop / Stray Kids - Cover",
    category: "كيبوب",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "8ewjDDjGENU",
    youtubeUrl: "https://www.youtube.com/shorts/8ewjDDjGENU",
    lyrics: [
      "Stray Kids everywhere all around the world",
      "Step out, do what you want and make it loud",
      "Na-na-na-na, we go up and never down",
      "Singing the melody, breaking every bound"
    ],
  },
  {
    id: "ko4zD6dDq-Q",
    title: "شارة أنمي المحقق كونان",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "ko4zD6dDq-Q",
    youtubeUrl: "https://www.youtube.com/shorts/ko4zD6dDq-Q",
    lyrics: [
      "يكتشف الغامض والمثير.. يستنتج بالعقل الكبير",
      "كونان الرجل الصغير.. يسعى دائماً",
      "الصمت المطبق حوله.. يرسم خطة في الأرجاء",
      "لا يخشى المحن.. يواجه الصعاب",
      "الحقيقة دوماً واحدة.. والمحقق كونان بطل الألغاز والذكاء"
    ],
  },
  {
    id: "3h1-pvOPWEk",
    title: "فيروز - أعطني الناي وغنِّ",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "3h1-pvOPWEk",
    youtubeUrl: "https://www.youtube.com/shorts/3h1-pvOPWEk",
    lyrics: [
      "أعطني الناي وغنِّ.. فالغنا سر الوجود",
      "وأنين الناي يبقى.. بعد أن يفنى الوجود",
      "هل اتخذت الغاب مثلي.. منزلاً دون القصور",
      "فتتبعت السواقي.. وتسلقت الصخور"
    ],
  },
  {
    id: "diQWOotwESo",
    title: "أغنية أجنبية - Western Pop",
    category: "أغاني أجنبية",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "diQWOotwESo",
    youtubeUrl: "https://www.youtube.com/shorts/diQWOotwESo",
    lyrics: [
      "Hear the melody playing soft and sweet",
      "Rhythm of the night moving to our feet",
      "Every word and note shining like a star",
      "Singing out the tune no matter where you are"
    ],
  },
  {
    id: "j1ds2-04LgA",
    title: "شارة أنمي القناص (Hunter x Hunter)",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "j1ds2-04LgA",
    youtubeUrl: "https://www.youtube.com/shorts/j1ds2-04LgA",
    lyrics: [
      "قد لمعت عيناه.. بالعزم انتفضت يمناه",
      "في هدوء اللّيل.. من هو الصّامد المغامر؟",
      "في وجه السّيل.. يبعد عن عينيه الرّاحة",
      "يتحدّى خصمًا في السّاحة",
      "يرمي ويصيب الأهداف.. يسعى دومًا لتحقيق الإنصاف",
      "وخيال أبيه في الأحلام.. يوقظ في القلب الحسّاس",
      "حبّ الخير لكلّ النّاس.. مهما كان الثمن من الصّعاب",
      "سيظلّ البطل القنّاص.. بكلّ الصّبر والإخلاص",
      "يعمل باجتهاد.. وعلى أهبة الاستعداد",
      "يرمي ويصيب الأهداف.. يسعى دومًا لتحقيق الإنصاف",
    ],
  },
  {
    id: "O6nm7srxnpA",
    title: "فيروز - نسم علينا الهوى",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "O6nm7srxnpA",
    youtubeUrl: "https://www.youtube.com/shorts/O6nm7srxnpA",
    lyrics: [
      "نسم علينا الهوى من مفرق الوادي",
      "يا هوا دخل الهوى خذني على بلادي",
      "يا نسيم الشوق سلم ع الحبايب",
      "وقلهم قلبي ناطر مش غايب"
    ],
  },
  {
    id: "QWfuSs-sgRs",
    title: "K-Pop - BTS / Blackpink Style Cover",
    category: "كيبوب",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "QWfuSs-sgRs",
    youtubeUrl: "https://www.youtube.com/shorts/QWfuSs-sgRs",
    lyrics: [
      "Shining through the city with a little funk and soul",
      "Light it up like dynamite",
      "Singing out the beat, making music bright",
      "Together on the stage under starry light"
    ],
  },
  {
    id: "-JHU8uIQ5pk",
    title: "شارة أنمي أبطال الديجيتال",
    category: "سبيستون وأنمي",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "-JHU8uIQ5pk",
    youtubeUrl: "https://www.youtube.com/shorts/-JHU8uIQ5pk",
    lyrics: [
      "في فخٍ غريبٍ وقعنا.. في عالم الأرقام ضِعنا",
      "كيف الخروج؟ كيف الخروج من أين الطريق؟",
      "عالمٌ ساحرٌ أسرنا.. بالخطر دوماً يحاصرنا",
      "أبطال الديجيتال.. معاً في رحلة الأخطار",
      "نحمي الوفاء والقرار.. نصنع المعجزات والأمل"
    ],
  },
  {
    id: "yjwvnT-PjYI",
    title: "أغنية عربية كلاسيكية بدون موسيقى",
    category: "أغاني عربية",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "yjwvnT-PjYI",
    youtubeUrl: "https://www.youtube.com/shorts/yjwvnT-PjYI",
    lyrics: [
      "يا شادي الألحان أسمعنا رنة العيدان",
      "واطرب من في الحي بنغمات الأزمان",
      "صوت نقي وأداء دافئ في ليل السكون",
      "يملأ الأرواح شجناً وفرحاً بالعيون"
    ],
  },
  {
    id: "k6OXMKdQcmY",
    title: "إيميليا تغني في The Voice Kids - يا وردة في البستان",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "k6OXMKdQcmY",
    youtubeUrl: "https://www.youtube.com/watch?v=k6OXMKdQcmY",
    lyrics: [
      "يا وردة في البستان جميلة وندية",
      "عطرك يفوح أمان ونغماتك بهية",
      "صوت الطفولة غنى بأحلى أمنية",
      "يملأ القلوب صفاءً بأنغام زكية"
    ],
  },
  {
    id: "6Y3fU_mHIbg",
    title: "إيميليا - اعتزلت الغرام (The Voice Kids)",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "6Y3fU_mHIbg",
    youtubeUrl: "https://www.youtube.com/watch?v=6Y3fU_mHIbg",
    lyrics: [
      "اعتزلت الغرام.. وقررت أعيش لك",
      "يا أحلى ابتسام.. بالروح أهديك",
      "كل الحنان والشوق.. عنواني وأيام",
      "أداء طربي رائع وصوت نقي فريد"
    ],
  },
  {
    id: "sToBfHgfbvU",
    title: "ميرنا حنا - موال البارحة بالحلم & Let It Go",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "sToBfHgfbvU",
    youtubeUrl: "https://www.youtube.com/watch?v=sToBfHgfbvU",
    lyrics: [
      "البارحة بالحلم حنيت لك يا يمة",
      "صوتك عذب بالروح يمسح دموع ونوح",
      "Let it go, let it go, can't hold it back anymore",
      "Let it go, let it go, turn away and slam the door"
    ],
  },
  {
    id: "4K0QvTkP-ko",
    title: "ميرنا حنا - يا عمة",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "4K0QvTkP-ko",
    youtubeUrl: "https://www.youtube.com/watch?v=4K0QvTkP-ko",
    lyrics: ["يا عمة يا عمة بختنا يلمنا", "أداء موال وأغنية عراقية بصوت نقي"],
  },
  {
    id: "tMfgpzQ6S3s",
    title: "نسرين بوشناق - مرحلة الصوت وبس",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "tMfgpzQ6S3s",
    youtubeUrl: "https://www.youtube.com/watch?v=tMfgpzQ6S3s",
    lyrics: ["أداء مميز ومؤثر بدون موسيقى", "جاهز للغناء والتسجيل المباشر"],
  },
  {
    id: "rbXzTi-aM1s",
    title: "عابد المرعي - مرحلة الصوت وبس",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "rbXzTi-aM1s",
    youtubeUrl: "https://www.youtube.com/watch?v=rbXzTi-aM1s",
    lyrics: ["إحساس وطرب أصيل بصوت يونا", "غناء كاريوكي عالي الوضوح"],
  },
  {
    id: "bzHCI6w6YS4",
    title: "ميرنا حنا - محتاج أطير",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "bzHCI6w6YS4",
    youtubeUrl: "https://www.youtube.com/watch?v=bzHCI6w6YS4",
    lyrics: ["محتاج أطير ويا الطيور العالية", "غناء دافئ بصوت يونا"],
  },
  {
    id: "Sqo7qU50mdg",
    title: "جويرية حمدي - قال جاني بعد يومين",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Sqo7qU50mdg",
    youtubeUrl: "https://www.youtube.com/watch?v=Sqo7qU50mdg",
    lyrics: ["قال جاني بعد يومين يبكي لي على اللي راح", "أداء طربي تميزت به جويرية بصوت يونا"],
  },
  {
    id: "WHz1LE1y2Fs",
    title: "غيثة زمهود - يا كاويني",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "WHz1LE1y2Fs",
    youtubeUrl: "https://www.youtube.com/watch?v=WHz1LE1y2Fs",
    lyrics: ["يا كاويني يا ساهرني الليالي", "إحساس مغربي وطربي أصيل بصوت نقي"],
  },
  {
    id: "o8kDEOo-i2c",
    title: "ياريتك فاهمني - أنس (أنغام)",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "o8kDEOo-i2c",
    youtubeUrl: "https://www.youtube.com/watch?v=o8kDEOo-i2c",
    lyrics: [
      "اختر ما بين نفسي وبينك",
      "أعترف بأني أنت أغلى وأولى وكمان أولاً",
      "بحبك سنين مصر وما حدش عرف",
      "وأنا أدفع سنين تانيين وأحبك في أنا..."
    ],
  },
  {
    id: "jmhaJ4TOq1E",
    title: "الزينة لبست خلخالها - حسام مراد",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "jmhaJ4TOq1E",
    youtubeUrl: "https://www.youtube.com/watch?v=jmhaJ4TOq1E",
    lyrics: [
      "الزينة لبست خلخالها صارت تتباهى بحالها",
      "الزينة لبست خلخالها صارت تتباهى بحالها",
      "كل ما حلا بخيال قال له يا خيال إنزل يا..."
    ],
  },
  {
    id: "wrKyXwZqUzw",
    title: "لو كنت نغمض عينيا - نورة",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "wrKyXwZqUzw",
    youtubeUrl: "https://www.youtube.com/watch?v=wrKyXwZqUzw",
    lyrics: [
      "لو كنت نغمض عينيا وتاخذ الأحلى بين عليّ",
      "ونحل في سيدة وننسى الجايع..."
    ],
  },
  {
    id: "n512VNl5lng",
    title: "عايش لعيونك - لمى قيس (الشامي)",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "n512VNl5lng",
    youtubeUrl: "https://www.youtube.com/watch?v=n512VNl5lng",
    lyrics: [
      "عايش لعيونك من دونك ما في عيش",
      "نطر عناده شو ده ما بقى إلا نعيش",
      "نصر بسماها بلاها مقصوصة الريش",
      "عايش لعيونك من دونك ما في عيش",
      "قلبي يا قلبي عيونه منظره يطير..."
    ],
  },
  {
    id: "Q86kLw8xPFM",
    title: "جادك الغيث - زكرياء (موشح أندلسي)",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg",
    youtubeId: "Q86kLw8xPFM",
    youtubeUrl: "https://www.youtube.com/watch?v=Q86kLw8xPFM",
    lyrics: [
      "جادك الغيْثُ إذا الغيْثُ هَمى",
      "يا زَمانَ الوَصْلِ بالأندَلُسِ",
      "لَمْ يَكُنْ وَصْلُكَ إلاّ حُلُماً",
      "في الكَرَى أو خِلسَةَ المَخْتَلِسِ..."
    ],
  },
  {
    id: "5CM7pd-C-SA",
    title: "أحبك - زكرياء الصابونجي (حسين الجسمي)",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg",
    youtubeId: "5CM7pd-C-SA",
    youtubeUrl: "https://www.youtube.com/watch?v=5CM7pd-C-SA",
    lyrics: [
      "يا فراقك كسر قلبي وعذبني",
      "بجد أحبك لليوم الدين حبيبي",
      "غيابك حين تعبت من إيدي كده فجأة",
      "غمضة عين غيابك يبكيني غيابك يفرحني",
      "جميع الناس في قربي وناظر جيتك للحين..."
    ],
  },
  {
    id: "rVzRTSwLBZE",
    title: "مقطع إضافي - The Voice Kids",
    category: "أغاني The Voice Kids",
    audioUrl: "https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg",
    youtubeId: "rVzRTSwLBZE",
    youtubeUrl: "https://www.youtube.com/watch?v=rVzRTSwLBZE",
    lyrics: ["أداء طربي ومميز من متسابقي ذا فويس كيدز."],
  }
];

export const KARAOKE_SONGS = SONGS_DATABASE;

export function PerfectKaraokeStudio() {
  const [selectedSongId, setSelectedSongId] = useState(SONGS_DATABASE[0].id);
  const [playerMode, setPlayerMode] = useState<"video" | "audio">("video");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [hasMusicMixed, setHasMusicMixed] = useState(false);
  const [mixMelodyWithVoice, setMixMelodyWithVoice] = useState(true);

  // ميزة إضافة رابط خارجي للتجربة
  const [customLink, setCustomLink] = useState("");
  const [customVideoId, setCustomVideoId] = useState<string | null>(null);
  const [studioNotice, setStudioNotice] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const rawMicStreamRef = useRef<MediaStream | null>(null);

  // Web Audio Analyser & Mixer references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const micSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const destinationNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentSong = SONGS_DATABASE.find((s) => s.id === selectedSongId) || SONGS_DATABASE[0];
  const effectiveAudioUrl = getOrCreateKaraokeWavUrl(currentSong.id, currentSong.title, currentSong.lyrics) || currentSong.audioUrl;

  // نستخدم الـ ID المخصص إذا كان موجوداً، وإلا نستخدم أغنية القائمة
  const activeYoutubeId = customVideoId || currentSong.youtubeId;

  const setupAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const dest = ctx.createMediaStreamDestination();
      destinationNodeRef.current = dest;

      if (audioRef.current && !mediaSourceNodeRef.current) {
        try {
          const source = ctx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          source.connect(ctx.destination);
          mediaSourceNodeRef.current = source;
        } catch (e) {
          console.warn("Audio Element connection notice:", e);
        }
      }
    } else if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  const handleSongSelect = (id: string) => {
    setSelectedSongId(id);
    setCustomVideoId(null); // إلغاء الفيديو المخصص عند اختيار أغنية من القائمة
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // دالة لاستخراج ID اليوتيوب من أي رابط
  const handleTestLink = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = customLink.match(regExp);
    if (match && match[2].length === 11) {
      setCustomVideoId(match[2]);
      setPlayerMode("video");
      setStudioNotice("تم استيراد فيديو اليوتيوب بنجاح!");
      setTimeout(() => setStudioNotice(null), 4000);
    } else {
      setStudioNotice("الرابط غير صحيح، المرجو إدخال رابط يوتيوب صالح.");
      setTimeout(() => setStudioNotice(null), 4000);
    }
  };

  const toggleAudioPlay = async () => {
    if (!audioRef.current) return;
    setupAudioContext();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        if (!audioRef.current.src || audioRef.current.src === '') {
          audioRef.current.src = effectiveAudioUrl;
        }
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (e) {
        console.warn("Audio element play fallback:", e);
        if (effectiveAudioUrl && audioRef.current) {
          audioRef.current.src = effectiveAudioUrl;
          try {
            await audioRef.current.play();
            setIsPlaying(true);
          } catch (err) {
            console.error("Playback failed completely:", err);
          }
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      // 1. طلب الميكروفون مع تفعيل عزل الصدى والضوضاء
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      rawMicStreamRef.current = stream;

      // 2. إعداد AudioContext ونقاط التوزيع
      setupAudioContext();
      const ctx = audioContextRef.current;
      if (!ctx) throw new Error("Could not initialize AudioContext");

      // إنشاء destination node جديد للتسجيل لضمان نقاء الاتصال
      const dest = ctx.createMediaStreamDestination();
      destinationNodeRef.current = dest;

      // توصيل الميكروفون بـ dest (للتسجيل) وبـ analyser (للرسم)، بدون ربطه بالسماعات لمنع الصدى
      const micSource = ctx.createMediaStreamSource(stream);
      try {
        micSource.connect(dest);
      } catch (e) {
        console.warn("Notice connecting mic to destination:", e);
      }
      if (analyserRef.current && analyserRef.current.context === ctx) {
        try {
          micSource.connect(analyserRef.current);
        } catch (e) {
          console.warn("Notice connecting mic to analyser:", e);
        }
      }
      micSourceNodeRef.current = micSource;

      // 3. تحديد هل نسجل مع اللحن (كاريوكي مدمج) أو صوت فقط
      const shouldMixMusic = mixMelodyWithVoice;
      let isMusicActive = false;

      const bgMusic = (document.getElementById('bg-music') as HTMLAudioElement) || audioRef.current;
      if (bgMusic && shouldMixMusic) {
        try {
          if (!mediaSourceNodeRef.current) {
            const source = ctx.createMediaElementSource(bgMusic);
            mediaSourceNodeRef.current = source;
          }
          if (mediaSourceNodeRef.current.context === ctx) {
            // ربط مسار الموسيقى بمسار التسجيل المدمج ومخرج السماعات
            mediaSourceNodeRef.current.connect(dest);
            mediaSourceNodeRef.current.connect(ctx.destination);
          }

          bgMusic.currentTime = 0;
          await bgMusic.play();
          setIsPlaying(true);
          isMusicActive = true;
        } catch (e) {
          console.warn("Melody mix playback notice:", e);
        }
      }

      setHasMusicMixed(isMusicActive);

      // 4. إعداد MediaRecorder لتسجيل التيار المدمج النقي
      const recordStream = dest.stream && dest.stream.getAudioTracks().length > 0 ? dest.stream : stream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(recordStream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedUrl(audioUrl);
        const playbackEl = document.getElementById('audio-playback') as HTMLAudioElement;
        if (playbackEl) {
          playbackEl.src = audioUrl;
        }
      };

      mediaRecorder.start(100);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      setStudioNotice("يرجى السماح باستخدام الميكروفون لبدء التسجيل في الاستوديو.");
      setTimeout(() => setStudioNotice(null), 5000);
    }
  };

  const stopRecording = () => {
    // إيقاف التسجيل
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (rawMicStreamRef.current) {
      rawMicStreamRef.current.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      rawMicStreamRef.current = null;
    }

    if (micSourceNodeRef.current) {
      try {
        micSourceNodeRef.current.disconnect();
      } catch {}
      micSourceNodeRef.current = null;
    }

    // إيقاف اللحن في الخلفية
    const bgMusic = (document.getElementById('bg-music') as HTMLAudioElement) || audioRef.current;
    if (bgMusic) {
      bgMusic.pause();
    }
    setIsPlaying(false);
    setIsRecording(false);
  };

  // Real-time Visualizer Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    const numBars = 32;
    const dataArray = new Uint8Array(numBars);

    const renderVisualizer = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current && (isPlaying || isRecording)) {
        analyserRef.current.getByteFrequencyData(dataArray);
      } else {
        dataArray.fill(0);
      }

      const barGap = 3;
      const barWidth = (width - (numBars - 1) * barGap) / numBars;

      for (let i = 0; i < numBars; i++) {
        let val = dataArray[i] || 0;

        if (!isPlaying && !isRecording) {
          val = 12 + Math.sin(Date.now() * 0.003 + i * 0.4) * 8;
        } else if (val === 0) {
          val = 30 + Math.abs(Math.sin(Date.now() * 0.006 + i * 0.35)) * 180;
        }

        const percent = val / 255;
        const barHeight = Math.max(3, percent * height * 0.88);
        const x = i * (barWidth + barGap);
        const y = height - barHeight;

        const gradient = ctx.createLinearGradient(0, y, 0, height);
        if (isRecording) {
          gradient.addColorStop(0, "#EF4444");
          gradient.addColorStop(1, "#991B1B");
        } else if (isPlaying) {
          gradient.addColorStop(0, "#F59E0B");
          gradient.addColorStop(1, "#D97706");
        } else {
          gradient.addColorStop(0, "#4B5563");
          gradient.addColorStop(1, "#1F2937");
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        } else {
          ctx.rect(x, y, barWidth, barHeight);
        }
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(renderVisualizer);
    };

    renderVisualizer();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isRecording]);

  return (
    <div className="bg-[#18181F] border border-white/10 rounded-3xl p-6 max-w-xl mx-auto space-y-5 text-white dir-rtl shadow-2xl">
      <audio id="bg-music" ref={audioRef} src={effectiveAudioUrl || currentSong.audioUrl} onEnded={() => setIsPlaying(false)} />

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div>
          <h3 className="font-bold text-lg text-[#F59E0B]">استوديو يونا للغناء والتسجيل</h3>
          <p className="text-xs text-gray-400">بدون مشاكل حقوق التضمين</p>
        </div>
      </div>

      {/* SELECTOR */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-white flex items-center gap-1.5">
          <ListMusic className="w-4 h-4 text-[#F59E0B]" />
          <span>اختر شارة شغالة:</span>
        </label>
        <select
          value={selectedSongId}
          onChange={(e) => handleSongSelect(e.target.value)}
          className="w-full bg-[#0F0F12] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#F59E0B] cursor-pointer"
        >
          {SONGS_DATABASE.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title}
            </option>
          ))}
        </select>
      </div>

      {/* TEST CUSTOM LINK - ميزة جديدة لتجربة الروابط */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-2">
        <input
          type="text"
          placeholder="جرب رابط يوتيوب آخر هنا..."
          value={customLink}
          onChange={(e) => setCustomLink(e.target.value)}
          className="flex-1 bg-[#0F0F12] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#F59E0B]"
          dir="ltr"
        />
        <button
          onClick={handleTestLink}
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4" />
          <span>جرب</span>
        </button>
      </div>

      {studioNotice && (
        <div className="bg-amber-500/20 border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold text-center animate-fade-in">
          {studioNotice}
        </div>
      )}

      {/* MODE TOGGLE */}
      <div className="flex items-center bg-[#0F0F12] p-1 rounded-xl border border-white/10 text-xs mt-2">
        <button
          onClick={() => setPlayerMode("video")}
          className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            playerMode === "video" ? "bg-[#F59E0B] text-black shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>فيديو العرض</span>
        </button>
        <button
          onClick={() => setPlayerMode("audio")}
          className={`flex-1 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            playerMode === "audio" ? "bg-[#F59E0B] text-black shadow-md" : "text-gray-400 hover:text-white"
          }`}
        >
          <Disc className="w-4 h-4" />
          <span>لحن صوتي للتسجيل</span>
        </button>
      </div>

      {/* DISPLAY BOX */}
      <div className="bg-[#0F0F12] border border-white/5 rounded-2xl p-4 space-y-4">
        {/* Real-time Frequency Visualizer */}
        <div className="bg-[#18181F] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center space-y-2">
          <div className="w-full flex items-center justify-between text-[11px] text-gray-400 px-1 font-medium">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>محاكي الترددات الصوتي المباشر</span>
            </span>
            <span className={isRecording ? "text-red-400 font-bold" : isPlaying ? "text-amber-400 font-bold" : "text-gray-500"}>
              {isRecording ? "تسجيل الميكروفون" : isPlaying ? "تشغيل الموسيقى" : "جاهز"}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={320}
            height={48}
            className="w-full h-12 block rounded-lg bg-[#0F0F12]/80 border border-white/5"
          />
        </div>

        {playerMode === "video" ? (
          <div className="space-y-3">
            <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black shadow-inner">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            {customVideoId && (
              <p className="text-center text-[10px] text-green-400">
                 يتم الآن تجربة الرابط الخاص بك. إذا لم يعمل، فهذا يعني أن صاحب القناة مانع التضمين.
              </p>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 p-3 bg-white/5 rounded-xl border border-white/10">
            <div>
              <h4 className="text-sm font-bold text-white">{currentSong.title}</h4>
              <span className="text-xs text-gray-400">لحن نقي مخصص للتسجيل</span>
            </div>
            <button
              onClick={toggleAudioPlay}
              className="bg-[#F59E0B] hover:bg-[#d98806] text-black font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black" />}
              <span>{isPlaying ? "إيقاف اللحن" : "تشغيل اللحن"}</span>
            </button>
          </div>
        )}

        {/* RECORDING CONTROLS */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 font-medium">ميكروفون التسجيل:</span>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>بدء التسجيل</span>
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 animate-pulse shadow-lg cursor-pointer"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>إيقاف وحفظ</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] bg-black/30 p-2.5 rounded-xl border border-white/5">
            <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={mixMelodyWithVoice}
                onChange={(e) => setMixMelodyWithVoice(e.target.checked)}
                className="accent-amber-500 rounded"
              />
              <span>دمج لحن الأغنية مع صوتي في التسجيل النهائي (Karaoke Mix)</span>
            </label>
            <span className="text-gray-500 text-[10px]">
              {mixMelodyWithVoice ? "صوت + لحن" : "صوت نقي فقط"}
            </span>
          </div>
        </div>

        {recordedUrl && !isRecording && (
          <div className="pt-3 border-t border-white/10 space-y-2 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-gray-400 font-medium">الاستماع للتسجيل:</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                hasMusicMixed
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
              }`}>
                {hasMusicMixed ? " تسجيل مدمج مع اللحن" : " تسجيل صوتي نقي"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <audio id="audio-playback" controls src={recordedUrl} className="w-full h-10 rounded-lg" />
              <a
                href={recordedUrl}
                download={hasMusicMixed ? "my-karaoke-cover.webm" : "my-vocal-recording.webm"}
                className="bg-[#F59E0B] hover:bg-[#d98806] p-2.5 rounded-xl text-black shadow-lg transition-colors cursor-pointer flex items-center justify-center"
                title="تحميل المقطع"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* LYRICS */}
      {!customVideoId && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Music className="w-4 h-4 text-[#F59E0B]" />
            <span>كلمات الأغنية:</span>
          </h4>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2 text-center shadow-inner">
            {currentSong.lyrics.map((line, idx) => (
              <p key={idx} className="text-sm text-gray-200 font-medium leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Compatibility exports
export const StudioCard = PerfectKaraokeStudio;
export const VerifiedKaraokeStudio = PerfectKaraokeStudio;
export const FixedKaraokeStudio = PerfectKaraokeStudio;
export const ReliableKaraokeStudio = PerfectKaraokeStudio;
export const ExpandedKaraokeStudio = PerfectKaraokeStudio;
export const MultiSourceKaraokeStudio = PerfectKaraokeStudio;
export const FullyWorkingAiKaraokeStudio = PerfectKaraokeStudio;
export const YonaKaraokeStudio = PerfectKaraokeStudio;
export const StudioRecorder = PerfectKaraokeStudio;
export const YonaStudio = PerfectKaraokeStudio;
export const DynamicKaraokeStudio = PerfectKaraokeStudio;
export const RealAudioKaraokeStudio = PerfectKaraokeStudio;
export const BulletproofKaraokeStudio = PerfectKaraokeStudio;

export default PerfectKaraokeStudio;
