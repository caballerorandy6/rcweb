"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";

type PaymentSummary = {
  planName: string;
  totalAmount: number;
};

export async function markProjectAsCompleteAction(
  projectCode: string
): Promise<ActionResult<{ payment: PaymentSummary }>> {
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
      data: {
        payment: {
          planName: payment.planName,
          totalAmount: payment.totalAmount,
        },
      },
    };
  } catch (error) {
    console.error("Error completing payment:", error);
    return { success: false, error: "Failed to complete payment" };
  }
}
