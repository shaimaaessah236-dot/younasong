import React, { useState, useEffect } from 'react';
import {
  Heart,
  Send,
  Sparkles,
  Music,
  User,
  Plus,
  Flame,
  CheckCircle2,
  Clock,
  MessageCircleHeart,
  Share2,
  X,
  Filter,
  Volume2
} from 'lucide-react';
import {
  FanDedicationOrRequest,
  getDedications,
  addDedication,
  toggleUpvoteDedication
} from '../lib/dedicationsStorage';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface FanDedicationsHubProps {
  onSelectSongToSing?: (songTitle: string) => void;
}

export const FanDedicationsHub: React.FC<FanDedicationsHubProps> = ({
  onSelectSongToSing
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const { isDarkMode } = useTheme();
  const [items, setItems] = useState<FanDedicationOrRequest[]>([]);
  const [filter, setFilter] = useState<'all' | 'requests' | 'dedications' | 'popular'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<'song_request' | 'dedication'>('song_request');
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [animeOrSpacetoon, setAnimeOrSpacetoon] = useState('سبيستون كلاسيك');
  const [message, setMessage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    setItems(getDedications());
  }, []);

  const handleUpvote = (id: string) => {
    const updated = toggleUpvoteDedication(id);
    setItems(updated);
  };

  const handleShareDedication = (item: FanDedicationOrRequest) => {
    const text =
      item.type === 'dedication'
        ? ` إهداء خاص من ${item.senderName} ${item.recipientName ? `${item.recipientName}` : ''}:\n"${item.message}"\n الشارة: ${item.songTitle} (${item.animeOrSpacetoon})\nمنصة Yona Songs`
        : ` طلب شارة Vocals Only من ${item.senderName}: "${item.songTitle}"\n"${item.message}"\nصوت للطلب في منصة Yona Songs!`;

    navigator.clipboard.writeText(text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim() || !songTitle.trim() || !message.trim()) return;

    addDedication({
      type: formType,
      senderName: senderName.trim(),
      recipientName: formType === 'dedication' ? recipientName.trim() : undefined,
      songTitle: songTitle.trim(),
      animeOrSpacetoon: animeOrSpacetoon.trim() || 'سبيستون كلاسيك',
      message: message.trim()
    });

    setItems(getDedications());
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsModalOpen(false);
      setSenderName('');
      setRecipientName('');
      setSongTitle('');
      setMessage('');
    }, 1500);
  };

  const filteredItems = items
    .filter((item) => {
      if (filter === 'requests') return item.type === 'song_request';
      if (filter === 'dedications') return item.type === 'dedication';
      return true;
    })
    .sort((a, b) => {
      if (filter === 'popular') return b.upvotes - a.upvotes;
      return 0;
    });

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1c1228] via-[#151022] to-[#0c0f1c] border border-pink-500/25 p-6 sm:p-8 shadow-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/30 text-pink-300 text-xs font-bold">
              <MessageCircleHeart className="w-3.5 h-3.5 text-pink-400" />
              <span>{t('dedicationsHeroTitle', 'Fan Dedications & Sentimental Wall')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-tajawal">
              {language === 'ar' ? 'صندوق طلب الشارات وإهداءات الأصدقاء' : 'Fan Song Requests & Dedications Box'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {language === 'ar'
                ? 'شاركونا ذكرياتكم الدافئة.. اطلبوا الشارة الكرتونية التي تتمنون سماعها بصوت نقي بدون موسيقى، أو أهدوا شارة لصديق عزيز مع رسالة تلامس قلبه وتُعرض في المجتمع.'
                : 'Share warm nostalgia: request acapella soundtracks or dedicate songs to friends with personalized messages displayed on the fan wall.'}
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`py-3 px-5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all hover:scale-[1.02] self-start md:self-auto border ${
              isDarkMode
                ? 'bg-gradient-to-r from-sky-400 via-black to-pink-500 hover:from-sky-300 hover:to-pink-400 text-white border-sky-400/30 shadow-sky-500/20'
                : 'bg-gradient-to-r from-sky-400 via-white to-pink-500 hover:from-sky-300 hover:to-pink-400 text-black border-sky-400/40 shadow-pink-500/15'
            }`}
          >
            <Plus className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-black'}`} />
            <span className={isDarkMode ? 'text-white font-black' : 'text-black font-black'}>
              {language === 'ar' ? 'أرسل إهداء أو اطلب شارة' : 'Send Dedication / Request'}
            </span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-[#0e1220] border border-white/10">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'ar' ? `الكل (${items.length})` : `All (${items.length})`}
          </button>
          <button
            onClick={() => setFilter('requests')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'requests'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'طلبات الشارات' : 'Song Requests'} ({items.filter((i) => i.type === 'song_request').length})</span>
          </button>
          <button
            onClick={() => setFilter('dedications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'dedications'
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'إهداءات الأصدقاء' : 'Fan Dedications'} ({items.filter((i) => i.type === 'dedication').length})</span>
          </button>
          <button
            onClick={() => setFilter('popular')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filter === 'popular'
                ? 'bg-amber-500 text-black font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الأكثر طلباً وتصويتاً' : 'Most Popular'}</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 px-2 font-mono">
          أصوات الجمهور والذكريات
        </span>
      </div>

      {/* Grid of Dedications & Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => {
          const isDedication = item.type === 'dedication';
          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all duration-300 space-y-4 relative flex flex-col justify-between ${
                isDedication
                  ? 'bg-gradient-to-b from-[#1c1224] via-[#140e1c] to-[#0d0912] border-pink-500/25 hover:border-pink-400/50 shadow-lg shadow-pink-950/20'
                  : 'bg-gradient-to-b from-[#11172e] via-[#0d1222] to-[#070b16] border-indigo-500/25 hover:border-indigo-400/50 shadow-lg shadow-indigo-950/20'
              }`}
            >
              <div className="space-y-3">
                {/* Badges & Meta */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 ${
                        isDedication
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {isDedication ? <Heart className="w-3 h-3 text-pink-400" /> : <Music className="w-3 h-3 text-indigo-400" />}
                      <span>{isDedication ? 'إهداء خاص' : 'طلب شارة'}</span>
                    </span>

                    {/* Status Pill */}
                    {item.status === 'in_production' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>قيد التسجيل بالاستوديو </span>
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>متاحة بالأرشيف</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">{item.date}</span>
                </div>

                {/* Sender & Recipient Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm sm:text-base">{item.senderName}</span>
                    {item.recipientName && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-200 text-xs font-bold">
                        {item.recipientName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="font-bold text-[#E5C07B]">{item.songTitle}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{item.animeOrSpacetoon}</span>
                  </div>
                </div>

                {/* The Emotional Message / Request */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed p-3.5 rounded-2xl bg-black/40 border border-white/5 font-medium italic">
                  "{item.message}"
                </p>
              </div>

              {/* Bottom Actions: Upvote & Share */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <button
                  onClick={() => handleUpvote(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    item.upvotedByMe
                      ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30 font-black'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
                  }`}
                  title="تصويت وتأييد هذا الطلب/الإهداء"
                >
                  <Heart className={`w-3.5 h-3.5 ${item.upvotedByMe ? 'fill-white' : ''}`} />
                  <span>{item.upvotes}</span>
                  <span className="hidden sm:inline">أحببته</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleShareDedication(item)}
                    className="p-1.5 px-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    title="مشاركة الإهداء"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedId === item.id ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>

                  {onSelectSongToSing && (
                    <button
                      onClick={() => onSelectSongToSing(item.songTitle)}
                      className="p-1.5 px-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      title="غناء الشارة في الاستوديو"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>غناء </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SUBMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-xl my-auto bg-[#131726] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400">
                  <MessageCircleHeart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white font-tajawal">
                    أرسل إهداءك أو اطلب شارة جديدة
                  </h4>
                  <p className="text-xs text-slate-300">
                    صوتك وذكرياتك تعني لنا الكثير في استوديو يونا
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type Selector */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/40 border border-white/10">
              <button
                type="button"
                onClick={() => setFormType('song_request')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formType === 'song_request'
                    ? 'bg-indigo-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>طلب شارة (Vocals Only)</span>
              </button>
              <button
                type="button"
                onClick={() => setFormType('dedication')}
                className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  formType === 'dedication'
                    ? 'bg-pink-600 text-white shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>إهداء لصديق أو شخص عزيز</span>
              </button>
            </div>

            {formSuccess ? (
              <div className="p-8 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto animate-bounce" />
                <h5 className="font-black text-white text-base font-tajawal">
                  تم إرسال {formType === 'dedication' ? 'الإهداء' : 'الطلب'} بنجاح! 
                </h5>
                <p className="text-xs text-emerald-200">
                  شكراً لمشاركتك الدافئة، تم إدراجها في قائمة المجتمع للمتابعين.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-slate-300 font-bold block">اسمك المستعار:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: يوسف، سارة..."
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                    />
                  </div>

                  {formType === 'dedication' ? (
                    <div className="space-y-1">
                      <label className="text-xs text-pink-300 font-bold block">إلى من تهدي الشارة؟:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: إلى أختي، إلى صديقي حمزة..."
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="text-xs text-indigo-300 font-bold block">التصنيف أو الأنمي:</label>
                      <input
                        type="text"
                        placeholder="سبيستون كلاسيك، أنمي ياباني..."
                        value={animeOrSpacetoon}
                        onChange={(e) => setAnimeOrSpacetoon(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-bold block">اسم الشارة المطلوبة:</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: عهد الأصدقاء، ريمي، هزيم الرعد، الحديقة السرية..."
                    value={songTitle}
                    onChange={(e) => setSongTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-bold block">
                    {formType === 'dedication' ? 'رسالة الإهداء أو الكلمات النابعة من القلب:' : 'لماذا تحب هذه الشارة وتريد سماعها بدون موسيقى؟'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder={
                      formType === 'dedication'
                        ? 'اكتب رسالة دافئة تعبر عن حبك ووفائك وذكرياتكم الجميلة...'
                        : 'صف إحساسك ورغبتك في سماع هذه الشارة بأداء أكابيلا صوتي نقي...'
                    }
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs focus:outline-none focus:border-pink-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className={`w-full py-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all border ${
                    isDarkMode
                      ? 'bg-gradient-to-r from-sky-400 via-black to-pink-500 hover:from-sky-300 hover:to-pink-400 text-white border-sky-400/30 shadow-sky-500/20'
                      : 'bg-gradient-to-r from-sky-400 via-white to-pink-500 hover:from-sky-300 hover:to-pink-400 text-black border-sky-400/40 shadow-pink-500/15'
                  }`}
                >
                  <Send className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-black'}`} />
                  <span className={isDarkMode ? 'text-white font-black' : 'text-black font-black'}>نشر في لوحة المجتمع الآن </span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
