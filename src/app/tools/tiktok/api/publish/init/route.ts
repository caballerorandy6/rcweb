import { z } from "zod";
import { initVideoPost, PRIVACY_LEVELS, queryCreatorInfo, TikTokApiError } from "@/lib/tiktok/api";
import { MAX_VIDEO_BYTES, planChunks } from "@/lib/tiktok/chunks";
import { assertSameOrigin, errorResponse, withTikTokSession } from "@/lib/tiktok/handler";
import { getClientIp, rateLimiters } from "@/lib/rateLimit";

const initBodySchema = z
  .object({
    title: z.string().trim().max(2200).optional(),
    privacyLevel: z.enum(PRIVACY_LEVELS),
    allowComment: z.boolean(),
    allowDuet: z.boolean(),
    allowStitch: z.boolean(),
    commercialContent: z.boolean(),
    yourBrand: z.boolean(),
    brandedContent: z.boolean(),
    videoSize: z.number().int().positive().max(MAX_VIDEO_BYTES),
  })
  .refine((body) => !body.commercialContent || body.yourBrand || body.brandedContent, {
    message: "Indicate whether the content promotes yourself, a third party, or both.",
    path: ["commercialContent"],
  })
  .refine((body) => !(body.commercialContent && body.brandedContent && body.privacyLevel === "SELF_ONLY"), {
    message: "Branded content visibility cannot be set to private.",
    path: ["privacyLevel"],
  });

/**
 * Starts a Direct Post upload: validates the form against the creator's
 * current options, registers the post with TikTok and returns the upload
 * URL plus the chunk plan. The browser then PUTs the file straight to TikTok.
 */
export async function POST(request: Request) {
  const rejected = assertSameOrigin(request);
  if (rejected) return rejected;

  const { success } = await rateLimiters.api.limit(getClientIp(request));
  if (!success) return errorResponse("rate_limited", "Too many requests. Please try again later.", 429);

  const parsed = initBodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return errorResponse("invalid_request", issue?.message || "Invalid form data.", 400);
  }
  const body = parsed.data;

  return withTikTokSession(async (session) => {
    // Re-check the creator's live settings: the options can change between
    // the form render and the submit.
    const creator = await queryCreatorInfo(session.accessToken);
    if (!creator.privacy_level_options.includes(body.privacyLevel)) {
      throw new TikTokApiError(
        "privacy_level_option_mismatch",
        "That privacy option is no longer available for this account. Reload and choose again.",
        403
      );
    }

    const plan = planChunks(body.videoSize);
    const commercial = body.commercialContent;
    const result = await initVideoPost(
      session.accessToken,
      {
        title: body.title || undefined,
        privacy_level: body.privacyLevel,
        disable_comment: creator.comment_disabled || !body.allowComment,
        disable_duet: creator.duet_disabled || !body.allowDuet,
        disable_stitch: creator.stitch_disabled || !body.allowStitch,
        brand_content_toggle: commercial && body.brandedContent,
        brand_organic_toggle: commercial && body.yourBrand,
      },
      { videoSize: body.videoSize, chunkSize: plan.chunkSize, totalChunkCount: plan.totalChunkCount }
    );

    return { publishId: result.publish_id, uploadUrl: result.upload_url, ranges: plan.ranges };
  });
}

