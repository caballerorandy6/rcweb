import { z } from "zod";
import { TIKTOK_API_BASE, type TikTokCredentials } from "./config";

/** Error returned by TikTok (OAuth or v2 API), safe to show to the user. */
export class TikTokApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "TikTokApiError";
  }
}

// --- OAuth -----------------------------------------------------------------

const tokenResponseSchema = z.object({
  open_id: z.string(),
  scope: z.string(),
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_expires_in: z.number(),
  token_type: z.string(),
});

const oauthErrorSchema = z.object({
  error: z.string(),
  error_description: z.string().optional(),
});

export type TikTokTokens = z.infer<typeof tokenResponseSchema>;

async function oauthPost(path: string, params: Record<string, string>): Promise<unknown> {
  const response = await fetch(`${TIKTOK_API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams(params).toString(),
    cache: "no-store",
  });

  const text = await response.text();
  const json: unknown = text ? JSON.parse(text) : {};
  const oauthError = oauthErrorSchema.safeParse(json);
  if (oauthError.success && oauthError.data.error && oauthError.data.error !== "ok") {
    throw new TikTokApiError(
      oauthError.data.error,
      oauthError.data.error_description || "TikTok rejected the request.",
      response.status
    );
  }
  if (!response.ok) {
    throw new TikTokApiError("http_error", `TikTok responded with ${response.status}.`, response.status);
  }
  return json;
}

export async function exchangeCodeForTokens(
  credentials: TikTokCredentials,
  code: string,
  redirectUri: string
): Promise<TikTokTokens> {
  const json = await oauthPost("/v2/oauth/token/", {
    client_key: credentials.clientKey,
    client_secret: credentials.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  return tokenResponseSchema.parse(json);
}

export async function refreshAccessToken(
  credentials: TikTokCredentials,
  refreshToken: string
): Promise<TikTokTokens> {
  const json = await oauthPost("/v2/oauth/token/", {
    client_key: credentials.clientKey,
    client_secret: credentials.clientSecret,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return tokenResponseSchema.parse(json);
}

export async function revokeAccessToken(
  credentials: TikTokCredentials,
  accessToken: string
): Promise<void> {
  await oauthPost("/v2/oauth/revoke/", {
    client_key: credentials.clientKey,
    client_secret: credentials.clientSecret,
    token: accessToken,
  });
}

// --- v2 API ----------------------------------------------------------------

const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string().optional(),
});

async function apiRequest<T>(
  accessToken: string,
  path: string,
  init: { method: "GET" | "POST"; body?: unknown },
  dataSchema: z.ZodType<T>
): Promise<T> {
  const response = await fetch(`${TIKTOK_API_BASE}${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(init.body !== undefined && { "Content-Type": "application/json; charset=UTF-8" }),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });

  const text = await response.text();
  let json: { data?: unknown; error?: unknown } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new TikTokApiError("invalid_response", "TikTok returned an unreadable response.", 502);
  }

  const error = apiErrorSchema.safeParse(json.error);
  if (error.success && error.data.code !== "ok") {
    throw new TikTokApiError(
      error.data.code,
      error.data.message || "TikTok rejected the request.",
      response.ok ? 400 : response.status
    );
  }
  if (!response.ok) {
    throw new TikTokApiError("http_error", `TikTok responded with ${response.status}.`, response.status);
  }

  const data = dataSchema.safeParse(json.data);
  if (!data.success) {
    throw new TikTokApiError("invalid_response", "TikTok returned an unexpected payload.", 502);
  }
  return data.data;
}

const userInfoSchema = z.object({
  user: z.object({
    open_id: z.string(),
    display_name: z.string().optional(),
    avatar_url: z.string().optional(),
    avatar_url_100: z.string().optional(),
  }),
});

export type TikTokUserInfo = z.infer<typeof userInfoSchema>["user"];

/** user.info.basic: identity shown once connected. */
export function getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
  const fields = "open_id,display_name,avatar_url,avatar_url_100";
  return apiRequest(accessToken, `/v2/user/info/?fields=${fields}`, { method: "GET" }, userInfoSchema).then(
    (data) => data.user
  );
}

export const PRIVACY_LEVELS = [
  "PUBLIC_TO_EVERYONE",
  "MUTUAL_FOLLOW_FRIENDS",
  "FOLLOWER_OF_CREATOR",
  "SELF_ONLY",
] as const;

export type PrivacyLevel = (typeof PRIVACY_LEVELS)[number];

const creatorInfoSchema = z.object({
  creator_avatar_url: z.string().optional(),
  creator_username: z.string().optional(),
  creator_nickname: z.string().optional(),
  privacy_level_options: z.array(z.string()).default([]),
  comment_disabled: z.boolean().default(false),
  duet_disabled: z.boolean().default(false),
  stitch_disabled: z.boolean().default(false),
  max_video_post_duration_sec: z.number().optional(),
});

export type TikTokCreatorInfo = z.infer<typeof creatorInfoSchema>;

/** Must be queried every time the post form renders (TikTok UX guideline). */
export function queryCreatorInfo(accessToken: string): Promise<TikTokCreatorInfo> {
  return apiRequest(
    accessToken,
    "/v2/post/publish/creator_info/query/",
    { method: "POST", body: {} },
    creatorInfoSchema
  );
}

export type VideoPostInfo = {
  title?: string;
  privacy_level: PrivacyLevel;
  disable_comment: boolean;
  disable_duet: boolean;
  disable_stitch: boolean;
  brand_content_toggle: boolean;
  brand_organic_toggle: boolean;
};

const initResponseSchema = z.object({
  publish_id: z.string(),
  upload_url: z.string().url(),
});

export type InitVideoPostResult = z.infer<typeof initResponseSchema>;

/** Direct Post, FILE_UPLOAD: returns the publish id and the chunk upload URL. */
export function initVideoPost(
  accessToken: string,
  postInfo: VideoPostInfo,
  source: { videoSize: number; chunkSize: number; totalChunkCount: number }
): Promise<InitVideoPostResult> {
  return apiRequest(
    accessToken,
    "/v2/post/publish/video/init/",
    {
      method: "POST",
      body: {
        post_info: postInfo,
        source_info: {
          source: "FILE_UPLOAD",
          video_size: source.videoSize,
          chunk_size: source.chunkSize,
          total_chunk_count: source.totalChunkCount,
        },
      },
    },
    initResponseSchema
  );
}

export const PUBLISH_STATUSES = [
  "PROCESSING_UPLOAD",
  "PROCESSING_DOWNLOAD",
  "SEND_TO_USER_INBOX",
  "PUBLISH_COMPLETE",
  "FAILED",
] as const;

const publishStatusSchema = z.object({
  status: z.string(),
  fail_reason: z.string().optional(),
  publicaly_available_post_id: z.array(z.union([z.number(), z.string()])).optional(),
  uploaded_bytes: z.number().optional(),
});

export type PublishStatus = z.infer<typeof publishStatusSchema>;

export function fetchPublishStatus(accessToken: string, publishId: string): Promise<PublishStatus> {
  return apiRequest(
    accessToken,
    "/v2/post/publish/status/fetch/",
    { method: "POST", body: { publish_id: publishId } },
    publishStatusSchema
  );
}
