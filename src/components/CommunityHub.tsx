import React, { useState, useEffect } from 'react';
import { CommunityEvent, EventEntry, QuizQuestion } from '../types';
import { ContestBoard } from './ContestBoard';
import { FanDedicationsHub } from './FanDedicationsHub';
import { ThemeQuizChallenge } from './ThemeQuizChallenge';
import {
  Vote,
  Trophy,
  Sparkles,
  ThumbsUp,
  Plus,
  Clock,
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Mic,
  Crown,
  Heart,
  Award,
  Lock,
  Unlock,
  ShieldCheck,
  Star,
  FileText
} from 'lucide-react';
import {
  QUIZ_STAGES,
  calculateQuizScoreReport,
  QuizScoreReport
} from '../lib/quizData';
import { SpacetoonQuizCertificateModal } from './SpacetoonQuizCertificateModal';
import { useLanguage } from '../context/LanguageContext';

interface CommunityHubProps {
  events: CommunityEvent[];
  onVote: (eventId: string, entryId: string) => void;
  onAddSuggestion: (eventId: string, title: string, artist: string) => void;
  quizQuestions: QuizQuestion[];
  onNavigateToStudio?: () => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  events,
  onVote,
  onAddSuggestion,
  quizQuestions,
  onNavigateToStudio
}) => {
  const { language, isRtl, t, translateSong } = useLanguage();
  const [activeTab, setActiveTab] = useState<'singing_contest' | 'dedications' | 'voting' | 'quiz'>('singing_contest');

  // Voting Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Quiz Evaluation & 3-Stage Progression State (70% pass, 71% win, 93% certificate)
  const [quizStage, setQuizStage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yona_quiz_current_stage');
      if (saved) return Math.min(3, Math.max(1, parseInt(saved, 10) || 1));
    }
    return 1;
  });

  const [unlockedStage, setUnlockedStage] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yona_quiz_unlocked_stage');
      if (saved) return Math.min(3, Math.max(1, parseInt(saved, 10) || 1));
    }
    return 1;
  });

  const [hasEarnedCert, setHasEarnedCert] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yona_quiz_completed_cert') === 'true';
    }
    return false;
  });

  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Sync state from storage if updated
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedStage = localStorage.getItem('yona_quiz_current_stage');
        const savedUnlocked = localStorage.getItem('yona_quiz_unlocked_stage');
        const certEarned = localStorage.getItem('yona_quiz_completed_cert') === 'true';

        if (savedStage) setQuizStage(Math.min(3, Math.max(1, parseInt(savedStage, 10) || 1)));
        if (savedUnlocked) setUnlockedStage(Math.min(3, Math.max(1, parseInt(savedUnlocked, 10) || 1)));
        setHasEarnedCert(certEarned);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleStageSelect = (stageId: number) => {
    if (stageId > unlockedStage) return;
    setQuizStage(stageId);
    try {
      localStorage.setItem('yona_quiz_current_stage', stageId.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleStageUnlocked = (newUnlocked: number) => {
    const higher = Math.max(unlockedStage, newUnlocked);
    setUnlockedStage(higher);
    try {
      localStorage.setItem('yona_quiz_unlocked_stage', higher.toString());
    } catch (e) {
      console.error(e);
    }
  };

  const handleCertificateEarned = () => {
    setHasEarnedCert(true);
    try {
      localStorage.setItem('yona_quiz_completed_cert', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Certificate score report representation (93%+ mastery)
  const certReport: QuizScoreReport = calculateQuizScoreReport(10, 10, 100, 3);

  const mainEvent = events[0];

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !mainEvent) return;
    onAddSuggestion(mainEvent.id, newTitle, newArtist || 'فنان سبيستون');
    setNewTitle('');
    setNewArtist('');
    setShowAddForm(false);
  };

  return (
    <div className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Title Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl yona-glass border border-white/10 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div>
          <h2 className="text-2xl font-extrabold font-tajawal text-white flex items-center gap-2">
            <Vote className="w-6 h-6 text-[#F59E0B]" />
            <span>{t('communityHeroTitle', 'Audience Voting & Fan Polls Arena')}</span>
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {language === 'ar'
              ? 'صوّت للشارة القادمة واختبر معلوماتك وشغفك بشارات الأنمي في تحدي حزر الشارة'
              : 'Vote for upcoming acapella tracks, compete in the Grand Vocal Contest, and send fan dedications.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#0F0F12] border border-white/10">
          <button
            onClick={() => setActiveTab('singing_contest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'singing_contest'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/20 font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span>{language === 'ar' ? 'مسابقة الأصوات وتتويج الأفضل' : 'Grand Vocal Contest'}</span>
          </button>

          <button
            onClick={() => setActiveTab('dedications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'dedications'
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-400" />
            <span>{language === 'ar' ? 'طلب الشارات والإهداءات' : 'Fan Dedications'}</span>
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'voting'
                ? 'bg-[#F59E0B] text-black shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Vote className="w-4 h-4" />
            <span>{language === 'ar' ? 'تصويت الشارة القادمة' : 'Vote Next Song'}</span>
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md shadow-amber-400/25 font-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{language === 'ar' ? 'تحدي احزر الشارة (Quiz)' : 'Theme Quiz'}</span>
            {hasEarnedCert ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-black font-extrabold flex items-center gap-1 shadow-sm">
                <Award className="w-3 h-3 text-black" />
                {language === 'ar' ? 'معتمد' : 'Certified'}
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-black/40 text-amber-300 font-bold border border-amber-400/30">
                {language === 'ar' ? '3 مراحل' : '3 Stages'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 0: SINGING CONTEST & WINNERS BOARD */}
      {activeTab === 'singing_contest' && (
        <ContestBoard onNavigateToStudio={onNavigateToStudio} />
      )}

      {/* TAB 1: FAN DEDICATIONS & SONG REQUESTS */}
      {activeTab === 'dedications' && (
        <FanDedicationsHub onSelectSongToSing={onNavigateToStudio ? () => onNavigateToStudio() : undefined} />
      )}

      {/* TAB 1: VOTING SYSTEM */}
      {activeTab === 'voting' && mainEvent && (
        <div className="space-y-6">
          
          <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold border border-[#F59E0B]/30 inline-block mb-2">
                  تصويت نشط لقناة Yona Songs
                </span>
                <h3 className="text-2xl font-bold font-tajawal text-white">
                  {mainEvent.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1">
                  {mainEvent.description}
                </p>
              </div>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2.5 rounded-2xl bg-[#F59E0B] hover:bg-amber-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-[#F59E0B]/20 transition-all cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>اقترح أغنية جديدة للتصويت</span>
              </button>
            </div>

            {/* Add Proposal Form */}
            {showAddForm && (
              <form onSubmit={handleSuggestionSubmit} className="p-4 rounded-2xl bg-[#0F0F12] border border-white/10 space-y-3">
                <h4 className="font-bold text-xs text-white">تقديم اقتراح شارة جديدة:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="اسم الشارة أو الأغنية..."
                    required
                    className="px-3.5 py-2 rounded-xl bg-[#18181F] border border-white/10 text-xs text-white focus:border-[#F59E0B] outline-none"
                  />
                  <input
                    type="text"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="اسم المغني الأصلي أو الأنمي..."
                    className="px-3.5 py-2 rounded-xl bg-[#18181F] border border-white/10 text-xs text-white focus:border-[#F59E0B] outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 text-gray-400 hover:text-white text-xs"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#F59E0B] text-black font-bold text-xs"
                  >
                    إرسال الاقتراح
                  </button>
                </div>
              </form>
            )}

            {/* Voting Entries List */}
            <div className="space-y-3 pt-2">
              {mainEvent.entries?.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[#0F0F12] border border-white/5 hover:border-white/10 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-white/5 text-gray-400 font-inter font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">
                        {entry.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {entry.originalArtist || 'أنمي سبيستون'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onVote(mainEvent.id, entry.id)}
                    className="px-4 py-2 rounded-xl bg-[#18181F] hover:bg-[#F59E0B] text-[#F59E0B] hover:text-black border border-[#F59E0B]/30 hover:border-[#F59E0B] font-bold text-xs flex items-center gap-2 transition-all cursor-pointer group"
                  >
                    <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>صوّت ({entry.votesCount})</span>
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: GUESS THE SONG QUIZ GAME WITH 3-STAGE ACCURATE EVALUATION */}
      {activeTab === 'quiz' && (
        <div className="space-y-6">

          {/* ============================================================== */}
          {/*  OFFICIAL 3-STAGE EVALUATION BANNER (70% | 80% | 93% CERT)    */}
          {/* ============================================================== */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#181c28] to-[#0f121b] border-2 border-amber-500/30 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              {/* Header Title & Badges */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-black border border-amber-400/30 inline-flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-amber-400" />
                      نظام التقييم الدقيق لاختبار احزر الشارة (سبيستون)
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      3 مراحل متدرجة الصعوبة
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black font-tajawal text-white">
                    مسار امتحان شارات سبيستون ونيل الشهادة الرسمية 
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
                    تمت معايرة هذا الاختبار بنظام تقييم دقيق ومرجعي:
                    <strong className="text-amber-400 font-bold mx-1">70%</strong> للمرور للمرحلة التالية،
                    <strong className="text-amber-400 font-bold mx-1">71% (واحد وسبعون بالمئة)</strong> للفوز والتأهل لامتحان الأساطير، و
                    <strong className="text-amber-400 font-bold mx-1">93%</strong> لنيل شهادة إتمام الاختبار الرسمية المعتمدة!
                  </p>
                </div>

                {/* Certificate Quick Launcher Button */}
                {hasEarnedCert && (
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-400/30 transition-all hover:scale-105 cursor-pointer self-start md:self-center animate-pulse"
                  >
                    <Award className="w-4 h-4 text-black" />
                    <span>عرض واستخراج شهادتك المعتمدة </span>
                  </button>
                )}
              </div>

              {/* 3 Interactive Stage Progress Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                {QUIZ_STAGES.map((st) => {
                  const isUnlocked = st.id <= unlockedStage;
                  const isCurrent = st.id === quizStage;

                  return (
                    <button
                      key={st.id}
                      onClick={() => isUnlocked && handleStageSelect(st.id)}
                      disabled={!isUnlocked}
                      className={`p-4 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-3 text-start ${
                        isCurrent
                          ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20 ring-1 ring-amber-400/50 scale-[1.02]'
                          : isUnlocked
                          ? 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-200'
                          : 'bg-black/40 border-white/5 opacity-55 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl p-1.5 rounded-xl bg-white/5">{st.icon}</span>
                          <div>
                            <span className="text-xs font-black font-tajawal text-white block">
                              {st.title}
                            </span>
                            <span className="text-[11px] text-gray-400 font-semibold block">
                              {st.badge}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isUnlocked ? (
                          <span
                            className={`text-[10px] px-2 py-1 rounded-full font-black ${
                              isCurrent
                                ? 'bg-amber-400 text-black shadow-md'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isCurrent ? 'نشطة الآن ▶' : 'مفتوحة '}
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-bold flex items-center gap-1 border border-white/10">
                            <Lock className="w-3 h-3" /> مقفلة
                          </span>
                        )}
                      </div>

                      {/* Rule & Requirement Pill */}
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                        <div className="flex items-center justify-between text-xs font-black">
                          <span className="text-gray-300">شرط الاجتياز:</span>
                          <span
                            className={`font-black ${
                              st.id === 1
                                ? 'text-emerald-400'
                                : st.id === 2
                                ? 'text-cyan-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {st.id === 1 && '≥ 70% للمرور للمرحلة 2'}
                            {st.id === 2 && '≥ 71% (واحد وسبعون) للفوز والتأهل'}
                            {st.id === 3 && '≥ 93% للشهادة المعتمدة '}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 leading-tight">
                          {st.description}
                        </p>
                      </div>

                      {/* Bottom action indicator */}
                      {isUnlocked && (
                        <div className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                          <span>{isCurrent ? 'أنت تلعب هذه المرحلة حالياً' : 'اضغط لاختيار هذه المرحلة'}</span>
                          <span>←</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Earned Certificate Announcement Banner */}
              {hasEarnedCert && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/10 border border-amber-400/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-xl bg-amber-400 text-black shadow-lg"></span>
                    <div>
                      <h4 className="text-sm font-black font-tajawal text-amber-300">
                        مبارك! أنت معتمد رسمياً كـ «أسطورة شارات سبيستون»
                      </h4>
                      <p className="text-xs text-gray-300">
                        حققت نسبة 93% فما فوق في المرحلة الثالثة، وشهادتك المعتمدة مسجلة ومحفوظة باسمك.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCertModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md transition-all whitespace-nowrap"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>فتح وتنزيل الشهادة (PNG)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* THE THEME QUIZ CHALLENGE ENGINE                                */}
          {/* ============================================================== */}
          <ThemeQuizChallenge
            initialQuestions={quizQuestions}
            initialStage={quizStage}
            onStageChange={handleStageUnlocked}
            onCertificateUnlocked={handleCertificateEarned}
            onNavigateToStudio={onNavigateToStudio}
          />

          {/* ============================================================== */}
          {/* OFFICIAL SPACETOON QUIZ CERTIFICATE MODAL                      */}
          {/* ============================================================== */}
          {showCertModal && (
            <SpacetoonQuizCertificateModal
              isOpen={showCertModal}
              onClose={() => setShowCertModal(false)}
              report={certReport}
            />
          )}

        </div>
      )}

    </div>
  );
};

