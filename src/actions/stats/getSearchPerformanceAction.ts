"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { SearchConsoleDimension } from "@/generated/prisma/enums";
import { getSearchConsoleConfig, SEARCH_PERFORMANCE_WINDOW } from "@/lib/searchConsole/config";
import { addDays, toDateString } from "@/lib/searchConsole/dates";

export interface SearchPeriodTotals {
  startDate: string;
  endDate: string;
  clicks: number;
  impressions: number;
  /** 0-1 */
  ctr: number;
  /** Posición media ponderada por impresiones; 0 si no hay impresiones */
  position: number;
}

export interface SearchDailyPoint {
  date: string;
  label: string;
  clicks: number;
  impressions: number;
}

export interface SearchTopItem {
  key: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface SearchPerformanceResult {
  configured: boolean;
  /** Última sincronización guardada, ISO; null si nunca corrió */
  lastSyncedAt: string | null;
  /** Días con fila en SearchConsoleDaily (para ofrecer el relleno inicial) */
  storedDays: number;
  current: SearchPeriodTotals | null;
  previous: SearchPeriodTotals | null;
  daily: SearchDailyPoint[];
  topQueries: SearchTopItem[];
  topPages: SearchTopItem[];
}

const EMPTY: SearchPerformanceResult = {
  configured: false,
  lastSyncedAt: null,
  storedDays: 0,
  current: null,
  previous: null,
  daily: [],
  topQueries: [],
  topPages: [],
};

const labelFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

type DailyRow = { date: Date; clicks: number; impressions: number; position: number };

function totals(rows: DailyRow[], start: Date, end: Date): SearchPeriodTotals {
  let clicks = 0;
  let impressions = 0;
  let weightedPosition = 0;
  for (const row of rows) {
    clicks += row.clicks;
    impressions += row.impressions;
    weightedPosition += row.position * row.impressions;
  }
  return {
    startDate: toDateString(start),
    endDate: toDateString(end),
    clicks,
    impressions,
    ctr: impressions > 0 ? clicks / impressions : 0,
    position: impressions > 0 ? weightedPosition / impressions : 0,
  };
}

async function topItems(
  dimension: SearchConsoleDimension,
  start: Date,
  end: Date,
  limit: number
): Promise<SearchTopItem[]> {
  const rows = await prisma.searchConsoleTopItem.findMany({
    where: { dimension, date: { gte: start, lte: end } },
    select: { key: true, clicks: true, impressions: true, position: true },
  });

  const byKey = new Map<string, { clicks: number; impressions: number; weighted: number }>();
  for (const row of rows) {
    const acc = byKey.get(row.key) ?? { clicks: 0, impressions: 0, weighted: 0 };
    acc.clicks += row.clicks;
    acc.impressions += row.impressions;
    acc.weighted += row.position * row.impressions;
    byKey.set(row.key, acc);
  }

  return [...byKey.entries()]
    .map(([key, acc]) => ({
      key,
      clicks: acc.clicks,
      impressions: acc.impressions,
      ctr: acc.impressions > 0 ? acc.clicks / acc.impressions : 0,
      position: acc.impressions > 0 ? acc.weighted / acc.impressions : 0,
    }))
    .sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions)
    .slice(0, limit);
}

/**
 * Resumen de Search Console para el dashboard: últimos 28 días con datos
 * frente a los 28 anteriores, serie diaria y top 10 de consultas y páginas.
 */
export async function getSearchPerformanceAction(): Promise<SearchPerformanceResult> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      throw new Error(authCheck.error);
    }

    const configured = getSearchConsoleConfig() !== null;

    const latest = await prisma.searchConsoleDaily.findFirst({
      orderBy: { date: "desc" },
      select: { date: true },
    });
    if (!latest) {
      return { ...EMPTY, configured };
    }

    // Google publica con 2-3 días de retraso: la ventana termina en el último día guardado.
    const end = latest.date;
    const start = addDays(end, -(SEARCH_PERFORMANCE_WINDOW - 1));
    const previousEnd = addDays(start, -1);
    const previousStart = addDays(previousEnd, -(SEARCH_PERFORMANCE_WINDOW - 1));

    const [rows, synced, storedDays, topQueries, topPages] = await Promise.all([
      prisma.searchConsoleDaily.findMany({
        where: { date: { gte: previousStart, lte: end } },
        orderBy: { date: "asc" },
        select: { date: true, clicks: true, impressions: true, position: true },
      }),
      prisma.searchConsoleDaily.aggregate({ _max: { syncedAt: true } }),
      prisma.searchConsoleDaily.count(),
      topItems("QUERY", start, end, 10),
      topItems("PAGE", start, end, 10),
    ]);

    const currentRows = rows.filter((row) => row.date >= start);
    const previousRows = rows.filter((row) => row.date < start);

    // Serie completa: los días sin fila de Google cuentan como 0.
    const byDate = new Map(currentRows.map((row) => [toDateString(row.date), row]));
    const daily: SearchDailyPoint[] = [];
    for (let day = start; day <= end; day = addDays(day, 1)) {
      const key = toDateString(day);
      const row = byDate.get(key);
      daily.push({
        date: key,
        label: labelFormatter.format(day),
        clicks: row?.clicks ?? 0,
        impressions: row?.impressions ?? 0,
      });
    }

    return {
      configured,
      lastSyncedAt: synced._max.syncedAt?.toISOString() ?? null,
      storedDays,
      current: totals(currentRows, start, end),
      previous: totals(previousRows, previousStart, previousEnd),
      daily,
      topQueries,
      topPages,
    };
  } catch (error) {
    console.error("Error getting search performance:", error);
    return EMPTY;
  }
}
