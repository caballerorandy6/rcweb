"use server";

import { prisma } from "@/lib/prisma";

export async function markProjectAsCompleteAction(projectCode: string) {
  try {
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        secondPaid: true,
        secondPaidAt: new Date(),
        projectStatus: "completed",
      },
    });

    return {
      success: true,
      payment: {
        planName: payment.planName,
        totalAmount: payment.totalAmount,
      },
    };
  } catch (error) {
    console.error("Error completing payment:", error);
    return { success: false, error: "Failed to complete payment" };
  }
}
