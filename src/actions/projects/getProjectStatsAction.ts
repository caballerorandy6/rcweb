"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { ProjectStats } from "@/types/stats";
import type { ActionResult } from "@/types/common";

export async function getProjectStatsAction(): Promise<
  ActionResult<{ stats: ProjectStats }>
> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const [total, pending, inProgress, completed, awaitingPayment] =
      await Promise.all([
        prisma.payment.count(),
        prisma.payment.count({ where: { projectStatus: "pending" } }),
        prisma.payment.count({ where: { projectStatus: "in_progress" } }),
        prisma.payment.count({ where: { projectStatus: "completed" } }),
        prisma.payment.count({
          where: {
            projectStatus: "ready_for_payment",
            secondPaid: false,
          },
        }),
      ]);

    return {
      success: true,
      data: {
        stats: { total, pending, inProgress, completed, awaitingPayment },
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
