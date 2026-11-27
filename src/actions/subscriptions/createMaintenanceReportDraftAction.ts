"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { reportMonthFor, startedBeforeMonthEnded } from "@/lib/maintenanceReport/drafts";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({ subscriptionId: z.uuid() });

/**
 * Drafts last month's report for one customer by hand (the cron does it for
 * everyone on the 1st). Does nothing if that report already exists, and
 * refuses a plan the page would not offer it for: cancelled, or started after
 * that month ended.
 */
export async function createMaintenanceReportDraftAction(input: {
  subscriptionId: string;
}): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid subscription" };
  }

  const { subscriptionId } = parsed.data;
  try {
    const month = reportMonthFor(new Date());
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      select: { status: true, createdAt: true },
    });
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    if (subscription.status === "cancelled" || !startedBeforeMonthEnded(subscription.createdAt, month)) {
      return { success: false, error: "This subscription has no report for last month" };
    }
    await prisma.maintenanceReport.createMany({
      data: [{ subscriptionId, month }],
      skipDuplicates: true,
    });
    revalidatePath(`/subscriptions/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error drafting a maintenance report:", error);
    return { success: false, error: "Failed to draft the report" };
  }
}
