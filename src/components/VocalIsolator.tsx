import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Mic, Play, Pause, RotateCcw, Sliders, Music, Volume2, VolumeX,
  Sparkles, Download, Disc, Upload, AudioWaveform,
  Layers, ExternalLink, HelpCircle, CheckCircle2, RefreshCw, Radio,
  Activity, Gauge, ShieldCheck, FileAudio, Settings2, Info, ArrowDownToLine,
  Zap, Cpu, Check, Music2, Type, Copy, Maximize2, Sparkle, ListMusic,
  Headphones, Volume1, FileText, Trash2, Clock, CheckCircle, Flame, Star,
  Square, Disc3, Piano, KeyRound, PlayCircle, StopCircle, RefreshCcw, Save,
  Volume, Wand2, Compass, Search, Globe, BookOpen, AlertCircle, Library,
  Crown, Lock
} from 'lucide-react';
import { VipUpgradeModal } from './VipUpgradeModal';
import {
  getVipStatusInfo,
  consumeIsolationCredit,
  VipStatusInfo,
  FREE_ISOLATION_LIMIT
} from '../lib/vipMembership';
import { validateAudioFileUpload } from '../lib/securityProtection';
import type { RecognizedMaqamSong } from '../lib/geminiMusicRecognizer';
import { separateAudioStems, StemsResult, SeparationProgress, audioBufferToWav, IsolationMode } from '../lib/stemSeparationEngine';
import { 
  KARAOKE_PRESETS, 
  SongPreset, 
  KaraokeLyricLine, 
  SongMelodyPhrase,
  SongAccompanimentChord,
  SongNoteItem,
  synthesizePresetSongAudio,
  SUGGESTED_LYRICS_LIBRARY,
  SuggestedSongLyricItem,
  MAQAM_SCALES,
  MaqamScaleDef,
  generateCustomScaleSong,
  detectKnownSong,
  SongDetectionResult,
  ArrangementStyle,
  N
} from '../lib/karaokeSongsData';

// Interactive Virtual Instrument Types
export type VirtualInstrument = 
  | 'grand-piano' 
  | 'strings' 
  | 'oud-qanun' 
  | 'musicbox-harp' 
  | 'guitar' 
  | 'flute' 
  | 'synth-lead' 
  | 'drums';

export interface InstrumentInfo {
  id: VirtualInstrument;
  name: string;
  arabicName: string;
  icon: string;
  desc: string;
  badge?: string;
}

export const INSTRUMENT_LIST: InstrumentInfo[] = [
  { id: 'grand-piano', name: 'Grand Piano', arabicName: 'بيانو كلاسيكي عذب', icon: '', desc: 'عزف بيانو شجي وناعم بأسلوب عازفة البيانو أريج', badge: 'الموصى به ' },
  { id: 'oud-qanun', name: 'Oud & Qanun', arabicName: 'عود وقانون شرقي أصيل', icon: '', desc: 'أصالة المقامات الشرقية وروح الطرب' },
  { id: 'strings', name: 'Violin / Strings', arabicName: 'كمان وتشيلو وأوتار', icon: '', desc: 'أوركسترا سينمائية دافئة وعاطفية' },
  { id: 'musicbox-harp', name: 'Music Box & Celesta', arabicName: 'صندوق الموسيقى الكريستالي', icon: '', desc: 'نغمات وأجراس حالمة ناعمة وخيالية' },
  { id: 'guitar', name: 'Acoustic Guitar', arabicName: 'جيتار كلاسيكي دافئ', icon: '', desc: 'دفء أوتار النايلون الكلاسيكية الحية' },
  { id: 'flute', name: 'Flute & Nay', arabicName: 'ناي وفلوت شجي', icon: '', desc: 'رقة وعذوبة النغمات الهوائية الهادئة' },
  { id: 'synth-lead', name: 'Anime Synth', arabicName: 'أورغ وسنث سبيستون', icon: '', desc: 'حماس ونوستالجيا شارات الكرتون الذهبية' },
  { id: 'drums', name: 'Percussion / Beat', arabicName: 'إيقاع وطبلة ودف', icon: '', desc: 'نبضات إيقاعية هادئة ومنتظمة' },
];

export interface PianoKeyNote {
  name: string;
  arabicName: string;
  freq: number;
  isBlack: boolean;
  keyboardKey?: string;
}

export const PIANO_KEYS: PianoKeyNote[] = [
  { name: 'C3', arabicName: 'دو', freq: N.C3, isBlack: false, keyboardKey: 'z' },
  { name: 'Db3', arabicName: 'دو#', freq: N.Db3, isBlack: true, keyboardKey: 's' },
  { name: 'D3', arabicName: 'ري', freq: N.D3, isBlack: false, keyboardKey: 'x' },
  { name: 'Eb3', arabicName: 'ميb', freq: N.Eb3, isBlack: true, keyboardKey: 'd' },
  { name: 'E3', arabicName: 'مي', freq: N.E3, isBlack: false, keyboardKey: 'c' },
  { name: 'F3', arabicName: 'فا', freq: N.F3, isBlack: false, keyboardKey: 'v' },
  { name: 'Fs3', arabicName: 'فا#', freq: N.Fs3, isBlack: true, keyboardKey: 'g' },
  { name: 'G3', arabicName: 'صول', freq: N.G3, isBlack: false, keyboardKey: 'b' },
  { name: 'Gs3', arabicName: 'صول#', freq: N.Gs3, isBlack: true, keyboardKey: 'h' },
  { name: 'A3', arabicName: 'لا', freq: N.A3, isBlack: false, keyboardKey: 'n' },
  { name: 'Bb3', arabicName: 'سيb', freq: N.Bb3, isBlack: true, keyboardKey: 'j' },
  { name: 'B3', arabicName: 'سي', freq: N.B3, isBlack: false, keyboardKey: 'm' },
  { name: 'C4', arabicName: 'دو', freq: N.C4, isBlack: false, keyboardKey: 'q' },
  { name: 'Cs4', arabicName: 'دو#', freq: N.Cs4, isBlack: true, keyboardKey: '2' },
  { name: 'D4', arabicName: 'ري', freq: N.D4, isBlack: false, keyboardKey: 'w' },
  { name: 'Eb4', arabicName: 'ميb', freq: N.Eb4, isBlack: true, keyboardKey: '3' },
  { name: 'E4', arabicName: 'مي', freq: N.E4, isBlack: false, keyboardKey: 'e' },
  { name: 'F4', arabicName: 'فا', freq: N.F4, isBlack: false, keyboardKey: 'r' },
  { name: 'Fs4', arabicName: 'فا#', freq: N.Fs4, isBlack: true, keyboardKey: '5' },
  { name: 'G4', arabicName: 'صول', freq: N.G4, isBlack: false, keyboardKey: 't' },
  { name: 'Gs4', arabicName: 'صول#', freq: N.Gs4, isBlack: true, keyboardKey: '6' },
  { name: 'A4', arabicName: 'لا', freq: N.A4, isBlack: false, keyboardKey: 'y' },
  { name: 'Bb4', arabicName: 'سيb', freq: N.Bb4, isBlack: true, keyboardKey: '7' },
  { name: 'B4', arabicName: 'سي', freq: N.B4, isBlack: false, keyboardKey: 'u' },
  { name: 'C5', arabicName: 'دو', freq: N.C5, isBlack: false, keyboardKey: 'i' },
  { name: 'Cs5', arabicName: 'دو#', freq: N.Cs5, isBlack: true, keyboardKey: '9' },
  { name: 'D5', arabicName: 'ري', freq: N.D5, isBlack: false, keyboardKey: 'o' },
  { name: 'Eb5', arabicName: 'ميb', freq: N.Eb5, isBlack: true, keyboardKey: '0' },
  { name: 'E5', arabicName: 'مي', freq: N.E5, isBlack: false, keyboardKey: 'p' },
  { name: 'F5', arabicName: 'فا', freq: N.F5, isBlack: false, keyboardKey: '[' },
  { name: 'Fs5', arabicName: 'فا#', freq: N.Fs5, isBlack: true, keyboardKey: '-' },
  { name: 'G5', arabicName: 'صول', freq: N.G5, isBlack: false, keyboardKey: ']' },
  { name: 'A5', arabicName: 'لا', freq: N.A5, isBlack: false, keyboardKey: '=' },
];

export const DEFAULT_CHORD_PADS = [
  { name: 'C', arabicName: 'دو كبير (C)', freqs: [N.C4, N.E4, N.G4], keyNum: '1' },
  { name: 'Dm', arabicName: 'ري صغير (Dm)', freqs: [N.D4, N.F4, N.A4], keyNum: '2' },
  { name: 'Em', arabicName: 'مي صغير (Em)', freqs: [N.E4, N.G4, N.B4], keyNum: '3' },
  { name: 'F', arabicName: 'فا كبير (F)', freqs: [N.F3, N.A3, N.C4], keyNum: '4' },
  { name: 'G', arabicName: 'صول كبير (G)', freqs: [N.G3, N.B3, N.D4], keyNum: '5' },
  { name: 'Am', arabicName: 'لا صغير (Am)', freqs: [N.A3, N.C4, N.E4], keyNum: '6' },
  { name: 'Bb', arabicName: 'سيb كبير (Bb)', freqs: [N.Bb3, N.D4, N.F4], keyNum: '7' },
  { name: 'A7', arabicName: 'لا 7 شرقي (A7)', freqs: [N.A3, N.Db4, N.E4], keyNum: '8' },
];

