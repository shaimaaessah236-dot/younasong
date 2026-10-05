import { NextRequest, NextResponse } from "next/server";
import { executeYouTubeSync } from "@/services/youtube-sync.service";

export const revalidate = 0;

export async function GET(request: NextRequest) {
  // Authorization check for Vercel Cron / Scheduled Job
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized Cron Request", { status: 401 });
  }

  const result = await executeYouTubeSync("cron");

  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }

  return NextResponse.json(result, { status: 200 });
}
