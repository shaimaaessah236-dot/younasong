import { z } from "zod";

export const YouTubeSyncResultSchema = z.object({
  success: z.boolean(),
  logId: z.string(),
  videosFetched: z.number(),
  videosImported: z.number(),
  videosUpdated: z.number(),
  error: z.string().optional(),
});

export type YouTubeSyncResult = z.infer<typeof YouTubeSyncResultSchema>;

export interface YouTubePlaylistItemSnippet {
  publishedAt: string;
  title: string;
  description: string;
  thumbnails?: {
    high?: { url: string };
    medium?: { url: string };
    default?: { url: string };
  };
  resourceId: {
    videoId: string;
  };
}

export interface YouTubePlaylistItem {
  snippet: YouTubePlaylistItemSnippet;
}

export interface YouTubePlaylistItemsResponse {
  nextPageToken?: string;
  items: YouTubePlaylistItem[];
}

export interface YouTubeVideoDetails {
  id: string;
  contentDetails: {
    duration: string; // ISO 8601 duration string (e.g. PT3M45S)
  };
  statistics: {
    viewCount?: string;
    likeCount?: string;
  };
}

export interface YouTubeVideoListResponse {
  items: YouTubeVideoDetails[];
}
