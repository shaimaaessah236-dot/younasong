import React, { useState, useEffect, useMemo } from 'react';
import { db } from './lib/db';
import { Recording, Artist, Anime, CommunityEvent } from './types';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterPanel } from './components/FilterPanel';
import { RecordingCard } from './components/RecordingCard';
import { SongDetailModal } from './components/SongDetailModal';
import { ArtistHub } from './components/ArtistHub';
import { AnimeHub } from './components/AnimeHub';
import { AudioTools } from './components/AudioTools';
import { CommunityHub } from './components/CommunityHub';
import { ContestBoard } from './components/ContestBoard';
import { ThemeQuizChallenge } from './components/ThemeQuizChallenge';
import { FanDedicationsHub } from './components/FanDedicationsHub';
import { AdminDashboard } from './components/AdminDashboard';
import { StickyAudioPlayer } from './components/StickyAudioPlayer';
import { AIAssistant } from './components/AIAssistant';
import { VocalIsolator } from './components/VocalIsolator';
import { TelegramCinemaHub } from './components/TelegramCinemaHub';
import { StudioRecorder } from './components/StudioRecorder';
import { SpacetoonPassportHub } from './components/SpacetoonPassportHub';
import { SpacetoonTvHub } from './components/SpacetoonTvHub';
import { CertificateVerificationPortal, VerificationData } from './components/CertificateVerificationPortal';
import { OfficialCertificateModal } from './components/OfficialCertificateModal';
import { OfficialProductsStore } from './components/OfficialProductsStore';
import { SupportChannelWidget } from './components/SupportChannelWidget';
import { Footer } from './components/Footer';
import { OfflineIndicator } from './components/OfflineIndicator';
import { Sparkles, Heart, Music, Youtube, HelpCircle, Layers, History, Play } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { RequireAuthModal } from './components/RequireAuthModal';
import { AuthModal } from './components/AuthModal';
import { TwoRowCarousel } from './components/TwoRowCarousel';

