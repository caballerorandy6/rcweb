import { z } from "zod";

/**
 * Google Business Profile (etapa 6e): reseñas reales del perfil en la web.
 *
 * La API de reseñas no admite cuentas de servicio, así que se lee con un
 * refresh token OAuth del dueño del perfil, generado una sola vez con
 * `scripts/google-reviews-auth.ts`. Solo el cron semanal y el botón
 * «Sync now» llaman a Google; la home y el JSON-LD leen de la base de datos.
 */
const envSchema = z.object({
  GOOGLE_OAUTH_CLIENT_ID: z.string().min(1),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().min(1),
  GOOGLE_OAUTH_REFRESH_TOKEN: z.string().min(1),
  GBP_ACCOUNT_ID: z.string().regex(/^\d+$/),
  GBP_LOCATION_ID: z.string().regex(/^\d+$/),
});

export type GoogleReviewsConfig = z.infer<typeof envSchema>;

/** Devuelve la configuración o `null` si falta algo (la función avisa, no revienta). */
export function getGoogleReviewsConfig(): GoogleReviewsConfig | null {
  const parsed = envSchema.safeParse({
    GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    GOOGLE_OAUTH_REFRESH_TOKEN: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
    GBP_ACCOUNT_ID: process.env.GBP_ACCOUNT_ID,
    GBP_LOCATION_ID: process.env.GBP_LOCATION_ID,
  });
  return parsed.success ? parsed.data : null;
}

/** Reseñas por página que admite la API (máximo documentado). */
export const GOOGLE_REVIEWS_PAGE_SIZE = 50;

/**
 * Cada cuántos días se refrescan la nota, el total y las reseñas en la web:
 * el cron de vercel.json corre semanalmente y la home se revalida tras cada
 * sincronización (decisión de Randy, 2026-10-28).
 */
export const GOOGLE_REVIEWS_REFRESH_DAYS = 7;

/** Reseñas con texto que muestra la home. */
export const GOOGLE_REVIEWS_HOME_LIMIT = 6;
