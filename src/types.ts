export type ArtistType = 'singer' | 'band' | 'choir' | 'poet' | 'voice_actor' | 'composer';
export type RecordingType = 'original' | 'live' | 'the_voice' | 'vocals_only' | 'remaster' | 'cover';
export type VocalGender = 'Female' | 'Male' | 'Choir' | 'Duet';
export type CategorySlug = 'spacetoon' | 'anime' | 'arabic-classic' | 'nasheed' | 'vocal-cover' | 'emotional';

export interface Artist {
  id: string;
  name: string;
  slug: string;
  type: ArtistType;
  country?: string;
  birthDate?: string;
  bio?: string;
  imageUrl: string;
  isVerified: boolean;
  socialLinks?: Record<string, string>;
}

export interface Language {
  id: string;
  code: string;
  name: string;
}

export interface Song {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  releaseYear?: number;
  description?: string;
  lyrics?: string;
}

export interface Recording {
  id: string;
  songId: string;
  title: string;
  recordingType: RecordingType;
  bpm?: number;
  musicalKey?: string;
  durationSeconds?: number;
  isMasterVocalOnly: boolean;
  
  // Enriched relations for frontend display
  song?: Song;
  youtubeVideo?: YouTubeVideo;
  artists?: Artist[];
  animeList?: Anime[];
  categories?: Category[];
  category?: string;
  artist?: string;
  youtube_id?: string;
  tags?: Tag[];
  vocalGender?: VocalGender;
  // حقول الكلمات والنصوص الغنائية لضمان المطابقة الدقيقة أثناء البحث
  lyrics?: string;            // النص الكامل للكلمات الأصلية (lyrics) لضمان مطابقة دقيقة أثناء البحث
  fullLyrics?: string;        // النص التوثيقي الكامل لشارة الأغنية
  lyricsSummary?: string;     // ملخص مقتطفات من كلمات الشارة
  lyricsAuthor?: string;      // مؤلف أو كاتب كلمات الشارة
}

export interface YouTubeVideo {
  id: string;
  recordingId: string;
  youtubeVideoId: string;
  title: string;
  channelName: string;
  isOfficialYonaChannel: boolean;
  viewCount: number;
  likeCount: number;
  publishedAt: string;
}

export interface SongPerformer {
  songId: string;
  artistId: string;
  role: string;
  artist?: Artist;
}

export interface EpisodeServer {
  id: string;
  name: string;
  url: string;
  type: 'youtube' | 'archive' | 'dailymotion' | 'direct' | 'embed' | 'telegram' | 'external';
  quality?: string;
}

export interface AnimeEpisode {
  id: string;
  number: number;
  title: string;
  duration?: string;
  youtubeId?: string;
  embedUrl?: string;
  directVideoUrl?: string;
  servers?: EpisodeServer[];
  telegramUrl?: string;
  externalWatchUrl?: string;
  summary?: string;
  thumbnail?: string;
  airDate?: string;
}

export interface AnimeCharacter {
  name: string;
  arabicName: string;
  role: string;
  voiceActor?: string;
  description?: string;
  avatar?: string;
}

export interface AnimeThemeSong {
  type: 'شارة البداية' | 'شارة النهاية' | 'أغنية داخلية' | 'شارة الفيلم';
  title: string;
  artist?: string;
  youtubeId?: string;
}

export type TelegramCategory = 'all' | 'anime' | 'movies' | 'netflix' | 'bots' | 'kdrama' | 'series';

export interface TelegramChannel {
  id: string;
  name: string;
  handle: string;
  url: string;
  webPreviewUrl?: string;
  botStartUrl?: string;
  type: 'channel' | 'bot' | 'group';
  category: TelegramCategory;
  badge: string;
  description: string;
  subscribersOrUsers?: string;
  featuredContent?: string[];
  isVerified?: boolean;
  highlightColor?: string;
}

