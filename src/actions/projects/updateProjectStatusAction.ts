"use server";

import { prisma } from "@/lib/prisma";
import { sendFinalPaymentEmail } from "@/actions/campaigns/sendFinalPaymentEmailAction";
import type { ProjectStatus } from "@/types/project";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";

type PaymentInfo = {
  id: string;
  projectCode: string;
  planName: string;
  projectStatus: string;
};

export async function updateProjectStatusAction(
  projectCode: string,
  status: ProjectStatus
): Promise<ActionResult<{ payment: PaymentInfo }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

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

    return {
      success: true,
      data: {
        payment: {
          id: payment.id,
          projectCode: payment.projectCode,
          planName: payment.planName,
          projectStatus: payment.projectStatus,
        },
      },
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
