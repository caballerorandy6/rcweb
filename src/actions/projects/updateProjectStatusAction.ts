"use server";

import { prisma } from "@/lib/prisma";
import { sendFinalPaymentEmail } from "@/actions/campaigns/sendFinalPaymentEmailAction";
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

export async function updateProjectStatusAction(
  projectCode: string,
  status: UpdateableProjectStatus
): Promise<ActionResult<{ project: ProjectInfo }>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const project = await prisma.project.update({
      where: { projectCode },
      data: { status },
    });

    // Si el proyecto está listo, enviar email automáticamente
    if (status === "ready_for_payment") {
      await sendFinalPaymentEmail(projectCode);
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
      },
    };
  } catch (error) {
    console.error("Error updating project status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
