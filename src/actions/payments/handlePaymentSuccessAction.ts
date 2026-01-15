"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  sendInitialPaymentConfirmation,
  sendAdminInitialPaymentFallback,
} from "@/lib/email/senders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function handlePaymentSuccessAction(
  sessionId: string,
  projectCode?: string
) {
  if (!sessionId) {
    return { success: false, error: "No session ID provided" };
  }

  try {
    // BEST PRACTICE: Check database FIRST before calling external APIs
    // The webhook usually processes faster and creates the Payment

    // 1. Quick initial check - Payment might already exist
    const quickCheck = await prisma.payment.findFirst({
      where: {
        OR: [
          ...(projectCode ? [{ projectCode }] : []),
          { firstSessionId: sessionId },
        ],
      },
    });

    if (quickCheck) {
      console.log("✅ Payment found immediately (webhook already processed)");
      return { success: true, payment: quickCheck, fallbackUsed: false };
    }

    // 2. Poll database - give webhook time to process
    let payment = null;
    let attempts = 0;
    const maxAttempts = 30; // 30 attempts × 1s = 30 seconds max
    const delayMs = 1000;

    while (attempts < maxAttempts && !payment) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      attempts++;

      payment = await prisma.payment.findFirst({
        where: {
          OR: [
            ...(projectCode ? [{ projectCode }] : []),
            { firstSessionId: sessionId },
          ],
        },
      });

      if (payment) {
        console.log(
          `✅ Payment found after ${attempts} seconds (webhook processed)`
        );
        return { success: true, payment, fallbackUsed: false };
      }
    }

    // 3. FALLBACK: Webhook didn't process in 30 seconds - retrieve session from Stripe
    console.log("⚠️ Webhook did not process in time, using fallback...");

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
    } catch (stripeError) {
      console.error("❌ Error retrieving Stripe session:", stripeError);

      // Final check - maybe webhook processed while we were trying Stripe
      const finalCheck = await prisma.payment.findFirst({
        where: {
          OR: [
            ...(projectCode ? [{ projectCode }] : []),
            { firstSessionId: sessionId },
          ],
        },
      });

      if (finalCheck) {
        return { success: true, payment: finalCheck, fallbackUsed: false };
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
    const existingPayment = await prisma.payment.findFirst({
      where: {
        OR: [{ projectCode: finalProjectCode }, { firstSessionId: session.id }],
      },
    });

    if (existingPayment) {
      return { success: true, payment: existingPayment, fallbackUsed: false };
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

    // Create Payment with optimistic lock to avoid duplicates
    try {
      payment = await prisma.$transaction(async (tx) => {
        // Verify once more within transaction
        const checkAgain = await tx.payment.findFirst({
          where: {
            OR: [
              { projectCode: finalProjectCode },
              { firstSessionId: session.id },
            ],
          },
        });

        if (checkAgain) {
          return checkAgain;
        }

        const newPayment = await tx.payment.create({
          data: {
            projectCode: finalProjectCode,
            email: customerEmail,
            name: customerName,
            planName: planName,
            totalAmount,
            firstPayment: firstPaymentAmount,
            secondPayment: secondPaymentAmount,
            firstPaid: true,
            firstPaidAt: new Date(),
            firstSessionId: session.id,
            projectStatus: "in_progress",
          },
        });

        if (metadata.termsAcceptedAt) {
          await tx.termsAcceptance.create({
            data: {
              paymentId: newPayment.id,
              acceptedAt: new Date(metadata.termsAcceptedAt),
              termsVersion: "2025-09-25",
              plan: planName,
              ipAddress: "payment-success-fallback",
              userAgent: "payment-success-fallback",
            },
          });
        }

        return newPayment;
      });

      console.log("✅ Payment created via fallback");

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
        }),
        sendAdminInitialPaymentFallback(resend, {
          projectCode: finalProjectCode,
          customerName,
          customerEmail,
          planName,
          firstPaymentAmount,
          paymentId: payment.id,
        }),
      ]);

      emailResults.forEach((result, index) => {
        if (result.status === "rejected") {
          const emailType = index === 0 ? "client confirmation" : "admin notification";
          console.error(`❌ Error sending ${emailType} email:`, result.reason);
        }
      });

      return { success: true, payment, fallbackUsed: true };
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        // Unique constraint - webhook processed while we were in fallback
        const existingPayment = await prisma.payment.findFirst({
          where: {
            OR: [
              { projectCode: finalProjectCode },
              { firstSessionId: session.id },
            ],
          },
        });
        if (existingPayment) {
          return {
            success: true,
            payment: existingPayment,
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
