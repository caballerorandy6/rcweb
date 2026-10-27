import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { exchangeCodeForTokens, TikTokApiError } from "@/lib/tiktok/api";
import { getRequestOrigin, getTikTokCredentials, TIKTOK_TOOL_PATH } from "@/lib/tiktok/config";
import {
  clearStateCookie,
  readStateCookie,
  sessionFromTokens,
  setSessionCookie,
} from "@/lib/tiktok/session";

/**
 * Step 2: TikTok redirects to /tools/tiktok?code=…&state=…; the page forwards
 * those params here, where the state is checked against the cookie and the
 * code is exchanged for tokens. The result lands back on the page.
 */
export async function GET(request: Request) {
  const origin = getRequestOrigin(request);
  const toolUrl = new URL(TIKTOK_TOOL_PATH, origin);
  const fail = (code: string) => {
    toolUrl.searchParams.set("error", code);
    const response = NextResponse.redirect(toolUrl);
    clearStateCookie(response);
    return response;
  };

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !state) return fail("missing_code");

  const expected = await readStateCookie();
  if (!expected || expected.state !== state) return fail("state_mismatch");

  const credentials = getTikTokCredentials();
  if (!credentials) return fail("not_configured");

  try {
    const tokens = await exchangeCodeForTokens(credentials, code, expected.redirectUri);
    const response = NextResponse.redirect(toolUrl);
    clearStateCookie(response);
    setSessionCookie(response, sessionFromTokens(tokens));
    return response;
  } catch (error) {
    if (error instanceof TikTokApiError) return fail(error.code);
    Sentry.captureException(error);
    console.error("TikTok token exchange failed", error);
    return fail("token_exchange_failed");
  }
}
