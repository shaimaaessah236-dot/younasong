"use server";

import { executeYouTubeSync } from "@/services/youtube-sync.service";
import { YouTubeSyncResult, YouTubeSyncResultSchema } from "@/types/youtube-sync";
import { createClient } from "@/lib/supabase/server";

export async function triggerManualYouTubeSync(): Promise<YouTubeSyncResult> {
  const supabase = await createClient();

  // Verify Admin Permission
  const { data: userProfile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
    .single();

  if (error || userProfile?.role !== "admin") {
    return {
      success: false,
      logId: "",
      videosFetched: 0,
      videosImported: 0,
      videosUpdated: 0,
      error: "Unauthorized: Admin privileges required.",
    };
  }

  const result = await executeYouTubeSync("manual");
  return YouTubeSyncResultSchema.parse(result);
}