export const VocalIsolator: React.FC = () => {
  // Current Selected Song Preset or Uploaded Track
  const [currentPreset, setCurrentPreset] = useState<SongPreset | null>(KARAOKE_PRESETS[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('إيروكا - رسمت بيتاً صغيراً');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [separationProgress, setSeparationProgress] = useState<SeparationProgress | null>(null);
  const [stemsResult, setStemsResult] = useState<StemsResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Advanced Vocal Isolation & Instrument De-Bleed DSP State
  const [isolationMode, setIsolationMode] = useState<IsolationMode>('ultra_clean');
  const [pianoGuitarSuppression, setPianoGuitarSuppression] = useState<number>(0.95);
  const [noiseGateSensitivity, setNoiseGateSensitivity] = useState<number>(0.88);
  const [deReverbStrength, setDeReverbStrength] = useState<number>(0.80);
  const [isPureVocalFilterEnabled, setIsPureVocalFilterEnabled] = useState<boolean>(true);

  // VIP Membership & Free Usage Quota State (20 free isolations)
  const [vipStatus, setVipStatus] = useState<VipStatusInfo>(() => getVipStatusInfo());
  const [showVipModal, setShowVipModal] = useState<boolean>(false);

  // 4 Primary Studio Navigation Tabs
  const [activeTab, setActiveTab] = useState<'karaoke' | 'mixer' | 'instruments' | 'generator'>('karaoke');

  // Instrument Selection Prompt Modal
  const [showInstrumentModal, setShowInstrumentModal] = useState<boolean>(false);

  // Interactive Lyrics State
  const [activeLyrics, setActiveLyrics] = useState<KaraokeLyricLine[]>(KARAOKE_PRESETS[0].lyrics);
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0);
  const [lyricsFontSize, setLyricsFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [isCustomLyricsOpen, setIsCustomLyricsOpen] = useState(false);
  const [lyricsModalTab, setLyricsModalTab] = useState<'suggested' | 'composer' | 'tapsync'>('suggested');
  const [lyricsCategoryFilter, setLyricsCategoryFilter] = useState<string>('الكل');
  const [lyricsNotice, setLyricsNotice] = useState<string | null>(null);
  const [customLyricsText, setCustomLyricsText] = useState<string>('');

  // Melody Guide Track State
  const [isMelodyGuideEnabled, setIsMelodyGuideEnabled] = useState<boolean>(true);

  // Note Sheet Player State
  const [playingPhraseIndex, setPlayingPhraseIndex] = useState<number | null>(null);
  const [activePlayingNote, setActivePlayingNote] = useState<string | null>(null);
  const phrasePlaybackTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Tap-to-Sync State
  const [tapSyncLines, setTapSyncLines] = useState<Array<{ text: string; time: number | null }>>([]);
  const [tapSyncCurrentIndex, setTapSyncCurrentIndex] = useState<number>(0);
  const [isTapSyncActive, setIsTapSyncActive] = useState<boolean>(false);

  // Custom Scale Composer State & Automatic Song Detection
  const [composerTitle, setComposerTitle] = useState<string>('');
  const [composerLyrics, setComposerLyrics] = useState<string>('');
  const [composerMaqam, setComposerMaqam] = useState<string>('nahawand');
  const [composerStyle, setComposerStyle] = useState<ArrangementStyle>('oriental-maqam');
  const [composerInstrument, setComposerInstrument] = useState<string>('grand-piano');
  const [composerBpm, setComposerBpm] = useState<number>(92);
  const [isGeneratingCustomSong, setIsGeneratingCustomSong] = useState<boolean>(false);
  const [forceCustomComposition, setForceCustomComposition] = useState<boolean>(false);

  // Online Search Grounding & Intelligent Song Recognition State
  const [isSearchingSongOnline, setIsSearchingSongOnline] = useState<boolean>(false);
  const [onlineRecognizedSong, setOnlineRecognizedSong] = useState<RecognizedMaqamSong | null>(null);
  const [onlineRecognitionError, setOnlineRecognitionError] = useState<string | null>(null);

  // Real-time automatic song detection when user types or pastes lyrics
  const detectedSongInfo = React.useMemo<SongDetectionResult>(() => {
    return detectKnownSong(composerLyrics, composerTitle);
  }, [composerLyrics, composerTitle]);

  // Mixer Track Volumes (0.0 to 1.5) - Balanced clean levels without distortion
  const [vocalVol, setVocalVol] = useState(0.55); // Gentle, pure lead melody
  const [instVol, setInstVol] = useState(0.55);  // Soft, warm accompaniment
  const [bassVol, setBassVol] = useState(0.40);  // Gentle bass foundation
  const [origVol, setOrigVol] = useState(0.0);   // Original Mix

  // Track Stereo Panning (-1.0 Left to +1.0 Right)
  const [vocalPan, setVocalPan] = useState(0);
  const [instPan, setInstPan] = useState(0);
  const [bassPan, setBassPan] = useState(0);

  // Mute & Solo States
  const [vocalMute, setVocalMute] = useState(false);
  const [instMute, setInstMute] = useState(false);
  const [bassMute, setBassMute] = useState(false);
  const [origMute, setOrigMute] = useState(false);

  const [vocalSolo, setVocalSolo] = useState(false);
  const [instSolo, setInstSolo] = useState(false);
  const [bassSolo, setBassSolo] = useState(false);
  const [origSolo, setOrigSolo] = useState(false);

  // Playback, Speed & Pitch
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(32);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [pitchSemitones, setPitchSemitones] = useState(0);

  // --- DIRECT KARAOKE RECORDING STUDIO STATE ---
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isReviewingRecording, setIsReviewingRecording] = useState(false);
  const [micVolumeLevel, setMicVolumeLevel] = useState(0);
  const [isHeadphoneMonitoring, setIsHeadphoneMonitoring] = useState(false);
  const [isRecordedAudioPlaying, setIsRecordedAudioPlaying] = useState(false);
  const recordedAudioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const micSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const micGainNodeRef = useRef<GainNode | null>(null);
  const micAudioCtxRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const recMixedDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);

  // Song Preset Selection & Instrument Prompt Modal State
  const [pendingSongPreset, setPendingSongPreset] = useState<SongPreset | null>(null);
  const [songReadyToast, setSongReadyToast] = useState<string | null>(null);

  // --- VIRTUAL INSTRUMENT / ACCOMPANIMENT STATE ---
  const [selectedInstrument, setSelectedInstrument] = useState<VirtualInstrument>('grand-piano');
  const [activePressedKey, setActivePressedKey] = useState<string | null>(null);
  const instrumentAudioCtxRef = useRef<AudioContext | null>(null);

  // Audio Context & Web Audio Nodes Refs for Playback
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vocalSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const instSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const bassSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const origSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const vocalGainRef = useRef<GainNode | null>(null);
  const instGainRef = useRef<GainNode | null>(null);
  const bassGainRef = useRef<GainNode | null>(null);
  const origGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  const vocalPannerRef = useRef<StereoPannerNode | null>(null);
  const instPannerRef = useRef<StereoPannerNode | null>(null);
  const bassPannerRef = useRef<StereoPannerNode | null>(null);

  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);

  const startTimeRef = useRef<number>(0);
  const pauseOffsetRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const visualizerFrameRef = useRef<number | null>(null);

  // Stop current active sources safely
  const stopPlaybackNodes = () => {
    if (vocalSourceRef.current) {
      try { vocalSourceRef.current.stop(); } catch {}
      vocalSourceRef.current = null;
    }
    if (instSourceRef.current) {
      try { instSourceRef.current.stop(); } catch {}
      instSourceRef.current = null;
    }
    if (bassSourceRef.current) {
      try { bassSourceRef.current.stop(); } catch {}
      bassSourceRef.current = null;
    }
    if (origSourceRef.current) {
      try { origSourceRef.current.stop(); } catch {}
      origSourceRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  // Stop Phrase note playback
  const stopPhrasePlayback = () => {
    phrasePlaybackTimeoutsRef.current.forEach(t => clearTimeout(t));
    phrasePlaybackTimeoutsRef.current = [];
    setPlayingPhraseIndex(null);
    setActivePlayingNote(null);
  };

  // --- VIRTUAL INSTRUMENT SYNTHESIS (REAL-TIME TOUCH & PC KEYBOARD) ---
  const playInstrumentNote = useCallback((freq: number, keyName: string, customDuration = 1.4) => {
    setActivePressedKey(keyName);
    setActivePlayingNote(keyName);
    setTimeout(() => {
      setActivePressedKey(null);
      setActivePlayingNote(null);
    }, 320);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!instrumentAudioCtxRef.current || instrumentAudioCtxRef.current.state === 'closed') {
        instrumentAudioCtxRef.current = new AudioCtx();
      }
      const ctx = instrumentAudioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Configure pure, warm, acoustic timbres without noise
      if (selectedInstrument === 'grand-piano') {
        // Warm Grand Piano
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2800, now);
        
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.40, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration + 0.05);
        osc2.stop(now + customDuration + 0.05);
      } else if (selectedInstrument === 'strings') {
        // Lush Orchestral Strings
        osc.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 1.004, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1900, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.32, now + 0.08);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration * 1.2);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration * 1.2 + 0.05);
        osc2.stop(now + customDuration * 1.2 + 0.05);
      } else if (selectedInstrument === 'oud-qanun') {
        // Oriental Oud & Qanun Pluck
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now);
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(freq * 1.6, now);
        filter.Q.setValueAtTime(2.2, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.45, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration * 0.85);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration * 0.85 + 0.05);
        osc2.stop(now + customDuration * 0.85 + 0.05);
      } else if (selectedInstrument === 'musicbox-harp') {
        // Sparkling Music Box Celesta
        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2.76, now);
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(400, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.38, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration * 1.1);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration * 1.1 + 0.05);
        osc2.stop(now + customDuration * 1.1 + 0.05);
      } else if (selectedInstrument === 'guitar') {
        // Acoustic Nylon Guitar
        osc.type = 'triangle';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.42, now + 0.015);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration * 0.9);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration * 0.9 + 0.05);
        osc2.stop(now + customDuration * 0.9 + 0.05);
      } else if (selectedInstrument === 'flute') {
        // Warm Flute & Nay
        osc.type = 'sine';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.36, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration * 1.1);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + customDuration * 1.1 + 0.05);
        osc2.stop(now + customDuration * 1.1 + 0.05);
      } else if (selectedInstrument === 'synth-lead') {
        // Warm Vintage Anime Synth
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(0.35, now + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + customDuration);

        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + customDuration + 0.05);
      } else if (selectedInstrument === 'drums') {
        // Gentle woodblock / tuned drum
        const isDum = freq < 200;
        if (isDum) {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);
          gainNode.gain.setValueAtTime(0.5, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(650, now);
          gainNode.gain.setValueAtTime(0.25, now);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gainNode);
          gainNode.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.1);
        }
      }
    } catch (e) {
      console.warn('Instrument note error:', e);
    }
  }, [selectedInstrument]);

  // Play a full Chord
  const playChord = useCallback((chord: { name: string; freqs: number[] }) => {
    chord.freqs.forEach((freq, idx) => {
      setTimeout(() => {
        playInstrumentNote(freq, `${chord.name}-${idx}`);
      }, idx * 25);
    });
  }, [playInstrumentNote]);

  // Play a Specific Song Phrase (Note-by-Note)
  const handlePlaySongPhrase = (phrase: SongMelodyPhrase, phraseIdx: number) => {
    stopPhrasePlayback();
    setPlayingPhraseIndex(phraseIdx);

    let cumulativeDelay = 0;
    phrase.notes.forEach((note, noteIdx) => {
      const noteDelay = cumulativeDelay;
      cumulativeDelay += Math.max(400, note.dur * 750);

      const timeout = setTimeout(() => {
        playInstrumentNote(note.freq, note.pitch, note.dur);
        setActivePlayingNote(note.pitch);
      }, noteDelay);

      phrasePlaybackTimeoutsRef.current.push(timeout);
    });

    const finishTimeout = setTimeout(() => {
      setPlayingPhraseIndex(null);
      setActivePlayingNote(null);
    }, cumulativeDelay + 300);

    phrasePlaybackTimeoutsRef.current.push(finishTimeout);
  };

  // Play ALL Phrases for the Current Song sequentially
  const handlePlayAllSongPhrases = () => {
    if (!currentPreset?.melodyPhrases || currentPreset.melodyPhrases.length === 0) return;
    stopPhrasePlayback();

    let cumulativeDelay = 0;
    currentPreset.melodyPhrases.forEach((phrase, pIdx) => {
      const phraseStartDelay = cumulativeDelay;
      
      const phraseStartTimeout = setTimeout(() => {
        setPlayingPhraseIndex(pIdx);
      }, phraseStartDelay);
      phrasePlaybackTimeoutsRef.current.push(phraseStartTimeout);

      phrase.notes.forEach((note) => {
        const noteDelay = cumulativeDelay;
        cumulativeDelay += Math.max(380, note.dur * 700);

        const noteTimeout = setTimeout(() => {
          playInstrumentNote(note.freq, note.pitch, note.dur);
          setActivePlayingNote(note.pitch);
        }, noteDelay);
        phrasePlaybackTimeoutsRef.current.push(noteTimeout);
      });

      // Small pause between phrases
      cumulativeDelay += 350;
    });

    const endTimeout = setTimeout(() => {
      setPlayingPhraseIndex(null);
      setActivePlayingNote(null);
    }, cumulativeDelay + 400);
    phrasePlaybackTimeoutsRef.current.push(endTimeout);
  };

  // PC Keyboard listener for piano keys & chord numbers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      const key = e.key.toLowerCase();
      const chordNum = parseInt(key);
      const activeChords = currentPreset?.suggestedChords || DEFAULT_CHORD_PADS;
      if (chordNum >= 1 && chordNum <= activeChords.length) {
        playChord(activeChords[chordNum - 1]);
        return;
      }

      const note = PIANO_KEYS.find(k => k.keyboardKey === key);
      if (note) {
        playInstrumentNote(note.freq, note.name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playChord, playInstrumentNote, currentPreset]);

  // --- LOAD OR GENERATE PRESET SONG ---
  const handleSelectSongPreset = useCallback(async (
    preset: SongPreset, 
    autoPlay = false, 
    instrumentOverride?: VirtualInstrument
  ) => {
    stopPhrasePlayback();
    stopPlaybackNodes();
    setCurrentPreset(preset);
    setFileName(preset.title);
    setActiveLyrics(preset.lyrics);
    setErrorMsg(null);
    setIsProcessing(true);

    const instToUse = instrumentOverride || selectedInstrument || 'grand-piano';

    setSeparationProgress({
      progress: 30,
      stage: 1,
      stageName: `تجهيز وتوزيع "${preset.title}"`,
      detail: `تجهيز مسارات العزف الموسيقي (${instToUse} - ${preset.scaleArabic || preset.scale} - ${preset.bpm} BPM)...`
    });

    try {
      const buffers = synthesizePresetSongAudio(preset, instToUse);
      
      const vocalBlob = audioBufferToWav(buffers.vocalsBuffer);
      const instBlob = audioBufferToWav(buffers.instrumentalBuffer);
      const bassBlob = audioBufferToWav(buffers.bassBuffer);
      const origBlob = audioBufferToWav(buffers.originalBuffer);

      const result: StemsResult = {
        vocalsBlob: vocalBlob,
        vocalsUrl: URL.createObjectURL(vocalBlob),
        instrumentalBlob: instBlob,
        instrumentalUrl: URL.createObjectURL(instBlob),
        bassBlob: bassBlob,
        bassUrl: URL.createObjectURL(bassBlob),
        vocalsBuffer: buffers.vocalsBuffer,
        instrumentalBuffer: buffers.instrumentalBuffer,
        bassBuffer: buffers.bassBuffer,
        originalBuffer: buffers.originalBuffer,
        duration: preset.duration,
        sampleRate: buffers.vocalsBuffer.sampleRate,
        fileName: `${preset.title}.wav`,
        vocalEnergyPct: 65,
        peakDb: -0.8,
        pianoGuitarSuppressionPct: 98,
        instrumentBleedEliminatedPct: 99
      };

      setStemsResult(result);
      setDuration(preset.duration);
      setCurrentTime(0);
      pauseOffsetRef.current = 0;
      setIsProcessing(false);

      if (autoPlay) {
        setTimeout(() => {
          startPlaybackWithResult(result, 0);
        }, 150);
      }
    } catch (err: any) {
      console.error('Synthesizer error:', err);
      setErrorMsg('حدث خطأ أثناء إعداد المسار الموسيقي للأغنية.');
      setIsProcessing(false);
    }
  }, [selectedInstrument]);

  // Click handler for song presets: prompts instrument selection without auto-play
  const handleSongPresetClick = (preset: SongPreset) => {
    stopPlaybackNodes();
    stopPhrasePlayback();
    setPendingSongPreset(preset);
    setShowInstrumentModal(true);
  };

  // Confirm chosen instrument for the song
  const handleConfirmSongInstrument = (instId: VirtualInstrument) => {
    setSelectedInstrument(instId);
    setShowInstrumentModal(false);
    const target = pendingSongPreset || currentPreset || KARAOKE_PRESETS[0];
    if (target) {
      handleSelectSongPreset(target, false, instId);
      const instObj = INSTRUMENT_LIST.find(i => i.id === instId);
      setSongReadyToast(`تم تجهيز "${target.title}" بعزف (${instObj?.arabicName || instId}) بنجاح! اضغط زر التشغيل ◀ أو التسجيل  للبدء.`);
      setTimeout(() => setSongReadyToast(null), 5000);
    }
  };

  // Initialize first preset metadata on mount instantly without blocking the main thread with heavy WAV synthesis
  useEffect(() => {
    const defaultPreset = KARAOKE_PRESETS[0];
    if (defaultPreset) {
      setCurrentPreset(defaultPreset);
      setFileName(defaultPreset.title);
      setActiveLyrics(defaultPreset.lyrics);
      setDuration(defaultPreset.duration);
      setCurrentTime(0);
    }

    const handleVipUpdate = () => {
      setVipStatus(getVipStatusInfo());
    };
    window.addEventListener('yona_vip_updated', handleVipUpdate);
    window.addEventListener('storage', handleVipUpdate);

    return () => {
      window.removeEventListener('yona_vip_updated', handleVipUpdate);
      window.removeEventListener('storage', handleVipUpdate);
      stopPlaybackNodes();
      stopPhrasePlayback();
      if (instrumentAudioCtxRef.current) {
        try { instrumentAudioCtxRef.current.close(); } catch {}
      }
    };
  }, []);

  // Handle Uploaded File Stem Separation with 20 Free Limit & VIP Enforcement (Exempts Page Owner)
  const handleFileUpload = async (file: File) => {
    // Validate file size and audio MIME format
    const validation = validateAudioFileUpload(file, 25);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'الملف الصوتي المرفوع غير صالح أو حجمه يتجاوز 25 ميجابايت.');
      return;
    }

    // Check VIP, Page Owner, and Free Usage Quota
    const currentVip = getVipStatusInfo();
    if (!currentVip.canPerformIsolation) {
      setShowVipModal(true);
      setErrorMsg(' لقد استنفدت جميع المرات المجانية الـ 20 لعزل الصوت. يجب الترقية بالدفع ($5 أو $10) لفتح عزل الصوت وبجودة استوديو فائقة!');
      return;
    }

    // Immediately consume 1 credit and update status so counter decrements right away (e.g. 20 -> 19)
    consumeIsolationCredit();
    const updatedStatus = getVipStatusInfo();
    setVipStatus(updatedStatus);

    setSelectedFile(file);
    setFileName(file.name);
    setErrorMsg(null);
    stopPlaybackNodes();
    stopPhrasePlayback();
    setIsProcessing(true);
    setSeparationProgress({
      progress: 5,
      stage: 1,
      stageName: 'تجهيز ملف الصوت والتحقق من الرصيد',
      detail: `جاري تهيئة محرك Web Audio API وقراءة مسار الأغنية (الرصيد المتبقي: ${updatedStatus.isVip ? 'غير محدود ' : updatedStatus.remaining + ' عملية'})...`
    });

    try {
      const result = await separateAudioStems(file, file.name, (progressData) => {
        setSeparationProgress(progressData);
      }, {
        mode: isolationMode,
        pianoGuitarSuppression,
        noiseGateSensitivity,
        deReverbStrength
      });

      setStemsResult(result);
      setDuration(result.duration);
      setCurrentTime(0);
      pauseOffsetRef.current = 0;
      setIsProcessing(false);

      // If user just consumed their 20th and final free credit, show popup offering upgrade
      if (!updatedStatus.isVip && updatedStatus.remaining === 0) {
        setTimeout(() => {
          setShowVipModal(true);
        }, 1200);
      }

      setTimeout(() => {
        startPlaybackWithResult(result, 0);
      }, 200);
    } catch (err: any) {
      console.error('Separation error:', err);
      setErrorMsg(err.message || 'تعذر استخلاص مسارات الصوت من الملف. يرجى تجربة صيغة MP3 أو WAV قياسية.');
      setIsProcessing(false);
    }
  };

  // Re-process currently loaded file with adjusted DSP parameters (Does not consume extra credit for same file)
  const handleReprocessVocalStem = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const result = await separateAudioStems(selectedFile, selectedFile.name, (progressData) => {
        setSeparationProgress(progressData);
      }, {
        mode: isolationMode,
        pianoGuitarSuppression,
        noiseGateSensitivity,
        deReverbStrength
      });
      setStemsResult(result);
      setIsProcessing(false);
      if (isPlaying) {
        startPlaybackWithResult(result, currentTime);
      }
    } catch (err: any) {
      console.error('Re-processing error:', err);
      setErrorMsg('تعذر إعادة تصفية المسار: ' + (err.message || ''));
      setIsProcessing(false);
    }
  };

  // Dynamic Volume, Solo, Mute and Pan updates
  const updateTrackGainsAndPans = useCallback(() => {
    if (!vocalGainRef.current || !instGainRef.current || !bassGainRef.current) return;

    let vGain = isMelodyGuideEnabled ? vocalVol : 0;
    let iGain = instVol;
    let bGain = bassVol;
    let oGain = origVol;

    const anySolo = vocalSolo || instSolo || bassSolo || origSolo;
    if (anySolo) {
      vGain = vocalSolo ? (isMelodyGuideEnabled ? vocalVol : 0) : 0;
      iGain = instSolo ? instVol : 0;
      bGain = bassSolo ? bassVol : 0;
      oGain = origSolo ? origVol : 0;
    }

    if (vocalMute) vGain = 0;
    if (instMute) iGain = 0;
    if (bassMute) bGain = 0;
    if (origMute) oGain = 0;

    vocalGainRef.current.gain.setTargetAtTime(vGain, audioCtxRef.current?.currentTime || 0, 0.02);
    instGainRef.current.gain.setTargetAtTime(iGain, audioCtxRef.current?.currentTime || 0, 0.02);
    bassGainRef.current.gain.setTargetAtTime(bGain, audioCtxRef.current?.currentTime || 0, 0.02);
    if (origGainRef.current) {
      origGainRef.current.gain.setTargetAtTime(oGain, audioCtxRef.current?.currentTime || 0, 0.02);
    }

    if (vocalPannerRef.current) vocalPannerRef.current.pan.setTargetAtTime(vocalPan, audioCtxRef.current?.currentTime || 0, 0.02);
    if (instPannerRef.current) instPannerRef.current.pan.setTargetAtTime(instPan, audioCtxRef.current?.currentTime || 0, 0.02);
    if (bassPannerRef.current) bassPannerRef.current.pan.setTargetAtTime(bassPan, audioCtxRef.current?.currentTime || 0, 0.02);
  }, [vocalVol, instVol, bassVol, origVol, vocalMute, instMute, bassMute, origMute, vocalSolo, instSolo, bassSolo, origSolo, vocalPan, instPan, bassPan, isMelodyGuideEnabled]);

  useEffect(() => {
    updateTrackGainsAndPans();
  }, [updateTrackGainsAndPans]);

  // Start Multi-Track Synchronized Playback
  const startPlaybackWithResult = (result: StemsResult, seekOffset = 0) => {
    stopPlaybackNodes();

    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const vocalSrc = ctx.createBufferSource();
    const instSrc = ctx.createBufferSource();
    const bassSrc = ctx.createBufferSource();
    const origSrc = ctx.createBufferSource();

    vocalSrc.buffer = result.vocalsBuffer;
    instSrc.buffer = result.instrumentalBuffer;
    bassSrc.buffer = result.bassBuffer;
    origSrc.buffer = result.originalBuffer;

    const effectiveRate = playbackSpeed * Math.pow(2, pitchSemitones / 12);
    vocalSrc.playbackRate.value = effectiveRate;
    instSrc.playbackRate.value = effectiveRate;
    bassSrc.playbackRate.value = effectiveRate;
    origSrc.playbackRate.value = effectiveRate;

    const vocalGain = ctx.createGain();
    const instGain = ctx.createGain();
    const bassGain = ctx.createGain();
    const origGain = ctx.createGain();
    const masterGain = ctx.createGain();

    vocalGainRef.current = vocalGain;
    instGainRef.current = instGain;
    bassGainRef.current = bassGain;
    origGainRef.current = origGain;
    masterGainRef.current = masterGain;

    const vocalPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const instPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const bassPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

    vocalPannerRef.current = vocalPanner;
    instPannerRef.current = instPanner;
    bassPannerRef.current = bassPanner;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;

    if (vocalPanner) {
      vocalSrc.connect(vocalGain).connect(vocalPanner).connect(masterGain);
    } else {
      vocalSrc.connect(vocalGain).connect(masterGain);
    }

    if (instPanner) {
      instSrc.connect(instGain).connect(instPanner).connect(masterGain);
    } else {
      instSrc.connect(instGain).connect(masterGain);
    }

    if (bassPanner) {
      bassSrc.connect(bassGain).connect(bassPanner).connect(masterGain);
    } else {
      bassSrc.connect(bassGain).connect(masterGain);
    }

    origSrc.connect(origGain).connect(masterGain);

    // Dynamics compressor soft limiter: prevents clipping, harshness, and digital distortion
    const compressor = ctx.createDynamicsCompressor ? ctx.createDynamicsCompressor() : null;
    if (compressor) {
      compressor.threshold.setValueAtTime(-4, ctx.currentTime);
      compressor.knee.setValueAtTime(10, ctx.currentTime);
      compressor.ratio.setValueAtTime(5, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.18, ctx.currentTime);
      masterGain.connect(compressor);
      compressor.connect(analyser);
    } else {
      masterGain.connect(analyser);
    }
    analyser.connect(ctx.destination);

    // Route clean accompaniment into active recording destination if recording
    if (recMixedDestRef.current) {
      try {
        if (recMixedDestRef.current.context === ctx) {
          masterGain.connect(recMixedDestRef.current);
        }
      } catch (e) {
        console.warn("Notice connecting masterGain to recording destination:", e);
      }
    }

    updateTrackGainsAndPans();

    const offset = Math.max(0, Math.min(seekOffset, result.duration - 0.05));
    vocalSrc.start(0, offset);
    instSrc.start(0, offset);
    bassSrc.start(0, offset);
    origSrc.start(0, offset);

    vocalSourceRef.current = vocalSrc;
    instSourceRef.current = instSrc;
    bassSourceRef.current = bassSrc;
    origSourceRef.current = origSrc;

    startTimeRef.current = ctx.currentTime - (offset / effectiveRate);
    isPlayingRef.current = true;
    setIsPlaying(true);

    const tick = () => {
      if (ctx && isPlayingRef.current) {
        const elapsed = (ctx.currentTime - startTimeRef.current) * effectiveRate;
        if (elapsed >= result.duration) {
          stopPlaybackNodes();
          setCurrentTime(0);
          pauseOffsetRef.current = 0;
          return;
        }
        setCurrentTime(elapsed);

        // Update Synchronized Lyric Index
        if (activeLyrics && activeLyrics.length > 0) {
          let matchedIdx = 0;
          for (let i = 0; i < activeLyrics.length; i++) {
            if (elapsed >= activeLyrics[i].time) {
              matchedIdx = i;
            } else {
              break;
            }
          }
          setCurrentLyricIndex(matchedIdx);
        }

        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
    startVisualizerLoop();
  };

  const startPlayback = () => {
    if (!stemsResult) {
      if (currentPreset) {
        handleSelectSongPreset(currentPreset, true);
      }
      return;
    }
    startPlaybackWithResult(stemsResult, pauseOffsetRef.current);
  };

  const pausePlayback = () => {
    pauseOffsetRef.current = currentTime;
    stopPlaybackNodes();
  };

  const handleSeek = (newTime: number) => {
    pauseOffsetRef.current = newTime;
    setCurrentTime(newTime);
    if (isPlaying && stemsResult) {
      startPlaybackWithResult(stemsResult, newTime);
    }
  };

  // Visualizer Loop
  const startVisualizerLoop = () => {
    if (visualizerFrameRef.current) cancelAnimationFrame(visualizerFrameRef.current);

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;

        const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
        gradient.addColorStop(0, '#EC4899');
        gradient.addColorStop(0.5, '#8B5CF6');
        gradient.addColorStop(1, '#F59E0B');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + 1.5;
      }

      if (isPlayingRef.current) {
        visualizerFrameRef.current = requestAnimationFrame(draw);
      }
    };

    visualizerFrameRef.current = requestAnimationFrame(draw);
  };

  // --- DIRECT KARAOKE RECORDING STUDIO ENGINE ---
  const startKaraokeRecording = async () => {
    try {
      setErrorMsg(null);
      setRecordedAudioUrl(null);
      setRecordedBlob(null);
      setIsReviewingRecording(false);
      recordedChunksRef.current = [];

      // 1. Ensure Main AudioContext is ready and resumed
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // 2. Request microphone stream (clean studio audio with echo cancellation to preserve speaker playback)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true, // Prevents OS/browser from ducking/muting mic when speaker melody plays
          noiseSuppression: false, // Keep singing voice dynamics natural
          autoGainControl: true
        }
      });
      micStreamRef.current = stream;

      // 3. Create MediaStreamAudioDestinationNode for the combined mix (Vocals + Melody/Music)
      const mixedDest = ctx.createMediaStreamDestination();
      recMixedDestRef.current = mixedDest;

      // 4. Hook microphone into main AudioContext
      const micSource = ctx.createMediaStreamSource(stream);
      micSourceNodeRef.current = micSource;

      // Mic Analyser for live VU Meter
      const micAnalyser = ctx.createAnalyser();
      micAnalyser.fftSize = 64;
      micAnalyserRef.current = micAnalyser;
      micSource.connect(micAnalyser);

      // Dedicated vocal gain node into the mixed recording destination
      const micGain = ctx.createGain();
      micGain.gain.setValueAtTime(1.4, ctx.currentTime);
      micGainNodeRef.current = micGain;
      micSource.connect(micGain);
      micGain.connect(mixedDest);

      // If headphone monitoring is enabled, also route mic to speakers/headphones
      if (isHeadphoneMonitoring) {
        micGain.connect(ctx.destination);
      }

      // 5. Ensure song stems are ready and start accompaniment playback from 0
      let currentStems = stemsResult;
      const targetPreset = currentPreset || KARAOKE_PRESETS[0];
      if (!currentStems && targetPreset) {
        const buffers = synthesizePresetSongAudio(targetPreset, selectedInstrument);
        const vocalBlob = audioBufferToWav(buffers.vocalsBuffer);
        const instBlob = audioBufferToWav(buffers.instrumentalBuffer);
        const bassBlob = audioBufferToWav(buffers.bassBuffer);
        const origBlob = audioBufferToWav(buffers.originalBuffer);
        currentStems = {
          vocalsBlob: vocalBlob,
          vocalsUrl: URL.createObjectURL(vocalBlob),
          instrumentalBlob: instBlob,
          instrumentalUrl: URL.createObjectURL(instBlob),
          bassBlob: bassBlob,
          bassUrl: URL.createObjectURL(bassBlob),
          vocalsBuffer: buffers.vocalsBuffer,
          instrumentalBuffer: buffers.instrumentalBuffer,
          bassBuffer: buffers.bassBuffer,
          originalBuffer: buffers.originalBuffer,
          duration: targetPreset.duration,
          sampleRate: buffers.vocalsBuffer.sampleRate,
          fileName: `${targetPreset.title}.wav`,
          vocalEnergyPct: 65,
          peakDb: -0.8
        };
        setStemsResult(currentStems);
      }

      if (currentStems) {
        startPlaybackWithResult(currentStems, 0);
      }

      // Connect masterGain to the mixed recording destination as well
      if (masterGainRef.current) {
        try {
          masterGainRef.current.connect(mixedDest);
        } catch {}
      }

      // 6. Meter polling loop for real-time visual feedback
      const micData = new Uint8Array(micAnalyser.frequencyBinCount);
      const pollMic = () => {
        if (!micAnalyserRef.current) return;
        micAnalyserRef.current.getByteFrequencyData(micData);
        let sum = 0;
        for (let i = 0; i < micData.length; i++) sum += micData[i];
        const avg = sum / micData.length;
        setMicVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
        if (isPlayingRef.current) {
          requestAnimationFrame(pollMic);
        }
      };
      requestAnimationFrame(pollMic);

      // 7. Setup MediaRecorder on the MIXED destination stream (Voice + Melody)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      
      const mediaRecorder = new MediaRecorder(mixedDest.stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);
        setIsReviewingRecording(true);

        // Safe cleanup of mic stream and nodes AFTER recorder has safely finished capturing all data
        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach(t => t.stop());
          micStreamRef.current = null;
        }
        if (micSourceNodeRef.current) {
          try { micSourceNodeRef.current.disconnect(); } catch {}
          micSourceNodeRef.current = null;
        }
        if (micGainNodeRef.current) {
          try { micGainNodeRef.current.disconnect(); } catch {}
          micGainNodeRef.current = null;
        }
        recMixedDestRef.current = null;
      };

      mediaRecorder.start(100); // Flush chunks regularly every 100ms so no audio is lost
      setIsRecording(true);
      setRecordingSeconds(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Recording init failed:', err);
      setErrorMsg('تعذر بدء التسجيل: ' + (err.message || 'يرجى التأكد من توصيل الميكروفون ومنح الإذن للمتصفح.'));
    }
  };

  const stopKaraokeRecording = () => {
    setIsRecording(false);
    setMicVolumeLevel(0);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }

    // Stop song playback
    pausePlayback();

    // Request final data and stop recorder (stream cleanup will happen in mediaRecorder.onstop)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.requestData();
        }
        mediaRecorderRef.current.stop();
      } catch (err) {
        console.warn('Error stopping mediaRecorder:', err);
      }
    }
  };

  // Copy Lyrics to Clipboard
  const handleCopyLyrics = () => {
    const text = activeLyrics.map(l => l.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2500);
  };

  // Format Seconds helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Open Lyrics / Song Preset Customizer
  const handleOpenLyricsEditor = () => {
    setCustomLyricsText(activeLyrics.map(l => l.text).join('\n'));
    setIsCustomLyricsOpen(true);
    setLyricsModalTab('suggested');
  };

  // Apply Selected Preset from Library
  const handleApplySuggestedSong = async (song: SuggestedSongLyricItem) => {
    setFileName(song.title);
    setIsCustomLyricsOpen(false);

    // Check if preset exists in KARAOKE_PRESETS
    const existingPreset = KARAOKE_PRESETS.find(p => p.id === song.id || p.title.includes(song.title));
    if (existingPreset) {
      setActiveLyrics(existingPreset.lyrics);
      setCurrentLyricIndex(0);
      await handleSelectSongPreset(existingPreset, true);
    } else {
      const customSong = generateCustomScaleSong({
        title: song.title,
        lyricsText: song.lyricsText,
        maqamId: song.recommendedMaqam || 'nahawand',
        customStyle: 'piano-ballad'
      });
      setActiveLyrics(customSong.lyrics);
      setCurrentLyricIndex(0);
      await handleSelectSongPreset(customSong, true);
    }

    setLyricsNotice(` تم تحميل شارة "${song.title}" بألحانها وتوزيعها الموسيقي بنجاح!`);
    setTimeout(() => setLyricsNotice(null), 4000);
  };

  // Tap-to-Sync Engine
  const handleInitTapSync = () => {
    const lines = customLyricsText.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return;
    setTapSyncLines(lines.map(l => ({ text: l.trim(), time: null })));
    setTapSyncCurrentIndex(0);
    setIsTapSyncActive(true);
    setLyricsModalTab('tapsync');
    handleSeek(0);
    if (stemsResult) {
      startPlaybackWithResult(stemsResult, 0);
    }
  };

  const handleTapCurrentLine = () => {
    if (tapSyncCurrentIndex >= tapSyncLines.length) return;
    const roundedTime = Math.round(currentTime * 10) / 10;
    
    setTapSyncLines(prev => {
      const next = [...prev];
      next[tapSyncCurrentIndex] = {
        ...next[tapSyncCurrentIndex],
        time: roundedTime
      };
      return next;
    });

    if (tapSyncCurrentIndex + 1 < tapSyncLines.length) {
      setTapSyncCurrentIndex(prev => prev + 1);
    }
  };

  const handleApplyTapSyncLyrics = () => {
    const validLines: KaraokeLyricLine[] = tapSyncLines.map((item, idx) => ({
      time: item.time !== null ? item.time : (idx * 3.5),
      text: item.text,
      subText: `توقيت دقيق: ${item.time !== null ? `${item.time}s` : 'تلقائي'}`
    }));

    setActiveLyrics(validLines);
    setIsTapSyncActive(false);
    setIsCustomLyricsOpen(false);
    setLyricsNotice(' تم حفظ ومزامنة التوقيت اللحظي بدقة متناهية!');
    setTimeout(() => setLyricsNotice(null), 4000);
  };

  const handleExportLrcFile = () => {
    const lrcLines = activeLyrics.map(line => {
      const mins = Math.floor(line.time / 60);
      const secs = Math.floor(line.time % 60);
      const ms = Math.floor((line.time % 1) * 100);
      const timeStr = `[${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.${ms < 10 ? '0' : ''}${ms}]`;
      return `${timeStr} ${line.text}`;
    });

    const lrcContent = `[ti:${fileName}]\n[ar:Yona Studio]\n[al:Spacetoon & Anime Karaoke]\n\n${lrcLines.join('\n')}`;
    const blob = new Blob([lrcContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName.replace(/\s+/g, '_')}_synced.lrc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Apply Authentically Detected Song Preset
  const handleApplyDetectedOriginalSong = async (detection: SongDetectionResult) => {
    if (!detection.isKnown) return;
    setIsCustomLyricsOpen(false);

    if (detection.matchedPreset) {
      setActiveLyrics(detection.matchedPreset.lyrics);
      setCurrentLyricIndex(0);
      await handleSelectSongPreset(detection.matchedPreset, true);
    } else if (detection.matchedSong) {
      await handleApplySuggestedSong(detection.matchedSong);
    }

    setLyricsNotice(` تم التعرف التلقائي وتفعيل النوتات والألحان الأصلية لشارة "${detection.matchedSong?.title || detection.matchedPreset?.title}" بنجاح!`);
    setTimeout(() => setLyricsNotice(null), 4500);
  };

  // Switch to full manual composition for a detected song
  const handleEnableCustomCompositionForDetected = (detection: SongDetectionResult) => {
    setForceCustomComposition(true);
    if (detection.recommendedMaqam) setComposerMaqam(detection.recommendedMaqam);
    if (detection.recommendedStyle) setComposerStyle(detection.recommendedStyle);
    if (detection.recommendedBpm) setComposerBpm(detection.recommendedBpm);
    if (detection.recommendedInstrument) setComposerInstrument(detection.recommendedInstrument);
  };

  // Perform Deep External Musicological Search & AI Maqam Recognition
  const handlePerformOnlineSongRecognition = async () => {
    const textToSearch = composerLyrics.trim() || customLyricsText.trim();
    const titleToSearch = composerTitle.trim();

    if (!textToSearch && !titleToSearch) {
      setOnlineRecognitionError('يرجى كتابة عنوان الأغنية أو بضعة أسطر من كلماتها أولاً للبحث في محركات البحث الموسيقية.');
      return;
    }

    setIsSearchingSongOnline(true);
    setOnlineRecognitionError(null);

    try {
      const response = await fetch('/api/ai/recognize-song', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lyrics: textToSearch,
          title: titleToSearch,
          hints: 'التعرف على الأغنية بدقة وتحديد الملحن والمقام الموسيقي الصحيح'
        })
      });

      const resData = await response.json();
      if (!resData.success || !resData.data) {
        throw new Error(resData.error || 'فشل الاتصال بمحرك البحث الموسيقي');
      }

      const songData: RecognizedMaqamSong = resData.data;
      setOnlineRecognizedSong(songData);

      // Auto-populate composer inputs
      if (songData.maqamId) setComposerMaqam(songData.maqamId);
      if (songData.recommendedInstrument) setComposerInstrument(songData.recommendedInstrument);
      if (songData.recommendedStyle) setComposerStyle(songData.recommendedStyle);
      if (songData.bpm) setComposerBpm(songData.bpm);
      if (!composerTitle && songData.title) setComposerTitle(songData.title);

      setLyricsNotice(` تم التعرف بنجاح عبر محركات البحث: "${songData.title}" للملحن (${songData.composer}) على ${songData.maqam}!`);
      setTimeout(() => setLyricsNotice(null), 5500);
    } catch (err: any) {
      console.error('Online Recognition Failed:', err);
      setOnlineRecognitionError(err.message || 'تعذر التعرف عبر محركات البحث حالياً. يمكنك اختيار المقام وتأليف اللحن يدوياً.');
    } finally {
      setIsSearchingSongOnline(false);
    }
  };

  // Apply Online Recognized Song (with authentic Maqam, BPM & verified lyrics)
  const handleApplyOnlineRecognizedSong = async (song: RecognizedMaqamSong) => {
    setIsGeneratingCustomSong(true);
    setIsProcessing(true);
    setIsCustomLyricsOpen(false);

    try {
      const lyricsToUse = (song.verifiedLyrics && song.verifiedLyrics.length > 0)
        ? song.verifiedLyrics.join('\n')
        : (composerLyrics.trim() || song.title);

      const generatedPreset = generateCustomScaleSong({
        title: `${song.title} - ${song.artist}`,
        lyricsText: lyricsToUse,
        maqamId: song.maqamId,
        customBpm: song.bpm,
        customStyle: song.recommendedStyle,
        instrumentType: song.recommendedInstrument
      });

      generatedPreset.subtitle = `الملحن: ${song.composer} • ${song.maqam}`;
      generatedPreset.scale = song.maqam;
      generatedPreset.scaleArabic = song.maqamArabicName || song.maqam;

      await handleSelectSongPreset(generatedPreset, true);
      setLyricsNotice(` تم ضبط الاستوديو على أغنية "${song.title}" بألحان ومقام ${song.maqam} للملحن ${song.composer}!`);
      setTimeout(() => setLyricsNotice(null), 5000);
    } catch (err) {
      console.error('Apply online song error:', err);
    } finally {
      setIsGeneratingCustomSong(false);
    }
  };

  // Smart Custom Scale & Song Generator Handler
  const handleGenerateCustomSongAndPlay = async () => {
    const textToUse = composerLyrics.trim() || customLyricsText.trim();
    if (!textToUse) {
      setErrorMsg('يرجى إدخال كلمات الأغنية أولاً ليتم توليد اللحن المناسب لها.');
      return;
    }

    // If the song is known and the user hasn't explicitly chosen to customize it, load the original melody
    if (detectedSongInfo.isKnown && !forceCustomComposition) {
      await handleApplyDetectedOriginalSong(detectedSongInfo);
      return;
    }

    setIsGeneratingCustomSong(true);
    setIsProcessing(true);
    setIsCustomLyricsOpen(false);

    const targetTitle = composerTitle.trim() || (detectedSongInfo.matchedSong?.title ? `${detectedSongInfo.matchedSong.title} (تأليف وتوزيع مخصص)` : 'أغنية الكاريوكي المخصصة');

    const generatedPreset = generateCustomScaleSong({
      title: targetTitle,
      lyricsText: textToUse,
      maqamId: composerMaqam,
      customBpm: composerBpm,
      customStyle: composerStyle,
      instrumentType: composerInstrument
    });

    await handleSelectSongPreset(generatedPreset, true);
    setIsGeneratingCustomSong(false);
    setLyricsNotice(` تم تأليف اللحن المخصص على مقام ${generatedPreset.scaleArabic} مع الآلة الموسيقية المختارة بنجاح!`);
    setTimeout(() => setLyricsNotice(null), 4500);
  };

  // Active Song Chords list
  const activeChordsList = currentPreset?.suggestedChords && currentPreset.suggestedChords.length > 0
    ? currentPreset.suggestedChords
    : DEFAULT_CHORD_PADS;

  return (
    <div id="vocal-isolator-studio" className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-6 text-white font-tajawal">

      {/* HEADER HERO BAR */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C1635] via-[#241A45] to-[#120E24] border-2 border-purple-500/30 p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>استوديو عزل الصوت والكاريوكي والآلات الموسيقية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              استوديو عزل الصوت، الكاريوكي، والآلات الموسيقية 
            </h1>
            <p className="text-sm md:text-base text-gray-300 max-w-3xl leading-relaxed">
              اختر أي شارة كلاسيكية بألحانها ونوتاتها الحقيقية، تابع مسار اللحن الإرشادي وسجل صوتك مع الكلمات، أو اعزف نوتات الأغنية وسلالمها بالآلات الموسيقية التفاعلية!
            </p>

            {/* VOCAL ISOLATION QUOTA & VIP STATUS BAR */}
            <div className="pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-purple-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    vipStatus.isVip ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  }`}>
                    {vipStatus.isVip ? <Crown className="w-5 h-5 fill-current" /> : <Zap className="w-5 h-5" />}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white">
                        {vipStatus.isVip ? 'عضوية VIP استوديو (غير محدودة )' : 'رصيد عزل الصوت المجاني:'}
                      </span>
                      {vipStatus.isVip ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-black">
                          غير محدود 
                        </span>
                      ) : (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${
                          vipStatus.remaining <= 3
                            ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                            : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                        }`}>
                          {vipStatus.remaining} / {vipStatus.totalAvailable} عملية متبقية
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      {vipStatus.isVip
                        ? 'تمتع بعزل وفصل مسارات الصوت لعدد غير محدود من الأغاني بجودة الاستوديو الفائقة!'
                        : `استخدام مجاني لـ ${FREE_ISOLATION_LIMIT} عملية عزل صوت. بعد انتهاء الرصيد يمكنك الترقية ($5 أو $10 VIP).`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowVipModal(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0 w-full sm:w-auto justify-center ${
                    vipStatus.isVip
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-300'
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black shadow-amber-500/20 hover:scale-105 active:scale-95'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>{vipStatus.isVip ? 'إدارة عضوية VIP' : 'ترقية باقة VIP ($5 / $10)'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Record Action Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {!isRecording ? (
              <button
                onClick={startKaraokeRecording}
                disabled={!stemsResult || isProcessing}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:scale-105 active:scale-95 text-white font-black text-sm shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50"
              >
                <Mic className="w-5 h-5 animate-pulse text-white" />
                <span>تسجيل صوتك مع اللحن </span>
              </button>
            ) : (
              <button
                onClick={stopKaraokeRecording}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 hover:scale-105 active:scale-95 text-white font-black text-sm shadow-xl shadow-red-700/50 flex items-center justify-center gap-2 cursor-pointer animate-pulse"
              >
                <Square className="w-5 h-5 text-white fill-white" />
                <span>إيقاف وحفظ التسجيل ({recordingSeconds} ث)</span>
              </button>
            )}

            <button
              onClick={() => {
                setLyricsModalTab('composer');
                setIsCustomLyricsOpen(true);
              }}
              className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-[#2A1F4E] hover:bg-[#382B66] border border-pink-500/40 text-pink-200 hover:text-white font-black text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>تأليف لحن مخصص حسب المقام </span>
            </button>
          </div>
        </div>
      </div>

      {/* RECORDING ACTIVE BANNER (IF RECORDING LIVE) */}
      {isRecording && (
        <div className="p-4 md:p-5 rounded-3xl bg-gradient-to-r from-red-950 via-rose-950 to-purple-950 border-2 border-red-500 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-red-500 animate-ping" />
            <div>
              <div className="text-sm md:text-base font-black text-white flex items-center gap-2">
                <span>جاري تسجيل صوتك مع لحن الكاريوكي الآن...</span>
                <span className="font-mono text-red-300 font-bold">({recordingSeconds} ثانية)</span>
              </div>
              <p className="text-xs text-red-200/80 mt-0.5">
                تابع كلمات الشارة المضيئة بالأسفل واغنِّ بكل راحة، سيتم دمج صوتك بدقة مع الموسيقى!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Mic VU Level Indicator */}
            <div className="flex items-center gap-1.5 bg-black/50 px-3 py-1.5 rounded-xl border border-red-500/30">
              <Mic className="w-4 h-4 text-red-400" />
              <div className="w-24 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-75"
                  style={{ width: `${Math.max(5, micVolumeLevel)}%` }}
                />
              </div>
            </div>

            <button
              onClick={stopKaraokeRecording}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>إيقاف وحفظ</span>
            </button>
          </div>
        </div>
      )}

      {/* RECORDED TAKE REVIEW MODAL (AFTER RECORDING) */}
      {isReviewingRecording && recordedAudioUrl && (
        <div className="p-5 md:p-6 rounded-3xl bg-[#1D1735] border-2 border-emerald-500/60 shadow-2xl space-y-4 text-right animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black text-white">
                  تم تسجيل أدائك الغنائي مع اللحن بنجاح! 
                </h3>
                <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                  صوتك الغنائي واللحن الموسيقي مدمجان معاً بأعلى جودة استوديو! اضغط زر التشغيل بالأسفل لسماعهما معاً فوراً.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsReviewingRecording(false)}
              className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
            >
              إغلاق 
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="w-full md:w-2/3 space-y-2">
              <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>التسجيل الكامل (صوتك الغنائي مدمج مع اللحن والموسيقى):</span>
                </span>
                <span className="font-mono text-gray-300 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                   {recordingSeconds} ثانية
                </span>
              </div>

              {/* Direct Play/Pause trigger button for instant listening */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!recordedAudioRef.current) return;
                    if (recordedAudioRef.current.paused) {
                      recordedAudioRef.current.play().catch(e => console.warn('Audio play error:', e));
                      setIsRecordedAudioPlaying(true);
                    } else {
                      recordedAudioRef.current.pause();
                      setIsRecordedAudioPlaying(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer shrink-0"
                >
                  {isRecordedAudioPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>إيقاف مؤقت </span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>استماع للتسجيل مع اللحن فوراً ▶</span>
                    </>
                  )}
                </button>

                <span className="text-[11px] text-gray-300 hidden sm:inline">
                  اضغط للاستماع المباشر للتسجيل المدمج
                </span>
              </div>

              <audio
                ref={recordedAudioRef}
                controls
                src={recordedAudioUrl}
                className="w-full h-11 accent-emerald-500 rounded-xl"
                onPlay={() => setIsRecordedAudioPlaying(true)}
                onPause={() => setIsRecordedAudioPlaying(false)}
                onEnded={() => setIsRecordedAudioPlaying(false)}
              />
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
              <a
                href={recordedAudioUrl}
                download={`تسجيل_${fileName || 'أغنيتي'}_مع_اللحن.webm`}
                className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:scale-105 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-transform cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>تحميل التسجيل مع اللحن</span>
              </a>

              <button
                onClick={() => {
                  if (recordedAudioRef.current) {
                    recordedAudioRef.current.pause();
                  }
                  setIsRecordedAudioPlaying(false);
                  setIsReviewingRecording(false);
                  startKaraokeRecording();
                }}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCcw className="w-3.5 h-3.5" />
                <span>إعادة التسجيل </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SONG PRESETS SELECTOR BAR */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 text-sm font-black text-purple-200">
            <Music2 className="w-4 h-4 text-pink-400" />
            <span>الشارات الأصلية بألحانها وتوزيعها ونوتاتها الدقيقة (انقر لاختيار الشارة):</span>
          </div>
          <span className="text-xs text-gray-400 font-mono">
            {KARAOKE_PRESETS.length} شارات كلاسيكية كاملة
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {KARAOKE_PRESETS.map((preset) => {
            const isSelected = currentPreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSongPresetClick(preset)}
                className={`p-3 rounded-2xl transition-all duration-200 text-right flex flex-col justify-between gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-br from-pink-600/30 to-purple-600/30 border-pink-400 shadow-lg shadow-pink-500/20 scale-[1.02]'
                    : 'bg-[#181429] hover:bg-[#231E3D] border-white/5 hover:border-purple-500/40'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl">{preset.icon}</span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-black text-white truncate">{preset.title}</div>
                  <div className="text-[11px] text-pink-300/80 truncate mt-0.5">{preset.tag}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* SONG READY TOAST NOTIFICATION */}
        {songReadyToast && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-[#141026] border border-emerald-500/60 shadow-xl flex items-center justify-between text-right text-emerald-200 text-xs font-bold animate-fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{songReadyToast}</span>
            </div>
            <button
              onClick={() => setSongReadyToast(null)}
              className="text-gray-400 hover:text-white px-2 py-1 text-xs bg-white/5 rounded-lg cursor-pointer"
            >
              
            </button>
          </div>
        )}
      </div>

      {/* 4 PRIMARY NAVIGATION TABS */}
      <div className="flex items-center bg-[#130E26] p-1.5 rounded-3xl border border-white/10 shadow-xl overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('karaoke')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'karaoke'
              ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md scale-[1.01]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>الكاريوكي واستوديو الغناء</span>
        </button>

        <button
          onClick={() => setActiveTab('instruments')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'instruments'
              ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md scale-[1.01]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Piano className="w-4 h-4" />
          <span>نوتات الأغنية والآلات الموسيقية</span>
        </button>

        <button
          onClick={() => setActiveTab('mixer')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'mixer'
              ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md scale-[1.01]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>خلاط المسارات والاستوديو</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 min-w-[140px] px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'generator'
              ? 'bg-[#D4AF37] text-slate-950 font-black shadow-md scale-[1.01]'
              : 'text-slate-300 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>عزل الصوت وتأليف المقامات</span>
        </button>
      </div>

      {/* TAB 1: KARAOKE & SINGING STUDIO */}
      {activeTab === 'karaoke' && (
        <div className="space-y-6">
          
          {/* Main Karaoke Screen */}
          <div className="relative overflow-hidden rounded-3xl bg-[#141024] border-2 border-purple-500/40 p-5 md:p-7 shadow-2xl space-y-5">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-amber-400" />

            {/* Screen Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  <Disc3 className={`w-6 h-6 ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                    <span>{fileName}</span>
                    {currentPreset && (
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-normal">
                        {currentPreset.scale}
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-400">
                    الكلمات تتوهج تزامناً مع اللحن الموسيقي. انقر على أي سطر للانتقال إليه مباشرة.
                  </p>
                </div>
              </div>

              {/* Melody Guide Vocal Switch, Instrument Switcher & Lyrics Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Switch Instrument Button */}
                <button
                  onClick={() => {
                    setPendingSongPreset(currentPreset);
                    setShowInstrumentModal(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-purple-600/30 hover:bg-purple-600 border border-purple-500/40 text-purple-200 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  title="تغيير الآلة الموسيقية التي يُعزف بها اللحن"
                >
                  <Piano className="w-4 h-4 text-pink-300" />
                  <span>الآلة: {INSTRUMENT_LIST.find(i => i.id === selectedInstrument)?.arabicName || selectedInstrument} </span>
                </button>

                {/* Singing Melody Guide Toggle */}
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
                  <span className="text-xs font-bold text-purple-200">اللحن الإرشادي للغناء:</span>
                  <button
                    onClick={() => setIsMelodyGuideEnabled(!isMelodyGuideEnabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      isMelodyGuideEnabled
                        ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {isMelodyGuideEnabled ? 'مفعّل ' : 'مكتوم (كاريوكي صافي) '}
                  </button>
                </div>

                {/* Font Size */}
                <div className="flex items-center bg-black/40 rounded-xl p-1 border border-white/10">
                  {(['sm', 'md', 'lg', 'xl'] as const).map(size => (
                    <button
                      key={size}
                      onClick={() => setLyricsFontSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        lyricsFontSize === size
                          ? 'bg-pink-600 text-white shadow'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {size === 'sm' ? 'A-' : size === 'md' ? 'A' : size === 'lg' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyLyrics}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                  title="نسخ الكلمات"
                >
                  {copiedLyrics ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleOpenLyricsEditor}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-pink-600/30 cursor-pointer transition-all"
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>تعديل الكلمات / أغاني مقترحة</span>
                </button>
              </div>
            </div>

            {/* Glowing Lyrics Teleprompter */}
            <div
              ref={lyricsContainerRef}
              className="h-64 sm:h-72 overflow-y-auto space-y-3.5 py-4 px-3 bg-black/30 rounded-2xl border border-white/5 text-center scroll-smooth scrollbar-thin scrollbar-thumb-purple-600"
            >
              {activeLyrics.map((lyric, idx) => {
                const isActive = currentLyricIndex === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSeek(lyric.time)}
                    className={`py-2 px-4 rounded-2xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-pink-600/30 via-purple-600/40 to-pink-600/30 border border-pink-400/60 shadow-xl shadow-pink-500/20 scale-[1.02]'
                        : 'opacity-50 hover:opacity-80 hover:bg-white/5'
                    }`}
                  >
                    <div
                      className={`font-black transition-all ${
                        isActive
                          ? 'text-white drop-shadow-[0_2px_12px_rgba(236,72,153,0.8)]'
                          : 'text-gray-300'
                      } ${
                        lyricsFontSize === 'sm'
                          ? 'text-sm sm:text-base'
                          : lyricsFontSize === 'md'
                          ? 'text-base sm:text-lg'
                          : lyricsFontSize === 'lg'
                          ? 'text-lg sm:text-xl md:text-2xl'
                          : 'text-xl sm:text-2xl md:text-3xl'
                      }`}
                    >
                      {lyric.text}
                    </div>
                    {lyric.subText && (
                      <div className="text-[11px] font-mono text-pink-300/70 mt-1">
                        {lyric.subText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Audio Waveform Canvas */}
            <div className="relative h-14 w-full bg-black/40 rounded-2xl overflow-hidden border border-white/5">
              <canvas ref={canvasRef} width={800} height={56} className="w-full h-full" />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-3 text-[10px] text-gray-500 font-mono">
                <span>00:00</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Main Playback Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-300">
                <span className="text-pink-300 font-bold">{formatTime(currentTime)}</span>
                <span className="text-gray-400">{formatTime(duration)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={duration || 32}
                step={0.1}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>

            {/* Playback Controls & Speed / Pitch */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={isPlaying ? pausePlayback : startPlayback}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-pink-600/40 cursor-pointer transition-all"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل اللحن الموسيقي'}
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
                </button>

                {!isRecording ? (
                  <button
                    onClick={startKaraokeRecording}
                    className="px-4 py-3 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:scale-105 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-600/40 cursor-pointer transition-all"
                    title="تسجيل صوتك مع اللحن والموسيقى"
                  >
                    <Mic className="w-4 h-4 text-white animate-pulse" />
                    <span>تسجيل صوتك مع اللحن </span>
                  </button>
                ) : (
                  <button
                    onClick={stopKaraokeRecording}
                    className="px-4 py-3 rounded-2xl bg-gradient-to-r from-red-700 to-amber-600 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-red-700/50 cursor-pointer animate-pulse"
                    title="إيقاف وحفظ التسجيل مع اللحن"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>إيقاف التسجيل ({recordingSeconds} ث)</span>
                  </button>
                )}

                <button
                  onClick={() => handleSeek(0)}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10 cursor-pointer"
                  title="إعادة من البداية"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>

              {/* Speed & Pitch Controls */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-400">السرعة:</span>
                  {[0.8, 1.0, 1.2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                        playbackSpeed === speed ? 'bg-pink-600 text-white' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-2xl border border-white/10">
                  <span className="text-xs text-gray-400">طبقة الصوت:</span>
                  <button
                    onClick={() => setPitchSemitones(p => Math.max(-4, p - 1))}
                    className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs text-pink-300 font-bold px-1">
                    {pitchSemitones > 0 ? `+${pitchSemitones}` : pitchSemitones}
                  </span>
                  <button
                    onClick={() => setPitchSemitones(p => Math.min(4, p + 1))}
                    className="px-2 py-0.5 rounded bg-white/10 text-xs font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: SONG SHEET MUSIC & INTERACTIVE INSTRUMENTS */}
      {activeTab === 'instruments' && (
        <div className="space-y-6">
          
          {/* Song Sheet Music Card with Solfege and Notes */}
          <div className="rounded-3xl bg-[#151028] border-2 border-purple-500/40 p-5 md:p-7 shadow-2xl space-y-6 text-right">
            
            {/* Sheet Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  <span>مدونة النوتات الموسيقية المخصصة للأغنية</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>{currentPreset?.title}</span>
                  <span className="text-xs text-pink-300 font-normal">
                    ({currentPreset?.scaleArabic || currentPreset?.scale})
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  النوتات الموزونة بدقة بالسولفيج العربي والنوتات الغربية. انقر على أي نغمة لسماعها فوراً أو اعزف المقطع كاملاً!
                </p>
              </div>

              {/* Auto Play All Notes Button */}
              <div className="flex items-center gap-2">
                {playingPhraseIndex === null ? (
                  <button
                    onClick={handlePlayAllSongPhrases}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer transition-all"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>عزف نوتات الأغنية كاملة تلقائياً </span>
                  </button>
                ) : (
                  <button
                    onClick={stopPhrasePlayback}
                    className="px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer animate-pulse"
                  >
                    <StopCircle className="w-4 h-4" />
                    <span>إيقاف العزف</span>
                  </button>
                )}
              </div>
            </div>

            {/* Song Phrases List (Structured Melody Notes) */}
            <div className="space-y-4">
              {currentPreset?.melodyPhrases && currentPreset.melodyPhrases.length > 0 ? (
                currentPreset.melodyPhrases.map((phrase, pIdx) => {
                  const isPhrasePlaying = playingPhraseIndex === pIdx;
                  return (
                    <div
                      key={pIdx}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isPhrasePlaying
                          ? 'bg-purple-950/60 border-pink-500 shadow-lg shadow-pink-500/20'
                          : 'bg-black/30 hover:bg-black/50 border-white/10'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <div className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-pink-500/20 text-pink-300 flex items-center justify-center text-xs font-mono font-bold">
                              {pIdx + 1}
                            </span>
                            <span>{phrase.phraseText}</span>
                          </div>
                          <div className="text-xs text-purple-300/80 mt-0.5">
                            السولفيج: <span className="font-bold text-amber-300">{phrase.solfegeText}</span>
                            {phrase.arabicChord && (
                              <span className="mr-3 text-cyan-300"> • الأكورد المصاحب: {phrase.arabicChord}</span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handlePlaySongPhrase(phrase, pIdx)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            isPhrasePlaying
                              ? 'bg-pink-600 text-white shadow-md'
                              : 'bg-white/10 hover:bg-white/20 text-gray-200'
                          }`}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{isPhrasePlaying ? 'جاري العزف...' : 'عزف نوتات هذا المقطع'}</span>
                        </button>
                      </div>

                      {/* Notes Chips for This Phrase */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {phrase.notes.map((note, nIdx) => {
                          const isNoteActive = activePlayingNote === note.pitch;
                          return (
                            <button
                              key={nIdx}
                              onClick={() => playInstrumentNote(note.freq, note.pitch, note.dur)}
                              className={`px-3 py-2 rounded-xl text-right transition-all flex flex-col items-center gap-0.5 cursor-pointer active:scale-95 border ${
                                isNoteActive
                                  ? 'bg-pink-500 text-white border-pink-300 shadow-lg scale-105'
                                  : 'bg-[#1C1638] hover:bg-[#2A2052] border-purple-500/30 text-gray-200'
                              }`}
                            >
                              <span className="text-xs font-black">{note.arabicPitch}</span>
                              <span className="text-[10px] font-mono opacity-70">{note.pitch}</span>
                              {note.syllable && (
                                <span className="text-[9px] text-pink-300/90 font-tajawal mt-0.5">
                                  {note.syllable}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 rounded-2xl bg-black/30 text-center text-gray-400 text-xs">
                  لا توجد نوتات مقسمة لهذا المسار بعد.
                </div>
              )}
            </div>

            {/* Instrument Selection Bar */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <span> الآلة الموسيقية المختارة للعزف المباشر:</span>
                  </span>
                </div>
                <div className="text-xs text-purple-300/80">
                  سلم الشارة الحالي: <span className="font-bold text-amber-300">{currentPreset?.scaleArabic || currentPreset?.scale}</span>
                </div>
              </div>

              {/* Interactive Instrument Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  { id: 'grand-piano', name: 'بيانو أوركسترالي', icon: '', desc: 'Grand Piano' },
                  { id: 'oud-qanun', name: 'عود وقانون شرقي', icon: '', desc: 'Oud & Qanun' },
                  { id: 'strings', name: 'كمان وتشيلو أوتار', icon: '', desc: 'Violin / Strings' },
                  { id: 'flute', name: 'ناي وفلوت دافئ', icon: '', desc: 'Nai / Flute' },
                  { id: 'synth-lead', name: 'ليد سنث سبيستون', icon: '', desc: 'Anime Synth' },
                  { id: 'drums', name: 'إيقاع وطبلة ودف', icon: '', desc: 'Percussion / Beat' },
                ].map((inst) => (
                  <button
                    key={inst.id}
                    onClick={() => setSelectedInstrument(inst.id as VirtualInstrument)}
                    className={`p-2.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-1 shadow-sm ${
                      selectedInstrument === inst.id
                        ? 'bg-gradient-to-br from-pink-600 to-purple-700 text-white border-pink-400 shadow-lg shadow-pink-600/30 scale-[1.03]'
                        : 'bg-black/40 hover:bg-white/10 text-gray-300 border-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{inst.icon}</span>
                      {selectedInstrument === inst.id && (
                        <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">مفعّلة </span>
                      )}
                    </div>
                    <div className="text-xs font-black leading-tight">{inst.name}</div>
                    <div className="text-[10px] text-gray-400 group-hover:text-gray-200">{inst.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Song Chords Section */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-300 flex items-center gap-2">
                <span>أكوردات المصاحبة الهارمونية الخاصة بالأغنية (انقر أو اضغط 1-8 في لوحة المفاتيح):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
                {activeChordsList.map((chord, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => playChord(chord)}
                    className="p-3 rounded-2xl bg-[#211B3B] hover:bg-pink-600 text-white font-bold text-xs border border-white/10 hover:border-pink-400 transition-all flex flex-col items-center gap-1 cursor-pointer active:scale-95 shadow-md"
                  >
                    <span className="font-mono text-pink-300 group-hover:text-white text-sm font-black">
                      {chord.name}
                    </span>
                    <span className="text-[11px] text-gray-300">{chord.arabicName}</span>
                    <span className="text-[10px] text-gray-400 font-mono">[{chord.keyNum || cIdx + 1}]</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Chromatic Piano Keyboard with Scale Highlights */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold text-gray-400">
                لوحة مفاتيح البيانو التفاعلية (المفاتيح المضيئة تمثل سلم الأغنية الحالي):
              </div>
              <div className="relative flex items-end justify-center overflow-x-auto py-2 bg-black/40 rounded-2xl p-3 border border-white/5 scrollbar-none select-none">
                <div className="flex items-start">
                  {PIANO_KEYS.map((key) => {
                    const isPressed = activePressedKey === key.name || activePlayingNote === key.name;
                    const isInSongScale = currentPreset?.scaleNoteNames?.some(sn => key.name.includes(sn.replace(/\d/, ''))) || false;

                    if (key.isBlack) {
                      return (
                        <button
                          key={key.name}
                          onClick={() => playInstrumentNote(key.freq, key.name)}
                          className={`w-6 sm:w-7 h-20 -mx-3 sm:-mx-3.5 z-10 rounded-b-md transition-all cursor-pointer shadow-lg flex flex-col justify-end items-center pb-1 ${
                            isPressed
                              ? 'bg-pink-500 scale-95'
                              : isInSongScale
                              ? 'bg-purple-900 border-x border-b border-purple-500/60'
                              : 'bg-gray-900 hover:bg-gray-700 border-x border-b border-black'
                          }`}
                        >
                          <span className="text-[9px] font-mono text-gray-300 font-bold">{key.keyboardKey}</span>
                        </button>
                      );
                    }
                    return (
                      <button
                        key={key.name}
                        onClick={() => playInstrumentNote(key.freq, key.name)}
                        className={`w-8 sm:w-10 h-32 rounded-b-lg border-x border-b border-gray-300 transition-all cursor-pointer flex flex-col justify-end items-center pb-2 ${
                          isPressed
                            ? 'bg-pink-300 scale-[0.98]'
                            : isInSongScale
                            ? 'bg-amber-50 hover:bg-amber-100 text-gray-900 shadow-inner'
                            : 'bg-white hover:bg-gray-100 text-gray-900'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-gray-800">{key.arabicName}</span>
                        <span className="text-[9px] font-mono text-gray-400">[{key.keyboardKey}]</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB 3: 5-TRACK STUDIO MIXER CONSOLE */}
      {activeTab === 'mixer' && (
        <div className="space-y-6">
          
          <div className="rounded-3xl bg-[#151028] border-2 border-purple-500/40 p-5 md:p-7 shadow-2xl space-y-6 text-right">
            
            {/* Mixer Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-cyan-300 border border-cyan-500/30">
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    خلاط المسارات الاحترافي (5-Stem Studio Console)
                  </h3>
                  <p className="text-xs text-gray-400">
                    تحكم منفصل في مستوى كل مسار، التوزيع الفراغي (Pan)، الكتم (Mute)، والاستماع الفردي (Solo).
                  </p>
                </div>
              </div>

              {/* Quick Balance Presets */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setVocalVol(0.0);
                    setInstVol(0.65);
                    setBassVol(0.50);
                    setIsMelodyGuideEnabled(false);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
                >
                  كاريوكي صافي
                </button>
                <button
                  onClick={() => {
                    setVocalVol(0.70);
                    setInstVol(0.0);
                    setBassVol(0.0);
                    setIsMelodyGuideEnabled(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
                >
                  فوكال فقط (Acapella)
                </button>
                <button
                  onClick={() => {
                    setVocalVol(0.55);
                    setInstVol(0.55);
                    setBassVol(0.40);
                    setIsMelodyGuideEnabled(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
                >
                  توازن كامل (Full Mix)
                </button>
              </div>
            </div>

            {/* 5 Channel Strips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Strip 1: Vocals / Lead Melody */}
              <div className="p-4 rounded-2xl bg-black/40 border-2 border-pink-500/50 space-y-3 shadow-lg shadow-pink-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-pink-300 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-pink-400" />
                    <span>مسار الغناء فقط (Acapella)</span>
                  </span>
                  <span className="text-[10px] font-mono text-pink-300">
                    {Math.round(vocalVol * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <button
                    onClick={() => setVocalMute(!vocalMute)}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      vocalMute ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => {
                      setVocalSolo(!vocalSolo);
                      if (!vocalSolo) {
                        setIsMelodyGuideEnabled(true);
                        setVocalVol(0.85);
                      }
                    }}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      vocalSolo ? 'bg-amber-500 text-black shadow-md' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Solo 
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>مستوى صوت الغناء</span>
                    <span className="font-mono">{vocalVol.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={vocalMute ? 0 : vocalVol}
                    onChange={(e) => setVocalVol(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>التوزيع الفراغي (Pan)</span>
                    <span className="font-mono">{vocalPan === 0 ? 'C' : vocalPan < 0 ? `L${Math.abs(Math.round(vocalPan * 100))}` : `R${Math.round(vocalPan * 100)}`}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.1}
                    value={vocalPan}
                    onChange={(e) => setVocalPan(Number(e.target.value))}
                    className="w-full accent-pink-400"
                  />
                </div>

                {/* Direct Vocal Stem Download */}
                {stemsResult && (
                  <div className="pt-2 border-t border-pink-500/20">
                    <a
                      href={stemsResult.vocalsUrl}
                      download={`صوت_الغناء_الصافي_${fileName}.wav`}
                      className="w-full py-1.5 rounded-xl bg-pink-600/30 hover:bg-pink-600 text-pink-200 hover:text-white text-[10px] font-bold flex items-center justify-center gap-1.5 border border-pink-500/40 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تنزيل الغناء الصافي (WAV)</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Strip 2: Instrumental / Harmony */}
              <div className="p-4 rounded-2xl bg-black/40 border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-purple-300 flex items-center gap-1.5">
                    <Music className="w-4 h-4" />
                    <span>الآلات والهارموني</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-300">
                    {Math.round(instVol * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <button
                    onClick={() => setInstMute(!instMute)}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      instMute ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => setInstSolo(!instSolo)}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      instSolo ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Solo
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>مستوى الصوت</span>
                    <span className="font-mono">{instVol.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={instMute ? 0 : instVol}
                    onChange={(e) => setInstVol(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>التوزيع الفراغي (Pan)</span>
                    <span className="font-mono">{instPan === 0 ? 'C' : instPan < 0 ? `L${Math.abs(Math.round(instPan * 100))}` : `R${Math.round(instPan * 100)}`}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.1}
                    value={instPan}
                    onChange={(e) => setInstPan(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>
              </div>

              {/* Strip 3: Bass & Drums */}
              <div className="p-4 rounded-2xl bg-black/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                    <Radio className="w-4 h-4" />
                    <span>البيز والإيقاع</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300">
                    {Math.round(bassVol * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 text-[10px]">
                  <button
                    onClick={() => setBassMute(!bassMute)}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      bassMute ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Mute
                  </button>
                  <button
                    onClick={() => setBassSolo(!bassSolo)}
                    className={`flex-1 py-1 rounded-lg font-bold transition-colors ${
                      bassSolo ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    Solo
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>مستوى الصوت</span>
                    <span className="font-mono">{bassVol.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={1.5}
                    step={0.05}
                    value={bassMute ? 0 : bassVol}
                    onChange={(e) => setBassVol(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <span>التوزيع الفراغي (Pan)</span>
                    <span className="font-mono">{bassPan === 0 ? 'C' : bassPan < 0 ? `L${Math.abs(Math.round(bassPan * 100))}` : `R${Math.round(bassPan * 100)}`}</span>
                  </div>
                  <input
                    type="range"
                    min={-1}
                    max={1}
                    step={0.1}
                    value={bassPan}
                    onChange={(e) => setBassPan(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>

              {/* Strip 4: Master Output & Playback */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4" />
                    <span>الماستر العام (Master)</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    0.0 dB
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    onClick={isPlaying ? pausePlayback : startPlayback}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'إيقاف مؤقت' : 'تشغيل الاستوديو'}</span>
                  </button>
                </div>

                {stemsResult && (
                  <div className="space-y-2 pt-2">
                    <a
                      href={stemsResult.instrumentalUrl}
                      download={`لحن_كاريوكي_${fileName}.wav`}
                      className="w-full py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-pink-400" />
                      <span>تنزيل اللحن (WAV)</span>
                    </a>
                  </div>
                )}
              </div>

            </div>

            {/* Advanced Vocal Purity & Deep Instrument Eliminator Panel */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1b1236] to-[#0f0920] border-2 border-pink-500/40 shadow-xl space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/40">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white flex items-center gap-2">
                      <span>منظومة عزل الصوت الفائقة وحذف اللحن والعوازف (Deep Vocal Purity & De-Bleed Shield)</span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono">
                        99.9% نقاء
                      </span>
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      تقنية ذكية لحذف البيانو، الجيتار، الإيقاعات، والمؤثرات الصوتية بالكامل وترك صوت الغناء البشري نقياً بدون أي موسيقى.
                    </p>
                  </div>
                </div>

                {/* Real-time Filter Active Badge */}
                <button
                  onClick={() => setIsPureVocalFilterEnabled(!isPureVocalFilterEnabled)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
                    isPureVocalFilterEnabled
                      ? 'bg-pink-600/30 text-pink-200 border-pink-500/50 shadow-sm'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isPureVocalFilterEnabled ? 'مرشح الفوكال النقي: مفعّل ' : 'تفعيل مرشح الفوكال'}</span>
                </button>
              </div>

              {/* Mode Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => {
                    setIsolationMode('ultra_clean');
                    setPianoGuitarSuppression(0.92);
                    setNoiseGateSensitivity(0.85);
                    setDeReverbStrength(0.75);
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isolationMode === 'ultra_clean'
                      ? 'bg-pink-600/30 border-pink-500 text-white shadow-lg shadow-pink-600/20'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-pink-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>عزل فائق صافي (Ultra Acapella)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    إزالة العوازف والآلات مع الحفاظ على صفاء الصوت بدون أي تشويش.
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsolationMode('studio_warmth');
                    setPianoGuitarSuppression(0.82);
                    setNoiseGateSensitivity(0.70);
                    setDeReverbStrength(0.60);
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isolationMode === 'studio_warmth'
                      ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg shadow-purple-600/20'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-purple-300">
                    <Headphones className="w-3.5 h-3.5 text-cyan-300" />
                    <span>استوديو دافئ (Studio Warmth)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    عزل انسيابي ناعم مع الحفاظ على كامل تفاصيل ونبرة الصوت البشري.
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsolationMode('de_reverb');
                    setPianoGuitarSuppression(0.85);
                    setNoiseGateSensitivity(0.80);
                    setDeReverbStrength(0.85);
                  }}
                  className={`p-3 rounded-2xl border text-right transition-all cursor-pointer ${
                    isolationMode === 'de_reverb'
                      ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-lg shadow-cyan-600/20'
                      : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center gap-1.5 text-cyan-300">
                    <Radio className="w-3.5 h-3.5 text-emerald-300" />
                    <span>منظف الصدى (De-Reverb)</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    تنقية ارتداد الصدى والريفيرب ليصبح الصوت جافاً وواضحاً.
                  </div>
                </button>
              </div>

              {/* 3 DSP Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-bold"> عزل البيانو والجيتار:</span>
                    <span className="font-mono text-pink-400 font-bold">{Math.round(pianoGuitarSuppression * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={1.0}
                    step={0.01}
                    value={pianoGuitarSuppression}
                    onChange={(e) => setPianoGuitarSuppression(Number(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-bold"> بوابة كتم الفواصل الموسيقية:</span>
                    <span className="font-mono text-purple-400 font-bold">{Math.round(noiseGateSensitivity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={1.0}
                    step={0.01}
                    value={noiseGateSensitivity}
                    onChange={(e) => setNoiseGateSensitivity(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-bold"> تنظيف الصدى والريفيرب:</span>
                    <span className="font-mono text-cyan-400 font-bold">{Math.round(deReverbStrength * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={1.0}
                    step={0.01}
                    value={deReverbStrength}
                    onChange={(e) => setDeReverbStrength(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              {/* Re-process trigger if file is loaded */}
              {selectedFile && (
                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={handleReprocessVocalStem}
                    disabled={isProcessing}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] text-white text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                    <span>تطبيق المعايير وإعادة تصفية الفوكال الآن </span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: AI STEM SEPARATION & CUSTOM SCALE COMPOSER */}
      {activeTab === 'generator' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: Custom Scale Composer & Intelligent Song Recognizer */}
            <div className="rounded-3xl bg-[#151028] border-2 border-amber-500/40 p-5 md:p-7 shadow-2xl space-y-4 text-right">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Wand2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    مؤلف المقامات والتعرف الذكي على الألحان 
                  </h3>
                  <p className="text-xs text-gray-400">
                    ضع كلماتك: إذا كانت شارة معروفة سيتعرف عليها البرنامج فوراً ليعطيك اللحن الأصلي الصحيح، وإذا كانت جديدة يمكنك اختيار المقام والآلة والنمط لصنع لحنك الخاص!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* Title & Lyrics Inputs */}
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">عنوان الأغنية أو الشارة:</label>
                  <input
                    type="text"
                    value={composerTitle}
                    onChange={(e) => {
                      setComposerTitle(e.target.value);
                      setForceCustomComposition(false);
                    }}
                    placeholder="مثال: رسمت بيتاً صغيراً، القناص، عهد الأصدقاء، أو أي عنوان مخصص"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">الكلمات (اكتب أو الصق كلمات الأغنية هنا):</label>
                  <textarea
                    rows={4}
                    value={composerLyrics}
                    onChange={(e) => {
                      setComposerLyrics(e.target.value);
                      setForceCustomComposition(false);
                    }}
                    placeholder="الصق أو اكتب كلمات الأغنية هنا...&#10;السطر الأول&#10;السطر الثاني&#10;السطر الثالث"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-tajawal"
                  />
                </div>

                {/* ONLINE SEARCH TRIGGER BAR */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePerformOnlineSongRecognition}
                    disabled={isSearchingSongOnline || (!composerLyrics.trim() && !composerTitle.trim())}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/40"
                  >
                    {isSearchingSongOnline ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>جاري استعلام محركات البحث الموسيقية والذكاء الاصطناعي... </span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span>التعرف الذكي والموسيقي عبر محركات البحث (Google Search & AI) </span>
                      </>
                    )}
                  </button>

                  {onlineRecognizedSong && (
                    <button
                      type="button"
                      onClick={() => setOnlineRecognizedSong(null)}
                      className="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                      title="مسح نتيجة البحث والعودة"
                    >
                      إعادة البحث 
                    </button>
                  )}
                </div>

                {/* Error Banner if any */}
                {onlineRecognitionError && (
                  <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{onlineRecognitionError}</span>
                    </div>
                    <button
                      onClick={() => setOnlineRecognitionError(null)}
                      className="text-red-300 hover:text-white text-xs font-bold cursor-pointer"
                    >
                      
                    </button>
                  </div>
                )}

                {/* 1. ONLINE RECOGNITION RESULT CARD (HIGH PRIORITY VERIFIED RESULT) */}
                {onlineRecognizedSong && !forceCustomComposition ? (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1b1238] via-[#24134a] to-[#120e28] border-2 border-cyan-400/70 space-y-3.5 shadow-2xl animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-cyan-500/20 pb-2.5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-black">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>
                            {onlineRecognizedSong.identified
                              ? 'تم التعرف والتوثيق عبر محركات البحث الموسيقية! '
                              : 'تأليف وتوليد مقام ذكي للكلمات الجديدة '}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white mt-1 flex flex-wrap items-center gap-2">
                          <span className="text-xl"></span>
                          <span className="text-cyan-200 font-black">{onlineRecognizedSong.title}</span>
                          <span className="text-xs text-purple-200 font-bold">
                            ({onlineRecognizedSong.artist})
                          </span>
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 self-start">
                        <span className="px-2.5 py-1 rounded-xl bg-purple-500/30 text-purple-200 text-xs font-mono font-bold border border-purple-500/40">
                          {onlineRecognizedSong.maqam}
                        </span>
                        <span className="px-2 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold border border-cyan-500/30">
                          {onlineRecognizedSong.bpm} BPM
                        </span>
                      </div>
                    </div>

                    {/* Metadata Badges Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px]">الملحن:</span>
                        <span className="text-amber-300 font-bold truncate block">{onlineRecognizedSong.composer || 'غير محدد'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px]">السلم / المفتاح:</span>
                        <span className="text-pink-300 font-bold truncate block">{onlineRecognizedSong.keySignature || 'D Minor'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px]">نوع الإيقاع:</span>
                        <span className="text-emerald-300 font-bold truncate block">{onlineRecognizedSong.rhythmName || 'مقسوم'}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-black/40 border border-white/5">
                        <span className="text-gray-400 block text-[10px]">الآلة الموصى بها:</span>
                        <span className="text-cyan-300 font-bold truncate block">
                          {onlineRecognizedSong.recommendedInstrument === 'oud' ? ' عود وقانون' :
                           onlineRecognizedSong.recommendedInstrument === 'grand-piano' ? ' بيانو كلاسيكي' :
                           onlineRecognizedSong.recommendedInstrument === 'strings' ? ' وتريات' :
                           onlineRecognizedSong.recommendedInstrument === 'flute' ? ' ناي وفلوت' :
                           onlineRecognizedSong.recommendedInstrument === 'synth' ? ' سنث أنمي' :
                           onlineRecognizedSong.recommendedInstrument === 'horns' ? ' براس بطولي' : ' صندوق موسيقى'}
                        </span>
                      </div>
                    </div>

                    {/* Description & Performance Tips */}
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1.5 text-xs text-gray-300 leading-relaxed">
                      <p className="text-cyan-100 font-medium">
                        {onlineRecognizedSong.explanation}
                      </p>
                      {onlineRecognizedSong.musicalInsights?.vocalPerformanceTips && (
                        <p className="text-[11px] text-amber-200/90 pt-1 border-t border-white/5">
                           <span className="font-bold">نصيحة الأداء الصوتي:</span> {onlineRecognizedSong.musicalInsights.vocalPerformanceTips}
                        </p>
                      )}
                    </div>

                    {/* External Grounding Links */}
                    {onlineRecognizedSong.externalSearchLinks && onlineRecognizedSong.externalSearchLinks.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] text-gray-400 font-bold block">روابط التوثيق والبحث الخارجي:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {onlineRecognizedSong.externalSearchLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/15 text-[11px] text-cyan-300 border border-white/10 transition-colors"
                            >
                              <span>{link.label}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-cyan-500/20">
                      <button
                        onClick={() => handleApplyOnlineRecognizedSong(onlineRecognizedSong)}
                        className="flex-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 cursor-pointer transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>تطبيق اللحن والمقام وعزف الأغنية في الاستوديو فوراً </span>
                      </button>

                      <button
                        onClick={() => {
                          setForceCustomComposition(true);
                          if (onlineRecognizedSong.maqamId) setComposerMaqam(onlineRecognizedSong.maqamId);
                          if (onlineRecognizedSong.recommendedInstrument) setComposerInstrument(onlineRecognizedSong.recommendedInstrument);
                          if (onlineRecognizedSong.recommendedStyle) setComposerStyle(onlineRecognizedSong.recommendedStyle);
                          if (onlineRecognizedSong.bpm) setComposerBpm(onlineRecognizedSong.bpm);
                        }}
                        className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>تخصيص اللحن والآلات </span>
                      </button>
                    </div>
                  </div>
                ) : detectedSongInfo.isKnown && !forceCustomComposition ? (
                  /* REALTIME DETECTION CARD: IF KNOWN SONG DETECTED */
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/80 via-purple-950/80 to-amber-950/40 border-2 border-pink-500/80 space-y-3 shadow-xl animate-fade-in">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[11px] font-black">
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>تم التعرف التلقائي على الشارة بنجاح! </span>
                        </div>
                        <h4 className="text-base font-black text-white mt-1 flex items-center gap-2">
                          <span>{detectedSongInfo.matchedSong?.icon || ''}</span>
                          <span>{detectedSongInfo.matchedSong?.title || detectedSongInfo.matchedPreset?.title}</span>
                          <span className="text-xs text-pink-300 font-normal">
                            ({detectedSongInfo.matchedSong?.artistOrAnime || detectedSongInfo.matchedPreset?.subtitle})
                          </span>
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/30 text-purple-200 text-xs font-mono font-bold border border-purple-500/30">
                        {detectedSongInfo.recommendedMaqam}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 leading-relaxed">
                      {detectedSongInfo.matchReason}. هذه الشارة معروفة سلفاً في مكتبتنا الموسيقية بنوتاتها وسولفيجها الأصلي الصحيح!
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <button
                        onClick={() => handleApplyDetectedOriginalSong(detectedSongInfo)}
                        className="flex-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:scale-[1.02] active:scale-95 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-pink-600/30 cursor-pointer transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        <span>تشغيل اللحن والنوتات الأصلية الصحيحة فوراً </span>
                      </button>

                      <button
                        onClick={() => handleEnableCustomCompositionForDetected(detectedSongInfo)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold flex items-center justify-center gap-1.5 border border-white/10 cursor-pointer transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>تخصيص اللحن والآلة والمقام </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* CUSTOM COMPOSER CONTROLS: FOR NEW SONGS OR CUSTOM OVERRIDES */
                  <div className="space-y-3 pt-1 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>تخصيص اللحن والمقام والآلة الموسيقية للكلمات:</span>
                      </span>
                      {forceCustomComposition && detectedSongInfo.isKnown && (
                        <button
                          onClick={() => setForceCustomComposition(false)}
                          className="text-[11px] text-pink-400 hover:text-pink-300 underline font-bold"
                        >
                          الرجوع للحن الأصلي التلقائي ↩
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Musical Maqam Selection */}
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">المقام الموسيقي (Scale):</label>
                        <select
                          value={composerMaqam}
                          onChange={(e) => setComposerMaqam(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          {MAQAM_SCALES.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.arabicName}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Lead Musical Instrument */}
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">الآلة الموسيقية الرئيسية:</label>
                        <select
                          value={composerInstrument}
                          onChange={(e) => setComposerInstrument(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="grand-piano"> بيانو كبير كلاسيكي (Grand Piano)</option>
                          <option value="oud"> عود وقانون شرقي أصيل (Oud & Qanun)</option>
                          <option value="strings"> وتريات وتشيلو أوركسترالي (Strings)</option>
                          <option value="flute"> ناي وفلوت دافئ (Nay & Flute)</option>
                          <option value="synth"> سنث ليد أنمي إلكتروني (Synth Lead)</option>
                          <option value="musicbox"> صندوق موسيقى وأجراس (Music Box)</option>
                          <option value="horns"> أبواق وبراس بطولي (Heroic Brass)</option>
                        </select>
                      </div>

                      {/* Arrangement Style */}
                      <div>
                        <label className="text-xs font-bold text-gray-300 block mb-1">التوزيع الموسيقي والهارموني:</label>
                        <select
                          value={composerStyle}
                          onChange={(e) => setComposerStyle(e.target.value as ArrangementStyle)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option value="oriental-maqam"> توزيع شرقي أصيل (عود وإيقاع)</option>
                          <option value="rock-anime"> روك وحماسي سبيستون (Rock Anime)</option>
                          <option value="piano-ballad"> بالاد بيانو وأوتار هادئة (Piano Ballad)</option>
                          <option value="musicbox-harp"> صندوق موسيقى وهارب حالم (Musicbox)</option>
                          <option value="mystery-jazz"> جاز وغموض كونان (Mystery Jazz)</option>
                          <option value="nostalgic-guitar"> جيتار كلاسيكي دافئ (Guitar)</option>
                          <option value="heroic-brass"> براس بطولي وشجاعة (Heroic Brass)</option>
                        </select>
                      </div>

                      {/* BPM Speed Slider */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1">
                          <span>السرعة الإيقاعية (BPM):</span>
                          <span className="font-mono text-amber-300 font-black">{composerBpm} BPM</span>
                        </div>
                        <input
                          type="range"
                          min={60}
                          max={160}
                          step={2}
                          value={composerBpm}
                          onChange={(e) => setComposerBpm(Number(e.target.value))}
                          className="w-full accent-amber-500 mt-1"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateCustomSongAndPlay}
                      disabled={isGeneratingCustomSong}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-pink-600 hover:scale-[1.02] active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-600/30 cursor-pointer transition-all disabled:opacity-50 mt-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>تأليف اللحن المخصص والبدء بالغناء فوراً </span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Upload MP3 / WAV for Stem Separation */}
            <div className="rounded-3xl bg-[#151028] border-2 border-purple-500/40 p-5 md:p-7 shadow-2xl space-y-4 text-right flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                  <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <span>عزل الصوت وحذف اللحن والعوازف </span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/40">
                        DSP Studio 99.9%
                      </span>
                    </h3>
                    <p className="text-xs text-gray-400">
                      ارفع أي ملف لعزل صوت المغني وحذف البيانو، الجيتار، والإيقاعات والمؤثرات بالكامل.
                    </p>
                  </div>
                </div>

                {/* Quota & VIP Indicator */}
                <div className="p-3 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-400" />
                    {vipStatus.isOwner ? (
                      <span className="font-bold text-amber-300"> حساب مالك المنصة: وصول غير محدود </span>
                    ) : vipStatus.isVip ? (
                      <span className="font-bold text-amber-300"> عضوية VIP الذهبية: عزل غير محدود </span>
                    ) : (
                      <span className="text-gray-300">
                        الرصيد المتبقي: <span className="font-mono font-bold text-amber-400">{vipStatus.remaining}</span> من أصل {vipStatus.totalAvailable} عملية مجانية
                      </span>
                    )}
                  </div>

                  {!vipStatus.isOwner && !vipStatus.isVip && (
                    <button
                      type="button"
                      onClick={() => setShowVipModal(true)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-black font-bold text-[11px] border border-amber-500/40 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>ترقية الباقة ($5 / $10)</span>
                    </button>
                  )}
                </div>

                {/* Mode selection before upload */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-300">نمط المعالجة وعزل الآلات:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setIsolationMode('ultra_clean')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                        isolationMode === 'ultra_clean'
                          ? 'bg-pink-600/30 border-pink-500 text-pink-200'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      عزل فائق 99.9% 
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsolationMode('studio_warmth')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                        isolationMode === 'studio_warmth'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      استوديو دافئ 
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsolationMode('de_reverb')}
                      className={`py-2 px-2.5 rounded-xl text-[11px] font-bold transition-all border text-center ${
                        isolationMode === 'de_reverb'
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                          : 'bg-black/30 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      حذف الصدى 
                    </button>
                  </div>
                </div>

                {/* Upload Box or Locked Quota Card */}
                {!vipStatus.isOwner && !vipStatus.isVip && vipStatus.remaining <= 0 ? (
                  <div
                    onClick={() => setShowVipModal(true)}
                    className="p-8 rounded-2xl bg-gradient-to-b from-rose-950/40 via-[#151028] to-black/60 border-2 border-dashed border-rose-500/50 hover:border-amber-400 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer text-center group shadow-xl"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-rose-500/20 group-hover:bg-amber-500/20 text-rose-400 group-hover:text-amber-300 flex items-center justify-center transition-colors">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-base font-black text-white group-hover:text-amber-300 transition-colors">
                         استنفدت جميع المحاولات المجانية (0 / 20)
                      </div>
                      <p className="text-xs text-gray-300 max-w-md mx-auto leading-relaxed">
                        انتهى رصيدك المجاني المتاح. يرجى الدفع للترقية ($5 أو $10 VIP) للاستمرار في عزل مسارات الصوت وبجودة استوديو احترافية نقية بدون حدود!
                      </p>
                    </div>
                    <button
                      type="button"
                      className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform"
                    >
                      <Crown className="w-4 h-4 fill-black" />
                      <span>ترقية الباقة والدفع لفتح عزل الصوت بجودة فائقة ($5 / $10)</span>
                    </button>
                  </div>
                ) : (
                  <label className="p-7 rounded-2xl bg-black/40 border-2 border-dashed border-purple-500/40 hover:border-pink-500 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer text-center group">
                    <div className="p-3 rounded-2xl bg-purple-600/20 group-hover:bg-pink-600/30 text-purple-300 group-hover:text-pink-300 transition-colors">
                      <FileAudio className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-pink-300">
                        اضغط لاختيار ملف صوتي أو اسحبه هنا
                      </div>
                      <div className="text-xs text-gray-400 mt-1">يدعم MP3, WAV, M4A حتى 25 ميجابايت</div>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {isProcessing && separationProgress && (
                <div className="p-4 rounded-2xl bg-black/50 border border-pink-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-300">
                    <span>{separationProgress.stageName}</span>
                    <span>{separationProgress.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                      style={{ width: `${separationProgress.progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{separationProgress.detail}</div>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* EXPANDABLE CUSTOM LYRICS & PRESETS MODAL */}
      {isCustomLyricsOpen && (
        <div className="p-5 md:p-6 rounded-3xl bg-[#19142E] border-2 border-pink-500/60 shadow-2xl space-y-5 animate-fade-in text-right">
          
          {/* Tabs inside modal */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setLyricsModalTab('suggested')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
                  lyricsModalTab === 'suggested'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30'
                    : 'bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <span>شارات وأغاني مقترحة جاهزة </span>
              </button>

              <button
                onClick={() => setLyricsModalTab('composer')}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
                  lyricsModalTab === 'composer'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>تأليف لحن مخصص </span>
                </span>
              </button>

              <button
                onClick={handleInitTapSync}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
                  lyricsModalTab === 'tapsync'
                    ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-lg shadow-amber-500/30'
                    : 'bg-white/5 text-gray-300 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  <span>محرر التوقيت اللحظي (Tap-to-Sync) </span>
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportLrcFile}
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 hover:bg-purple-900/80 text-purple-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-pink-400" />
                <span>تصدير LRC</span>
              </button>

              <button
                onClick={() => setIsCustomLyricsOpen(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                 إغلاق
              </button>
            </div>
          </div>

          {/* TAB 1: SUGGESTED SONGS */}
          {lyricsModalTab === 'suggested' && (
            <div className="space-y-4">
              {lyricsNotice && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-xs font-bold text-emerald-200 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>{lyricsNotice}</span>
                </div>
              )}

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                {['الكل', 'إيروكا وسبيستون', 'حماسي وشجاعة', 'مشاعر ونوستالجيا', 'صداقة وأمل', 'غموض ومغامرة'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setLyricsCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-xl whitespace-nowrap font-bold cursor-pointer transition-colors ${
                      lyricsCategoryFilter === cat
                        ? 'bg-pink-600 text-white'
                        : 'bg-black/40 text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Songs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {SUGGESTED_LYRICS_LIBRARY
                  .filter(s => lyricsCategoryFilter === 'الكل' || s.category.includes(lyricsCategoryFilter))
                  .map(song => (
                    <div
                      key={song.id}
                      onClick={() => handleApplySuggestedSong(song)}
                      className="p-3.5 rounded-2xl bg-black/40 hover:bg-pink-950/40 border border-white/10 hover:border-pink-500/60 transition-all cursor-pointer flex flex-col justify-between gap-2 text-right group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-black text-white group-hover:text-pink-300 transition-colors">
                            {song.icon} {song.title}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{song.artistOrAnime}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-lg bg-white/10 text-gray-300 font-mono">
                          {song.recommendedMaqam}
                        </span>
                      </div>

                      <div className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
                        {song.lyricsText.split('\n').slice(0, 2).join(' - ')}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-pink-400 pt-1 border-t border-white/5">
                        <span>انقر لتشغيل اللحن والكلمات</span>
                        <span>{song.category}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: COMPOSER */}
          {lyricsModalTab === 'composer' && (
            <div className="space-y-4 text-right">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">عنوان الأغنية أو الشارة:</label>
                <input
                  type="text"
                  value={composerTitle}
                  onChange={(e) => {
                    setComposerTitle(e.target.value);
                    setForceCustomComposition(false);
                  }}
                  placeholder="عنوان الشارة أو الأغنية"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">الكلمات (اكتب أو الصق الكلمات هنا):</label>
                <textarea
                  rows={4}
                  value={composerLyrics}
                  onChange={(e) => {
                    setComposerLyrics(e.target.value);
                    setForceCustomComposition(false);
                  }}
                  placeholder="اكتب كلمات الأغنية هنا..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white font-tajawal resize-none"
                />
              </div>

              {/* ONLINE SEARCH TRIGGER BAR */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handlePerformOnlineSongRecognition}
                  disabled={isSearchingSongOnline || (!composerLyrics.trim() && !composerTitle.trim())}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 active:scale-[0.99] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/40"
                >
                  {isSearchingSongOnline ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>جاري البحث عبر محركات البحث والمصادر الموسيقية... </span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                      <span>التعرف الذكي والموسيقي عبر محركات البحث (Google Search & AI) </span>
                    </>
                  )}
                </button>

                {onlineRecognizedSong && (
                  <button
                    type="button"
                    onClick={() => setOnlineRecognizedSong(null)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold border border-white/10 transition-colors cursor-pointer"
                  >
                    إعادة 
                  </button>
                )}
              </div>

              {/* Error Banner */}
              {onlineRecognitionError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{onlineRecognitionError}</span>
                  </div>
                  <button onClick={() => setOnlineRecognitionError(null)} className="text-red-300 hover:text-white text-xs"></button>
                </div>
              )}

              {/* 1. ONLINE RECOGNITION CARD */}
              {onlineRecognizedSong && !forceCustomComposition ? (
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#1b1238] via-[#24134a] to-[#120e28] border-2 border-cyan-400/70 space-y-2.5 shadow-xl">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-black">
                        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
                        <span>{onlineRecognizedSong.identified ? 'تم التوثيق والتعرف عبر محركات البحث! ' : 'تأليف مقام ذكي '}</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1">
                         {onlineRecognizedSong.title} <span className="text-xs text-purple-200 font-normal">({onlineRecognizedSong.artist})</span>
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/30 text-purple-200 text-xs font-mono font-bold">
                      {onlineRecognizedSong.maqam}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-1.5 rounded-lg bg-black/40 text-[11px]">
                      <span className="text-gray-400 block text-[9px]">الملحن:</span>
                      <span className="text-amber-300 font-bold">{onlineRecognizedSong.composer || 'غير محدد'}</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/40 text-[11px]">
                      <span className="text-gray-400 block text-[9px]">الإيقاع:</span>
                      <span className="text-emerald-300 font-bold">{onlineRecognizedSong.bpm} BPM • {onlineRecognizedSong.rhythmName}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-300">
                    {onlineRecognizedSong.explanation}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApplyOnlineRecognizedSong(onlineRecognizedSong)}
                      className="flex-1 w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:scale-[1.01] active:scale-95 text-white font-black text-xs cursor-pointer shadow-lg"
                    >
                      تطبيق اللحن والمقام الأصلي وعزف الأغنية فوراً 
                    </button>
                    <button
                      onClick={() => {
                        setForceCustomComposition(true);
                        if (onlineRecognizedSong.maqamId) setComposerMaqam(onlineRecognizedSong.maqamId);
                        if (onlineRecognizedSong.recommendedInstrument) setComposerInstrument(onlineRecognizedSong.recommendedInstrument);
                        if (onlineRecognizedSong.recommendedStyle) setComposerStyle(onlineRecognizedSong.recommendedStyle);
                        if (onlineRecognizedSong.bpm) setComposerBpm(onlineRecognizedSong.bpm);
                      }}
                      className="w-full sm:w-auto px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold border border-white/10 cursor-pointer"
                    >
                      تخصيص اللحن والآلات 
                    </button>
                  </div>
                </div>
              ) : detectedSongInfo.isKnown && !forceCustomComposition ? (
                /* REALTIME DETECTION: IF KNOWN */
                <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-950/80 via-purple-950/80 to-amber-950/40 border-2 border-pink-500/80 space-y-3 shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[11px] font-black">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                        <span>تم التعرف التلقائي على الشارة! </span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1">
                        {detectedSongInfo.matchedSong?.icon || ''} {detectedSongInfo.matchedSong?.title || detectedSongInfo.matchedPreset?.title}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg bg-purple-500/30 text-purple-200 text-xs font-mono">
                      {detectedSongInfo.recommendedMaqam}
                    </span>
                  </div>

                  <p className="text-xs text-gray-300">
                    {detectedSongInfo.matchReason}. هل تود تشغيل اللحن الأصلي الصحيح فوراً أم تأليف وتوزيع مخصص؟
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <button
                      onClick={() => handleApplyDetectedOriginalSong(detectedSongInfo)}
                      className="flex-1 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] text-white font-black text-xs cursor-pointer shadow-lg"
                    >
                      تشغيل اللحن والنوتات الأصلية الصحيحة 
                    </button>
                    <button
                      onClick={() => handleEnableCustomCompositionForDetected(detectedSongInfo)}
                      className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-bold border border-white/10 cursor-pointer"
                    >
                      تخصيص اللحن والآلة والمقام 
                    </button>
                  </div>
                </div>
              ) : (
                /* CUSTOM SELECTION CONTROLS */
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300">
                      تأليف وتوزيع مخصص للكلمات:
                    </span>
                    {forceCustomComposition && detectedSongInfo.isKnown && (
                      <button
                        onClick={() => setForceCustomComposition(false)}
                        className="text-[11px] text-pink-400 hover:text-pink-300 underline font-bold"
                      >
                        الرجوع للأصلي ↩
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">المقام الموسيقي:</label>
                      <select
                        value={composerMaqam}
                        onChange={(e) => setComposerMaqam(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        {MAQAM_SCALES.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.arabicName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">الآلة الموسيقية:</label>
                      <select
                        value={composerInstrument}
                        onChange={(e) => setComposerInstrument(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        <option value="grand-piano"> بيانو كبير (Piano)</option>
                        <option value="oud"> عود وقانون شرقي (Oud)</option>
                        <option value="strings"> وتريات وتشيلو (Strings)</option>
                        <option value="flute"> ناي وفلوت دافئ (Flute)</option>
                        <option value="synth"> سنث أنمي (Synth Lead)</option>
                        <option value="musicbox"> صندوق موسيقى (Music Box)</option>
                        <option value="horns"> أبواق وبراس (Brass)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 block mb-1">التوزيع الموسيقي:</label>
                      <select
                        value={composerStyle}
                        onChange={(e) => setComposerStyle(e.target.value as ArrangementStyle)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white cursor-pointer"
                      >
                        <option value="oriental-maqam"> توزيع شرقي أصيل</option>
                        <option value="rock-anime"> روك وحماسي سبيستون</option>
                        <option value="piano-ballad"> بالاد بيانو وأوتار هادئة</option>
                        <option value="musicbox-harp"> صندوق موسيقى وهارب</option>
                        <option value="mystery-jazz"> جاز وغموض كونان</option>
                        <option value="nostalgic-guitar"> جيتار كلاسيكي دافئ</option>
                        <option value="heroic-brass"> براس بطولي وشجاعة</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-gray-300 mb-1">
                        <span>السرعة الإيقاعية:</span>
                        <span className="font-mono text-amber-300">{composerBpm} BPM</span>
                      </div>
                      <input
                        type="range"
                        min={60}
                        max={160}
                        step={2}
                        value={composerBpm}
                        onChange={(e) => setComposerBpm(Number(e.target.value))}
                        className="w-full accent-amber-500 mt-1"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateCustomSongAndPlay}
                    disabled={isGeneratingCustomSong}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs sm:text-sm cursor-pointer shadow-lg hover:scale-[1.01] transition-all"
                  >
                    تأليف اللحن المخصص والبدء فوراً 
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TAP TO SYNC */}
          {lyricsModalTab === 'tapsync' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/50 border border-amber-500/40 text-center space-y-3">
                <div className="text-xs text-gray-300">
                  استمع للحن الموسيقي واضغط الزر أدناه عند بداية غناء كل سطر لمزامنته لحظياً بدقة!
                </div>

                <div className="text-lg font-black text-amber-300 py-2">
                  {tapSyncLines[tapSyncCurrentIndex]?.text || 'تمت مزامنة جميع الأسطر! '}
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleTapCurrentLine}
                    disabled={tapSyncCurrentIndex >= tapSyncLines.length}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-600 text-white font-black text-sm shadow-xl active:scale-95 cursor-pointer disabled:opacity-40"
                  >
                    اضغط هنا الآن  (مزامنة السطر {tapSyncCurrentIndex + 1})
                  </button>

                  <button
                    onClick={handleApplyTapSyncLyrics}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                  >
                    حفظ وتطبيق الكلمات
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* MODAL: CHOOSE MUSICAL INSTRUMENT WHEN CLICKING A SONG */}
      {showInstrumentModal && (pendingSongPreset || currentPreset) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#16112C] border-2 border-purple-500/60 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 text-2xl">
                  {pendingSongPreset?.icon || currentPreset?.icon || ''}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    اختر الآلة الموسيقية لعزف شارة "{pendingSongPreset?.title || currentPreset?.title}"
                  </h3>
                  <p className="text-xs text-purple-200/80 mt-0.5">
                    اختر الآلة التي تفضل أن يُعزف بها لحن وموسيقى الأغنية بأصوات نقية وناعمة:
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowInstrumentModal(false)}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs cursor-pointer"
              >
                 إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto p-1">
              {INSTRUMENT_LIST.map((inst) => {
                const isSelected = selectedInstrument === inst.id;
                return (
                  <button
                    key={inst.id}
                    onClick={() => handleConfirmSongInstrument(inst.id)}
                    className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-pink-400 shadow-lg shadow-pink-500/20 scale-[1.02]'
                        : 'bg-[#1D1735] hover:bg-[#28204A] border-purple-500/30 hover:border-purple-400'
                    }`}
                  >
                    <span className="text-3xl p-2 rounded-xl bg-white/5">{inst.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-white">{inst.arabicName}</span>
                        {inst.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold border border-pink-500/30">
                            {inst.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {inst.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400 gap-3">
              <span className="text-purple-300/80">
                 لن يبدأ الصوت تلقائياً، يمكنك الضغط على زر التشغيل ◀ أو التسجيل  متى شئت.
              </span>
              <button
                onClick={() => handleConfirmSongInstrument(selectedInstrument)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 active:scale-95 text-white font-black text-xs shadow-lg shadow-pink-600/30 cursor-pointer"
              >
                تأكيد وبدء التجهيز 
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Toast */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500 text-xs font-bold text-red-200 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-white"></button>
        </div>
      )}

      {/* VIP Membership & Vocal Isolation Upgrade Modal */}
      <VipUpgradeModal
        isOpen={showVipModal}
        onClose={() => setShowVipModal(false)}
        onSuccess={() => {
          setVipStatus(getVipStatusInfo());
          setErrorMsg(null);
        }}
      />

    </div>
  );
};
