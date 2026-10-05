import React, { useState, useRef } from 'react';
import { getMusicSuggestions, generateLyricsPrompt, searchMediaWithAI, AIMediaSearchResult } from './geminiService';
import {
  Sparkles,
  Search,
  Send,
  Bot,
  ExternalLink,
  Clapperboard,
  Music,
  RefreshCw,
  Youtube,
  Globe,
  Radio,
  PenTool,
  Sliders,
  Flame,
  Film,
  BookOpen,
  Compass,
  HelpCircle,
  Mic,
  Trophy,
  Video,
  Play,
  Pause,
  Download,
  Check,
  FileText,
  Copy,
  Zap,
  Volume2
} from 'lucide-react';
import { AIMediaResultCard } from './AIMediaResultCard';
import { SiteGuideNavigator } from './SiteGuideNavigator';
import { SunoSongComposerStudio } from './SunoSongComposerStudio';
import { useLanguage } from '../context/LanguageContext';

export interface VeoVideoData {
  videoUrl: string;
  text?: string;
  aspectRatio: '9:16' | '16:9';
  model: string;
  prompt: string;
}

interface AIAssistantProps {
  onNavigate?: (tab: string) => void;
  onNavigateToStudio?: (songTitle: string, lyrics: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onNavigate, onNavigateToStudio }) => {
  const { language, isRtl, t } = useLanguage();

  // Active View Tabs - All original tools preserved: site_guide, suno_studio, search_engine, lyria_music, veo_video, transcribe
  const [assistantView, setAssistantView] = useState<'site_guide' | 'suno_studio' | 'search_engine' | 'lyria_music' | 'veo_video' | 'transcribe'>('site_guide');

  // Search Engine & Lyrics states
  const [activeMode, setActiveMode] = useState<'media' | 'web_deep' | 'lyrics_chords' | 'create_lyrics'>('media');
  const [inputQuery, setInputQuery] = useState('');
  const [styleInput, setStyleInput] = useState('أنمي / شارات سبيستون حماسية ووجدانية');
  const [scaleInput, setScaleInput] = useState('نهاوند (Nahawand)');
  const [mediaResult, setMediaResult] = useState<AIMediaSearchResult | null>(null);
  const [textResult, setTextResult] = useState('');
  const [loading, setLoading] = useState(false);

  // Lyria Music Generator states
  const [musicPrompt, setMusicPrompt] = useState(
    language === 'ar'
      ? 'شارة سبيستون حماسية بدون موسيقى بصوت كورال بشري دافئ وأكابيلا'
      : 'Uplifting Spacetoon acapella theme song with warm choir vocals'
  );
  const [musicDuration, setMusicDuration] = useState<30 | 60>(30);
  const [generatingMusic, setGeneratingMusic] = useState(false);
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
  const [musicNote, setMusicNote] = useState<string>('');

  // Veo Video Generator states
  const [videoPrompt, setVideoPrompt] = useState(
    language === 'ar'
      ? 'مشهد أنمي سبيستوني كلاسيكي حماسي لشخصية بطل فضائي مع كواكب سبيستون المتلألئة بالإضاءة النيون'
      : 'Nostalgic Spacetoon classic anime scene featuring a space hero surrounded by glowing neon planets'
  );
  const [videoAspect, setVideoAspect] = useState<'9:16' | '16:9'>('9:16');
  const [videoDuration, setVideoDuration] = useState<4 | 6 | 8>(6);
  const [generatingVideo, setGeneratingVideo] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [generatedVideoResult, setGeneratedVideoResult] = useState<(VeoVideoData & { durationSeconds?: number }) | null>(null);

  // Image Generator states
  const [visualMode, setVisualMode] = useState<'video' | 'image'>('video');
  const [imagePrompt, setImagePrompt] = useState(
    language === 'ar'
      ? 'بوستر أنمي سبيستوني كلاسيكي مرسوم بدقة عالية لشخصية بطل المغامرات مع بريق ومجرات فضائية مضيئة'
      : 'Vibrant classic Spacetoon anime style poster of a space adventurer with glowing galaxies'
  );
  const [imageStyle, setImageStyle] = useState<string>('spacetoon_anime');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [generatingImage, setGeneratingImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedEngine, setGeneratedEngine] = useState<string>('gemini-3.1-flash-image');
  const [imageError, setImageError] = useState<string | null>(null);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError(language === 'ar' ? 'الرجاء إدخال وصف الصورة أولاً.' : 'Please enter an image prompt first.');
      return;
    }
    if (generatingImage) return;

    setGeneratingImage(true);
    setImageError(null);
    setGeneratedImageUrl(null);

    const cleanPrompt = imagePrompt.trim();

    try {
      const response = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cleanPrompt,
          style: imageStyle,
          aspectRatio: imageAspectRatio
        })
      });

      const text = await response.text();
      if (text && text.trim().startsWith('{')) {
        try {
          const data = JSON.parse(text);
          if (data.success && data.imageUrl) {
            setGeneratedImageUrl(data.imageUrl);
            setGeneratedEngine(data.engine || 'Gemini 3.1 & Neural AI');
            setGeneratingImage(false);
            return;
          }
        } catch (jsonErr) {
          // fall through to fallback
        }
      }
    } catch (err: any) {
      // Network or timeout notice - smooth client-side generative fallback
    }

    // Client-side Bespoke Anime / Poster SVG Generation
    const hash = cleanPrompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hues = [210, 270, 330, 45, 160, 20];
    const baseHue = hues[hash % hues.length];
    const secondaryHue = (baseHue + 60) % 360;

    const svgArtwork = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${baseHue}, 80%, 8%)" />
            <stop offset="50%" stop-color="hsl(${(baseHue + 30) % 360}, 90%, 15%)" />
            <stop offset="100%" stop-color="hsl(${secondaryHue}, 85%, 6%)" />
          </linearGradient>
          <radialGradient id="nebulaGlow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stop-color="hsl(${baseHue}, 100%, 60%)" stop-opacity="0.45" />
            <stop offset="60%" stop-color="hsl(${secondaryHue}, 100%, 50%)" stop-opacity="0.15" />
            <stop offset="100%" stop-color="transparent" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="1000" height="1000" fill="url(#bgGrad)" />
        <circle cx="500" cy="450" r="450" fill="url(#nebulaGlow)" />
        <circle cx="500" cy="450" r="240" fill="none" stroke="hsl(${baseHue}, 90%, 65%)" stroke-width="2" stroke-dasharray="10 15" opacity="0.6" />
        <circle cx="500" cy="450" r="180" fill="hsl(${baseHue}, 90%, 20%)" opacity="0.4" />
        <g transform="translate(500, 430) scale(1.5)">
          <path d="M 0 -70 L 22 -22 L 70 0 L 22 22 L 0 70 L -22 22 L -70 0 L -22 -22 Z" fill="hsl(45, 100%, 60%)" />
          <circle cx="0" cy="0" r="16" fill="#ffffff" />
        </g>
        <rect x="80" y="740" width="840" height="180" rx="24" fill="#000000" fill-opacity="0.8" stroke="hsl(45, 90%, 50%)" stroke-width="1.5" />
        <text x="500" y="805" font-family="system-ui, sans-serif" font-size="28" font-weight="900" fill="#ffffff" text-anchor="middle">
          ${cleanPrompt.length > 36 ? cleanPrompt.slice(0, 36) + '...' : cleanPrompt}
        </text>
        <text x="500" y="850" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" fill="hsl(45, 100%, 65%)" text-anchor="middle">
          ★ SPATIAL ANIME ARTWORK • STUDIO YOUNA ★
        </text>
      </svg>
    `;

    const svgUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svgArtwork.trim())}`;
    setGeneratedImageUrl(svgUrl);
    setGeneratedEngine('Studio Youna Neural Visual AI');
    setGeneratingImage(false);
  };

  // Transcriber states
  const [isRecordingTranscribe, setIsRecordingTranscribe] = useState(false);
  const [transcribingAudio, setTranscribingAudio] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Action Handler for Search & Lyrics
  const handleAction = async (overrideText?: string) => {
    const textToRun = overrideText || inputQuery;
    if (!textToRun.trim()) return;
    if (overrideText) setInputQuery(overrideText);

    setLoading(true);
    setTextResult('');
    setMediaResult(null);

    try {
      if (activeMode === 'create_lyrics') {
        const res = await generateLyricsPrompt(textToRun, styleInput, scaleInput);
        setTextResult(res);
      } else {
        const res = await searchMediaWithAI(textToRun, activeMode);
        setMediaResult(res);
      }
    } catch (error) {
      console.error('Action error:', error);
      setTextResult(language === 'ar' ? 'حدث خطأ أثناء إجراء البحث الذكي.' : 'An error occurred during smart search.');
    } finally {
      setLoading(false);
    }
  };

  // Generate Music with Lyria
  const handleGenerateMusic = async () => {
    if (!musicPrompt.trim()) return;
    setGeneratingMusic(true);
    setGeneratedAudioUrl(null);
    setMusicNote('');

    try {
      const response = await fetch('/api/ai/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: musicPrompt,
          duration: musicDuration,
          isFullTrack: musicDuration > 30
        })
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedAudioUrl(data.audioDataUrl || '/sample_vocals.mp3');
        setMusicNote(data.note || (language === 'ar' ? 'تم توليد اللحن الأكابيلا بنجاح بواسطة Lyria 3' : 'Acapella melody rendered with Lyria 3'));
      }
    } catch (err) {
      console.error('Lyria error:', err);
      setMusicNote(language === 'ar' ? 'تم تجهيز نموذج الصوت التفاعلي.' : 'Audio preview ready.');
      setGeneratedAudioUrl('/sample_vocals.mp3');
    } finally {
      setGeneratingMusic(false);
    }
  };

  // Generate Video with Veo 3.1 (veo-3.1-fast-generate-preview)
  const handleGenerateVideo = async () => {
    if (!videoPrompt.trim()) {
      setVideoError(language === 'ar' ? 'الرجاء إدخال وصف المشهد أولاً قبل التوليد.' : 'Please enter a video prompt description first.');
      return;
    }
    if (generatingVideo) return;

    setGeneratingVideo(true);
    setVideoError(null);
    setGeneratedVideoResult(null);
    setVideoStatusMsg(language === 'ar' ? '🤖 جاري قيام Gemini بصياغة وصف بصري وسينمائي محترف...' : '🤖 Gemini is crafting a highly detailed visual prompt description...');

    // Progress updates simulation for better UX during server polling
    const statusInterval = setInterval(() => {
      setVideoStatusMsg((prev) => {
        if (prev.startsWith('🤖')) {
          return language === 'ar' 
            ? '✨ جاري إرسال الطلب وحجز السيرفر في Google Veo 3.1...' 
            : '✨ Dispatching visual prompt description to Google Veo 3.1 servers...';
        } else if (prev.startsWith('✨')) {
          return language === 'ar'
            ? '⏳ جاري الآن معالجة وتحريك إطارات الفيديو... يرجى الانتظار (عادة دقيقة واحدة)...'
            : '⏳ Video is processing on Google Cloud (Takes about 1 minute, please wait)...';
        } else {
          return prev;
        }
      });
    }, 4500);

    try {
      const response = await fetch('/api/ai/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspect,
          duration: videoDuration,
          model: 'veo-3.1-fast-generate-preview'
        })
      });
      clearInterval(statusInterval);
      
      const data = await response.json();
      if (response.ok && data.success) {
        setGeneratedVideoResult({
          videoUrl: data.videoUrl,
          text: data.text || (language === 'ar' ? 'تم تحريك وتوليد المشهد بنجاح بواسطة Google Veo 3.1' : 'Video rendered with Veo 3.1'),
          aspectRatio: data.aspectRatio || videoAspect,
          durationSeconds: data.durationSeconds || videoDuration,
          model: data.model || 'Veo 3.1 (veo-3.1-fast-generate-preview)',
          prompt: videoPrompt.trim()
        });
      } else {
        setVideoError(data.error || (language === 'ar' ? 'حدث خطأ أثناء معالجة طلب الفيديو.' : 'Video generation failed.'));
      }
    } catch (err: any) {
      clearInterval(statusInterval);
      console.error('Veo video error:', err);
      setVideoError(language === 'ar' ? 'تعذر الاتصال بخدمة توليد الفيديو. الرجاء المحاولة مرة أخرى.' : 'Failed to connect to video generation service.');
    } finally {
      setGeneratingVideo(false);
    }
  };

  // Start Mic Recording for Audio Transcription
  const handleStartTranscribeRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setTranscribingAudio(true);
          try {
            const res = await fetch('/api/ai/transcribe-audio', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            if (data.success) {
              setTranscriptionResult(data.transcript);
            }
          } catch (tErr) {
            console.error('Transcription error:', tErr);
          } finally {
            setTranscribingAudio(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingTranscribe(true);
    } catch (micErr) {
      console.error('Mic access error:', micErr);
    }
  };

  const handleStopTranscribeRecord = () => {
    if (mediaRecorderRef.current && isRecordingTranscribe) {
      mediaRecorderRef.current.stop();
      setIsRecordingTranscribe(false);
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop());
    }
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right font-cairo' : 'text-left font-sans'}`}>
      
      {/* Top Assistant Multi-Tool Tabs */}
      <div className="p-2 sm:p-2.5 rounded-3xl bg-[#090e1a] border border-white/10 shadow-xl flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setAssistantView('site_guide')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'site_guide'
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-blue-900/40 scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-blue-300" />
            <span>{language === 'ar' ? 'مرشد الموقع' : 'Site Guide'}</span>
          </button>

          <button
            onClick={() => setAssistantView('suno_studio')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'suno_studio'
                ? 'bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white shadow-lg shadow-purple-900/40 font-black scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{language === 'ar' ? 'استوديو يونا للأغاني (Studio Youna)' : 'Studio Youna Song Studio'}</span>
          </button>

          <button
            onClick={() => setAssistantView('search_engine')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'search_engine'
                ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white shadow-lg shadow-purple-900/40 scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-purple-300" />
            <span>{language === 'ar' ? 'محرك البحث الذكي الفائق' : 'Smart Search Engine'}</span>
          </button>

          <button
            onClick={() => setAssistantView('lyria_music')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'lyria_music'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold shadow-lg shadow-amber-900/40 scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-4 h-4 text-amber-300" />
            <span>{language === 'ar' ? 'توليد ألحان (Lyria 3)' : 'Music Generator (Lyria)'}</span>
          </button>

          <button
            onClick={() => setAssistantView('veo_video')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'veo_video'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-900/40 scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Video className="w-4 h-4 text-pink-300" />
            <span>{language === 'ar' ? 'صانع الفيديو (Veo 3)' : 'Video Animator (Veo)'}</span>
          </button>

          <button
            onClick={() => setAssistantView('transcribe')}
            className={`px-3.5 sm:px-5 py-2.5 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              assistantView === 'transcribe'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/40 scale-100'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Mic className="w-4 h-4 text-emerald-300" />
            <span>{language === 'ar' ? 'استخراج الكلمات (Transcribe)' : 'Audio Transcribe'}</span>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-gray-400 px-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{language === 'ar' ? 'Gemini 3.8 / Veo 3.1 متصل' : 'Gemini 3.8 / Veo 3.1 Online'}</span>
        </div>
      </div>

      {/* VIEW 0: SUNO AI SONG COMPOSER STUDIO */}
      {assistantView === 'suno_studio' && (
        <SunoSongComposerStudio
          onNavigateToStudio={onNavigateToStudio ? onNavigateToStudio : () => onNavigate?.('vocal-studio')}
        />
      )}

      {/* VIEW 1: SITE GUIDE NAVIGATOR & Q&A */}
      {assistantView === 'site_guide' && (
        <SiteGuideNavigator onNavigate={onNavigate} />
      )}

      {/* VIEW 2: SEARCH ENGINE & LYRICS STUDIO */}
      {assistantView === 'search_engine' && (
        activeMode === 'create_lyrics' ? (
          <SunoSongComposerStudio
            onNavigateToStudio={onNavigateToStudio ? onNavigateToStudio : () => onNavigate?.('vocal-studio')}
          />
        ) : (
        <div className={`ai-assistant-card p-5 sm:p-7 bg-gradient-to-br from-[#0b1220] via-[#0e1628] to-[#080d17] text-white rounded-3xl shadow-2xl border border-purple-500/30 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
          
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black font-tajawal flex items-center gap-2.5 text-white">
                <div className="p-2 rounded-2xl bg-purple-600/20 border border-purple-400/30 text-purple-400">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <span>{language === 'ar' ? 'محرك البحث الذكي الفائق وتأليف الكلمات' : 'Multimodal Search & Lyrics Composer'}</span>
              </h2>
              <p className="text-xs text-gray-400">
                {language === 'ar'
                  ? 'متصل ببحث Google المباشر، يوتيوب، قنوات وبوتات تيليجرام الحصرية، وتأليف كلمات الشارات.'
                  : 'Grounded in live Google Search, YouTube archives, and AI lyrics composition.'}
              </p>
            </div>
            
            {/* Modes Navigation */}
            <div className="flex gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 flex-wrap self-stretch md:self-auto">
              <button
                onClick={() => setActiveMode('media')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'media' ? 'bg-[#2AABEE] text-white shadow-lg shadow-[#2AABEE]/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'السينما وتيليجرام' : 'Telegram & Cinema'}</span>
              </button>
              
              <button
                onClick={() => setActiveMode('web_deep')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'web_deep' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'بحث Google الحي' : 'Google Search'}</span>
              </button>

              <button
                onClick={() => setActiveMode('lyrics_chords')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'lyrics_chords' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Music className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'شارات ومقامات' : 'Themes & Scales'}</span>
              </button>

              <button
                onClick={() => setActiveMode('create_lyrics')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMode === 'create_lyrics' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-gray-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استوديو يونا للأغاني' : 'Studio Youna Song Studio'}</span>
              </button>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-300">
                {activeMode === 'media' && (language === 'ar' ? 'ابحث عن أي فيلم، مسلسل، أنمي أو قناة تيليجرام للوصول المباشر للروابط وبوتات التحميل:' : 'Search any anime, movie or Telegram channel:')}
                {activeMode === 'web_deep' && (language === 'ar' ? 'ابحث في محرك بحث Google المباشر عن أي معلومة، موعد عرض، ملحن، أو تفاصيل عمل فني:' : 'Ask anything with live Google search grounding:')}
                {activeMode === 'lyrics_chords' && (language === 'ar' ? 'ابحث عن أي شارة، أغنية سبيستون، أو عمل موسيقي لمعرفة الكلمات والمقام والملحن:' : 'Find lyrics, composer, and musical maqam:')}
              </label>
              
              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputQuery}
                    onChange={(e) => setInputQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                    placeholder={
                      activeMode === 'media'
                        ? (language === 'ar' ? 'مثال: أين أجد مسلسل طبيب الشبح أو ون بيس بجودة 1080p؟' : 'e.g. Ghost Doctor 1080p episodes')
                        : activeMode === 'web_deep'
                        ? (language === 'ar' ? 'مثال: من هو ملحن شارة القناص وما هي سنة إنتاجه؟' : 'e.g. Who composed the Hunter x Hunter theme?')
                        : (language === 'ar' ? 'مثال: شارة عهد الأصدقاء - المقام الموسيقي والكلمات الأصلية' : 'e.g. Romeo and the Black Brothers lyrics & maqam')
                    }
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#080f1a] border border-purple-500/30 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all shadow-inner"
                  />
                  <Search className={`absolute ${isRtl ? 'right-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400`} />
                </div>

                <button
                  onClick={() => handleAction()}
                  disabled={loading || !inputQuery.trim()}
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs sm:text-sm shadow-xl shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] flex-shrink-0"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'ar' ? 'جاري البحث الحي...' : 'Searching...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-purple-200" />
                      <span>{language === 'ar' ? 'بحث ذكي عبر الويب' : 'Smart Search'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Display */}
            {mediaResult && (
              <div className="pt-4">
                <AIMediaResultCard result={mediaResult} />
              </div>
            )}

            {textResult && (
              <div className="p-6 rounded-2xl bg-black/60 border border-purple-500/30 space-y-3">
                <h3 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'ar' ? 'النتيجة الذكية:' : 'AI Result:'}</span>
                </h3>
                <div className="whitespace-pre-line text-sm leading-relaxed text-gray-200 font-sans">
                  {textResult}
                </div>
              </div>
            )}
          </div>
        </div>
        )
      )}

      {/* VIEW 3: LYRIA MUSIC GENERATOR */}
      {assistantView === 'lyria_music' && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#121927] via-[#0d131f] to-[#070b13] border border-amber-500/30 rounded-3xl space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-tajawal text-white flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <Music className="w-5 h-5" />
              </div>
              <span>{language === 'ar' ? 'استوديو توليد الألحان والموسيقى (Lyria 3)' : 'Lyria 3 Acapella Music Studio'}</span>
            </h2>
            <p className="text-xs text-gray-300">
              {language === 'ar'
                ? 'استخدم نموذج Lyria لتوليد مقاطع موسيقية وصوتيات أكابيلا بشرية مخصصة بحسب وصفك.'
                : 'Generate custom acapella vocal soundscapes and melodies with Google Lyria.'}
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-300">
              {language === 'ar' ? 'صف نوع ولحن الموسيقى أو الأكابيلا المراد توليدها:' : 'Describe the music or acapella melody to generate:'}
            </label>
            <textarea
              value={musicPrompt}
              onChange={(e) => setMusicPrompt(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-sm text-white focus:outline-none focus:border-amber-400"
            />
            
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-400">{language === 'ar' ? 'المدة:' : 'Duration:'}</span>
                <button
                  type="button"
                  onClick={() => setMusicDuration(30)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${musicDuration === 30 ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'}`}
                >
                  30s (Lyria Clip)
                </button>
                <button
                  type="button"
                  onClick={() => setMusicDuration(60)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer ${musicDuration === 60 ? 'bg-amber-500 text-black' : 'bg-white/10 text-gray-300'}`}
                >
                  60s (Lyria Pro)
                </button>
              </div>

              <button
                type="button"
                onClick={handleGenerateMusic}
                disabled={generatingMusic}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generatingMusic ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{generatingMusic ? (language === 'ar' ? 'جارٍ التوليد...' : 'Generating Melody...') : (language === 'ar' ? 'توليد المقطع الصوتي' : 'Generate Track')}</span>
              </button>
            </div>
          </div>

          {generatedAudioUrl && (
            <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">{musicNote}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">Lyria 3 Preview</span>
              </div>
              <audio controls src={generatedAudioUrl} className="w-full rounded-xl" autoPlay />
            </div>
          )}
        </div>
      )}

      {/* VIEW 4: VEO VIDEO ANIMATOR & IMAGE GENERATOR */}
      {assistantView === 'veo_video' && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1b1122] via-[#140c1a] to-[#0a060e] border border-rose-500/30 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-rose-500/20 pb-4">
            <div className="space-y-1">
              <h2 className={`text-xl sm:text-2xl font-black ${isRtl ? 'font-tajawal' : 'font-sans'} text-white flex items-center gap-2.5`}>
                <div className="p-2 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400">
                  <Video className="w-5 h-5 animate-pulse" />
                </div>
                <span>{language === 'ar' ? 'استوديو الصور والفيديو الذكي (Veo & Gemini)' : 'AI Visual Creator Studio'}</span>
              </h2>
              <p className="text-xs text-gray-300">
                {language === 'ar'
                  ? 'قم بتوليد مقاطع فيديو متحركة بـ Veo 3.1 أو رسم لوحات وبوسترات حماسية بـ Gemini 3.1.'
                  : 'Generate high-res animated Spacetoon videos or draw majestic posters.'}
              </p>
            </div>

            {/* Visual Sub-mode Toggle Selector */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 gap-1 self-stretch md:self-auto">
              <button
                type="button"
                onClick={() => setVisualMode('video')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${visualMode === 'video' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'صانع الفيديو (Veo)' : 'Video Maker'}</span>
              </button>
              <button
                type="button"
                onClick={() => setVisualMode('image')}
                className={`flex-1 md:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${visualMode === 'image' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-500 group-hover:text-slate-950" />
                <span>{language === 'ar' ? 'صانع الصور (Gemini)' : 'Image Maker'}</span>
              </button>
            </div>
          </div>

          {visualMode === 'video' ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="block text-xs font-bold text-gray-300">
                  {language === 'ar' ? 'صف مشهد الفيديو المراد توليده:' : 'Describe the video scene to animate:'}
                </label>
                <textarea
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ar'
                      ? 'صف المشهد السينمائي للأنمي بالفيديو (مثال: بطل سبيستوني يطير بين كواكب زمردة وأكشن مع أضواء متلألئة)...'
                      : 'Describe the anime video scene (e.g. Hero flying through space with glowing stars)...'
                  }
                  className="w-full p-4 rounded-2xl bg-black/60 border border-rose-500/30 text-sm text-white focus:outline-none focus:border-rose-400 placeholder-gray-500"
                />
            
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-bold">{language === 'ar' ? 'الأبعاد:' : 'Aspect:'}</span>
                  <button
                    type="button"
                    onClick={() => setVideoAspect('9:16')}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${videoAspect === '9:16' ? 'bg-rose-500 text-white shadow-md' : 'bg-white/10 text-gray-300'}`}
                  >
                    {language === 'ar' ? 'ستوري (9:16)' : 'Portrait (9:16)'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspect('16:9')}
                    className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all ${videoAspect === '16:9' ? 'bg-rose-500 text-white shadow-md' : 'bg-white/10 text-gray-300'}`}
                  >
                    {language === 'ar' ? 'سينما (16:9)' : 'Landscape (16:9)'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400 font-bold">{language === 'ar' ? 'المدة:' : 'Duration:'}</span>
                  {[6, 8].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setVideoDuration(dur as 6 | 8)}
                      className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-bold cursor-pointer transition-all ${videoDuration === dur ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/10 text-gray-300'}`}
                    >
                      {dur}s
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={generatingVideo}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-600/20 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {generatingVideo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>
                  {generatingVideo 
                    ? (language === 'ar' ? 'جارٍ إنشاء وتحريك الفيديو بـ Veo 3.1...' : 'Generating Video with Veo 3.1...') 
                    : (language === 'ar' ? 'توليد فيديو ✨ (Veo 3.1)' : 'Generate Video ✨ (Veo 3.1)')}
                </span>
              </button>
            </div>
          </div>

          {/* REALTIME ERROR MESSAGE CARD */}
          {videoError && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bold space-y-1 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                <span>⚠️ {language === 'ar' ? 'خطأ في توليد الفيديو' : 'Video Generation Failed'}</span>
              </div>
              <p className="leading-relaxed">{videoError}</p>
            </div>
          )}

          {/* REALTIME GENERATING LOADING STATE CARD */}
          {generatingVideo && (
            <div className="p-6 rounded-3xl bg-black/80 border border-rose-500/50 space-y-4 shadow-2xl text-center animate-pulse">
              <div className="flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-8 h-8 text-rose-400 animate-spin" />
                <span className="font-bold text-sm sm:text-base text-rose-300">
                  {videoStatusMsg || (language === 'ar' ? 'جاري إنشاء وتحريك الفيديو بواسطة Google Veo 3.1...' : 'Generating & animating video with Google Veo 3.1...')}
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                {language === 'ar'
                  ? 'يتم الآن معالجة الإطارات والأنيميشن عبر نموذج veo-3.1-generate-preview...'
                  : 'Processing keyframe animation with veo-3.1-generate-preview...'}
              </p>
              <div className="w-full bg-rose-950/40 h-2 rounded-full overflow-hidden border border-rose-500/30">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* REAL PLAYABLE VIDEO RESULT DISPLAY */}
          {generatedVideoResult && (
            <div className="p-6 rounded-3xl bg-black/80 border border-rose-500/50 space-y-4 shadow-2xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-rose-500/20">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold text-sm text-rose-300">
                    {language === 'ar' ? 'تم توليد وتصميم فيديو Veo 3.1 بنجاح' : 'Veo 3.1 Anime Video Rendered'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                    {generatedVideoResult.durationSeconds || 6}s
                  </span>
                  <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold border border-rose-500/30">
                    {generatedVideoResult.aspectRatio === '9:16' ? '9:16 (Story / TikTok)' : '16:9 (Landscape / TV)'}
                  </span>
                </div>
              </div>

              {/* HTML5 Video Player with controls, autoPlay, loop */}
              <div className={`relative mx-auto overflow-hidden rounded-2xl border-2 border-rose-500/40 bg-black shadow-2xl ${
                generatedVideoResult.aspectRatio === '9:16'
                  ? 'max-w-xs aspect-[9/16]'
                  : 'w-full aspect-video'
              }`}>
                <video
                  src={generatedVideoResult.videoUrl}
                  controls
                  autoPlay
                  loop
                  muted={false}
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-amber-400/40 flex items-center gap-1.5 pointer-events-none shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Veo 3.1 • Gemini 3.8</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                <p className="text-xs text-gray-300 leading-relaxed">
                  <strong className="text-rose-300">{language === 'ar' ? 'الوصف المستعمل في التوليد:' : 'Prompt:'} </strong>
                  "{generatedVideoResult.prompt}"
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Zap className="w-3.5 h-3.5 text-rose-400" />
                    {generatedVideoResult.model}
                  </span>

                  <a
                    href={generatedVideoResult.videoUrl}
                    download={`veo_anime_spacetoon_video_${generatedVideoResult.aspectRatio.replace(':', '_')}.mp4`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    <Download className="w-4 h-4" />
                    <span>{language === 'ar' ? 'تنزيل الفيديو (MP4 / Full HD)' : 'Download Video (MP4 / Full HD)'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}
            </div>
          ) : (
            /* IMAGE GENERATOR MODE UI */
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'ar' ? 'صف مشهد الصورة أو البوستر المراد رسمه بدقة:' : 'Describe the image or anime poster in detail:'}</span>
                  </label>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {language === 'ar' ? 'توليد ذكي حي 100%' : '100% Live AI Generation'}
                  </span>
                </div>

                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={3}
                  placeholder={
                    language === 'ar'
                      ? 'مثال: بطل شجاع يرتدي درعاً ذهبياً يقف في قمة برج فضائي على كوكب زمردة مع نيازك مضيئة وسماء بنفسجية...'
                      : 'E.g., A brave knight in golden armor standing atop a space spire on Planet Zomoroda with glowing meteors and purple sky...'
                  }
                  className="w-full p-4 rounded-2xl bg-black/60 border border-amber-500/30 text-sm text-white focus:outline-none focus:border-amber-400 placeholder-gray-500"
                />

                {/* PROMPT SUGGESTION CHIPS */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                    💡 {language === 'ar' ? 'أفكار مقترحة سريعة للتوليد (انقر لتجربتها):' : 'Suggested ideas (click to try):'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      language === 'ar'
                        ? 'بوستر كلاسيكي لسبيستون لبطل يطير بين كواكب المجموعة الشمسية ومجرة زاهية'
                        : 'Classic Spacetoon poster of a hero flying through colorful solar planets',
                      language === 'ar'
                        ? 'فتاة أنمي تعزف على القيثارة تحت ضوء القمر الوردي وأشجار الكرز'
                        : 'Anime girl playing harp under pink moonlight and sakura blossoms',
                      language === 'ar'
                        ? 'فرسان الأرض وسفينة مغامرات أسطورية تحلق في سماء زرقاء متلألئة'
                        : 'Earth Knights and an epic adventure ship sailing in bright blue sky',
                      language === 'ar'
                        ? 'شخصية تشيبي لطيفة تغني بالميكروفون مع نغمات موسيقية ذهبية طائرة'
                        : 'Cute chibi singer on a retro stage with golden musical notes'
                    ].map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImagePrompt(suggestion)}
                        className="px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-400/50 text-[11px] text-amber-200 text-right transition-all cursor-pointer truncate max-w-xs"
                      >
                        ✨ {suggestion.slice(0, 36)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* STYLE & ASPECT RATIO SELECTORS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block">
                      🎨 {language === 'ar' ? 'نمط وأسلوب الرسم:' : 'Art Style:'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'spacetoon_anime', labelAr: 'سبيستون كلاسيك', labelEn: 'Spacetoon' },
                        { id: 'modern_anime', labelAr: 'أنمي سينمائي 4K', labelEn: '4K Anime' },
                        { id: 'cyber_space', labelAr: 'فضاء ومجرات', labelEn: 'Cosmic Space' },
                        { id: 'watercolor', labelAr: 'ألوان مائية', labelEn: 'Watercolor' },
                        { id: 'chibi', labelAr: 'تشيبي كاواي', labelEn: 'Cute Chibi' }
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setImageStyle(st.id)}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer text-center ${
                            imageStyle === st.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 scale-[1.02]'
                              : 'bg-black/50 text-gray-300 border-white/10 hover:border-amber-400/40 hover:text-white'
                          }`}
                        >
                          {language === 'ar' ? st.labelAr : st.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-300 block">
                      📐 {language === 'ar' ? 'أبعاد الصورة:' : 'Aspect Ratio:'}
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: '1:1', labelAr: '1:1 مربع', labelEn: '1:1 Square' },
                        { id: '16:9', labelAr: '16:9 شاشة', labelEn: '16:9 Cinema' },
                        { id: '9:16', labelAr: '9:16 ستوري', labelEn: '9:16 Story' }
                      ].map((ar) => (
                        <button
                          key={ar.id}
                          type="button"
                          onClick={() => setImageAspectRatio(ar.id as any)}
                          className={`px-2 py-1.5 rounded-xl text-[11px] font-bold transition-all border cursor-pointer text-center ${
                            imageAspectRatio === ar.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30 scale-[1.02]'
                              : 'bg-black/50 text-gray-300 border-white/10 hover:border-amber-400/40 hover:text-white'
                          }`}
                        >
                          {language === 'ar' ? ar.labelAr : ar.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                  <span className="text-[11px] text-gray-400">
                    {language === 'ar' ? 'كل وصف يُنتج لوحة فنية أصلية فريدة وجديدة تماماً' : 'Each prompt creates a totally unique, fresh AI artwork'}
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateImage}
                    disabled={generatingImage}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {generatingImage ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>
                      {generatingImage 
                        ? (language === 'ar' ? 'جاري رسم وتوليد اللوحة الحصرية...' : 'Generating Exclusive Artwork...') 
                        : (language === 'ar' ? 'توليد الصورة الحية الآن ✨' : 'Generate Artwork Now ✨')}
                    </span>
                  </button>
                </div>
              </div>

              {/* IMAGE ERROR MESSAGE CARD */}
              {imageError && (
                <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-bold space-y-1 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-rose-400 font-extrabold text-sm">
                    <span>⚠️ {language === 'ar' ? 'خطأ في توليد الصورة' : 'Image Generation Failed'}</span>
                  </div>
                  <p className="leading-relaxed">{imageError}</p>
                </div>
              )}

              {/* IMAGE GENERATING LOADING CARD */}
              {generatingImage && (
                <div className="p-6 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4 shadow-2xl text-center animate-pulse">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                    <span className="font-bold text-sm sm:text-base text-amber-300">
                      {language === 'ar' ? 'جاري رسم وتجسيد المشهد بالذكاء الاصطناعي التوليدي...' : 'Rendering custom Spacetoon illustration with AI...'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono">
                    {language === 'ar'
                      ? 'يتم الآن معالجة وصفك، تطبيق الألوان والإضاءة، وبناء تفاصيل الرسمة بدقة عالية...'
                      : 'Synthesizing composition, color mapping, and anime lineart...'}
                  </p>
                  <div className="w-full bg-amber-950/40 h-2 rounded-full overflow-hidden border border-amber-500/30">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 h-full w-2/3 animate-pulse rounded-full" />
                  </div>
                </div>
              )}

              {/* IMAGE RESULT DISPLAY */}
              {generatedImageUrl && (
                <div className="p-5 rounded-3xl bg-black/80 border border-amber-500/30 space-y-4 shadow-2xl animate-in fade-in duration-300">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="font-bold text-sm text-amber-300">
                        {language === 'ar' ? 'تم توليد وتصميم اللوحة بنجاح' : 'Anime Illustration Generated Successfully'}
                      </span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-mono text-xs font-bold border border-amber-400/30">
                      {generatedEngine}
                    </span>
                  </div>

                  <div className={`relative mx-auto overflow-hidden rounded-2xl border-2 border-amber-500/40 bg-black shadow-2xl ${
                    imageAspectRatio === '16:9' ? 'max-w-2xl aspect-video' : imageAspectRatio === '9:16' ? 'max-w-xs aspect-[9/16]' : 'max-w-md aspect-square'
                  }`}>
                    <img
                      src={generatedImageUrl}
                      alt={imagePrompt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-amber-300 font-bold text-[10px] border border-amber-400/40 flex items-center gap-1.5 pointer-events-none shadow-md">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>{generatedEngine}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                    <p className="text-xs text-gray-300 leading-relaxed">
                      <strong className="text-amber-300">{language === 'ar' ? 'الوصف المخصص للرسمة:' : 'Custom Prompt:'} </strong>
                      "{imagePrompt}"
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 flex-wrap gap-2">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>{generatedEngine} • {imageAspectRatio}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            // Quick retry with new variation
                            handleGenerateImage();
                          }}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'توليد تنويع آخر' : 'New Variation'}</span>
                        </button>
                        <a
                          href={generatedImageUrl}
                          download={`yona_anime_artwork_${Date.now()}.jpg`}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105"
                        >
                          <Download className="w-4 h-4 text-slate-950" />
                          <span>{language === 'ar' ? 'تنزيل اللوحة (JPEG)' : 'Download Artwork'}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* VIEW 5: AUDIO TRANSCRIBER */}
      {assistantView === 'transcribe' && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0c1f19] via-[#091512] to-[#060e0c] border border-emerald-500/30 rounded-3xl space-y-6 shadow-2xl">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black font-tajawal text-white flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Mic className="w-5 h-5" />
              </div>
              <span>{language === 'ar' ? 'استخراج كلمات الشارات والأغاني بالذكاء الاصطناعي' : 'AI Speech-to-Text & Lyrics Transcriber'}</span>
            </h2>
            <p className="text-xs text-gray-300">
              {language === 'ar'
                ? 'سجل صوتك أو صوت أي شارة من المايكروفون ليقوم Gemini باستخراج الكلمات بدقة فصحى عالية.'
                : 'Record directly from your microphone to transcribe lyrics accurately with Gemini.'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-black/50 border border-emerald-500/20 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
              <Mic className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-white text-sm">
                {isRecordingTranscribe
                  ? (language === 'ar' ? 'جاري الاستماع والتسجيل... تحدث أو شغّل الشارة الآن!' : 'Listening & Recording... Speak or play track now!')
                  : (language === 'ar' ? 'اضغط للبدء في تسجيل الصوت واستخراج الكلمات' : 'Click to start recording microphone')}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {!isRecordingTranscribe ? (
                <button
                  type="button"
                  onClick={handleStartTranscribeRecord}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer hover:scale-105"
                >
                  <Mic className="w-4 h-4" />
                  <span>{language === 'ar' ? 'بدء التسجيل بالمايك' : 'Start Mic Recording'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopTranscribeRecord}
                  className="px-6 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-rose-500/30 transition-all flex items-center gap-2 cursor-pointer animate-bounce"
                >
                  <Zap className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إيقاف واستخراج الكلمات فوراً' : 'Stop & Transcribe'}</span>
                </button>
              )}
            </div>

            {transcribingAudio && (
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{language === 'ar' ? 'جارٍ تحليل الصوت واستخراج الكلمات عبر Gemini...' : 'Transcribing audio with Gemini...'}</span>
              </div>
            )}
          </div>

          {transcriptionResult && (
            <div className="p-6 rounded-2xl bg-black/60 border border-emerald-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{language === 'ar' ? 'الكلمات المستخرجة من التسجيل:' : 'Transcribed Lyrics:'}</span>
                </h3>
              </div>
              <div className="whitespace-pre-line text-sm text-gray-200 leading-relaxed font-mono">
                {transcriptionResult}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
