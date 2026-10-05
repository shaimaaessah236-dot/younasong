import React from 'react';
import { Sliders, RotateCcw, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FilterPanelProps {
  query: string;
  setQuery: (q: string) => void;
  categorySlug: string;
  setCategorySlug: (c: string) => void;
  vocalGender: string;
  setVocalGender: (v: string) => void;
  recordingType: string;
  setRecordingType: (r: string) => void;
  bpmMin: number;
  setBpmMin: (b: number) => void;
  bpmMax: number;
  setBpmMax: (b: number) => void;
  onReset: () => void;
  totalResultsCount: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  query,
  setQuery,
  categorySlug,
  setCategorySlug,
  vocalGender,
  setVocalGender,
  recordingType,
  setRecordingType,
  bpmMin,
  setBpmMin,
  bpmMax,
  setBpmMax,
  onReset,
  totalResultsCount,
}) => {
  const { language, isRtl, t } = useLanguage();

  return (
    <div className="yona-glass rounded-2xl p-5 border border-white/[0.08] space-y-4 mb-6 bg-[#0e1422]/70 backdrop-blur-md">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-teal-300" />
          <h2 className={`font-bold text-sm sm:text-base text-slate-100 ${isRtl ? 'font-tajawal' : 'font-sans'}`}>
            {t('filtersTitle')}
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-400/15 text-teal-200 border border-teal-400/30 text-xs font-mono font-bold">
            {totalResultsCount} {t('filtersResults')}
          </span>
        </div>

        <button
          onClick={onReset}
          className="text-xs text-slate-400 hover:text-sky-200 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t('filtersReset')}</span>
        </button>
      </div>

      {/* Grid of Faceted Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
        {/* Category Select */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold block">{t('filterCategoryLabel')}</label>
          <select
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0a0d14]/80 border border-white/[0.1] text-slate-200 focus:border-sky-300/60 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">{t('catAll')}</option>
            <option value="the-voice-kids">{t('catVoiceKids')}</option>
            <option value="spacetoon">{t('catSpacetoon')}</option>
            <option value="anime">{language === 'ar' ? 'شارات الأنمي المترجمة' : 'Anime Soundtracks (Sub/Dub)'}</option>
            <option value="arabic-songs">{t('catArabic')}</option>
            <option value="foreign-songs">{t('catForeign')}</option>
            <option value="nasheed-kids">{t('catNasheed')}</option>
            <option value="vocal-cover">{t('catCover')}</option>
          </select>
        </div>

        {/* Vocal Type */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold block">{t('filterVocalGenderLabel')}</label>
          <select
            value={vocalGender}
            onChange={(e) => setVocalGender(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0a0d14]/80 border border-white/[0.1] text-slate-200 focus:border-sky-300/60 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">{t('filterAllGenders')}</option>
            <option value="Female">{t('filterFemale')}</option>
            <option value="Male">{t('filterMale')}</option>
            <option value="Choir">{t('filterChoir')}</option>
            <option value="Duet">{t('filterDuet')}</option>
          </select>
        </div>

        {/* Recording Type */}
        <div className="space-y-1.5">
          <label className="text-slate-400 font-bold block">{t('filterRecordingTypeLabel')}</label>
          <select
            value={recordingType}
            onChange={(e) => setRecordingType(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0a0d14]/80 border border-white/[0.1] text-slate-200 focus:border-sky-300/60 focus:outline-none transition-colors cursor-pointer"
          >
            <option value="all">{t('filterAllTypes')}</option>
            <option value="vocals_only">{language === 'ar' ? 'بدون موسيقى (Vocals Only)' : 'Pure Acapella (Vocals Only)'}</option>
            <option value="original">{language === 'ar' ? 'أصلي سبيستون' : 'Original Spacetoon Classic'}</option>
            <option value="cover">{language === 'ar' ? 'غطاء صوتي (Cover)' : 'Vocal Cover'}</option>
          </select>
        </div>

        {/* BPM Range Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 font-bold">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-300" />
              <span>{t('filterBpmRangeLabel')}</span>
            </span>
            <span className="text-sky-200 font-mono font-bold">{bpmMin} - {bpmMax} BPM</span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="range"
              min="60"
              max="180"
              step="5"
              value={bpmMax}
              onChange={(e) => setBpmMax(Number(e.target.value))}
              className="w-full accent-sky-300 bg-[#0a0d14] rounded-lg cursor-pointer h-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
