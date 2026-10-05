-- ============================================================================
-- YONA SONGS DATABASE SCHEMA & INFRASTRUCTURE
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUMS
CREATE TYPE public.user_role AS ENUM ('listener', 'artist', 'admin');
CREATE TYPE public.audio_type AS ENUM ('vocal_only', 'human_dubbed', 'acapella_remix');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived', 'rejected');
CREATE TYPE public.vote_type AS ENUM ('upvote', 'downvote');

-- 3. TABLES

-- Profiles (Extends Supabase Auth Users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role public.user_role NOT NULL DEFAULT 'listener',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT username_length CHECK (CHAR_LENGTH(username) >= 3 AND CHAR_LENGTH(username) <= 30)
);

-- Anime Catalog
CREATE TABLE public.anime (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_ar TEXT NOT NULL,
    title_en TEXT,
    title_jp TEXT,
    slug TEXT UNIQUE NOT NULL,
    cover_image_url TEXT,
    description TEXT,
    release_year INTEGER CHECK (release_year >= 1950 AND release_year <= 2100),
    status public.content_status NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artists / Vocalists
CREATE TABLE public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Songs / Tracks
CREATE TABLE public.songs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    anime_id UUID REFERENCES public.anime(id) ON DELETE SET NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    slug TEXT UNIQUE NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    audio_type public.audio_type NOT NULL DEFAULT 'vocal_only',
    lyrics_ar TEXT,
    audio_url TEXT NOT NULL,
    status public.content_status NOT NULL DEFAULT 'published',
    views_count BIGINT NOT NULL DEFAULT 0,
    likes_count BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fts tsvector
);

-- Junction Table: Songs <-> Artists
CREATE TABLE public.song_artists (
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    artist_id UUID NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
    role_description TEXT DEFAULT 'Vocalist',
    PRIMARY KEY (song_id, artist_id)
);

-- Playlists
CREATE TABLE public.playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Junction Table: Playlists <-> Songs
CREATE TABLE public.playlist_songs (
    playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    position INTEGER NOT NULL CHECK (position >= 0),
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (playlist_id, song_id)
);

-- User Likes
CREATE TABLE public.song_likes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, song_id)
);

-- Guest Device Likes (Guarantees exactly 1 like per guest device per song)
CREATE TABLE public.guest_song_likes (
    client_fingerprint TEXT NOT NULL,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (client_fingerprint, song_id)
);

-- Song Views Audit Log (Anti-Bot & Rate Limiting for Legitimate Plays)
CREATE TABLE public.song_views_log (
    id BIGSERIAL PRIMARY KEY,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    client_fingerprint TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Studio Voice Recordings (User Recordings)
CREATE TABLE public.studio_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes_count INT NOT NULL DEFAULT 0,
    downvotes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Recording Votes
CREATE TABLE public.recording_votes (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recording_id UUID NOT NULL REFERENCES public.studio_recordings(id) ON DELETE CASCADE,
    vote public.vote_type NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, recording_id)
);

-- 4. INDEXES & SEARCH CONFIGURATION

-- Performance Indexes
CREATE INDEX idx_anime_slug ON public.anime(slug);
CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_songs_anime_id ON public.songs(anime_id);
CREATE INDEX idx_songs_slug ON public.songs(slug);
CREATE INDEX idx_songs_status ON public.songs(status);
CREATE INDEX idx_playlists_user_id ON public.playlists(user_id);
CREATE INDEX idx_playlist_songs_playlist_id ON public.playlist_songs(playlist_id, position);
CREATE INDEX idx_studio_recordings_song_id ON public.studio_recordings(song_id);
CREATE INDEX idx_studio_recordings_user_id ON public.studio_recordings(user_id);

-- Trigram Indexes for Arabic & English Fuzzy Text Search
CREATE INDEX idx_anime_title_ar_trgm ON public.anime USING gin (title_ar gin_trgm_ops);
CREATE INDEX idx_anime_title_en_trgm ON public.anime USING gin (title_en gin_trgm_ops);
CREATE INDEX idx_artists_name_ar_trgm ON public.artists USING gin (name_ar gin_trgm_ops);
CREATE INDEX idx_artists_name_en_trgm ON public.artists USING gin (name_en gin_trgm_ops);
CREATE INDEX idx_songs_title_ar_trgm ON public.songs USING gin (title_ar gin_trgm_ops);
CREATE INDEX idx_songs_title_en_trgm ON public.songs USING gin (title_en gin_trgm_ops);

