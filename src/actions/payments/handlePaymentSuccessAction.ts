"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { Resend } from "resend";
import {
  sendInitialPaymentConfirmation,
  sendAdminInitialPaymentFallback,
} from "@/lib/email/senders";
import { linkProjectToContact } from "@/actions/stats/getRevenueAttributionAction";
import { getProjectUrl } from "@/lib/projectUrl";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import type { PaymentSuccessData } from "@/types/project";
import {
  getProjectCharges,
  type ProjectWithPayments,
} from "@/lib/project/charges";

export type HandlePaymentSuccessResult =
  | { success: true; project: PaymentSuccessData; fallbackUsed: boolean }
  | { success: false; error: string };

function toSuccessData(project: ProjectWithPayments): PaymentSuccessData {
  const { deposit, final } = getProjectCharges(project.payments);
  return {
    projectCode: project.projectCode,
    planName: project.planName,
    totalAmount: project.totalAmount,
    depositAmount: deposit.amount,
    finalAmount: final.amount,
    stripeSessionId: deposit.stripeSessionId,
  };
}

// The webhook usually creates the Project first; find it by project code or by
// the Checkout Session that paid the deposit.
function findProject(sessionId: string, projectCode?: string) {
  return prisma.project.findFirst({
    where: {
      OR: [
        ...(projectCode ? [{ projectCode }] : []),
        { payments: { some: { stripeSessionId: sessionId } } },
      ],
    },
    include: { payments: true },
  });
}

export async function handlePaymentSuccessAction(
  sessionId: string,
  projectCode?: string
): Promise<HandlePaymentSuccessResult> {
  if (!sessionId) {
    return { success: false, error: "No session ID provided" };
  }

  try {
    // BEST PRACTICE: Check database FIRST before calling external APIs

    // 1. Quick initial check - the Project might already exist
    const quickCheck = await findProject(sessionId, projectCode);

    if (quickCheck) {
      // Link to contact for revenue attribution (fire and forget)
      linkProjectToContact(quickCheck.id).catch(console.error);
      return {
        success: true,
        project: toSuccessData(quickCheck),
        fallbackUsed: false,
      };
    }

    // 2. Poll database - give webhook time to process
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts × 1s = 30 seconds max
    const delayMs = 1000;

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempts++;

      const project = await findProject(sessionId, projectCode);

      if (project) {
        // Link to contact for revenue attribution (fire and forget)
        linkProjectToContact(project.id).catch(console.error);
        return {
          success: true,
          project: toSuccessData(project),
          fallbackUsed: false,
        };
      }
    }

    // 3. FALLBACK: Webhook didn't process in 30 seconds - retrieve session from Stripe
    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      console.error("❌ Error retrieving Stripe session:", stripeError);

      // Final check - maybe webhook processed while we were trying Stripe
      const finalCheck = await findProject(sessionId, projectCode);

      if (finalCheck) {
        return {
          success: true,
          project: toSuccessData(finalCheck),
          fallbackUsed: false,
        };
      }

      return {
        success: false,
        error: "Unable to verify payment. Please check your email for confirmation or contact support.",
      };
    }

    if (!session || session.payment_status !== "paid") {
      return { success: false, error: "Payment not completed" };
    }

    const metadata = session.metadata || {};
    const finalProjectCode = projectCode || metadata.projectCode;

    if (!finalProjectCode) {
      console.error("No project code found in session or params");
      return { success: false, error: "No project code found" };
    }

    // Final check before creating
    const existingProject = await findProject(session.id, finalProjectCode);

    if (existingProject) {
      return {
        success: true,
        project: toSuccessData(existingProject),
        fallbackUsed: false,
      };
    }

    // Prepare data for fallback creation
    const customerEmail = session.customer_email || metadata.customerEmail;
    const customerName = metadata.customerName || "Client";
    const planName = metadata.planName || "Unknown Plan";
    const totalAmount = parseInt(metadata.totalAmount || "0");
    const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
    const secondPaymentAmount = parseInt(metadata.secondPaymentAmount || "0");

    if (!customerEmail) {
      return { success: false, error: "Customer email not found" };
    }

    // Create the Project with its two charges; unique constraints on
    // projectCode and stripeSessionId protect against the webhook racing us
    try {
      const project = await prisma.project.create({
        data: {
          projectCode: finalProjectCode,
          email: customerEmail,
          name: customerName,
          planName,
          totalAmount,
          status: "in_progress",
          payments: {
            create: [
              {
                kind: "deposit",
                amount: firstPaymentAmount,
                status: "paid",
                paidAt: new Date(),
                stripeSessionId: session.id,
              },
              { kind: "final", amount: secondPaymentAmount },
            ],
          },
          ...(metadata.termsAcceptedAt && {
            termsAcceptance: {
              create: {
                acceptedAt: new Date(metadata.termsAcceptedAt),
                termsVersion: LEGAL_LAST_UPDATED.version,
                plan: planName,
                ipAddress: "payment-success-fallback",
                userAgent: "payment-success-fallback",
              },
            },
          }),
        },
        include: { payments: true },
      });

      // Link to contact for revenue attribution (fire and forget)
      linkProjectToContact(project.id).catch(console.error);

      // Send emails from fallback (parallel, independent)
      const resend = new Resend(process.env.RESEND_API_KEY!);

      const emailResults = await Promise.allSettled([
        sendInitialPaymentConfirmation(resend, {
          customerEmail,
          customerName,
          planName,
          projectCode: finalProjectCode,
          firstPaymentAmount,
          secondPaymentAmount,
          totalAmount,
          projectUrl: getProjectUrl(project.accessToken),
        }),
        sendAdminInitialPaymentFallback(resend, {
          projectCode: finalProjectCode,
          customerName,
          customerEmail,
          planName,
          firstPaymentAmount,
          projectId: project.id,
        }),
      ]);

      emailResults.forEach((result, index) => {
        if (result.status === "rejected") {
          const emailType = index === 0 ? "client confirmation" : "admin notification";
          console.error(`❌ Error sending ${emailType} email:`, result.reason);
        }
      });

      return {
        success: true,
        project: toSuccessData(project),
        fallbackUsed: true,
      };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        // Unique constraint - webhook processed while we were in fallback
        const existingProject = await findProject(session.id, finalProjectCode);
        if (existingProject) {
          return {
            success: true,
            project: toSuccessData(existingProject),
            fallbackUsed: false,
          };
        }
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error in handlePaymentSuccess:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to process payment",
    };
  }
}