export type MediaCategory = 'anime-series' | 'anime-movie' | 'world-movie' | 'world-series';

export interface Anime {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  type?: 'series' | 'movie';
  mediaCategory?: MediaCategory;
  year?: number;
  studio?: string;
  arabicDubbingStudio?: string;
  genres?: string[];
  rating?: number;
  status?: string;
  description?: string;
  story?: string;
  coverImage: string;
  bannerImage?: string;
  episodesCount?: number;
  duration?: string;
  director?: string;
  writer?: string;
  characters?: AnimeCharacter[];
  episodes?: AnimeEpisode[];
  themeSongs?: AnimeThemeSong[];
  telegramChannelName?: string;
  telegramChannelUrl?: string;
  telegramWebPreviewUrl?: string;
  telegramBotSearchUrl?: string;
}

export interface Show {
  id: string;
  title: string;
  slug: string;
  season?: string;
  country?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
  recordingIds: string[];
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio?: string;
  favoritesCount: number;
}

export interface Playlist {
  id: string;
  userId: string;
  title: string;
  description?: string;
  isPublic: boolean;
  recordingIds: string[];
}

export interface EventEntry {
  id: string;
  eventId: string;
  title: string;
  originalArtist?: string;
  description?: string;
  votesCount: number;
  suggestedBy?: string;
  createdAt: string;
}

export interface ContestEntry {
  id: string;
  singerName: string;
  originalPublicName?: string;
  publicDisplayName?: string;
  customCertificateName?: string;
  customCertificateNameEn?: string;
  namePrivacyMode?: 'private_cert_only' | 'public_everywhere';
  participantToken?: string;
  countryOrCity: string;
  songTitle: string;
  songId?: string;
  audioUrl: string;
  score: number;
  rankTitle?: string;
  voiceType: string;
  pitchTier: string;
  votes: number;
  hasVoted?: boolean;
  date: string;
  exactTimestamp?: number;
  formattedDateAr?: string;
  formattedDateEn?: string;
  certificateNumber?: string;
  verificationHash?: string;
  badge?: string;
  comment?: string;
  isSelectedBest?: boolean;
  bestRank?: 'first' | 'second' | 'third' | 'jury_pick' | null;
  selectedAt?: string;
  juryNotes?: string;
  isUserRecording?: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  eventType: 'voting' | 'quiz_challenge' | 'community_poll';
  description: string;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  entries?: EventEntry[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImage: string;
}

export interface WebTool {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
}

export interface SeoMetadata {
  entityType: 'recording' | 'artist' | 'anime' | 'collection' | 'tool';
  entityId: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  schemaType: string;
  ogImageUrl: string;
}

export interface SearchIndexItem {
  id: string;
  recordingId: string;
  title: string;
  arabicTitle: string;
  artistName: string;
  animeTitle: string;
  category: string;
  vocalGender: VocalGender;
  bpm?: number;
  key?: string;
  youtubeId: string;
  tags: string[];
}

export type QuizQuestionType = 'audio_snippet' | 'lyrics_riddle' | 'artist_trivia' | 'anime_lore' | 'ai_generated';

export interface SpacetoonCharacterMascot {
  name: string;
  series: string;
  planet: string;
  planetColor: string;
  avatarEmoji: string;
  encouragement: string;
  lowTimeAlert?: string;
  successCheer?: string;
  wrongCheer?: string;
}

export interface QuizQuestion {
  id: string;
  questionType?: QuizQuestionType;
  questionText?: string;
  audioSnippetUrl?: string;
  melodyPresetId?: string;
  acousticSnippetKey?: string;
  youtubeId?: string;
  startSeconds?: number;
  options: string[];
  correctIndex: number;
  hint: string;
  songTitle: string;
  animeTitle: string;
  lyricsSnippet?: string;
  revealedLyrics?: string;
  singerOrComposer?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  explanation?: string;
  characterMascot?: SpacetoonCharacterMascot;
}

export * from './types/youtube';
