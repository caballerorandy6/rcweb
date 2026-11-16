"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";

// null = not reported this month; the email leaves that line out
const count = z.number().int().min(0).max(10_000_000).nullable();

const InputSchema = z.object({
  id: z.uuid(),
  errorsResolved: count,
  updatesApplied: count,
  backupsVerified: z.boolean().nullable(),
  uptimePercent: z.number().min(0).max(100).nullable(),
  visitors: count,
  pageViews: count,
  notes: z.string().trim().max(5000).nullable(),
});

export type MaintenanceReportFigures = z.input<typeof InputSchema>;

/** Saves the figures of a draft report. A sent report is never edited. */
export async function updateMaintenanceReportAction(
  input: MaintenanceReportFigures
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Check the figures: whole numbers, uptime between 0 and 100" };
  }

  const { id, notes, uptimePercent, ...figures } = parsed.data;
  try {
    const { count: updated } = await prisma.maintenanceReport.updateMany({
      where: { id, status: "draft" },
      data: {
        ...figures,
        uptimePercent: uptimePercent === null ? null : Math.round(uptimePercent * 100) / 100,
        notes: notes || null,
      },
    });
    if (updated === 0) {
      return { success: false, error: "This report was already sent" };
    }

    const report = await prisma.maintenanceReport.findUnique({
      where: { id },
      select: { subscriptionId: true },
    });
    if (report) revalidatePath(`/subscriptions/${report.subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error saving a maintenance report:", error);
    return { success: false, error: "Failed to save the report" };
  }
}
