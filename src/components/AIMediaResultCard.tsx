import React, { useState } from 'react';
import { AIMediaSearchResult, LiveWebSource, ExternalSearchLink } from './geminiService';
import {
  Sparkles,
  Send,
  Youtube,
  Globe,
  Film,
  Tv,
  Star,
  Calendar,
  Clock,
  ExternalLink,
  Play,
  Bot,
  Layers,
  Search,
  CheckCircle2,
  HelpCircle,
  Clapperboard,
  Compass,
  Info,
  Music,
  Copy,
  Check,
  Radio,
  BookOpen,
  Mic2,
  Share2
} from 'lucide-react';
import { isUserSubscribedToYouTube, YouTubeSubscriptionGateModal } from './YouTubeSubscriptionGate';

interface AIMediaResultCardProps {
  result: AIMediaSearchResult;
  onQueryClick?: (query: string) => void;
}

export const AIMediaResultCard: React.FC<AIMediaResultCardProps> = ({ result, onQueryClick }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'telegram' | 'youtube' | 'web' | 'live_sources'>('all');
  const [showGateModal, setShowGateModal] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [copiedLyrics, setCopiedLyrics] = useState(false);

  const media = result.mediaInfo;
  const music = result.musicAnalysis;
  const telegramSources = result.telegramSources || result.recommendedChannels || [];
  const youtubeSources = result.youtubeSources || [];
  const webSources = result.webStreamingSources || [];
  const liveSources = result.liveWebSources || [];
  const externalEngines = result.externalSearchLinks || [];
  const quickFacts = result.quickFacts || [];
  const searchQueries = result.searchQueriesUsed || [];

  const handleLinkClick = (_e: React.MouseEvent, url: string) => {
    // Links open immediately and smoothly
    setPendingUrl(url);
  };

  const handleGateUnlocked = () => {
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
      setPendingUrl(null);
    }
  };

  const handleCopyLyrics = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case 'movie':
        return { label: ' فيلم سينمائي', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'series':
        return { label: ' مسلسل تلفزيوني', bg: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'anime':
        return { label: ' أنمي ياباني', bg: 'bg-purple-500/20 text-purple-300 border-purple-500/30' };
      case 'kdrama':
        return { label: ' دراما كورية (K-Drama)', bg: 'bg-pink-500/20 text-pink-300 border-pink-500/30' };
      case 'cartoon':
        return { label: ' كرتون وسبيستون', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'song':
        return { label: ' شارة / عمل صوتي', bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      default:
        return { label: ' محتوى وسائط ومعرفة', bg: 'bg-slate-500/20 text-slate-300 border-slate-500/30' };
    }
  };

  const typeInfo = getTypeLabel(media?.type);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0c1322] via-[#0e172a] to-[#070b14] border border-purple-500/30 shadow-2xl p-5 sm:p-7 text-right space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Google Live Grounding & Queries Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-black/40 border border-purple-500/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-gray-300 font-bold">متصل ببحث Google المباشر ومحركات البحث العالمية</span>
        </div>

        {searchQueries.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-gray-500 text-[11px]">الاستعلامات الحية:</span>
            {searchQueries.map((q, qIdx) => (
              <span key={qIdx} className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[10px] font-mono">
                {q}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 2. Header Media Info Banner */}
      {media && media.title && (
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-black border ${typeInfo.bg}`}>
                  {typeInfo.label}
                </span>
                {media.rating && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{media.rating}</span>
                  </span>
                )}
                {media.releaseYear && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{media.releaseYear}</span>
                  </span>
                )}
                {media.episodesOrDuration && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{media.episodesOrDuration}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black font-tajawal text-white mt-2">
                {media.title}
                {media.englishTitle && (
                  <span className="text-sm sm:text-base font-normal text-purple-300 block sm:inline-block sm:mr-3">
                    ({media.englishTitle})
                  </span>
                )}
              </h3>
            </div>

            {(media.directorOrStudio || media.composerOrSinger) && (
              <div className="text-xs text-gray-400 bg-black/40 px-3 py-2 rounded-xl border border-white/5 self-start space-y-1">
                {media.directorOrStudio && (
                  <div>
                    <span className="text-gray-500">الاستوديو / المخرج: </span>
                    <span className="text-gray-200 font-bold">{media.directorOrStudio}</span>
                  </div>
                )}
                {media.composerOrSinger && (
                  <div>
                    <span className="text-gray-500">الأداء / التلحين: </span>
                    <span className="text-purple-300 font-bold">{media.composerOrSinger}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Genres Chips */}
          {media.genres && media.genres.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {media.genres.map((g, gIdx) => (
                <span
                  key={gIdx}
                  className="px-2.5 py-0.5 rounded-lg bg-purple-950/50 border border-purple-500/20 text-purple-300 text-[11px]"
                >
                  #{g}
                </span>
              ))}
            </div>
          )}

          {/* Synopsis / Story */}
          {media.story && (
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-gray-300 text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-purple-300 ml-1">ملخص القصة والمحتوى: </span>
              {media.story}
            </div>
          )}
        </div>
      )}

      {/* 3. Music & Chords & Scale Deep Analysis (If Available) */}
      {music && (music.songTitle || music.musicalScale || music.fullLyricsVerified) && (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#180f28] to-[#10081d] border border-purple-500/40 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <div className="flex items-center gap-2 text-purple-300 font-black text-sm">
              <Music className="w-4 h-4 text-purple-400" />
              <span>تحليل الشارة، الكلمات والمقام الموسيقي </span>
            </div>
            {music.musicalScale && (
              <span className="px-3 py-1 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-200 text-xs font-bold">
                المقام: {music.musicalScale}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {music.composer && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 block text-[10px]">الملحن:</span>
                <span className="font-bold text-white text-xs">{music.composer}</span>
              </div>
            )}
            {music.singer && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 block text-[10px]">المغني / المؤدي:</span>
                <span className="font-bold text-white text-xs">{music.singer}</span>
              </div>
            )}
            {music.rhythmOrBpm && (
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-gray-400 block text-[10px]">الإيقاع والسرعة:</span>
                <span className="font-bold text-emerald-300 text-xs">{music.rhythmOrBpm}</span>
              </div>
            )}
          </div>

          {music.fullLyricsVerified && (
            <div className="p-4 rounded-xl bg-black/60 border border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300">الكلمات الموثقة:</span>
                <button
                  onClick={() => handleCopyLyrics(music.fullLyricsVerified || '')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedLyrics ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>نسخ الكلمات</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs sm:text-sm text-gray-200 whitespace-pre-wrap leading-loose font-tajawal font-medium bg-black/40 p-3 rounded-lg border border-white/5">
                {music.fullLyricsVerified}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 4. AI Recommendation & Insights Text */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-xs sm:text-sm">
          <Sparkles className="w-4 h-4" />
          <span>توصية وتحليل المساعد الذكي المدعوم بمحركات البحث:</span>
        </div>
        <div className="text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap bg-black/30 p-4 rounded-2xl border border-white/5">
          {result.reply}
        </div>
      </div>

      {/* 5. Quick Verified Facts */}
      {quickFacts.length > 0 && (
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            <span>حقائق سريعة موثقة من الويب:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
            {quickFacts.map((fact, fIdx) => (
              <div key={fIdx} className="flex items-start gap-2 bg-black/30 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>{fact}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. External Search Engines Launchpad (شريط محركات البحث الخارجية المباشرة) */}
      {externalEngines.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0d1b2a] via-[#101426] to-[#0c1824] border border-cyan-500/30 space-y-3 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-cyan-300 font-black text-xs sm:text-sm">
              <Globe className="w-4 h-4 text-cyan-400" />
              <span>البحث المباشر في محركات البحث وقواعد البيانات الخارجية :</span>
            </div>
            <span className="text-[11px] text-gray-400">انتقال فوري بضغطة زر</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {externalEngines.map((eng, eIdx) => {
              return (
                <a
                  key={eIdx}
                  href={eng.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleLinkClick(e, eng.url)}
                  className="p-2.5 rounded-xl bg-black/40 hover:bg-cyan-950/40 border border-white/10 hover:border-cyan-400/40 transition-all flex items-center justify-between gap-2 group cursor-pointer hover:scale-[1.02]"
                >
                  <div className="text-right min-w-0">
                    <span className="block text-xs font-bold text-gray-200 group-hover:text-cyan-300 truncate">
                      {eng.label}
                    </span>
                    {eng.badge && (
                      <span className="text-[10px] text-gray-500 group-hover:text-gray-400 block truncate">
                        {eng.badge}
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-cyan-400 flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Multi-Source Filter Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 flex-wrap">
        <div className="text-xs font-black text-gray-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>أماكن وروابط المشاهدة والمصادر:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 text-xs flex-wrap">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              activeTab === 'all' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            الكل ({telegramSources.length + youtubeSources.length + webSources.length + liveSources.length})
          </button>
          <button
            onClick={() => setActiveTab('telegram')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'telegram' ? 'bg-[#2AABEE] text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Send className="w-3 h-3" />
            <span>تيليجرام ({telegramSources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'youtube' ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Youtube className="w-3 h-3" />
            <span>يوتيوب ({youtubeSources.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('web')}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'web' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>المنصات ({webSources.length})</span>
          </button>
          {liveSources.length > 0 && (
            <button
              onClick={() => setActiveTab('live_sources')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                activeTab === 'live_sources' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Radio className="w-3 h-3" />
              <span>مصادر Google الحية ({liveSources.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* 8. Display Sources */}
      <div className="space-y-4">
        
        {/* Live Google Search Sources Section */}
        {(activeTab === 'all' || activeTab === 'live_sources') && liveSources.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-cyan-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5" />
                <span>مصادر Google المعتمدة الحية (Live Web Citations):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {liveSources.map((ls, lsIdx) => (
                <div
                  key={lsIdx}
                  className="p-3 rounded-2xl bg-gradient-to-br from-[#091522] to-[#070e17] border border-cyan-500/30 hover:border-cyan-400/60 transition-all flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="min-w-0 text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-cyan-900/40 text-cyan-300 text-[10px] font-mono border border-cyan-500/20">
                        {ls.domain || 'web'}
                      </span>
                    </div>
                    <h5 className="text-xs sm:text-sm font-bold text-white truncate" title={ls.title}>
                      {ls.title}
                    </h5>
                  </div>

                  <a
                    href={ls.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, ls.url)}
                    className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-md shadow-cyan-600/25 transition-all flex items-center gap-1 flex-shrink-0 cursor-pointer hover:scale-105"
                  >
                    <span>فتح المصدر</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Telegram Sources Section */}
        {(activeTab === 'all' || activeTab === 'telegram') && telegramSources.length > 0 && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#2AABEE] flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                <span>قنوات وبوتات تيليجرام (مشاهدة وتحميل فوري بدون إعلانات):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {telegramSources.map((ch, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0c1829] to-[#0a121e] border border-[#2AABEE]/20 hover:border-[#2AABEE]/50 transition-all flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="min-w-0 text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate">{ch.name}</h5>
                      {ch.type === 'bot' && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30">
                          بوت ذكي 
                        </span>
                      )}
                      {ch.badge && (
                        <span className="px-1.5 py-0.5 rounded bg-[#2AABEE]/15 text-[#2AABEE] text-[10px] font-bold">
                          {ch.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400 leading-snug truncate">{ch.reason}</p>
                  </div>

                  <a
                    href={ch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, ch.url)}
                    className="px-3.5 py-2 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold text-xs shadow-md shadow-[#2AABEE]/25 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:scale-105"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>فتح بالقناة</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* YouTube Sources Section */}
        {(activeTab === 'all' || activeTab === 'youtube') && youtubeSources.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-400 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" />
                <span>يوتيوب (إعلانات رسمية، مقاطع وحلقات، شارات وموسيقى):</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {youtubeSources.map((yt, yIdx) => (
                <div
                  key={yIdx}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1a0f12] to-[#120a0d] border border-red-500/20 hover:border-red-500/50 transition-all flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="min-w-0 text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate">{yt.title}</h5>
                      <span className="px-1.5 py-0.5 rounded bg-red-600/20 text-red-300 text-[10px] font-bold border border-red-500/30">
                        {yt.type === 'trailer' ? 'تريلر رسمي ' : yt.type === 'ost' ? 'موسيقى وكلمات ' : 'فيديو كامل ▶'}
                      </span>
                    </div>
                    {yt.description && (
                      <p className="text-[11px] text-gray-400 leading-snug truncate">{yt.description}</p>
                    )}
                  </div>

                  <a
                    href={yt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, yt.url)}
                    className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-md shadow-red-600/25 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>مشاهدة بيوتيوب</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Web & Streaming Platforms Section */}
        {(activeTab === 'all' || activeTab === 'web') && webSources.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>المنصات الرسمية ومواقع وقواعد بيانات المشاهدة:</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {webSources.map((web, wIdx) => (
                <div
                  key={wIdx}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-[#0c1d18] to-[#081310] border border-emerald-500/20 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3 shadow-lg"
                >
                  <div className="min-w-0 text-right space-y-1">
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs sm:text-sm font-bold text-white truncate">{web.platformName}</h5>
                      {web.availability && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {web.availability === 'subscription' ? 'اشتراك رسمي' : web.availability === 'free' ? 'مجاني' : 'قاعدة بيانات'}
                        </span>
                      )}
                    </div>
                    {web.notes && (
                      <p className="text-[11px] text-gray-400 leading-snug truncate">{web.notes}</p>
                    )}
                  </div>

                  <a
                    href={web.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleLinkClick(e, web.url)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer hover:scale-105"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>انتقال للموقع</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 9. How to Watch Practical Steps */}
      {result.howToWatchGuide && result.howToWatchGuide.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-2">
          <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>نصائح وخطوات للمشاهدة والتحميل بأفضل جودة:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
            {result.howToWatchGuide.map((step, sIdx) => (
              <div key={sIdx} className="flex items-start gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Follow-up search queries */}
      {result.suggestedQueries && result.suggestedQueries.length > 0 && (
        <div className="pt-2 border-t border-white/10 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-400 font-bold">جرّب البحث أيضاً عن:</span>
          {result.suggestedQueries.map((sq, sqIdx) => (
            <button
              key={sqIdx}
              onClick={() => onQueryClick && onQueryClick(sq)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-purple-200 border border-white/10 text-xs transition-all cursor-pointer"
            >
              {sq}
            </button>
          ))}
        </div>
      )}

      {/* Subscription Gate Modal */}
      <YouTubeSubscriptionGateModal
        isOpen={showGateModal}
        onClose={() => {
          setShowGateModal(false);
          setPendingUrl(null);
        }}
        onSuccess={handleGateUnlocked}
        title="تفعيل مشاهدة الأفلام وقنوات البث "
        description="لعمل القنوات والروابط وللمشاهدة بشكل جيد وسريع وبجودة عالية، يرجى الاشتراك في قناتنا على اليوتيوب أولاً:"
      />
    </div>
  );
};
