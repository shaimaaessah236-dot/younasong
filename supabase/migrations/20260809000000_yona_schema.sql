-- ======================================================================
-- YONA SONGS - KNOWLEDGE GRAPH & AUDIO DIRECTORY SCHEMA (SUPABASE POSTGRES)
-- Migration: 20260809000000_yona_schema.sql
-- ======================================================================

-- 1. LANGUAGES
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ARTISTS
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('singer','band','choir','poet','voice_actor','composer')),
  country VARCHAR(100),
  birth_date DATE,
  bio TEXT,
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SONGS
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  original_title VARCHAR(255),
  slug VARCHAR(255) NOT NULL UNIQUE,
  release_year INTEGER,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RECORDINGS
CREATE TABLE IF NOT EXISTS recordings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  recording_type VARCHAR(50) NOT NULL CHECK (recording_type IN ('original','live','the_voice','vocals_only','remaster','cover')),
  bpm INTEGER,
  musical_key VARCHAR(20),
  duration_seconds INTEGER,
  is_master_vocal_only BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. YOUTUBE VIDEOS
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  youtube_video_id VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  channel_name VARCHAR(255) DEFAULT 'Songs Without Music',
  is_official_yona_channel BOOLEAN DEFAULT true,
  view_count BIGINT DEFAULT 0,
  like_count BIGINT DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SONG PERFORMERS
CREATE TABLE IF NOT EXISTS song_performers (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  role VARCHAR(100) DEFAULT 'vocalist',
  PRIMARY KEY (song_id, artist_id, role)
);

-- 7. ANIME
CREATE TABLE IF NOT EXISTS anime (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  year INTEGER,
  studio VARCHAR(255),
  description TEXT,
  cover_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SONG ANIME
CREATE TABLE IF NOT EXISTS song_anime (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  anime_id UUID REFERENCES anime(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, anime_id)
);

-- 9. SHOWS & RECORDING SHOWS
CREATE TABLE IF NOT EXISTS shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  season VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recording_shows (
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  show_id UUID REFERENCES shows(id) ON DELETE CASCADE,
  PRIMARY KEY (recording_id, show_id)
);

-- 10. CATEGORIES, TAGS & RELATIONS
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS song_categories (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, category_id)
);

CREATE TABLE IF NOT EXISTS song_tags (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, tag_id)
);

CREATE TABLE IF NOT EXISTS song_languages (
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  language_id UUID REFERENCES languages(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, language_id)
);

-- 11. COLLECTIONS & COLLECTION ITEMS
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS collection_items (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, recording_id)
);

-- 12. USER PROFILES, FAVORITES & PLAYLISTS
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS favorites (
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, recording_id)
);

CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS playlist_items (
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  recording_id UUID REFERENCES recordings(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (playlist_id, recording_id)
);

-- 13. EVENTS & VOTING
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  event_type VARCHAR(50) CHECK (event_type IN ('voting','quiz_challenge','community_poll')),
  description TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS event_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  votes_count INTEGER DEFAULT 0,
  user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. ARTICLES & TOOLS
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  content TEXT NOT NULL,
  author_id UUID REFERENCES user_profiles(id),
  published_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_name VARCHAR(100)
);

-- 15. SEO METADATA
CREATE TABLE IF NOT EXISTS seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  canonical_url TEXT,
  schema_type VARCHAR(100) DEFAULT 'MusicRecording',
  og_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (entity_type, entity_id)
);

-- 16. FULL-TEXT SEARCH INDEX (TSVECTOR)
CREATE TABLE IF NOT EXISTS search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  search_text TSVECTOR,
  tags_array TEXT[],
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Full-Text Search Index
CREATE INDEX IF NOT EXISTS search_text_gin_idx ON search_index USING GIN(search_text);

-- Trigger for Search Vector Auto-Update
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
BEGIN
  new.search_text := to_tsvector('arabic', coalesce(new.title, '') || ' ' || array_to_string(coalesce(new.tags_array, '{}'), ' '));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_search_vector ON search_index;
CREATE TRIGGER trg_update_search_vector
BEFORE INSERT OR UPDATE ON search_index
FOR EACH ROW EXECUTE FUNCTION update_search_vector();
