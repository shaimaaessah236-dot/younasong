import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Crown,
  Trophy,
  X,
  Smartphone,
  Square,
  Palette,
  Mic,
  Music2,
  Play,
  Pause,
  Volume2,
  Upload,
  Film,
  Image as ImageIcon,
  Video,
  Radio,
  Sliders,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { validateAudioFileUpload, validateImageFileUpload } from '../lib/securityProtection';

export interface StoryCardData {
  singerName: string;
  songTitle: string;
  animeOrCategory?: string;
  score: number;
  pitchTier?: string;
  voiceType?: string;
  rankTitle?: string;
  date?: string;
  audioUrl?: string;
  animeImageUrl?: string;
}

interface SocialStoryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StoryCardData;
}

export type AspectRatio = 'story' | 'square' | 'portrait';
export type ThemeStyle = 'twilight' | 'gold' | 'sunset' | 'sakura' | 'cyber_blue' | 'obsidian';

export interface AnimePreset {
  id: string;
  name: string;
  animeName: string;
  imageUrl: string;
}

export const ANIME_PRESETS: AnimePreset[] = [
  {
    id: 'conan',
    name: 'المحقق كونان',
    animeName: 'المحقق كونان',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'romeo',
    name: 'عهد الأصدقاء',
    animeName: 'عهد الأصدقاء',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'hunter',
    name: 'القناص',
    animeName: 'القناص',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dragonball',
    name: 'دراغون بول',
    animeName: 'دراغون بول',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'slamdunk',
    name: 'سلام دانك',
    animeName: 'سلام دانك',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'digimon',
    name: 'أبطال الديجيتال',
    animeName: 'أبطال الديجيتال',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'gundam',
    name: 'أجنحة الكاندام',
    animeName: 'أجنحة الكاندام',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'remi',
    name: 'ريمي الفتى الشارد',
    animeName: 'ريمي',
    imageUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'spacetoon-gold',
    name: 'سبيستون الذهبية',
    animeName: 'سبيستون',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80'
  }
];

