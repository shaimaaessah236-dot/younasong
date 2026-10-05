import React, { useState } from 'react';
import { Anime, AnimeEpisode, EpisodeServer, Recording } from '../types';
import { TELEGRAM_CHANNELS_LIST } from '../lib/telegramData';
import {
  isUserSubscribedToYouTube,
  setUserSubscribedToYouTube,
  YouTubeSubscriptionBanner,
  YouTubeSubscriptionGateModal
} from './YouTubeSubscriptionGate';
import {
  Film,
  Calendar,
  Building,
  Play,
  Music,
  Sparkles,
  Star,
  Tv,
  Clock,
  User,
  Search,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Info,
  ExternalLink,
  X,
  Volume2,
  Server,
  Send,
  AlertTriangle,
  RefreshCw,
  Globe,
  Radio,
  Copy,
  Check,
  Download,
  Bot,
  Share2,
  Layers,
  Youtube,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AnimeHubProps {
  animeList: Anime[];
  allRecordings: Recording[];
  onSelectRecording: (rec: Recording) => void;
}

export type HubFilterCategory = 'all' | 'world-movie' | 'world-series' | 'anime-series' | 'anime-movie';

export const AnimeHub: React.FC<AnimeHubProps> = ({
  animeList,
  allRecordings,
  onSelectRecording,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<HubFilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimeSlug, setSelectedAnimeSlug] = useState<string>(animeList[0]?.slug || 'movie-interstellar');
  
  // Episode Watcher State (In-Page Player)
  const [activeEpisode, setActiveEpisode] = useState<AnimeEpisode | null>(null);
  const [activeServerId, setActiveServerId] = useState<string>('');
  const [activeTabSection, setActiveTabSection] = useState<'episodes' | 'telegram' | 'story' | 'characters' | 'themes'>('episodes');
  const [copiedLink, setCopiedLink] = useState(false);

  // YouTube Subscription Gating
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => isUserSubscribedToYouTube());
  const [showGateModal, setShowGateModal] = useState<boolean>(false);
  const [pendingEpisode, setPendingEpisode] = useState<AnimeEpisode | null>(null);

  // Filter list by category and query
  const filteredAnimeList = animeList.filter((item) => {
    let matchesCat = true;
    if (filterCategory === 'world-movie') matchesCat = item.mediaCategory === 'world-movie';
    else if (filterCategory === 'world-series') matchesCat = item.mediaCategory === 'world-series';
    else if (filterCategory === 'anime-series') matchesCat = item.mediaCategory === 'anime-series' || (item.type === 'series' && item.mediaCategory !== 'world-series');
    else if (filterCategory === 'anime-movie') matchesCat = item.mediaCategory === 'anime-movie' || (item.type === 'movie' && item.mediaCategory !== 'world-movie');

    const matchesQuery =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.originalTitle && item.originalTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.studio && item.studio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.genres && item.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesQuery;
  });

  const selectedAnime = animeList.find((a) => a.slug === selectedAnimeSlug) || filteredAnimeList[0] || animeList[0];

  const animeRecordings = allRecordings.filter((rec) =>
    rec.animeList?.some((a) => a.slug === selectedAnime?.slug) ||
    (selectedAnime && rec.title.toLowerCase().includes(selectedAnime.title.toLowerCase()))
  );

  const episodes = selectedAnime?.episodes || [];

  // Determine current active servers with reliable defaults
  const currentServers: EpisodeServer[] = React.useMemo(() => {
    if (!activeEpisode) return [];
    if (activeEpisode.servers && activeEpisode.servers.length > 0) {
      return activeEpisode.servers;
    }
    const list: EpisodeServer[] = [];
    if (activeEpisode.youtubeId) {
      list.push({
        id: 'srv-yt',
        name: 'سيرفر يوتيوب HD (سريع)',
        url: `https://www.youtube.com/embed/${activeEpisode.youtubeId}?rel=0&modestbranding=1`,
        type: 'youtube',
        quality: '1080p FHD'
      });
    }
    list.push({
      id: 'srv-tg',
      name: 'سيرفر تيليجرام السحابي (بدون إعلانات)',
      url: activeEpisode.telegramUrl || selectedAnime?.telegramChannelUrl || 'https://t.me/SpacetoonTV',
      type: 'telegram',
      quality: 'Full HD'
    });
    if (activeEpisode.externalWatchUrl) {
      list.push({
        id: 'srv-ext',
        name: 'سيرفر المشاهدة المباشرة',
        url: activeEpisode.externalWatchUrl,
        type: 'external',
        quality: 'Web HD'
      });
    }
    return list;
  }, [activeEpisode, selectedAnime]);

  const selectedServer = currentServers.find(s => s.id === activeServerId) || currentServers[0];

  const handlePlayEpisode = (ep: AnimeEpisode) => {
    setActiveEpisode(ep);
    // Prioritize youtube or first working server
    const primary = ep.servers?.find(s => s.type === 'youtube') || ep.servers?.[0];
    if (primary) {
      setActiveServerId(primary.id);
    } else if (ep.youtubeId) {
      setActiveServerId('srv-yt');
    } else {
      setActiveServerId('srv-tg');
    }
    // Smooth scroll up to player
    const playerEl = document.getElementById('inpage-video-player');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleGateUnlocked = () => {
    setIsSubscribed(true);
    if (pendingEpisode) {
      handlePlayEpisode(pendingEpisode);
      setPendingEpisode(null);
    }
  };

  const handleNextEpisode = () => {
    if (!activeEpisode || !episodes.length) return;
    const currentIndex = episodes.findIndex((e) => e.id === activeEpisode.id);
    if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
      handlePlayEpisode(episodes[currentIndex + 1]);
    }
  };

  const handlePrevEpisode = () => {
    if (!activeEpisode || !episodes.length) return;
    const currentIndex = episodes.findIndex((e) => e.id === activeEpisode.id);
    if (currentIndex > 0) {
      handlePlayEpisode(episodes[currentIndex - 1]);
    }
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Helper to render video player based on server type
  const renderPlayer = () => {
    if (!activeEpisode || !selectedServer) return null;

    if (selectedServer.type === 'direct') {
      return (
        <video
          src={selectedServer.url}
          controls
          autoPlay
          className="absolute inset-0 w-full h-full object-contain bg-black"
        >
          متصفحك لا يدعم تشغيل الفيديو المباشر.
        </video>
      );
    }

    if (selectedServer.type === 'telegram') {
      const channelName = selectedAnime?.telegramChannelName || 'قناة سبيستون الأولى (@SpacetoonTV)';
      const channelUrl = selectedAnime?.telegramChannelUrl || 'https://t.me/SpacetoonTV';
      const webPreviewUrl = selectedAnime?.telegramWebPreviewUrl || 'https://t.me/s/SpacetoonTV';
      const botUrl = selectedAnime?.telegramBotSearchUrl || 'https://t.me/SaveAsBot';

      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-10 text-center bg-gradient-to-br from-[#0e2238] via-[#091522] to-[#070b12] text-white overflow-y-auto">
          {/* Glowing background halo */}
          <div className="absolute w-72 h-72 rounded-full bg-[#2AABEE]/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#2AABEE]/20 border border-[#2AABEE]/40 flex items-center justify-center text-[#2AABEE] shadow-2xl shadow-[#2AABEE]/30 animate-pulse">
              <Send className="w-8 h-8 -rotate-12 translate-x-0.5" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2AABEE]/15 border border-[#2AABEE]/30 text-[#2AABEE] text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>قناة تيليجرام المعتمدة للمشاهدة والتحميل</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black font-tajawal text-white">
                {activeEpisode.title}
              </h4>
              <p className="text-xs text-gray-300 max-w-md leading-relaxed">
                متوفرة الآن للتحميل والمشاهدة السريعة عبر <strong>{channelName}</strong> بدقة Full HD 1080p الأصلية وبدون إعلانات.
              </p>
            </div>

            {/* Quality Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-300">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1 font-bold">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>دبلجة الزهرة الأصلية</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                <Download className="w-3 h-3 text-emerald-400" />
                <span>تحميل مباشر مجاني</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 flex items-center gap-1">
                <span>1080p / 720p</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
              <a
                href={selectedServer.url || channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-2xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold text-xs shadow-xl shadow-[#2AABEE]/25 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>فتح في تطبيق تيليجرام</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              <a
                href={webPreviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>تصفح القناة بالمتصفح (Web)</span>
              </a>

              <a
                href={botUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 font-bold text-xs transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Bot className="w-4 h-4 text-purple-400" />
                <span>بحث في بوت الأنمي</span>
              </a>

              <button
                onClick={() => handleCopyLink(selectedServer.url || channelUrl)}
                className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/15 text-gray-300 font-bold text-xs border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedServer.type === 'external') {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] text-white">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-4 text-indigo-400 shadow-xl">
            <Globe className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold mb-2">سيرفر المشاهدة السحابي الخارجي</h4>
          <p className="text-xs text-gray-300 max-w-md mb-6 leading-relaxed">
            انقر للانتقال مباشرة لصفحة المشاهدة الرسمية للحلقة بجودات متعددة وسريعة.
          </p>
          <a
            href={selectedServer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2 hover:scale-105"
          >
            <span>مشاهدة الحلقة عبر السيرفر الخارجي</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    // Default Iframe embed (Archive.org, YouTube, DailyMotion)
    const directWatchUrl = (activeEpisode.youtubeId && activeEpisode.youtubeId !== 'b8qH5Q1x3Xg')
      ? `https://www.youtube.com/watch?v=${activeEpisode.youtubeId}`
      : (activeEpisode.externalWatchUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent((selectedAnime?.title || '') + ' ' + (activeEpisode.title || ''))}`);

    return (
      <div className="relative w-full h-full group">
        <iframe
          key={selectedServer.url}
          src={selectedServer.url}
          title={activeEpisode.title}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        {/* Quick Toolbar for Unrestricted Playback */}
        <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-xl opacity-90 group-hover:opacity-100 transition-opacity">
          <a
            href={directWatchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
            title="مشاهدة في نافذة جديدة لتخطي أي قيود تضمين"
          >
            <ExternalLink className="w-3 h-3" />
            <span>فتح في نافذة مستقلة ↗</span>
          </a>

          {activeEpisode.externalWatchUrl && (
            <a
              href={activeEpisode.externalWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="البحث المباشر عن الحلقة كاملة بدقة عالية"
            >
              <Search className="w-3 h-3" />
              <span>بحث بجودة HD </span>
            </a>
          )}

          {activeEpisode.telegramUrl && (
            <a
              href={activeEpisode.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#2AABEE] hover:bg-[#229ED9] text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
              title="مشاهدة وتحميل مباشر عبر تيليجرام بدون إعلانات"
            >
              <Send className="w-3 h-3" />
              <span>تيليجرام </span>
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* YouTube Subscription Requirement Banner */}
      <YouTubeSubscriptionBanner onUnlocked={() => setIsSubscribed(true)} />

      {/* Top Header Banner & Filter Navigation */}
      <div className={`p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Film className="w-3.5 h-3.5" />
              <span>{t('animeHeroSubtitle', 'Spacetoon & Anime Encyclopedia')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-tajawal text-white">
              {t('animeHeroTitle', 'Spacetoon & Anime Encyclopedia')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'شاهد أروع الأفلام والمسلسلات العالمية وسلسلة أعمال الأنمي الخالدة، مع دعم المشغل المباشر، السيرفرات السحابية على تيليجرام، وإمكانية المشاهدة في نافذة مستقلة فوراً.'
                : 'Explore world cinema movies, timeless anime classics, multi-server playback, and direct Telegram 4K links.'}
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20 font-extrabold'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              الكل ({animeList.length})
            </button>
            <button
              onClick={() => setFilterCategory('world-movie')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'world-movie'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20 font-extrabold'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>أفلام سينما عالمية ({animeList.filter(a => a.mediaCategory === 'world-movie').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('world-series')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'world-series'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-extrabold'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>مسلسلات عالمية وعربية ({animeList.filter(a => a.mediaCategory === 'world-series').length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('anime-series')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'anime-series'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-extrabold'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>مسلسلات أنمي ({animeList.filter(a => a.mediaCategory === 'anime-series' || (a.type === 'series' && a.mediaCategory !== 'world-series')).length})</span>
            </button>
            <button
              onClick={() => setFilterCategory('anime-movie')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                filterCategory === 'anime-movie'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20 font-extrabold'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>أفلام أنمي ({animeList.filter(a => a.mediaCategory === 'anime-movie' || (a.type === 'movie' && a.mediaCategory !== 'world-movie')).length})</span>
            </button>
          </div>
        </div>

        {/* Search and Quick Item Carousel */}
        <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن أنمي، فيلم، استوديو أو تصنيف..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-[#121217] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#F59E0B] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                مسح
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {filteredAnimeList.map((an) => {
              const isSelected = selectedAnime?.slug === an.slug;
              return (
                <button
                  key={an.id}
                  onClick={() => {
                    setSelectedAnimeSlug(an.slug);
                    if (an.episodes && an.episodes.length > 0) {
                      if (!activeEpisode || !an.episodes.some(e => e.id === activeEpisode.id)) {
                        handlePlayEpisode(an.episodes[0]);
                      }
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? an.mediaCategory === 'world-movie'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                        : an.mediaCategory === 'world-series'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : an.type === 'movie'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-[#18181F] text-gray-300 hover:text-white hover:bg-white/5 border border-white/5'
                  }`}
                >
                  <span>{an.mediaCategory === 'world-movie' ? '' : an.mediaCategory === 'world-series' ? '' : an.type === 'movie' ? '' : ''}</span>
                  <span>{an.title}</span>
                  {an.rating && (
                    <span className="text-[10px] opacity-80 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {an.rating}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* EMBEDDED IN-PAGE VIDEO PLAYER (مشغل الحلقات والأفلام وسيرفرات البث المتعددة) */}
      {activeEpisode && (
        <div id="inpage-video-player" className="p-6 sm:p-8 rounded-3xl yona-glass border border-indigo-500/30 bg-black/70 shadow-2xl space-y-5 animate-in zoom-in-95 duration-300">
          
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg">
                <Play className="w-5 h-5 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedAnime.type === 'movie' ? 'مشاهدة الفيلم' : `الحلقة ${activeEpisode.number}`}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{selectedAnime.title}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {activeEpisode.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevEpisode}
                disabled={episodes.findIndex(e => e.id === activeEpisode.id) <= 0}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-xs font-bold flex items-center gap-1 transition-all"
                title="الحلقة السابقة"
              >
                <ChevronRight className="w-4 h-4" />
                <span className="hidden sm:inline">السابقة</span>
              </button>

              <button
                onClick={handleNextEpisode}
                disabled={episodes.findIndex(e => e.id === activeEpisode.id) >= episodes.length - 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-xs font-bold flex items-center gap-1 transition-all"
                title="الحلقة التالية"
              >
                <span className="hidden sm:inline">التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveEpisode(null)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                title="إغلاق المشغل"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SERVER SELECTION BAR (اختيار سيرفر المشاهدة لتفادي حظر التضمين) */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
              <Server className="w-4 h-4 text-amber-400" />
              <span>سيرفر المشاهدة النشط:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {currentServers.map((server) => {
                const isActive = selectedServer?.id === server.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => setActiveServerId(server.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#F59E0B] text-black shadow-md shadow-[#F59E0B]/20 font-black'
                        : 'bg-[#18181F] text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {server.type === 'archive' && <Radio className="w-3 h-3 text-emerald-400" />}
                    {server.type === 'dailymotion' && <Film className="w-3 h-3 text-cyan-400" />}
                    {server.type === 'youtube' && <Play className="w-3 h-3 text-red-400 fill-red-400" />}
                    {server.type === 'telegram' && <Send className="w-3 h-3 text-[#2AABEE]" />}
                    {server.type === 'external' && <Globe className="w-3 h-3 text-indigo-400" />}
                    <span>{server.name}</span>
                    {server.quality && (
                      <span className="text-[10px] opacity-75 font-normal">({server.quality})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* HELPFUL NOTICE IF VIDEO RESTRICTED */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                إذا كان الفيديو مقيداً أو بطيئاً على مشغل يوتيوب، قم باختيار <strong>سيرفر تيليجرام السحابي</strong> للمشاهدة والتحميل المباشر بدون إعلانات، أو اضغط على <strong>«فتح في نافذة مستقلة»</strong>.
              </span>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {activeEpisode.externalWatchUrl && (
                <a
                  href={activeEpisode.externalWatchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <span>بحث في المواقع</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {activeEpisode.telegramUrl && (
                <a
                  href={activeEpisode.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-[#2AABEE]/20 hover:bg-[#2AABEE]/30 text-[#2AABEE] border border-[#2AABEE]/30 text-[11px] font-bold flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>تيليجرام</span>
                </a>
              )}
            </div>
          </div>

          {/* Embedded Responsive Video Container */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-white/10">
            {renderPlayer()}
          </div>

          {/* Episode Details & Summary bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/5 text-xs text-gray-300">
            <div className="space-y-1">
              <span className="text-gray-400 font-medium">ملخص ما يحدث في هذا المشهد:</span>
              <p className="text-white leading-relaxed">{activeEpisode.summary || 'مشاهدة ممتعة للحلقة مع أرشيف يونا.'}</p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0 font-medium text-gray-400">
              {activeEpisode.duration && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{activeEpisode.duration}</span>
                </span>
              )}
              {activeEpisode.airDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تاريخ البث: {activeEpisode.airDate}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SELECTED ANIME / MOVIE SHOWCASE BANNER & FULL DETAILS */}
      {selectedAnime && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Poster Art with Badges */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
                  <img
                    src={selectedAnime.coverImage}
                    alt={selectedAnime.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  
                  {/* Floating Badges on Poster */}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                    <span className={`px-3 py-1 rounded-xl text-[11px] font-black shadow-lg backdrop-blur-md ${
                      selectedAnime.mediaCategory === 'world-movie'
                        ? 'bg-amber-600/90 text-white'
                        : selectedAnime.mediaCategory === 'world-series'
                        ? 'bg-blue-600/90 text-white'
                        : selectedAnime.type === 'movie'
                        ? 'bg-rose-600/90 text-white'
                        : 'bg-indigo-600/90 text-white'
                    }`}>
                      {selectedAnime.mediaCategory === 'world-movie'
                        ? ' فيلم سينما عالمي'
                        : selectedAnime.mediaCategory === 'world-series'
                        ? ' مسلسل دراما وتاريخ'
                        : selectedAnime.type === 'movie'
                        ? ' فيلم أنمي'
                        : ' مسلسل أنمي'}
                    </span>
                    {selectedAnime.rating && (
                      <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-black/70 backdrop-blur-md text-amber-400 border border-amber-400/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{selectedAnime.rating} / 10</span>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 inset-x-3 text-center">
                    {episodes.length > 0 && (
                      <button
                        onClick={() => handlePlayEpisode(episodes[0])}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black font-extrabold text-xs shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        <span>{selectedAnime.type === 'movie' ? 'مشاهدة الفيلم الآن' : 'بدء مشاهدة الحلقة الأولى'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Comprehensive Metadata & Overview */}
              <div className="lg:col-span-8 space-y-6 flex flex-col justify-between text-right">
                <div className="space-y-4">
                  
                  {/* Title & Titles */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#F59E0B]">
                        {selectedAnime.status || 'عمل مكتمل'}
                      </span>
                      {selectedAnime.duration && (
                        <span className="text-xs text-gray-400 font-medium">
                          • مدة العرض: {selectedAnime.duration}
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-black font-tajawal text-white">
                      {selectedAnime.title}
                    </h3>
                    {selectedAnime.originalTitle && (
                      <p className="text-xs sm:text-sm text-gray-400 font-sans tracking-wide mt-1">
                        {selectedAnime.originalTitle}
                      </p>
                    )}
                  </div>

                  {/* Badges Grid */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-gray-300 font-medium">
                    {selectedAnime.year && (
                      <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>الإنتاج: {selectedAnime.year}</span>
                      </span>
                    )}

                    {selectedAnime.studio && (
                      <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        <span>الاستوديو: {selectedAnime.studio}</span>
                      </span>
                    )}

                    {selectedAnime.arabicDubbingStudio && (
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/20 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>الدبلجة: {selectedAnime.arabicDubbingStudio}</span>
                      </span>
                    )}

                    {selectedAnime.episodesCount && (
                      <span className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <Tv className="w-3.5 h-3.5 text-rose-400" />
                        <span>عدد الحلقات: {selectedAnime.episodesCount} حلقة</span>
                      </span>
                    )}
                  </div>

                  {/* Genres Tags */}
                  {selectedAnime.genres && selectedAnime.genres.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs text-gray-400 ml-1">التصنيفات:</span>
                      {selectedAnime.genres.map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Summary / Synopsis */}
                  <p className="text-sm text-gray-200 leading-relaxed pt-2 border-t border-white/10">
                    {selectedAnime.description}
                  </p>
                </div>

                {/* Theme song quick badge */}
                {selectedAnime.themeSongs && selectedAnime.themeSongs.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-white">
                      <Music className="w-4 h-4 text-[#F59E0B]" />
                      <span className="font-bold">{selectedAnime.themeSongs[0].type}:</span>
                      <span className="text-amber-200">{selectedAnime.themeSongs[0].title}</span>
                      {selectedAnime.themeSongs[0].artist && (
                        <span className="text-gray-400 text-[11px]">({selectedAnime.themeSongs[0].artist})</span>
                      )}
                    </div>
                    {animeRecordings.length > 0 && (
                      <button
                        onClick={() => onSelectRecording(animeRecordings[0])}
                        className="px-3 py-1 rounded-xl bg-[#F59E0B] text-black font-extrabold text-[11px] hover:bg-[#d98806] transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>استمع بدون موسيقى</span>
                      </button>
                    )}
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* TAB SECTIONS: Episodes / Story / Characters / Theme Songs */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTabSection('episodes')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTabSection === 'episodes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Tv className="w-4 h-4" />
                <span>قائمة الحلقات والمشاهدة ({episodes.length})</span>
              </button>

              <button
                onClick={() => setActiveTabSection('telegram')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTabSection === 'telegram'
                    ? 'bg-[#2AABEE] text-white shadow-md shadow-[#2AABEE]/30'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4 text-white" />
                <span>قنوات تيليجرام والتحميل </span>
              </button>

              <button
                onClick={() => setActiveTabSection('story')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTabSection === 'story'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>القصة الكاملة والتفاصيل</span>
              </button>

              {selectedAnime.characters && selectedAnime.characters.length > 0 && (
                <button
                  onClick={() => setActiveTabSection('characters')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTabSection === 'characters'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>الشخصيات ومؤدو الأصوات ({selectedAnime.characters.length})</span>
                </button>
              )}

              {animeRecordings.length > 0 && (
                <button
                  onClick={() => setActiveTabSection('themes')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                    activeTabSection === 'themes'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Music className="w-4 h-4" />
                  <span>الشارات بدون موسيقى ({animeRecordings.length})</span>
                </button>
              )}
            </div>

            {/* TAB 1: EPISODES LIST & WATCHER */}
            {activeTabSection === 'episodes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-bold font-tajawal text-white flex items-center gap-2">
                    <Play className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                    <span>حلقات ومقاطع {selectedAnime.title}</span>
                  </h4>
                  <span className="text-xs text-gray-400">انقر على أي حلقة لمشاهدتها بسيرفرات متعددة</span>
                </div>

                {episodes.length === 0 ? (
                  <div className="p-8 rounded-2xl yona-glass text-center text-gray-400 text-sm">
                    جاري تجهيز باقي الحلقات لهذا العمل في الأرشيف
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {episodes.map((ep) => {
                      const isPlaying = activeEpisode?.id === ep.id;
                      return (
                        <div
                          key={ep.id}
                          onClick={() => handlePlayEpisode(ep)}
                          className={`p-4 rounded-2xl yona-glass yona-glass-hover border transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                            isPlaying
                              ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500'
                              : 'border-white/10'
                          }`}
                        >
                          <div className="flex items-start gap-3.5">
                            <div className="relative w-24 h-16 rounded-xl bg-black overflow-hidden flex-shrink-0 border border-white/10">
                              <img
                                src={
                                  (ep.youtubeId && ep.youtubeId !== 'b8qH5Q1x3Xg')
                                    ? `https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg`
                                    : selectedAnime.coverImage
                                }
                                alt={ep.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                                <Play className="w-6 h-6 fill-white text-white drop-shadow-md" />
                              </div>
                              {isPlaying && (
                                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[9px] font-bold">
                                  يعرض الآن
                                </span>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-indigo-300">
                                  {selectedAnime.type === 'movie' ? 'فيلم' : `حلقة ${ep.number}`}
                                </span>
                                {ep.duration && (
                                  <span className="text-[10px] text-gray-400">{ep.duration}</span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                                {ep.title}
                              </h5>
                            </div>
                          </div>

                          {ep.summary && (
                            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed border-t border-white/5 pt-2">
                              {ep.summary}
                            </p>
                          )}

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePlayEpisode(ep);
                              }}
                              className="flex-1 py-1.5 rounded-lg bg-white/5 group-hover:bg-indigo-600 text-gray-300 group-hover:text-white font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{isPlaying ? 'المشغل نشط' : (selectedAnime.type === 'movie' ? 'مشاهدة الفيلم' : 'مشاهدة الحلقة')}</span>
                            </button>

                            {/* Direct Open in Independent Window */}
                            <a
                              href={(ep.youtubeId && ep.youtubeId !== 'b8qH5Q1x3Xg') ? `https://www.youtube.com/watch?v=${ep.youtubeId}` : (ep.externalWatchUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedAnime.title + ' ' + ep.title)}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
                              title="فتح في نافذة مستقلة ↗"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {ep.telegramUrl && (
                              <a
                                href={ep.telegramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 rounded-lg bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 text-[#2AABEE] transition-colors cursor-pointer"
                                title="مشاهدة على تيليجرام"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: DEDICATED TELEGRAM CHANNELS & DIRECT DOWNLOADS */}
            {activeTabSection === 'telegram' && (
              <div className="space-y-6 text-right animate-in fade-in duration-300">
                {/* Main Channel Highlight Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#0d2137] via-[#091523] to-[#080d14] border border-[#2AABEE]/30 shadow-2xl relative overflow-hidden">
                  <div className="absolute -left-20 -top-20 w-72 h-72 bg-[#2AABEE]/15 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#2AABEE]/20 border border-[#2AABEE]/40 flex items-center justify-center text-[#2AABEE] shadow-xl flex-shrink-0">
                        <Send className="w-8 h-8 -rotate-12 translate-x-0.5" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2AABEE]/20 border border-[#2AABEE]/40 text-[#2AABEE] text-xs font-black">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>القناة الرسمية المعتمدة لهذا العمل</span>
                        </div>
                        <h4 className="text-xl sm:text-2xl font-black font-tajawal text-white">
                          {selectedAnime.telegramChannelName || 'قناة سبيستون كرتون زمان'}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-300 max-w-xl leading-relaxed">
                          تحتوي هذه القناة على جميع حلقات وأفلام <strong>{selectedAnime.title}</strong> بجودة 1080p FHD الأصلية مع دبلجة مركز الزهرة وبدون إعلانات.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
                      <a
                        href={selectedAnime.telegramChannelUrl || 'https://t.me/SpacetoonTV'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-3 rounded-2xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold text-xs shadow-lg shadow-[#2AABEE]/30 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>فتح القناة في تيليجرام</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={selectedAnime.telegramWebPreviewUrl || 'https://t.me/s/SpacetoonTV'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-cyan-400" />
                        <span>تصفح بالمتصفح (Web)</span>
                      </a>

                      {selectedAnime.telegramBotSearchUrl && (
                        <a
                          href={selectedAnime.telegramBotSearchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-2xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/30 font-bold text-xs transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                        >
                          <Bot className="w-4 h-4 text-purple-400" />
                          <span>البحث في البوت </span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Episodes Direct Telegram Links Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-sm text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-[#2AABEE]" />
                      <span>روابط الحلقات المباشرة على تيليجرام ({episodes.length} حلقة)</span>
                    </h5>
                    <span className="text-[11px] text-gray-400">انقر لفتح الحلقة أو نسخ رابطها</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {episodes.map((ep) => {
                      const tgServer = ep.servers?.find(s => s.type === 'telegram');
                      const link = ep.telegramUrl || tgServer?.url || selectedAnime.telegramChannelUrl || 'https://t.me/SpacetoonTV';
                      return (
                        <div
                          key={ep.id}
                          className="p-3.5 rounded-2xl yona-glass border border-white/10 hover:border-[#2AABEE]/40 transition-all flex items-center justify-between gap-3 group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-[#2AABEE]/15 border border-[#2AABEE]/30 flex items-center justify-center text-[#2AABEE] flex-shrink-0 group-hover:scale-110 transition-transform">
                              <Send className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] text-[#2AABEE] font-bold">
                                {selectedAnime.type === 'movie' ? 'فيلم كامل' : `حلقة ${ep.number}`}
                              </span>
                              <h6 className="text-xs font-bold text-white truncate mt-0.5 group-hover:text-[#2AABEE] transition-colors">
                                {ep.title}
                              </h6>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => handleCopyLink(link)}
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                              title="نسخ الرابط"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <a
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-[#2AABEE]/20 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white border border-[#2AABEE]/30 font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>مشاهدة</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Directory of Top Verified Arabic Anime Telegram Channels */}
                <div className="p-6 rounded-3xl yona-glass border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h5 className="font-bold text-sm text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-amber-400" />
                        <span>دليل قنوات وبوتات تيليجرام المعتمدة للأنمي وسبيستون</span>
                      </h5>
                      <p className="text-xs text-gray-400">
                        قنوات حقيقية ومحدثة باستمرار توفر الحلقات والمسلسلات بجودة عالية وسيرفرات تيليجرام سريعة.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {TELEGRAM_CHANNELS_LIST.map((ch) => (
                      <div
                        key={ch.id}
                        className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#2AABEE]/30 transition-all flex flex-col justify-between gap-3 text-right"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2AABEE]/20 text-[#2AABEE]">
                              {ch.badge}
                            </span>
                            <span className="text-[11px] text-gray-400 font-mono">{ch.handle}</span>
                          </div>
                          <h6 className="font-bold text-xs text-white">{ch.name}</h6>
                          <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2">{ch.description}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={ch.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 rounded-xl bg-[#2AABEE]/15 hover:bg-[#2AABEE] text-[#2AABEE] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>فتح في تيليجرام</span>
                          </a>

                          <button
                            onClick={() => handleCopyLink(ch.url)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 cursor-pointer"
                            title="نسخ الرابط"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: DETAILED STORY & PRODUCTION NOTES */}
            {activeTabSection === 'story' && (
              <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 space-y-6 text-right">
                <div className="space-y-3">
                  <h4 className="text-xl font-bold font-tajawal text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>القصة الحقيقية المفصلة لـ {selectedAnime.title}</span>
                  </h4>
                  <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-line bg-black/20 p-5 rounded-2xl border border-white/5">
                    {selectedAnime.story || selectedAnime.description}
                  </div>
                </div>

                {/* Production Credits Table */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                  {selectedAnime.director && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[11px] text-gray-400">الإخراج الياباني:</span>
                      <p className="text-xs font-bold text-white">{selectedAnime.director}</p>
                    </div>
                  )}
                  {selectedAnime.writer && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[11px] text-gray-400">المؤلف والكاتب:</span>
                      <p className="text-xs font-bold text-white">{selectedAnime.writer}</p>
                    </div>
                  )}
                  {selectedAnime.arabicDubbingStudio && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <span className="text-[11px] text-gray-400">مركز الدبلجة والإنتاج العربي:</span>
                      <p className="text-xs font-bold text-emerald-400">{selectedAnime.arabicDubbingStudio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CHARACTERS & VOICE ACTORS */}
            {activeTabSection === 'characters' && selectedAnime.characters && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold font-tajawal text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>الشخصيات الرئيسية ومؤدو الأصوات</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedAnime.characters.map((char, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-2xl yona-glass border border-white/10 space-y-3 flex flex-col justify-between text-right"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={char.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                          alt={char.arabicName}
                          className="w-12 h-12 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <h5 className="font-bold text-sm text-white">{char.arabicName}</h5>
                          <span className="text-[11px] text-indigo-300 font-medium">{char.role}</span>
                        </div>
                      </div>

                      {char.description && (
                        <p className="text-xs text-gray-300 leading-relaxed">{char.description}</p>
                      )}

                      {char.voiceActor && (
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                          <span className="text-gray-400">مؤدي الصوت:</span>
                          <span className="text-[#F59E0B] font-bold">{char.voiceActor}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: VOCAL THEMES */}
            {activeTabSection === 'themes' && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold font-tajawal text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400" />
                  <span>الشارات والتوزيعات الصوتية الخالية من الموسيقى</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {animeRecordings.map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecording(rec)}
                      className="p-4 rounded-2xl yona-glass yona-glass-hover border border-white/10 cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-14 h-14 rounded-xl bg-black overflow-hidden flex-shrink-0 relative">
                        <img
                          src={`https://img.youtube.com/vi/${rec.youtubeVideo?.youtubeVideoId || 'b8qH5Q1x3Xg'}/hqdefault.jpg`}
                          alt={rec.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 fill-white text-white" />
                        </div>
                      </div>

                      <div className="overflow-hidden flex-1 text-right">
                        <h5 className="font-bold text-xs text-white group-hover:text-[#F59E0B] transition-colors truncate">
                          {rec.song?.title || rec.title}
                        </h5>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">
                          {rec.artists?.[0]?.name || 'يونا'}
                        </p>
                        <span className="inline-block mt-1 text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-full">
                          {rec.musicalKey || 'Vocals Only'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Subscription Gate Modal */}
      <YouTubeSubscriptionGateModal
        isOpen={showGateModal}
        onClose={() => {
          setShowGateModal(false);
          setPendingEpisode(null);
        }}
        onSuccess={handleGateUnlocked}
        title="تفعيل مشغل الأنمي وسيرفرات البث "
        description="لعمل السيرفرات وللمشاهدة بشكل جيد وسريع وبجودة 1080p Full HD، يرجى الاشتراك في قناتنا الرسمية على اليوتيوب أولاً:"
      />
    </div>
  );
};
