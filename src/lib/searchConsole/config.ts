import { z } from "zod";

/**
 * Configuración de Google Search Console (etapa 6d).
 *
 * rcweb lee Search Analytics con una cuenta de servicio de Google Cloud, pero
 * sin clave JSON: Vercel emite un token OIDC por ejecución y Google lo acepta
 * mediante Workload Identity Federation (pool `vercel` del proyecto
 * rc-web-solutions). Ningún secreto vive en las variables de entorno; solo
 * identificadores públicos del proyecto.
 */
const envSchema = z.object({
  GCP_PROJECT_NUMBER: z.string().regex(/^\d+$/),
  GCP_SERVICE_ACCOUNT_EMAIL: z.string().email(),
  GCP_WORKLOAD_IDENTITY_POOL_ID: z.string().min(1).default("vercel"),
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: z.string().min(1).default("vercel"),
  // Propiedad de Search Console; la de dominio cubre www y sin www.
  SEARCH_CONSOLE_SITE_URL: z.string().min(1).default("sc-domain:rcweb.dev"),
});

export type SearchConsoleConfig = z.infer<typeof envSchema>;

/** Devuelve la configuración o `null` si falta algo (la función avisa, no revienta). */
export function getSearchConsoleConfig(): SearchConsoleConfig | null {
  const parsed = envSchema.safeParse({
    GCP_PROJECT_NUMBER: process.env.GCP_PROJECT_NUMBER,
    GCP_SERVICE_ACCOUNT_EMAIL: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
    GCP_WORKLOAD_IDENTITY_POOL_ID: process.env.GCP_WORKLOAD_IDENTITY_POOL_ID || undefined,
    GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID:
      process.env.GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID || undefined,
    SEARCH_CONSOLE_SITE_URL: process.env.SEARCH_CONSOLE_SITE_URL || undefined,
  });
  return parsed.success ? parsed.data : null;
}

/** Filas máximas por dimensión y día que guardamos (la API admite hasta 25 000). */
export const SEARCH_CONSOLE_ROW_LIMIT = 100;

/** Días que cada sincronización vuelve a pedir: Google publica con 2-3 días de retraso y corrige. */
export const SEARCH_CONSOLE_RESYNC_DAYS = 7;
