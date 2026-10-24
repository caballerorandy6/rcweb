"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import type { VerifiedProjectAccess } from "@/types/project";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { getProjectCharges, isPaid } from "@/lib/project/charges";

// Verificar acceso a proyecto mediante email y código de proyecto
export async function verifyProjectAccessAction(
  email: string,
  projectCode: string
): Promise<ActionResult<{ project: VerifiedProjectAccess }>> {
  try {
    const rateCheck = await checkActionRateLimit(rateLimiters.contact);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error! };
    }

    const project = await prisma.project.findFirst({
      where: {
        email: email.toLowerCase(),
        projectCode: projectCode.toUpperCase(),
      },
      include: { payments: true },
    });

    if (!project) {
      return { success: false, error: "Invalid email or project code" };
    }

    const { deposit, final } = getProjectCharges(project.payments);

    if (!isPaid(deposit)) {
      return { success: false, error: "Initial payment not completed" };
    }

    if (project.status !== "ready_for_payment") {
      return {
        success: false,
        error: "Project is not ready for final payment yet",
      };
    }

    return {
      success: true,
      data: {
        project: {
          id: project.id,
          projectCode: project.projectCode,
          planName: project.planName,
          finalAmount: final.amount,
          accessToken: project.accessToken,
        },
      },
    };
  } catch (error) {
    console.error("Error verifying project:", error);
    return { success: false, error: "Verification failed" };
  }
}
