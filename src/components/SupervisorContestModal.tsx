import React, { useState, useRef } from 'react';
import {
  X,
  Lock,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Edit3,
  Trash2,
  Crown,
  Sparkles,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  Music,
  User,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ContestEntry } from '../types';
import {
  updateContestEntryManual,
  deleteContestEntry,
  toggleSelectBestContestEntry
} from '../lib/contestStorage';
import { analyzeVoicePerformance } from '../lib/voiceScoringEngine';

interface SupervisorContestModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: ContestEntry[];
  onUpdateEntries: (updated: ContestEntry[]) => void;
  language?: string;
}

export const SupervisorContestModal: React.FC<SupervisorContestModalProps> = ({
  isOpen,
  onClose,
  entries,
  onUpdateEntries,
  language = 'ar'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Editing state per entry
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editScore, setEditScore] = useState<number>(0);
  const [editSongTitle, setEditSongTitle] = useState<string>('');
  const [editSingerName, setEditSingerName] = useState<string>('');
  const [editJuryNotes, setEditJuryNotes] = useState<string>('');
  const [editRank, setEditRank] = useState<'first' | 'second' | 'third' | null>(null);

  // Automated Re-Analysis state
  const [isAnalyzingId, setIsAnalyzingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  const handleStartEdit = (entry: ContestEntry) => {
    setEditingId(entry.id);
    setEditScore(entry.score);
    setEditSongTitle(entry.songTitle);
    setEditSingerName(entry.singerName);
    setEditJuryNotes(entry.juryNotes || '');
    setEditRank(entry.bestRank || null);
  };

  const handleSaveEdit = (entryId: string) => {
    const updates: Partial<ContestEntry> = {
      score: Number(editScore),
      songTitle: editSongTitle.trim() || undefined,
      singerName: editSingerName.trim() || undefined,
      juryNotes: editJuryNotes.trim() || undefined,
      bestRank: editRank,
      isSelectedBest: editRank !== null
    };

    const updated = updateContestEntryManual(entryId, updates);
    onUpdateEntries(updated);
    setEditingId(null);
    showToast('تم حفظ التعديلات اليدوية للأداء بنجاح!');
  };

  const handleDelete = (entry: ContestEntry) => {
    if (playingId === entry.id && audioRefs.current[entry.id]) {
      audioRefs.current[entry.id]?.pause();
      setPlayingId(null);
    }
    const updated = deleteContestEntry(entry.id);
    onUpdateEntries(updated);
    showToast(`تم حذف مشاركة (${entry.singerName}) نهائياً بنجاح.`);
  };

  const handleTogglePlay = (entry: ContestEntry) => {
    const entryId = entry.id;
    if (playingId && playingId !== entryId && audioRefs.current[playingId]) {
      audioRefs.current[playingId].pause();
    }

    let audio = audioRefs.current[entryId];
    if (!audio) {
      audio = new Audio(entry.audioUrl || '');
      audioRefs.current[entryId] = audio;
      audio.onended = () => setPlayingId(null);
    }

    if (playingId === entryId) {
      audio.pause();
      setPlayingId(null);
    } else {
      if (entry.audioUrl) {
        audio.src = entry.audioUrl;
        audio.play().then(() => setPlayingId(entryId)).catch((e) => {
          console.warn('Playback error:', e);
          showToast('تعذر تشغيل الصوت (قد يكون الرابط غير متاح أو تالف).');
        });
      } else {
        showToast('لا يوجد تسجيل صوتي متاح لهذه المشاركة.');
      }
    }
  };

  // ⚡ إعادة الفحص الصوتي الصارم آلياً باستخدام محرك التحكيم الصوتي
  const handleAutomatedReAnalysis = async (entry: ContestEntry) => {
    if (!entry.audioUrl) {
      showToast('لا يوجد ملف صوتي لإجراء الفحص الآلي.');
      return;
    }

    setIsAnalyzingId(entry.id);
    try {
      let audioBlob: Blob;
      if (entry.audioUrl.startsWith('data:') || entry.audioUrl.startsWith('blob:')) {
        const resp = await fetch(entry.audioUrl);
        audioBlob = await resp.blob();
      } else if (entry.audioUrl.startsWith('http')) {
        const resp = await fetch(entry.audioUrl);
        audioBlob = await resp.blob();
      } else {
        showToast('صيغة الصوت غير مدعومة للفحص الآلي المباشر.');
        setIsAnalyzingId(null);
        return;
      }

      // تشغيل خوارزمية الفحص الصوتي الصارمة
      const result = await analyzeVoicePerformance(
        audioBlob,
        entry.songTitle,
        [],
        entry.comment || ''
      );

      const updates: Partial<ContestEntry> = {
        score: result.overallScore,
        pitchTier: result.pitchTier,
        voiceType: result.voiceType,
        juryNotes: result.critiqueNotes
      };

      const updated = updateContestEntryManual(entry.id, updates);
      onUpdateEntries(updated);

      if (!result.hasHumanVoice) {
        showToast(`فحص آلي: لم يتم رصد صوت بشري حقيقي (النتيجة: ${result.overallScore}%).`);
      } else {
        showToast(`فحص آلي مكتمل: درجة الأداء الحقيقية (${result.overallScore}%) - ${result.tonalMatch}`);
      }
    } catch (err) {
      console.error('Error during automated re-analysis:', err);
      showToast('تعذر فحص الصوت آلياً، يمكنك تعديل النتيجة يدوياً.');
    } finally {
      setIsAnalyzingId(null);
    }
  };

  const filteredEntries = entries.filter((e) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      e.singerName.toLowerCase().includes(q) ||
      e.songTitle.toLowerCase().includes(q) ||
      (e.countryOrCity && e.countryOrCity.toLowerCase().includes(q))
    );
  });

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full max-h-[90vh] flex flex-col bg-[#0F172A] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden text-right font-sans"
        dir="rtl"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border-b border-slate-700/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  لوحة تحكم المشرف ولجنة التحكيم
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  صلاحيات كاملة (يدوي + آلي)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                الاستماع لأصوات المتسابقين، تعديل النتائج وأسماء الأغاني يدوياً، أو إعادة الفحص الذكي الصارم، وحذف المشاركات غير اللائقة.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="إغلاق اللوحة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Summary Stats */}
        <div className="p-4 bg-[#1E293B]/60 border-b border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم المتسابق أو الأغنية..."
              className="w-full pr-9 pl-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>إجمالي المشاركات:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              {entries.length} أداء
            </span>
          </div>
        </div>

        {/* Toast alert */}
        {toastMessage && (
          <div className="px-4 py-2.5 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
              <p className="text-sm">لا توجد مشاركات مطابقة للبحث.</p>
            </div>
          ) : (
            filteredEntries.map((entry) => {
              const isEditing = editingId === entry.id;
              const isPlaying = playingId === entry.id;
              const isAnalyzing = isAnalyzingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[#1E293B] border border-slate-700/60 shadow-md space-y-3 transition-all"
                >
                  {/* Top Bar: Singer name, song, and quick player */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      {/* Audio Play/Pause Button */}
                      <button
                        type="button"
                        onClick={() => handleTogglePlay(entry)}
                        disabled={!entry.audioUrl}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          isPlaying
                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                            : entry.audioUrl
                            ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border border-slate-700'
                            : 'bg-slate-800/40 text-slate-600 cursor-not-allowed'
                        }`}
                        title={isPlaying ? 'إيقاف الاستماع' : 'الاستماع للصوت الفعلي للمتسابق'}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {entry.singerName}
                          </span>
                          {entry.countryOrCity && (
                            <span className="text-[11px] text-slate-400">
                              ({entry.countryOrCity})
                            </span>
                          )}
                          {entry.bestRank && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/40 flex items-center gap-1">
                              <Crown className="w-3 h-3 fill-current" />
                              <span>المركز {entry.bestRank === 'first' ? 'الأول' : entry.bestRank === 'second' ? 'الثاني' : 'الثالث'}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                          <Music className="w-3.5 h-3.5 text-emerald-400" />
                          <span>الشارة: <strong>{entry.songTitle}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Score & Action triggers */}
                    <div className="flex items-center gap-2">
                      <div className="text-left font-mono">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-700 font-black text-emerald-300 text-xs sm:text-sm">
                          {entry.score}%
                        </span>
                      </div>

                      {/* Quick Edit Toggle */}
                      <button
                        type="button"
                        onClick={() => (isEditing ? setEditingId(null) : handleStartEdit(entry))}
                        className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isEditing
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700'
                        }`}
                        title="تعديل الدرجة واسم الأغنية يدوياً"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>{isEditing ? 'إلغاء' : 'تعديل يدوي'}</span>
                      </button>

                      {/* Automated AI Re-Evaluation */}
                      <button
                        type="button"
                        onClick={() => handleAutomatedReAnalysis(entry)}
                        disabled={isAnalyzing || !entry.audioUrl}
                        className="px-2.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all disabled:opacity-50"
                        title="إعادة الفحص الصوتي الذكي والصارم آلياً"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-purple-400 ${isAnalyzing ? 'animate-spin' : ''}`} />
                        <span>{isAnalyzing ? 'جاري الفحص...' : 'فحص آلي'}</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs transition-colors cursor-pointer"
                        title="حذف هذه المشاركة نهائياً"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Manual Edit Panel (when open) */}
                  {isEditing && (
                    <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3 animate-in fade-in">
                      <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 pb-1 border-b border-slate-800">
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>التعديل اليدوي لصاحب المنصة / المشرف:</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Edit Score */}
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block">
                            الدرجة الصوتية (من 0 إلى 100):
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={editScore}
                            onChange={(e) => setEditScore(parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Edit Song Title */}
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block">
                            اسم أو عنوان الشارة / الأغنية:
                          </label>
                          <input
                            type="text"
                            value={editSongTitle}
                            onChange={(e) => setEditSongTitle(e.target.value)}
                            placeholder="مثال: شارة يا غيوم / ريمي..."
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        {/* Edit Singer Name */}
                        <div className="space-y-1">
                          <label className="text-slate-300 font-bold block">
                            اسم المتسابق:
                          </label>
                          <input
                            type="text"
                            value={editSingerName}
                            onChange={(e) => setEditSingerName(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Edit Jury Feedback Notes */}
                      <div className="space-y-1 text-xs">
                        <label className="text-slate-300 font-bold block">
                          ملاحظات وتقرير لجنة التحكيم المكتوب:
                        </label>
                        <textarea
                          rows={2}
                          value={editJuryNotes}
                          onChange={(e) => setEditJuryNotes(e.target.value)}
                          placeholder="اكتب تقييم لجنة التحكيم للأداء..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                        />
                      </div>

                      {/* Crowning options */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-slate-400 font-medium">التتويج:</span>
                          <button
                            type="button"
                            onClick={() => setEditRank('first')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              editRank === 'first'
                                ? 'bg-emerald-500 text-black border-emerald-400'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            المركز الأول 🥇
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRank('second')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              editRank === 'second'
                                ? 'bg-slate-400 text-black border-slate-300'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            المركز الثاني 🥈
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditRank('third')}
                            className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              editRank === 'third'
                                ? 'bg-amber-600 text-white border-amber-500'
                                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            المركز الثالث 🥉
                          </button>
                          {editRank && (
                            <button
                              type="button"
                              onClick={() => setEditRank(null)}
                              className="px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 text-xs underline cursor-pointer"
                            >
                              إلغاء التتويج
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer text-xs"
                          >
                            إلغاء
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(entry.id)}
                            className="px-4 py-1.5 rounded-lg bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>حفظ التعديلات</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Jury Review / Notes */}
                  {entry.juryNotes && !isEditing && (
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                      <span className="text-emerald-400 font-bold ml-1">تقرير التحكيم:</span>
                      <span>{entry.juryNotes}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1E293B] border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <span>لوحة التحكم سرية ومخصصة لإدارة المنصة ولجنة التحكيم.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
