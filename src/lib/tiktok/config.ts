/**
 * TikTok Content Posting API (Direct Post) for the private /tools/tiktok page.
 *
 * Credentials come from the environment only (sandbox keys in Preview,
 * production keys after the app passes TikTok's review). Never log them.
 */

export const TIKTOK_AUTHORIZE_URL = "https://www.tiktok.com/v2/auth/authorize/";
export const TIKTOK_API_BASE = "https://open.tiktokapis.com";

/** Scopes requested at authorization; must match the app in the portal. */
export const TIKTOK_SCOPES = ["user.info.basic", "video.upload", "video.publish"] as const;

/** The page the user lands on after TikTok redirects back. */
export const TIKTOK_TOOL_PATH = "/tools/tiktok";

/** Cookies are scoped to the tool so they never travel with the rest of the site. */
export const TIKTOK_COOKIE_PATH = TIKTOK_TOOL_PATH;
export const TIKTOK_SESSION_COOKIE = "tiktok_session";
export const TIKTOK_STATE_COOKIE = "tiktok_oauth_state";

/** TikTok's legal pages that the consent line must link to (reviewed UX). */
export const TIKTOK_MUSIC_USAGE_URL =
  "https://www.tiktok.com/legal/page/global/music-usage-confirmation/en";
export const TIKTOK_BRANDED_CONTENT_POLICY_URL =
  "https://www.tiktok.com/legal/page/global/bc-policy/en";

export type TikTokCredentials = { clientKey: string; clientSecret: string };

export function getTikTokCredentials(): TikTokCredentials | null {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) return null;
  return { clientKey, clientSecret };
}

export function isTikTokConfigured(): boolean {
  return getTikTokCredentials() !== null;
}

/**
 * Secret used to encrypt the token cookie. A dedicated variable is preferred;
 * the NextAuth secret is accepted so the preview works with one less setting.
 */
export function getTikTokCookieSecret(): string | null {
  return process.env.TIKTOK_COOKIE_SECRET || process.env.NEXTAUTH_SECRET || null;
}

/**
 * The redirect URI registered in the TikTok portal. Defaults to the current
 * host so a preview deployment can be tested once its URL is registered too;
 * TIKTOK_REDIRECT_URI pins it (production uses the www host).
 */
export function getTikTokRedirectUri(requestOrigin: string): string {
  return process.env.TIKTOK_REDIRECT_URI || `${requestOrigin}${TIKTOK_TOOL_PATH}`;
}

/** Public origin of the current request (Vercel forwards the host). */
export function getRequestOrigin(request: Request): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost || request.headers.get("host") || new URL(request.url).host;
  const proto = request.headers.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
