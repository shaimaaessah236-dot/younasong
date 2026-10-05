import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Music,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Mic,
  Sliders,
  Volume2,
  VolumeX,
  Flame,
  Layers,
  Wand2,
  Disc3,
  FileText,
  BookOpen,
  Headphones,
  Award,
  Zap,
  Globe,
  Radio,
  Share2,
  User,
  Users
} from 'lucide-react';
import {
  composeSongWithYounaStudio,
  generateSingingVoiceAudio,
  YounaSongComposition,
  SingingVoiceAudioResult
} from './geminiService';
import { useLanguage } from '../context/LanguageContext';

interface StudioYounaSongComposerProps {
  onNavigateToStudio?: (songTitle: string, lyrics: string) => void;
}

// Chord Note Frequencies for interactive chord playback
const CHORD_FREQUENCIES: Record<string, number[]> = {
  'Cm': [261.63, 311.13, 392.00],
  'C': [261.63, 329.63, 392.00],
  'Dm': [293.66, 349.23, 440.00],
  'D': [293.66, 369.99, 440.00],
  'Eb': [311.13, 392.00, 466.16],
  'Em': [329.63, 392.00, 493.88],
  'E': [329.63, 415.30, 493.88],
  'Fm': [349.23, 415.30, 523.25],
  'F': [349.23, 440.00, 523.25],
  'Gm': [392.00, 466.16, 587.33],
  'G': [392.00, 493.88, 587.33],
  'G7': [392.00, 493.88, 587.33, 698.46],
  'Ab': [415.30, 523.25, 622.25],
  'Am': [440.00, 523.25, 659.25],
  'Bb': [466.16, 587.33, 698.46],
  'Bdim': [493.88, 587.33, 698.46]
};

