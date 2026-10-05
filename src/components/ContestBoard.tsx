import React, { useState, useEffect, useRef } from 'react';
import { ContestEntry } from '../types';
import {
  getContestEntries,
  saveContestEntries,
  voteForContestEntry,
  toggleSelectBestContestEntry,
  deleteContestEntry,
  updateContestEntryManual,
  isEntryOwnedByUser,
  isUserPersonalRecording,
  isPlatformOwner,
  markEntryAsOwned,
  restoreAliceEntry
} from '../lib/contestStorage';
import {
  saveAudioToIndexedDB,
  getAudioFromIndexedDB,
  getCachedAudioUrl
} from '../lib/audioDb';
import { getOrCreateKaraokeWavUrl, getOrCreatePureHumanVocalWavUrl } from '../lib/karaokeSongsData';
import {
  isActionRateLimited,
  hasDeviceLiked,
  setDeviceLiked,
  validateAudienceComment,
  validateAudioFileUpload,
  sanitizeUserInput
} from '../lib/securityProtection';
import { OfficialCertificateModal } from './OfficialCertificateModal';
import { SocialStoryCardModal, StoryCardData } from './SocialStoryCardModal';
import { SupervisorContestModal } from './SupervisorContestModal';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  Crown,
  Heart,
  Play,
  Pause,
  Sparkles,
  Award,
  Flame,
  Star,
  CheckCircle2,
  Mic,
  Share2,
  Download,
  Filter,
  Volume2,
  Music,
  UserCheck,
  ChevronDown,
  Smartphone,
  Lock,
  ShieldCheck,
  Eye,
  AlertCircle,
  Key,
  Square,
  Upload,
  X,
  MessageSquare,
  Send,
  ThumbsUp,
  Smile,
  User,
  Trash2,
  Edit3
} from 'lucide-react';

interface ContestBoardProps {
  onNavigateToStudio?: () => void;
  highlightEntryId?: string;
}

const MASTER_PASSCODES = ['8890', 'mssmith', 'ms smith', 'kool04', 'KOOL04'];

interface AudienceComment {
  id: string;
  author: string;
  text: string;
  timeAgo: string;
  avatarEmoji: string;
  likes: number;
  hasLiked?: boolean;
}

const getDefaultCommentsForEntry = (entry: ContestEntry): AudienceComment[] => {
  const isAlice = entry.singerName?.toLowerCase() === 'alice' || entry.id === 'entry-alice';
  if (isAlice) {
    return [
      {
        id: 'alice-c1',
        author: 'ريم من الجزائر ',
        text: 'أداء شارة إيروكا في قمة الرقة والنقاء  خامة صوتية مريحة جداً وتدخل القلب مباشرة!',
        timeAgo: 'منذ 25 دقيقة',
        avatarEmoji: '',
        likes: 14
      },
      {
        id: 'alice-c2',
        author: 'أحمد - هاوي أكابيلا ',
        text: 'ما شاء الله بدون أي موسيقى ولكن الأداء مفعم بالشجن والإحساس، تستحقين المركز الأول بجدارة! ',
        timeAgo: 'منذ ساعة',
        avatarEmoji: '',
        likes: 21
      },
      {
        id: 'alice-c3',
        author: 'عاشق نوستالجيا سبيستون ',
        text: 'صوتها عاد بنا لأيام الطفولة الجميلة وذكريات شباب المستقبل، إبداع حقيقي! ',
        timeAgo: 'منذ ساعتين',
        avatarEmoji: '',
        likes: 9
      }
    ];
  }

  return [
    {
      id: `${entry.id}-c1`,
      author: 'مستمع ذواق ',
      text: `صوت جميل جداً في شارة "${entry.songTitle}"، خامة متزنة وإحساس صادق وموزون! `,
      timeAgo: 'منذ ساعة',
      avatarEmoji: '',
      likes: 6
    },
    {
      id: `${entry.id}-c2`,
      author: 'صديق المنصة ',
      text: 'ما شاء الله مخارج حروف واضحة ونبرة دافئة، استمر يا بطل بالتوفيق! ',
      timeAgo: 'اليوم',
      avatarEmoji: '',
      likes: 4
    }
  ];
};

