import {
  Artist, Anime, Category, Collection, CommunityEvent, Recording,
  Song, WebTool, QuizQuestion, Article, VocalGender, EventEntry
} from '../types';
import {
  INITIAL_ARTISTS, INITIAL_ANIME, INITIAL_CATEGORIES, INITIAL_RECORDINGS,
  INITIAL_COLLECTIONS, INITIAL_EVENTS, INITIAL_WEB_TOOLS, INITIAL_ARTICLES,
  INITIAL_QUIZ_QUESTIONS
} from './data';
import { matchesSearchQueryWithLyrics, normalizeArabic } from './spacetoonLyricsData';

const STORAGE_KEYS = {
  RECORDINGS: 'yona_recordings_v9',
  ARTISTS: 'yona_artists_v9',
  ANIME: 'yona_anime_v17',
  EVENTS: 'yona_events_v9',
  FAVORITES: 'yona_favorites_v9',
  SEARCH_HISTORY: 'yona_search_history_v9',
};


// Helper for local storage
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage Write Error:', err);
  }
}

export class YonaDatabase {
  private recordings: Recording[];
  private artists: Artist[];
  private animeList: Anime[];
  private categories: Category[];
  private collections: Collection[];
  private events: CommunityEvent[];
  private webTools: WebTool[];
  private articles: Article[];
  private quizQuestions: QuizQuestion[];
  private favorites: Set<string>;

