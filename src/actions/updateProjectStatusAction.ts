"use server";

import { prisma } from "@/lib/prisma";
import { sendFinalPaymentEmail } from "@/actions/sendFinalPaymentEmailAction";

export async function updateProjectStatusAction(
  projectCode: string,
  status: "pending" | "in_progress" | "ready_for_payment" | "completed"
) {
  try {
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        projectStatus: status,
        projectStarted: status === "in_progress" ? new Date() : undefined,
        projectReady: status === "ready_for_payment" ? new Date() : undefined,
      },
    });

    // Si el proyecto está listo, enviar email automáticamente
    if (status === "ready_for_payment") {
      await sendFinalPaymentEmail(projectCode);
    }

    return { success: true, payment };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
