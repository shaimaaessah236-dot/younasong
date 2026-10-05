import React, { useState } from 'react';
import { Recording } from '../types';
import { Play, Pause, Heart, Volume2, VolumeX, Maximize2, Sparkles, Youtube, Activity, Repeat, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface StickyAudioPlayerProps {
  recording: Recording | null;
  onExpand: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onClosePlayer: () => void;
}

export const StickyAudioPlayer: React.FC<StickyAudioPlayerProps> = ({
  recording,
  onExpand,
  isFavorite,
  onToggleFavorite,
  onClosePlayer,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);

  if (!recording) return null;

  const ytId = recording.youtubeVideo?.youtubeVideoId || '1F_lXhT2xQ0';

  return (
    <div className={`fixed bottom-0 inset-x-0 z-40 bg-[#0a0d14]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3 shadow-2xl ${isRtl ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Track Thumbnail & Title Info */}
        <div className="flex items-center gap-3 min-w-0 max-w-xs sm:max-w-md">
          <div
            onClick={onExpand}
            className="relative w-12 h-12 rounded-xl bg-black overflow-hidden flex-shrink-0 cursor-pointer group border border-white/[0.08]"
          >
            <img
              src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`}
              alt={recording.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="overflow-hidden">
            <h4
              onClick={onExpand}
              className={`font-bold text-sm text-slate-100 hover:text-teal-300 transition-colors truncate cursor-pointer ${isRtl ? 'font-tajawal' : 'font-sans'}`}
            >
              {translateSong(recording.song?.title || recording.title)}
            </h4>
            <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
              {recording.artists?.[0]?.name || (language === 'ar' ? 'يونا' : 'Yona')} • {translateAnime(recording.animeList?.[0]?.title || (language === 'ar' ? 'شارات سبيستون' : 'Spacetoon Themes'))}
            </p>
          </div>
        </div>

        {/* Center Audio Controls & Badges */}
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0e1422] border border-teal-400/20 text-xs font-mono font-bold text-teal-300">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            {recording.bpm ? `${recording.bpm} BPM` : 'Vocals Only'}
          </span>

          <span className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0e1422] border border-white/[0.06] text-xs font-mono font-bold text-sky-300">
            {recording.musicalKey || 'G Minor'}
          </span>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isLooping ? 'bg-teal-400/20 text-teal-300 border border-teal-400/30' : 'text-slate-400 hover:text-white'
            }`}
            title={language === 'ar' ? 'تكرار الأغنية' : 'Repeat Song'}
          >
            <Repeat className="w-4 h-4" />
          </button>

          <button
            onClick={onExpand}
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-400 to-sky-300 hover:from-teal-300 hover:to-sky-200 text-slate-950 font-bold flex items-center justify-center shadow-md shadow-teal-400/20 hover:scale-105 transition-all cursor-pointer"
            title={language === 'ar' ? 'تكبير المشغل وفيديو يوتيوب' : 'Expand Player & Video'}
          >
            <Play className={`w-4 h-4 fill-slate-950 ${isRtl ? 'mr-0.5' : 'ml-0.5'}`} />
          </button>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => onToggleFavorite(e, recording.id)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-white/[0.05] transition-colors cursor-pointer"
            title={language === 'ar' ? 'المفضلة' : 'Favorite'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          <button
            onClick={onExpand}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1422] hover:bg-white/[0.05] border border-white/[0.06] text-xs font-bold text-slate-200 hover:text-teal-300 transition-all cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 text-teal-300" />
            <span>{language === 'ar' ? 'عرض الفيديو والكلمات' : 'Lyrics & Video'}</span>
          </button>

          <a
            href={`https://youtube.com/watch?v=${ytId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-all cursor-pointer"
            title={language === 'ar' ? 'مشاهدة على يوتيوب' : 'Watch on YouTube'}
          >
            <Youtube className="w-4 h-4 text-red-500" />
          </a>

          <button
            onClick={onClosePlayer}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
            title={language === 'ar' ? 'إغلاق المشغل' : 'Close Player'}
            aria-label={language === 'ar' ? 'إغلاق المشغل' : 'Close Player'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
