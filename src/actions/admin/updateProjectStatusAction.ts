// actions/admin/updateProjectStatusAction.ts
"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { sendProjectReadyEmail } from "@/lib/email/senders";
import { requireAdmin } from "@/lib/authGuard";
import type { UpdateableProjectStatus } from "@/types/project";
import type { ActionResultSimple } from "@/types/common";

/**
 * Server action to update project status and send notification email when ready
 * @param projectCode - The project code to update
 * @param status - The new status
 */
export async function updateProjectStatusAction(
  projectCode: string,
  status: UpdateableProjectStatus
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error || "Unauthorized" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);

    const payment = await prisma.payment.findUnique({
      where: { projectCode },
    });

    if (!payment) {
      return { success: false, error: "Payment not found" };
    }

    if (payment.secondPaid) {
      if (status !== "completed") {
        return {
          success: false,
          error: "Cannot change status: project is already fully paid and must be completed",
        };
      }
      if (payment.projectStatus !== "completed") {
        await prisma.payment.update({
          where: { projectCode },
          data: {
            projectStatus: "completed",
          },
        });
        return { success: true };
      }
      return { success: true };
    }

    if (!payment.firstPaid && status !== "pending") {
      return {
        success: false,
        error: "Cannot change status: first payment must be completed before starting project",
      };
    }

    const validTransitions: Record<string, string[]> = {
      pending: ["in_progress"],
      in_progress: ["ready_for_payment"],
      ready_for_payment: ["completed"],
      completed: [],
    };

    const currentStatus = payment.projectStatus;
    if (
      validTransitions[currentStatus] &&
      !validTransitions[currentStatus].includes(status)
    ) {
      return {
        success: false,
        error: `Invalid status transition: cannot change from "${currentStatus}" to "${status}"`,
      };
    }

    const updatedPayment = await prisma.payment.update({
      where: { projectCode },
      data: {
        projectStatus: status,
        projectReady: status === "ready_for_payment" ? new Date() : undefined,
      },
    });

    if (status === "ready_for_payment") {
      await sendProjectReadyEmail(resend, {
        customerEmail: updatedPayment.email,
        customerName: updatedPayment.name,
        planName: updatedPayment.planName,
        projectCode: updatedPayment.projectCode,
        finalAmount: updatedPayment.secondPayment,
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
