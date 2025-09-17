"use server";

import { prisma } from "@/lib/prisma";

export async function updatePaymentStatusAction(projectCode: string) {
  if (!projectCode) {
    return { success: false, error: "No project code" };
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
    console.error("Error:", error);
    return { success: false, error: "Failed to update" };
  }
}
