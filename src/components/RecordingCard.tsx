import React from 'react';
import { Recording } from '../types';
import { Play, Heart, Film, Activity, Disc3 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface RecordingCardProps {
  recording: Recording;
  onSelect: (recording: Recording) => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({
  recording,
  onSelect,
  isFavorite,
  onToggleFavorite,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();

  // Construct Youtube Thumbnail URL or fallback to Anime Cover
  const ytId = recording.youtubeVideo?.youtubeVideoId;
  const thumbnailUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : recording.animeList?.[0]?.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';

  const rawArtist = recording.artists?.[0]?.name || 'يونا (Yona)';
  const artistName = language === 'en' ? (rawArtist.includes('يونا') ? 'Yona' : rawArtist) : rawArtist;
  const rawAnime = recording.animeList?.[0]?.title || 'شارات سبيستون الخالدة';
  const animeTitle = translateAnime(rawAnime);
  const displayTitle = translateSong(recording.song?.title || recording.title);

  return (
    <div
      onClick={() => onSelect(recording)}
      className="group relative rounded-2xl bg-[#0e1320]/80 hover:bg-[#121c2e]/95 p-3 sm:p-3.5 border border-white/[0.08] hover:border-sky-300/70 shadow-md hover:shadow-[0_0_30px_rgba(56,189,248,0.25)] transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between overflow-hidden backdrop-blur-md"
    >
      {/* Outer Subtle Ice Blue & Turquoise Glow Aura on Hover */}
      <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-teal-400/0 via-sky-300/35 to-cyan-400/0 opacity-0 group-hover:opacity-100 blur-sm transition-all duration-500 pointer-events-none z-0" />

      {/* Album Artwork Jacket (Square Poster) */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#070b14] shadow-md">
        {/* Subtle Vinyl Disc Rim Peek on Hover */}
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-36 h-36 rounded-full bg-[#111622] border-4 border-[#1f293d] shadow-2xl opacity-0 group-hover:opacity-100 group-hover:-left-4 transition-all duration-500 pointer-events-none hidden sm:flex items-center justify-center z-0">
          <div className="w-28 h-28 rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-18 h-18 rounded-full border border-white/10 flex items-center justify-center bg-[#151b28]">
              <div className="w-8 h-8 rounded-full bg-sky-300 border-2 border-black/80 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black" />
              </div>
            </div>
          </div>
        </div>

        {/* High-Resolution Album Artwork */}
        <img
          src={thumbnailUrl}
          alt={recording.song?.title || recording.title}
          className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Vintage Sleeve Lighting & Glare Reflection */}
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Top Badges - Turquoise Green & Ice Blue */}
        <div className={`absolute top-2.5 ${isRtl ? 'right-2.5' : 'left-2.5'} z-20 flex items-center gap-1.5`}>
          <span className="px-2.5 py-0.5 rounded-full bg-teal-400/15 text-teal-200 border border-teal-400/30 text-[10px] font-bold backdrop-blur-md shadow-sm tracking-wide">
            {t('cardVocalsOnly')}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={(e) => onToggleFavorite(e, recording.id)}
          className={`absolute top-2.5 ${isRtl ? 'left-2.5' : 'right-2.5'} z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-slate-300 hover:text-rose-400 transition-colors backdrop-blur-md shadow-sm`}
          title={isFavorite ? t('cardRemoveFav') : t('cardAddToFav')}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Smooth Hover Play Effect - Ice Blue / Turquoise Button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-300 to-sky-300 hover:from-teal-200 hover:to-sky-100 text-slate-950 flex items-center justify-center shadow-xl shadow-black/80 transform scale-90 group-hover:scale-100 transition-all duration-300 ease-out">
            <Play className={`w-5 h-5 fill-slate-950 ${isRtl ? 'mr-0.5' : 'ml-0.5'}`} />
          </div>
        </div>

        {/* Bottom Metadata Inside Artwork (BPM & Key) */}
        <div className="absolute bottom-2.5 inset-x-2.5 z-20 flex items-center justify-between text-[10px] font-mono pointer-events-none">
          {recording.bpm ? (
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-teal-400/30 text-teal-300 font-bold flex items-center gap-1 shadow-sm">
              <Activity className="w-2.5 h-2.5 text-teal-400" />
              {recording.bpm} BPM
            </span>
          ) : <span />}

          {recording.musicalKey && (
            <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-sky-300/30 text-sky-200 font-bold shadow-sm">
              {recording.musicalKey}
            </span>
          )}
        </div>
      </div>

      {/* Album Poster Information Footer */}
      <div className={`pt-3 pb-1 px-1 space-y-1.5 ${isRtl ? 'text-right' : 'text-left'}`}>
        <h3 className={`font-bold text-sm sm:text-base text-slate-100 group-hover:text-sky-200 transition-colors truncate ${isRtl ? 'font-tajawal' : 'font-sans'}`}>
          {displayTitle}
        </h3>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <Disc3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-300 transition-colors flex-shrink-0" />
            <span className="truncate text-slate-300 text-[11px] font-medium">
              {artistName}
            </span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 group-hover:text-sky-200 text-[11px] truncate flex-shrink-0 transition-colors">
            <Film className="w-3 h-3 flex-shrink-0" />
            <span className="truncate max-w-[90px]">{animeTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
