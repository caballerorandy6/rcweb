import { prisma } from "@/lib/prisma";
import { addMonths, monthStart } from "@/lib/maintenanceHours";

/** The month a report sent around `now` covers: the one that just ended (Houston time) */
export function reportMonthFor(now: Date): Date {
  return addMonths(monthStart(now), -1);
}

/**
 * Creates the draft report of `month` for every subscription that was paying
 * during it: started before the month ended and not cancelled before it began.
 * Safe to run twice: (subscriptionId, month) is unique and existing drafts or
 * sent reports are left as they are.
 */
export async function createMonthlyReportDrafts(month: Date): Promise<{ month: string; created: number }> {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      createdAt: { lt: addMonths(month, 1) },
      OR: [{ status: { not: "cancelled" } }, { cancelledAt: { gte: month } }],
    },
    select: { id: true },
  });

  const { count } = await prisma.maintenanceReport.createMany({
    data: subscriptions.map((s) => ({ subscriptionId: s.id, month })),
    skipDuplicates: true,
  });

  return { month: month.toISOString().slice(0, 10), created: count };
}
