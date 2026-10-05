import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Flame,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Timer,
  Share2,
  Award,
  Music,
  Headphones,
  Compass,
  ArrowRight,
  Shuffle,
  Swords,
  Users,
  Target,
  Percent,
  Check,
  Lock,
  Unlock,
  ChevronLeft
} from 'lucide-react';
import { QuizQuestion, QuizQuestionType } from '../types';
import {
  QUIZ_CATEGORIES,
  QUIZ_STAGES,
  getRandomQuizRound,
  getStageQuizRound,
  quizSoundEngine,
  getQuizHighScore,
  saveQuizHighScore,
  incrementQuizGamesCount,
  calculateQuizScoreReport,
  QuizScoreReport,
  SPACETOON_MASCOTS
} from '../lib/quizData';
import { getOrCreateAcousticWavUrl } from '../lib/acousticAudio';
import { QuizDuelArena } from './QuizDuelArena';
import { SpacetoonQuizCertificateModal, SpacetoonOfficialLogo } from './SpacetoonQuizCertificateModal';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface ThemeQuizChallengeProps {
  initialQuestions?: QuizQuestion[];
  onNavigateToStudio?: () => void;
  initialStage?: number;
  onStageChange?: (newStage: number) => void;
  onCertificateUnlocked?: () => void;
}

