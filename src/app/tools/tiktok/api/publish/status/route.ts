import { fetchPublishStatus } from "@/lib/tiktok/api";
import { errorResponse, withTikTokSession } from "@/lib/tiktok/handler";

/** Polled by the page until the post is PUBLISH_COMPLETE or FAILED. */
export async function GET(request: Request) {
  const publishId = new URL(request.url).searchParams.get("publishId");
  if (!publishId || publishId.length > 64) {
    return errorResponse("invalid_request", "publishId is required.", 400);
  }
  return withTikTokSession((session) => fetchPublishStatus(session.accessToken, publishId));
}
