import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Heart, Sparkles, Sliders, Music, Film, Mic, Activity, Vote, Settings, Database, FileCode, Youtube, Sun, Moon, Send, Trophy, HelpCircle, Tv, UserCheck, ShoppingBag, Globe, User, LogOut, LogIn, Play, X, ArrowRight, ArrowLeft } from 'lucide-react';
import yonaHorizontalLogo from '../assets/images/yona_horizontal_logo_1790521644701.jpg';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/db';
import { Recording } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favoritesCount: number;
  onSelectRecording?: (rec: Recording) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  onSelectRecording,
}) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, toggleLanguage, t, isRtl, translateSong, translateAnime } = useLanguage();
  const { user, openAuthModal, signOut, isAuthenticated } = useAuth();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(target)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search results instantly
  const liveSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return db.searchAndFilter({ query: searchQuery }).slice(0, 6);
  }, [searchQuery]);

  const totalMatchesCount = useMemo(() => {
    if (!searchQuery.trim()) return 0;
    return db.searchAndFilter({ query: searchQuery }).length;
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('directory');
      setShowSearchDropdown(false);
      setTimeout(() => {
        const el = document.getElementById('recordings-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleSelectResult = (rec: Recording) => {
    if (onSelectRecording) {
      onSelectRecording(rec);
    }
    setActiveTab('directory');
    setShowSearchDropdown(false);
  };

  const popularSuggestions = [
    { ar: 'عهد الأصدقاء', en: 'Romeo & Black Brothers' },
    { ar: 'القناص', en: 'Hunter x Hunter' },
    { ar: 'دراغون بول', en: 'Dragon Ball' },
    { ar: 'ريمي', en: 'Remi' },
    { ar: 'المحقق كونان', en: 'Detective Conan' },
  ];

  return (
    <header className={`sticky top-0 z-40 w-full border-b backdrop-blur-xl transition-colors duration-300 ${
      isDarkMode 
        ? 'border-white/[0.06] bg-[#0a0d14]/90 text-white' 
        : 'border-slate-200/80 bg-white/95 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand / Logo (Full Horizontal Artwork Logo) */}
        <button
          onClick={() => setActiveTab('directory')}
          className="flex items-center gap-3 text-right group cursor-pointer shrink-0"
          title="الرئيسية - YONA SONGS"
        >
          <div className="relative h-11 sm:h-12 w-28 sm:w-36 rounded-xl overflow-hidden border border-amber-400/30 group-hover:border-amber-400/70 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-all duration-300 bg-[#090d16] flex items-center justify-center">
            <img
              src={yonaHorizontalLogo}
              alt="Yona Songs"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-tajawal font-extrabold text-base tracking-tight text-white group-hover:text-[#E5C07B] transition-colors">
                {t('brandTitle')}
              </span>
              <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-teal-400/15 text-teal-300 border border-teal-400/30 tracking-wide shadow-sm shadow-teal-500/10">
                {t('brandBadge')}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{t('brandSubtitle')}</span>
          </div>
        </button>

        {/* Search Bar (Desktop) with Live Interactive Dropdown */}
        <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-md relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <button
              type="submit"
              className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer z-10`}
              title={language === 'ar' ? 'بحث' : 'Search'}
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setSearchQuery(val);
                setShowSearchDropdown(true);
                if (val.trim() && activeTab !== 'directory') {
                  setActiveTab('directory');
                }
              }}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              placeholder={t('searchPlaceholder')}
              className={`w-full ${isRtl ? 'pl-9 pr-10' : 'pr-9 pl-10'} py-2 rounded-xl bg-[#0e1422]/90 border border-white/[0.1] text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white p-0.5 rounded cursor-pointer z-10`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Live Search Results Dropdown */}
          {showSearchDropdown && searchQuery.trim() && (
            <div className={`absolute top-full mt-2 left-0 right-0 z-50 rounded-2xl bg-[#0c1220]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-3 space-y-2.5 overflow-hidden animate-in fade-in duration-200 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-slate-300">
                  {language === 'ar'
                    ? `نتائج البحث عن "${searchQuery}" (${totalMatchesCount})`
                    : `Results for "${searchQuery}" (${totalMatchesCount})`}
                </span>
                <button
                  type="button"
                  onClick={() => setShowSearchDropdown(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {liveSearchResults.length > 0 ? (
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {liveSearchResults.map((rec) => {
                    const ytId = rec.youtubeVideo?.youtubeVideoId;
                    const thumbUrl = ytId
                      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                      : rec.animeList?.[0]?.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80';
                    const dispSongTitle = translateSong(rec.song?.title || rec.title);
                    const dispAnimeTitle = translateAnime(rec.animeList?.[0]?.title || rec.anime?.title || '');

                    return (
                      <div
                        key={rec.id}
                        onClick={() => handleSelectResult(rec)}
                        className="group flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-amber-400/10 border border-white/[0.05] hover:border-amber-400/40 transition-all cursor-pointer gap-2.5"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-black/60 border border-white/10">
                            <img src={thumbUrl} alt={dispSongTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-white fill-white opacity-80 group-hover:opacity-100" />
                            </div>
                          </div>
                          <div className="overflow-hidden">
                            <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                              {dispSongTitle}
                            </h4>
                            <p className="text-[10px] text-slate-400 truncate">
                              {dispAnimeTitle} {rec.artist?.name ? `• ${rec.artist.name}` : ''}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-1.5">
                          {rec.category?.name && (
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/10 text-slate-300">
                              {rec.category.name}
                            </span>
                          )}
                          <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                            <Play className="w-3 h-3 fill-current" />
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <span>{language === 'ar' ? `عرض كافة النتائج (${totalMatchesCount}) في المكتبة الموسيقية` : `View all ${totalMatchesCount} tracks in Library`}</span>
                    {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <div className="py-4 px-2 text-center space-y-3">
                  <p className="text-xs text-slate-400">
                    {language === 'ar'
                      ? `لم يتم العثور على شارات مطابقة لـ "${searchQuery}"`
                      : `No matching tracks found for "${searchQuery}"`}
                  </p>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      {language === 'ar' ? 'اقتراحات سريعة للبحث:' : 'Suggested searches:'}
                    </span>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {popularSuggestions.map((item, idx) => {
                        const term = language === 'ar' ? item.ar : item.en;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSearchQuery(term);
                              setShowSearchDropdown(true);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400/20 text-[10px] font-semibold text-slate-300 hover:text-amber-300 border border-white/10 hover:border-amber-400/30 transition-all cursor-pointer"
                          >
                            {term}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Tabs (Ordered exactly as requested) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium top-nav-scrollbar">
          {/* 1. المكتبة */}
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'directory'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navLibrary')}</span>
          </button>

          {/* 2. استوديو الغناء */}
          <button
            onClick={() => setActiveTab('vocal-studio')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'vocal-studio'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navStudio')}</span>
          </button>

          {/* 3. تلفزيون سبيستون */}
          <button
            onClick={() => setActiveTab('spacetoon-tv')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'spacetoon-tv'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Tv className="w-4 h-4 text-amber-400" />
            <span>{t('navTv')}</span>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-400"></span>
            </span>
          </button>

          {/* 4. المساعد الذكي */}
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'ai-assistant'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navAiAssistant')}</span>
          </button>

          {/* 5. أدوات الصوت */}
          <button
            onClick={() => setActiveTab('tools')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'tools'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navTools')}</span>
          </button>

          {/* 6. المسابقة */}
          <button
            onClick={() => setActiveTab('contest')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'contest'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Trophy className={`w-3.5 h-3.5 transition-all ${activeTab === 'contest' ? 'text-amber-400 filter drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse' : 'text-yellow-500'}`} />
            <span>{t('navContest')}</span>
          </button>

          {/* 7. كويز سبيستون */}
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'quiz'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navQuiz')}</span>
          </button>

          {/* 8. التلغرام */}
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'telegram'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Send className="w-3.5 h-3.5 -rotate-12 text-slate-300" />
            <span>{t('navTelegram')}</span>
          </button>

          {/* 9. الأنمي */}
          <button
            onClick={() => setActiveTab('anime')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'anime'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Film className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navAnime')}</span>
          </button>

          {/* 10. جواز سبيستون */}
          <button
            onClick={() => setActiveTab('passport')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'passport'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <UserCheck className={`w-4 h-4 transition-all ${activeTab === 'passport' ? 'text-emerald-400 filter drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'text-emerald-500'}`} />
            <span>{t('navPassport')}</span>
          </button>

          {/* 11. تصويت الجمهور */}
          <button
            onClick={() => setActiveTab('community')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'community'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Vote className="w-3.5 h-3.5 text-slate-300" />
            <span>{t('navCommunity')}</span>
          </button>

          {/* 12. الإهداءات */}
          <button
            onClick={() => setActiveTab('dedications')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'dedications'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'dedications' ? 'text-amber-400' : 'text-slate-300'}`} />
            <span>{t('navDedications')}</span>
          </button>

          {/* 13. لشراء منتوجاتنا */}
          <button
            onClick={() => setActiveTab('store')}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all border ${
              activeTab === 'store'
                ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.04] border-transparent'
            }`}
          >
            <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === 'store' ? 'text-amber-400' : 'text-slate-300'}`} />
            <span>{t('navStore')}</span>
          </button>
        </nav>

        {/* Right Actions: User Profile / Sign In, Language Switcher, YouTube, Theme, Admin */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* User Sign In / Profile Button (Quick Name Login for Top Header as requested) */}
          <button
            type="button"
            onClick={() => openAuthModal({ defaultTab: 'quick', title: language === 'ar' ? 'تسجيل الدخول السريع بالاسم' : 'Quick Sign In' })}
            className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer shadow-sm ${
              isAuthenticated && user
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 font-extrabold shadow-emerald-500/20'
            }`}
            title={
              isAuthenticated && user
                ? (user.displayName || 'حسابي')
                : (language === 'ar' ? 'تسجيل الدخول بالاسم' : 'Sign In')
            }
          >
            {isAuthenticated && user?.avatarIcon ? (
              <span className="text-sm">{user.avatarIcon}</span>
            ) : (
              <User className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline truncate max-w-[100px]">
              {isAuthenticated && user
                ? (user.displayName?.split(' ')[0] || 'حسابي')
                : (language === 'ar' ? 'دخول' : 'Sign In')}
            </span>
          </button>

          {/* Language Switcher Button (Text written in White as requested) */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer shadow-xs flex items-center gap-1.5 text-xs font-bold font-mono tracking-tight"
            title={language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-bold">{language === 'ar' ? 'ENG' : 'عربي'}</span>
          </button>

          {/* YouTube Channel External Link */}
          <a
            href="https://youtube.com/@yona_songs"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1422] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#D4AF37]/40 text-xs font-semibold transition-all"
            title="YouTube - Yona Songs"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>@yona_songs</span>
          </a>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-300 hover:text-teal-200 hover:border-teal-400/60 hover:bg-teal-500/20 transition-all cursor-pointer shadow-sm shadow-teal-500/10"
            title={isDarkMode ? t('themeLight') : t('themeDark')}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-teal-300 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-teal-600 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* Admin Dashboard Settings button */}
          <button
            onClick={() => setActiveTab('admin')}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-amber-400/10 border-amber-400/40 text-amber-300 shadow-sm'
                : 'bg-[#0e1422] border-white/[0.08] text-slate-300 hover:text-white hover:border-[#D4AF37]/40'
            }`}
            title={t('navAdmin')}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar & Language Switcher Quick Bar with Live Search */}
      <div ref={mobileSearchRef} className="md:hidden relative px-3 py-2 border-t border-white/[0.06] bg-[#0a0d14] flex items-center gap-2">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <button
            type="submit"
            className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#D4AF37] transition-colors cursor-pointer z-10`}
            title={language === 'ar' ? 'بحث' : 'Search'}
          >
            <Search className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const val = e.target.value;
              setSearchQuery(val);
              setShowSearchDropdown(true);
              if (val.trim() && activeTab !== 'directory') {
                setActiveTab('directory');
              }
            }}
            onFocus={() => {
              if (searchQuery.trim()) setShowSearchDropdown(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearchSubmit(e);
              }
            }}
            placeholder={t('searchPlaceholder')}
            className={`w-full ${isRtl ? 'pl-8 pr-9' : 'pr-8 pl-9'} py-1.5 rounded-lg bg-[#0e1422] border border-white/[0.08] text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/60`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowSearchDropdown(false);
              }}
              className={`absolute ${isRtl ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white z-10`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>
        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1 rounded-lg border border-white/20 bg-white/10 text-white text-[10px] font-bold shrink-0 flex items-center gap-1 font-mono cursor-pointer"
        >
          <Globe className="w-2.5 h-2.5 text-white" />
          <span className="text-white font-bold">{language === 'ar' ? 'ENG' : 'عربي'}</span>
        </button>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg border border-teal-400/30 bg-teal-500/10 text-teal-300 hover:text-teal-200 shrink-0 flex items-center justify-center cursor-pointer shadow-sm shadow-teal-500/10"
          title={isDarkMode ? t('themeLight') : t('themeDark')}
        >
          {isDarkMode ? (
            <Sun className="w-3.5 h-3.5 text-teal-300" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-teal-600" />
          )}
        </button>

        {/* Mobile Dropdown Search Results */}
        {showSearchDropdown && searchQuery.trim() && (
          <div className={`absolute top-full left-2 right-2 z-50 rounded-2xl bg-[#0c1220]/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-3 space-y-2 max-h-80 overflow-y-auto animate-in fade-in duration-150 ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <span className="text-[11px] font-bold text-slate-300">
                {language === 'ar' ? `نتائج (${totalMatchesCount})` : `Results (${totalMatchesCount})`}
              </span>
              <button
                type="button"
                onClick={() => setShowSearchDropdown(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {liveSearchResults.length > 0 ? (
              <div className="space-y-1.5">
                {liveSearchResults.map((rec) => {
                  const ytId = rec.youtubeVideo?.youtubeVideoId;
                  const thumbUrl = ytId
                    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                    : rec.animeList?.[0]?.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=80';
                  const dispSongTitle = translateSong(rec.song?.title || rec.title);
                  const dispAnimeTitle = translateAnime(rec.animeList?.[0]?.title || rec.anime?.title || '');

                  return (
                    <div
                      key={rec.id}
                      onClick={() => handleSelectResult(rec)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] active:bg-amber-400/20 border border-white/[0.05] transition-all gap-2"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={thumbUrl} alt={dispSongTitle} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-white truncate">{dispSongTitle}</h4>
                          <p className="text-[10px] text-slate-400 truncate">{dispAnimeTitle}</p>
                        </div>
                      </div>
                      <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 shrink-0">
                        <Play className="w-3 h-3 fill-current" />
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="w-full mt-2 py-2 rounded-xl bg-amber-400/20 text-amber-300 font-bold text-xs flex items-center justify-center gap-1 border border-amber-400/30"
                >
                  <span>{language === 'ar' ? `عرض كل النتائج (${totalMatchesCount})` : `View all (${totalMatchesCount})`}</span>
                </button>
              </div>
            ) : (
              <div className="py-2 text-center text-xs text-slate-400">
                {language === 'ar' ? 'لا توجد نتائج مطابقة' : 'No results found'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Secondary Nav Bar (Exact Order) */}
      <div className="lg:hidden flex items-center gap-1.5 border-t border-white/[0.06] bg-[#0a0d14]/95 px-2.5 py-2 text-xs font-medium overflow-x-auto top-nav-scrollbar">
        {/* 1. المكتبة */}
        <button
          onClick={() => setActiveTab('directory')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'directory' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Music className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navLibrary')}</span>
        </button>

        {/* 2. استوديو الغناء */}
        <button
          onClick={() => setActiveTab('vocal-studio')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'vocal-studio' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navStudio')}</span>
        </button>

        {/* 3. تلفزيون سبيستون */}
        <button
          onClick={() => setActiveTab('spacetoon-tv')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'spacetoon-tv' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('navTv')}</span>
        </button>

        {/* 4. المساعد الذكي */}
        <button
          onClick={() => setActiveTab('ai-assistant')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'ai-assistant' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navAiAssistant')}</span>
        </button>

        {/* 5. عزل الصوت */}
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'tools' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navTools')}</span>
        </button>

        {/* 6. المسابقة */}
        <button
          onClick={() => setActiveTab('contest')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'contest' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('navContest')}</span>
        </button>

        {/* 7. كويز سبيستون */}
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'quiz' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navQuiz')}</span>
        </button>

        {/* 8. التلغرام */}
        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'telegram' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Send className="w-3.5 h-3.5 -rotate-12 text-slate-300" />
          <span>{t('navTelegram')}</span>
        </button>

        {/* 9. الأنمي */}
        <button
          onClick={() => setActiveTab('anime')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'anime' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Film className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navAnime')}</span>
        </button>

        {/* 10. جواز سبيستون */}
        <button
          onClick={() => setActiveTab('passport')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'passport' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>{t('navPassport')}</span>
        </button>

        {/* 11. تصويت الجمهور */}
        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'community' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Vote className="w-3.5 h-3.5 text-slate-300" />
          <span>{t('navCommunity')}</span>
        </button>

        {/* 12. الإهداءات */}
        <button
          onClick={() => setActiveTab('dedications')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'dedications' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${activeTab === 'dedications' ? 'text-amber-400' : 'text-slate-300'}`} />
          <span>{t('navDedications')}</span>
        </button>

        {/* 13. لشراء منتوجاتنا */}
        <button
          onClick={() => setActiveTab('store')}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg whitespace-nowrap border ${
            activeTab === 'store' ? 'bg-amber-400/10 text-amber-300 border-amber-400/30 font-bold' : 'text-slate-300 border-transparent'
          }`}
        >
          <ShoppingBag className={`w-3.5 h-3.5 ${activeTab === 'store' ? 'text-amber-400' : 'text-slate-300'}`} />
          <span>{t('navStore')}</span>
        </button>
      </div>
    </header>
  );
};
