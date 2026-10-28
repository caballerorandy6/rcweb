import { z } from "zod";
import type { GoogleReviewsConfig } from "@/lib/googleReviews/config";
import { GoogleReviewsApiError } from "@/lib/googleReviews/errors";

const tokenSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().positive(),
});

let cached: { refreshToken: string; token: string; expiresAt: number } | null = null;

/** Margen antes de la caducidad real a partir del cual se pide otro token. */
const EXPIRY_MARGIN_MS = 60_000;

/**
 * Cambia el refresh token del dueño del perfil por un access token de Google.
 * Cacheado por proceso: el token dura una hora y el cron hace varias
 * peticiones seguidas.
 */
export async function getGoogleReviewsAccessToken(config: GoogleReviewsConfig): Promise<string> {
  if (
    cached &&
    cached.refreshToken === config.GOOGLE_OAUTH_REFRESH_TOKEN &&
    cached.expiresAt > Date.now()
  ) {
    return cached.token;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.GOOGLE_OAUTH_CLIENT_ID,
      client_secret: config.GOOGLE_OAUTH_CLIENT_SECRET,
      refresh_token: config.GOOGLE_OAUTH_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    // 400 invalid_grant = token revocado o caducado: hay que repetir scripts/google-reviews-auth.ts
    throw new GoogleReviewsApiError(response.status, `Google OAuth ${response.status}: ${body.slice(0, 300)}`);
  }

  const data = tokenSchema.parse(await response.json());
  cached = {
    refreshToken: config.GOOGLE_OAUTH_REFRESH_TOKEN,
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000 - EXPIRY_MARGIN_MS,
  };
  return data.access_token;
}
