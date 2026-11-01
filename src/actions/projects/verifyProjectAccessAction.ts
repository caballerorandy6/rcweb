"use server";

import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("Actions");
  try {
    const rateCheck = await checkActionRateLimit(rateLimiters.contact);
    if (!rateCheck.success) {
      return { success: false, error: t("tooManyRequests") };
    }

    // Project.email is stored lowercased (CheckoutRequestSchema)
    const project = await prisma.project.findFirst({
      where: {
        email: email.trim().toLowerCase(),
        projectCode: projectCode.trim().toUpperCase(),
      },
      include: { payments: true },
    });

    if (!project) {
      return { success: false, error: t("project.invalidCredentials") };
    }

    const { deposit, final } = getProjectCharges(project.payments);

    if (!isPaid(deposit)) {
      return { success: false, error: t("project.depositPending") };
    }

    if (project.status !== "ready_for_payment") {
      return { success: false, error: t("project.notReady") };
    }

    return {
      success: true,
      data: {
        project: {
          id: project.id,
          projectCode: project.projectCode,
          planName: project.planName,
          email: project.email,
          finalAmount: final.amount,
          accessToken: project.accessToken,
        },
      },
    };
  } catch (error) {
    console.error("Error verifying project:", error);
    return { success: false, error: t("project.verificationFailed") };
  }
}
