import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";
import { TikTokApiError } from "./api";
import { getRequestOrigin } from "./config";
import { getValidTikTokSession, setSessionCookie, type TikTokSession } from "./session";

/** Shape every /tools/tiktok/api handler returns on failure. */
export type TikTokErrorBody = { error: { code: string; message: string } };

export function errorResponse(code: string, message: string, status: number): NextResponse<TikTokErrorBody> {
  return NextResponse.json({ error: { code, message } }, { status });
}

/**
 * Browser requests that change state must come from this site. SameSite=Lax
 * already keeps the cookie off cross-site POSTs; the Origin check covers
 * browsers that ignore it.
 */
export function assertSameOrigin(request: Request): NextResponse<TikTokErrorBody> | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  return origin === getRequestOrigin(request)
    ? null
    : errorResponse("forbidden", "Cross-site request rejected.", 403);
}

/**
 * Run a handler with a valid session, persisting a refreshed token on the
 * response and translating TikTok errors into JSON the page can show.
 */
export async function withTikTokSession<T>(
  run: (session: TikTokSession) => Promise<T>
): Promise<NextResponse<T | TikTokErrorBody>> {
  const valid = await getValidTikTokSession();
  if (!valid) {
    return errorResponse("not_connected", "Connect your TikTok account first.", 401);
  }

  try {
    const data = await run(valid.session);
    const response = NextResponse.json(data);
    if (valid.refreshed) setSessionCookie(response, valid.session);
    return response;
  } catch (error) {
    if (error instanceof TikTokApiError) {
      const status = error.status >= 400 && error.status < 600 ? error.status : 502;
      return errorResponse(error.code, error.message, status);
    }
    Sentry.captureException(error);
    console.error("TikTok handler failed", error);
    return errorResponse("internal_error", "Something went wrong. Please try again.", 500);
  }
}
