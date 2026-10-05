import React, { useState } from 'react';
import { Artist, Recording } from '../types';
import { Mic, CheckCircle, Globe, Play, Sparkles, Youtube } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ArtistHubProps {
  artists: Artist[];
  allRecordings: Recording[];
  onSelectRecording: (rec: Recording) => void;
}

export const ArtistHub: React.FC<ArtistHubProps> = ({
  artists,
  allRecordings,
  onSelectRecording,
}) => {
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const [selectedArtistSlug, setSelectedArtistSlug] = useState<string>(artists[0]?.slug || 'yona');

  const selectedArtist = artists.find(a => a.slug === selectedArtistSlug) || artists[0];

  const artistRecordings = allRecordings.filter(rec =>
    rec.artists?.some(a => a.slug === selectedArtist.slug)
  );

  return (
    <div className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl yona-glass border border-white/10">
        <div>
          <h2 className={`text-2xl font-extrabold ${isRtl ? 'font-tajawal' : 'font-sans'} text-white flex items-center gap-2`}>
            <Mic className="w-6 h-6 text-[#F59E0B]" />
            <span>{t('artistHubTitle')}</span>
          </h2>
          <p className="text-sm text-gray-300 mt-1">
            {t('artistHubSubtitle')}
          </p>
        </div>

        {/* Quick Artist Select Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {artists.map((art) => (
            <button
              key={art.id}
              onClick={() => setSelectedArtistSlug(art.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedArtistSlug === art.slug
                  ? 'bg-[#F59E0B] text-black shadow-lg shadow-[#F59E0B]/20'
                  : 'bg-[#18181F] text-gray-300 hover:text-white border border-white/5'
              }`}
            >
              {language === 'ar' ? art.name : art.slug === 'yona' ? 'Yona' : art.name}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Artist Bio Card */}
      {selectedArtist && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl yona-glass border border-white/10 relative overflow-hidden">
          
          {/* Artist Avatar Image */}
          <div className="relative w-full aspect-square max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-[#F59E0B]/30 shadow-xl">
            <img
              src={selectedArtist.imageUrl}
              alt={selectedArtist.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F12] via-transparent to-transparent" />
            {selectedArtist.isVerified && (
              <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-full bg-[#F59E0B] text-black font-extrabold text-[11px] flex items-center gap-1 shadow-md`}>
                <CheckCircle className="w-3.5 h-3.5 fill-black text-[#F59E0B]" />
                <span>{language === 'ar' ? 'مؤدّي موثق' : 'Verified Artist'}</span>
              </div>
            )}
          </div>

          {/* Artist Details */}
          <div className={`lg:col-span-2 space-y-4 flex flex-col justify-between ${isRtl ? 'text-right' : 'text-left'}`}>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className={`text-2xl font-black ${isRtl ? 'font-tajawal' : 'font-sans'} text-white`}>
                  {language === 'ar' ? selectedArtist.name : selectedArtist.slug === 'yona' ? 'Yona' : selectedArtist.name}
                </h3>
                <span className="px-3 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                  {selectedArtist.type === 'singer' 
                    ? (language === 'ar' ? 'مغني وباحث صوتي' : 'Vocalist & Artist')
                    : (language === 'ar' ? 'ملحن ومؤلف موسيقار' : 'Composer & Arranger')}
                </span>
              </div>

              {selectedArtist.country && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                  <Globe className="w-4 h-4 text-[#F59E0B]" />
                  <span>{language === 'ar' ? `البلد: ${selectedArtist.country}` : `Region: ${selectedArtist.country}`}</span>
                </div>
              )}

              <p className="text-sm text-gray-300 leading-relaxed pt-2">
                {selectedArtist.bio}
              </p>
            </div>

            {/* Social Links */}
            {selectedArtist.socialLinks?.youtube && (
              <div className="pt-4 border-t border-white/10">
                <a
                  href={selectedArtist.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
                >
                  <Youtube className="w-4 h-4" />
                  <span>{language === 'ar' ? 'زيارة القناة الرسمية' : 'Visit Official Channel'}</span>
                </a>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Artist Vocal Recordings Grid */}
      <div className="space-y-4">
        <h3 className={`text-xl font-bold ${isRtl ? 'font-tajawal' : 'font-sans'} text-white flex items-center gap-2`}>
          <Sparkles className="w-5 h-5 text-[#F59E0B]" />
          <span>
            {language === 'ar'
              ? `أعمال وأصوات ${selectedArtist.name} بدون موسيقى (${artistRecordings.length})`
              : `${selectedArtist.name} Vocals & Soundtracks (${artistRecordings.length})`}
          </span>
        </h3>

        {artistRecordings.length === 0 ? (
          <div className="p-8 rounded-2xl yona-glass text-center text-gray-400 text-sm">
            {language === 'ar' ? `لا توجد تسجيلات مضافة بعد لـ ${selectedArtist.name}` : `No recordings found for ${selectedArtist.name}`}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {artistRecordings.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onSelectRecording(rec)}
                className="p-4 rounded-2xl yona-glass yona-glass-hover border border-white/10 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-xl bg-black overflow-hidden flex-shrink-0 relative">
                  <img
                    src={`https://img.youtube.com/vi/${rec.youtubeVideo?.youtubeVideoId || 'b8qH5Q1x3Xg'}/hqdefault.jpg`}
                    alt={rec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 fill-white text-white" />
                  </div>
                </div>

                <div className={`overflow-hidden flex-1 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <h4 className="font-bold text-sm text-white group-hover:text-[#F59E0B] transition-colors truncate">
                    {translateSong(rec.song?.title || rec.title)}
                  </h4>
                  <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">
                    {translateAnime(rec.animeList?.[0]?.title || (language === 'ar' ? 'شارات سبيستون' : 'Spacetoon Soundtracks'))}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-amber-400 font-inter font-bold">
                    <span>{rec.bpm ? `${rec.bpm} BPM` : 'Vocals Only'}</span>
                    <span>•</span>
                    <span>{rec.musicalKey || 'G Minor'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
