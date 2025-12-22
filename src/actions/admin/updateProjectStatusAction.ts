// actions/admin/updateProjectStatusAction.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { sendProjectReadyEmail } from "@/lib/email/senders";
import { requireAdmin } from "@/lib/authGuard";

type ProjectStatus = "in_progress" | "ready_for_payment" | "completed";

type UpdateStatusResult = {
  success: boolean;
  error?: string;
};

/**
 * Server action to update project status and send notification email when ready
 * @param projectCode - The project code to update
 * @param status - The new status
 */
export async function updateProjectStatusAction(
  projectCode: string,
  status: ProjectStatus
): Promise<UpdateStatusResult> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    // Actualizar estado en BD
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        projectStatus: status,
        projectReady: status === "ready_for_payment" ? new Date() : undefined,
      },
    });

    // Si está listo, enviar email automáticamente
    if (status === "ready_for_payment") {
      await sendProjectReadyEmail(resend, {
        customerEmail: payment.email,
        customerName: payment.name,
        planName: payment.planName,
        projectCode: payment.projectCode,
        finalAmount: payment.secondPayment,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error updating project status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
