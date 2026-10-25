"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendProjectReadyEmail } from "@/lib/email/senders";
import { getProjectCharges } from "@/lib/project/charges";
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

    // Read the charges first so a project missing a row fails before any write
    const current = await prisma.project.findUnique({
      where: { projectCode },
      include: { payments: true },
    });
    if (!current) {
      return { success: false, error: "Project not found" };
    }
    const { final } = getProjectCharges(current.payments);

    const project = await prisma.project.update({
      where: { id: current.id },
      data: { status },
    });

    let emailError: string | undefined;

    // Ready for payment: tell the customer and give them the magic link
    if (status === "ready_for_payment") {
      const sent = await sendProjectReadyEmail(
        new Resend(process.env.RESEND_API_KEY!),
        {
          customerEmail: project.email,
          customerName: project.name,
          planName: project.planName,
          projectCode: project.projectCode,
          finalAmount: final.amount,
          paymentUrl: getPayUrl(project.accessToken),
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
