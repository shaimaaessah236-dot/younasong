import React, { useState, useMemo } from 'react';
import { Recording } from '../types';
import { RecordingCard } from './RecordingCard';
import { ChevronLeft, ChevronRight, Sparkles, Grid, LayoutGrid, Music } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TwoRowCarouselProps {
  recordings: Recording[];
  onSelectRecording: (rec: Recording) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  title?: string;
  onResetFilters?: () => void;
}

export const TwoRowCarousel: React.FC<TwoRowCarouselProps> = ({
  recordings,
  onSelectRecording,
  isFavorite,
  onToggleFavorite,
  title,
  onResetFilters
}) => {
  const { language, isRtl, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState<'matrix' | 'grid'>('matrix');

  // 6 items per slide view (3 Top Row, 3 Bottom Row)
  const itemsPerPage = 6;
  const totalPages = Math.max(1, Math.ceil(recordings.length / itemsPerPage));

  // Current batch of 6 recordings for the active slide page
  const currentBatch = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return recordings.slice(start, start + itemsPerPage);
  }, [recordings, currentPage, itemsPerPage]);

  // Split the 6 items into Row 1 (top 3) and Row 2 (bottom 3)
  const topRowItems = currentBatch.slice(0, 3);
  const bottomRowItems = currentBatch.slice(3, 6);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (recordings.length === 0) {
    return (
      <div className="p-12 rounded-3xl yona-glass text-center space-y-3 my-8 border border-white/[0.08]">
        <Music className="w-10 h-10 text-teal-300 mx-auto opacity-60" />
        <h3 className="text-base font-bold text-white">{t('gridNoResultsTitle')}</h3>
        <p className="text-xs text-slate-400">{t('gridNoResultsDesc')}</p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-300 text-slate-950 font-bold text-xs hover:brightness-110 transition-all cursor-pointer shadow-md"
          >
            {t('gridResetBtn')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="recordings-grid" className="space-y-4 relative">
      {/* Header Bar: Title, Page Status, View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0d1424]/80 p-3.5 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-400/15 border border-teal-400/30 flex items-center justify-center text-teal-300 shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-teal-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black font-tajawal text-white flex items-center gap-2">
              <span>{title || (language === 'ar' ? 'ألبوم شارات وأغاني Yona Songs' : 'Yona Songs Tracks Album')}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400/15 text-sky-200 font-mono text-[11px] font-bold border border-sky-300/30">
                {recordings.length}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? `عرض ${itemsPerPage} أغاني (سطرين × 3 أعمدة) للتصفح السريع والسهل`
                : `Showing 6 tracks matrix (2 rows x 3 columns) for seamless browsing`}
            </p>
          </div>
        </div>

        {/* View Switcher & Page Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          {/* Page Counter Indicator */}
          {viewMode === 'matrix' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <span className="text-sky-200">{currentPage + 1}</span>
              <span className="text-slate-500">/</span>
              <span>{totalPages}</span>
            </div>
          )}

          {/* View Mode Switcher Button */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'matrix'
                  ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-300 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={language === 'ar' ? 'عرض السطرين المزدوج (2-Rows Matrix)' : 'Matrix View'}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض سطرين (2-Rows)' : 'Matrix'}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-300 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={language === 'ar' ? 'عرض الشبكة العامة (Full Grid)' : 'Full Grid'}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الشبكة الكلية' : 'Grid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: MATRIX CAROUSEL (2 ROWS x 3 COLUMNS = 6 VISIBLE ITEMS AT A TIME) */}
      {viewMode === 'matrix' && (
        <div className="relative group px-1 sm:px-2 no-scrollbar">
          {/* Side Navigation Arrow - START SIDE (Previous: Right in RTL, Left in LTR) */}
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`absolute ${isRtl ? 'right-1 sm:-right-4' : 'left-1 sm:-left-4'} top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0a0f1d]/90 hover:bg-[#121c2e] border-2 border-sky-300/50 hover:border-sky-200 text-sky-200 flex items-center justify-center shadow-2xl shadow-black/90 backdrop-blur-xl transition-all hover:scale-110 cursor-pointer disabled:opacity-25 disabled:pointer-events-none disabled:hover:scale-100`}
            title={language === 'ar' ? 'السابق (الرجوع للخلف)' : 'Previous'}
          >
            {isRtl ? <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" /> : <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>

          {/* Side Navigation Arrow - END SIDE (Next: Left in RTL, Right in LTR) */}
          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className={`absolute ${isRtl ? 'left-1 sm:-left-4' : 'right-1 sm:-right-4'} top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#0a0f1d]/90 hover:bg-[#121c2e] border-2 border-sky-300/50 hover:border-sky-200 text-sky-200 flex items-center justify-center shadow-2xl shadow-black/90 backdrop-blur-xl transition-all hover:scale-110 cursor-pointer disabled:opacity-25 disabled:pointer-events-none disabled:hover:scale-100`}
            title={language === 'ar' ? 'التالي (6 عناصر جديدة)' : 'Next (6 new tracks)'}
          >
            {isRtl ? <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" /> : <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>

          {/* Two-Row Matrix Display Area with Smooth Animation */}
          <div className="space-y-4 sm:space-y-6 overflow-hidden py-1 no-scrollbar">
            {/* ROW 1: TOP ROW (3 ITEMS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-500 animate-in fade-in slide-in-from-right-4">
              {topRowItems.map((rec) => (
                <RecordingCard
                  key={rec.id}
                  recording={rec}
                  onSelect={onSelectRecording}
                  isFavorite={isFavorite(rec.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>

            {/* ROW 2: BOTTOM ROW (3 ITEMS) */}
            {bottomRowItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 transition-all duration-500 animate-in fade-in slide-in-from-left-4">
                {bottomRowItems.map((rec) => (
                  <RecordingCard
                    key={rec.id}
                    recording={rec}
                    onSelect={onSelectRecording}
                    isFavorite={isFavorite(rec.id)}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination Indicators (Dots & Page Bar) */}
          <div className="pt-4 flex items-center justify-center gap-2 flex-wrap">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentPage === idx
                    ? 'w-8 bg-gradient-to-r from-teal-300 to-sky-300 shadow-lg shadow-sky-300/40'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
                }`}
                title={`الصفحة ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* MODE 2: FULL GRID VIEW */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in duration-300">
          {recordings.map((rec) => (
            <RecordingCard
              key={rec.id}
              recording={rec}
              onSelect={onSelectRecording}
              isFavorite={isFavorite(rec.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
};