export const ThemeQuizChallenge: React.FC<ThemeQuizChallengeProps> = ({
  initialQuestions,
  onNavigateToStudio,
  initialStage,
  onStageChange,
  onCertificateUnlocked
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const { isDarkMode } = useTheme();
  // Main Play Mode: 'solo' | 'duel_online' | 'duel_local'
  const [activeMode, setActiveMode] = useState<'solo' | 'duel_online' | 'duel_local'>('solo');

  // Game Configuration State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(10); // 10 questions by default for a rich experience
  const [useTimer, setUseTimer] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // 3-Stage Progression State (المراحل الثلاث والشهادة)
  const [currentStage, setCurrentStage] = useState<number>(() => {
    if (initialStage && initialStage >= 1 && initialStage <= 3) return initialStage;
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

  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Sync initialStage if changed externally
  useEffect(() => {
    if (initialStage && initialStage >= 1 && initialStage <= 3 && initialStage !== currentStage) {
      setCurrentStage(initialStage);
      startNewRound(selectedCategory, questionCount, initialStage);
    }
  }, [initialStage]);

  // History tracking for review at the end
  const [roundHistory, setRoundHistory] = useState<
    { question: QuizQuestion; selectedIdx: number; isCorrect: boolean }[]
  >([]);

  // Timer State (15 seconds per question if enabled)
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Playback State for Audio Blind questions
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load High Score on Mount
  useEffect(() => {
    setHighScore(getQuizHighScore());
    startNewRound('all', questionCount, currentStage);
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Start new round from local master bank or stage pool
  const startNewRound = (
    category: string = selectedCategory,
    count: number = questionCount,
    stageToUse: number = currentStage
  ) => {
    stopAudio();
    if (timerRef.current) clearInterval(timerRef.current);

    const freshQuestions =
      category === 'all'
        ? getStageQuizRound(stageToUse, count)
        : getRandomQuizRound(count, category);

    setQuestions(freshQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setCorrectAnswersCount(0);
    setStreak(0);
    setMaxStreak(0);
    setQuizFinished(false);
    setShowHint(false);
    setTimeLeft(15);
    setRoundHistory([]);
    incrementQuizGamesCount();

    if (soundEnabled) {
      quizSoundEngine.play('click');
    }
  };

  const handleSelectStage = (stageId: number) => {
    if (stageId > unlockedStage) return;
    setCurrentStage(stageId);
    try {
      localStorage.setItem('yona_quiz_current_stage', stageId.toString());
    } catch (e) {
      console.error(e);
    }
    startNewRound(selectedCategory, questionCount, stageId);
  };

  // Timer Interval Hook
  useEffect(() => {
    if (!useTimer || isAnswered || quizFinished || activeMode !== 'solo') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(15);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 4 && soundEnabled) {
          quizSoundEngine.play('countdown');
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isAnswered, quizFinished, useTimer, activeMode]);

  // Handle timeout
  const handleTimeOut = () => {
    if (isAnswered) return;
    handleOptionSelect(-1);
  };

  // Stop currently playing audio snippet
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  // Play authentic acoustic snippet (piano / nylon guitar) that stops at the cliffhanger
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    const currentQ = questions[currentIndex];
    if (!currentQ) return;

    const snippetKey = currentQ.acousticSnippetKey || currentQ.melodyPresetId || 'ana-wa-akhi';
    const audioUrl = getOrCreateAcousticWavUrl(snippetKey);

    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        audio.play().catch(() => setIsPlayingAudio(false));
        setIsPlayingAudio(true);
      } catch {
        setIsPlayingAudio(false);
      }
    }
  };

  // Request fresh AI generated round
  const generateAiRound = async () => {
    try {
      setIsLoadingAi(true);
      stopAudio();
      if (timerRef.current) clearInterval(timerRef.current);

      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          count: questionCount,
          difficulty: 'medium',
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setCorrectAnswersCount(0);
        setStreak(0);
        setMaxStreak(0);
        setQuizFinished(false);
        setShowHint(false);
        setTimeLeft(15);
        setRoundHistory([]);
        if (soundEnabled) quizSoundEngine.play('win');
      } else {
        startNewRound(selectedCategory, questionCount);
      }
    } catch (_err) {
      startNewRound(selectedCategory, questionCount);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Category change
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    startNewRound(categoryId, questionCount);
  };

  // Question count change
  const handleQuestionCountChange = (count: number) => {
    setQuestionCount(count);
    startNewRound(selectedCategory, count);
  };

  // Handle Option Select
  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;

    stopAudio();
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(index);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const isCorrect = index === currentQuestion.correctIndex;

    // Track round history
    setRoundHistory((prev) => [
      ...prev,
      {
        question: currentQuestion,
        selectedIdx: index,
        isCorrect,
      },
    ]);

    if (isCorrect) {
      const timeBonus = useTimer ? Math.max(0, Math.floor(timeLeft / 2)) : 0;
      const streakBonus = streak * 2;
      const pointsEarned = 10 + timeBonus + streakBonus;

      const newScore = score + pointsEarned;
      const newStreak = streak + 1;

      setScore(newScore);
      setCorrectAnswersCount((prev) => prev + 1);
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);

      if (newScore > highScore) {
        setHighScore(newScore);
        saveQuizHighScore(newScore);
      }

      if (soundEnabled) quizSoundEngine.play('correct');
    } else {
      setStreak(0);
      if (soundEnabled) quizSoundEngine.play('wrong');
    }
  };

  // Advance to Next Question
  const handleNext = () => {
    stopAudio();
    setShowHint(false);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(15);
      if (soundEnabled) quizSoundEngine.play('click');
    } else {
      setQuizFinished(true);
      const report = calculateQuizScoreReport(
        correctAnswersCount,
        questions.length,
        score,
        currentStage
      );

      // Stage Unlock & Progression Logic per user rules:
      // Stage 1: >= 70% qualifies to Stage 2
      // Stage 2: >= 71% wins Stage 2 and qualifies to Stage 3 (واحد وسبعون بالمئة)
      // Stage 3: >= 90% (9/10 correct answers) earns the Official Spacetoon Certificate!
      if (currentStage === 1 && report.percentage >= 70) {
        const nextUnlocked = Math.max(unlockedStage, 2);
        setUnlockedStage(nextUnlocked);
        try {
          localStorage.setItem('yona_quiz_unlocked_stage', nextUnlocked.toString());
        } catch (e) {
          console.error(e);
        }
        onStageChange?.(nextUnlocked);
      } else if (currentStage === 2 && report.percentage >= 71) {
        const nextUnlocked = Math.max(unlockedStage, 3);
        setUnlockedStage(nextUnlocked);
        try {
          localStorage.setItem('yona_quiz_unlocked_stage', nextUnlocked.toString());
        } catch (e) {
          console.error(e);
        }
        onStageChange?.(nextUnlocked);
      } else if (currentStage === 3 && report.isPassed) {
        setHasEarnedCert(true);
        try {
          localStorage.setItem('yona_quiz_completed_cert', 'true');
        } catch (e) {
          console.error(e);
        }
        onCertificateUnlocked?.();
      }

      if (soundEnabled) {
        quizSoundEngine.play(report.isPassed ? 'win' : 'wrong');
      }
    }
  };

  // Share score result
  const handleShareResult = () => {
    const report = calculateQuizScoreReport(correctAnswersCount, questions.length, score, currentStage);
    const text = ` حققت نسبة ${report.percentage}% في المرحلة ${report.stage} من اختبار احزر الشارة سبيستون بمنصة Yona Songs! (${report.correctCount} من ${report.totalCount} إجابات صحيحة)  ${report.gradeTitle}. هل يمكنك التغلب على نتيجتي؟ `;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  // Current Question
  const currentQuestion = questions[currentIndex];

  // If in online duel mode, render the Multiplayer Arena!
  if (activeMode === 'duel_online') {
    return <QuizDuelArena onBackToSolo={() => setActiveMode('solo')} />;
  }

  // Calculate score report when finished
  const scoreReport: QuizScoreReport = calculateQuizScoreReport(
    correctAnswersCount,
    questions.length,
    score,
    currentStage
  );

  return (
    <div className={`space-y-6 max-w-3xl mx-auto ${isRtl ? 'text-right font-cairo' : 'text-left font-sans'}`}>
      {/* ================================================================ */}
      {/* 1. TOP MODE SELECTOR TABS (Solo vs Online 1v1 Battle)            */}
      {/* ================================================================ */}
      <div className={`flex items-center justify-between p-1.5 rounded-2xl ${
        isDarkMode ? 'bg-[#1E293B] border border-white/[0.08]' : 'bg-white/5 border border-white/10'
      }`}>
        <button
          onClick={() => setActiveMode('solo')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'solo'
              ? isDarkMode
                ? 'bg-white text-black font-black shadow-md shadow-white/5'
                : 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
              : isDarkMode
              ? 'text-[#94A3B8] hover:text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {!isDarkMode && <Target className="w-4 h-4" />}
          <span>{language === 'ar' ? 'التحدي الفردي (Solo)' : 'Solo Challenge'}</span>
        </button>

        <button
          onClick={() => setActiveMode('duel_online')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeMode === 'duel_online'
              ? isDarkMode
                ? 'bg-white text-black font-black shadow-md shadow-white/5'
                : 'bg-amber-400 text-black shadow-md shadow-amber-400/20 font-black'
              : isDarkMode
              ? 'text-[#94A3B8] hover:text-white'
              : 'text-amber-400 hover:text-amber-300'
          }`}
        >
          {!isDarkMode && <Swords className="w-4 h-4" />}
          <span>{language === 'ar' ? 'مبارزة أونلاين حية 1 ضد 1 ' : 'Live 1v1 Online Duel'}</span>
        </button>
      </div>

      {/* ================================================================ */}
      {/* 2. 3-STAGE PROGRESSION NAVIGATOR (المراحل الثلاث والشهادة)         */}
      {/* ================================================================ */}
      <div className={`p-4 sm:p-5 rounded-3xl shadow-xl space-y-3.5 ${
        isDarkMode
          ? 'bg-[#1E293B]/60 backdrop-blur-md border border-white/[0.08]'
          : 'bg-gradient-to-b from-[#0A1128] via-[#070B1E] to-[#0D1530] border-2 border-amber-500/40'
      }`}>
        {/* Spacetoon Header Title & Certificate Button */}
        <div className={`flex items-center justify-between flex-wrap gap-2 pb-2 border-b ${
          isDarkMode ? 'border-white/10' : 'border-amber-500/20'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl"></span>
            <div>
              <span className={`text-xs sm:text-sm font-black font-tajawal block ${
                isDarkMode ? 'text-white' : 'text-amber-400'
              }`}>
                تحدي احزر الشارة سبيستون • قناة شباب المستقبل
              </span>
              <span className="text-[10px] text-gray-300 font-tajawal">
                3 مراحل مميزة لا تتكرر أسئلتها، مصحوبة بتشجيع شخصيات سبيستون لكل سؤال 
              </span>
            </div>
          </div>
          {hasEarnedCert && (
            <button
              onClick={() => setShowCertificateModal(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg transition-all cursor-pointer font-tajawal ${
                isDarkMode
                  ? 'bg-white text-black hover:bg-slate-200 shadow-white/5'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-amber-400/20 hover:scale-105 animate-pulse'
              }`}
            >
              {!isDarkMode && <Award className="w-3.5 h-3.5" />}
              <span>شهادة سبيستون المعتمدة </span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {QUIZ_STAGES.map((st) => {
            const isUnlocked = st.id <= unlockedStage;
            const isCurrent = st.id === currentStage;

            let stageBtnClass = '';
            if (isDarkMode) {
              if (isCurrent) {
                stageBtnClass = 'bg-emerald-600/90 border-emerald-400 text-white shadow-lg shadow-emerald-600/20 scale-[1.02] font-black';
              } else if (isUnlocked) {
                stageBtnClass = 'bg-[#1E293B] border-white/[0.08] text-[#94A3B8] hover:bg-slate-800 hover:text-white';
              } else {
                stageBtnClass = 'bg-black/30 border-white/5 opacity-40 cursor-not-allowed text-[#94A3B8]/40';
              }
            } else {
              if (isCurrent) {
                stageBtnClass = 'bg-amber-500/20 border-amber-400 shadow-lg shadow-amber-500/10 scale-[1.02]';
              } else if (isUnlocked) {
                stageBtnClass = 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300';
              } else {
                stageBtnClass = 'bg-black/30 border-white/5 opacity-50 cursor-not-allowed';
              }
            }

            return (
              <button
                key={st.id}
                onClick={() => isUnlocked && handleSelectStage(st.id)}
                disabled={!isUnlocked}
                className={`p-3 rounded-2xl border text-right transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between gap-1.5 ${stageBtnClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {!isDarkMode && <span className="text-base">{st.icon}</span>}
                    <span className={`text-xs font-black font-tajawal text-white`}>
                      {st.title.split(':')[0]}
                    </span>
                  </div>
                  {isUnlocked ? (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isDarkMode
                          ? isCurrent
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/30'
                            : 'bg-white/10 text-[#94A3B8]'
                          : isCurrent
                          ? 'bg-amber-400 text-black'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isCurrent ? 'الحالية' : 'مفتوحة'}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-400 font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="space-y-0.5">
                  <div className={`text-[11px] font-bold ${
                    isDarkMode
                      ? isCurrent
                        ? 'text-emerald-100'
                        : 'text-[#94A3B8]'
                      : 'text-amber-300'
                  }`}>
                    {st.id === 1 && 'شرط التأهل للمرحلة 2: ≥ 70%'}
                    {st.id === 2 && 'شرط الفوز والتأهل: ≥ 71%'}
                    {st.id === 3 && 'شرط الشهادة الرسمية: ≥ 90%'}
                  </div>
                  {!isDarkMode && (
                    <p className="text-[10px] text-gray-400 line-clamp-1">{st.description}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================================================================ */}
      {/* 2. CATEGORY PILLS & CONTROLS                                     */}
      {/* ================================================================ */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {QUIZ_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          let catClass = '';
          if (isDarkMode) {
            catClass = isActive
              ? 'bg-white text-black border-white shadow-lg font-black'
              : 'bg-[#1E293B] border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-slate-800';
          } else {
            catClass = isActive
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-400 shadow-md shadow-amber-500/20 scale-105'
              : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10';
          }

          return (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${catClass}`}
            >
              {!isDarkMode && <span>{cat.icon}</span>}
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* AI Generator Button */}
        <button
          onClick={generateAiRound}
          disabled={isLoadingAi}
          className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border ${
            isDarkMode
              ? 'bg-[#1E293B] border-white/[0.08] text-white hover:bg-slate-800'
              : 'border-purple-500/40 bg-gradient-to-r from-purple-900/60 to-indigo-900/60 hover:from-purple-800 hover:to-indigo-800 text-purple-200 shadow-md shadow-purple-500/20'
          }`}
          title="توليد جولة جديدة بالذكاء الاصطناعي"
        >
          <Sparkles className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-purple-400'} ${isLoadingAi ? 'animate-spin' : ''}`} />
          <span>{isLoadingAi ? 'جاري التوليد...' : 'توليد جولة بالذكاء'}</span>
        </button>
      </div>

      {/* Question Count Selector (5, 10, 15) */}
      <div className="flex items-center justify-between text-xs px-2 text-gray-400">
        <div className="flex items-center gap-2">
          <span>عدد أسئلة الجولة:</span>
          {[5, 10, 15].map((cnt) => (
            <button
              key={cnt}
              onClick={() => handleQuestionCountChange(cnt)}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer font-mono font-bold transition-all ${
                questionCount === cnt
                  ? isDarkMode
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-amber-400 text-black border-amber-400'
                  : isDarkMode
                  ? 'bg-[#1E293B] text-[#94A3B8] border-white/[0.08] hover:text-white'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              {cnt} أسئلة
            </button>
          ))}
        </div>

        {/* Sound FX Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer ${
            isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-amber-400'
          }`}
          title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تفعيل المؤثرات الصوتية'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
        </button>
      </div>

      {/* ================================================================ */}
      {/* 3. MAIN QUIZ CARD                                                */}
      {/* ================================================================ */}
      <div className={`relative p-6 sm:p-8 rounded-3xl overflow-hidden shadow-2xl ${
        isDarkMode
          ? 'bg-[#1E293B]/60 backdrop-blur-xl border border-white/[0.08]'
          : 'yona-glass border border-white/10'
      }`}>
        {!quizFinished && currentQuestion ? (
          <div className="space-y-6">
            {/* ========================================================== */}
            {/* QUESTION HEADER ROW - NEXT BUTTON IS PLACED RIGHT HERE!    */}
            {/* ========================================================== */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10 flex-wrap">
              {/* Question Index Badge & Counter */}
              <div className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-2xl font-mono font-black text-sm flex items-center justify-center border ${
                  isDarkMode
                    ? 'bg-white/10 border-white/20 text-white'
                    : 'bg-amber-400/20 border-amber-400/40 text-amber-400'
                }`}>
                  {currentIndex + 1}
                </span>
                <div>
                  <span className="text-xs font-bold text-gray-300 block">
                    {language === 'ar' ? `السؤال ${currentIndex + 1} من ${questions.length}` : `Question ${currentIndex + 1} of ${questions.length}`}
                  </span>
                  <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-amber-400/80'}`}>
                    {translateAnime(currentQuestion.animeTitle || (language === 'ar' ? 'سبيستون كلاسيك' : 'Spacetoon Classic'))}
                  </span>
                </div>
              </div>

              {/* ACTION ROW: Timer + NEXT QUESTION BUTTON PROMINENTLY BESIDE THE QUESTION */}
              <div className="flex items-center gap-2.5">
                {/* Timer (if active) */}
                {useTimer && (
                  <div
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-mono font-bold transition-all ${
                      timeLeft <= 4
                        ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                        : isDarkMode
                        ? 'bg-white/[0.03] border-white/10 text-white'
                        : 'bg-white/5 border-white/10 text-gray-300'
                    }`}
                  >
                    <Timer className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-amber-400'}`} />
                    <span>{timeLeft} {language === 'ar' ? 'ث' : 's'}</span>
                  </div>
                )}

                {/*  THE NEXT QUESTION BUTTON RIGHT NEXT TO THE QUESTION AS REQUESTED!  */}
                {isAnswered ? (
                  <button
                    onClick={handleNext}
                    className={`px-5 py-2 rounded-xl font-black text-xs shadow-md flex items-center gap-1.5 cursor-pointer animate-pulse transition-all ${
                      isDarkMode
                        ? 'bg-white text-black shadow-white/5'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black shadow-amber-400/30'
                    }`}
                  >
                    <span>
                      {currentIndex + 1 < questions.length 
                        ? (language === 'ar' ? 'السؤال التالي' : 'Next Question')
                        : (language === 'ar' ? 'عرض النتيجة' : 'View Results')}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className={`px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs border border-white/10 flex items-center gap-1 cursor-pointer transition-all ${
                      isDarkMode ? 'text-white hover:text-white' : 'text-amber-300'
                    }`}
                    title={language === 'ar' ? 'تلميح' : 'Hint'}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-amber-400'}`} />
                    <span>{showHint ? currentQuestion.hint : (language === 'ar' ? 'تلميح ' : 'Hint ')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-white'
                    : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                }`}
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* ========================================================== */}
            {/*  SPACETOON CHARACTER CHEER CARD (تشجيع شخصيات سبيستون)   */}
            {/* ========================================================== */}
            {!isDarkMode && (() => {
              const activeMascot =
                currentQuestion.characterMascot ||
                SPACETOON_MASCOTS[currentIndex % SPACETOON_MASCOTS.length];
              if (!activeMascot) return null;

              let mascotDialogue =
                activeMascot.encouragement ||
                'حظاً طيباً يا بطل سبيستون! انتبه للوقت واستمتع بالذكريات! ';

              if (useTimer && timeLeft <= 4 && !isAnswered) {
                mascotDialogue =
                  activeMascot.lowTimeAlert ||
                  'انتبه للوقت يا بطل! الثواني تمر كالهجمة المرتدة! ';
              } else if (isAnswered) {
                const isCorrect = selectedOption === currentQuestion.correctIndex;
                if (isCorrect) {
                  mascotDialogue =
                    activeMascot.successCheer ||
                    'إجابة عبقرية وأسطورية! أحسنت يا بطل سبيستون! ';
                } else {
                  mascotDialogue =
                    activeMascot.wrongCheer ||
                    'لا بأس يا مقدام، الأبطال يتعلمون من كل عثرة! ركز في السؤال القادم ';
                }
              }

              return (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#0A1128] to-indigo-950/40 border-2 border-amber-500/40 flex items-center gap-3.5 sm:gap-4 shadow-lg shadow-amber-500/10 transition-all">
                  {/* Mascot Avatar with planet badge */}
                  <div className="relative shrink-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${activeMascot.planetColor} flex items-center justify-center text-2xl sm:text-3xl shadow-md border-2 border-white/25 animate-bounce`}
                    >
                      {activeMascot.avatarEmoji}
                    </div>
                    <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 rounded-md bg-black/90 border border-amber-400/50 text-[9px] font-bold text-amber-300 whitespace-nowrap shadow font-tajawal">
                      {activeMascot.planet}
                    </span>
                  </div>

                  {/* Speech Bubble */}
                  <div className="flex-1 text-right">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-tajawal">
                        <span className="text-xs sm:text-sm font-black text-amber-300">
                          {activeMascot.name}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">
                          ({activeMascot.series})
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1 font-tajawal">
                        <span>مشجع سبيستون</span>
                        <span></span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-100 font-tajawal leading-relaxed font-semibold">
                      «{mascotDialogue}»
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Question Text */}
            <div className="text-right space-y-2">
              <h3 className="text-lg sm:text-xl font-black font-tajawal text-white leading-relaxed">
                {currentQuestion.questionText || `ما هي شارة الأنمي التي تنتمي إليها أغنية "${currentQuestion.songTitle}"؟`}
              </h3>
            </div>

            {/* ========================================================== */}
            {/* AUTHENTIC RECORDED ACOUSTIC AUDIO PLAYER (PIANO / GUITAR)   */}
            {/* ========================================================== */}
            {(currentQuestion.acousticSnippetKey || currentQuestion.melodyPresetId || currentQuestion.questionType === 'audio_snippet') && (
              <div className={`p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border ${
                isDarkMode
                  ? 'bg-[#1E293B]/40 border-white/[0.08] backdrop-blur-md'
                  : 'bg-gradient-to-r from-amber-950/40 via-[#18181F] to-indigo-950/30 border border-amber-500/30'
              }`}>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={togglePlayAudio}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer shrink-0 transition-all active:scale-95 ${
                      isDarkMode
                        ? 'bg-white text-black shadow-lg shadow-white/5'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black shadow-lg shadow-amber-400/20'
                    }`}
                    title={isPlayingAudio ? 'إيقاف اللحن' : 'استماع لبداية اللحن المسجل'}
                  >
                    {isPlayingAudio ? (
                      <Pause className="w-5 h-5 fill-current animate-pulse" />
                    ) : (
                      <Play className="w-5 h-5 fill-current translate-x-[-1px]" />
                    )}
                  </button>

                  <div className="text-right">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Headphones className={`w-3.5 h-3.5 ${isDarkMode ? 'text-white' : 'text-amber-400'}`} />
                      <span>{isPlayingAudio ? 'جاري عزف بداية اللحن المسجل ' : 'استمع للحن المسجل (بيانو / جيتار)'}</span>
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-amber-300/80'}`}>
                      يتوقف اللحن المسجل تلقائياً فوراً عند موضع السؤال لتخمين التكملة!
                    </span>
                  </div>
                </div>

                {/* Animated Audio Equalizer Bars */}
                <div className="flex items-center gap-1 h-7 px-2">
                  {[35, 75, 100, 60, 90, 45, 80, 55, 95, 70].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${
                        isPlayingAudio
                          ? isDarkMode
                            ? 'bg-white'
                            : 'bg-gradient-to-t from-amber-500 to-yellow-300'
                          : 'bg-white/20'
                      }`}
                      style={{
                        height: isPlayingAudio ? `${Math.max(15, h * (i % 2 === 0 ? 1 : 0.8))}%` : '20%',
                        animation: isPlayingAudio ? `pulse 0.6s ease-in-out infinite alternate ${i * 0.08}s` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================== */}
            {/* 4 CHOICES GRID                                             */}
            {/* ========================================================== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;

                let btnClass = '';
                if (isDarkMode) {
                  btnClass = 'bg-[#1E293B] hover:bg-slate-800 border-white/[0.08] text-white hover:border-white/25';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-500/10';
                    } else if (isSelected) {
                      btnClass = 'bg-rose-950/50 border-rose-500/50 text-rose-300 font-bold';
                    } else {
                      btnClass = 'bg-transparent border-white/5 text-gray-600 opacity-40';
                    }
                  }
                } else {
                  btnClass = 'bg-[#0F0F12]/80 hover:bg-white/5 border-white/10 text-white hover:border-amber-400/50';
                  if (isAnswered) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold shadow-lg shadow-emerald-500/20';
                    } else if (isSelected) {
                      btnClass = 'bg-rose-950/90 border-rose-500 text-rose-200 font-bold shadow-lg shadow-rose-500/20';
                    } else {
                      btnClass = 'bg-[#0F0F12]/40 border-white/5 text-gray-500 opacity-60';
                    }
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={isAnswered}
                    className={`p-4 rounded-2xl border text-sm text-right transition-all cursor-pointer flex items-center justify-between gap-3 ${btnClass}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-inter ${
                        isDarkMode && isAnswered && isCorrect
                          ? 'bg-emerald-900 text-emerald-100'
                          : 'bg-white/5 border border-white/10 text-gray-400'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="font-tajawal font-bold">{opt}</span>
                    </div>

                    {isAnswered && isCorrect && <CheckCircle2 className={`w-5 h-5 shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-400'}`} />}
                    {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Historical Fact */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl text-right space-y-1.5 animate-fadeIn border ${
                isDarkMode ? 'bg-[#1E293B]/40 border border-white/[0.08]' : 'bg-white/5 border border-white/10'
              }`}>
                <div className={`flex items-center gap-2 text-xs font-bold ${
                  isDarkMode ? 'text-white' : 'text-amber-400'
                }`}>
                  {!isDarkMode && <Sparkles className="w-3.5 h-3.5" />}
                  <span>معلومة نوستالجية وتوثيق أصيل عن الشارة:</span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-tajawal">
                  {currentQuestion.explanation ||
                    `الشارة الصحيحة هي "${currentQuestion.songTitle}" من أنمي "${currentQuestion.animeTitle}".`}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ============================================================== */
          /* 4. COMPREHENSIVE QUIZ RESULTS SCREEN WITH PERCENTAGES          */
          /* ============================================================== */
          <div className="text-center py-6 space-y-6">
            <div className="relative inline-block">
              <Trophy className={`w-20 h-20 mx-auto animate-bounce ${
                isDarkMode ? 'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.25)]' : 'text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]'
              }`} />
              {!isDarkMode && <Sparkles className="w-6 h-6 text-yellow-300 absolute -top-2 -right-2 animate-spin" />}
            </div>

            <div className="space-y-2">
              <span
                className={`px-4 py-1.5 rounded-full text-xs font-black inline-block shadow-md ${
                  isDarkMode ? 'bg-white text-black' : `bg-gradient-to-r ${scoreReport.gradeColor} text-black`
                }`}
              >
                {scoreReport.gradeTitle}
              </span>
              <h4 className="text-2xl sm:text-3xl font-black font-tajawal text-white mt-2">
                {scoreReport.isPassed ? 'تهانينا الحارة! اجتزت التحدي بنجاح ' : 'محاولة طيبة.. بحاجة لمزيد من المراجعة '}
              </h4>
              <p className="text-sm text-gray-300 max-w-md mx-auto">
                {scoreReport.quote}
              </p>
            </div>

            {/* ============================================================ */}
            {/* EXACT PERCENTAGE & CORRECT QUESTIONS BREAKDOWN DISPLAY        */}
            {/* ============================================================ */}
            <div className={`p-6 rounded-3xl max-w-lg mx-auto space-y-5 border ${
              isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-black/60 border-white/10'
            }`}>
              {/* Circular / Percentage Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-400">نسبة النجاح المحققة:</span>
                  <span className={`text-2xl font-mono font-black ${isDarkMode ? 'text-white' : scoreReport.gradeTextColor}`}>
                    {scoreReport.percentage}%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-700 ${
                      isDarkMode
                        ? 'bg-white'
                        : scoreReport.isPassed
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-amber-500 to-rose-500'
                    }`}
                    style={{ width: `${scoreReport.percentage}%` }}
                  />
                </div>
              </div>

              {/* Exact Numbers Grid */}
              <div className="grid grid-cols-3 gap-3 text-center font-tajawal">
                {/* 1. Correct answers */}
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#1E293B] border border-white/[0.08]' : 'bg-white/5 border border-white/10'}`}>
                  <span className="text-[11px] text-gray-400 block font-medium">الإجابات الصحيحة</span>
                  <span className={`text-lg font-black font-mono ${isDarkMode ? 'text-emerald-400' : 'text-emerald-400'}`}>
                    {scoreReport.correctCount} <span className="text-xs text-gray-400">من {scoreReport.totalCount}</span>
                  </span>
                </div>

                {/* 2. Passing requirement */}
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#1E293B] border border-white/[0.08]' : 'bg-white/5 border border-white/10'}`}>
                  <span className="text-[11px] text-gray-400 block font-medium">مطلوب للاجتياز</span>
                  <span className={`text-lg font-black font-mono ${isDarkMode ? 'text-white' : 'text-amber-400'}`}>
                    {scoreReport.passingPercentage}% <span className="text-xs text-gray-400">({scoreReport.passingScore} أسئلة)</span>
                  </span>
                </div>

                {/* 3. Total Points */}
                <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-[#1E293B] border border-white/[0.08]' : 'bg-white/5 border border-white/10'}`}>
                  <span className="text-[11px] text-gray-400 block font-medium">مجموع النقاط</span>
                  <span className={`text-lg font-black font-mono ${isDarkMode ? 'text-white' : 'text-yellow-400'}`}>
                    {scoreReport.score}
                  </span>
                </div>
              </div>

              {/* Status Notice */}
              <div
                className={`p-3 rounded-xl text-xs font-bold text-center border ${
                  isDarkMode
                    ? scoreReport.isPassed
                      ? 'bg-emerald-950/40 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-950/20 border border-rose-500/20 text-rose-300'
                    : scoreReport.isPassed
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}
              >
                {scoreReport.isPassed
                  ? ` لقد حققت ${scoreReport.percentage}% وتجاوزت نسبة الاجتياز (${scoreReport.passingPercentage}%) بجدارة!`
                  : ` النسبة المحققة ${scoreReport.percentage}% أقل من النسبة المطلوبة للاجتياز (${scoreReport.passingPercentage}%). أعد المحاولة!`}
              </div>
            </div>

            {/* Review Round Answers */}
            {roundHistory.length > 0 && (
              <div className="max-w-lg mx-auto text-right space-y-2">
                <span className="text-xs font-bold text-gray-400 block">مراجعة إجاباتك في هذه الجولة:</span>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-none">
                  {roundHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                        item.isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      <div className="truncate max-w-[280px]">
                        <span className="font-bold ml-1">س{idx + 1}:</span>
                        <span>{item.question.songTitle}</span>
                      </div>
                      <span className="font-bold shrink-0">
                        {item.isCorrect ? 'صحيحة ' : 'خاطئة '}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stage Progression & Action Buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap pt-3">
              {/* 1. Primary Stage Progression / Certificate Action Button */}
              {scoreReport.stage === 1 && scoreReport.isPassed && (
                <button
                  onClick={() => handleSelectStage(2)}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-xl transition-all hover:scale-105 animate-bounce ${
                    isDarkMode
                      ? 'bg-white text-black shadow-white/5'
                      : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 text-black shadow-emerald-500/25'
                  }`}
                >
                  {!isDarkMode && <Award className="w-4 h-4" />}
                  <span>الانتقال للمرحلة الثانية (المتقدمة) </span>
                </button>
              )}

              {scoreReport.stage === 2 && scoreReport.isPassed && (
                <button
                  onClick={() => handleSelectStage(3)}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-xl transition-all hover:scale-105 animate-bounce ${
                    isDarkMode
                      ? 'bg-white text-black shadow-white/5'
                      : 'bg-gradient-to-r from-purple-400 via-indigo-400 to-blue-500 hover:from-purple-300 text-black shadow-purple-500/25'
                  }`}
                >
                  {!isDarkMode && <Trophy className="w-4 h-4 text-black" />}
                  <span>الانتقال للمرحلة الثالثة (امتحان الأساطير والشهادة) </span>
                </button>
              )}

              {(scoreReport.earnedCertificate || hasEarnedCert) && (
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className={`px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow-2xl transition-all hover:scale-105 animate-pulse ${
                    isDarkMode
                      ? 'bg-white text-black shadow-white/5'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black shadow-amber-400/40'
                  }`}
                >
                  {!isDarkMode && <Award className="w-4 h-4" />}
                  <span>عرض واستلام شهادة سبيستون الرسمية </span>
                </button>
              )}

              {/* 2. Replay current stage */}
              <button
                onClick={() => startNewRound(selectedCategory, questionCount, currentStage)}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all border border-white/10"
              >
                <Shuffle className="w-4 h-4" />
                <span>إعادة محاولة المرحلة ({currentStage}) </span>
              </button>

              {/* 3. Challenge another player */}
              <button
                onClick={() => setActiveMode('duel_online')}
                className={`px-5 py-3 rounded-2xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all ${
                  isDarkMode
                    ? 'bg-white text-black hover:bg-slate-200'
                    : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white'
                }`}
              >
                {!isDarkMode && <Swords className="w-4 h-4" />}
                <span>مبارزة لاعب أونلاين </span>
              </button>

              {/* 4. Share Result */}
              <button
                onClick={handleShareResult}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs inline-flex items-center gap-2 cursor-pointer transition-all border border-white/10"
              >
                <Share2 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-amber-400'}`} />
                <span>{copiedShare ? 'تم نسخ نتيجتك بنجاح! ' : 'مشاركة نتيجتي'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Official Certificate Modal */}
      {showCertificateModal && (
        <SpacetoonQuizCertificateModal
          isOpen={showCertificateModal}
          onClose={() => setShowCertificateModal(false)}
          report={scoreReport}
        />
      )}
    </div>
  );
};