export const SocialStoryCardModal: React.FC<SocialStoryCardModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const { language, isRtl, t } = useLanguage();
  const [ratio, setRatio] = useState<AspectRatio>('story');
  const [theme, setTheme] = useState<ThemeStyle>('twilight'); // Default to Neon Night as user requested
  const [selectedAnimeImage, setSelectedAnimeImage] = useState<string>(() => {
    return data.animeImageUrl || ANIME_PRESETS[0].imageUrl;
  });
  const [copied, setCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Audio Playback State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const animeImageInputRef = useRef<HTMLInputElement | null>(null);

  // Custom audio override if user uploads
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);

  const activeAudioUrl = customAudioUrl || data.audioUrl || null;

  const singer = data.singerName || 'صوت موهوب ';
  const song = data.songTitle || 'شارة سبيستون الخالدة';
  const score = Math.round(data.score || 95);
  const rank = data.rankTitle || (score >= 95 ? ' بطل الأسبوع الذهبي' : ' موهبة صوتية واعدة');
  const pitch = data.pitchTier || 'نبرة ماسية نقية • بدون موسيقى';
  const dateStr = data.date || new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'short' });

  // Update image if data changes
  useEffect(() => {
    if (data.animeImageUrl) {
      setSelectedAnimeImage(data.animeImageUrl);
    }
  }, [data.animeImageUrl]);

  // Audio Element Setup
  useEffect(() => {
    if (!activeAudioUrl) {
      setIsPlayingAudio(false);
      return;
    }

    const audio = new Audio(activeAudioUrl);
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setAudioCurrentTime(audio.currentTime);
    };
    const onLoadedMetadata = () => {
      setAudioDuration(audio.duration || 0);
    };
    const onEnded = () => {
      setIsPlayingAudio(false);
      setAudioCurrentTime(0);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audioRef.current = null;
    };
  }, [activeAudioUrl]);

  // Toggle Audio Play / Pause
  const handleToggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch(err => {
        console.warn('Audio playback error', err);
      });
    }
  };

  // Handle uploading custom audio
  const handleUploadAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateAudioFileUpload(file, 25);
      if (!validation.valid) {
        alert(validation.error || 'الملف الصوتي المرفوع غير صالح أو يتجاوز 25 ميجابايت.');
        if (e.target) e.target.value = '';
        return;
      }
      const url = URL.createObjectURL(file);
      setCustomAudioUrl(url);
      setIsPlayingAudio(false);
    }
  };

  // Handle uploading custom anime image
  const handleUploadAnimeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validation = validateImageFileUpload(file, 8);
      if (!validation.valid) {
        alert(validation.error || 'ملف الصورة غير صالح أو يتجاوز 8 ميجابايت.');
        if (e.target) e.target.value = '';
        return;
      }
      const url = URL.createObjectURL(file);
      setSelectedAnimeImage(url);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Theme Configuration Palette
  const themeConfig = useMemo(() => {
    switch (theme) {
      case 'twilight': // ليل نيون (Neon Night)
        return {
          name: 'ليل نيون ',
          primary: '#00f2fe',
          secondary: '#f000ff',
          accent: '#7928ca',
          bgTop: '#070a16',
          bgMid: '#120b29',
          bgBottom: '#04060f',
          borderGrad: ['#00f2fe', '#f000ff'],
          textPrimary: '#ffffff',
          textSecondary: '#67e8f9',
          cardBorder: 'border-cyan-400/60 shadow-[0_0_40px_rgba(0,242,254,0.35)]',
          containerClass: 'bg-gradient-to-b from-[#070a16] via-[#120b29] to-[#04060f] text-cyan-100',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
          glowColor: '#00f2fe'
        };
      case 'gold': // ذهب ملكي
        return {
          name: 'ذهب ملكي ',
          primary: '#D4AF37',
          secondary: '#F5D77F',
          accent: '#997312',
          bgTop: '#160e03',
          bgMid: '#241605',
          bgBottom: '#0a0601',
          borderGrad: ['#D4AF37', '#F5D77F'],
          textPrimary: '#ffffff',
          textSecondary: '#fde68a',
          cardBorder: 'border-[#D4AF37]/70 shadow-[0_0_40px_rgba(212,175,55,0.3)]',
          containerClass: 'bg-gradient-to-b from-[#160e03] via-[#241605] to-[#0a0601] text-amber-100',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
          glowColor: '#D4AF37'
        };
      case 'sunset': // غروب دافئ
        return {
          name: 'غروب دافئ ',
          primary: '#ff6b35',
          secondary: '#f7c59f',
          accent: '#b91c1c',
          bgTop: '#220b08',
          bgMid: '#36111a',
          bgBottom: '#0d0408',
          borderGrad: ['#ff6b35', '#f7c59f'],
          textPrimary: '#ffffff',
          textSecondary: '#fdba74',
          cardBorder: 'border-orange-500/70 shadow-[0_0_40px_rgba(255,107,53,0.3)]',
          containerClass: 'bg-gradient-to-b from-[#220b08] via-[#36111a] to-[#0d0408] text-orange-100',
          badgeBg: 'bg-orange-500/20 text-orange-300 border-orange-400/40',
          glowColor: '#ff6b35'
        };
      case 'sakura': // أنمي ساكورا
        return {
          name: 'أنمي ساكورا ',
          primary: '#ff758c',
          secondary: '#ff7eb3',
          accent: '#c026d3',
          bgTop: '#1b0a1d',
          bgMid: '#2b0f34',
          bgBottom: '#0d0411',
          borderGrad: ['#ff758c', '#ff7eb3'],
          textPrimary: '#ffffff',
          textSecondary: '#fbcfe8',
          cardBorder: 'border-pink-400/70 shadow-[0_0_40px_rgba(255,117,140,0.3)]',
          containerClass: 'bg-gradient-to-b from-[#1b0a1d] via-[#2b0f34] to-[#0d0411] text-pink-100',
          badgeBg: 'bg-pink-500/20 text-pink-300 border-pink-400/40',
          glowColor: '#ff758c'
        };
      case 'cyber_blue': // أزرق كهربائي
        return {
          name: 'أزرق كهربائي ',
          primary: '#38bdf8',
          secondary: '#818cf8',
          accent: '#1d4ed8',
          bgTop: '#041324',
          bgMid: '#081f3b',
          bgBottom: '#020912',
          borderGrad: ['#38bdf8', '#818cf8'],
          textPrimary: '#ffffff',
          textSecondary: '#bae6fd',
          cardBorder: 'border-sky-400/70 shadow-[0_0_40px_rgba(56,189,248,0.3)]',
          containerClass: 'bg-gradient-to-b from-[#041324] via-[#081f3b] to-[#020912] text-sky-100',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
          glowColor: '#38bdf8'
        };
      case 'obsidian': // فحم داكن
      default:
        return {
          name: 'فحم داكن ',
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          accent: '#475569',
          bgTop: '#090a0d',
          bgMid: '#12141a',
          bgBottom: '#040507',
          borderGrad: ['#e2e8f0', '#94a3b8'],
          textPrimary: '#ffffff',
          textSecondary: '#cbd5e1',
          cardBorder: 'border-slate-400/50 shadow-[0_0_40px_rgba(226,232,240,0.2)]',
          containerClass: 'bg-gradient-to-b from-[#090a0d] via-[#12141a] to-[#040507] text-slate-100',
          badgeBg: 'bg-white/10 text-slate-200 border-white/20',
          glowColor: '#ffffff'
        };
    }
  }, [theme]);

  // Helper: Draw Story Canvas (Used for both PNG Image download and Video export)
  const drawStoryCanvas = async (
    canvas: HTMLCanvasElement,
    wavePhase = 0,
    isAnimated = false
  ) => {
    const width = ratio === 'story' ? 1080 : ratio === 'portrait' ? 1080 : 1080;
    const height = ratio === 'story' ? 1920 : ratio === 'portrait' ? 1350 : 1080;

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, themeConfig.bgTop);
    bgGrad.addColorStop(0.45, themeConfig.bgMid);
    bgGrad.addColorStop(1, themeConfig.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Neon Glow
    const radGlow = ctx.createRadialGradient(
      width / 2,
      height * 0.4,
      50,
      width / 2,
      height * 0.4,
      width * 0.65
    );
    radGlow.addColorStop(0, themeConfig.primary + '38');
    radGlow.addColorStop(0.5, themeConfig.secondary + '18');
    radGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, width, height);

    // Cyber grid lines for Neon Night theme
    if (theme === 'twilight') {
      ctx.strokeStyle = '#00f2fe15';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 3. Ornate Double Borders with Neon / Gold glow
    ctx.save();
    ctx.strokeStyle = themeConfig.primary;
    ctx.lineWidth = 12;
    ctx.shadowColor = themeConfig.primary;
    ctx.shadowBlur = 24;
    ctx.strokeRect(36, 36, width - 72, height - 72);
    ctx.restore();

    ctx.strokeStyle = themeConfig.secondary + '77';
    ctx.lineWidth = 3;
    ctx.strokeRect(52, 52, width - 104, height - 104);

    // 4. Header Branding Text
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    let curY = ratio === 'story' ? 160 : ratio === 'portrait' ? 130 : 110;
    ctx.fillStyle = themeConfig.primary;
    ctx.font = 'bold 36px Tajawal, sans-serif';
    ctx.fillText(' استوديو يونا للأصوات الذهبية ', width / 2, curY);

    curY += 46;
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 26px monospace';
    ctx.fillText('VOCALS ONLY • أداء بشري نقي بدون موسيقى', width / 2, curY);

    // 5. CENTER ANIME IMAGE (صورة الأنمي في الوسط)
    const centerY = ratio === 'story' ? height * 0.40 : ratio === 'portrait' ? height * 0.42 : height * 0.45;
    const animeBoxSize = ratio === 'story' ? 440 : ratio === 'portrait' ? 360 : 320;
    const halfBox = animeBoxSize / 2;

    // Draw Glowing Frame for Anime Image
    ctx.save();
    ctx.shadowColor = themeConfig.primary;
    ctx.shadowBlur = isAnimated ? 30 + Math.sin(wavePhase * 4) * 10 : 30;
    ctx.strokeStyle = themeConfig.primary;
    ctx.lineWidth = 8;

    // Draw rounded rect for anime image
    const rx = width / 2 - halfBox;
    const ry = centerY - halfBox;
    const radius = 28;

    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + animeBoxSize - radius, ry);
    ctx.quadraticCurveTo(rx + animeBoxSize, ry, rx + animeBoxSize, ry + radius);
    ctx.lineTo(rx + animeBoxSize, ry + animeBoxSize - radius);
    ctx.quadraticCurveTo(rx + animeBoxSize, ry + animeBoxSize, rx + animeBoxSize - radius, ry + animeBoxSize);
    ctx.lineTo(rx + radius, ry + animeBoxSize);
    ctx.quadraticCurveTo(rx, ry + animeBoxSize, rx, ry + animeBoxSize - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.stroke();
    ctx.clip(); // Clip inner image

    // Load and draw Anime Image
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedAnimeImage;
      await new Promise<void>((resolve) => {
        if (img.complete) resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // fallback
      });
      if (img.width > 0) {
        ctx.drawImage(img, rx, ry, animeBoxSize, animeBoxSize);
      } else {
        // Fallback stylish gradient with music icon
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(rx, ry, animeBoxSize, animeBoxSize);
        ctx.fillStyle = themeConfig.primary;
        ctx.font = 'bold 70px Tajawal, sans-serif';
        ctx.fillText('', width / 2, centerY + 25);
      }
    } catch {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(rx, ry, animeBoxSize, animeBoxSize);
    }
    ctx.restore();

    // 6. Floating Score Badge Over / Near Center Anime
    const badgeY = centerY + halfBox - 20;
    ctx.save();
    ctx.beginPath();
    ctx.arc(width / 2, badgeY, 65, 0, Math.PI * 2);
    ctx.fillStyle = '#050711ee';
    ctx.fill();
    ctx.strokeStyle = themeConfig.secondary;
    ctx.lineWidth = 5;
    ctx.shadowColor = themeConfig.secondary;
    ctx.shadowBlur = 20;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 52px monospace';
    ctx.fillText(`${score}%`, width / 2, badgeY + 15);

    ctx.fillStyle = themeConfig.primary;
    ctx.font = 'bold 18px Tajawal, sans-serif';
    ctx.fillText('نسبة النقاء', width / 2, badgeY + 40);
    ctx.restore();

    // 7. Singer & Song Information
    curY = badgeY + 110;
    ctx.fillStyle = themeConfig.primary;
    ctx.font = '900 42px Tajawal, sans-serif';
    ctx.fillText(rank, width / 2, curY);

    curY += 65;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 56px Tajawal, sans-serif';
    ctx.fillText(singer, width / 2, curY);

    curY += 56;
    ctx.fillStyle = themeConfig.textSecondary;
    ctx.font = 'bold 36px Tajawal, sans-serif';
    ctx.fillText(`شارة: « ${song} »`, width / 2, curY);

    curY += 45;
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 26px Tajawal, sans-serif';
    ctx.fillText(pitch, width / 2, curY);

    // 8. LIVE EQUALIZER SOUNDWAVE BARS (موجات صوتية متفاعلة)
    const waveY = curY + (ratio === 'story' ? 95 : 65);
    const barCount = 28;
    const barWidth = 10;
    const barSpacing = 8;
    const totalWaveWidth = barCount * (barWidth + barSpacing);
    const startWaveX = (width - totalWaveWidth) / 2;

    for (let i = 0; i < barCount; i++) {
      const bx = startWaveX + i * (barWidth + barSpacing);
      // Generate pleasing oscillating sound wave height
      const freq = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
      const oscillation = isAnimated
        ? Math.abs(Math.sin(wavePhase * 6 + i * 0.45)) * 0.8 + 0.2
        : Math.abs(Math.sin(i * 0.4)) * 0.7 + 0.3;
      const barHeight = Math.max(12, freq * oscillation * (ratio === 'story' ? 110 : 80));

      const barGrad = ctx.createLinearGradient(bx, waveY - barHeight / 2, bx, waveY + barHeight / 2);
      barGrad.addColorStop(0, themeConfig.primary);
      barGrad.addColorStop(1, themeConfig.secondary);

      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(bx, waveY - barHeight / 2, barWidth, barHeight, 5);
      ctx.fill();
    }

    // 9. Official Stamp & Footer
    const footerY = ratio === 'story' ? height - 140 : ratio === 'portrait' ? height - 100 : height - 85;
    ctx.strokeStyle = themeConfig.primary + '55';
    ctx.beginPath();
    ctx.moveTo(120, footerY - 35);
    ctx.lineTo(width - 120, footerY - 35);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 24px Tajawal, sans-serif';
    ctx.fillText(` مسابقة شارات الأنمي وسبيستون الصوتية • ${dateStr}`, width / 2, footerY);

    ctx.fillStyle = themeConfig.primary;
    ctx.font = 'bold 20px monospace';
    ctx.fillText('YONA SONGS • OFFICIAL VOCAL STORY CERTIFICATE', width / 2, footerY + 36);
  };

  // Function 1: Download High-Res PNG Image
  const handleDownloadImage = async () => {
    setIsGeneratingImage(true);
    try {
      const canvas = document.createElement('canvas');
      await drawStoryCanvas(canvas, 0, false);

      const imageURL = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = imageURL;
      a.download = `yona-story-${singer.replace(/\s+/g, '_')}-${theme}.png`;
      a.click();
    } catch (e) {
      console.error('Error creating story card image', e);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Function 2: Export Video with Sound for TikTok & Instagram Story (MP4 / WebM)
  const handleExportVideoWithAudio = async () => {
    setIsExportingVideo(true);
    setExportProgress(10);

    const canvas = document.createElement('canvas');
    const width = ratio === 'story' ? 1080 : ratio === 'portrait' ? 1080 : 1080;
    const height = ratio === 'story' ? 1920 : ratio === 'portrait' ? 1350 : 1080;
    canvas.width = width;
    canvas.height = height;

    try {
      // 1. Prepare Audio Element & Web Audio Stream
      const audioToRecord = new Audio(activeAudioUrl || '');
      audioToRecord.crossOrigin = 'anonymous';

      // Duration: either audio length or default 12 seconds for story
      let recordDuration = 12;
      if (audioDuration && audioDuration > 3) {
        recordDuration = Math.min(audioDuration, 25); // cap at 25 seconds for story
      }

      let audioStreamTrack: MediaStreamTrack | null = null;
      let audioCtx: AudioContext | null = null;

      if (activeAudioUrl) {
        try {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioCtx.createMediaElementSource(audioToRecord);
          const dest = audioCtx.createMediaStreamDestination();
          source.connect(dest);
          source.connect(audioCtx.destination);
          audioStreamTrack = dest.stream.getAudioTracks()[0] || null;
        } catch (e) {
          console.warn('Audio Context capture failed or unsupported, using canvas stream', e);
        }
      }

      // 2. Canvas Stream
      const canvasStream = canvas.captureStream(30); // 30 FPS
      const tracks = [...canvasStream.getVideoTracks()];
      if (audioStreamTrack) {
        tracks.push(audioStreamTrack);
      }
      const combinedStream = new MediaStream(tracks);

      // 3. MediaRecorder
      const supportedMimeTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      let selectedMime = 'video/webm';
      for (const m of supportedMimeTypes) {
        if (MediaRecorder.isTypeSupported(m)) {
          selectedMime = m;
          break;
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 4500000 // 4.5 Mbps crisp quality
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: selectedMime });
        const videoUrl = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = videoUrl;
        const ext = selectedMime.includes('mp4') ? 'mp4' : 'webm';
        a.download = `yona-story-${singer.replace(/\s+/g, '_')}-${theme}.${ext}`;
        a.click();
        setIsExportingVideo(false);
        setExportProgress(100);
      };

      recorder.start(200);

      // Start Audio
      if (activeAudioUrl) {
        audioToRecord.currentTime = 0;
        audioToRecord.play().catch(() => {});
      }

      // Animation Loop
      const startTime = performance.now();
      const intervalMs = 1000 / 30; // 30 FPS

      const renderLoop = async () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const pct = Math.min(95, Math.round((elapsed / recordDuration) * 100));
        setExportProgress(pct);

        await drawStoryCanvas(canvas, elapsed, true);

        if (elapsed < recordDuration) {
          setTimeout(renderLoop, intervalMs);
        } else {
          recorder.stop();
          audioToRecord.pause();
          if (audioCtx) audioCtx.close();
        }
      };

      renderLoop();
    } catch (err) {
      console.error('Video export error', err);
      // Fallback to high-res image if video recording is not supported
      handleDownloadImage();
      setIsExportingVideo(false);
    }
  };

  const handleCopyText = () => {
    const text = ` سجّلت أدائي الصوتي في استوديو يونا لشارات الأنمي بدون موسيقى (Vocals Only)!\n النتيجة: ${score}% في شارة "${song}"\nالمغني: ${singer}\nشارك واكتشف نبرة صوتك في التحدي! \n#سبيستون #انمي #يونا_سونغز #VocalsOnly #تيك_توك`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareMobile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `أداء ${singer} في استوديو يونا`,
          text: ` استمع لأدائي في شارة "${song}" بدون موسيقى بدرجة ${score}%! `,
          url: window.location.href
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopyText();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-4xl my-auto space-y-4">
        
        {/* Top Header Controls */}
        <div className={`flex items-center justify-between bg-[#0e1422] border border-white/10 p-4 rounded-2xl shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-400/20 to-emerald-400/20 border border-amber-400/40 text-amber-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-white text-base sm:text-xl font-tajawal flex items-center gap-2">
                <span>{language === 'ar' ? 'صانع بطاقات وفيديوهات الستوري والتيك توك' : 'Story & TikTok Social Card Studio'}</span>
                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                  {language === 'ar' ? 'بصوتك' : 'Your Vocals'}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                {language === 'ar'
                  ? 'خصص الديزاين، صورة الأنمي في الوسط، واستمع لصوتك مع تصدير فيديو كامل للستوري والتيك توك'
                  : 'Customize design, center anime artwork, and export a complete social story video with your audio'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTROLS SECTION: Ratio, Theme, Anime Picture & Audio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          
          {/* Box 1: Themes & Ratio */}
          <div className="p-3.5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-cyan-400" />
                <span>{language === 'ar' ? 'اختر الديزاين والثيم:' : 'Choose Theme & Style:'}</span>
              </span>
              <span className="text-[11px] font-bold text-amber-300">{themeConfig.name}</span>
            </div>

            {/* Theme Selector */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              <button
                onClick={() => setTheme('twilight')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'twilight'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'ليل نيون' : 'Twilight'}</span>
              </button>

              <button
                onClick={() => setTheme('gold')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'gold'
                    ? 'bg-amber-500/30 border-amber-400 text-amber-300 shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'ذهب ملكي' : 'Royal Gold'}</span>
              </button>

              <button
                onClick={() => setTheme('sunset')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'sunset'
                    ? 'bg-orange-500/30 border-orange-400 text-orange-300 shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'غروب دافئ' : 'Warm Sunset'}</span>
              </button>

              <button
                onClick={() => setTheme('sakura')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'sakura'
                    ? 'bg-rose-500/30 border-rose-400 text-rose-300 shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'ساكورا' : 'Sakura'}</span>
              </button>

              <button
                onClick={() => setTheme('cyber_blue')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'cyber_blue'
                    ? 'bg-sky-500/30 border-sky-400 text-sky-300 shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'أزرق كهربائي' : 'Cyber Blue'}</span>
              </button>

              <button
                onClick={() => setTheme('obsidian')}
                className={`px-2 py-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer border ${
                  theme === 'obsidian'
                    ? 'bg-slate-700/50 border-slate-300 text-white shadow-md scale-105'
                    : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="text-base"></span>
                <span className="text-[11px]">{language === 'ar' ? 'فحم داكن' : 'Obsidian'}</span>
              </button>
            </div>

            {/* Ratio Selector */}
            <div className="flex items-center gap-2 pt-1 border-t border-white/5">
              <span className="text-xs text-slate-400 font-bold">{language === 'ar' ? 'المقاس:' : 'Ratio:'}</span>
              <button
                onClick={() => setRatio('story')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ratio === 'story'
                    ? 'bg-amber-400 text-black font-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'ستوري (9:16)' : 'Story (9:16)'}</span>
              </button>

              <button
                onClick={() => setRatio('square')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ratio === 'square'
                    ? 'bg-amber-400 text-black font-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'مربع فيد (1:1)' : 'Square (1:1)'}</span>
              </button>

              <button
                onClick={() => setRatio('portrait')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ratio === 'portrait'
                    ? 'bg-amber-400 text-black font-black shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'فيد ريلز (4:5)' : 'Portrait (4:5)'}</span>
              </button>
            </div>
          </div>

          {/* Box 2: Center Anime Picture & Audio Controls */}
          <div className="p-3.5 rounded-2xl bg-[#0c101c] border border-white/10 space-y-3">
            
            {/* Center Anime Picture Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'صورة الأنمي في الوسط:' : 'Center Anime Artwork:'}</span>
                </span>
                <button
                  onClick={() => animeImageInputRef.current?.click()}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/30 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Upload className="w-3 h-3" />
                  <span>{language === 'ar' ? 'رفع صورة مخصصة' : 'Upload Custom'}</span>
                </button>
                <input
                  ref={animeImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAnimeImage}
                  className="hidden"
                />
              </div>

              {/* Horizontal Scroll of Anime Presets */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
                {ANIME_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedAnimeImage(preset.imageUrl)}
                    className={`flex-shrink-0 relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                      selectedAnimeImage === preset.imageUrl
                        ? 'border-emerald-400 scale-105 shadow-md shadow-emerald-400/30'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                    title={preset.name}
                  >
                    <img
                      src={preset.imageUrl}
                      alt={preset.name}
                      className="w-12 h-12 object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-white py-0.5 text-center truncate px-0.5">
                      {preset.animeName}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Voice Player Section */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-red-400" />
                  <span>صوتك المسجل للستوري:</span>
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>تغيير الصوت</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleUploadAudio}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Audio Controls Bar */}
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                <button
                  onClick={handleToggleAudio}
                  disabled={!activeAudioUrl}
                  className={`p-2.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    !activeAudioUrl
                      ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                      : isPlayingAudio
                      ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30'
                      : 'bg-cyan-400 text-black hover:scale-105 shadow-lg shadow-cyan-400/30'
                  }`}
                >
                  {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-bold">
                      {activeAudioUrl ? 'جاهز للعرض والتصدير كفيديو' : 'لا يوجد صوت مسجل حالياً'}
                    </span>
                    <span className="text-cyan-400 font-bold">
                      {formatTime(audioCurrentTime)} / {formatTime(audioDuration || 15)}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-150"
                      style={{
                        width: `${audioDuration > 0 ? (audioCurrentTime / audioDuration) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LIVE PREVIEW CONTAINER */}
        <div className="flex justify-center p-4 rounded-2xl bg-black/60 border border-white/5 overflow-hidden">
          <div
            className={`relative rounded-3xl border-4 transition-all duration-300 shadow-2xl p-5 sm:p-7 flex flex-col items-center justify-between text-center select-none overflow-hidden ${
              ratio === 'story'
                ? 'w-[320px] sm:w-[350px] aspect-[9/16]'
                : ratio === 'portrait'
                ? 'w-[320px] sm:w-[360px] aspect-[4/5]'
                : 'w-[320px] sm:w-[370px] aspect-square'
            } ${themeConfig.containerClass} ${themeConfig.cardBorder}`}
          >
            {/* Ambient Background Lighting */}
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: themeConfig.glowColor }}
            />
            <div className="absolute inset-2 border border-white/10 rounded-2xl pointer-events-none" />

            {/* Top Branding Badge */}
            <div className="space-y-1 relative z-10">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${themeConfig.badgeBg}`}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>YONA VOCAL STUDIO</span>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
              </div>
              <p className="text-[10px] text-red-400 font-extrabold font-mono uppercase tracking-wider">
                Vocals Only • بصوتك بدون موسيقى
              </p>
            </div>

            {/* CENTER ANIME ARTWORK WITH NEON / GOLD GLOW (صورة الأنمي في الوسط) */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="relative group">
                <div
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-4 shadow-2xl transition-all duration-300 group-hover:scale-105"
                  style={{
                    borderColor: themeConfig.primary,
                    boxShadow: `0 0 30px ${themeConfig.primary}55`
                  }}
                >
                  <img
                    src={selectedAnimeImage}
                    alt={song}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Score Badge on Center Anime */}
                <div
                  className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-2xl bg-black/90 border-2 flex items-center gap-1.5 shadow-xl"
                  style={{ borderColor: themeConfig.secondary }}
                >
                  <Crown className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-base sm:text-lg font-black font-mono text-white">{score}%</span>
                </div>
              </div>

              {/* Singer Name & Song Title */}
              <div className="mt-6 space-y-1">
                <h4
                  className="text-xs sm:text-sm font-black tracking-wide font-tajawal"
                  style={{ color: themeConfig.primary }}
                >
                  {rank}
                </h4>
                <h3 className="text-base sm:text-xl font-black text-white font-tajawal">
                  {singer}
                </h3>
                <p className="text-xs sm:text-sm font-bold opacity-90 max-w-[260px] truncate" style={{ color: themeConfig.textSecondary }}>
                  شارة: « {song} »
                </p>
                <span className="text-[10px] text-slate-400 block font-medium">
                  {pitch}
                </span>
              </div>
            </div>

            {/* LIVE ANIMATED SOUNDWAVES BARS */}
            <div className="relative z-10 my-2 flex items-center justify-center gap-1">
              {Array.from({ length: 18 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isPlayingAudio ? 'animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: i % 2 === 0 ? themeConfig.primary : themeConfig.secondary,
                    height: isPlayingAudio
                      ? `${Math.max(8, (Math.sin(i * 0.8 + audioCurrentTime * 5) + 1) * 16)}px`
                      : `${Math.max(6, Math.sin(i * 0.5) * 14 + 10)}px`
                  }}
                />
              ))}
            </div>

            {/* Footer Seal */}
            <div className="relative z-10 pt-2 border-t border-white/10 w-full text-center space-y-0.5">
              <p className="text-[10px] text-slate-300 font-medium">
                مسابقة شارات الأنمي وسبيستون الصوتية • {dateStr}
              </p>
              <p className="text-[9px] font-mono tracking-widest uppercase font-bold" style={{ color: themeConfig.primary }}>
                yona-songs • official vocal story
              </p>
            </div>
          </div>
        </div>

        {/* Video Progress Bar if exporting */}
        {isExportingVideo && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
              <span className="flex items-center gap-2">
                <Video className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>{language === 'ar' ? 'جاري تسجيل وتصدير فيديو الستوري مع صوتك...' : 'Recording & exporting story video with vocals...'}</span>
              </span>
              <span>{exportProgress}%</span>
            </div>
            <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 transition-all duration-200"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-300 text-center">
              {language === 'ar'
                ? 'سيتم تحميل فيديو جاهز للنشر على Instagram Story / TikTok / Reels مباشرة فور اكتمال المعالجة'
                : 'Your video ready for Instagram Story / TikTok / Reels will download upon completion'}
            </p>
          </div>
        )}

        {/* ACTION BUTTONS: Video with Audio, Image PNG, Share, Caption */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          
          {/* Main Hero Button: Export Video with Sound */}
          <button
            onClick={handleExportVideoWithAudio}
            disabled={isExportingVideo}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02]"
          >
            <Video className="w-4 h-4 text-black" />
            <span>
              {isExportingVideo
                ? (language === 'ar' ? 'جارٍ تسجيل الفيديو...' : 'Exporting Video...')
                : (language === 'ar' ? 'تصدير فيديو مع الصوت' : 'Export Video with Audio')}
            </span>
          </button>

          {/* Download Image (PNG) */}
          <button
            onClick={handleDownloadImage}
            disabled={isGeneratingImage}
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02]"
          >
            <Download className="w-4 h-4 text-black" />
            <span>
              {isGeneratingImage
                ? (language === 'ar' ? 'جارٍ التوليد...' : 'Generating Image...')
                : (language === 'ar' ? 'تحميل كصورة (PNG)' : 'Download Image (PNG)')}
            </span>
          </button>

          {/* Share to Mobile Story / TikTok */}
          <button
            onClick={handleShareMobile}
            className="py-3 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>{language === 'ar' ? 'مشاركة للستوري / تيك توك' : 'Share to Story / TikTok'}</span>
          </button>

          {/* Copy Caption & Hashtags */}
          <button
            onClick={handleCopyText}
            className="py-3 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer border border-white/10 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>
              {copied
                ? (language === 'ar' ? 'تم نسخ النص!' : 'Caption Copied!')
                : (language === 'ar' ? 'نسخ كابشن المنشور' : 'Copy Caption & Hashtags')}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
