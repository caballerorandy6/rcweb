import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import {
  getRequestOrigin,
  getTikTokCredentials,
  getTikTokRedirectUri,
  isTikTokConfigured,
  TIKTOK_AUTHORIZE_URL,
  TIKTOK_SCOPES,
  TIKTOK_TOOL_PATH,
} from "@/lib/tiktok/config";
import { setStateCookie } from "@/lib/tiktok/session";

/**
 * Step 1 of the OAuth flow: remember a random `state` in a cookie and send
 * the user to TikTok's authorization page.
 */
export async function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const credentials = getTikTokCredentials();
  if (!credentials || !isTikTokConfigured()) {
    return NextResponse.redirect(`${origin}${TIKTOK_TOOL_PATH}?error=not_configured`);
  }

  const state = randomBytes(24).toString("base64url");
  const redirectUri = getTikTokRedirectUri(origin);

  const authorizeUrl = new URL(TIKTOK_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_key", credentials.clientKey);
  authorizeUrl.searchParams.set("scope", TIKTOK_SCOPES.join(","));
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  setStateCookie(response, { state, redirectUri });
  return response;
}
