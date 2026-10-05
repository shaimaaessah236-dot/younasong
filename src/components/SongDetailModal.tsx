import React from 'react';
import { Recording } from '../types';
import { X, Heart, Mic, Film, Activity, Share2, Sparkles, Youtube, Check, Music, FileText, Copy } from 'lucide-react';
import AudioPlayerEngine from './AudioPlayerEngine';
import { findSongLyrics } from '../lib/spacetoonLyricsData';
import { useLanguage } from '../context/LanguageContext';

interface SongDetailModalProps {
  recording: Recording | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, id: string) => void;
  onSelectRelated: (rec: Recording) => void;
  allRecordings: Recording[];
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  recording,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSelectRelated,
  allRecordings,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const [copied, setCopied] = React.useState(false);
  const [lyricsCopied, setLyricsCopied] = React.useState(false);

  if (!recording) return null;

  const ytId = recording.youtubeVideo?.youtubeVideoId || '1F_lXhT2xQ0';
  const artist = recording.artists?.[0];
  const anime = recording.animeList?.[0];

  // Resolve lyrics: either from recording directly or through spacetoon lyrics repository
  const matchedData = findSongLyrics(recording.title, anime?.title || recording.category || recording.song?.originalTitle);
  const displayLyrics = recording.fullLyrics || recording.lyrics || recording.song?.lyrics || matchedData?.lyrics;
  const displaySummary = recording.lyricsSummary || matchedData?.summary;

  const displaySongTitle = translateSong(recording.song?.title || recording.title);
  const displayAnimeTitle = translateAnime(anime?.title || (language === 'ar' ? 'سبيستون' : 'Spacetoon'));

  // Schema.org JSON-LD injection
  const schemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['MusicRecording', 'VideoObject'],
    'name': recording.title,
    'description': recording.song?.description || recording.lyricsSummary || 'تسجيل شارة بدون موسيقى بصوت بشري نقي',
    'byArtist': {
      '@type': 'MusicGroup',
      'name': artist?.name || 'Yona Songs',
    },
    'duration': recording.durationSeconds ? `PT${recording.durationSeconds}S` : 'PT2M30S',
    'embedUrl': `https://www.youtube.com/embed/${ytId}`,
    'thumbnailUrl': `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
    'genre': 'Vocals Only / Acapella / Spacetoon',
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCategoryId = recording.categories?.[0]?.id;
  const currentCategoryName = recording.categories?.[0]?.name || recording.category || (language === 'ar' ? 'نفس التصنيف' : 'Same Category');

  // Filter similar songs matching category or artist
  const similarSongs = allRecordings
    .filter(
      (r) =>
        r.id !== recording.id &&
        ((currentCategoryId && r.categories?.[0]?.id === currentCategoryId) ||
          (r.category && r.category === recording.category) ||
          (r.artists?.[0]?.id && artist?.id && r.artists?.[0]?.id === artist?.id))
    )
    .slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      
      {/* Schema.org Script Tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <div className={`relative w-full max-w-4xl rounded-3xl yona-glass border border-white/10 overflow-hidden my-8 max-h-[90vh] flex flex-col ${isRtl ? 'text-right' : 'text-left'}`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#18181F]/90">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F59E0B] animate-pulse" />
            <h2 className="font-tajawal font-extrabold text-lg text-white">
              {displaySongTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/30">
              Vocals Only
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* YouTube Audio Player Engine */}
          <AudioPlayerEngine
            youtubeVideoId={ytId}
            songTitle={displaySongTitle}
            artistName={artist?.name || (language === 'ar' ? 'يونا (Yona)' : 'Yona')}
          />

          {/* Song Primary Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#0F0F12] border border-white/5">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={(e) => onToggleFavorite(e, recording.id)}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all border cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-[#18181F] border-white/10 text-gray-300 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? (language === 'ar' ? 'في المفضلة' : 'Favorited') : (language === 'ar' ? 'إضافة للمفضلة' : 'Add to Favorites')}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-2 rounded-xl bg-[#18181F] border border-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? (language === 'ar' ? 'تم نسخ الرابط!' : 'Link Copied!') : (language === 'ar' ? 'مشاركة الرابط' : 'Share Link')}</span>
              </button>
            </div>

            <a
              href={`https://youtube.com/watch?v=${ytId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/20"
            >
              <Youtube className="w-4 h-4" />
              <span>{language === 'ar' ? 'مشاهدة على يوتيوب Yona Songs' : 'Watch on YouTube'}</span>
            </a>
          </div>

          {/* Detailed Audio Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#18181F] border border-white/5">
              <span className="text-gray-400 font-bold block mb-1">{language === 'ar' ? 'المؤدي / المغني:' : 'Performer / Artist:'}</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-[#F59E0B]" />
                {artist?.name || (language === 'ar' ? 'يونا (Yona)' : 'Yona')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#18181F] border border-white/5">
              <span className="text-gray-400 font-bold block mb-1">{language === 'ar' ? 'الأنمي / الشارة:' : 'Anime / Theme:'}</span>
              <span className="font-bold text-white flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5 text-emerald-400" />
                {anime?.title || (language === 'ar' ? 'سبيستون' : 'Spacetoon')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#18181F] border border-white/5">
              <span className="text-gray-400 font-bold block mb-1">{language === 'ar' ? 'إيقاع الـ BPM:' : 'Tempo (BPM):'}</span>
              <span className="font-bold text-amber-300 font-inter flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                {recording.bpm ? `${recording.bpm} BPM` : (language === 'ar' ? 'بدون موسيقى' : 'Vocals Only')}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#18181F] border border-white/5">
              <span className="text-gray-400 font-bold block mb-1">{language === 'ar' ? 'المقام الموسيقي:' : 'Musical Key:'}</span>
              <span className="font-bold text-emerald-300 font-inter">
                {recording.musicalKey || 'G Minor'}
              </span>
            </div>
          </div>

          {/* Description & Full Authentic Lyrics Display */}
          <div className="space-y-4 pt-2">
            {displayLyrics ? (
              <div className="p-5 rounded-2xl bg-[#0a0d14] border border-[#D4AF37]/20 shadow-lg space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span>{language === 'ar' ? 'كلمات الشارة الأصلية (الأرشيف الموثق):' : 'Authentic Song Lyrics (Archive):'}</span>
                  </h4>

                  <button
                    onClick={() => {
                      if (displayLyrics) {
                        navigator.clipboard.writeText(displayLyrics);
                        setLyricsCopied(true);
                        setTimeout(() => setLyricsCopied(false), 2000);
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-amber-300 flex items-center gap-1.5 transition-all border border-amber-500/20 cursor-pointer"
                    title={language === 'ar' ? 'نسخ الكلمات كاملة' : 'Copy Lyrics'}
                  >
                    {lyricsCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">{language === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'نسخ الكلمات' : 'Copy Lyrics'}</span>
                      </>
                    )}
                  </button>
                </div>

                {matchedData?.composer && (
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400">
                    <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                      {language === 'ar' ? 'الألحان:' : 'Composer:'} {matchedData.composer}
                    </span>
                    {matchedData.singer && (
                      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                        {language === 'ar' ? 'الغناء الأصلي:' : 'Original Singer:'} {matchedData.singer}
                      </span>
                    )}
                  </div>
                )}

                <div className="max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
                  <p className="text-sm text-gray-200 font-medium leading-loose whitespace-pre-line bg-black/40 p-4 rounded-xl border border-white/5 select-text">
                    {displayLyrics}
                  </p>
                </div>
              </div>
            ) : displaySummary ? (
              <div className="p-4 rounded-2xl bg-[#0a0d14] border border-white/[0.06] space-y-2">
                <h4 className="font-bold text-sm text-[#D4AF37] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>{language === 'ar' ? 'مقطع من الكلمات:' : 'Lyrics Excerpt:'}</span>
                </h4>
                <p className="text-sm text-gray-200 font-medium leading-relaxed italic bg-white/5 p-3 rounded-xl border border-white/5">
                  "{displaySummary}"
                </p>
              </div>
            ) : null}

            {recording.song?.description && (
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-white">{language === 'ar' ? 'نبذة وسياق الشارة:' : 'Track Background:'}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {recording.song.description}
                </p>
              </div>
            )}
          </div>

          {/* Similar Songs Section */}
          {similarSongs.length > 0 && (
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#F59E0B]" />
                  <span>{language === 'ar' ? `أغاني مشابهة (${currentCategoryName}):` : `Similar Tracks (${currentCategoryName}):`}</span>
                </h4>
                <span className="text-[10px] text-gray-400 font-medium">
                  {isRtl ? 'اسحب لمشاهدة المزيد ←' : 'Scroll for more →'}
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent">
                {similarSongs.map((rel) => {
                  const relYtId = rel.youtubeVideo?.youtubeVideoId || rel.youtube_id || 'b8qH5Q1x3Xg';
                  const thumbUrl = `https://img.youtube.com/vi/${relYtId}/hqdefault.jpg`;
                  return (
                    <button
                      key={rel.id}
                      onClick={() => onSelectRelated(rel)}
                      className={`flex-shrink-0 w-36 p-2 rounded-xl bg-[#18181F] border border-white/10 hover:border-[#F59E0B]/50 hover:bg-[#20202a] transition-all group cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
                    >
                      <div className="w-full h-20 rounded-lg bg-black overflow-hidden relative mb-2">
                        <img
                          src={thumbUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      </div>
                      <span className="block font-bold text-xs text-white group-hover:text-[#F59E0B] transition-colors truncate">
                        {rel.song?.title || rel.title}
                      </span>
                      <span className="block text-[10px] text-gray-400 truncate mt-0.5">
                        {rel.artists?.[0]?.name || rel.artist || (language === 'ar' ? 'ستوديو يونا' : 'Yona Studio')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
