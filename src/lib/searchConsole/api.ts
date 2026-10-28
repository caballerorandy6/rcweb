import { z } from "zod";
import { getSearchConsoleAccessToken } from "@/lib/searchConsole/auth";
import type { SearchConsoleConfig } from "@/lib/searchConsole/config";

/** Dimensiones de Search Analytics que usamos (la API admite más). */
export type SearchAnalyticsDimension = "date" | "query" | "page";

export interface SearchAnalyticsRequest {
  /** YYYY-MM-DD, inclusive, en hora del Pacífico (como Search Console). */
  startDate: string;
  endDate: string;
  dimensions: SearchAnalyticsDimension[];
  rowLimit?: number;
  startRow?: number;
}

const rowSchema = z.object({
  keys: z.array(z.string()),
  clicks: z.number(),
  impressions: z.number(),
  ctr: z.number(),
  position: z.number(),
});

const responseSchema = z.object({
  rows: z.array(rowSchema).default([]),
});

export type SearchAnalyticsRow = z.infer<typeof rowSchema>;

export class SearchConsoleApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "SearchConsoleApiError";
  }
}

/** Máximo de filas por petición que admite la API. */
export const SEARCH_ANALYTICS_MAX_ROWS = 25_000;

/**
 * Llama a searchAnalytics.query de la propiedad configurada y pagina con
 * `startRow` hasta traer todas las filas del rango.
 * https://developers.google.com/webmaster-tools/v1/searchanalytics/query
 */
export async function querySearchAnalytics(
  config: SearchConsoleConfig,
  request: SearchAnalyticsRequest
): Promise<SearchAnalyticsRow[]> {
  const rowLimit = Math.min(request.rowLimit ?? SEARCH_ANALYTICS_MAX_ROWS, SEARCH_ANALYTICS_MAX_ROWS);
  const rows: SearchAnalyticsRow[] = [];
  let startRow = request.startRow ?? 0;
  for (;;) {
    const page = await querySearchAnalyticsPage(config, { ...request, rowLimit, startRow });
    rows.push(...page);
    if (page.length < rowLimit) return rows;
    startRow += rowLimit;
  }
}

async function querySearchAnalyticsPage(
  config: SearchConsoleConfig,
  request: Required<Pick<SearchAnalyticsRequest, "rowLimit" | "startRow">> & SearchAnalyticsRequest
): Promise<SearchAnalyticsRow[]> {
  const token = await getSearchConsoleAccessToken(config);
  const site = encodeURIComponent(config.SEARCH_CONSOLE_SITE_URL);
  const response = await fetch(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${site}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: request.startDate,
        endDate: request.endDate,
        dimensions: request.dimensions,
        rowLimit: request.rowLimit,
        startRow: request.startRow,
        dataState: "final",
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new SearchConsoleApiError(
      response.status,
      `Search Console ${response.status}: ${body.slice(0, 300)}`
    );
  }

  return responseSchema.parse(await response.json()).rows;
}
