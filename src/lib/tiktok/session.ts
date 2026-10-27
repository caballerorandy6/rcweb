import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { refreshAccessToken, TikTokApiError, type TikTokTokens } from "./api";
import {
  getTikTokCookieSecret,
  getTikTokCredentials,
  TIKTOK_COOKIE_PATH,
  TIKTOK_SESSION_COOKIE,
  TIKTOK_STATE_COOKIE,
} from "./config";
import { decryptJson, encryptJson } from "./cookieCrypto";

/**
 * The connected account lives only in an encrypted httpOnly cookie: no
 * database row, nothing to clean up. Disconnecting clears it.
 */
const sessionSchema = z.object({
  openId: z.string(),
  scope: z.string(),
  accessToken: z.string(),
  /** Unix ms */
  accessExpiresAt: z.number(),
  refreshToken: z.string(),
  refreshExpiresAt: z.number(),
});

export type TikTokSession = z.infer<typeof sessionSchema>;

const stateSchema = z.object({
  state: z.string(),
  redirectUri: z.string(),
});

export type TikTokOAuthState = z.infer<typeof stateSchema>;

/** Refresh a little early so an in-flight upload never hits an expired token. */
const REFRESH_SKEW_MS = 5 * 60 * 1000;
const STATE_MAX_AGE_SECONDS = 10 * 60;

export function sessionFromTokens(tokens: TikTokTokens, now = Date.now()): TikTokSession {
  return {
    openId: tokens.open_id,
    scope: tokens.scope,
    accessToken: tokens.access_token,
    accessExpiresAt: now + tokens.expires_in * 1000,
    refreshToken: tokens.refresh_token,
    refreshExpiresAt: now + tokens.refresh_expires_in * 1000,
  };
}

function requireSecret(): string {
  const secret = getTikTokCookieSecret();
  if (!secret) {
    throw new Error("TIKTOK_COOKIE_SECRET (or NEXTAUTH_SECRET) is not set");
  }
  return secret;
}

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: TIKTOK_COOKIE_PATH,
};

/** Read the session from the request cookies (Server Components and handlers). */
export async function readTikTokSession(): Promise<TikTokSession | null> {
  const secret = getTikTokCookieSecret();
  if (!secret) return null;
  const raw = (await cookies()).get(TIKTOK_SESSION_COOKIE)?.value;
  if (!raw) return null;
  const parsed = sessionSchema.safeParse(decryptJson(raw, secret));
  if (!parsed.success) return null;
  // A refresh token past its life is useless; treat it as disconnected.
  if (parsed.data.refreshExpiresAt <= Date.now()) return null;
  return parsed.data;
}

export function setSessionCookie(response: NextResponse, session: TikTokSession): void {
  const maxAge = Math.max(0, Math.floor((session.refreshExpiresAt - Date.now()) / 1000));
  response.cookies.set(TIKTOK_SESSION_COOKIE, encryptJson(session, requireSecret()), {
    ...baseCookie,
    maxAge,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(TIKTOK_SESSION_COOKIE, "", { ...baseCookie, maxAge: 0 });
}

export function setStateCookie(response: NextResponse, value: TikTokOAuthState): void {
  response.cookies.set(TIKTOK_STATE_COOKIE, encryptJson(value, requireSecret()), {
    ...baseCookie,
    maxAge: STATE_MAX_AGE_SECONDS,
  });
}

export async function readStateCookie(): Promise<TikTokOAuthState | null> {
  const secret = getTikTokCookieSecret();
  if (!secret) return null;
  const raw = (await cookies()).get(TIKTOK_STATE_COOKIE)?.value;
  if (!raw) return null;
  const parsed = stateSchema.safeParse(decryptJson(raw, secret));
  return parsed.success ? parsed.data : null;
}

export function clearStateCookie(response: NextResponse): void {
  response.cookies.set(TIKTOK_STATE_COOKIE, "", { ...baseCookie, maxAge: 0 });
}

export type ValidSession = { session: TikTokSession; refreshed: boolean };

/**
 * Session with a usable access token, refreshing it when it is about to
 * expire. Handlers must persist a refreshed session with `setSessionCookie`.
 */
export async function getValidTikTokSession(): Promise<ValidSession | null> {
  const session = await readTikTokSession();
  if (!session) return null;
  if (session.accessExpiresAt - REFRESH_SKEW_MS > Date.now()) {
    return { session, refreshed: false };
  }

  const credentials = getTikTokCredentials();
  if (!credentials) return null;
  try {
    const tokens = await refreshAccessToken(credentials, session.refreshToken);
    return { session: sessionFromTokens(tokens), refreshed: true };
  } catch (error) {
    if (error instanceof TikTokApiError) return null;
    throw error;
  }
}
