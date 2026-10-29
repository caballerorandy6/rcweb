import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { revokeAccessToken, TikTokApiError } from "@/lib/tiktok/api";
import { getTikTokCredentials } from "@/lib/tiktok/config";
import { assertSameOrigin } from "@/lib/tiktok/handler";
import { clearSessionCookie, readTikTokSession } from "@/lib/tiktok/session";

/** Revoke the grant at TikTok and forget the cookie, whatever TikTok answers. */
export async function POST(request: Request) {
  const rejected = assertSameOrigin(request);
  if (rejected) return rejected;

  const session = await readTikTokSession();
  const credentials = getTikTokCredentials();
  let revoked = false;

  if (session && credentials) {
    try {
      await revokeAccessToken(credentials, session.accessToken);
      revoked = true;
    } catch (error) {
      if (!(error instanceof TikTokApiError)) Sentry.captureException(error);
      console.warn("TikTok revoke failed; clearing the local session anyway");
    }
  }

  const response = NextResponse.json({ disconnected: true, revoked });
  clearSessionCookie(response);
  return response;
}
