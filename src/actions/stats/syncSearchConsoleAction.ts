"use server";

import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import {
  SEARCH_CONSOLE_MANUAL_SYNC_DAYS,
  SEARCH_CONSOLE_MAX_SYNC_DAYS,
} from "@/lib/searchConsole/config";
import { syncSearchConsole, type SearchConsoleSyncResult } from "@/lib/searchConsole/sync";
import type { ActionResult } from "@/types/common";

const daysSchema = z.number().int().min(1).max(SEARCH_CONSOLE_MAX_SYNC_DAYS);

/** Botones «Sync now» y «Backfill» del dashboard: misma sincronización que el cron diario. */
export async function syncSearchConsoleAction(
  days: number = SEARCH_CONSOLE_MANUAL_SYNC_DAYS
): Promise<ActionResult<SearchConsoleSyncResult>> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsedDays = daysSchema.safeParse(days);
  if (!parsedDays.success) {
    return { success: false, error: "Invalid number of days." };
  }

  const outcome = await syncSearchConsole(parsedDays.data);
  if (!outcome.ok) {
    return { success: false, error: outcome.message };
  }
  return { success: true, data: outcome.result };
}