-- Full-Text Search GIN Index on Songs
CREATE INDEX idx_songs_fts ON public.songs USING gin (fts);

-- 5. FUNCTIONS & TRIGGERS

-- Function: Automatic Updated At Timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Updated At Triggers
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_anime_updated_at BEFORE UPDATE ON public.anime FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_artists_updated_at BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_songs_updated_at BEFORE UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_playlists_updated_at BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_studio_recordings_updated_at BEFORE UPDATE ON public.studio_recordings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function: Sync Full-Text Search Vector
CREATE OR REPLACE FUNCTION public.songs_update_fts()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fts :=
        setweight(to_tsvector('simple', COALESCE(NEW.title_ar, '')), 'A') ||
        setweight(to_tsvector('simple', COALESCE(NEW.title_en, '')), 'B') ||
        setweight(to_tsvector('simple', COALESCE(NEW.lyrics_ar, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_songs_fts BEFORE INSERT OR UPDATE ON public.songs FOR EACH ROW EXECUTE FUNCTION public.songs_update_fts();

-- Function: Automatically Sync Auth Users to Profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, display_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::text, 1, 8)),
        COALESCE(NEW.raw_user_meta_data->>'display_name', 'مستمع يونا'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function: Increment Song Play Counter with Anti-Bot Flood & Cooldown Protection
CREATE OR REPLACE FUNCTION public.increment_song_views(
    song_uuid UUID,
    client_fp TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_identifier TEXT;
    v_recent_burst INT;
BEGIN
    -- Determine pseudonymous identifier (Auth UID or sanitized Device Fingerprint)
    v_identifier := COALESCE(auth.uid()::text, NULLIF(TRIM(client_fp), ''), 'guest_listener');

    -- 1. Anti-Bot Burst Shield: Disallow more than 15 view increments per minute per client
    SELECT COUNT(*) INTO v_recent_burst
    FROM public.song_views_log
    WHERE client_fingerprint = v_identifier
      AND created_at > (NOW() - INTERVAL '1 minute');

    IF v_recent_burst >= 15 THEN
        -- Automated spam loop detected: drop silently
        RETURN FALSE;
    END IF;

    -- 2. Song Play Cooldown: Disallow re-counting the same song from same client within 30 minutes
    IF EXISTS (
        SELECT 1 FROM public.song_views_log
        WHERE song_id = song_uuid
          AND client_fingerprint = v_identifier
          AND created_at > (NOW() - INTERVAL '30 minutes')
    ) THEN
        -- Already counted recently: do not inflate
        RETURN FALSE;
    END IF;

    -- 3. Log legitimate view audit entry
    INSERT INTO public.song_views_log (song_id, user_id, client_fingerprint, created_at)
    VALUES (song_uuid, auth.uid(), v_identifier, NOW());

    -- 4. Atomically increment the main song views count
    UPDATE public.songs
    SET views_count = views_count + 1
    WHERE id = song_uuid;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Function: Toggle Song Like with Anti-Fake-Likes Protection
CREATE OR REPLACE FUNCTION public.toggle_song_like(
    song_uuid UUID,
    client_fp TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_is_liked BOOLEAN;
    v_total_likes INT;
    v_fp TEXT := NULLIF(TRIM(client_fp), '');
BEGIN
    IF v_user_id IS NOT NULL THEN
        -- Authenticated flow: Enforced by UNIQUE(user_id, song_id)
        -- Reconcile any prior guest like from this device so the user doesn't double-count
        IF v_fp IS NOT NULL THEN
            IF EXISTS (SELECT 1 FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid) THEN
                DELETE FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid;
                -- The guest like was previously counted in songs.likes_count, so decrement it before sync_song_likes_count re-increments or deletes
                UPDATE public.songs SET likes_count = GREATEST(0, likes_count - 1) WHERE id = song_uuid;
            END IF;
        END IF;

        IF EXISTS (SELECT 1 FROM public.song_likes WHERE user_id = v_user_id AND song_id = song_uuid) THEN
            DELETE FROM public.song_likes WHERE user_id = v_user_id AND song_id = song_uuid;
            v_is_liked := FALSE;
        ELSE
            INSERT INTO public.song_likes (user_id, song_id) VALUES (v_user_id, song_uuid);
            v_is_liked := TRUE;
        END IF;
    ELSE
        -- Guest device flow: Enforced by UNIQUE(client_fingerprint, song_id)
        IF v_fp IS NULL THEN
            RAISE EXCEPTION 'Device fingerprint required for guest likes';
        END IF;

        IF EXISTS (SELECT 1 FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid) THEN
            DELETE FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid;
            UPDATE public.songs SET likes_count = GREATEST(0, likes_count - 1) WHERE id = song_uuid;
            v_is_liked := FALSE;
        ELSE
            INSERT INTO public.guest_song_likes (client_fingerprint, song_id) VALUES (v_fp, song_uuid);
            UPDATE public.songs SET likes_count = likes_count + 1 WHERE id = song_uuid;
            v_is_liked := TRUE;
        END IF;
    END IF;

    SELECT likes_count INTO v_total_likes FROM public.songs WHERE id = song_uuid;

    RETURN jsonb_build_object(
        'liked', v_is_liked,
        'total_likes', COALESCE(v_total_likes, 0)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Function: Automatically Sync songs.likes_count with song_likes
CREATE OR REPLACE FUNCTION public.sync_song_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.songs
        SET likes_count = likes_count + 1
        WHERE id = NEW.song_id;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.songs
        SET likes_count = GREATEST(0, likes_count - 1)
        WHERE id = OLD.song_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE TRIGGER trg_sync_song_likes
AFTER INSERT OR DELETE ON public.song_likes
FOR EACH ROW EXECUTE FUNCTION public.sync_song_likes_count();

-- Function: Automatically Sync studio_recordings upvotes_count & downvotes_count with recording_votes
CREATE OR REPLACE FUNCTION public.sync_recording_votes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        IF (NEW.vote = 'up') THEN
            UPDATE public.studio_recordings
            SET upvotes_count = upvotes_count + 1
            WHERE id = NEW.recording_id;
        ELSIF (NEW.vote = 'down') THEN
            UPDATE public.studio_recordings
            SET downvotes_count = downvotes_count + 1
            WHERE id = NEW.recording_id;
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        IF (OLD.vote = 'up') THEN
            UPDATE public.studio_recordings
            SET upvotes_count = GREATEST(0, upvotes_count - 1)
            WHERE id = OLD.recording_id;
        ELSIF (OLD.vote = 'down') THEN
            UPDATE public.studio_recordings
            SET downvotes_count = GREATEST(0, downvotes_count - 1)
            WHERE id = OLD.recording_id;
        END IF;
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        -- Prevent changing recording_id on existing vote to preserve counter integrity
        IF (OLD.recording_id <> NEW.recording_id) THEN
            RAISE EXCEPTION 'Cannot modify recording_id on an existing vote. Delete and create a new vote instead.';
        END IF;

        IF (OLD.vote <> NEW.vote) THEN
            IF (NEW.vote = 'up' AND OLD.vote = 'down') THEN
                UPDATE public.studio_recordings
                SET upvotes_count = upvotes_count + 1,
                    downvotes_count = GREATEST(0, downvotes_count - 1)
                WHERE id = NEW.recording_id;
            ELSIF (NEW.vote = 'down' AND OLD.vote = 'up') THEN
                UPDATE public.studio_recordings
                SET downvotes_count = downvotes_count + 1,
                    upvotes_count = GREATEST(0, upvotes_count - 1)
                WHERE id = NEW.recording_id;
            END IF;
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

CREATE TRIGGER trg_sync_recording_votes
AFTER INSERT OR UPDATE OR DELETE ON public.recording_votes
FOR EACH ROW EXECUTE FUNCTION public.sync_recording_votes_count();

-- 6. VIEWS

CREATE OR REPLACE VIEW public.view_published_songs AS
SELECT 
    s.id AS song_id,
    s.title_ar,
    s.title_en,
    s.slug,
    s.duration_seconds,
    s.audio_type,
    s.audio_url,
    s.views_count,
    s.likes_count,
    a.title_ar AS anime_title_ar,
    a.slug AS anime_slug,
    COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT('id', ar.id, 'name_ar', ar.name_ar, 'slug', ar.slug)
        ) FILTER (WHERE ar.id IS NOT NULL), '[]'
    ) AS artists
FROM public.songs s
LEFT JOIN public.anime a ON s.anime_id = a.id
LEFT JOIN public.song_artists sa ON s.id = sa.song_id
LEFT JOIN public.artists ar ON sa.artist_id = ar.id
WHERE s.status = 'published'
GROUP BY s.id, a.id;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anime ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_views_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recording_votes ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check Admin Status with secure search_path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);

-- Prevent ordinary users from escalating their role:
-- Non-admin users can update their profile columns only if role remains unchanged; admins can update everything.
CREATE POLICY "Users can update own profile except role" ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin()
);

-- Anime Policies
CREATE POLICY "Anime list is viewable by everyone" ON public.anime FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage anime" ON public.anime FOR ALL USING (public.is_admin());

-- Artists Policies
CREATE POLICY "Artists are viewable by everyone" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins manage artists" ON public.artists FOR ALL USING (public.is_admin());

-- Songs Policies
CREATE POLICY "Published songs are viewable by everyone" ON public.songs FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "Admins manage songs" ON public.songs FOR ALL USING (public.is_admin());

-- Song Artists Junction Policies
CREATE POLICY "Song artists associations are viewable by everyone" ON public.song_artists FOR SELECT USING (true);
CREATE POLICY "Admins manage song artists" ON public.song_artists FOR ALL USING (public.is_admin());

-- Playlists Policies
CREATE POLICY "Public playlists are viewable by everyone" ON public.playlists FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can manage own playlists" ON public.playlists FOR ALL USING (auth.uid() = user_id);

-- Playlist Songs Policies
CREATE POLICY "Playlist items viewable if playlist viewable" ON public.playlist_songs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND (p.is_public = TRUE OR p.user_id = auth.uid()))
);
CREATE POLICY "Users manage songs in own playlists" ON public.playlist_songs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.playlists p WHERE p.id = playlist_id AND p.user_id = auth.uid())
);

