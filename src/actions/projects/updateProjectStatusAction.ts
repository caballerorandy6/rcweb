"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendProjectReadyEmail } from "@/lib/email/senders";
import { getProjectCharges, isPaid } from "@/lib/project/charges";
import { getNextProjectStatus } from "@/lib/project/status";
import { getPayUrl } from "@/lib/projectUrl";
import type { UpdateableProjectStatus } from "@/types/project";
import type { ProjectStatus } from "@/generated/prisma/enums";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";

type ProjectInfo = {
  id: string;
  projectCode: string;
  planName: string;
  status: ProjectStatus;
};

export type UpdateProjectStatusData = {
  project: ProjectInfo;
  /** Set when the status changed but the customer email could not be sent */
  emailError?: string;
};

export async function updateProjectStatusAction(
  projectCode: string,
  status: UpdateableProjectStatus
): Promise<ActionResult<UpdateProjectStatusData>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    // Completion belongs to the payment (webhook or recordManualPaymentAction)
    if (status === "completed") {
      return { success: false, error: "Record the final payment to complete the project" };
    }

    // Read the charges first so a project missing a row fails before any write
    const current = await prisma.project.findUnique({
      where: { projectCode },
      include: { payments: true },
    });
    if (!current) {
      return { success: false, error: "Project not found" };
    }
    const { deposit, final } = getProjectCharges(current.payments);

    // The same rule the buttons follow, enforced here: a request built by
    // hand (or a stale tab) cannot skip a step, go back, or start a project
    // whose deposit is not paid
    const next = getNextProjectStatus(current.status, {
      depositPaid: isPaid(deposit),
      finalPaid: isPaid(final),
    });
    if (status !== next) {
      return { success: false, error: "The project cannot move to that status from where it is now" };
    }

    // Only if it is still where it was read: two clicks (two tabs) must not
    // both email the customer the payment link
    const { count } = await prisma.project.updateMany({
      where: { id: current.id, status: current.status },
      data: { status },
    });
    if (count === 0) {
      return { success: false, error: "The project status has just changed. Reload the page" };
    }
    const project = { ...current, status };

    let emailError: string | undefined;

    // Ready for payment: tell the customer and give them the magic link
    if (status === "ready_for_payment") {
      const sent = await sendProjectReadyEmail(
        new Resend(process.env.RESEND_API_KEY!),
        {
          customerEmail: project.email,
          customerName: project.name,
          locale: project.locale,
          planName: project.planName,
          projectCode: project.projectCode,
          finalAmount: final.amount,
          paymentUrl: getPayUrl(project.accessToken, project.locale),
        }
      );
      if (!sent.success) emailError = sent.error ?? "Email could not be sent";
    }

    return {
      success: true,
      data: {
        project: {
          id: project.id,
          projectCode: project.projectCode,
          planName: project.planName,
          status: project.status,
        },
        emailError,
      },
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
