"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import type { VerifiedProjectAccess } from "@/types/project";

// Verificar acceso a proyecto mediante email y código de proyecto
export async function verifyProjectAccessAction(
  email: string,
  projectCode: string
): Promise<ActionResult<{ payment: VerifiedProjectAccess }>> {
  try {
    const payment = await prisma.payment.findFirst({
      where: {
        email: email.toLowerCase(),
        projectCode: projectCode.toUpperCase(),
      },
    });

    if (!payment) {
      return { success: false, error: "Invalid email or project code" };
    }

    if (!payment.firstPaid) {
      return { success: false, error: "Initial payment not completed" };
    }

    if (payment.projectStatus !== "ready_for_payment") {
      return {
        success: false,
        error: "Project is not ready for final payment yet",
      };
    }

    return {
      success: true,
      data: {
        payment: {
          id: payment.id,
          projectCode: payment.projectCode,
          planName: payment.planName,
          secondPayment: payment.secondPayment,
          accessToken: payment.accessToken,
        },
      },
    };
  } catch (error) {
    console.error("Error verifying project:", error);
    return { success: false, error: "Verification failed" };
  }
}
