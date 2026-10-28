"use server";

import { requireAdmin } from "@/lib/authGuard";
import { syncGoogleReviews, type GoogleReviewsSyncResult } from "@/lib/googleReviews/sync";
import type { ActionResult } from "@/types/common";

/** Botón «Sync now» del dashboard: misma sincronización que el cron semanal. */
export async function syncGoogleReviewsAction(): Promise<ActionResult<GoogleReviewsSyncResult>> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const outcome = await syncGoogleReviews();
  if (!outcome.ok) {
    return { success: false, error: outcome.message };
  }
  return { success: true, data: outcome.result };
}