  constructor() {
    const rawRecordings = getStored(STORAGE_KEYS.RECORDINGS, INITIAL_RECORDINGS);
    const initialMap = new Map<string, Recording>();
    INITIAL_RECORDINGS.forEach(r => initialMap.set(r.id, r));

    // Merge existing and latest rich lyrics
    const mergedList = (rawRecordings && rawRecordings.length > 0 ? rawRecordings : INITIAL_RECORDINGS).map(r => {
      const fresh = initialMap.get(r.id);
      return {
        ...r,
        lyrics: fresh?.lyrics || r.lyrics || '',
        fullLyrics: fresh?.fullLyrics || fresh?.lyrics || r.fullLyrics || r.lyrics || '',
        lyricsSummary: fresh?.lyricsSummary || r.lyricsSummary || '',
        song: {
          ...r.song,
          lyrics: fresh?.song?.lyrics || r.song?.lyrics || r.lyrics || '',
          description: fresh?.song?.description || r.song?.description || ''
        },
        artists: fresh?.artists || r.artists
      };
    });

    // Also append any new recordings from INITIAL_RECORDINGS that were not yet in storage
    const seenIds = new Set<string>();
    this.recordings = [];
    for (const rec of mergedList) {
      if (rec && rec.id && !seenIds.has(rec.id)) {
        seenIds.add(rec.id);
        this.recordings.push(rec);
      }
    }
    for (const initRec of INITIAL_RECORDINGS) {
      if (!seenIds.has(initRec.id)) {
        seenIds.add(initRec.id);
        this.recordings.push(initRec);
      }
    }
    setStored(STORAGE_KEYS.RECORDINGS, this.recordings);

    this.artists = INITIAL_ARTISTS;
    setStored(STORAGE_KEYS.ARTISTS, INITIAL_ARTISTS);
    // Sync anime with latest working servers and titles
    this.animeList = INITIAL_ANIME;
    setStored(STORAGE_KEYS.ANIME, INITIAL_ANIME);
    this.categories = INITIAL_CATEGORIES;
    this.collections = INITIAL_COLLECTIONS;
    this.events = getStored(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    this.webTools = INITIAL_WEB_TOOLS;
    this.articles = INITIAL_ARTICLES;
    this.quizQuestions = INITIAL_QUIZ_QUESTIONS;
    this.favorites = new Set(getStored<string[]>(STORAGE_KEYS.FAVORITES, ['rec-romeo-1', 'rec-remi-1']));
  }


  // --- RECORDINGS & SONGS ---
  public getAllRecordings(): Recording[] {
    return [...this.recordings];
  }

  public getRecordingById(id: string): Recording | undefined {
    return this.recordings.find(r => r.id === id);
  }

  public getRecordingBySlug(slug: string): Recording | undefined {
    return this.recordings.find(r => r.song?.slug === slug || r.id === slug);
  }

  public addRecording(newRec: Recording): Recording {
    this.recordings.unshift(newRec);
    setStored(STORAGE_KEYS.RECORDINGS, this.recordings);
    return newRec;
  }

  public deleteRecording(id: string): void {
    this.recordings = this.recordings.filter(r => r.id !== id);
    setStored(STORAGE_KEYS.RECORDINGS, this.recordings);
  }

  // --- SEARCH & FACETED FILTERING ---
  public searchAndFilter({
    query = '',
    categorySlug = '',
    vocalGender = '',
    recordingType = '',
    bpmMin = 0,
    bpmMax = 250,
    artistSlug = '',
    animeSlug = ''
  }: {
    query?: string;
    categorySlug?: string;
    vocalGender?: string;
    recordingType?: string;
    bpmMin?: number;
    bpmMax?: number;
    artistSlug?: string;
    animeSlug?: string;
  }): Recording[] {
    const cleanQuery = (query || '').trim();

    const filtered = this.recordings.filter(rec => {
      // شمول البحث الدقيق في النصوص الغنائية الكاملة (lyrics & fullLyrics) والعناوين والأنمي والفنانين
      if (cleanQuery) {
        const normQ = normalizeArabic(cleanQuery);

        // 1. محرك المطابقة الموثق للكلمات وسبيستون والكلمات المتعددة
        const matchesEngine = matchesSearchQueryWithLyrics(rec, cleanQuery);

        // 2. فحص مباشر للنصوص الغنائية الكاملة للحقل lyrics والحقل fullLyrics
        const lyricsMatch = 
          (Boolean(rec.lyrics) && normalizeArabic(rec.lyrics!).includes(normQ)) ||
          (Boolean(rec.fullLyrics) && normalizeArabic(rec.fullLyrics!).includes(normQ)) ||
          (Boolean(rec.song?.lyrics) && normalizeArabic(rec.song!.lyrics!).includes(normQ)) ||
          (Boolean(rec.lyricsSummary) && normalizeArabic(rec.lyricsSummary!).includes(normQ));

        // 3. فحص مباشر للعنوان والأنمي والفنان والوصف
        const metadataMatch = 
          normalizeArabic(rec.title).includes(normQ) ||
          (Boolean(rec.song?.title) && normalizeArabic(rec.song!.title).includes(normQ)) ||
          (Boolean(rec.song?.originalTitle) && normalizeArabic(rec.song!.originalTitle!).includes(normQ)) ||
          (Boolean(rec.artist) && normalizeArabic(rec.artist!).includes(normQ)) ||
          (rec.artists?.some(a => normalizeArabic(a.name).includes(normQ)) ?? false) ||
          (rec.animeList?.some(an => normalizeArabic(an.title).includes(normQ)) ?? false) ||
          (Boolean(rec.song?.description) && normalizeArabic(rec.song!.description!).includes(normQ));

        if (!matchesEngine && !lyricsMatch && !metadataMatch) {
          return false;
        }
      }

      // Category filter
      if (categorySlug && categorySlug !== 'all') {
        const hasCategory = rec.categories?.some(c => {
          if (c.slug === categorySlug) return true;
          if (categorySlug === 'the-voice-kids' && (c.slug === 'the-voice-kids' || c.name.toLowerCase().includes('voice kids'))) return true;
          if (categorySlug === 'spacetoon' && (c.slug === 'spacetoon' || c.slug === 'anime' || c.name.includes('سبيستون') || c.name.includes('أنمي'))) return true;
          if (categorySlug === 'anime' && (c.slug === 'spacetoon' || c.slug === 'anime' || c.name.includes('أنمي'))) return true;
          if ((categorySlug === 'arabic-songs' || categorySlug === 'arabic-classic') && (c.slug === 'arabic-songs' || c.slug === 'arabic-classic' || c.name.includes('عربية'))) return true;
          if (categorySlug === 'foreign-songs' && (c.slug === 'foreign-songs' || c.name.includes('أجنبية') || c.name.includes('كورية') || c.name.includes('كيبوب'))) return true;
          if ((categorySlug === 'nasheed-kids' || categorySlug === 'nasheed') && (c.slug === 'nasheed-kids' || c.slug === 'nasheed' || c.name.includes('أناشيد'))) return true;
          return false;
        }) || (categorySlug === 'the-voice-kids' && (rec.title.includes('The Voice Kids') || (rec.song?.originalTitle?.includes('The Voice Kids') ?? false) || (rec.lyricsSummary?.includes('The Voice Kids') ?? false)));

        if (!hasCategory) return false;
      }

      // Vocal Gender filter
      if (vocalGender && vocalGender !== 'all') {
        if (rec.vocalGender !== vocalGender) return false;
      }

      // Recording type filter
      if (recordingType && recordingType !== 'all') {
        if (rec.recordingType !== recordingType) return false;
      }

      // BPM Filter
      if (rec.bpm) {
        if (rec.bpm < bpmMin || rec.bpm > bpmMax) return false;
      }

      // Artist Slug filter
      if (artistSlug) {
        const matchesArtist = rec.artists?.some(a => a.slug === artistSlug);
        if (!matchesArtist) return false;
      }

      // Anime Slug filter
      if (animeSlug) {
        const matchesAnime = rec.animeList?.some(a => a.slug === animeSlug);
        if (!matchesAnime) return false;
      }

      return true;
    });

    if (!cleanQuery) return filtered;

    const normQ = normalizeArabic(cleanQuery);
    return filtered.sort((a, b) => {
      const aTitle = normalizeArabic(a.title);
      const bTitle = normalizeArabic(b.title);
      const aExact = aTitle === normQ ? 100 : aTitle.startsWith(normQ) ? 50 : aTitle.includes(normQ) ? 25 : 0;
      const bExact = bTitle === normQ ? 100 : bTitle.startsWith(normQ) ? 50 : bTitle.includes(normQ) ? 25 : 0;
      return bExact - aExact;
    });
  }

  /**
   * دالة مخصصة للبحث المباشر عن التسجيلات بنصوص الكلمات الكاملة (lyrics)
   * تضمن مطابقة دقيقة للأشطر والكلمات مع التطبيع اللغوي
   */
  public searchByLyrics(lyricsQuery: string): Recording[] {
    if (!lyricsQuery || !lyricsQuery.trim()) {
      return [...this.recordings];
    }
    return this.searchAndFilter({ query: lyricsQuery });
  }

  // --- ARTISTS & ANIME ---
  public getAllArtists(): Artist[] {
    return [...this.artists];
  }

  public getArtistBySlug(slug: string): Artist | undefined {
    return this.artists.find(a => a.slug === slug);
  }

  public getAllAnime(): Anime[] {
    return [...this.animeList];
  }

  public getAnimeBySlug(slug: string): Anime | undefined {
    return this.animeList.find(a => a.slug === slug);
  }

  public getAllCategories(): Category[] {
    return [...this.categories];
  }

  public getAllCollections(): Collection[] {
    return [...this.collections];
  }

  // --- COMMUNITY & VOTING ---
  public getCommunityEvents(): CommunityEvent[] {
    return [...this.events];
  }

  public voteForEntry(eventId: string, entryId: string): EventEntry | undefined {
    const event = this.events.find(e => e.id === eventId);
    if (!event || !event.entries) return undefined;
    const entry = event.entries.find(e => e.id === entryId);
    if (entry) {
      entry.votesCount += 1;
      setStored(STORAGE_KEYS.EVENTS, this.events);
    }
    return entry;
  }

  public addSongSuggestion(eventId: string, title: string, originalArtist: string): EventEntry | undefined {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return undefined;
    if (!event.entries) event.entries = [];

    const newEntry: EventEntry = {
      id: `entry-${Date.now()}`,
      eventId,
      title,
      originalArtist,
      votesCount: 1,
      createdAt: new Date().toISOString()
    };

    event.entries.unshift(newEntry);
    setStored(STORAGE_KEYS.EVENTS, this.events);
    return newEntry;
  }

  // --- FAVORITES ---
  public toggleFavorite(recordingId: string): boolean {
    if (this.favorites.has(recordingId)) {
      this.favorites.delete(recordingId);
    } else {
      this.favorites.add(recordingId);
    }
    setStored(STORAGE_KEYS.FAVORITES, Array.from(this.favorites));
    return this.favorites.has(recordingId);
  }

  public isFavorite(recordingId: string): boolean {
    return this.favorites.has(recordingId);
  }

  public getFavoritesRecordings(): Recording[] {
    return this.recordings.filter(r => this.favorites.has(r.id));
  }

  // --- WEB TOOLS & QUIZ ---
  public getWebTools(): WebTool[] {
    return [...this.webTools];
  }

  public getArticles(): Article[] {
    return [...this.articles];
  }

  public getQuizQuestions(): QuizQuestion[] {
    return [...this.quizQuestions];
  }
}

export const db = new YonaDatabase();
