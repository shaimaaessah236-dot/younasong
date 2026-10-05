import { createAdminClient } from "@/lib/supabase/admin";
import {
  YouTubePlaylistItemsResponse,
  YouTubeVideoListResponse,
  YouTubeSyncResult,
} from "@/types/youtube-sync";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || "@yona_songs";

/**
 * Parses ISO 8601 duration strings (e.g., PT3M45S, PT1H2M10S) to seconds.
 */
function parseISODuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Fetches Uploads Playlist ID for the given channel handle or ID.
 */
async function getUploadsPlaylistId(): Promise<{ playlistId: string; channelId: string }> {
  if (!YOUTUBE_API_KEY) {
    throw new Error("Missing YOUTUBE_API_KEY environment variable.");
  }

  const cleanHandle = YOUTUBE_CHANNEL_HANDLE.replace("@", "");
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,id&forHandle=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
  
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`YouTube API Error: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error(`YouTube Channel not found for handle: ${YOUTUBE_CHANNEL_HANDLE}`);
  }

  const channelId = data.items[0].id;
  const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
  return { playlistId, channelId };
}

/**
 * Core Orchestrator for Importing/Updating YouTube Videos in Supabase.
 */
export async function executeYouTubeSync(triggerType: "cron" | "manual"): Promise<YouTubeSyncResult> {
  const supabase = createAdminClient();

  // Create initial log record
  const { data: log, error: logError } = await supabase
    .from("youtube_sync_logs")
    .insert({
      trigger_type: triggerType,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (logError || !log) {
    throw new Error(`Failed to create sync log: ${logError?.message}`);
  }

  const logId = log.id;
  let totalFetched = 0;
  let totalImported = 0;
  let totalUpdated = 0;

  try {
    const { playlistId, channelId } = await getUploadsPlaylistId();

    let pageToken: string | undefined = undefined;

    do {
      // 1. Fetch Playlist Items Page
      const playlistUrl = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      playlistUrl.searchParams.set("part", "snippet");
      playlistUrl.searchParams.set("playlistId", playlistId);
      playlistUrl.searchParams.set("maxResults", "50");
      playlistUrl.searchParams.set("key", YOUTUBE_API_KEY!);
      if (pageToken) playlistUrl.searchParams.set("pageToken", pageToken);

      const playlistRes = await fetch(playlistUrl.toString(), { cache: "no-store" });
      if (!playlistRes.ok) throw new Error(`Playlist fetch failed: ${playlistRes.statusText}`);

      const playlistData: YouTubePlaylistItemsResponse = await playlistRes.json();
      const items = playlistData.items || [];
      if (items.length === 0) break;

      totalFetched += items.length;
      pageToken = playlistData.nextPageToken;

      const videoIds = items.map((item) => item.snippet.resourceId.videoId);

      // 2. Fetch Video Details (Duration, Statistics) in Batch
      const videoDetailsUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
      videoDetailsUrl.searchParams.set("part", "contentDetails,statistics");
      videoDetailsUrl.searchParams.set("id", videoIds.join(","));
      videoDetailsUrl.searchParams.set("key", YOUTUBE_API_KEY!);

      const videoDetailsRes = await fetch(videoDetailsUrl.toString(), { cache: "no-store" });
      if (!videoDetailsRes.ok) throw new Error(`Video details fetch failed: ${videoDetailsRes.statusText}`);

      const videoDetailsData: YouTubeVideoListResponse = await videoDetailsRes.json();
      const detailsMap = new Map(videoDetailsData.items.map((v) => [v.id, v]));

      // 3. Upsert into Supabase Database
      for (const item of items) {
        const videoId = item.snippet.resourceId.videoId;
        const details = detailsMap.get(videoId);

        const videoRecord = {
          youtube_video_id: videoId,
          channel_id: channelId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail_url:
            item.snippet.thumbnails?.high?.url ||
            item.snippet.thumbnails?.medium?.url ||
            item.snippet.thumbnails?.default?.url ||
            "",
          published_at: item.snippet.publishedAt,
          duration_seconds: details ? parseISODuration(details.contentDetails.duration) : null,
          view_count: details?.statistics.viewCount ? parseInt(details.statistics.viewCount, 10) : 0,
          like_count: details?.statistics.likeCount ? parseInt(details.statistics.likeCount, 10) : 0,
          updated_at: new Date().toISOString(),
        };

        // Check if video already exists
        const { data: existing } = await supabase
          .from("youtube_videos")
          .select("id")
          .eq("youtube_video_id", videoId)
          .maybeSingle();

        const { error: upsertError } = await supabase
          .from("youtube_videos")
          .upsert(videoRecord, { onConflict: "youtube_video_id" });

        if (upsertError) {
          throw new Error(`Failed to upsert video ${videoId}: ${upsertError.message}`);
        }

        if (existing) {
          totalUpdated += 1;
        } else {
          totalImported += 1;
        }
      }
    } while (pageToken);

    // Mark Log Completed
    await supabase
      .from("youtube_sync_logs")
      .update({
        status: "completed",
        videos_fetched: totalFetched,
        videos_imported: totalImported,
        videos_updated: totalUpdated,
        completed_at: new Date().toISOString(),
      })
      .eq("id", logId);

    return {
      success: true,
      logId,
      videosFetched: totalFetched,
      videosImported: totalImported,
      videosUpdated: totalUpdated,
    };
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    await supabase
      .from("youtube_sync_logs")
      .update({
        status: "failed",
        error_message: errorMessage,
        completed_at: new Date().toISOString(),
      })
      .eq("id", logId);

    return {
      success: false,
      logId,
      videosFetched: totalFetched,
      videosImported: totalImported,
      videosUpdated: totalUpdated,
      error: errorMessage,
    };
  }
}

export async function syncYouTubeChannel(channelHandle?: string) {
  return executeYouTubeSync("manual");
}
