"use server";
import { prisma } from "@/lib/prisma";

export async function getProjectStatsAction() {
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
      stats: { total, pending, completed, awaitingPayment },
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}
