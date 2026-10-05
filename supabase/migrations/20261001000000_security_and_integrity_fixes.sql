-- ============================================================================
-- YONA SONGS - PRODUCTION HOTFIX (5 CRITICAL & ESSENTIAL FIXES)
-- Migration: 20261001000000_security_and_integrity_fixes.sql
-- ============================================================================

-- 1. إصلاح ثغرة صلاحية المستخدم ومنع ترقية الـ role إلى admin
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile except role" ON public.profiles 
FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (
    (auth.uid() = id AND role = (SELECT p.role FROM public.profiles p WHERE p.id = auth.uid()))
    OR public.is_admin()
);


-- 2. تفعيل RLS على جدولي إعجابات وسجل مشاهدات الزوار وحمايتهما
ALTER TABLE public.guest_song_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.song_views_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Guest likes viewable only by admins" ON public.guest_song_likes;
DROP POLICY IF EXISTS "Song views log viewable only by admins" ON public.song_views_log;

CREATE POLICY "Guest likes viewable only by admins" 
ON public.guest_song_likes FOR SELECT USING (public.is_admin());

CREATE POLICY "Song views log viewable only by admins" 
ON public.song_views_log FOR SELECT USING (public.is_admin());

-- إضافة سياسات RLS لجدول تصويتات التسجيلات recording_votes
DROP POLICY IF EXISTS "Votes viewable by everyone" ON public.recording_votes;
DROP POLICY IF EXISTS "Users insert own votes" ON public.recording_votes;
DROP POLICY IF EXISTS "Users update own votes" ON public.recording_votes;
DROP POLICY IF EXISTS "Users delete own votes" ON public.recording_votes;

CREATE POLICY "Votes viewable by everyone" ON public.recording_votes FOR SELECT USING (true);
CREATE POLICY "Users insert own votes" ON public.recording_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own votes" ON public.recording_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own votes" ON public.recording_votes FOR DELETE USING (auth.uid() = user_id);


-- 3. حماية تماسك عدادات التصويت عند التعديل (منع تغيير recording_id)
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
        -- منع العبث بـ recording_id أثناء التعديل لضمان سلامة العداد
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


-- 4. ربط التحديث التلقائي لـ updated_at في جدول فيديوهات YouTube
DROP TRIGGER IF EXISTS set_youtube_videos_updated_at ON public.youtube_videos;

CREATE TRIGGER set_youtube_videos_updated_at 
BEFORE UPDATE ON public.youtube_videos 
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- 5. فهارس الـ Trigram المتقدمة للعناوين والأسماء بالإنجليزية
CREATE INDEX IF NOT EXISTS idx_anime_title_en_trgm ON public.anime USING gin (title_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_artists_name_en_trgm ON public.artists USING gin (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_songs_title_en_trgm ON public.songs USING gin (title_en gin_trgm_ops);


-- 6. تحسين تسوية إعجابات الزائر عند تسجيل دخوله كمستخدم
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
        -- تسوية أي إعجاب سابق بالبصمة لتفادي الازدواجية
        IF v_fp IS NOT NULL THEN
            IF EXISTS (SELECT 1 FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid) THEN
                DELETE FROM public.guest_song_likes WHERE client_fingerprint = v_fp AND song_id = song_uuid;
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
