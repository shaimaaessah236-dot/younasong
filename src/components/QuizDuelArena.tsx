import React, { useState, useEffect, useRef } from 'react';
import {
  Swords,
  Users,
  Wifi,
  Sparkles,
  Trophy,
  Crown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Flame,
  Copy,
  Check,
  Headphones,
  Timer
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { quizSoundEngine } from '../lib/quizData';
import { getOrCreateAcousticWavUrl } from '../lib/acousticAudio';

interface DuelPlayerState {
  id: string;
  name: string;
  score: number;
  correctCount: number;
  answeredCurrent?: boolean;
  selectedOption?: number | null;
  isCorrect?: boolean;
}

interface QuizDuelArenaProps {
  onBackToSolo?: () => void;
}

export const QuizDuelArena: React.FC<QuizDuelArenaProps> = ({ onBackToSolo }) => {
  // Mode: 'online' | 'local_split'
  const [duelSubMode, setDuelSubMode] = useState<'online' | 'local_split'>('online');

  // Player Name Setup
  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yona_duel_nickname') || 'عاشق سبيستون';
    }
    return 'عاشق سبيستون';
  });

  // Online WebSocket State
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [onlineState, setOnlineState] = useState<'lobby' | 'waiting' | 'in_game' | 'finished'>('lobby');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [inputJoinCode, setInputJoinCode] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState<string>('');

  // Duel Match State
  const [myPlayerId, setMyPlayerId] = useState<string>('');
  const [players, setPlayers] = useState<DuelPlayerState[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [winnerId, setWinnerId] = useState<string | 'draw' | null>(null);

  // Local Selection
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [mySelectedIdx, setMySelectedIdx] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save nickname
  const handleNameChange = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('yona_duel_nickname', name);
    } catch {}
  };

  // Connect to WebSocket
  const connectWs = (): WebSocket => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      return wsRef.current;
    }

    setWsStatus('connecting');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws/quiz-duel`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setWsStatus('connected');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        handleServerMessage(msg);
      } catch {}
    };

    ws.onerror = () => {
      setWsStatus('disconnected');
    };

    ws.onclose = () => {
      setWsStatus('disconnected');
    };

    return ws;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (wsRef.current) wsRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle incoming server WS events
  const handleServerMessage = (msg: any) => {
    switch (msg.type) {
      case 'waiting_for_opponent':
        setOnlineState('waiting');
        setServerMessage(msg.message || 'جاري البحث عن متسابق آخر...');
        break;

      case 'room_created':
        setRoomId(msg.roomId);
        setRoomCode(msg.roomCode);
        setOnlineState('waiting');
        setServerMessage(msg.message);
        break;

      case 'duel_start':
        stopAudio();
        setRoomId(msg.roomId);
        setRoomCode(msg.roomCode);
        setQuestions(msg.questions);
        setCurrentQIndex(0);
        setPlayers(msg.players);
        setWinnerId(null);
        setHasAnswered(false);
        setMySelectedIdx(null);
        setTimeLeft(15);
        setOnlineState('in_game');
        quizSoundEngine.play('win');
        break;

      case 'score_update':
        setPlayers(msg.players);
        if (msg.allAnswered) {
          quizSoundEngine.play('click');
        }
        break;

      case 'next_question':
        stopAudio();
        setCurrentQIndex(msg.currentQuestionIndex);
        setHasAnswered(false);
        setMySelectedIdx(null);
        setTimeLeft(15);
        quizSoundEngine.play('click');
        break;

      case 'duel_finished':
        stopAudio();
        setPlayers(msg.players);
        setWinnerId(msg.winnerId);
        setOnlineState('finished');
        quizSoundEngine.play('win');
        break;

      case 'opponent_left':
        setServerMessage(msg.message || 'غادر المنافس المبارزة.');
        setOnlineState('finished');
        quizSoundEngine.play('wrong');
        break;

      case 'error':
        setServerMessage(msg.message || 'حدث خطأ في الاتصال.');
        break;

      default:
        break;
    }
  };

  // Quick Matchmaking
  const handleQuickMatch = () => {
    const ws = connectWs();
    const sendPayload = () => {
      ws.send(
        JSON.stringify({
          type: 'quick_match',
          playerName: playerName || 'لاعب سبيستون',
        })
      );
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendPayload();
    } else {
      ws.onopen = () => {
        setWsStatus('connected');
        sendPayload();
      };
    }
  };

  // Create Private Room
  const handleCreateRoom = () => {
    const ws = connectWs();
    const sendPayload = () => {
      ws.send(
        JSON.stringify({
          type: 'create_private_room',
          playerName: playerName || 'المتحدي الأول',
        })
      );
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendPayload();
    } else {
      ws.onopen = () => {
        setWsStatus('connected');
        sendPayload();
      };
    }
  };

  // Join Private Room
  const handleJoinRoom = () => {
    if (!inputJoinCode.trim()) return;
    const ws = connectWs();
    const sendPayload = () => {
      ws.send(
        JSON.stringify({
          type: 'join_private_room',
          roomCode: inputJoinCode.trim(),
          playerName: playerName || 'المتحدي الثاني',
        })
      );
    };

    if (ws.readyState === WebSocket.OPEN) {
      sendPayload();
    } else {
      ws.onopen = () => {
        setWsStatus('connected');
        sendPayload();
      };
    }
  };

  // Submit Answer to Server
  const handleSelectOption = (idx: number) => {
    if (hasAnswered || onlineState !== 'in_game' || !roomId) return;
    stopAudio();

    setHasAnswered(true);
    setMySelectedIdx(idx);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'submit_answer',
          roomId,
          playerId: myPlayerId,
          questionIndex: currentQIndex,
          optionIndex: idx,
          timeLeft,
        })
      );
    }
  };

  // Request Next Question
  const handleNextQuestion = () => {
    if (!roomId) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'advance_question',
          roomId,
        })
      );
    }
  };

  // Rematch
  const handleRematch = () => {
    if (!roomId) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'rematch',
          roomId,
        })
      );
    }
  };

  // Timer Hook
  useEffect(() => {
    if (onlineState !== 'in_game' || hasAnswered) {
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
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQIndex, onlineState, hasAnswered]);

  const handleTimeOut = () => {
    if (hasAnswered) return;
    handleSelectOption(-1);
  };

  // Audio Playback
  const currentQ = questions[currentQIndex];

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

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

  const copyRoomCodeToClipboard = () => {
    if (roomCode && navigator.clipboard) {
      navigator.clipboard.writeText(roomCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Top Header & Back to Solo */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black font-tajawal text-white">
              مبارزة الشارات المباشرة 1 ضد 1 (Online Duel) 
            </h3>
            <span className="text-xs text-gray-400 block">
              تسابق حقيقي وفوري بين متسابقين على نفس الأسئلة مع احتساب السرعة!
            </span>
          </div>
        </div>

        {onBackToSolo && (
          <button
            onClick={onBackToSolo}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-300 border border-white/10 cursor-pointer transition-all flex items-center gap-1.5"
          >
            <span>التحدي الفردي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        )}
      </div>

      {/* ================================================================ */}
      {/* 1. LOBBY SCREEN (Matchmaking & Room Creation)                     */}
      {/* ================================================================ */}
      {onlineState === 'lobby' && (
        <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 space-y-6 text-right">
          {/* Player Nickname */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 block">لقبك أو اسمك في المبارزة:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="اكتب اسمك (مثال: محب طارق العربي طرقان)"
              className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-tajawal text-sm focus:border-amber-400 focus:outline-none"
              maxLength={24}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Quick Match Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-black border border-amber-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <span className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center mb-2">
                  <Flame className="w-5 h-5" />
                </span>
                <h4 className="text-sm font-bold text-white">بحث سريع عن منافس أونلاين</h4>
                <p className="text-xs text-gray-400 mt-1">
                  يدخلك فوراً مع أي زائر آخر يبحث عن مبارزة حية الآن على الصفحة!
                </p>
              </div>

              <button
                onClick={handleQuickMatch}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 text-black font-extrabold text-xs shadow-md shadow-amber-400/20 cursor-pointer transition-all"
              >
                بدء البحث السريع 
              </button>
            </div>

            {/* Private Room Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/40 to-black border border-indigo-500/30 space-y-3 flex flex-col justify-between">
              <div>
                <span className="w-9 h-9 rounded-xl bg-indigo-400/20 text-indigo-400 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5" />
                </span>
                <h4 className="text-sm font-bold text-white">تحدي صديق برمز خاص</h4>
                <p className="text-xs text-gray-400 mt-1">
                  أنشئ غرفة برمز سري وأرسله لصديقك على واتساب أو تيليجرام ليدخل معك!
                </p>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 cursor-pointer transition-all"
              >
                إنشاء غرفة خاصة 
              </button>
            </div>
          </div>

          {/* Join with existing code */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <span className="text-xs text-gray-300 font-bold shrink-0">لديك رمز غرفة من صديق؟</span>
            <input
              type="text"
              value={inputJoinCode}
              onChange={(e) => setInputJoinCode(e.target.value.toUpperCase())}
              placeholder="أدخل الرمز (مثال: AB12)"
              className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono text-center tracking-widest focus:border-indigo-400 focus:outline-none"
              maxLength={8}
            />
            <button
              onClick={handleJoinRoom}
              disabled={!inputJoinCode.trim()}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-bold cursor-pointer transition-all"
            >
              دخول الغرفة
            </button>
          </div>

          {serverMessage && (
            <p className="text-xs text-rose-400 text-center">{serverMessage}</p>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* 2. WAITING ROOM SCREEN                                           */}
      {/* ================================================================ */}
      {onlineState === 'waiting' && (
        <div className="p-8 rounded-3xl yona-glass border border-white/10 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-400/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 animate-pulse">
            <Wifi className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h4 className="text-lg font-black font-tajawal text-white">
              {roomCode ? 'غرفتك الخاصة جاهزة!' : 'جاري البحث عن متسابق آخر...'}
            </h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              {roomCode
                ? 'أرسل الرمز أدناه لصديقك ليدخل معك في المبارزة مباشرة:'
                : 'انتظر لحظات، بمجرد دخول أي زائر آخر ستبدأ المبارزة فوراً!'}
            </p>
          </div>

          {roomCode && (
            <div className="inline-flex items-center gap-3 p-3 px-6 rounded-2xl bg-[#0F0F12] border border-amber-400/40">
              <span className="font-mono text-2xl font-black text-amber-400 tracking-widest">
                {roomCode}
              </span>
              <button
                onClick={copyRoomCodeToClipboard}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white cursor-pointer transition-all"
                title="نسخ الرمز"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          )}

          <div>
            <button
              onClick={() => {
                if (wsRef.current) wsRef.current.close();
                setOnlineState('lobby');
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-400 border border-white/10 cursor-pointer"
            >
              إلغاء والعودة
            </button>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* 3. ACTIVE DUEL IN GAME SCREEN                                    */}
      {/* ================================================================ */}
      {onlineState === 'in_game' && currentQ && (
        <div className="p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 space-y-6">
          {/* Real-time Head-to-Head Scoreboard */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10">
            {players.map((p, idx) => (
              <div
                key={p.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  idx === 0 ? 'bg-amber-950/40 border-amber-500/40' : 'bg-indigo-950/40 border-indigo-500/40'
                }`}
              >
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-300 block truncate max-w-[120px]">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {p.answeredCurrent ? (
                      p.isCorrect ? (
                        <span className="text-emerald-400 font-bold">أجاب صح! </span>
                      ) : (
                        <span className="text-rose-400 font-bold">أجاب خطأ! </span>
                      )
                    ) : (
                      'يفكر الآن...'
                    )}
                  </span>
                </div>
                <div className="text-left font-mono font-black text-lg text-white">
                  {p.score} <span className="text-xs font-normal text-gray-400">نقطة</span>
                </div>
              </div>
            ))}
          </div>

          {/* Question Header & Timer */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="text-xs font-bold text-amber-400">
              السؤال {currentQIndex + 1} من {questions.length}
            </span>

            {/* Timer */}
            <span
              className={`px-3 py-1 rounded-xl border flex items-center gap-1 text-xs font-mono font-bold ${
                timeLeft <= 4 ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-bounce' : 'bg-[#0F0F12] border-white/10 text-white'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              <span>{timeLeft} ث</span>
            </span>
          </div>

          {/* Question Text */}
          <div className="text-right">
            <h3 className="text-lg sm:text-xl font-black font-tajawal text-white leading-relaxed">
              {currentQ.questionText}
            </h3>
          </div>

          {/* Acoustic Audio Player (If present) */}
          {(currentQ.acousticSnippetKey || currentQ.melodyPresetId) && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
              <button
                onClick={togglePlayAudio}
                className="w-12 h-12 rounded-xl bg-amber-400 text-black flex items-center justify-center cursor-pointer shadow-md shadow-amber-400/20"
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-[-1px]" />}
              </button>
              <div className="text-right">
                <span className="text-xs font-bold text-white block">
                  {isPlayingAudio ? 'جاري عزف بداية الشارة المسجلة (تتوقف فوراً)...' : 'استمع لبداية اللحن المسجل'}
                </span>
                <span className="text-[11px] text-gray-400">يتوقف اللحن المسجل عند موضع السؤال</span>
              </div>
            </div>
          )}

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options.map((opt, idx) => {
              const isSelected = mySelectedIdx === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'bg-[#0F0F12] border-white/10 text-white hover:border-amber-400/50';

              if (hasAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 font-bold';
                } else {
                  btnStyle = 'bg-[#0F0F12]/50 border-white/5 text-gray-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={hasAnswered}
                  className={`p-4 rounded-2xl border text-sm text-right transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                >
                  <span className="font-tajawal font-bold">{opt}</span>
                  {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400" />}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          {hasAnswered && (
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md shadow-amber-400/20 cursor-pointer transition-all"
              >
                {currentQIndex + 1 < questions.length ? 'السؤال التالي ←' : 'عرض النتيجة النهائية '}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ================================================================ */}
      {/* 4. DUEL FINISHED / RESULTS SCREEN                                */}
      {/* ================================================================ */}
      {onlineState === 'finished' && (
        <div className="p-8 rounded-3xl yona-glass border border-white/10 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-amber-400/20 border border-amber-400/40 mx-auto flex items-center justify-center text-amber-400 animate-bounce">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h4 className="text-2xl font-black font-tajawal text-white">
              انتهت المبارزة الحية! 
            </h4>
            <p className="text-sm text-gray-300">
              {winnerId === 'draw'
                ? 'تعادل مذهل بين المتحديين! كلاهما أسطورة في شارات سبيستون.'
                : 'مباراة أسطورية أظهرت سرعة البديهة والذكريات النوستالجية.'}
            </p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {players.map((p) => {
              const isWinner = winnerId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border ${
                    isWinner
                      ? 'bg-amber-950/60 border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {isWinner && <Crown className="w-6 h-6 text-amber-400 mx-auto mb-1 animate-pulse" />}
                  <span className="text-xs font-bold text-gray-300 block">{p.name}</span>
                  <span className="text-2xl font-mono font-black text-amber-400 block my-1">
                    {p.score}
                  </span>
                  <span className="text-xs text-gray-400">
                    {p.correctCount} من {questions.length} صحيحة
                  </span>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRematch}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs cursor-pointer shadow-lg shadow-amber-400/20"
            >
              مبارزة انتقامية جديدة 
            </button>
            <button
              onClick={() => setOnlineState('lobby')}
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold cursor-pointer"
            >
              غرفة جديدة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
