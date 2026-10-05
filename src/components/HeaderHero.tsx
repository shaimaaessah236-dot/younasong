import React from 'react';
import { Sparkles, Music2 } from 'lucide-react';

export const HeaderHero: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        
        {/* شارة توضيحية أعلى العنوان */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>استوديو الصوتيات النقية</span>
        </div>

        {/* العنوان الرئيسي والعنوان الفرعي */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
            YOUNA SONGS
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-300 tracking-wider flex items-center justify-center gap-2">
            <Music2 className="w-5 h-5 text-amber-400 inline-block" />
            <span>SONGS WITHOUT MUSIC</span>
          </h2>
        </div>

        {/* الوصف المنسق والجميل */}
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm shadow-xl">
          مرحباً بك في استوديو يونا الكوزي! منصة وأرشيف معرفي شامل يقدم تجربة استماع نقية وصافية لشارات الطفولة والأنمي، بالإضافة إلى باقة مختارة من الأغاني العربية والأجنبية (القديمة والحديثة) بصوت بشري خالٍ تماماً من الآلات الموسيقية (<span className="text-amber-400 font-semibold">Vocals Only</span>)، مع توفير أدوات تحليل الموسيقى والـ BPM والتقنيات الصوتية.
        </p>

      </div>
    </header>
  );
};
