"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { sendProjectReadyEmail } from "@/lib/email/senders";
import { getProjectCharges, isPaid } from "@/lib/project/charges";
import { getPayUrl } from "@/lib/projectUrl";
import type { ActionResultSimple } from "@/types/common";

/**
 * Sends the "your project is ready" email again, with the final-payment
 * link, for a project that is waiting for its balance. Useful when the
 * customer lost the first email.
 */
export async function resendPaymentLinkAction(projectId: string): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { payments: true },
    });
    if (!project) {
      return { success: false, error: "Project not found" };
    }

    const { final } = getProjectCharges(project.payments);
    if (project.status !== "ready_for_payment" || isPaid(final)) {
      return { success: false, error: "This project is not waiting for its final payment" };
    }

    const sent = await sendProjectReadyEmail(new Resend(process.env.RESEND_API_KEY!), {
      customerEmail: project.email,
      customerName: project.name,
      planName: project.planName,
      projectCode: project.projectCode,
      finalAmount: final.amount,
      paymentUrl: getPayUrl(project.accessToken),
    });
    if (!sent.success) {
      return { success: false, error: sent.error ?? "Email could not be sent" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error resending the payment link:", error);
    return { success: false, error: "Failed to resend the payment link" };
  }
}