-- Song Likes Policies
CREATE POLICY "Users can view own likes" ON public.song_likes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own likes" ON public.song_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.song_likes FOR DELETE USING (auth.uid() = user_id);

-- Studio Recordings Policies
CREATE POLICY "Public studio recordings viewable by everyone" ON public.studio_recordings FOR SELECT USING (is_public = TRUE OR auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users insert own studio recordings" ON public.studio_recordings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own studio recordings" ON public.studio_recordings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own studio recordings" ON public.studio_recordings FOR DELETE USING (auth.uid() = user_id);

-- Recording Votes Policies
CREATE POLICY "Votes viewable by everyone" ON public.recording_votes FOR SELECT USING (true);
CREATE POLICY "Users insert own votes" ON public.recording_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own votes" ON public.recording_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own votes" ON public.recording_votes FOR DELETE USING (auth.uid() = user_id);

-- Guest Song Likes & Song Views Log Policies (Deny direct client write; accessible only via SECURITY DEFINER functions or admins)
CREATE POLICY "Guest likes viewable only by admins" ON public.guest_song_likes FOR SELECT USING (public.is_admin());
CREATE POLICY "Song views log viewable only by admins" ON public.song_views_log FOR SELECT USING (public.is_admin());

-- 8. YOUTUBE INTEGRATION TABLES & LOGS

CREATE TYPE public.sync_trigger AS ENUM ('cron', 'manual');
CREATE TYPE public.sync_status AS ENUM ('in_progress', 'completed', 'failed');

CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youtube_video_id TEXT UNIQUE NOT NULL,
    channel_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    published_at TIMESTAMPTZ NOT NULL,
    duration_seconds INTEGER,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    song_id UUID REFERENCES public.songs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_youtube_videos_yt_id ON public.youtube_videos(youtube_video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_published ON public.youtube_videos(published_at DESC);

CREATE TABLE IF NOT EXISTS public.youtube_sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger_type public.sync_trigger NOT NULL,
    status public.sync_status NOT NULL DEFAULT 'in_progress',
    videos_fetched INTEGER DEFAULT 0,
    videos_imported INTEGER DEFAULT 0,
    videos_updated INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_started ON public.youtube_sync_logs(started_at DESC);

ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public videos are viewable by everyone" 
ON public.youtube_videos FOR SELECT USING (true);

CREATE POLICY "Admins can manage youtube videos" 
ON public.youtube_videos FOR ALL USING (public.is_admin());

CREATE POLICY "Admins can view sync logs" 
ON public.youtube_sync_logs FOR SELECT USING (public.is_admin());

-- Updated At Trigger for youtube_videos
CREATE TRIGGER set_youtube_videos_updated_at 
BEFORE UPDATE ON public.youtube_videos 
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

