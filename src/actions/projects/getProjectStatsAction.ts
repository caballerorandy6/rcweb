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
        prisma.project.count(),
        prisma.project.count({ where: { status: "pending" } }),
        prisma.project.count({ where: { status: "in_progress" } }),
        prisma.project.count({ where: { status: "completed" } }),
        prisma.project.count({
          where: {
            status: "ready_for_payment",
            payments: { some: { kind: "final", status: "pending" } },
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
