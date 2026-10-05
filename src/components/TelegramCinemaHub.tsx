import React, { useState } from 'react';
import { TelegramChannel, TelegramCategory } from '../types';
import { TELEGRAM_CHANNELS_LIST } from '../lib/telegramData';
import { searchMediaWithAI, AIMediaSearchResult } from './geminiService';
import { AIMediaResultCard } from './AIMediaResultCard';
import {
  isUserSubscribedToYouTube,
  YouTubeSubscriptionBanner,
  YouTubeSubscriptionGateModal
} from './YouTubeSubscriptionGate';
import {
  Send,
  Bot,
  Search,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Film,
  Tv,
  Clapperboard,
  Flame,
  CheckCircle2,
  Share2,
  Youtube,
  Play,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TelegramCinemaHubProps {
  onNavigateToAnime?: () => void;
  onNavigateToRecordings?: () => void;
}

export const TelegramCinemaHub: React.FC<TelegramCinemaHubProps> = ({
  onNavigateToAnime,
  onNavigateToRecordings
}) => {
  const { language, isRtl, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<TelegramCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // YouTube Subscription Gating
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => isUserSubscribedToYouTube());
  const [showGateModal, setShowGateModal] = useState<boolean>(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  // AI Assistant States
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIMediaSearchResult | null>(null);

  const handleOpenChannelUrl = (_e: React.MouseEvent, url: string) => {
    if (!isSubscribed) {
      setPendingUrl(url);
    }
  };

  const handleGateUnlocked = () => {
    setIsSubscribed(true);
    if (pendingUrl) {
      window.open(pendingUrl, '_blank', 'noopener,noreferrer');
      setPendingUrl(null);
    }
  };

  const handleCopy = (url: string, id: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleRunAiSearch = async (queryText?: string) => {
    const textToSearch = queryText || aiInput;
    if (!textToSearch.trim()) return;

    setAiLoading(true);
    setAiResult(null);
    if (queryText) setAiInput(queryText);

    const res = await searchMediaWithAI(textToSearch);
    setAiResult(res);
    setAiLoading(false);
  };

  // Filter channels based on search and category
  const filteredChannels = TELEGRAM_CHANNELS_LIST.filter((ch) => {
    const matchesCategory = selectedCategory === 'all' || ch.category === selectedCategory || (selectedCategory === 'bots' && ch.type === 'bot');
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ch.name.toLowerCase().includes(q) ||
      ch.handle.toLowerCase().includes(q) ||
      ch.description.toLowerCase().includes(q) ||
      ch.badge.toLowerCase().includes(q) ||
      ch.featuredContent?.some((f) => f.toLowerCase().includes(q));

    return matchesCategory && matchesQuery;
  });

  const categories: { key: TelegramCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: language === 'ar' ? 'جميع القنوات والبوتات' : 'All Channels & Bots', icon: <Layers className="w-4 h-4" /> },
    { key: 'bots', label: language === 'ar' ? 'بوتات البحث والتحميل' : 'Search & Download Bots', icon: <Bot className="w-4 h-4" /> },
    { key: 'netflix', label: language === 'ar' ? 'عروض نتفلكس' : 'Netflix Shows', icon: <Tv className="w-4 h-4" /> },
    { key: 'movies', label: language === 'ar' ? 'سينما وأفلام' : 'Cinema & Movies', icon: <Film className="w-4 h-4" /> },
    { key: 'anime', label: language === 'ar' ? 'أنمي وكرتون' : 'Anime & Cartoon', icon: <Clapperboard className="w-4 h-4" /> },
    { key: 'kdrama', label: language === 'ar' ? 'مسلسلات كورية (طبيب الشبح)' : 'K-Drama Series', icon: <Flame className="w-4 h-4" /> },
  ];

  const quickPrompts = language === 'ar' ? [
    ' أريد مسلسلات نتفلكس الحصرية',
    ' أين أجد مسلسل طبيب الشبح Ghost Doctor؟',
    ' أفلام سينما جديدة بجودة 1080p',
    ' أفضل بوتات تيليجرام للبحث الفوري',
    ' أنمي ياباني مترجم وجي سيكاي',
    ' كرتون سبيستون القديم مدبلج'
  ] : [
    ' Exclusive Netflix series',
    ' Where to find Ghost Doctor series?',
    ' New 1080p cinema movies',
    ' Best instant search Telegram bots',
    ' Subtitled Japanese Anime',
    ' Classic dubbed Spacetoon cartoons'
  ];

  return (
    <div className={`space-y-8 animate-in fade-in duration-300 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* YouTube Subscription Requirement Banner */}
      <YouTubeSubscriptionBanner onUnlocked={() => setIsSubscribed(true)} />

      {/* Top Hero Banner */}
      <div className={`relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-[#0b1c2d] via-[#091522] to-[#080d14] border border-[#2AABEE]/30 shadow-2xl overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
        {/* Glow Halo */}
        <div className="absolute -left-20 -top-20 w-80 h-80 bg-[#2AABEE]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2AABEE]/15 border border-[#2AABEE]/30 text-[#2AABEE] text-xs font-black">
                <Send className="w-3.5 h-3.5 -rotate-12" />
                <span>{t('telegramHeroTitle', 'Telegram Cinema & 4K Streaming Hub')}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-tajawal text-white tracking-tight leading-tight">
                {language === 'ar' ? 'مشاهدة وتحميل الأفلام والمسلسلات والأنمي' : 'Watch & Download Movies, Series & Anime'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'تصفح وافتح مباشرة قنوات وبوتات تيليجرام لأحدث أفلام السينما، عروض نتفلكس، ومسلسلات الدراما والكيدراما.'
                  : 'Direct access to verified Telegram channels and bots for high-definition 1080p anime, movies, and exclusive series.'}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <a
                href="https://t.me/SaveAsBot"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenChannelUrl(e, 'https://t.me/SaveAsBot')}
                className="px-4 py-2.5 rounded-2xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold text-xs shadow-lg shadow-[#2AABEE]/25 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span>{language === 'ar' ? 'بوت تحميل الوسائط والفيديو' : 'Media Download Bot'}</span>
              </a>

              <a
                href="https://t.me/NetFlix_Arabic"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleOpenChannelUrl(e, 'https://t.me/NetFlix_Arabic')}
                className="px-4 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/25 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Send className="w-4 h-4 -rotate-12" />
                <span>{language === 'ar' ? 'قناة نتفلكس ومسلسلات' : 'Netflix Series Channel'}</span>
              </a>

              <a
                href="https://youtube.com/@yona_songs?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/25 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                <span>اشترك في قناة Yona</span>
              </a>
            </div>
          </div>

          {/* AI Search Assistant Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-white/15 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white font-tajawal">
                    المساعد والباحث الذكي بالذكاء الاصطناعي (AI Cinema & Media Search)
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    اكتب اسم أي فيلم، مسلسل، أنمي، أو تصنيف وسيدلك الذكاء الاصطناعي على القناة أو البوت المناسب فوراً
                  </p>
                </div>
              </div>
            </div>

            {/* Input & Search Button */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAiSearch()}
                  placeholder="مثال: أين أجد مسلسل كوري مثل طبيب الشبح؟ أو أفلام نتفلكس"
                  className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-[#0c1220] border border-purple-500/35 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner"
                />
                <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
              </div>

              <button
                onClick={() => handleRunAiSearch()}
                disabled={aiLoading || !aiInput.trim()}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] flex-shrink-0"
              >
                {aiLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>بحث ذكي وتوصية</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="text-xs text-gray-400 font-bold flex items-center gap-1">
                <span>اقتراحات سريعة:</span>
              </span>
              {[
                ' أريد مسلسلات نتفلكس الحصرية',
                ' أين أجد مسلسل طبيب الشبح Ghost Doctor؟',
                ' أفلام سينما جديدة بجودة 1080p',
                ' أفضل بوتات تيليجرام للبحث الفوري',
                ' أنمي ياباني مترجم وجي سيكاي',
                ' كرتون سبيستون القديم مدبلج'
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunAiSearch(prompt)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-purple-200 border border-white/10 hover:border-purple-500/40 text-xs font-bold transition-all cursor-pointer hover:scale-105"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* AI Result Box with Multi-Source Hub */}
            {aiResult && (
              <div className="pt-2">
                <AIMediaResultCard
                  result={aiResult}
                  onQueryClick={(query) => handleRunAiSearch(query)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar for Telegram Channels */}
      <div className="space-y-4 text-right">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.key
                    ? 'bg-[#2AABEE] text-white shadow-lg shadow-[#2AABEE]/25'
                    : 'bg-[#18181F] text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Local Channel Filter Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="فلترة القنوات والبوتات..."
              className="w-full pl-4 pr-10 py-2 rounded-xl bg-[#18181F] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#2AABEE] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Verified Telegram Channels & Bots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChannels.map((channel) => (
          <div
            key={channel.id}
            className={`p-6 rounded-3xl yona-glass border border-white/10 hover:border-[#2AABEE]/40 transition-all flex flex-col justify-between gap-5 text-right relative overflow-hidden group bg-gradient-to-br ${channel.highlightColor || 'from-white/5 to-white/5'}`}
          >
            {/* Top Bar: Badge, Handle, Type */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-white/10 text-white border border-white/15 flex items-center gap-1.5 shadow-sm">
                  {channel.badge}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-mono font-bold">{channel.handle}</span>
                  {channel.isVerified && (
                    <CheckCircle2 className="w-4 h-4 text-[#2AABEE]" title="قناة موثقة" />
                  )}
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold font-tajawal text-white group-hover:text-[#2AABEE] transition-colors flex items-center gap-2">
                  {channel.type === 'bot' ? (
                    <Bot className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  ) : (
                    <Send className="w-5 h-5 text-[#2AABEE] flex-shrink-0 -rotate-12" />
                  )}
                  <span className="truncate">{channel.name}</span>
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed line-clamp-3">
                  {channel.description}
                </p>
              </div>

              {/* Featured Content Tags */}
              {channel.featuredContent && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {channel.featuredContent.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md bg-black/40 text-gray-300 text-[10px] border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Actions: Open Telegram, Web Preview, Copy */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                <a
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenChannelUrl(e, channel.url)}
                  className="flex-1 py-2.5 rounded-xl bg-[#2AABEE] hover:bg-[#229ED9] text-white font-extrabold text-xs shadow-md shadow-[#2AABEE]/20 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{channel.type === 'bot' ? 'بدء استخدام البوت ' : 'فتح في تطبيق تيليجرام'}</span>
                  <ExternalLink className="w-3 h-3 opacity-75" />
                </a>

                <button
                  onClick={() => handleCopy(channel.url, channel.id)}
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                  title="نسخ رابط القناة"
                >
                  {copiedId === channel.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {channel.webPreviewUrl && (
                <a
                  href={channel.webPreviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => handleOpenChannelUrl(e, channel.webPreviewUrl!)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تصفح محتوى القناة عبر المتصفح (Web Preview)</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredChannels.length === 0 && (
        <div className="p-12 rounded-3xl yona-glass text-center space-y-3">
          <Send className="w-12 h-12 text-[#2AABEE] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">لم نجد قنوات تتطابق مع بحثك</h3>
          <p className="text-xs text-gray-400">جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#2AABEE] text-white font-bold text-xs cursor-pointer"
          >
            عرض جميع القنوات
          </button>
        </div>
      )}

      {/* Bottom Cross-Hub Promos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4">
        {/* Anime Hub Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex flex-col justify-between gap-4 text-right">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
              <Clapperboard className="w-4 h-4" />
              <span>مكتبة الأنمي وسبيستون المتكاملة</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              مشغل الأنمي والكرتون وسينما الأفلام
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              استمتع بمشاهدة حلقات كونان، القناص، عهد الأصدقاء، دروب ريمي، وأفلام غيبلي بدبلجة الزهرة وسيرفرات تيليجرام وأرشيف المفتوح.
            </p>
          </div>

          <button
            onClick={onNavigateToAnime}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer w-fit"
          >
            <span>انتقل إلى مكتبة الأنمي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>

        {/* YouTube & Vocals Audio Hub Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 to-orange-950/60 border border-amber-500/20 flex flex-col justify-between gap-4 text-right">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#F59E0B] text-xs font-bold">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>قناة Yona Songs الرسمية على يوتيوب</span>
            </div>
            <h4 className="text-lg font-bold text-white">
              شارات وأغاني بدون موسيقى (Vocals Only)
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              استمع إلى تسجيلات الأكابلا والكاريوكي البشري النقي بصوت يونا لأعذب شارات الطفولة وسبيستون والأنمي.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToRecordings}
              className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-black font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>تصفح الدليل الصوتي</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>

            <a
              href="https://youtube.com/@yona_songs?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Youtube className="w-4 h-4" />
              <span>يوتيوب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Subscription Gate Modal */}
      <YouTubeSubscriptionGateModal
        isOpen={showGateModal}
        onClose={() => {
          setShowGateModal(false);
          setPendingUrl(null);
        }}
        onSuccess={handleGateUnlocked}
        title="تفعيل مشاهدة الأفلام وقنوات تيليجرام "
        description="لعمل القنوات والروابط وللمشاهدة بشكل جيد وسريع وبجودة عالية، يرجى الاشتراك في قناتنا على اليوتيوب أولاً:"
      />
    </div>
  );
};
