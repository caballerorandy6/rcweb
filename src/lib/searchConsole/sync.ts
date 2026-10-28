import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import type { SearchConsoleDimension } from "@/generated/prisma/enums";
import { querySearchAnalytics, type SearchAnalyticsRow } from "@/lib/searchConsole/api";
import {
  getSearchConsoleConfig,
  SEARCH_CONSOLE_RESYNC_DAYS,
  SEARCH_CONSOLE_ROW_LIMIT,
} from "@/lib/searchConsole/config";
import { parseDateString, resyncRange, toDateString } from "@/lib/searchConsole/dates";

export interface SearchConsoleSyncResult {
  startDate: string;
  endDate: string;
  days: number;
  queries: number;
  pages: number;
}

export type SearchConsoleSyncOutcome =
  | { ok: true; result: SearchConsoleSyncResult }
  | { ok: false; error: "not_configured" | "api_error"; message: string };

interface TopItemRow {
  date: Date;
  dimension: SearchConsoleDimension;
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Convierte las filas `[date, key]` de la API en filas de SearchConsoleTopItem,
 * quedándose con las `limit` de más clics (luego impresiones) por día.
 */
export function pickTopItems(
  rows: SearchAnalyticsRow[],
  dimension: SearchConsoleDimension,
  limit: number
): TopItemRow[] {
  const byDay = new Map<string, SearchAnalyticsRow[]>();
  for (const row of rows) {
    const [day] = row.keys;
    const list = byDay.get(day) ?? [];
    list.push(row);
    byDay.set(day, list);
  }

  const result: TopItemRow[] = [];
  for (const [day, list] of byDay) {
    list.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions);
    for (const row of list.slice(0, limit)) {
      result.push({
        date: parseDateString(day),
        dimension,
        key: row.keys[1],
        clicks: row.clicks,
        impressions: row.impressions,
        ctr: row.ctr,
        position: row.position,
      });
    }
  }
  return result;
}

/**
 * Descarga los últimos `days` días de Search Console (7 en el cron, 56 desde
 * el botón, 480 en el relleno inicial) y los guarda (upsert) en
 * SearchConsoleDaily y SearchConsoleTopItem. Idempotente: ejecutarla dos
 * veces deja la base igual.
 */
export async function syncSearchConsole(
  days = SEARCH_CONSOLE_RESYNC_DAYS,
  now = new Date()
): Promise<SearchConsoleSyncOutcome> {
  const config = getSearchConsoleConfig();
  if (!config) {
    return {
      ok: false,
      error: "not_configured",
      message: "Search Console is not configured (GCP_* variables missing).",
    };
  }

  const { start, end } = resyncRange(days, now);
  const range = { startDate: toDateString(start), endDate: toDateString(end) };

  try {
    // Tres peticiones independientes: totales por día, consultas y páginas.
    const [daily, byQuery, byPage] = await Promise.all([
      querySearchAnalytics(config, { ...range, dimensions: ["date"], rowLimit: days }),
      querySearchAnalytics(config, { ...range, dimensions: ["date", "query"] }),
      querySearchAnalytics(config, { ...range, dimensions: ["date", "page"] }),
    ]);

    const queries = pickTopItems(byQuery, "QUERY", SEARCH_CONSOLE_ROW_LIMIT);
    const pages = pickTopItems(byPage, "PAGE", SEARCH_CONSOLE_ROW_LIMIT);

    await prisma.$transaction([
      ...daily.map((row) => {
        const date = parseDateString(row.keys[0]);
        const data = {
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        };
        return prisma.searchConsoleDaily.upsert({
          where: { date },
          create: { date, ...data },
          update: data,
        });
      }),
      // Los top se reemplazan por rango: así desaparecen las keys que salieron del top.
      prisma.searchConsoleTopItem.deleteMany({
        where: { date: { gte: start, lte: end } },
      }),
      prisma.searchConsoleTopItem.createMany({ data: [...queries, ...pages] }),
    ]);

    return {
      ok: true,
      result: {
        ...range,
        days: daily.length,
        queries: queries.length,
        pages: pages.length,
      },
    };
  } catch (error) {
    Sentry.captureException(error, { tags: { feature: "search-console" } });
    console.error("Search Console sync failed:", error);
    return {
      ok: false,
      error: "api_error",
      message: error instanceof Error ? error.message : "Search Console sync failed",
    };
  }
}
