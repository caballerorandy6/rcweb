"use server";
import { prisma } from "@/lib/prisma";
import type { ProjectStats } from "@/types/stats";
import type { ActionResult } from "@/types/common";

export async function getProjectStatsAction(): Promise<
  ActionResult<{ stats: ProjectStats }>
> {
  try {
    const [total, pending, completed, awaitingPayment] = await Promise.all([
      prisma.payment.count(),
      prisma.payment.count({ where: { projectStatus: "pending" } }),
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
        stats: { total, pending, completed, awaitingPayment },
      },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