export const SunoSongComposerStudio: React.FC<StudioYounaSongComposerProps> = ({
  onNavigateToStudio
}) => {
  const { language, isRtl } = useLanguage();

  // Studio Mode: Simple vs Custom
  const [studioMode, setStudioMode] = useState<'simple' | 'custom'>('simple');

  // Song Target Language: Arabic or English
  const [songLanguage, setSongLanguage] = useState<'ar' | 'en'>('ar');

  // Form Fields
  const [topic, setTopic] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [musicalStyle, setMusicalStyle] = useState('شارة أنمي وسبيستون كلاسيكية ملهمة / أصوات بشرية ناصعة');
  const [vocalType, setVocalType] = useState('صوت أنثوي شجي نقي ودافئ');
  const [maqam, setMaqam] = useState('مقام نهاوند (C Minor)');
  const [bpm, setBpm] = useState<number>(108);
  const [mood, setMood] = useState('حماسي، وجداني، أمل ونوستالجيا');
  const [customLyrics, setCustomLyrics] = useState('');
  const [instrumentalOnly, setInstrumentalOnly] = useState(false);

  // Generation state
  const [isComposing, setIsComposing] = useState(false);
  const [composition, setComposition] = useState<YounaSongComposition | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [activeChordPlaying, setActiveChordPlaying] = useState<string | null>(null);

  // Real AI Vocal Audio State
  const [isLoadingSingingAudio, setIsLoadingSingingAudio] = useState(false);
  const [singingAudioResult, setSingingAudioResult] = useState<SingingVoiceAudioResult | null>(null);
  const [isPlayingVocalAudio, setIsPlayingVocalAudio] = useState(false);
  const [isPlayingMelodicSinging, setIsPlayingMelodicSinging] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  const [singingVoiceType, setSingingVoiceType] = useState<'female' | 'male' | 'choir' | 'acapella'>('female');
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const [playBackingMusic, setPlayBackingMusic] = useState<boolean>(true);

  // Audio Melody Synthesizer State (Web Audio API)
  const [isPlayingMelody, setIsPlayingMelody] = useState(false);
  const [melodyInstrument, setMelodyInstrument] = useState<'choir' | 'piano' | 'strings' | 'musicbox'>('choir');
  const [activeNoteIndex, setActiveNoteIndex] = useState<number>(-1);

  // Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vocalAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const singleLineAudioRef = useRef<HTMLAudioElement | null>(null);
  const melodyTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const singingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const backingMusicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const stopAllAudio = () => {
    stopMelody();
    stopVocalAudio();
    stopMelodicSinging();
    stopBackingChords();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const stopBackingChords = () => {
    if (backingMusicIntervalRef.current) {
      clearInterval(backingMusicIntervalRef.current);
      backingMusicIntervalRef.current = null;
    }
  };

  const stopVocalAudio = () => {
    if (vocalAudioElementRef.current) {
      vocalAudioElementRef.current.pause();
      vocalAudioElementRef.current.currentTime = 0;
    }
    if (singleLineAudioRef.current) {
      singleLineAudioRef.current.pause();
    }
    stopBackingChords();
    setIsPlayingVocalAudio(false);
    setCurrentLineIndex(-1);
  };

  const stopMelodicSinging = () => {
    singingTimeoutsRef.current.forEach(clearTimeout);
    singingTimeoutsRef.current = [];
    setIsPlayingMelodicSinging(false);
    setCurrentLineIndex(-1);
    setActiveNoteIndex(-1);
    stopBackingChords();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  // Preset Prompts for Inspiration
  const PRESET_IDEAS = [
    {
      title: 'أبطال الصداقة والفضاء',
      desc: 'شارة كلاسيكية ملهمة عن الوفاء والمغامرة بين المجرات والعودة للديار',
      lang: 'ar' as const,
      style: 'Spacetoon classic anime, heroic strings, warm acapella harmony',
      vocal: 'صوت بطولي حماسي مع كورس شبابي ملهم',
      maqam: 'مقام نهاوند (C Minor)',
      bpm: 112
    },
    {
      title: 'Wings of the Sky (English Theme)',
      desc: 'Inspiring nostalgic English anime soundtrack about chasing dreams across the galaxy',
      lang: 'en' as const,
      style: 'Epic English Anime Anthem, soaring strings, piano & choir',
      vocal: 'Heroic vocal with warm backing choir',
      maqam: 'C Minor (Nahawand)',
      bpm: 110
    },
    {
      title: 'أكابيلا حلم الطفولة النقي',
      desc: 'أصوات بشرية دافئة بدون موسيقى تحكي قصة الصبر والنجاح والذكريات',
      lang: 'ar' as const,
      style: 'Pure acapella human vocals only, no instruments, layered choir',
      vocal: 'صوت أنثوي نقي شجي ودافئ',
      maqam: 'مقام كورد (D Minor)',
      bpm: 96
    },
    {
      title: 'ملحمة التحدي والإصرار',
      desc: 'إيقاع بطولي حماسي للرياضة ومواجهة الصعاب وبلوغ القمة والانتصار',
      lang: 'ar' as const,
      style: 'Epic anime rock soundtrack, energetic drums, brass fanfares',
      vocal: 'صوت رجالي قوي وواثق',
      maqam: 'مقام عجم (C Major)',
      bpm: 128
    },
    {
      title: 'حنين الذكريات والقرية الدافئة',
      desc: 'ألحان هادئة شجية تعيد مشاعر الطفولة والأم والذكريات والشوق',
      lang: 'ar' as const,
      style: 'Nostalgic acoustic ballad, delicate piano, flute, warm harmony',
      vocal: 'دويتو دافئ شجي وهادئ',
      maqam: 'مقام نهاوند (C Minor)',
      bpm: 84
    }
  ];

  const handleApplyPreset = (p: typeof PRESET_IDEAS[0]) => {
    setTopic(p.desc);
    setSongTitle(p.title);
    setSongLanguage(p.lang);
    setMusicalStyle(p.style);
    setVocalType(p.vocal);
    setMaqam(p.maqam);
    setBpm(p.bpm);
  };

  // Submit Handler for Composing Song
  const handleCompose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim() && !customLyrics.trim()) return;

    setIsComposing(true);
    stopAllAudio();
    setSingingAudioResult(null);

    try {
      const res = await composeSongWithYounaStudio({
        topic: topic.trim() || (songLanguage === 'en' ? 'Heroic anime theme about hope' : 'شارة وأغنية ملهمة من وحي سبيستون'),
        title: songTitle.trim() || undefined,
        songLanguage,
        style: musicalStyle,
        vocalType,
        scale: maqam,
        bpm,
        mood,
        customLyrics: customLyrics.trim() || undefined,
        instrumentalOnly
      });

      if (res) {
        setComposition(res);
        loadSingingVoiceAudio(res.lyrics, singingVoiceType);
      }
    } catch (err) {
      console.error('Compose error:', err);
    } finally {
      setIsComposing(false);
    }
  };

  // Load Real AI Vocal Audio
  const loadSingingVoiceAudio = async (lyricsText: string, voice: 'female' | 'male' | 'choir' | 'acapella') => {
    if (!lyricsText) return;
    setIsLoadingSingingAudio(true);
    try {
      const voiceParam = voice === 'acapella' ? 'choir' : voice;
      const result = await generateSingingVoiceAudio(lyricsText, voiceParam);
      if (result && result.audioDataUrl) {
        setSingingAudioResult(result);
      }
    } catch (e) {
      console.warn('Vocal audio load notice:', e);
    } finally {
      setIsLoadingSingingAudio(false);
    }
  };

  // Web Audio Context Helper
  const getAudioContext = (): AudioContext => {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioCtxClass();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  };

  // Apply voice modulation (playback rate for male / female / choir)
  const applyVoiceModulation = (audio: HTMLAudioElement, voice: 'female' | 'male' | 'choir' | 'acapella') => {
    if (voice === 'male') {
      audio.playbackRate = 0.86;
    } else if (voice === 'choir' || voice === 'acapella') {
      audio.playbackRate = 0.95;
    } else {
      audio.playbackRate = 1.04;
    }
  };

  // Web Audio True Singing Synthesizer (Harmonics + Vowel Formants + Vibrato LFO)
  const playSingingVocalTone = (freq: number, duration: number = 0.8, voice: 'female' | 'male' | 'choir' | 'acapella' = singingVoiceType) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0, now);
      masterGain.connect(ctx.destination);

      // Vibrato LFO for singing warmth
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, now);
      lfoGain.gain.setValueAtTime(6, now);
      lfo.connect(lfoGain);
      lfo.start(now);
      lfo.stop(now + duration + 0.3);

      if (voice === 'choir' || voice === 'acapella') {
        const chordIntervals = [1.0, 1.2, 1.5];
        chordIntervals.forEach((interval, idx) => {
          const osc = ctx.createOscillator();
          const filter = ctx.createBiquadFilter();
          const gain = ctx.createGain();

          osc.type = idx === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq * interval, now);
          lfoGain.connect(osc.frequency);

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800 + idx * 250, now);
          filter.Q.setValueAtTime(3.5, now);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.4);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);

          osc.start(now);
          osc.stop(now + duration + 0.5);
        });

        masterGain.gain.linearRampToValueAtTime(0.3, now + 0.08);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.4);
      } else if (voice === 'male') {
        const maleFreq = freq * 0.5;
        const osc = ctx.createOscillator();
        const oscHarmonic = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        oscHarmonic.type = 'triangle';
        osc.frequency.setValueAtTime(maleFreq, now);
        oscHarmonic.frequency.setValueAtTime(maleFreq * 2, now);

        lfoGain.connect(osc.frequency);
        lfoGain.connect(oscHarmonic.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(520, now);
        filter.Q.setValueAtTime(2.0, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3);

        osc.connect(filter);
        oscHarmonic.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.25, now + 0.06);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3);

        osc.start(now);
        oscHarmonic.start(now);
        osc.stop(now + duration + 0.4);
        oscHarmonic.stop(now + duration + 0.4);
      } else {
        const osc = ctx.createOscillator();
        const oscOvertone = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = 'sine';
        oscOvertone.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        oscOvertone.frequency.setValueAtTime(freq * 1.5, now);

        lfoGain.connect(osc.frequency);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1100, now);
        filter.Q.setValueAtTime(3.2, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.25);

        osc.connect(filter);
        oscOvertone.connect(gain);
        filter.connect(gain);
        gain.connect(masterGain);

        masterGain.gain.setValueAtTime(0, now);
        masterGain.gain.linearRampToValueAtTime(0.28, now + 0.05);
        masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.25);

        osc.start(now);
        oscOvertone.start(now);
        osc.stop(now + duration + 0.35);
        oscOvertone.stop(now + duration + 0.35);
      }
    } catch (e) {
      // silent
    }
  };

  // Start Harmonic Backing Chords during Singing
  const startHarmonicBackingLoop = () => {
    if (!playBackingMusic || singingVoiceType === 'acapella') return;
    stopBackingChords();

    const chords = composition?.melodyGuide?.chords?.length
      ? composition.melodyGuide.chords
      : ['Cm', 'Fm', 'Bb', 'Eb', 'Ab', 'G7'];

    let chordStep = 0;
    playChord(chords[0]);

    backingMusicIntervalRef.current = setInterval(() => {
      chordStep = (chordStep + 1) % chords.length;
      playChord(chords[chordStep]);
    }, 2400);
  };

  // Interactive Chord Player
  const playChord = (chordName: string) => {
    try {
      const ctx = getAudioContext();
      const cleanChord = chordName.replace(/[^a-zA-Z0-9]/g, '');
      const freqs = CHORD_FREQUENCIES[cleanChord] || CHORD_FREQUENCIES['Cm'];
      const now = ctx.currentTime;
      setActiveChordPlaying(chordName);

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.3);
      });

      setTimeout(() => {
        setActiveChordPlaying((prev) => (prev === chordName ? null : prev));
      }, 1200);
    } catch (e) {
      // silent
    }
  };

  // Full Melodic Singing Engine (Sings lyrics note by note with harmony & karaoke tracking)
  const startFullMelodicSinging = () => {
    if (!composition) return;
    stopAllAudio();
    setIsPlayingMelodicSinging(true);

    const notes = composition.audioMelodySequence?.length
      ? composition.audioMelodySequence
      : [
          { note: 'C4', freq: 261.63, duration: 0.8 },
          { note: 'Eb4', freq: 311.13, duration: 0.8 },
          { note: 'G4', freq: 392.00, duration: 1.0 },
          { note: 'Ab4', freq: 415.30, duration: 0.8 },
          { note: 'F4', freq: 349.23, duration: 0.8 },
          { note: 'G4', freq: 392.00, duration: 1.2 }
        ];

    const lines = composition.lyrics
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('('));

    startHarmonicBackingLoop();

    let cumulativeTime = 0;
    const totalDuration = notes.reduce((sum, n) => sum + (n.duration || 0.8), 0);
    setAudioDuration(totalDuration);

    notes.forEach((noteItem, idx) => {
      const noteDuration = noteItem.duration || 0.8;
      const timeout = setTimeout(() => {
        setActiveNoteIndex(idx);
        setAudioCurrentTime(cumulativeTime);

        if (lines.length > 0) {
          const lineIdx = Math.min(lines.length - 1, Math.floor((idx / notes.length) * lines.length));
          setCurrentLineIndex(lineIdx);
        }

        playSingingVocalTone(noteItem.freq, noteDuration, singingVoiceType);

        if (idx === notes.length - 1) {
          const endTimeout = setTimeout(() => {
            stopMelodicSinging();
          }, noteDuration * 1000 + 400);
          singingTimeoutsRef.current.push(endTimeout);
        }
      }, cumulativeTime * 1000);

      singingTimeoutsRef.current.push(timeout);
      cumulativeTime += noteDuration;
    });

    if (typeof window !== 'undefined' && window.speechSynthesis && lines.length > 0) {
      try {
        window.speechSynthesis.cancel();
        const speechText = lines.filter((l) => !l.startsWith('[')).slice(0, 8).join('. ');
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = songLanguage === 'en' ? 'en-US' : 'ar-SA';
        utterance.rate = singingVoiceType === 'male' ? 0.88 : singingVoiceType === 'female' ? 1.05 : 0.95;
        utterance.pitch = singingVoiceType === 'male' ? 0.75 : singingVoiceType === 'female' ? 1.3 : 1.0;
        utterance.volume = 0.55;

        const voices = window.speechSynthesis.getVoices();
        const matchingVoice = voices.find((v) => {
          const langMatch = songLanguage === 'en' ? v.lang.startsWith('en') : v.lang.startsWith('ar');
          if (singingVoiceType === 'male') {
            return langMatch && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('tarik'));
          }
          if (singingVoiceType === 'female') {
            return langMatch && (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('laila') || v.name.toLowerCase().includes('samantha'));
          }
          return langMatch;
        });

        if (matchingVoice) {
          utterance.voice = matchingVoice;
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        // fallback
      }
    }
  };

  // Toggle Play / Pause Real Singing Audio or Melodic Vocalist
  const togglePlayVocalAudio = async () => {
    if (!composition) return;

    if (isPlayingVocalAudio || isPlayingMelodicSinging) {
      stopAllAudio();
      return;
    }

    stopMelody();

    if (singingAudioResult && singingAudioResult.audioDataUrl) {
      playVocalAudioTrack(singingAudioResult.audioDataUrl);
    } else {
      startFullMelodicSinging();
    }
  };

  const playVocalAudioTrack = (audioUrl: string) => {
    if (!vocalAudioElementRef.current) {
      vocalAudioElementRef.current = new Audio();
    }
    const audio = vocalAudioElementRef.current;
    audio.src = audioUrl;

    applyVoiceModulation(audio, singingVoiceType);

    audio.onplay = () => {
      setIsPlayingVocalAudio(true);
      startHarmonicBackingLoop();
    };

    audio.onended = () => {
      setIsPlayingVocalAudio(false);
      setCurrentLineIndex(-1);
      stopBackingChords();
    };

    audio.ontimeupdate = () => {
      setAudioCurrentTime(audio.currentTime);
      setAudioDuration(audio.duration || 0);

      if (singingAudioResult?.lineAudios?.length && audio.duration > 0) {
        const total = singingAudioResult.lineAudios.length;
        const index = Math.min(
          total - 1,
          Math.floor((audio.currentTime / audio.duration) * total)
        );
        setCurrentLineIndex(index);
      }
    };

    audio.play().catch(() => {
      startFullMelodicSinging();
    });
  };

  // Play single verse line audio
  const playSingleLineAudio = (lineItem: { line: string; audioUrl: string }, index: number) => {
    stopAllAudio();
    if (!singleLineAudioRef.current) {
      singleLineAudioRef.current = new Audio();
    }
    const audio = singleLineAudioRef.current;
    audio.src = lineItem.audioUrl;
    applyVoiceModulation(audio, singingVoiceType);

    setCurrentLineIndex(index);
    setIsPlayingVocalAudio(true);

    if (playBackingMusic && composition?.melodyGuide?.chords?.length) {
      const chords = composition.melodyGuide.chords;
      playChord(chords[index % chords.length]);
      const notes = composition?.audioMelodySequence;
      if (notes?.length) {
        playSingingVocalTone(notes[index % notes.length].freq, 1.2, singingVoiceType);
      }
    }

    audio.onended = () => {
      setIsPlayingVocalAudio(false);
      setCurrentLineIndex(-1);
    };

    audio.play().catch(() => {
      const notes = composition?.audioMelodySequence;
      if (notes?.length) {
        playSingingVocalTone(notes[index % notes.length].freq, 1.5, singingVoiceType);
      }
      setTimeout(() => {
        setIsPlayingVocalAudio(false);
        setCurrentLineIndex(-1);
      }, 1500);
    });
  };

  // Switch Voice Type handler
  const handleSelectVoiceType = (type: 'female' | 'male' | 'choir' | 'acapella') => {
    setSingingVoiceType(type);
    if (vocalAudioElementRef.current && isPlayingVocalAudio) {
      applyVoiceModulation(vocalAudioElementRef.current, type);
    }
    if (isPlayingMelodicSinging) {
      stopMelodicSinging();
      setTimeout(() => {
        startFullMelodicSinging();
      }, 200);
    }
  };

  // Web Audio Melody Synthesizer (Piano / Choir / Strings)
  const stopMelody = () => {
    melodyTimeoutsRef.current.forEach(clearTimeout);
    melodyTimeoutsRef.current = [];
    setIsPlayingMelody(false);
    setActiveNoteIndex(-1);
  };

  const playInstrumentNote = (freq: number, duration: number) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (melodyInstrument === 'piano') {
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      } else if (melodyInstrument === 'choir') {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.25, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.3);
      } else if (melodyInstrument === 'strings') {
        osc.type = 'sawtooth';
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        osc.connect(filter);
        filter.connect(gain);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.2);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + duration + 0.3);
        return;
      } else {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 1.5);
      }

      osc.frequency.setValueAtTime(freq, now);
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.4);
    } catch (e) {
      // silent
    }
  };

  const togglePlayMelody = () => {
    if (!composition?.audioMelodySequence?.length) return;

    if (isPlayingMelody) {
      stopMelody();
      return;
    }

    stopVocalAudio();
    stopMelodicSinging();
    setIsPlayingMelody(true);

    const sequence = composition.audioMelodySequence;
    let cumulativeTime = 0;

    sequence.forEach((item, index) => {
      const timeout = setTimeout(() => {
        setActiveNoteIndex(index);
        playInstrumentNote(item.freq, item.duration);

        if (index === sequence.length - 1) {
          const endTimeout = setTimeout(() => {
            setIsPlayingMelody(false);
            setActiveNoteIndex(-1);
          }, item.duration * 1000 + 300);
          melodyTimeoutsRef.current.push(endTimeout);
        }
      }, cumulativeTime * 1000);

      melodyTimeoutsRef.current.push(timeout);
      cumulativeTime += item.duration;
    });
  };

  // Copy helpers
  const handleCopyPrompt = () => {
    const promptText = composition?.studioPrompt || `Studio Youna: Theme of ${composition?.title}, ${composition?.westernScale}, ${composition?.bpm} BPM, ${composition?.vocalStyle}`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyLyrics = () => {
    if (!composition?.lyrics) return;
    navigator.clipboard.writeText(composition.lyrics);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2000);
  };

  const handleDownloadSongFile = () => {
    if (!composition) return;
    const content = `=====================================================
استوديو يونا للتأليف والغناء الموسيقي | STUDIO YOUNA MUSIC AI
=====================================================
عنوان الأغنية: ${composition.title} (${composition.englishTitle})
الموضوع: ${composition.topic}
اللغة: ${composition.songLanguage === 'en' ? 'الإنجليزية (English)' : 'العربية الفصحى'}
النمط الموسيقي: ${composition.genreStyle}
نوع الأداء الصوتي: ${composition.vocalStyle}
المقام والسلم: ${composition.musicalMaqam} / ${composition.westernScale}
السرعة والإيقاع: ${composition.bpm} BPM - ${composition.rhythmName}
التوزيع والآلات: ${composition.instrumentation}
الشعور العام: ${composition.mood}

-----------------------------------------------------
وصفة الإنتاج الموسيقي والتحليل الفني:
-----------------------------------------------------
- البحر والقافية: ${composition.productionBreakdown?.poeticMeterAndRhyme || 'أوزان وقوافٍ متناسقة'}
- تحليل المقام: ${composition.productionBreakdown?.maqamAnalysis || composition.musicalMaqam}
- التتابع الهارموني: ${composition.productionBreakdown?.harmonicStructure || 'Cm - Fm - Bb - Eb - Ab - G7'}
- التوزيع الموسيقي المستخدم: ${composition.productionBreakdown?.arrangementUsed || composition.instrumentation}

-----------------------------------------------------
كلمات الأغنية الكاملة (Studio Lyrics):
-----------------------------------------------------
${composition.lyrics}

-----------------------------------------------------
برومبت استوديو يونا للذكاء الاصطناعي (Studio Prompt):
-----------------------------------------------------
${composition.studioPrompt}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${composition.englishTitle.replace(/[^a-zA-Z0-9]/g, '_') || 'Studio_Youna_Song'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isAnyAudioPlaying = isPlayingVocalAudio || isPlayingMelodicSinging;

  return (
    <div className="space-y-8 animate-fadeIn text-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Studio Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950/90 via-indigo-950/80 to-slate-900 border border-purple-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>{language === 'ar' ? 'استوديو يونا للتأليف والغناء الموسيقي' : 'Studio Youna AI Song Composer & Vocalist'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              {language === 'ar' ? 'تأليف وغناء أغاني وشارات كاملة' : 'Compose & Sing Original Songs'}
            </h2>
            <p className="text-sm sm:text-base text-purple-200/80 max-w-2xl leading-relaxed">
              {language === 'ar'
                ? 'اكتب فكرة الشارة أو الأغنية، ودع استوديو يونا يكتب الكلمات الموزونة، ويلحن النغمات، ويغنيها بصوت بشري نقي أو كورال متناغم مع عرض تفاصيل الإنتاج الموسيقي خطوة بخطوة.'
                : 'Enter your song theme, and let Studio Youna write rhyming lyrics, compose the melody, sing it with human vocals & choir harmonies, and detail the complete production recipe.'}
            </p>
          </div>

          {/* Mode & Language Switchers */}
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            {/* Language Switch */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setSongLanguage('ar')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  songLanguage === 'ar'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇸🇦 عربية فصحى
              </button>
              <button
                type="button"
                onClick={() => setSongLanguage('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  songLanguage === 'en'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🇬🇧 English Song
              </button>
            </div>

            {/* Simple vs Custom Mode */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setStudioMode('simple')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studioMode === 'simple'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? '⚡ السريع' : '⚡ Quick'}
              </button>
              <button
                type="button"
                onClick={() => setStudioMode('custom')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  studioMode === 'custom'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {language === 'ar' ? '🎛️ الاحترافي المتقدم' : '🎛️ Pro Studio'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Ideas Carousel */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>{language === 'ar' ? 'أفكار ملهمة جاهزة للتجربة الفورية:' : 'Inspirational Ready-to-use Presets:'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {PRESET_IDEAS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-3 rounded-2xl bg-white/5 hover:bg-purple-900/30 border border-white/10 hover:border-purple-400/40 text-right transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-amber-200 group-hover:text-amber-300 truncate">
                    {p.title}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                    {p.lang === 'ar' ? 'عربي' : 'EN'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2 leading-snug">
                  {p.desc}
                </p>
              </div>
              <div className="mt-2 text-[10px] text-purple-300 flex items-center gap-1 font-medium">
                <Wand2 className="w-3 h-3" />
                <span>{language === 'ar' ? 'تطبيق الفكرة' : 'Apply'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Composer Input Form */}
      <form onSubmit={handleCompose} className="bg-slate-900/80 rounded-3xl border border-white/10 p-5 sm:p-7 shadow-xl space-y-6">
        {/* Topic / Prompt */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-gray-200 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {language === 'ar' ? 'موضوع الأغنية أو قصة الشارة:' : 'Song Theme / Story Prompt:'}
            </span>
            <span className="text-xs text-gray-400 font-normal">
              {language === 'ar' ? 'صف المشاعر، الشخصيات، أو المغامرة' : 'Describe emotion, characters, or adventure'}
            </span>
          </label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={3}
            placeholder={
              songLanguage === 'en'
                ? 'e.g. An inspiring anime theme about brave friends traveling across starry skies to save their home planet...'
                : 'مثال: شارة أنمي أسطورية عن فتاة شجاعة تجوب الكواكب برفقة صديق وفي بحثاً عن النور المفقود...'
            }
            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        </div>

        {/* Custom Pro Controls (Visible in custom mode) */}
        {studioMode === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/5 animate-fadeIn">
            {/* Proposed Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300">
                {language === 'ar' ? 'عنوان مقترح (اختياري):' : 'Proposed Title:'}
              </label>
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder={songLanguage === 'en' ? 'e.g. Star Guardians' : 'مثال: حماة النجوم'}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Vocal Style */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-purple-400" />
                {language === 'ar' ? 'طبيعة الصوت والأداء:' : 'Vocal Tone & Style:'}
              </label>
              <select
                value={vocalType}
                onChange={(e) => setVocalType(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="صوت أنثوي شجي نقي ودافئ">👩 صوت أنثوي نقي ودافئ (Female Soprano)</option>
                <option value="صوت رجالي بطولي قوي وواثق">👨 صوت رجالي بطولي وواثق (Heroic Male Tenor)</option>
                <option value="كورس شبابي ملهم وهارموني جماعي">👥 كورال وهارموني جماعي (Layered Choir)</option>
                <option value="أكابيلا أصوات بشرية خالصة بدون آلات">🎵 أكابيلا أصوات بشرية (Pure Acapella)</option>
                <option value="دويتو غنائي مشترك أنثوي ورجالي">✨ دويتو غنائي مشترك (Duet Vocal)</option>
              </select>
            </div>

            {/* Musical Maqam / Scale */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-400" />
                {language === 'ar' ? 'المقام الموسيقي والسلم:' : 'Maqam / Scale:'}
              </label>
              <select
                value={maqam}
                onChange={(e) => setMaqam(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="مقام نهاوند (C Minor)">مقام نهاوند (C Minor) - وجداني وأمل</option>
                <option value="مقام كورد (D Minor)">مقام كورد (D Minor) - حنين وذكريات</option>
                <option value="مقام عجم (C Major)">مقام عجم (C Major) - بطولي وانتصار</option>
                <option value="مقام حجاز (D Phrygian Dominant)">مقام حجاز (D Hijaz) - شرقي أصيل</option>
                <option value="مقام صبا (D Saba)">مقام صبا (D Saba) - شجن عميق</option>
                <option value="مقام رست (C Rast)">مقام رست (C Rast) - فخامة وأصالة</option>
              </select>
            </div>

            {/* Tempo (BPM) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-gray-300">
                <span>{language === 'ar' ? 'السرعة (BPM):' : 'Tempo (BPM):'}</span>
                <span className="text-amber-400">{bpm} BPM</span>
              </div>
              <input
                type="range"
                min="60"
                max="160"
                step="2"
                value={bpm}
                onChange={(e) => setBpm(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-black/60 rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Custom Lyrics input (Optional in Custom mode) */}
        {studioMode === 'custom' && (
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-bold text-gray-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                {language === 'ar' ? 'أبيات خاصة بك للبدء بها وتكملتها (اختياري):' : 'Your Custom Starting Verses (Optional):'}
              </span>
              <span className="text-[11px] text-gray-400">
                {language === 'ar' ? 'اتركه فارغاً للتأليف التلقائي الكامل' : 'Leave empty for full AI songwriting'}
              </span>
            </label>
            <textarea
              value={customLyrics}
              onChange={(e) => setCustomLyrics(e.target.value)}
              rows={2}
              placeholder={
                songLanguage === 'en'
                  ? 'e.g. In the silence of the night, we chase the morning light...'
                  : 'مثال: في عالم الأحلام نرسم خطونا... ونضيء بالآمال عتم طريقنا...'
              }
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-purple-300 flex items-center gap-2">
            <Disc3 className={`w-4 h-4 text-amber-400 ${isComposing ? 'animate-spin' : ''}`} />
            <span>
              {isComposing
                ? (language === 'ar' ? 'جاري نظم الكلمات وتلحين النغمات وإنتاج الغناء...' : 'Writing lyrics, composing chords & generating vocals...')
                : (language === 'ar' ? 'يولد كلمات موزونة، نغمات لحنية، وغناءً بشرياً حياً' : 'Generates rhyming lyrics, melody, & singing voice')}
            </span>
          </div>

          <button
            type="submit"
            disabled={isComposing || (!topic.trim() && !customLyrics.trim())}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-purple-600 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isComposing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{language === 'ar' ? 'جاري التأليف والتلحين...' : 'Composing Song...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>{language === 'ar' ? '✨ ألف وغنِّ الأغنية الآن' : '✨ Compose & Sing Song'}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Composition Output Studio Section */}
      {composition && (
        <div className="space-y-6 animate-fadeIn">
          {/* Song Production Overview Card */}
          <div className="rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
            {/* Header with Title and Quick Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
                    {composition.songLanguage === 'en' ? 'English Anime Anthem' : 'شارة وأغنية أصلية'}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
                    {composition.musicalMaqam}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                    {composition.bpm} BPM
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  {composition.title}
                </h3>
                {composition.englishTitle && composition.englishTitle !== composition.title && (
                  <p className="text-sm font-semibold text-purple-300">
                    {composition.englishTitle}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedLyrics ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLyrics ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ الكلمات' : 'Copy Lyrics')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/30 text-xs font-bold text-purple-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                  <span>{copiedPrompt ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ برومبت الاستوديو' : 'Copy Studio Prompt')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadSongFile}
                  className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-xs font-bold text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تحميل الوصفة والنص' : 'Download TXT'}</span>
                </button>
              </div>
            </div>

            {/* Vocal Performance & Singing Player Hub */}
            <div className="p-5 sm:p-6 rounded-2xl bg-black/40 border border-purple-500/20 space-y-5">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Mic className="w-5 h-5 text-amber-400" />
                    <h4 className="text-base sm:text-lg font-black text-amber-200">
                      {language === 'ar' ? 'غناء الأغنية والأداء الصوتي البشري المباشر 🎤' : 'Singing Voice & Vocal Performance 🎤'}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-300">
                    {language === 'ar'
                      ? 'اختر طبقة الصوت المغني، واستمع للغناء اللحني الموزون مع مرافقة الهارموني والأوتار والكاريوكي التفاعلي:'
                      : 'Choose your vocal singer, and listen to the melodic singing with backing chords & live karaoke:'}
                  </p>
                </div>

                {/* Voice Selection Chips */}
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectVoiceType('female')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      singingVoiceType === 'female'
                        ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/40 ring-2 ring-pink-300'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>👩</span>
                    <span>{language === 'ar' ? 'صوت أنثوي نقي' : 'Female Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectVoiceType('male')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      singingVoiceType === 'male'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 ring-2 ring-blue-300'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>👨</span>
                    <span>{language === 'ar' ? 'صوت رجالي بطولي' : 'Male Voice'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectVoiceType('choir')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      singingVoiceType === 'choir'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/40 ring-2 ring-purple-300'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>👥</span>
                    <span>{language === 'ar' ? 'كورال وهارموني' : 'Vocal Choir'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectVoiceType('acapella')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      singingVoiceType === 'acapella'
                        ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40 ring-2 ring-amber-300'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <span>🎵</span>
                    <span>{language === 'ar' ? 'أكابيلا بشرية' : 'Pure Acapella'}</span>
                  </button>
                </div>
              </div>

              {/* Main Singing Player Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-purple-950/40 border border-purple-500/30">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={togglePlayVocalAudio}
                    disabled={isLoadingSingingAudio}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-black flex items-center justify-center shadow-lg shadow-amber-900/40 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoadingSingingAudio ? (
                      <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : isAnyAudioPlaying ? (
                      <Pause className="w-6 h-6 fill-current text-black" />
                    ) : (
                      <Play className="w-6 h-6 fill-current text-black mr-0.5" />
                    )}
                  </button>

                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>
                        {isAnyAudioPlaying
                          ? (language === 'ar' ? 'جاري غناء الأغنية الآن 🎶' : 'Singing Song Now 🎶')
                          : (language === 'ar' ? 'استمع إلى غناء الأغنية كاملاً' : 'Play Sung Song')}
                      </span>
                      {isAnyAudioPlaying && (
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3 bg-amber-400 animate-pulse rounded-full" />
                          <span className="w-1 h-5 bg-pink-400 animate-pulse delay-75 rounded-full" />
                          <span className="w-1 h-2 bg-indigo-400 animate-pulse delay-150 rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                      <span>
                        {singingVoiceType === 'female'
                          ? (language === 'ar' ? 'بصوت أنثوي نقي مع تدرجات لحنية' : 'Pure soprano singing voice')
                          : singingVoiceType === 'male'
                          ? (language === 'ar' ? 'بصوت رجالي بطولي دافئ' : 'Heroic baritone singing voice')
                          : singingVoiceType === 'choir'
                          ? (language === 'ar' ? 'هارموني وكورال متعدد الطبقات' : 'Polyphonic harmony choir')
                          : (language === 'ar' ? 'أكابيلا بشرية متناسقة' : 'Acapella human vocal track')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Backing Chords & Reset Toggles */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPlayBackingMusic(!playBackingMusic)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      playBackingMusic
                        ? 'bg-indigo-600/40 text-indigo-200 border border-indigo-400/40'
                        : 'bg-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    {playBackingMusic ? <Volume2 className="w-3.5 h-3.5 text-indigo-300" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{language === 'ar' ? 'مرافقة الهارموني والبيانو' : 'Backing Harmony'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={stopAllAudio}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                    title={language === 'ar' ? 'إيقاف الصوت' : 'Stop'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Live Audio Progress Bar */}
              {(isAnyAudioPlaying || audioDuration > 0) && (
                <div className="space-y-1.5 animate-fadeIn">
                  <div className="flex justify-between text-[11px] text-gray-400 font-mono">
                    <span>{Math.floor(audioCurrentTime)}s</span>
                    <span>{Math.floor(audioDuration)}s</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 via-pink-500 to-purple-500 transition-all duration-200"
                      style={{
                        width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Interactive Harmony Chord Progression Palette */}
            {composition.melodyGuide?.chords?.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>{language === 'ar' ? 'التتابع الهارموني والأوتار (اضغط للاستماع للتآلف):' : 'Harmonic Chords (Click to Play):'}</span>
                  </div>
                  <span className="text-[11px] text-gray-400">
                    {composition.westernScale}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {composition.melodyGuide.chords.map((chord, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => playChord(chord)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer transform active:scale-95 ${
                        activeChordPlaying === chord
                          ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/50 scale-105'
                          : 'bg-white/5 hover:bg-white/10 text-purple-200 border border-purple-500/20'
                      }`}
                    >
                      <span>{chord}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Melodic Sequence Synthesizer Preview */}
            {composition.audioMelodySequence?.length > 0 && (
              <div className="p-4 sm:p-5 rounded-2xl bg-black/30 border border-white/5 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <Music className="w-4 h-4 text-amber-400" />
                    <span>{language === 'ar' ? 'عزف لحن الأغنية التفاعلي (Interactive Melody Player):' : 'Interactive Melody Instrument Player:'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Instrument Selector */}
                    <select
                      value={melodyInstrument}
                      onChange={(e) => setMelodyInstrument(e.target.value as any)}
                      className="bg-black/60 border border-white/10 rounded-xl px-2.5 py-1 text-xs text-purple-200 focus:outline-none"
                    >
                      <option value="choir">👥 كورال بشري (Choir)</option>
                      <option value="piano">🎹 بيانو كلاسيكي (Piano)</option>
                      <option value="strings">🎻 أوركسترا ووتريات (Strings)</option>
                      <option value="musicbox">✨ صندوق الموسيقى (Music Box)</option>
                    </select>

                    <button
                      type="button"
                      onClick={togglePlayMelody}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isPlayingMelody
                          ? 'bg-amber-500 text-black'
                          : 'bg-white/10 hover:bg-white/20 text-white'
                      }`}
                    >
                      {isPlayingMelody ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlayingMelody ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'عزف اللحن' : 'Play Melody')}</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Note Visualizer Bars */}
                <div className="flex items-end gap-1.5 h-16 bg-black/50 p-2 rounded-xl overflow-x-auto">
                  {composition.audioMelodySequence.map((n, nIdx) => {
                    const heightPercent = Math.min(100, Math.max(20, ((n.freq - 220) / 400) * 100));
                    const isActive = activeNoteIndex === nIdx;
                    return (
                      <button
                        key={nIdx}
                        type="button"
                        onClick={() => playSingingVocalTone(n.freq, 1.0, singingVoiceType)}
                        className={`flex-1 min-w-[28px] rounded-lg transition-all flex flex-col justify-end items-center p-1 cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-t from-amber-500 to-pink-500 shadow-md scale-105'
                            : 'bg-purple-950/60 hover:bg-purple-800/60 border border-purple-500/20'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                        title={`${n.note} (${n.freq.toFixed(1)} Hz)`}
                      >
                        <span className="text-[9px] font-mono text-gray-300 font-bold truncate">
                          {n.note}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lyrics with Real-Time Karaoke Sync */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-400" />
                  <h4 className="text-base sm:text-lg font-black text-white">
                    {language === 'ar' ? 'كلمات الأغنية ونصوص المقاطع (Studio Lyrics):' : 'Song Lyrics & Structure:'}
                  </h4>
                </div>
                <span className="text-xs text-purple-300">
                  {language === 'ar' ? 'اضغط على أي بيت شعري للاستماع له بمفرده' : 'Click any line to listen solo'}
                </span>
              </div>

              {/* Lyrics Container */}
              <div className="p-5 sm:p-6 rounded-2xl bg-black/50 border border-white/10 space-y-3 font-arabic leading-loose">
                {composition.lyrics.split('\n').map((lineText, lineIdx) => {
                  const trimmed = lineText.trim();
                  if (!trimmed) return <div key={lineIdx} className="h-2" />;

                  const isHeader = trimmed.startsWith('[') && trimmed.endsWith(']');
                  const isCurrent = currentLineIndex === lineIdx;

                  if (isHeader) {
                    return (
                      <div
                        key={lineIdx}
                        className="text-xs font-black tracking-widest text-amber-400 pt-3 pb-1 border-b border-white/5 flex items-center gap-2"
                      >
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>{trimmed}</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={lineIdx}
                      onClick={() => {
                        if (singingAudioResult?.lineAudios?.[lineIdx]) {
                          playSingleLineAudio(singingAudioResult.lineAudios[lineIdx], lineIdx);
                        } else {
                          const notes = composition.audioMelodySequence;
                          const freq = notes?.[lineIdx % (notes.length || 1)]?.freq || 261.63;
                          playSingingVocalTone(freq, 1.2, singingVoiceType);
                          setCurrentLineIndex(lineIdx);
                          setTimeout(() => setCurrentLineIndex(-1), 1200);
                        }
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between text-sm sm:text-base ${
                        isCurrent
                          ? 'bg-gradient-to-r from-amber-500/30 via-purple-600/30 to-indigo-600/30 border border-amber-400/50 text-amber-100 font-bold scale-[1.01] shadow-lg'
                          : 'hover:bg-white/5 text-gray-200'
                      }`}
                    >
                      <span className="leading-relaxed">{trimmed}</span>
                      <div className="opacity-0 group-hover:opacity-100 text-xs text-purple-300">
                        <Play className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Complete Production Recipe & Breakdown Card (ماذا استُخدم لإنتاج هذه الأغنية بالكامل) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-900 border border-amber-500/30 space-y-5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h4 className="text-base sm:text-lg font-black text-amber-300">
                  {language === 'ar' ? 'ماذا استُخدم لإنتاج هذه الأغنية بالكامل (Production Recipe):' : 'Complete Song Production Breakdown:'}
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                {/* 1. Poetic Meter & Rhyme */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>📜</span>
                    <span>{language === 'ar' ? 'الوزن الشعري ونظام القوافي:' : 'Poetic Meter & Rhymes:'}</span>
                  </div>
                  <p className="text-gray-300">
                    {composition.productionBreakdown?.poeticMeterAndRhyme ||
                      (composition.songLanguage === 'en'
                        ? 'AABB / ABAB rhyming scheme with heroic 4/4 cadence and memorable hook phrasing.'
                        : 'بحر الرمل / المتقارب بقوافٍ ثنائية متناسقة ونهايات صوتية رنانة.')}
                  </p>
                </div>

                {/* 2. Maqam & Scale */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <span>🎼</span>
                    <span>{language === 'ar' ? 'المقام والسلم الموسيقي المستعمل:' : 'Maqam & Scale Analysis:'}</span>
                  </div>
                  <p className="text-gray-300">
                    {composition.productionBreakdown?.maqamAnalysis ||
                      `${composition.musicalMaqam} (${composition.westernScale}) - يمنح الأغنية طابع الأمل الوجداني والنوستالجيا.`}
                  </p>
                </div>

                {/* 3. Harmonic Progression */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="font-bold text-blue-300 flex items-center gap-1.5">
                    <span>🎹</span>
                    <span>{language === 'ar' ? 'التتابع الهارموني والأكوردات:' : 'Harmonic Structure:'}</span>
                  </div>
                  <p className="text-gray-300">
                    {composition.productionBreakdown?.harmonicStructure ||
                      `التدرج: ${composition.melodyGuide?.chords?.join(' ➔ ') || 'Cm ➔ Fm ➔ Bb ➔ Eb ➔ Ab ➔ G7'}`}
                  </p>
                </div>

                {/* 4. Arrangement & Vocals */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                  <div className="font-bold text-green-300 flex items-center gap-1.5">
                    <span>🎚️</span>
                    <span>{language === 'ar' ? 'التوزيع الصوتي والآلات المعتمدة:' : 'Arrangement & Instrumentation:'}</span>
                  </div>
                  <p className="text-gray-300">
                    {composition.productionBreakdown?.arrangementUsed ||
                      composition.instrumentation ||
                      'أصوات بشرية أكابيلا، كورال جماعي، وتريات وبيانو كلاسيكي.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Studio Prompt Card (English prompt for external AI music platforms) */}
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  {language === 'ar' ? 'برومبت الاستوديو المباشر (Studio Prompt for Suno / Udio):' : 'AI Music Prompt:'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-xs text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedPrompt ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                </button>
              </div>
              <p className="font-mono text-xs text-gray-300 bg-black/60 p-3 rounded-xl border border-white/5 select-all">
                {composition.studioPrompt || `Studio Youna: Theme of ${composition.title}, ${composition.westernScale}, ${composition.bpm} BPM, ${composition.vocalStyle}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
