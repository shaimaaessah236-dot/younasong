import React, { useState, useEffect } from 'react';
import { Recording, ContestEntry } from '../types';
import {
  Settings,
  Sparkles,
  Youtube,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  BarChart2,
  RefreshCw,
  Tag,
  Cpu,
  Award,
  Crown,
  Music,
  Calendar,
  Clock,
  Printer,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import {
  getContestEntries,
  toggleSelectBestContestEntry,
  deleteContestEntry
} from '../lib/contestStorage';
import { OfficialCertificateModal } from './OfficialCertificateModal';

interface AdminDashboardProps {
  recordings: Recording[];
  onAddRecording: (rec: Recording) => void;
  onDeleteRecording: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  recordings,
  onAddRecording,
  onDeleteRecording,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'ai-pipeline' | 'manage' | 'analytics' | 'contestants'>('ai-pipeline');
  const [contestEntries, setContestEntries] = useState<ContestEntry[]>([]);
  const [selectedAdminCertEntry, setSelectedAdminCertEntry] = useState<ContestEntry | null>(null);

  const loadContestants = () => {
    setContestEntries(getContestEntries());
  };

  useEffect(() => {
    loadContestants();
    const handleUpdate = () => loadContestants();
    window.addEventListener('yona_contest_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('yona_contest_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // AI Pipeline Form State
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiResult, setAiResult] = useState<any>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // AI Auto-Tag State
  const [isAutoTagging, setIsAutoTagging] = useState(false);
  const [autoTaggedMap, setAutoTaggedMap] = useState<Record<string, { vocalStyle: string; mood: string }>>({});
  const [autoTagSuccessMsg, setAutoTagSuccessMsg] = useState('');

  const handleAutoTagRecordings = async () => {
    setIsAutoTagging(true);
    setAutoTagSuccessMsg('');
    try {
      const response = await fetch('/api/admin/auto-tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recordings }),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.taggedRecordings)) {
        const map: Record<string, { vocalStyle: string; mood: string }> = {};
        data.taggedRecordings.forEach((item: any) => {
          if (item.id) {
            map[item.id] = {
              vocalStyle: item.vocalStyle || 'صوت حماسي',
              mood: item.mood || 'ملهم / بطولي',
            };
          }
        });
        setAutoTaggedMap(map);
        setAutoTagSuccessMsg(`تم تصنيف وتحليل ${data.taggedRecordings.length} تسجيل بنجاح حسب الأسلوب الصوتي والمزاج الموسيقي باستخدام Gemini API!`);
      } else {
        setAutoTagSuccessMsg('تعذر إجراء الوسم التلقائي حالياً.');
      }
    } catch (err) {
      console.error('Auto tag error:', err);
      setAutoTagSuccessMsg('حدث خطأ أثناء إجراء تحليل الوسم التلقائي.');
    } finally {
      setIsAutoTagging(false);
    }
  };

  const handleAiTagging = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl && !videoTitle) return;

    setIsLoadingAi(true);
    setAiError('');
    setAiResult(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/ai/tag-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          videoTitle,
          videoDescription: videoDesc,
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data) {
        setAiResult(resData.data);
      } else {
        setAiError(resData.error || 'فشل الاتصال بالذكاء الاصطناعي Gemini');
      }
    } catch (err: any) {
      setAiError(err.message || 'حدث خطأ أثناء معالجة فيديو يوتيوب');
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleSaveAiResultToDb = () => {
    if (!aiResult) return;

    // Extract Youtube ID if URL provided
    let ytId = 'b8qH5Q1x3Xg';
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && match[1]) {
      ytId = match[1];
    }

    const newRec: Recording = {
      id: `rec-${Date.now()}`,
      songId: `song-${Date.now()}`,
      title: aiResult.songTitle || videoTitle || 'أغنية جديدة',
      recordingType: (aiResult.recordingType as any) || 'vocals_only',
      bpm: Number(aiResult.bpm) || 100,
      musicalKey: aiResult.musicalKey || 'G Minor',
      durationSeconds: 150,
      isMasterVocalOnly: true,
      vocalGender: (aiResult.vocalGender as any) || 'Female',
      lyricsSummary: aiResult.lyricsSummary || 'شارة بدون موسيقى بصوت بشري',
      song: {
        id: `song-${Date.now()}`,
        title: aiResult.songTitle || 'شارة أنمي',
        originalTitle: aiResult.originalTitle || 'Anime Theme',
        slug: `song-${Date.now()}`,
        releaseYear: 2025,
        description: aiResult.metaDescription || 'توزيع صوتي بشرّي من قناة Yona Songs'
      },
      youtubeVideo: {
        id: `yt-${Date.now()}`,
        recordingId: `rec-${Date.now()}`,
        youtubeVideoId: ytId,
        title: videoTitle || aiResult.songTitle || 'Yona Songs Track',
        channelName: 'Songs Without Music',
        isOfficialYonaChannel: true,
        viewCount: 15000,
        likeCount: 2200,
        publishedAt: new Date().toISOString()
      },
      artists: [{
        id: `art-${Date.now()}`,
        name: aiResult.artistName || 'يونا (Yona)',
        slug: 'yona',
        type: 'singer',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        isVerified: true
      }],
      animeList: [{
        id: `anime-${Date.now()}`,
        title: aiResult.animeTitle || 'سبيستون',
        slug: 'spacetoon',
        coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
      }]
    };

    onAddRecording(newRec);
    setSaveSuccess(true);
    setAiResult(null);
    setVideoUrl('');
    setVideoTitle('');
    setVideoDesc('');
  };

  return (
    <div className="space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl yona-glass border border-white/10">
        <div>
          <h2 className="text-2xl font-extrabold font-tajawal text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#F59E0B]" />
            <span>لوحة تحكم الأدمن والذكاء الاصطناعي (Gemini Admin)</span>
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            إدارة التسجيلات، الأناشيد، واستخراج البيانات المجدولة تلقائياً من يوتيوب عبر Gemini 3.6 Flash
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#0F0F12] border border-white/10">
          <button
            onClick={() => setActiveSubTab('ai-pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'ai-pipeline'
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>أتمتة الذكاء الاصطناعي</span>
          </button>

          <button
            onClick={() => setActiveSubTab('manage')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'manage'
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>إدارة التسجيلات ({recordings.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('contestants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'contestants'
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>المتسابقون والشهادات ({contestEntries.length}) </span>
          </button>

          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'analytics'
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>الإحصائيات والتحويلات</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: AI YOUTUBE AUTO-TAGGING PIPELINE */}
      {activeSubTab === 'ai-pipeline' && (
        <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 space-y-6 max-w-3xl mx-auto text-right">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/30 inline-block">
              Gemini 3.6 Flash Video Parser
            </span>
            <h3 className="text-2xl font-bold font-tajawal text-white">
              أتمتة استخراج شارات يوتيوب وإضافتها إلى الرسم المعرفي (1-Click AI Sync)
            </h3>
            <p className="text-xs text-gray-300">
              أدخل رابط أو عنوان فيديو يوتيوب جديد لقناة Yona Songs ليقوم الذكاء الاصطناعي بتصنيف الأغنية، الأنمي، الفنان، الـ BPM والمقام تلقائياً!
            </p>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>تمت إضافة الأغنية والتسجيل بنجاح إلى قاعدة بيانات Yona Songs!</span>
            </div>
          )}

          {aiError && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{aiError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAiTagging} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">رابط فيديو يوتيوب (YouTube Video URL / ID):</label>
              <div className="relative">
                <Youtube className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=b8qH5Q1x3Xg..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#0F0F12] border border-white/10 text-xs text-white focus:border-[#F59E0B] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">عنوان الفيديو الأصلي (اختياري):</label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="مثال: أغنية أنا وأخي بدون موسيقى Yona Songs"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F12] border border-white/10 text-xs text-white focus:border-[#F59E0B] outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-300 block">وصف الفيديو (اختياري):</label>
                <input
                  type="text"
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  placeholder="شوق يدفعني لأراها.. أمي ذكرى لا أنساها..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0F0F12] border border-white/10 text-xs text-white focus:border-[#F59E0B] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingAi}
              className="w-full py-3 rounded-2xl bg-[#F59E0B] hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoadingAi ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري تحليل الفيديو بواسطة Gemini AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>تحليل واستخراج البيانات تلقائياً</span>
                </>
              )}
            </button>
          </form>

          {/* AI Result Card */}
          {aiResult && (
            <div className="p-6 rounded-2xl bg-[#0F0F12] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#F59E0B]">النتائج المستخرجة بواسطة Gemini:</h4>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-md font-bold">
                  جاهز للحفظ 1-Click
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">اسم الشارة:</span>
                  <span className="font-bold text-white">{aiResult.songTitle}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">المطرب / المؤدي:</span>
                  <span className="font-bold text-white">{aiResult.artistName}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">الأنمي:</span>
                  <span className="font-bold text-white">{aiResult.animeTitle}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">نوع الصوت:</span>
                  <span className="font-bold text-indigo-300">{aiResult.vocalGender}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">إيقاع BPM:</span>
                  <span className="font-bold text-amber-300 font-inter">{aiResult.bpm} BPM</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#18181F] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">المقام:</span>
                  <span className="font-bold text-emerald-300 font-inter">{aiResult.musicalKey}</span>
                </div>
              </div>

              {aiResult.lyricsSummary && (
                <p className="text-xs text-gray-300 italic bg-white/5 p-2.5 rounded-xl">
                  "{aiResult.lyricsSummary}"
                </p>
              )}

              <button
                onClick={handleSaveAiResultToDb}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>تأكيد وحفظ التسجيل في الدليل الصوتي</span>
              </button>
            </div>
          )}

        </div>
      )}

      {/* SUBTAB 2: RECORDINGS MANAGEMENT TABLE */}
      {activeSubTab === 'manage' && (
        <div className="p-6 rounded-3xl yona-glass border border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div>
              <h3 className="font-bold text-base text-white">جدول التسجيلات الصوتية المسجلة ({recordings.length})</h3>
              <p className="text-xs text-gray-400">استعرض وسُم وادارة التسجيلات المتاحة مع خدمة الوسم التلقائي</p>
            </div>

            <button
              onClick={handleAutoTagRecordings}
              disabled={isAutoTagging}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isAutoTagging ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري الوسم التلقائي بـ Gemini AI...</span>
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4 text-purple-300" />
                  <span>AI Auto-Tag (وسم تلقائي بالذكاء الاصطناعي)</span>
                </>
              )}
            </button>
          </div>

          {autoTagSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-purple-950/80 border border-purple-500/30 text-purple-200 text-xs font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{autoTagSuccessMsg}</span>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#0F0F12] text-gray-400 font-bold border-b border-white/10">
                <tr>
                  <th className="p-3">عنوان الشارة</th>
                  <th className="p-3">المغني</th>
                  <th className="p-3">الأنمي</th>
                  <th className="p-3">BPM</th>
                  <th className="p-3">الأسلوب الصوتي (Vocal Style)</th>
                  <th className="p-3">المزاج الموسيقي (Mood)</th>
                  <th className="p-3">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recordings.map((rec) => {
                  const tagInfo = autoTaggedMap[rec.id];
                  return (
                    <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3 font-bold text-white">{rec.song?.title || rec.title}</td>
                      <td className="p-3 text-gray-300">{rec.artists?.[0]?.name || 'يونا'}</td>
                      <td className="p-3 text-gray-300">{rec.animeList?.[0]?.title || 'سبيستون'}</td>
                      <td className="p-3 font-inter text-amber-300 font-bold">{rec.bpm ? `${rec.bpm} BPM` : '-'}</td>
                      <td className="p-3 font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 inline-block font-sans">
                          {tagInfo?.vocalStyle || 'صوت حماسي / أوركسترا'}
                        </span>
                      </td>
                      <td className="p-3 font-medium">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 inline-block font-sans">
                          {tagInfo?.mood || 'ملهم / بطولي'}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => onDeleteRecording(rec.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                          title="حذف التسجيل"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ANALYTICS VIEW */}
      {activeSubTab === 'analytics' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl yona-glass border border-white/10 space-y-2 text-right">
            <span className="text-xs text-gray-400 font-bold">إجمالي المشاهدات الصوتية:</span>
            <div className="text-3xl font-black font-inter text-[#F59E0B]">1,245,800</div>
            <p className="text-[11px] text-emerald-400">↑ +18.4% هذا الشهر على يوتيوب</p>
          </div>

          <div className="p-6 rounded-3xl yona-glass border border-white/10 space-y-2 text-right">
            <span className="text-xs text-gray-400 font-bold">معدل التحويل لاشتراكات القناة:</span>
            <div className="text-3xl font-black font-inter text-indigo-400">14.2%</div>
            <p className="text-[11px] text-gray-400">4,240+ مشترك على @yona_songs</p>
          </div>

          <div className="p-6 rounded-3xl yona-glass border border-white/10 space-y-2 text-right">
            <span className="text-xs text-gray-400 font-bold">سجلات البحث الشائعة:</span>
            <div className="text-xs text-gray-300 space-y-1 font-medium pt-1">
              <div>1. أنا وأخي بدون موسيقى (42%)</div>
              <div>2. القناص قد لمعت أعيانه (28%)</div>
              <div>3. عهد الأصدقاء حلمنا نهار (18%)</div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 4: CONTESTANTS & OFFICIAL CERTIFICATES MANAGEMENT */}
      {activeSubTab === 'contestants' && (
        <div className="space-y-6 text-right">
          
          {/* Header Card */}
          <div className="p-6 rounded-3xl yona-glass border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white font-tajawal flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <span>سجل المتسابقين والشهادات الصادرة وتدقيق الأسماء</span>
              </h3>
              <p className="text-xs text-gray-300">
                لوحة تدقيق حصرية لمالك المنصة: متابعة المشاركات، التوقيت الفعلي للغناء، مراقبة تعديل أسماء الشهادات ومقارنتها بالاسم الأصلي للزوار، وإدارة التتويج وطباعة الشهادات.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/50 text-amber-300 text-xs font-bold font-mono">
                {contestEntries.length} متسابق
              </span>
            </div>
          </div>

          {/* Contestants Table */}
          <div className="rounded-3xl yona-glass border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10 text-gray-400">
                    <th className="p-3.5 font-bold">المتسابق (الاسم العام)</th>
                    <th className="p-3.5 font-bold">الاسم المعتمد على الشهادة</th>
                    <th className="p-3.5 font-bold">الشارة</th>
                    <th className="p-3.5 font-bold">تاريخ وتوقيت الغناء</th>
                    <th className="p-3.5 font-bold">الدرجة الصوتية</th>
                    <th className="p-3.5 font-bold">حالة التتويج</th>
                    <th className="p-3.5 font-bold text-center">إجراءات المالك</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {contestEntries.map((entry) => {
                    const isCustomized = entry.customCertificateName && entry.customCertificateName !== (entry.originalPublicName || entry.singerName);
                    return (
                      <tr key={entry.id} className="hover:bg-white/5 transition-colors">
                        
                        {/* Original Public Name */}
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">
                            {entry.originalPublicName || entry.singerName}
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {entry.countryOrCity}
                          </span>
                        </td>

                        {/* Certificate Name (Audited for Owner) */}
                        <td className="p-3.5">
                          {isCustomized ? (
                            <div className="space-y-1">
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[11px] font-bold block">
                                {entry.customCertificateName}
                              </span>
                              <span className="text-[9px] text-amber-300/80 font-mono block">
                                 تم تخصيص الاسم من المتسابق
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-300 font-medium">
                              {entry.singerName}
                              <span className="text-[10px] text-gray-500 block">مطابق للاسم المعلن</span>
                            </span>
                          )}
                        </td>

                        {/* Song Title */}
                        <td className="p-3.5">
                          <span className="text-white font-medium flex items-center gap-1.5">
                            <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{entry.songTitle}</span>
                          </span>
                        </td>

                        {/* Date & Exact Timestamp */}
                        <td className="p-3.5">
                          <div className="space-y-0.5 font-mono text-[11px]">
                            <span className="text-gray-300 flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>{entry.formattedDateAr || entry.date}</span>
                            </span>
                            {entry.exactTimestamp && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500 shrink-0" />
                                <span>{new Date(entry.exactTimestamp).toLocaleTimeString('ar-SA')}</span>
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Vocal Score & Tier */}
                        <td className="p-3.5">
                          <div className="space-y-0.5">
                            <span className="px-2 py-0.5 rounded-lg bg-black/60 border border-white/10 font-mono font-black text-amber-300 text-xs">
                              {entry.score}%
                            </span>
                            <span className="text-[10px] text-purple-300 block">
                              {entry.pitchTier}
                            </span>
                          </div>
                        </td>

                        {/* Podium / Best Rank Selector */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                toggleSelectBestContestEntry(entry.id, 'first');
                                loadContestants();
                              }}
                              className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                entry.bestRank === 'first'
                                  ? 'bg-amber-400 text-black shadow'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
                              }`}
                              title="المركز الأول "
                            >
                              
                            </button>
                            <button
                              onClick={() => {
                                toggleSelectBestContestEntry(entry.id, 'second');
                                loadContestants();
                              }}
                              className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                entry.bestRank === 'second'
                                  ? 'bg-slate-300 text-black shadow'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
                              }`}
                              title="المركز الثاني "
                            >
                              
                            </button>
                            <button
                              onClick={() => {
                                toggleSelectBestContestEntry(entry.id, 'third');
                                loadContestants();
                              }}
                              className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                                entry.bestRank === 'third'
                                  ? 'bg-amber-700 text-white shadow'
                                  : 'bg-white/5 hover:bg-white/10 text-gray-400'
                              }`}
                              title="المركز الثالث "
                            >
                              
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedAdminCertEntry(entry)}
                              className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 font-bold flex items-center gap-1.5 cursor-pointer transition-all text-xs"
                              title="معاينة وطباعة الشهادة بصلاحية المالك"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>الشهادة </span>
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('هل تريد حذف هذه المشاركة؟')) {
                                  deleteContestEntry(entry.id);
                                  loadContestants();
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                              title="حذف المشاركة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ADMIN OFFICIAL CERTIFICATE MODAL */}
      {selectedAdminCertEntry && (
        <OfficialCertificateModal
          isOpen={!!selectedAdminCertEntry}
          onClose={() => setSelectedAdminCertEntry(null)}
          data={{
            entryId: selectedAdminCertEntry.id,
            singerName: selectedAdminCertEntry.customCertificateName || selectedAdminCertEntry.singerName,
            originalPublicName: selectedAdminCertEntry.originalPublicName || selectedAdminCertEntry.singerName,
            customCertificateName: selectedAdminCertEntry.customCertificateName,
            customCertificateNameEn: selectedAdminCertEntry.customCertificateNameEn,
            countryOrCity: selectedAdminCertEntry.countryOrCity,
            songTitle: selectedAdminCertEntry.songTitle,
            score: selectedAdminCertEntry.score,
            pitchTier: selectedAdminCertEntry.pitchTier,
            date: selectedAdminCertEntry.formattedDateAr || selectedAdminCertEntry.selectedAt || selectedAdminCertEntry.date,
            exactTimestamp: selectedAdminCertEntry.exactTimestamp,
            formattedDateAr: selectedAdminCertEntry.formattedDateAr,
            formattedDateEn: selectedAdminCertEntry.formattedDateEn,
            certificateNumber: selectedAdminCertEntry.certificateNumber,
            verificationHash: selectedAdminCertEntry.verificationHash,
            badge: selectedAdminCertEntry.badge,
            juryNotes: selectedAdminCertEntry.juryNotes,
            votes: selectedAdminCertEntry.votes
          }}
          canEditSingerName={true}
          onUpdateSingerName={() => {
            loadContestants();
          }}
        />
      )}

    </div>
  );
};
