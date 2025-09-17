"use server";

import { prisma } from "@/lib/prisma";

export async function updatePaymentStatus(
  projectCode: string,
  sessionId: string
) {
  if (!projectCode || !sessionId) {
    return { error: "Missing parameters" };
  }

  try {
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        firstPaid: true,
        firstPaidAt: new Date(),
        projectStatus: "in_progress",
      },
    });

    return { success: true, payment };
  } catch (error) {
    console.error("Error updating payment:", error);
    return { error: "Failed to update" };
  }
}
