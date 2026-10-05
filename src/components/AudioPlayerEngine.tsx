import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, Sparkles, ExternalLink, Music, ShieldCheck } from 'lucide-react';
import { recordLegitimateSongView } from '../lib/securityProtection';

interface AudioPlayerProps {
  youtubeVideoId: string;
  songTitle: string;
  artistName?: string;
  coverImage?: string;
}

export default function AudioPlayerEngine({
  youtubeVideoId,
  songTitle,
  artistName,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState<any>(null);
  const [useIframeFallback, setUseIframeFallback] = useState(false);
  const [playDuration, setPlayDuration] = useState(0);
  const [hasVerifiedView, setHasVerifiedView] = useState(false);
  const verifiedRef = useRef(false);

  const validYtId = (youtubeVideoId && youtubeVideoId.length >= 8) ? youtubeVideoId : '1F_lXhT2xQ0';

  // تتبع مدة الاستماع الحقيقية: احتساب المشاهدة بنزاهة بعد 10 ثوانٍ متواصلة فقط
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && !verifiedRef.current) {
      interval = setInterval(() => {
        setPlayDuration((prev) => {
          const next = prev + 1;
          if (next >= 10 && !verifiedRef.current) {
            verifiedRef.current = true;
            setHasVerifiedView(true);
            recordLegitimateSongView(validYtId);
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, validYtId]);

  // تعطيل Autoplay لتجنب التشغيل التلقائي الذي يسبب الصدى مع الميكروفون
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0, // تم التغيير من 1 إلى 0 لمنع التداخل والصدى
      controls: 1,
      modestbranding: 1,
      rel: 0,
      enablejsapi: 1,
      origin: typeof window !== 'undefined' ? window.location.origin : ''
    },
  };

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  // إيقاف تشغيل الفيديو فوراً إذا بدأ التسجيل في أي مكان بالصفحة
  useEffect(() => {
    const handleStopAudio = () => {
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
        setIsPlaying(false);
      }
    };

    window.addEventListener('stop-all-media', handleStopAudio);
    return () => {
      window.removeEventListener('stop-all-media', handleStopAudio);
    };
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    try {
      if (isPlaying) {
        player.pauseVideo();
        setIsPlaying(false);
      } else {
        player.playVideo();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-[#18181F] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Music className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono">
            مشغل يوتيوب المباشر (Vocals Only)
          </span>
          {hasVerifiedView ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/25 animate-in fade-in">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>مشاهدة نزيهة موثقة</span>
            </span>
          ) : isPlaying ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-lg border border-white/5 font-mono">
              جاري توثيق الاستماع ({Math.min(10, playDuration)}/10 ثوانٍ)
            </span>
          ) : null}
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${validYtId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
        >
          <span>مشاهدة في YouTube</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* إطار المشغل الحي */}
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-inner border border-white/5">
        {!useIframeFallback ? (
          <YouTube
            videoId={validYtId}
            opts={opts}
            onReady={onReady}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setUseIframeFallback(true)}
            className="w-full h-full absolute top-0 left-0"
          />
        ) : (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${validYtId}?autoplay=0&rel=0`}
            title={songTitle}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full absolute top-0 left-0 border-0"
          />
        )}
      </div>

      {/* شريط التحكم والمعلومات المرفقة */}
      <div className="flex items-center justify-between px-2 pt-1">
        <div>
          <h3 className="text-lg font-extrabold text-white font-tajawal">{songTitle}</h3>
          <p className="text-sm text-amber-500 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{artistName || 'نسخة بدون موسيقى - Yona Songs'}</span>
          </p>
        </div>

        <button
          onClick={togglePlay}
          className="p-3.5 bg-amber-500 hover:bg-amber-600 active:scale-95 transition-all rounded-full text-black font-bold flex items-center justify-center shadow-lg shadow-amber-500/25 cursor-pointer"
          aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
        </button>
      </div>
    </div>
  );
}