export const AudienceReactionsPanel: React.FC<{
  entry: ContestEntry;
  onShowToast?: (msg: string) => void;
}> = ({ entry, onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(`yona_voice_likes_${entry.id}`);
      if (saved) return parseInt(saved, 10);
    } catch (e) {}
    return Math.max(3, (entry.votes || 1) * 2 + Math.floor(entry.score / 15));
  });

  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    try {
      return hasDeviceLiked(entry.id, 'voice') || localStorage.getItem(`yona_voice_has_liked_${entry.id}`) === 'true';
    } catch (e) {
      return false;
    }
  });

  const [comments, setComments] = useState<AudienceComment[]>(() => {
    try {
      const saved = localStorage.getItem(`yona_voice_comments_${entry.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return getDefaultCommentsForEntry(entry);
  });

  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleToggleLike = () => {
    if (isActionRateLimited(`voice_like_${entry.id}`, 800)) {
      if (onShowToast) onShowToast(' يُرجى التمهل قليلاً لمنع التكرار العشوائي.');
      return;
    }
    const nextHasLiked = !hasLiked;
    const nextCount = nextHasLiked ? likesCount + 1 : Math.max(0, likesCount - 1);
    setHasLiked(nextHasLiked);
    setLikesCount(nextCount);
    try {
      setDeviceLiked(entry.id, nextHasLiked, 'voice');
      localStorage.setItem(`yona_voice_likes_${entry.id}`, nextCount.toString());
      localStorage.setItem(`yona_voice_has_liked_${entry.id}`, nextHasLiked ? 'true' : 'false');
    } catch (e) {}
    if (nextHasLiked && onShowToast) {
      onShowToast(` تم تسجيل إعجابك بصوت ${entry.singerName}! الجمهور يحيي هذا الأداء `);
    } else if (!nextHasLiked && onShowToast) {
      onShowToast('تم إلغاء الإعجاب.');
    }
  };

  const handleAddComment = (textToAdd?: string) => {
    const finalContent = (textToAdd || commentText).trim();
    if (!finalContent) return;

    // فحص منع السبام والتعليقات الوهمية والتكرار
    const validation = validateAudienceComment(finalContent);
    if (!validation.valid) {
      if (onShowToast) onShowToast(` ${validation.message}`);
      return;
    }

    const cleanContent = sanitizeUserInput(finalContent);
    const author = sanitizeUserInput(authorName.trim()) || 'مستمع معجب ';
    const emojis = ['', '', '', '', '', '', ''];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newComment: AudienceComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      author,
      text: cleanContent,
      timeAgo: 'الآن',
      avatarEmoji: randomEmoji,
      likes: 1,
      hasLiked: true
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(`yona_voice_comments_${entry.id}`, JSON.stringify(updated));
    } catch (e) {}

    if (!textToAdd) {
      setCommentText('');
    }
    if (onShowToast) {
      onShowToast(` تم نشر تعليقك وتشجيعك لصاحب الصوت بنجاح! `);
    }
  };

  const handleToggleCommentLike = (commentId: string) => {
    if (isActionRateLimited(`comm_like_${commentId}`, 600)) {
      return;
    }
    const updated = comments.map((c) => {
      if (c.id === commentId) {
        const nextLiked = !c.hasLiked;
        return {
          ...c,
          hasLiked: nextLiked,
          likes: nextLiked ? c.likes + 1 : Math.max(0, c.likes - 1)
        };
      }
      return c;
    });
    setComments(updated);
    try {
      localStorage.setItem(`yona_voice_comments_${entry.id}`, JSON.stringify(updated));
    } catch (e) {}
  };

  const quickCheerChips = [
    ' صوت ملائكي وأداء فخم!',
    ' خامة ذهبية دافئة جداً',
    ' بطل حقيقي ويستحق الفوز',
    ' قمة الإحساس والنقاء',
    ' ما شاء الله موهبة استثنائية'
  ];

  return (
    <div className="pt-2.5 border-t border-white/[0.08] space-y-2.5">
      {/* Top Audience Interaction Bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          {/* Heart Like Voice Button */}
          <button
            type="button"
            onClick={handleToggleLike}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              hasLiked
                ? 'bg-[#1E293B] text-slate-100 border border-rose-500/40'
                : 'bg-[#1E293B] hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700/60'
            }`}
            title="الإعجاب بهذا الصوت البشري"
          >
            <Heart className={`w-3.5 h-3.5 transition-transform text-[#F43F5E] ${hasLiked ? 'fill-[#F43F5E] scale-110' : ''}`} />
            <span>{likesCount} إعجاب بالصوت</span>
          </button>

          {/* Toggle Comments Feed Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              isOpen
                ? 'bg-[#1E293B] text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-[#1E293B] hover:bg-slate-700/50 text-slate-300 border-slate-700/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>تعليقات الجمهور ({comments.length})</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          منطقة تفاعل المستمعين 
        </span>
      </div>

      {/* Expanded Interactive Audience Comments Area */}
      {isOpen && (
        <div className="p-3.5 rounded-2xl bg-[#1E293B] border border-slate-700/60 space-y-3 animate-in fade-in duration-200">
          
          {/* Quick Cheering Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-emerald-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>تشجيع فوري بنقرة واحدة:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {quickCheerChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddComment(chip)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-200 border border-slate-700/60 hover:border-emerald-500/40 text-[10px] font-semibold transition-all cursor-pointer hover:scale-105"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Comment Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddComment();
            }}
            className="space-y-2 pt-1.5 border-t border-slate-700/50"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="اسمك أو لقبك المستعار (اختياري)..."
                className="w-40 sm:w-48 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/60"
              />
              <span className="text-[10px] text-slate-400 hidden sm:inline">
                اترك بصمتك وتشجيعك لصاحب الصوت 
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتب رسالة للجمهور أو رأيك في هذا الصوت..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/70 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500/60"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال</span>
              </button>
            </div>
          </form>

          {/* Comments Feed */}
          <div className="space-y-2 pt-2 border-t border-slate-700/50 max-h-56 overflow-y-auto pr-1">
            {comments.map((comm) => (
              <div
                key={comm.id}
                className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-slate-600 text-xs space-y-1 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{comm.avatarEmoji || ''}</span>
                    <span className="font-bold text-slate-200">{comm.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono">{comm.timeAgo}</span>
                    <button
                      type="button"
                      onClick={() => handleToggleCommentLike(comm.id)}
                      className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                        comm.hasLiked ? 'text-[#F43F5E] bg-rose-500/10' : 'text-slate-400 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`w-2.5 h-2.5 text-[#F43F5E] ${comm.hasLiked ? 'fill-[#F43F5E]' : ''}`} />
                      <span>{comm.likes}</span>
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed pr-5">
                  {comm.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export const ContestBoard: React.FC<ContestBoardProps> = ({
  onNavigateToStudio,
  highlightEntryId
}) => {
  const { language, isRtl, t } = useLanguage();
  const [entries, setEntries] = useState<ContestEntry[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'best' | 'top_voted' | 'top_score' | 'my_recordings'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedCertificateEntry, setSelectedCertificateEntry] = useState<ContestEntry | null>(null);
  const [privacyProtectedEntry, setPrivacyProtectedEntry] = useState<ContestEntry | null>(null);
  const [showPasscodeUnlock, setShowPasscodeUnlock] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [isOwnerAuth, setIsOwnerAuth] = useState<boolean>(() => isPlatformOwner());
  const [showSupervisorModal, setShowSupervisorModal] = useState(false);
  const [selectedStoryData, setSelectedStoryData] = useState<StoryCardData | null>(null);
  const [crowningEntry, setCrowningEntry] = useState<ContestEntry | null>(null);
  const [crowningScoreInput, setCrowningScoreInput] = useState<number>(0);
  const [crowningSingerInput, setCrowningSingerInput] = useState<string>('');
  const [crowningSongTitleInput, setCrowningSongTitleInput] = useState<string>('');
  const [pendingEntryForAuth, setPendingEntryForAuth] = useState<ContestEntry | null>(null);
  const [selectedRank, setSelectedRank] = useState<'first' | 'second' | 'third' | 'jury_pick'>('first');
  const [juryNoteInput, setJuryNoteInput] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [deleteConfirmEntry, setDeleteConfirmEntry] = useState<{ id: string; name: string; isAdminAction?: boolean } | null>(null);
  const [goldenSparkleActive, setGoldenSparkleActive] = useState(false);
  const [showChampionBanner, setShowChampionBanner] = useState(false);

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast((prev) => (prev === message ? null : prev));
    }, 4500);
  };

  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handleOpenStory = (entry: ContestEntry) => {
    let rankTitle = 'موهبة صوتية ذهبية';
    if (entry.bestRank === 'first') rankTitle = ' بطل الأسبوع الذهبي';
    else if (entry.bestRank === 'second') rankTitle = ' المركز الثاني البلاتيني';
    else if (entry.bestRank === 'third') rankTitle = ' المركز الثالث البرونزي';
    else if (entry.score >= 95) rankTitle = ' أداء استثنائي فائق النقاء';

    setSelectedStoryData({
      singerName: entry.singerName,
      songTitle: entry.songTitle,
      score: entry.score,
      pitchTier: entry.pitchTier,
      voiceType: entry.voiceType,
      rankTitle,
      date: entry.selectedAt || entry.date,
      audioUrl: entry.audioUrl
    });
  };

  // تحميل المشاركات وتتبع أي تحديثات فورية مع استعادة تلقائية لمشاركة Alice
  const loadEntries = () => {
    let loaded = getContestEntries();
    if (!loaded.some((e) => e.id === 'entry-alice')) {
      loaded = restoreAliceEntry();
    }
    setEntries(loaded);
  };

  useEffect(() => {
    loadEntries();

    const handleUpdate = () => {
      loadEntries();
    };

    window.addEventListener('yona_contest_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('yona_contest_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Alice Live Voice Recording state
  const [showAliceRecordModal, setShowAliceRecordModal] = useState(false);
  const [isRecordingAlice, setIsRecordingAlice] = useState(false);
  const [aliceRecordSeconds, setAliceRecordSeconds] = useState(0);
  const [aliceRecordedBlob, setAliceRecordedBlob] = useState<Blob | null>(null);
  const [alicePreviewUrl, setAlicePreviewUrl] = useState<string | null>(null);
  const [aliceRecordError, setAliceRecordError] = useState<string | null>(null);

  const aliceMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const aliceStreamRef = useRef<MediaStream | null>(null);
  const aliceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const aliceChunksRef = useRef<Blob[]>([]);

  const startAliceRecording = async () => {
    try {
      setAliceRecordError(null);
      setAliceRecordedBlob(null);
      if (alicePreviewUrl) URL.revokeObjectURL(alicePreviewUrl);
      setAlicePreviewUrl(null);
      setAliceRecordSeconds(0);
      aliceChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      aliceStreamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType });
      aliceMediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          aliceChunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        if (aliceTimerRef.current) clearInterval(aliceTimerRef.current);
        const blob = new Blob(aliceChunksRef.current, { type: mimeType });
        setAliceRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAlicePreviewUrl(url);
      };

      mr.start(100);
      setIsRecordingAlice(true);
      aliceTimerRef.current = setInterval(() => {
        setAliceRecordSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error(err);
      setAliceRecordError('يرجى السماح بالوصول إلى المايكروفون لتسجيل صوت Alice.');
    }
  };

  const stopAliceRecording = () => {
    if (aliceMediaRecorderRef.current && aliceMediaRecorderRef.current.state !== 'inactive') {
      aliceMediaRecorderRef.current.stop();
    }
    if (aliceStreamRef.current) {
      aliceStreamRef.current.getTracks().forEach((t) => t.stop());
      aliceStreamRef.current = null;
    }
    if (aliceTimerRef.current) clearInterval(aliceTimerRef.current);
    setIsRecordingAlice(false);
  };

  const handleSaveAliceLiveRecording = async () => {
    if (!aliceRecordedBlob) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const resultDataUrl = e.target?.result as string;
      if (resultDataUrl) {
        // Save safely to IndexedDB to avoid localStorage quota limits
        await saveAudioToIndexedDB('alice_recorded_voice', resultDataUrl);
        await saveAudioToIndexedDB('contest_audio_entry-alice', resultDataUrl);

        const updated = entries.map((entry) => {
          if (entry.singerName?.toLowerCase().trim() === 'alice' || entry.id === 'entry-alice') {
            return {
              ...entry,
              audioUrl: resultDataUrl
            };
          }
          return entry;
        });

        setEntries(updated);
        saveContestEntries(updated);
        setShowAliceRecordModal(false);
        setIsRecordingAlice(false);
        showToast('تم حفظ وتثبيت صوت Alice البشري بنجاح!  يمكنك الآن الاستماع إليه فوراً.');
        
        let audio = audioRefs.current['entry-alice'];
        if (!audio) {
          audio = new Audio();
          audioRefs.current['entry-alice'] = audio;
        }
        audio.src = resultDataUrl;
        audio.play().then(() => setPlayingId('entry-alice')).catch(console.error);
      }
    };
    reader.readAsDataURL(aliceRecordedBlob);
  };

  // التحكم في تشغيل الصوت
  const togglePlayAudio = (entryId: string) => {
    // Stop SpeechSynthesis if active
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // Stop any current playing audio
    if (playingId && playingId !== entryId && audioRefs.current[playingId]) {
      audioRefs.current[playingId]?.pause();
    }

    let currentAudio = audioRefs.current[entryId];
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    if (!currentAudio) {
      currentAudio = new Audio();
      audioRefs.current[entryId] = currentAudio;
      currentAudio.onended = () => setPlayingId(null);
    }

    if (playingId === entryId) {
      currentAudio.pause();
      setPlayingId(null);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      const isAlice = entry.singerName?.toLowerCase().trim() === 'alice' || entry.id === 'entry-alice';
      const hasDirectAudio = entry.audioUrl && (
        entry.audioUrl.startsWith('blob:') ||
        entry.audioUrl.startsWith('data:') ||
        entry.audioUrl.startsWith('http://') ||
        entry.audioUrl.startsWith('https://')
      );

      if (hasDirectAudio) {
        if (currentAudio.src !== entry.audioUrl) {
          currentAudio.src = entry.audioUrl;
        }
        currentAudio.play().then(() => {
          setPlayingId(entryId);
        }).catch((err) => {
          console.warn('Playback error for audio file:', err);
        });
      } else if (isAlice) {
        // صوت أليس البشري الخالص  - جلب الصوت من IndexedDB أو الذاكرة
        const cachedAliceVoice = getCachedAudioUrl('alice_recorded_voice') || (typeof window !== 'undefined' ? localStorage.getItem('alice_recorded_voice') : null);
        if (cachedAliceVoice) {
          currentAudio.src = cachedAliceVoice;
          currentAudio.play().then(() => setPlayingId(entryId)).catch(console.error);
        } else {
          // استعلام غير متزامن من IndexedDB
          getAudioFromIndexedDB('alice_recorded_voice').then((stored) => {
            if (stored && currentAudio) {
              currentAudio.src = stored;
              currentAudio.play().then(() => setPlayingId(entryId)).catch(console.error);
            } else {
              // إذا لم يكن مسجلاً، نفتح نافذة التسجيل بالمايك فوراً
              setShowAliceRecordModal(true);
            }
          }).catch(() => {
            setShowAliceRecordModal(true);
          });
        }
      } else {
        const freshUrl = getOrCreateKaraokeWavUrl(entry.songId || entry.id, entry.songTitle, []);
        if (freshUrl) {
          currentAudio.src = freshUrl;
          currentAudio.play().then(() => setPlayingId(entryId)).catch(console.error);
        }
      }
    }
  };

  // رفع واستبدال التسجيل الصوتي الحقيقي لـ Alice مباشرة
  const handleAliceAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFileUpload(file, 25);
    if (!validation.valid) {
      showToast(validation.error || 'الملف الصوتي المرفوع غير صالح أو يتجاوز 25 ميجابايت.');
      if (e.target) e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const resultUrl = event.target?.result as string;
      if (resultUrl) {
        // Save safely to IndexedDB without overflowing localStorage
        await saveAudioToIndexedDB('alice_recorded_voice', resultUrl);
        await saveAudioToIndexedDB('contest_audio_entry-alice', resultUrl);

        const updated = entries.map((entry) => {
          if (entry.singerName?.toLowerCase().trim() === 'alice' || entry.id === 'entry-alice') {
            return {
              ...entry,
              audioUrl: resultUrl
            };
          }
          return entry;
        });

        setEntries(updated);
        saveContestEntries(updated);
        showToast('تم حفظ وتثبيت صوت Alice الحقيقي بنجاح!  يمكنك الآن الاستماع له مباشرة.');

        let audio = audioRefs.current['entry-alice'];
        if (!audio) {
          audio = new Audio();
          audioRefs.current['entry-alice'] = audio;
        }
        audio.src = resultUrl;
        audio.play().then(() => setPlayingId('entry-alice')).catch(console.error);
      }
    };
    reader.readAsDataURL(file);
  };

  // التصويت لمشارك مع حماية مكافحة التلاعب والتكرار العشوائي
  const handleVote = (entryId: string) => {
    if (isActionRateLimited(`contest_vote_${entryId}`, 800)) {
      showToast(' يرجى التمهل قليلاً بين عمليات التصويت لمنع التكرار.');
      return;
    }
    const updated = voteForContestEntry(entryId);
    setEntries(updated);
    const target = updated.find((e) => e.id === entryId);
    if (target?.hasVoted) {
      showToast(` تم تسجيل تصويتك لصالح ${target.singerName}! أداء مميز `);
    } else {
      showToast(`تم إلغاء التصويت.`);
    }
  };

  // اختيار وتتويج الأفضل وتعديل النتيجة والبيانات يدوياً (صلاحيات الملك والمشرف)
  const handleApplyCrowning = () => {
    if (!crowningEntry) return;
    const finalScore = Math.min(100, Math.max(0, Number(crowningScoreInput) || crowningEntry.score));
    const finalSinger = crowningSingerInput.trim() || crowningEntry.singerName;
    const finalSong = crowningSongTitleInput.trim() || crowningEntry.songTitle;

    const updated = updateContestEntryManual(crowningEntry.id, {
      score: finalScore,
      singerName: finalSinger,
      songTitle: finalSong,
      bestRank: selectedRank,
      isSelectedBest: selectedRank !== null,
      juryNotes: juryNoteInput.trim() || undefined
    });

    setEntries(updated);
    setCrowningEntry(null);
    setJuryNoteInput('');
    showToast(`تم حفظ التعديلات والنتيجة (${finalScore}%) وتتويج أداء ${finalSinger} بنجاح!`);
  };

  const handleRemoveCrowning = () => {
    if (!crowningEntry) return;
    const updated = toggleSelectBestContestEntry(crowningEntry.id, crowningEntry.bestRank || 'first');
    setEntries(updated);
    setCrowningEntry(null);
    setJuryNoteInput('');
    showToast(`تم إلغاء تتويج ${crowningEntry.singerName}`);
  };

  // حذف إنجاز / مشاركة المتسابق بحرية تامة مع نافذة تأكيد داخلية فورية (لصاحب التسجيل أو للمشرف)
  const handleDeleteUserEntry = (entryId: string, singerName?: string, isAdminAction?: boolean) => {
    setDeleteConfirmEntry({
      id: entryId,
      name: singerName || 'التسجيل',
      isAdminAction
    });
  };

  const handleConfirmDeleteEntry = () => {
    if (!deleteConfirmEntry) return;
    const targetId = deleteConfirmEntry.id;
    const isAdmin = deleteConfirmEntry.isAdminAction;
    if (playingId === targetId) {
      if (audioRefs.current[targetId]) {
        audioRefs.current[targetId]?.pause();
      }
      setPlayingId(null);
    }
    const updated = deleteContestEntry(targetId);
    setEntries(updated);
    setDeleteConfirmEntry(null);
    showToast(isAdmin ? `تم حذف مشاركة (${deleteConfirmEntry.name}) من لوحة المسابقة كـ مشرف بنجاح.` : 'تم حذف مشاركتك من لوحة المسابقة بنجاح.');
  };

  // نسخ رابط أو تفاصيل المشاركة
  const handleShareEntry = (entry: ContestEntry) => {
    const text = `استمع لصوت ${entry.singerName} في شارة "${entry.songTitle}" بدرجة ${entry.score}% على منصة Yona Songs! `;
    navigator.clipboard.writeText(text);
    setCopiedId(entry.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // فتح الشهادة مباشرة لجميع الزوار والمتسابقين مع إمكانية التحميل والطباعة
  const handleRequestCertificate = (entry: ContestEntry) => {
    setSelectedCertificateEntry(entry);
  };

  const handlePasscodeUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = passcodeInput.trim().toLowerCase();
    if (MASTER_PASSCODES.includes(cleaned)) {
      setIsOwnerAuth(true);
      try {
        localStorage.setItem('yona_cert_owner_auth', 'true');
        localStorage.setItem('yona_admin_authenticated', 'true');
      } catch (err) {
        console.error(err);
      }
      setShowPasscodeUnlock(false);
      setPasscodeInput('');
      setPasscodeError('');

      if (pendingEntryForAuth) {
        const entry = pendingEntryForAuth;
        setCrowningEntry(entry);
        setCrowningScoreInput(entry.score);
        setCrowningSingerInput(entry.originalPublicName || entry.singerName);
        setCrowningSongTitleInput(entry.songTitle);
        setSelectedRank(entry.bestRank || 'first');
        setJuryNoteInput(entry.juryNotes || '');
        setPendingEntryForAuth(null);
        showToast('تم تفعيل صلاحيات الملك وفتح نافذة تعديل بيانات المشاركة.');
      } else {
        setShowSupervisorModal(true);
        showToast('تم تفعيل صلاحيات الإدارة وفتح لوحة المشرف ولجنة التحكيم بنجاح.');
      }

      if (privacyProtectedEntry) {
        setSelectedCertificateEntry(privacyProtectedEntry);
        setPrivacyProtectedEntry(null);
      }
    } else {
      setPasscodeError('رمز التحقق غير صحيح. يرجى إدخال الرمز السري للإدارة.');
    }
  };

  const handleLogoutOwnerAuth = () => {
    setIsOwnerAuth(false);
    try {
      localStorage.removeItem('yona_cert_owner_auth');
      localStorage.removeItem('yona_admin_authenticated');
    } catch {}
    showToast('تم إغلاق وضع المشرف والعودة للعرض العادي.');
  };

  // تصفية وترتيب المشاركات
  const getFilteredEntries = () => {
    let list = [...entries];

    switch (activeFilter) {
      case 'best':
        return list.filter((e) => e.isSelectedBest || e.bestRank);
      case 'top_voted':
        return list.sort((a, b) => b.votes - a.votes);
      case 'top_score':
        return list.sort((a, b) => b.score - a.score);
      case 'my_recordings':
        return list.filter((e) => isEntryOwnedByUser(e));
      case 'all':
      default:
        return list.sort((a, b) => {
          // الأول دائماً الفائز المختار بالمركز الأول إن وجد
          if (a.bestRank === 'first' && b.bestRank !== 'first') return -1;
          if (b.bestRank === 'first' && a.bestRank !== 'first') return 1;
          return (b.votes * 0.4 + b.score * 0.6) - (a.votes * 0.4 + a.score * 0.6);
        });
    }
  };

  const filteredEntries = getFilteredEntries();

  // المراكز الثلاثة الأولى الفائزة
  const firstPlace = entries.find((e) => e.bestRank === 'first') || entries.slice().sort((a, b) => b.score - a.score)[0];
  const secondPlace = entries.find((e) => e.bestRank === 'second') || entries.slice().sort((a, b) => b.score - a.score)[1];
  const thirdPlace = entries.find((e) => e.bestRank === 'third') || entries.slice().sort((a, b) => b.score - a.score)[2];

  const mySubmissions = entries.filter((e) => isUserPersonalRecording(e));
  const mySubmissionsCount = mySubmissions.length;
  const bestPicksCount = entries.filter((e) => e.isSelectedBest || e.bestRank).length;

  // إطلاق مؤثر البريق الذهبي والاحتفال ببطل الأسبوع
  const triggerGoldenSparkle = () => {
    setGoldenSparkleActive(true);
    setShowChampionBanner(true);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.08 + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 0.85);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.08);
          osc.stop(ctx.currentTime + idx * 0.08 + 0.9);
        });
      }
    } catch {}

    showToast(`✨ بريق الذهب لبطل الأسبوع: مبارك لـ ${firstPlace?.singerName || 'البطل'} هذا التألق الملكي! 👑`);

    setTimeout(() => {
      setGoldenSparkleActive(false);
    }, 4500);

    setTimeout(() => {
      setShowChampionBanner(false);
    }, 7000);
  };

  useEffect(() => {
    if (firstPlace && typeof window !== 'undefined' && !sessionStorage.getItem('yona_champ_sparkle_seen')) {
      const timer = setTimeout(() => {
        triggerGoldenSparkle();
        try {
          sessionStorage.setItem('yona_champ_sparkle_seen', 'true');
        } catch {}
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [firstPlace?.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 relative">
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950 border border-emerald-500/60 shadow-2xl text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-bounce">
          <span className="text-base"></span>
          <span>{notificationToast}</span>
          <button
            onClick={() => setNotificationToast(null)}
            className="text-gray-400 hover:text-white text-xs px-1"
          >
            
          </button>
        </div>
      )}
      
      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#0d1f1e] to-[#1e0f18] border-2 border-emerald-500/30 p-6 sm:p-8 shadow-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'مسابقة الأصوات الذهبية الأسبوعية • Yona Contest' : 'Weekly Golden Vocals Contest • Yona Contest'}</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold ${isRtl ? 'font-tajawal' : 'font-sans'} text-white tracking-tight`}>
              {language === 'ar' ? 'لوحة المشاركات الصوتية واختيار أفضل أداء' : 'Vocal Entries & Best Performance Selection'}
            </h2>
            <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'استمع لأصوات الموهوبين والشارات المسجلة بنقاء استوديو كامل، شارك بصوتك، صوّت لأدائك المفضل، وشارك في تتويج أفضل الأصوات وصناع الإبداع لهذا الأسبوع!'
                : 'Listen to pure acapella studio takes, vote for your favorite performers, record your soundtrack, and crown this week’s champion!'}
            </p>
          </div>

          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-rose-900 hover:from-emerald-500 hover:to-rose-800 text-white font-black text-sm shadow-xl shadow-emerald-950/60 border border-emerald-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 whitespace-nowrap"
            >
              <Mic className="w-5 h-5 text-emerald-200" />
              <span>{t('singNow')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Contest Weekly Rules & Champion Crowning Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0b141e] via-[#0b1c19] to-[#1a0e17] border border-emerald-500/30 ${isRtl ? 'text-right' : 'text-left'} space-y-2`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>{language === 'ar' ? 'نظام مسابقة الأسبوع وتتويج الأبطال الثلاثة:' : 'Weekly Contest Rules & Champion Crowning:'}</span>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
            {language === 'ar' ? 'فرز النتائج أسبوعياً • تتويج المراكز 1 و2 و3' : 'Weekly Tally • Crowning 1st, 2nd & 3rd Places'}
          </span>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed">
          {language === 'ar'
            ? 'يستمر التنافس طوال أيام الأسبوع لجمع تقييمات الأداء وتصويت الجمهور. وفي نهاية كل أسبوع يتم حصر نتائج كافة المتسابقين وتتويج الثلاثة الحائزين على أعلى النقاط كأبطال الأسبوع وتقليدهم أوسمة الشرف في لوحة المتصدرين. حرية تامة للمتسابق: يمكنك إبقاء إنجازك في المسابقة أو حذفه في أي وقت بنقرة واحدة.'
            : 'Contestants compete weekly gathering pitch scores and audience votes. At week’s end, the top 3 highest-rated vocalists are crowned on the Hall of Fame podium.'}
        </p>
      </div>

      {/* WINNERS PODIUM (منصة الجرامي المصغرة • Hall of Fame) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0F172A]/90 backdrop-blur-xl border border-emerald-500/30 shadow-2xl p-6 sm:p-8 space-y-7">
        {/* Cinematic Stage Spotlights */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 bg-slate-700/20 rounded-full blur-3xl pointer-events-none" />

        {/* Stage Header */}
        <div className={`relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-bold mb-2 shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'منصة التتويج والمشاركات الذهبية • Hall of Fame' : 'Crowning Podium & Golden Entries • Hall of Fame'}</span>
            </div>
            <h3 className={`text-xl sm:text-2xl font-black text-white ${isRtl ? 'font-tajawal' : 'font-sans'} flex items-center gap-2`}>
              <span>{t('contestPodiumTitle')}</span>
              <Crown className="w-6 h-6 text-emerald-400 fill-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {language === 'ar' ? 'التصويت الحي • تقييم النبرة • اختيار الجمهور' : 'Live Voting • Pitch Analysis • Audience Choice'}
          </span>
        </div>

        {/* The 3 Podium Columns */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-end">
          
          {/* المركز الثاني */}
          {secondPlace && (
            <div className={`p-5 rounded-2xl bg-[#1E293B] border border-[#94A3B8]/60 shadow-xl space-y-4 ${isRtl ? 'text-right' : 'text-left'} order-2 md:order-1 relative group hover:border-[#94A3B8] transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#94A3B8] text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
                  {language === 'ar' ? 'المركز الثاني' : '2nd Place'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-slate-600/40 text-xs font-mono font-bold text-slate-200">
                  {secondPlace.score}%
                </span>
              </div>

              <div>
                <h4 className="font-black text-white text-base truncate">{secondPlace.singerName}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{secondPlace.songTitle}</p>
              </div>

              <div className="flex items-center justify-between gap-1.5 pt-1">
                <button
                  onClick={() => togglePlayAudio(secondPlace.id)}
                  className="flex-1 py-2 rounded-xl bg-[#94A3B8] hover:bg-slate-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow transition-all"
                >
                  {playingId === secondPlace.id ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                  <span>{playingId === secondPlace.id ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'استمع' : 'Listen')}</span>
                </button>
                <button
                  onClick={() => handleOpenStory(secondPlace)}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="مشاركة كـ ستوري / تيك توك"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                  <span>{language === 'ar' ? 'ستوري' : 'Story'}</span>
                </button>
                <button
                  onClick={() => handleRequestCertificate(secondPlace)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/60 text-xs cursor-pointer transition-colors"
                  title="استعراض شهادة التقدير"
                >
                  <Award className="w-4 h-4" />
                </button>
              </div>

              {/* تفاعل الجمهور وإعجاب المستمعين تحت صوت المركز الثاني */}
              <AudienceReactionsPanel entry={secondPlace} onShowToast={showToast} />
            </div>
          )}

          {/* المركز الأول (بطل الأسبوع - تأثير البريق الذهبي والاحتفال الملكي) */}
          {firstPlace && (
            <div
              className={`relative p-6 sm:p-7 rounded-3xl bg-[#1E293B] border-2 ${
                goldenSparkleActive
                  ? 'border-amber-400 shadow-[0_0_55px_rgba(245,158,11,0.55)] ring-4 ring-amber-400/40'
                  : 'border-[#10B981] shadow-[0_0_35px_rgba(16,185,129,0.25)]'
              } space-y-4 ${isRtl ? 'text-right' : 'text-left'} order-1 md:order-2 md:-translate-y-3 overflow-hidden group transition-all duration-500`}
            >
              {/* Emerald & Gold Sheen */}
              <div
                className={`absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
                  goldenSparkleActive ? 'bg-amber-400/35 w-64 h-64' : 'bg-[#10B981]/20'
                }`}
              />

              {/* Floating Golden Celebration Sparkle Particles */}
              {goldenSparkleActive && (
                <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden select-none">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute text-yellow-300 animate-ping"
                      style={{
                        top: `${8 + (i * 17) % 82}%`,
                        left: `${4 + (i * 23) % 92}%`,
                        fontSize: `${14 + (i % 4) * 6}px`,
                        animationDuration: `${0.9 + (i % 3) * 0.4}s`,
                        animationDelay: `${(i % 6) * 0.12}s`,
                        opacity: 0.95
                      }}
                    >
                      {i % 4 === 0 ? '✨' : i % 4 === 1 ? '⭐' : i % 4 === 2 ? '🌟' : '👑'}
                    </span>
                  ))}
                </div>
              )}

              {/* Celebration Banner when sparkle active */}
              {showChampionBanner && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400/80 shadow-2xl text-center space-y-1 animate-in fade-in zoom-in duration-300 relative z-30">
                  <div className="flex items-center justify-center gap-2 text-amber-300 font-black text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>بريق الذهب الملكي: تحية لبطل الأسبوع ({firstPlace.singerName})! 👑</span>
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  </div>
                  <p className="text-[11px] text-amber-100 font-medium">
                    أداء صوتي استثنائي نال أعلى المراتب في منصة مسابقات يونا! ✨
                  </p>
                </div>
              )}
              
              {/* Trophy Badge (Interactive Click for Golden Sparkle) */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={triggerGoldenSparkle}
                  className={`px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5 shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 group ${
                    goldenSparkleActive
                      ? 'bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 text-black shadow-amber-400/60 ring-2 ring-yellow-200 animate-pulse'
                      : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black shadow-amber-500/30'
                  }`}
                  title="انقر هنا لإطلاق البريق الذهبي والاحتفال ببطل الأسبوع! ✨"
                >
                  <Crown className={`w-4 h-4 fill-black transition-transform ${goldenSparkleActive ? 'animate-bounce' : 'group-hover:rotate-12'}`} />
                  <span>{language === 'ar' ? 'بطل الأسبوع ✨ (انقر للبريق)' : 'Champion of the Week ✨'}</span>
                  <Sparkles className="w-3.5 h-3.5 fill-black animate-spin" />
                </button>

                <span className="px-3 py-1 rounded-xl bg-black/50 border border-amber-400/50 text-sm font-mono font-black text-amber-300 shadow-inner">
                  {firstPlace.score}%
                </span>
              </div>

              {/* Singer & Song Typography */}
              <div className="space-y-1 pt-1">
                <h4 className="font-black text-white text-lg sm:text-xl flex items-center gap-2">
                  <span className="truncate">{firstPlace.singerName}</span>
                  <Sparkles className="w-4 h-4 text-[#10B981] flex-shrink-0 animate-pulse" />
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 font-medium truncate">
                  {language === 'ar' ? 'الشارة:' : 'Track:'} {firstPlace.songTitle}
                </p>
              </div>

              {/* Play & Certificate & Story Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
                <button
                  onClick={() => togglePlayAudio(firstPlace.id)}
                  className="flex-1 min-w-[130px] py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
                >
                  {playingId === firstPlace.id ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{playingId === firstPlace.id ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'أداء البطل' : 'Play Champion')}</span>
                </button>
                <button
                  onClick={() => handleOpenStory(firstPlace)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer border border-slate-600/60 transition-all hover:scale-[1.02]"
                  title="توليد ومشاركة بطاقة الستوري السينمائية"
                >
                  <Smartphone className="w-4 h-4 text-white" />
                  <span>{language === 'ar' ? 'ستوري' : 'Story'}</span>
                </button>
                <button
                  onClick={() => handleRequestCertificate(firstPlace)}
                  className="px-2.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-[#10B981]/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="استعراض شهادة التقدير الرسمية"
                >
                  <Award className="w-4 h-4 text-[#10B981]" />
                  <span className="hidden sm:inline">{language === 'ar' ? 'الشهادة الرسمية' : 'Certificate'}</span>
                </button>
              </div>

              {/* Voice Recording / File Upload for Alice / First Place */}
              {(firstPlace.singerName?.toLowerCase() === 'alice' || firstPlace.id === 'entry-alice') && (
                <div className="pt-3 border-t border-slate-700/60 space-y-2 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold">
                      <Mic className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>صوت Alice الحقيقي (صوت بشري خالص):</span>
                    </span>
                    {(firstPlace.audioUrl || (typeof window !== 'undefined' && localStorage.getItem('alice_recorded_voice'))) && (
                      <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>الصوت البشري مثبت </span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setShowAliceRecordModal(true)}
                      className="px-3.5 py-2 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                    >
                      <Mic className="w-3.5 h-3.5 text-white" />
                      <span>سجّل صوت بالمايكروفون</span>
                    </button>
                    <label className="px-3.5 py-2 rounded-xl bg-transparent border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-300" />
                      <span>أو ارفع ملف الصوت</span>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={handleAliceAudioUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* تفاعل الجمهور والتعليقات المباشرة تحت صوت البطل */}
              <AudienceReactionsPanel entry={firstPlace} onShowToast={showToast} />
            </div>
          )}

          {/* المركز الثالث (البرونزي النظيف) */}
          {thirdPlace && (
            <div className={`p-5 rounded-2xl bg-[#1E293B] border border-[#B45309]/60 shadow-xl space-y-4 ${isRtl ? 'text-right' : 'text-left'} order-3 relative group hover:border-[#B45309] transition-all duration-300`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-[#B45309] text-white text-xs font-black flex items-center gap-1 shadow-md">
                  {language === 'ar' ? 'المركز الثالث' : '3rd Place'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-black/40 border border-slate-600/40 text-xs font-mono font-bold text-amber-300">
                  {thirdPlace.score}%
                </span>
              </div>

              <div>
                <h4 className="font-black text-white text-base truncate">{thirdPlace.singerName}</h4>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{thirdPlace.songTitle}</p>
              </div>

              <div className="flex items-center justify-between gap-1.5 pt-1">
                <button
                  onClick={() => togglePlayAudio(thirdPlace.id)}
                  className="flex-1 py-2 rounded-xl bg-[#B45309] hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow transition-all"
                >
                  {playingId === thirdPlace.id ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{playingId === thirdPlace.id ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'استمع' : 'Listen')}</span>
                </button>
                <button
                  onClick={() => handleOpenStory(thirdPlace)}
                  className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600/60 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="مشاركة كـ ستوري / تيك توك"
                >
                  <Smartphone className="w-3.5 h-3.5 text-slate-300" />
                  <span>{language === 'ar' ? 'ستوري' : 'Story'}</span>
                </button>
                <button
                  onClick={() => handleRequestCertificate(thirdPlace)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/60 text-xs cursor-pointer transition-colors"
                  title="استعراض شهادة التقدير"
                >
                  <Award className="w-4 h-4" />
                </button>
              </div>

              {/* تفاعل الجمهور وإعجاب المستمعين تحت صوت المركز الثالث */}
              <AudienceReactionsPanel entry={thirdPlace} onShowToast={showToast} />
            </div>
          )}

        </div>
      </div>

      {/* ============================================================== */}
      {/*  USER ACHIEVEMENTS & PERSONAL CERTIFICATES SHELF            */}
      {/* ============================================================== */}
      {mySubmissions.length > 0 ? (
        <div className={`p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-[#0d1a1b] via-[#102220] to-[#1d0e1b] border-2 border-emerald-500/40 shadow-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className={`text-lg sm:text-xl font-black text-white ${isRtl ? 'font-tajawal' : 'font-sans'} flex items-center gap-2`}>
                  <span>{language === 'ar' ? 'لوحة إنجازاتي وشهاداتي الصوتية المعتمدة' : 'My Certified Diplomas & Vocal Takes'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                    {mySubmissions.length} {language === 'ar' ? 'أداء مسجل' : 'takes recorded'}
                  </span>
                </h3>
                <p className="text-xs text-gray-300">
                  {language === 'ar'
                    ? 'شهاداتك الرسمية الخاصة محمية وموثقة باسمك وتاريخ أدائك. يمكنك فتحها، تعديل اسمك المعتمد عليها، أو حذف إنجازك في أي وقت بحرية تامة.'
                    : 'Your verified credentials are tied to your personal takes. View, edit your certificate name, or delete your entry anytime.'}
                </p>
              </div>
            </div>
            {onNavigateToStudio && (
              <button
                onClick={onNavigateToStudio}
                className="px-4 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap"
              >
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'ar' ? 'تسجيل شارة جديدة' : 'Record New Track'}</span>
              </button>
            )}
          </div>

          {/* Grid of User Submissions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySubmissions.map((myEntry) => {
              const myCertName = myEntry.customCertificateName || myEntry.singerName;
              return (
                <div
                  key={myEntry.id}
                  className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 hover:border-emerald-400/60 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-emerald-300 font-mono block">
                        {language === 'ar' ? 'تاريخ الأداء:' : 'Date:'} {myEntry.formattedDateAr || myEntry.date}
                      </span>
                      <h4 className="font-bold text-white text-sm mt-0.5 flex items-center gap-1.5">
                        <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{myEntry.songTitle}</span>
                      </h4>
                      <p className="text-xs text-gray-300 mt-1">
                        {language === 'ar' ? 'الاسم المعتمد على الشهادة:' : 'Certified Name:'}{' '}
                        <strong className="text-amber-300 font-bold">{myCertName}</strong>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-400/15 border border-amber-400/40 font-mono font-black text-amber-300 text-xs">
                      {myEntry.score}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
                    <button
                      onClick={() => handleRequestCertificate(myEntry)}
                      className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-rose-900 hover:from-emerald-500 hover:to-rose-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 cursor-pointer transition-all hover:scale-105"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-200" />
                      <span>{language === 'ar' ? 'فتح شهادتي المعتمدة (PDF)' : 'Open Certificate (PDF)'}</span>
                    </button>
                    <button
                      onClick={() => togglePlayAudio(myEntry.id)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                      title={language === 'ar' ? 'الاستماع لتسجيلك' : 'Play Track'}
                    >
                      {playingId === myEntry.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleOpenStory(myEntry)}
                      className="p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs cursor-pointer"
                      title={language === 'ar' ? 'بطاقة ستوري' : 'Story Card'}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteUserEntry(myEntry.id, myEntry.singerName)}
                      className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/35 text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border border-rose-500/30"
                      title={language === 'ar' ? 'حذف هذا الإنجاز من لوحة المسابقة' : 'Delete Entry'}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span className="hidden sm:inline">{t('delete')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={`p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0d181b] via-[#0e1f1d] to-[#1a0f19] border border-emerald-500/25 shadow-lg ${isRtl ? 'text-right' : 'text-left'} flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Award className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">
                {language === 'ar'
                  ? 'هل تود الحصول على شهادتك الرسمية المعتمدة باسمك وتاريخ أدائك؟'
                  : 'Want an official certified diploma with your name & performance date?'}
              </h4>
              <p className="text-xs text-gray-300 mt-0.5">
                {language === 'ar'
                  ? 'سجّل شارتك بصوتك الآن في الاستوديو لتحصل فوراً على شهادة تميز صوتية موثقة وخاصة بك مع إمكانية طباعتها وحفظها كـ PDF أو حذفها متى شئت!'
                  : 'Record your vocal track in the studio to instantly receive your verified academy certificate to print or save as PDF!'}
              </p>
            </div>
          </div>
          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-rose-900 hover:from-emerald-500 hover:to-rose-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 whitespace-nowrap cursor-pointer hover:scale-105 transition-all"
            >
              <Mic className="w-4 h-4 text-emerald-200" />
              <span>{language === 'ar' ? 'ابدأ الغناء وسجّل الآن' : 'Start Singing & Record Now'}</span>
            </button>
          )}
        </div>
      )}

      {/* FILTER & SORT BAR */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0b141a] border border-emerald-500/20 ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className="flex items-center gap-2 text-sm text-gray-300 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{language === 'ar' ? 'تصفية المشاركات:' : 'Filter Entries:'}</span>
          </div>
          {isOwnerAuth ? (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold shadow-sm">
              <button
                type="button"
                onClick={() => setShowSupervisorModal(true)}
                className="flex items-center gap-1 hover:text-emerald-300 transition-colors cursor-pointer"
                title="فتح لوحة المشرف ولجنة التحكيم"
              >
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>لوحة المشرف</span>
              </button>
              <button
                type="button"
                onClick={handleLogoutOwnerAuth}
                className="text-[9px] text-slate-400 hover:text-rose-400 underline mr-0.5 cursor-pointer transition-colors"
                title={language === 'ar' ? 'قفل وضع المشرف' : 'Lock Admin Mode'}
              >
                ({language === 'ar' ? 'قفل' : 'Lock'})
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setShowPasscodeUnlock(true);
                setPasscodeError('');
                setPasscodeInput('');
              }}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-400/50 text-slate-300 hover:text-amber-300 text-[11px] font-medium transition-all cursor-pointer shadow-sm"
              title="دخول المشرف (القفل)"
            >
              <Lock className="w-3 h-3 text-amber-400/80" />
              <span>دخول المشرف</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            {language === 'ar' ? 'منافسات هذا الأسبوع (الكل)' : 'All Weekly Contenders'} ({entries.length})
          </button>

          <button
            onClick={() => setActiveFilter('best')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'best'
                ? 'bg-gradient-to-r from-emerald-600 to-rose-800 text-white shadow-md'
                : 'bg-emerald-950/30 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-900/40'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'أبطال وقاعة المشاهير 🏆' : 'Hall of Fame Champions'} ({bestPicksCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('top_voted')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'top_voted'
                ? 'bg-rose-700 text-white shadow-md'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الأعلى تصويتاً ❤️' : 'Top Voted'}</span>
          </button>

          <button
            onClick={() => setActiveFilter('top_score')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'top_score'
                ? 'bg-teal-700 text-white shadow-md'
                : 'bg-teal-950/30 text-teal-300 border border-teal-500/30 hover:bg-teal-900/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>{language === 'ar' ? 'أعلى دقة نغمة 🎯' : 'Top Pitch Accuracy'}</span>
          </button>

          {mySubmissionsCount > 0 && (
            <button
              onClick={() => setActiveFilter('my_recordings')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'my_recordings'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/40'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تسجيلاتي وشهاداتي 🎖️' : 'My Takes & Diplomas'} ({mySubmissionsCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* ALL PARTICIPANTS GRID */}
      <div className="space-y-4">
        <div className={`flex items-center justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <span>{language === 'ar' ? 'قائمة الأصوات المعروضة في المسابقة' : 'Contest Vocal Entries'} ({filteredEntries.length}):</span>
          </h3>
          <span className="text-xs text-gray-400">
            {language === 'ar' ? 'انقر على أي تسجيل للاستماع أو التصويت أو استعراض الإنجازات' : 'Listen, vote or view diplomas'}
          </span>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#0b141c] border border-emerald-500/20 text-center space-y-3">
            <Mic className="w-12 h-12 text-gray-500 mx-auto" />
            <h4 className="text-base font-bold text-white">
              {language === 'ar' ? 'لا توجد مشاركات في هذا القسم حالياً' : 'No entries found in this category'}
            </h4>
            <p className="text-xs text-gray-400">
              {language === 'ar' ? 'كن أول من يغني ويرفع تسجيله الصوتي في المسابقة!' : 'Be the first to record and upload your vocal track!'}
            </p>
            {onNavigateToStudio && (
              <button
                onClick={onNavigateToStudio}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-rose-900 hover:from-emerald-500 hover:to-rose-800 text-white font-bold text-xs cursor-pointer shadow-md"
              >
                {language === 'ar' ? 'انتقل إلى استوديو الغناء' : 'Go to Vocal Studio'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredEntries.map((entry, idx) => {
              const isSelectedWinner = entry.isSelectedBest || entry.bestRank;
              const isPlaying = playingId === entry.id;

              return (
                <div
                  key={entry.id}
                  id={`contest-entry-${entry.id}`}
                  className={`p-5 rounded-2xl transition-all border text-right space-y-3 relative overflow-hidden ${
                    entry.bestRank === 'first'
                      ? 'bg-[#1E293B] border-2 border-emerald-500/60 shadow-xl shadow-emerald-950/20'
                      : isSelectedWinner
                      ? 'bg-[#1E293B] border border-emerald-500/40'
                      : 'bg-[#1E293B]/90 border border-slate-700/60 hover:border-emerald-500/30'
                  }`}
                >
                  {/* Hidden Audio element */}
                  <audio
                    ref={(el) => { audioRefs.current[entry.id] = el; }}
                    src={
                      (entry.audioUrl && (entry.audioUrl.startsWith('blob:') || entry.audioUrl.startsWith('data:') || entry.audioUrl.startsWith('http')))
                        ? entry.audioUrl
                        : (entry.singerName?.toLowerCase() === 'alice' || entry.id === 'entry-alice')
                        ? getOrCreatePureHumanVocalWavUrl(entry.songId || entry.id, entry.songTitle)
                        : (getOrCreateKaraokeWavUrl(entry.songId || entry.id, entry.songTitle, []) || entry.audioUrl)
                    }
                    onEnded={() => setPlayingId(null)}
                    preload="none"
                  />

                  {/* Top Header: Rank / Badge / Name / Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shadow ${
                          entry.bestRank === 'first'
                            ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                            : entry.bestRank === 'second'
                            ? 'bg-slate-300 text-black'
                            : entry.bestRank === 'third'
                            ? 'bg-amber-700 text-white'
                            : isSelectedWinner
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white/10 text-gray-300'
                        }`}
                      >
                        {entry.bestRank === 'first' ? '👑' : entry.bestRank === 'second' ? '🥈' : entry.bestRank === 'third' ? '🥉' : `#${idx + 1}`}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-white text-base">
                            {entry.originalPublicName || entry.singerName}
                          </h4>
                          {isEntryOwnedByUser(entry) && entry.customCertificateName && entry.customCertificateName !== (entry.originalPublicName || entry.singerName) && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[10px] font-bold">
                              (شهادتك باسم: {entry.customCertificateName})
                            </span>
                          )}
                          {isOwnerAuth && !isEntryOwnedByUser(entry) && entry.customCertificateName && entry.customCertificateName !== (entry.originalPublicName || entry.singerName) && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono">
                              الشهادة: {entry.customCertificateName}
                            </span>
                          )}
                          {isSelectedWinner && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Crown className="w-3 h-3 text-emerald-400" />
                              <span>مختار كأفضل أداء</span>
                            </span>
                          )}
                          {(entry.isUserRecording || entry.singerName?.toLowerCase() === 'alice') ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-300" />
                              <span>{language === 'ar' ? 'صوت حقيقي' : 'Real Vocal'}</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] font-medium">
                              {language === 'ar' ? 'لحن استرشادي' : 'Demo Vocal'}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          {entry.countryOrCity} • {entry.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-left flex flex-col items-end">
                      <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-700/60 text-sm font-mono font-black text-emerald-400 shadow-inner">
                        {entry.score}%
                      </span>
                      <span className="text-[10px] text-slate-400 mt-1 font-mono">
                        {entry.votes} {language === 'ar' ? 'تصويت' : 'votes'}
                      </span>
                    </div>
                  </div>

                  {/* Song Details */}
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-slate-300 font-medium">{language === 'ar' ? 'الشارة:' : 'Track:'} <b className="text-white">{entry.songTitle}</b></span>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                      {entry.pitchTier}
                    </span>
                  </div>

                  {/* Comment / Dedication */}
                  {entry.comment && (
                    <p className="text-xs text-slate-300 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-700/40">
                      "{entry.comment}"
                    </p>
                  )}

                  {/* Jury Notes if any */}
                  {entry.juryNotes && (
                    <div className="p-3 rounded-xl bg-[#1E293B] border border-slate-700 shadow-sm text-xs text-slate-200">
                      <span className="font-bold text-white block mb-0.5">{language === 'ar' ? '📋 تقرير لجنة التحكيم: ' : '📋 Jury Report: '}</span>
                      <span className="text-slate-300 leading-relaxed">{entry.juryNotes}</span>
                    </div>
                  )}

                  {/* PLAYABLE AUDIO BAR */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 text-[11px] flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{language === 'ar' ? 'تسجيل المتسابق الصوتي:' : 'Contestant Vocal Track:'}</span>
                      </span>
                      {isPlaying && (
                        <span className="text-emerald-400 font-mono text-[10px] animate-pulse flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span>{language === 'ar' ? 'جاري الاستماع الآن...' : 'Now Playing...'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlayAudio(entry.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer shrink-0 ${
                          isPlaying
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-md'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className={`w-4 h-4 fill-white ${isRtl ? 'mr-0.5' : 'ml-0.5'}`} />}
                      </button>

                      {/* Waveform visual simulator */}
                      <div className="flex-1 flex items-center gap-1 h-6 px-2 bg-slate-950/80 rounded-lg overflow-hidden">
                        {Array.from({ length: 24 }).map((_, barIdx) => {
                          const heightPct = isPlaying
                            ? Math.max(20, Math.floor(Math.sin((barIdx + Date.now() / 200) * 0.8) * 80 + 20))
                            : (barIdx * 7) % 70 + 20;
                          return (
                            <div
                              key={barIdx}
                              className={`flex-1 rounded-full transition-all duration-150 ${
                                isPlaying ? 'bg-emerald-400' : 'bg-slate-600'
                              }`}
                              style={{ height: `${heightPct}%` }}
                            />
                          );
                        })}
                      </div>

                      {/* Download Audio Clip */}
                      {entry.audioUrl && (
                        <a
                          href={entry.audioUrl}
                          download={`yona-contest-${entry.singerName}.ogg`}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all text-xs"
                          title={language === 'ar' ? 'تحميل المقطع الصوتي' : 'Download Audio'}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM ACTIONS BAR: Vote, Select Best (Judge), Share, Certificate */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                    
                    {/* Voting button */}
                    <button
                      onClick={() => handleVote(entry.id)}
                      className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        entry.hasVoted
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${entry.hasVoted ? 'fill-white' : ''}`} />
                      <span>{entry.votes} {language === 'ar' ? 'تصويت' : 'votes'}</span>
                    </button>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      
                      {/* ONLY CROWN ICON BUTTON - ASKS FOR PASSCODE */}
                      <button
                        type="button"
                        onClick={() => {
                          if (!isOwnerAuth) {
                            setPendingEntryForAuth(entry);
                            setShowPasscodeUnlock(true);
                            setPasscodeError('');
                            setPasscodeInput('');
                          } else {
                            setCrowningEntry(entry);
                            setCrowningScoreInput(entry.score);
                            setCrowningSingerInput(entry.originalPublicName || entry.singerName);
                            setCrowningSongTitleInput(entry.songTitle);
                            setSelectedRank(entry.bestRank || 'first');
                            setJuryNoteInput(entry.juryNotes || '');
                          }
                        }}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer border bg-amber-500/10 hover:bg-amber-500/25 border-amber-400/40 text-amber-400 shadow-sm hover:scale-105 active:scale-95"
                        title={
                          isOwnerAuth
                            ? (language === 'ar' ? 'خيارات الملك والتحكيم' : 'King & Jury Options')
                            : (language === 'ar' ? 'تاج الإدارة (أدخل الرمز السري)' : 'Admin Crown (Enter Passcode)')
                        }
                      >
                        <Crown className="w-4 h-4 fill-amber-400/20 text-amber-400" />
                        {isSelectedWinner && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse ring-2 ring-black" />
                        )}
                      </button>

                      {/* Story Card button */}
                      <button
                        onClick={() => handleOpenStory(entry)}
                        className="p-1.5 px-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                        title={language === 'ar' ? 'مشاركة كـ ستوري / تيك توك' : 'Story / Social Card'}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{language === 'ar' ? 'ستوري' : 'Story'}</span>
                      </button>

                      {/* Digital Certificate button */}
                      <button
                        onClick={() => handleRequestCertificate(entry)}
                        className="px-2.5 py-1.5 rounded-xl border text-xs flex items-center gap-1.5 cursor-pointer transition-all bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/50 font-bold"
                        title={language === 'ar' ? 'فتح واستعراض الشهادة الرسمية' : 'Open Official Certificate'}
                      >
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">{language === 'ar' ? 'الشهادة الرسمية' : 'Certificate'}</span>
                      </button>

                      {/* Delete Button */}
                      {(isOwnerAuth || isUserPersonalRecording(entry)) && (
                        <button
                          onClick={() => handleDeleteUserEntry(entry.id, entry.singerName, isOwnerAuth && !isUserPersonalRecording(entry))}
                          className={`p-1.5 px-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                            isOwnerAuth && !isUserPersonalRecording(entry)
                              ? 'bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border-rose-500/40'
                              : 'bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border-rose-500/30'
                          }`}
                          title={isOwnerAuth && !isUserPersonalRecording(entry) ? 'حذف هذه المشاركة كـ مدير ومشرف للقناة' : 'حذف مشاركتي وإنجازي من المسابقة'}
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span className="hidden sm:inline">
                            {isOwnerAuth && !isUserPersonalRecording(entry) ? (language === 'ar' ? 'حذف (مشرف)' : 'Delete (Admin)') : t('delete')}
                          </span>
                        </button>
                      )}

                      {/* Share button with clear label */}
                      <button
                        type="button"
                        onClick={() => handleShareEntry(entry)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white cursor-pointer flex items-center gap-1 text-xs border border-white/10"
                        title="مشاركة رابط أداء المتسابق"
                      >
                        {copiedId === entry.id ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400 font-bold">تم نسخ الرابط</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] hidden sm:inline">مشاركة</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                  {/* منطقة تفاعل الجمهور وإعجاب المستمعين بالصوت والتعليقات الحية */}
                  <AudienceReactionsPanel entry={entry} onShowToast={showToast} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* OFFICIAL DIGITAL CERTIFICATE MODAL */}
      {selectedCertificateEntry && (
        <OfficialCertificateModal
          isOpen={!!selectedCertificateEntry}
          onClose={() => setSelectedCertificateEntry(null)}
          data={{
            entryId: selectedCertificateEntry.id,
            singerName: selectedCertificateEntry.customCertificateName || selectedCertificateEntry.singerName,
            originalPublicName: selectedCertificateEntry.originalPublicName || selectedCertificateEntry.singerName,
            customCertificateName: selectedCertificateEntry.customCertificateName,
            customCertificateNameEn: selectedCertificateEntry.customCertificateNameEn,
            countryOrCity: selectedCertificateEntry.countryOrCity,
            songTitle: selectedCertificateEntry.songTitle,
            score: selectedCertificateEntry.score,
            pitchTier: selectedCertificateEntry.pitchTier,
            date: selectedCertificateEntry.formattedDateAr || selectedCertificateEntry.selectedAt || selectedCertificateEntry.date,
            exactTimestamp: selectedCertificateEntry.exactTimestamp,
            formattedDateAr: selectedCertificateEntry.formattedDateAr,
            formattedDateEn: selectedCertificateEntry.formattedDateEn,
            certificateNumber: selectedCertificateEntry.certificateNumber,
            verificationHash: selectedCertificateEntry.verificationHash,
            badge: selectedCertificateEntry.badge,
            juryNotes: selectedCertificateEntry.juryNotes,
            votes: selectedCertificateEntry.votes
          }}
          canEditSingerName={true}
          onUpdateSingerName={() => {
            loadEntries();
          }}
        />
      )}

      {/* SOCIAL STORY CARD MODAL (INSTAGRAM / TIKTOK) */}
      {selectedStoryData && (
        <SocialStoryCardModal
          isOpen={!!selectedStoryData}
          onClose={() => setSelectedStoryData(null)}
          data={selectedStoryData}
        />
      )}

      {/* ALICE LIVE VOICE RECORDER MODAL */}
      {showAliceRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className={`w-full max-w-md p-6 rounded-3xl bg-[#0e1628] border-2 border-amber-400/80 shadow-2xl space-y-5 ${isRtl ? 'text-right' : 'text-left'} relative`}>
            <button
              onClick={() => {
                stopAliceRecording();
                setShowAliceRecordModal(false);
              }}
              className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black inline-flex items-center gap-1 shadow">
                <Crown className="w-3.5 h-3.5 fill-black" />
                <span>{language === 'ar' ? 'بصمة صوت Alice (المركز الأول)' : "Alice's Vocal (1st Place)"}</span>
              </span>
              <h3 className="text-lg font-black text-white pt-1">
                {language === 'ar' ? 'سجّل بصوتك لأداء Alice البشري' : 'Record Live Vocals for Alice'}
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                {language === 'ar'
                  ? 'سجّل صوتك البشري الخالص الآن (بدون أي ألحان أو مؤثرات آلية). سيتم حفظ صوتك واعتماده فوراً عند تشغيل أداء البطل.'
                  : 'Record clean human vocals now (no instruments or auto-tune). Your vocal will be saved immediately as the champion take.'}
              </p>
            </div>

            {/* Recording Controls */}
            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col items-center justify-center gap-3 text-center">
              <div className="text-2xl font-mono font-black text-amber-300">
                00:{aliceRecordSeconds.toString().padStart(2, '0')}
              </div>

              {isRecordingAlice ? (
                <div className="space-y-3 flex flex-col items-center">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-xs animate-pulse">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span>{language === 'ar' ? 'جارٍ التسجيل المباشر من المايكروفون...' : 'Live recording from microphone...'}</span>
                  </div>
                  <button
                    type="button"
                    onClick={stopAliceRecording}
                    className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-600/40 cursor-pointer"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>{language === 'ar' ? 'إيقاف التسجيل' : 'Stop Recording'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startAliceRecording}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 cursor-pointer hover:scale-105 transition-all"
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {aliceRecordedBlob
                      ? (language === 'ar' ? 'إعادة التسجيل' : 'Record Again')
                      : (language === 'ar' ? 'بدء التسجيل بالمايكروفون' : 'Start Mic Recording')}
                  </span>
                </button>
              )}

              {aliceRecordError && (
                <p className="text-xs text-rose-400 font-medium">{aliceRecordError}</p>
              )}
            </div>

            {/* Audio Preview if recorded */}
            {alicePreviewUrl && (
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-2">
                <span className="text-[11px] font-bold text-emerald-300 block">
                  {language === 'ar' ? 'استمع للتسجيل قبل الحفظ:' : 'Preview take before saving:'}
                </span>
                <audio controls src={alicePreviewUrl} className="w-full h-9 rounded-lg" />
              </div>
            )}

            {/* Save & Confirm */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  stopAliceRecording();
                  setShowAliceRecordModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold"
              >
                {t('cancel')}
              </button>

              <button
                type="button"
                disabled={!aliceRecordedBlob}
                onClick={handleSaveAliceLiveRecording}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ar' ? 'حفظ وتثبيت صوت Alice الحقيقي' : "Save & Verify Alice's Vocals"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL - SAFE IN-APP CONFIRMATION WITHOUT WINDOW.CONFIRM */}
      {deleteConfirmEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className={`bg-[#121622] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {deleteConfirmEntry.isAdminAction
                    ? (language === 'ar' ? 'تأكيد حذف مشاركة المتسابق (صلاحية المشرف)' : 'Confirm Entry Deletion (Admin)')
                    : (language === 'ar' ? 'تأكيد حذف المشاركة' : 'Confirm Entry Deletion')}
                </h3>
                <p className="text-xs text-gray-400">
                  {deleteConfirmEntry.isAdminAction
                    ? (language === 'ar' ? 'حذف نهائي وإزالة من قائمة المتسابقين في المسابقة' : 'Permanently remove from contest contestants list')
                    : (language === 'ar' ? 'سيتم مسح الأداء نهائياً من قائمة المسابقة' : 'Your performance will be removed from the leaderboard')}
                </p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              {deleteConfirmEntry.isAdminAction ? (
                language === 'ar' ? (
                  <>هل أنت متأكد من رغبتك في حذف أداء ومشاركة المتسابق <span className="text-amber-300 font-bold">({deleteConfirmEntry.name})</span> من لوحة المسابقة بصفتك مالك القناة والمشرف العام؟</>
                ) : (
                  <>Are you sure you want to delete contestant <span className="text-amber-300 font-bold">({deleteConfirmEntry.name})</span> as administrator?</>
                )
              ) : (
                language === 'ar' ? (
                  <>هل أنت متأكد من رغبتك في حذف مشاركتك <span className="text-amber-300 font-bold">({deleteConfirmEntry.name})</span> من لوحة المسابقة؟ يمكنك إعادة الغناء والتسجيل والمنافسة في أي وقت.</>
                ) : (
                  <>Are you sure you want to delete your entry <span className="text-amber-300 font-bold">({deleteConfirmEntry.name})</span>? You can record again anytime.</>
                )
              )}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmEntry(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteEntry}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>
                  {deleteConfirmEntry.isAdminAction
                    ? (language === 'ar' ? 'نعم، حذف المشاركة كـ مشرف' : 'Yes, Delete (Admin)')
                    : (language === 'ar' ? 'نعم، حذف مشاركتي' : 'Yes, Delete Entry')}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CROWNING & JURY SELECTION MODAL - CLEAN, HIGH-VISIBILITY POPUP */}
      {crowningEntry && (
        <div
          onClick={() => setCrowningEntry(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-lg w-full bg-[#121622] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl space-y-5 ${isRtl ? 'text-right' : 'text-left'} max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-amber-400">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar' ? 'خيارات الملك: تعديل النتيجة والبيانات والتتويج' : 'King Options: Edit Score, Details & Crown'}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {language === 'ar' ? 'تحكيم وتعديل فوري للنتيجة واسم المتسابق والشارة' : 'Instant score & contestant editing'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleLogoutOwnerAuth();
                    setCrowningEntry(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="قفل صلاحيات المشرف لتطلب الرمز السري مجدداً"
                >
                  <Lock className="w-3 h-3 text-rose-400" />
                  <span>{language === 'ar' ? 'قفل الجلسة 🔒' : 'Lock Session'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCrowningEntry(null)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Candidate Edit Fields: Score, Singer Name, Song Title, Audio Player */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-400/40 space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'تعديل البيانات والنتيجة يدوياً' : 'Manual Score & Info Override'}</span>
                </div>
                <span className="text-[10px] text-gray-400 font-mono">ID: {crowningEntry.id.slice(-6)}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Score % */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-300 block">
                    {language === 'ar' ? 'النتيجة الصوتية (%):' : 'Vocal Score (%):'}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={crowningScoreInput}
                    onChange={(e) => setCrowningScoreInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-amber-400/50 text-amber-300 font-mono font-black text-base focus:outline-none focus:border-amber-400 text-center shadow-inner"
                  />
                </div>

                {/* 2. Singer Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] font-bold text-gray-300 block">
                    {language === 'ar' ? 'اسم المتسابق / المغني:' : 'Singer / Contestant Name:'}
                  </label>
                  <input
                    type="text"
                    value={crowningSingerInput}
                    onChange={(e) => setCrowningSingerInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* 3. Song Title */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-300 block">
                  {language === 'ar' ? 'اسم الأغنية / الشارة:' : 'Track / Song Title:'}
                </label>
                <input
                  type="text"
                  value={crowningSongTitleInput}
                  onChange={(e) => setCrowningSongTitleInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Audio player preview inside modal */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                <span className="text-gray-300 text-[11px] flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'الاستماع لصوت المتسابق المباشر:' : 'Listen to contestant track:'}</span>
                </span>
                <button
                  type="button"
                  onClick={() => togglePlayAudio(crowningEntry.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow"
                >
                  {playingId === crowningEntry.id ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-white" />
                      <span>{language === 'ar' ? 'إيقاف مؤقت' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{language === 'ar' ? 'استمع للأداء' : 'Play Voice'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Rank Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">
                {language === 'ar' ? 'اختر المركز أو التتويج المستحق:' : 'Choose Rank or Crowning:'}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. First Place */}
                <button
                  type="button"
                  onClick={() => setSelectedRank('first')}
                  className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all flex items-center justify-between cursor-pointer ${
                    selectedRank === 'first'
                      ? 'bg-amber-400/20 border-amber-400 text-amber-300 shadow-md shadow-amber-400/10'
                      : 'bg-[#0f1422] border-white/10 hover:border-amber-400/40 text-gray-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-white">
                      {language === 'ar' ? 'المركز الأول (بطل الأسبوع)' : '1st Place (Weekly Champion)'}
                    </span>
                    <span className="text-[10px] text-amber-400 font-medium">
                      {language === 'ar' ? 'الوسام الذهبي الأعلى' : 'Grand Golden Medal'}
                    </span>
                  </div>
                  {selectedRank === 'first' ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Crown className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>

                {/* 2. Second Place */}
                <button
                  type="button"
                  onClick={() => setSelectedRank('second')}
                  className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all flex items-center justify-between cursor-pointer ${
                    selectedRank === 'second'
                      ? 'bg-slate-400/20 border-slate-300 text-slate-200 shadow-md'
                      : 'bg-[#0f1422] border-white/10 hover:border-slate-300/40 text-gray-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-white">
                      {language === 'ar' ? 'المركز الثاني (البلاتيني)' : '2nd Place (Platinum)'}
                    </span>
                    <span className="text-[10px] text-slate-300 font-medium">
                      {language === 'ar' ? 'الأداء المتميز الفضي' : 'Silver Excellence Take'}
                    </span>
                  </div>
                  {selectedRank === 'second' ? (
                    <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                  ) : (
                    <Award className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>

                {/* 3. Third Place */}
                <button
                  type="button"
                  onClick={() => setSelectedRank('third')}
                  className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all flex items-center justify-between cursor-pointer ${
                    selectedRank === 'third'
                      ? 'bg-amber-800/25 border-amber-600 text-amber-200 shadow-md'
                      : 'bg-[#0f1422] border-white/10 hover:border-amber-600/40 text-gray-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-white">
                      {language === 'ar' ? 'المركز الثالث (البرونزي)' : '3rd Place (Bronze)'}
                    </span>
                    <span className="text-[10px] text-amber-500 font-medium">
                      {language === 'ar' ? 'الأداء المبدع المتألق' : 'Creative Bronze Take'}
                    </span>
                  </div>
                  {selectedRank === 'third' ? (
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Award className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>

                {/* 4. Jury Pick (Clean Emerald/Amber palette - no purples) */}
                <button
                  type="button"
                  onClick={() => setSelectedRank('jury_pick')}
                  className={`p-3 rounded-2xl border ${isRtl ? 'text-right' : 'text-left'} transition-all flex items-center justify-between cursor-pointer ${
                    selectedRank === 'jury_pick'
                      ? 'bg-emerald-600/20 border-emerald-400 text-emerald-200 shadow-md'
                      : 'bg-[#0f1422] border-white/10 hover:border-emerald-400/40 text-gray-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block text-white">
                      {language === 'ar' ? 'نخبة أصوات الأسبوع' : 'Weekly Elite Voices'}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-medium">
                      {language === 'ar' ? 'ترشيح لجنة التحكيم' : 'Jury Special Mention'}
                    </span>
                  </div>
                  {selectedRank === 'jury_pick' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-gray-500 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Jury Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 block">
                {language === 'ar' ? 'ملاحظات لجنة التحكيم للأداء (اختياري):' : 'Jury Performance Notes (Optional):'}
              </label>
              <textarea
                rows={2}
                value={juryNoteInput}
                onChange={(e) => setJuryNoteInput(e.target.value)}
                placeholder={language === 'ar' ? 'أضف تعليقاً فنياً حول مخارج الحروف، الإحساس، وثبات الطبقة الصوتية...' : 'Add artistic feedback on pitch, vocal tone, expression...'}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-2.5 pt-3 border-t border-white/10 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCrowningEntry(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
                >
                  {t('cancel')}
                </button>

                {(crowningEntry.isSelectedBest || crowningEntry.bestRank) && (
                  <button
                    type="button"
                    onClick={handleRemoveCrowning}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    {language === 'ar' ? 'إلغاء التتويج' : 'Remove Crowning'}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    handleDeleteUserEntry(crowningEntry.id, crowningEntry.singerName, true);
                    setCrowningEntry(null);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                  title="حذف هذه المشاركة كـ مشرف"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>حذف المشاركة</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleApplyCrowning}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-black font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/25 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <Crown className="w-4 h-4 fill-black" />
                <span>{language === 'ar' ? 'حفظ التعديلات وتتويج الأداء' : 'Save Overrides & Crown'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSCODE UNLOCK MODAL FOR JURY / ADMIN */}
      {showPasscodeUnlock && (
        <div
          onClick={() => setShowPasscodeUnlock(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-sm w-full bg-[#121622] border border-amber-400/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {language === 'ar' ? 'دخول المشرف ولجنة التحكيم' : 'Jury & Admin Login'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {language === 'ar' ? 'تفعيل صلاحيات التتويج والإشراف وتعديل النتائج' : 'Unlock crowning, jury, and score editing tools'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasscodeUnlock(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasscodeUnlockSubmit} className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-300 block">
                  {language === 'ar' ? 'الرمز السري للإدارة:' : 'Admin Passcode:'}
                </label>
                <input
                  type="password"
                  autoFocus
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder={language === 'ar' ? 'أدخل الرمز السري للإدارة...' : 'Enter your admin passcode...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              {passcodeError && (
                <p className="text-xs text-rose-400 font-medium leading-relaxed bg-rose-950/30 border border-rose-500/20 p-2 rounded-xl">
                  {passcodeError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPasscodeUnlock(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium transition-colors cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>{language === 'ar' ? 'تأكيد وتفعيل' : 'Unlock & Confirm'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUPERVISOR & JURY CONTROL MODAL (MANUAL & AUTOMATED CONTROLS) */}
      {showSupervisorModal && (
        <SupervisorContestModal
          isOpen={showSupervisorModal}
          onClose={() => setShowSupervisorModal(false)}
          entries={entries}
          onUpdateEntries={(updated) => setEntries(updated)}
          language={language}
        />
      )}

    </div>
  );
};
