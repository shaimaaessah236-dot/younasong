import React from 'react';
import {
  Sparkles,
  Play,
  Mic,
  Headphones,
  Flame,
  ArrowLeft,
  ArrowRight,
  Radio,
  Trophy,
  Award,
  Heart,
  HelpCircle,
  Tv,
  ShoppingBag
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import heroStudioImg from '../assets/images/youna_hero_studio_1786817607844.jpg';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeroBannerProps {
  onExploreClick: () => void;
  onToolsClick: () => void;
  onTelegramClick?: () => void;
  onStudioClick?: () => void;
  onPassportClick?: () => void;
  onTvClick?: () => void;
  onContestClick?: () => void;
  onQuizClick?: () => void;
  onDedicationsClick?: () => void;
  onStoreClick?: () => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onStudioClick,
  onPassportClick,
  onTvClick,
  onContestClick,
  onQuizClick,
  onDedicationsClick,
  onStoreClick,
  selectedCategory,
  setSelectedCategory,
}) => {
  const { isDarkMode } = useTheme();
  const { language, isRtl, t } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl mb-8 p-6 sm:p-10 lg:p-12 transition-colors duration-300 ${
        isDarkMode
          ? 'bg-[#090e18] border border-white/[0.08] shadow-2xl text-white'
          : 'bg-white border border-slate-200/90 shadow-xl text-slate-900'
      }`}
    >
      {/* Immersive Atmospheric Cinematic Backdrop */}
      <div
        className={`absolute inset-0 bg-cover bg-center pointer-events-none scale-105 blur-md ${
          isDarkMode ? 'opacity-15' : 'opacity-5'
        }`}
        style={{ backgroundImage: `url(${heroStudioImg})` }}
      />
      {isDarkMode ? (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090e18]/70 via-[#090e18]/90 to-[#090e18] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-cyan-100/30 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/90 to-white pointer-events-none" />
        </>
      )}

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
        {/* Top Tagline Badge - Turquoise Green & White */}
        <div
          className={`relative inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full backdrop-blur-md overflow-hidden group border transition-all ${
            isDarkMode
              ? 'bg-teal-950/60 border-teal-400/40 shadow-[0_0_20px_rgba(45,212,191,0.25)] text-white'
              : 'bg-teal-50/90 border-teal-300 shadow-sm text-slate-900'
          }`}
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none w-1/3" />

          <Sparkles
            className={`w-3.5 h-3.5 animate-pulse flex-shrink-0 ${
              isDarkMode ? 'text-teal-300' : 'text-teal-600'
            }`}
          />
          <span
            className={`text-xs sm:text-sm font-black tracking-wide ${
              isDarkMode
                ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                : 'text-teal-900'
            }`}
          >
            {t('heroTagline')}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block flex-shrink-0 ${
              isDarkMode ? 'bg-teal-300 shadow-[0_0_8px_#2dd4bf]' : 'bg-teal-500 shadow-[0_0_8px_#14b8a6]'
            }`}
          />
          <span
            className={`px-2 py-0.5 rounded-full font-extrabold text-[10px] font-mono uppercase tracking-wider border shadow-sm flex-shrink-0 ${
              isDarkMode
                ? 'bg-teal-400/20 text-teal-100 border-teal-400/40'
                : 'bg-teal-600 text-white border-teal-600'
            }`}
          >
            Vocals Only
          </span>
        </div>

        {/* Poetic & Cinematic Title - Pure White into Turquoise Gradient */}
        <div className="space-y-4">
          <h1
            className={`text-3xl sm:text-5xl lg:text-6xl font-black ${
              isRtl ? 'font-tajawal' : 'font-sans'
            } tracking-tight leading-[1.25] drop-shadow-sm ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t('heroTitleMain')}{' '}
            <br className="hidden sm:inline" />
            <span
              className={`text-transparent bg-clip-text ${
                isDarkMode
                  ? 'bg-gradient-to-r from-white via-cyan-200 to-teal-300'
                  : 'bg-gradient-to-r from-teal-800 via-teal-600 to-cyan-600'
              }`}
            >
              {t('heroTitleGradient')}
            </span>
          </h1>

          <p
            className={`text-sm sm:text-base leading-relaxed max-w-3xl mx-auto font-medium ${
              isDarkMode ? 'text-slate-200' : 'text-slate-600'
            }`}
          >
            {t('heroDesc')}
          </p>

          {/* Audio Waveform Accent */}
          <div className="flex items-center justify-center pt-1">
            <div className="flex items-center gap-2 opacity-85">
              <Radio
                className={`w-4 h-4 animate-pulse ${
                  isDarkMode ? 'text-teal-300' : 'text-teal-600'
                }`}
              />
              <span
                className={`text-xs font-mono font-bold ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {t('heroWaveformText')}
              </span>
              <AudioVisualizer className="scale-90" />
            </div>
          </div>

          {/* Interactive Features Grid: Contest, Quiz, Passport, CRT TV, Store */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-6xl mx-auto w-full pt-2">
            {/* 1. Grand Contest */}
            {onContestClick && (
              <div
                onClick={onContestClick}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isRtl ? 'text-right' : 'text-left'
                } overflow-hidden hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'bg-[#0c1424]/85 hover:bg-[#101c30]/95 border-white/10 hover:border-teal-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                    : 'bg-slate-50/90 hover:bg-teal-50/50 border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                      isDarkMode
                        ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                        : 'bg-teal-100 border-teal-200 text-teal-800'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      isDarkMode
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {t('featureContestBadge')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3
                    className={`font-bold text-sm transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-teal-200'
                        : 'text-slate-900 group-hover:text-teal-800'
                    }`}
                  >
                    {t('featureContestTitle')}
                  </h3>
                  <p
                    className={`text-[11px] font-normal line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t('featureContestDesc')}
                  </p>
                </div>
                <div
                  className={`self-end flex items-center gap-1 text-[11px] font-bold ${
                    isDarkMode
                      ? 'text-teal-300 group-hover:text-white'
                      : 'text-teal-700 group-hover:text-teal-900'
                  }`}
                >
                  <span>{t('featureContestBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {/* 2. Theme Quiz */}
            {onQuizClick && (
              <div
                onClick={onQuizClick}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isRtl ? 'text-right' : 'text-left'
                } overflow-hidden hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'bg-[#0c1424]/85 hover:bg-[#101c30]/95 border-white/10 hover:border-teal-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                    : 'bg-slate-50/90 hover:bg-teal-50/50 border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                      isDarkMode
                        ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                        : 'bg-teal-100 border-teal-200 text-teal-800'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      isDarkMode
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {t('featureQuizBadge')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3
                    className={`font-bold text-sm transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-teal-200'
                        : 'text-slate-900 group-hover:text-teal-800'
                    }`}
                  >
                    {t('featureQuizTitle')}
                  </h3>
                  <p
                    className={`text-[11px] font-normal line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t('featureQuizDesc')}
                  </p>
                </div>
                <div
                  className={`self-end flex items-center gap-1 text-[11px] font-bold ${
                    isDarkMode
                      ? 'text-teal-300 group-hover:text-white'
                      : 'text-teal-700 group-hover:text-teal-900'
                  }`}
                >
                  <span>{t('featureQuizBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {/* 3. Spacetoon Passport */}
            {onPassportClick && (
              <div
                onClick={onPassportClick}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isRtl ? 'text-right' : 'text-left'
                } overflow-hidden hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'bg-[#0c1424]/85 hover:bg-[#101c30]/95 border-white/10 hover:border-teal-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                    : 'bg-slate-50/90 hover:bg-teal-50/50 border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                      isDarkMode
                        ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                        : 'bg-teal-100 border-teal-200 text-teal-800'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      isDarkMode
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {t('featurePassportBadge')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3
                    className={`font-bold text-sm transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-teal-200'
                        : 'text-slate-900 group-hover:text-teal-800'
                    }`}
                  >
                    {t('featurePassportTitle')}
                  </h3>
                  <p
                    className={`text-[11px] font-normal line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t('featurePassportDesc')}
                  </p>
                </div>
                <div
                  className={`self-end flex items-center gap-1 text-[11px] font-bold ${
                    isDarkMode
                      ? 'text-teal-300 group-hover:text-white'
                      : 'text-teal-700 group-hover:text-teal-900'
                  }`}
                >
                  <span>{t('featurePassportBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {/* 4. Retro TV */}
            {onTvClick && (
              <div
                onClick={onTvClick}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isRtl ? 'text-right' : 'text-left'
                } overflow-hidden hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'bg-[#0c1424]/85 hover:bg-[#101c30]/95 border-white/10 hover:border-teal-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                    : 'bg-slate-50/90 hover:bg-teal-50/50 border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                      isDarkMode
                        ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                        : 'bg-teal-100 border-teal-200 text-teal-800'
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      isDarkMode
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {t('featureTvBadge')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3
                    className={`font-bold text-sm transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-teal-200'
                        : 'text-slate-900 group-hover:text-teal-800'
                    }`}
                  >
                    {t('featureTvTitle')}
                  </h3>
                  <p
                    className={`text-[11px] font-normal line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t('featureTvDesc')}
                  </p>
                </div>
                <div
                  className={`self-end flex items-center gap-1 text-[11px] font-bold ${
                    isDarkMode
                      ? 'text-teal-300 group-hover:text-white'
                      : 'text-teal-700 group-hover:text-teal-900'
                  }`}
                >
                  <span>{t('featureTvBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}

            {/* 5. Official Store & Books */}
            {onStoreClick && (
              <div
                onClick={onStoreClick}
                className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between gap-2.5 ${
                  isRtl ? 'text-right' : 'text-left'
                } overflow-hidden hover:-translate-y-0.5 ${
                  isDarkMode
                    ? 'bg-[#0c1424]/85 hover:bg-[#101c30]/95 border-white/10 hover:border-teal-400/50 shadow-lg hover:shadow-[0_0_20px_rgba(45,212,191,0.18)]'
                    : 'bg-slate-50/90 hover:bg-teal-50/50 border-slate-200 hover:border-teal-300 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition-all ${
                      isDarkMode
                        ? 'bg-teal-400/15 border-teal-400/30 text-teal-300 group-hover:bg-teal-400 group-hover:text-slate-950'
                        : 'bg-teal-100 border-teal-200 text-teal-800'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                      isDarkMode
                        ? 'bg-white/10 text-white border-white/20'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}
                  >
                    {t('featureStoreBadge')}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <h3
                    className={`font-bold text-sm transition-colors ${
                      isDarkMode
                        ? 'text-white group-hover:text-teal-200'
                        : 'text-slate-900 group-hover:text-teal-800'
                    }`}
                  >
                    {t('featureStoreTitle')}
                  </h3>
                  <p
                    className={`text-[11px] font-normal line-clamp-2 leading-relaxed ${
                      isDarkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {t('featureStoreDesc')}
                  </p>
                </div>
                <div
                  className={`self-end flex items-center gap-1 text-[11px] font-bold ${
                    isDarkMode
                      ? 'text-teal-300 group-hover:text-white'
                      : 'text-teal-700 group-hover:text-teal-900'
                  }`}
                >
                  <span>{t('featureStoreBtn')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}
          </div>

          {/* Quick Dedications & Support Link Banner (Soft Pastel Pink & White Theme) */}
          {onDedicationsClick && (
            <div
              onClick={onDedicationsClick}
              className={`max-w-5xl mx-auto p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all duration-300 group shadow-md ${
                isDarkMode
                  ? 'bg-pink-950/40 hover:bg-pink-900/50 border-pink-400/35 hover:border-pink-300/60 shadow-[0_0_20px_rgba(244,114,182,0.15)] text-white backdrop-blur-md'
                  : 'bg-pink-50 hover:bg-pink-100/60 border-pink-200 text-slate-900 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
                  <Heart className="w-4 h-4 text-pink-300 fill-pink-300 group-hover:scale-110 transition-transform" />
                </div>
                <span className="font-bold text-white text-xs sm:text-sm">{t('featureDedicationsBanner')}</span>
              </div>
              <span
                className={`text-[11px] px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 transition-all shadow-md ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-pink-400 to-white hover:from-pink-300 hover:to-slate-100 text-slate-950 border border-pink-200 group-hover:scale-105'
                    : 'bg-pink-600 text-white border border-pink-600 group-hover:bg-pink-700 group-hover:scale-105'
                }`}
              >
                <span>{t('featureDedicationsBtn')}</span>
                <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          )}
        </div>

        {/* The Two Prominent Call to Action Cards (Harmonious Turquoise Green & White Theme) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2 ${
            isRtl ? 'text-right' : 'text-left'
          }`}
        >
          {/* Card 1: The Listener (المستمع) */}
          <div
            onClick={onExploreClick}
            className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 border ${
              isDarkMode
                ? 'bg-gradient-to-b from-[#0e1b26]/95 via-[#0b1620]/95 to-[#081018]/95 border-teal-400/35 hover:border-teal-400/70 shadow-xl hover:shadow-[0_0_35px_rgba(45,212,191,0.22)]'
                : 'bg-gradient-to-b from-white via-teal-50/30 to-teal-50/60 hover:from-white hover:to-teal-100/40 border-teal-200 hover:border-teal-400 shadow-md hover:shadow-xl'
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform ${
                isDarkMode ? 'bg-teal-400/15' : 'bg-teal-300/20'
              }`}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-md ${
                    isDarkMode
                      ? 'bg-teal-400/20 border-teal-400/40 text-teal-300 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-slate-950'
                      : 'bg-teal-100 border-teal-300 text-teal-800 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white'
                  }`}
                >
                  <Headphones className="w-7 h-7" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isDarkMode
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {t('ctaListenerBadge')}
                </span>
              </div>

              <div className="space-y-2">
                <h3
                  className={`text-xl sm:text-2xl font-black ${
                    isRtl ? 'font-tajawal' : 'font-sans'
                  } transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? 'text-white group-hover:text-teal-200'
                      : 'text-slate-900 group-hover:text-teal-800'
                  }`}
                >
                  <span>{t('ctaListenerTitle')}</span>
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t('ctaListenerDesc')}
                </p>
              </div>

              <div
                className={`flex items-center gap-3 pt-1 text-xs font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                <span
                  className={`flex items-center gap-1 font-bold ${
                    isDarkMode ? 'text-teal-300' : 'text-teal-700'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-teal-400 fill-teal-400" />
                  {t('ctaListenerStats')}
                </span>
                <span>•</span>
                <span>{t('ctaListenerGenre')}</span>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <div
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-teal-400 via-teal-300 to-white hover:from-teal-300 hover:to-slate-100 text-slate-950 shadow-teal-400/25 border border-teal-300'
                    : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/20'
                }`}
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{t('ctaListenerBtn')}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>

          {/* Card 2: The Singer & Performer (المطرب والمشارك) */}
          <div
            onClick={onStudioClick}
            className={`group relative rounded-3xl p-6 sm:p-8 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 border ${
              isDarkMode
                ? 'bg-gradient-to-b from-[#0a1f24]/95 via-[#08171b]/95 to-[#061014]/95 border-teal-400/35 hover:border-teal-400/70 shadow-xl hover:shadow-[0_0_35px_rgba(45,212,191,0.22)]'
                : 'bg-gradient-to-b from-white via-cyan-50/30 to-cyan-50/60 hover:from-white hover:to-cyan-100/40 border-cyan-200 hover:border-cyan-400 shadow-md hover:shadow-xl'
            }`}
          >
            <div
              className={`absolute top-0 right-0 w-44 h-44 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform ${
                isDarkMode ? 'bg-teal-400/15' : 'bg-cyan-300/20'
              }`}
            />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-md ${
                    isDarkMode
                      ? 'bg-teal-400/20 border-teal-400/40 text-teal-300 group-hover:scale-110 group-hover:bg-teal-400 group-hover:text-slate-950'
                      : 'bg-cyan-100 border-cyan-300 text-cyan-800 group-hover:scale-110 group-hover:bg-cyan-600 group-hover:text-white'
                  }`}
                >
                  <Mic className="w-7 h-7" />
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isDarkMode
                      ? 'bg-white/10 border-white/20 text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-800'
                  }`}
                >
                  {t('ctaSingerBadge')}
                </span>
              </div>

              <div className="space-y-2">
                <h3
                  className={`text-xl sm:text-2xl font-black ${
                    isRtl ? 'font-tajawal' : 'font-sans'
                  } transition-colors flex items-center gap-2 ${
                    isDarkMode
                      ? 'text-white group-hover:text-teal-200'
                      : 'text-slate-900 group-hover:text-cyan-800'
                  }`}
                >
                  <span>{t('ctaSingerTitle')}</span>
                </h3>
                <p
                  className={`text-xs sm:text-sm leading-relaxed font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t('ctaSingerDesc')}
                </p>
              </div>

              <div
                className={`flex items-center gap-3 pt-1 text-xs font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                <span
                  className={`font-bold ${
                    isDarkMode ? 'text-teal-300' : 'text-cyan-700'
                  }`}
                >
                  {t('ctaSingerFeat1')}
                </span>
                <span>•</span>
                <span>{t('ctaSingerFeat2')}</span>
                <span>•</span>
                <span>{t('ctaSingerFeat3')}</span>
              </div>
            </div>

            <div className="relative z-10 pt-6">
              <div className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-100 text-slate-950 border border-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-white/10 transition-all cursor-pointer">
                <Mic className="w-4 h-4 text-slate-950" />
                <span>{t('ctaSingerBtn')}</span>
                <ArrowIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Quick Selector Pills - Turquoise Green & White */}
        <div
          className={`pt-6 border-t flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none flex-wrap ${
            isDarkMode ? 'border-white/[0.06]' : 'border-slate-200'
          }`}
        >
          <span
            className={`text-xs font-bold whitespace-nowrap ${
              isRtl ? 'ml-2' : 'mr-2'
            } ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}
          >
            {t('browseByCategory')}
          </span>
          {[
            { id: 'all', nameKey: 'catAll' },
            { id: 'spacetoon', nameKey: 'catSpacetoon' },
            { id: 'the-voice-kids', nameKey: 'catVoiceKids' },
            { id: 'arabic-songs', nameKey: 'catArabic' },
            { id: 'foreign-songs', nameKey: 'catForeign' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? isDarkMode
                    ? 'bg-teal-400 text-slate-950 font-black border border-teal-300 shadow-md shadow-teal-400/20'
                    : 'bg-teal-600 text-white border-teal-600 font-bold shadow-sm'
                  : isDarkMode
                  ? 'bg-white/[0.05] text-slate-200 hover:text-white hover:bg-white/10 border-white/10'
                  : 'bg-slate-100 text-slate-700 hover:text-teal-800 hover:bg-teal-50 border-slate-200'
              }`}
            >
              {t(cat.nameKey)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