export default function App() {
  const { isDarkMode } = useTheme();
  const { language, isRtl, t, translateSong, translateAnime } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('directory');

  // Require Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{ title?: string; description?: string; onSuccess?: () => void }>({});

  const handleRequireAuth = (onSuccess?: () => void, title?: string, description?: string) => {
    if (!isAuthenticated) {
      setAuthModalConfig({ title, description, onSuccess });
      setShowAuthModal(true);
      return false;
    }
    if (onSuccess) onSuccess();
    return true;
  };
  
  // Search & Faceted Filter States
  const [query, setQuery] = useState('');
  const [categorySlug, setCategorySlug] = useState('all');
  const [vocalGender, setVocalGender] = useState('all');
  const [recordingType, setRecordingType] = useState('all');
  const [bpmMin, setBpmMin] = useState(60);
  const [bpmMax, setBpmMax] = useState(180);

  // Active Selected Recording (Modal & Player)
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [activePlayerRecording, setActivePlayerRecording] = useState<Recording | null>(null);

  // Force re-render state
  const [favoritesRefresh, setFavoritesRefresh] = useState(0);

  // Verification URL Query Params state (triggered by QR Code scan)
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [showFullCertFromVerify, setShowFullCertFromVerify] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const verifyCertId = params.get('verifyCert');
      if (verifyCertId) {
        setVerificationData({
          certId: verifyCertId,
          name: params.get('name') || 'مشارك متميز',
          score: parseFloat(params.get('score') || '98'),
          song: params.get('song') || 'أداء صوتي معتمد',
          date: params.get('date') || '28 سبتمبر 2026',
          country: params.get('country') || 'الوطن العربي ',
          hash: params.get('hash') || '0x8A9BF2E9A1'
        });
      }
    } catch (err) {
      console.error('Error parsing verification query params:', err);
    }
  }, []);

  // Data Collections from DB
  const [allRecordings, setAllRecordings] = useState<Recording[]>(() => db.getAllRecordings());
  const [allArtists] = useState<Artist[]>(() => db.getAllArtists());
  const [allAnime] = useState<Anime[]>(() => db.getAllAnime());
  const [events, setEvents] = useState<CommunityEvent[]>(() => db.getCommunityEvents());

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    db.toggleFavorite(id);
    setFavoritesRefresh(prev => prev + 1);
  };

  const handleResetFilters = () => {
    setQuery('');
    setCategorySlug('all');
    setVocalGender('all');
    setRecordingType('all');
    setBpmMin(60);
    setBpmMax(180);
  };

  // Filtered Recordings
  const filteredRecordings = useMemo(() => {
    if (activeTab === 'favorites') {
      return db.getFavoritesRecordings();
    }
    return db.searchAndFilter({
      query,
      categorySlug,
      vocalGender,
      recordingType,
      bpmMin,
      bpmMax,
    });
  }, [query, categorySlug, vocalGender, recordingType, bpmMin, bpmMax, activeTab, favoritesRefresh, allRecordings]);

  // Recently Played State (Tracks last 5 songs played)
  const [recentlyPlayed, setRecentlyPlayed] = useState<Recording[]>(() => {
    try {
      const saved = localStorage.getItem('yona_recently_played');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading recently played:', e);
    }
    return db.getAllRecordings().slice(0, 3);
  });

  // Handle Play Recording
  const handleSelectRecording = (rec: Recording) => {
    setSelectedRecording(rec);
    setActivePlayerRecording(rec);

    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((item) => item.id !== rec.id);
      const updated = [rec, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('yona_recently_played', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving recently played:', e);
      }
      return updated;
    });
  };

  // Community Vote
  const handleVote = (eventId: string, entryId: string) => {
    db.voteForEntry(eventId, entryId);
    setEvents(db.getCommunityEvents());
  };

  // Community Add Suggestion
  const handleAddSuggestion = (eventId: string, title: string, artist: string) => {
    db.addSongSuggestion(eventId, title, artist);
    setEvents(db.getCommunityEvents());
  };

  // Admin Add Recording
  const handleAddRecording = (newRec: Recording) => {
    db.addRecording(newRec);
    setAllRecordings(db.getAllRecordings());
  };

  // Admin Delete Recording
  const handleDeleteRecording = (id: string) => {
    db.deleteRecording(id);
    setAllRecordings(db.getAllRecordings());
  };

  const favoritesCount = db.getFavoritesRecordings().length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'animated-subtle-gradient-dark text-[#F8FAFC]' : 'animated-subtle-gradient-light text-[#0F172A]'} ${isRtl ? 'font-cairo dir-rtl text-right' : 'font-sans dir-ltr text-left'} flex flex-col justify-between pb-24 ${isDarkMode ? 'selection:bg-[#D4AF37]/25 selection:text-amber-200' : 'selection:bg-emerald-600/20 selection:text-emerald-900'} relative overflow-x-hidden transition-all duration-300`}>
      
      {/* Delicate Ambient Midnight (Dark) or Emerald & Crimson (Light) Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {isDarkMode ? (
          <>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#1e293b]/30 via-[#d4af37]/5 to-transparent blur-[140px] rounded-full" />
            <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-sky-950/15 blur-[150px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-teal-200/50 via-emerald-100/35 to-transparent blur-[140px] rounded-full" />
            <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-emerald-200/35 blur-[160px] rounded-full" />
            <div className="absolute bottom-1/4 left-0 w-[550px] h-[550px] bg-teal-200/30 blur-[150px] rounded-full" />
            <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-emerald-100/40 blur-[120px] rounded-full" />
          </>
        )}
      </div>

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={query}
        setSearchQuery={setQuery}
        favoritesCount={favoritesCount}
        onSelectRecording={handleSelectRecording}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full relative z-10">
        
        {/* DIRECTORY TAB */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <HeroBanner
              onExploreClick={() => {
                const el = document.getElementById('recordings-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onStudioClick={() => setActiveTab('vocal-studio')}
              onPassportClick={() => setActiveTab('passport')}
              onTvClick={() => setActiveTab('spacetoon-tv')}
              onContestClick={() => setActiveTab('contest')}
              onQuizClick={() => setActiveTab('quiz')}
              onDedicationsClick={() => setActiveTab('dedications')}
              onStoreClick={() => setActiveTab('store')}
              onToolsClick={() => setActiveTab('tools')}
              onTelegramClick={() => setActiveTab('telegram')}
              selectedCategory={categorySlug}
              setSelectedCategory={setCategorySlug}
            />

            {/* RECENTLY PLAYED SECTION */}
            {recentlyPlayed.length > 0 && (
              <div className="p-5 rounded-2xl yona-glass border border-white/[0.08] space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-teal-300" />
                    <span>{t('recentlyPlayedTitle')}</span>
                  </h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-400/15 text-teal-200 border border-teal-400/30 font-bold">
                    {t('recentlyPlayedBadge')} ({recentlyPlayed.length})
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {recentlyPlayed.map((rec) => {
                    const ytId = rec.youtubeVideo?.youtubeVideoId;
                    const thumbUrl = ytId
                      ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                      : rec.animeList?.[0]?.coverImage || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
                    return (
                      <div
                        key={rec.id}
                        onClick={() => handleSelectRecording(rec)}
                        className="group relative rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-sky-300/60 p-2.5 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-[0_0_15px_rgba(56,189,248,0.2)]"
                      >
                        <div className="relative aspect-video w-full rounded-lg overflow-hidden mb-2 bg-black/50">
                          <img
                            src={thumbUrl}
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-300 to-sky-300 text-slate-950 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />
                            </div>
                          </div>
                        </div>
                        <div className={`space-y-0.5 ${isRtl ? 'text-right' : 'text-left'}`}>
                          <h4 className="font-bold text-xs text-slate-200 truncate group-hover:text-sky-200 transition-colors">
                            {translateSong(rec.song?.title || rec.title)}
                          </h4>
                          <p className="text-[10px] text-slate-400 truncate">
                            {rec.artists?.[0]?.name || translateAnime(rec.animeList?.[0]?.title) || (language === 'ar' ? 'يونا' : 'Yona')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <FilterPanel
              query={query}
              setQuery={setQuery}
              categorySlug={categorySlug}
              setCategorySlug={setCategorySlug}
              vocalGender={vocalGender}
              setVocalGender={setVocalGender}
              recordingType={recordingType}
              setRecordingType={setRecordingType}
              bpmMin={bpmMin}
              setBpmMin={setBpmMin}
              bpmMax={bpmMax}
              setBpmMax={setBpmMax}
              onReset={handleResetFilters}
              totalResultsCount={filteredRecordings.length}
            />

            <TwoRowCarousel
              recordings={filteredRecordings}
              onSelectRecording={handleSelectRecording}
              isFavorite={(id) => db.isFavorite(id)}
              onToggleFavorite={handleToggleFavorite}
              title={t('gridTitle')}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl yona-glass border border-white/10 flex items-center justify-between">
              <div>
                <h2 className={`text-2xl font-bold ${isRtl ? 'font-tajawal' : 'font-sans'} text-white flex items-center gap-2`}>
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>{t('favTitle')} ({filteredRecordings.length})</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {t('favDesc')}
                </p>
              </div>
            </div>

            {filteredRecordings.length === 0 ? (
              <div className="p-12 rounded-3xl yona-glass text-center space-y-3 my-8">
                <Heart className="w-12 h-12 text-rose-500/50 mx-auto" />
                <h3 className="text-lg font-bold text-white">{t('favEmptyTitle')}</h3>
                <p className="text-xs text-gray-400">{t('favEmptyDesc')}</p>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-sky-300 text-slate-950 font-bold text-xs hover:brightness-110 shadow-md transition-all cursor-pointer"
                >
                  {t('favBrowseBtn')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredRecordings.map((rec) => (
                  <RecordingCard
                    key={rec.id}
                    recording={rec}
                    onSelect={handleSelectRecording}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VOCAL STUDIO & KARAOKE TAB */}
        {activeTab === 'vocal-studio' && (
          <StudioRecorder />
        )}

        {/* SPACETOON PASSPORT & HERO IDENTITY TAB */}
        {activeTab === 'passport' && (
          <SpacetoonPassportHub
            onNavigateToStudio={() => setActiveTab('vocal-studio')}
            onNavigateToSongs={() => setActiveTab('directory')}
          />
        )}

        {/* SPACETOON RETRO CRT TV & TIME MACHINE TAB */}
        {activeTab === 'spacetoon-tv' && (
          <SpacetoonTvHub
            onNavigateToStudio={() => setActiveTab('vocal-studio')}
            onNavigateToSongs={() => setActiveTab('directory')}
          />
        )}

        {/* ARTISTS TAB */}
        {activeTab === 'artists' && (
          <ArtistHub
            artists={allArtists}
            allRecordings={allRecordings}
            onSelectRecording={handleSelectRecording}
          />
        )}

        {/* ANIME TAB */}
        {activeTab === 'anime' && (
          <AnimeHub
            animeList={allAnime}
            allRecordings={allRecordings}
            onSelectRecording={handleSelectRecording}
          />
        )}

        {/* TELEGRAM & CINEMA HUB TAB */}
        {activeTab === 'telegram' && (
          <TelegramCinemaHub
            onNavigateToAnime={() => setActiveTab('anime')}
            onNavigateToRecordings={() => setActiveTab('directory')}
          />
        )}

        {/* AI SMART ASSISTANT & CINEMA SEARCH TAB */}
        {activeTab === 'ai-assistant' && (
          <div className="space-y-6">
            <AIAssistant
              onNavigate={(tab) => setActiveTab(tab)}
              onNavigateToStudio={() => setActiveTab('vocal-studio')}
            />
          </div>
        )}

        {/* AUDIO TOOLS TAB */}
        {activeTab === 'tools' && (
          <div className="space-y-8">
            <VocalIsolator />
            <AudioTools />
          </div>
        )}

        {/* CONTEST BOARD TAB (المسابقة الكبرى وتتويج أفضل صوت) */}
        {activeTab === 'contest' && (
          <div className="space-y-6">
            <ContestBoard onNavigateToStudio={() => setActiveTab('vocal-studio')} />
          </div>
        )}

        {/* THEME QUIZ CHALLENGE TAB (تحدي كويز سبيستون والشهادات المعتمدة) */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <ThemeQuizChallenge />
          </div>
        )}

        {/* FAN DEDICATIONS & REQUESTS TAB (إهداءات الجمهور) */}
        {activeTab === 'dedications' && (
          <div className="space-y-6">
            <FanDedicationsHub onSelectSongToSing={() => setActiveTab('vocal-studio')} />
          </div>
        )}

        {/* COMMUNITY & VOTING TAB */}
        {activeTab === 'community' && (
          <CommunityHub
            events={events}
            onVote={handleVote}
            onAddSuggestion={handleAddSuggestion}
            quizQuestions={db.getQuizQuestions()}
            onNavigateToStudio={() => setActiveTab('vocal-studio')}
          />
        )}

        {/* OFFICIAL STORE TAB (لشراء منتوجاتنا والكتب الرسمية) */}
        {activeTab === 'store' && (
          <div className="space-y-6">
            <OfficialProductsStore
              onNavigateToDirectory={() => setActiveTab('directory')}
              onNavigateToStudio={() => setActiveTab('vocal-studio')}
            />
          </div>
        )}

        {/* ADMIN TAB */}
        {activeTab === 'admin' && (
          <AdminDashboard
            recordings={allRecordings}
            onAddRecording={handleAddRecording}
            onDeleteRecording={handleDeleteRecording}
          />
        )}

      </main>

      {/* Footer */}
      <Footer activeTab={activeTab} />

      {/* Sticky Bottom Audio Player Bar */}
      <StickyAudioPlayer
        recording={activePlayerRecording}
        onExpand={() => setSelectedRecording(activePlayerRecording)}
        isFavorite={activePlayerRecording ? db.isFavorite(activePlayerRecording.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onClosePlayer={() => setActivePlayerRecording(null)}
      />

      {/* Song Detail Modal */}
      {selectedRecording && (
        <SongDetailModal
          recording={selectedRecording}
          onClose={() => setSelectedRecording(null)}
          isFavorite={db.isFavorite(selectedRecording.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectRelated={(rec) => {
            setSelectedRecording(rec);
            setActivePlayerRecording(rec);
          }}
          allRecordings={allRecordings}
        />
      )}

      {/* PWA Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Official Certificate Verification Portal (Triggered when QR Code is scanned on camera/phone) */}
      {verificationData && (
        <CertificateVerificationPortal
          isOpen={!!verificationData}
          onClose={() => setVerificationData(null)}
          data={verificationData}
          onOpenFullCertificate={() => {
            setShowFullCertFromVerify(true);
          }}
        />
      )}

      {/* Full Certificate Modal opened from Verification Portal */}
      {showFullCertFromVerify && verificationData && (
        <OfficialCertificateModal
          isOpen={showFullCertFromVerify}
          onClose={() => setShowFullCertFromVerify(false)}
          data={{
            singerName: verificationData.name,
            songTitle: verificationData.song,
            score: verificationData.score,
            countryOrCity: verificationData.country,
            formattedDateAr: verificationData.date,
            date: verificationData.date,
            certificateNumber: verificationData.certId,
            verificationHash: verificationData.hash,
            pitchTier: 'ميزو سوبرانو / تينور نقي (Accredited Vocalist)',
            badge: verificationData.score >= 95 ? ' وسام التفوق والاعتماد الأكاديمي' : ' وسام الإبداع الصوتي',
            juryNotes: 'أداء صوتي معتمد رسمياً ومسجل بالسجل العام للأكاديمية ومطابق للمواصفات الأكاديمية والمهنية.'
          }}
          canEditSingerName={true}
        />
      )}

      {/* Floating Side Support Widget (Buy Me a Coffee / $1 Support & YouTube Linking) */}
      <SupportChannelWidget />

      {/* Global Universal Auth & Member Login Modal */}
      <AuthModal />

      {/* Global Security Require Auth Modal */}
      <RequireAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title={authModalConfig.title}
        description={authModalConfig.description}
        onSuccess={authModalConfig.onSuccess}
      />

    </div>
  );
}
