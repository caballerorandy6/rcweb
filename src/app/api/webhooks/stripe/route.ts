// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { Resend } from "resend";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import { ADMIN_EMAIL } from "@/lib/email/adminEmail";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import { toSubscriptionStatus } from "@/lib/subscriptionStatus";
import { getProjectCharges, isPaid } from "@/lib/project/charges";
import type { Prisma } from "@/generated/prisma/client";
import {
  sendSubscriptionConfirmation,
  sendAdminSubscriptionNotification,
  sendAdminInitialPaymentNotification,
  sendAdminFinalPaymentNotification,
  sendSubscriptionRenewalReminder,
  sendSubscriptionPaymentFailed,
} from "@/lib/email";

// Environment variables validation
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
}
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not configured");
}

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TERMS_VERSION = LEGAL_LAST_UPDATED.version;

function isUniqueConstraintError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "P2002"
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error("❌ Error verifying webhook signature:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const paymentType = metadata.paymentType;
    const projectCode = metadata.projectCode;
    const customerName = metadata.customerName;
    const planName = metadata.planName;
    const customerEmail = session.customer_email || metadata.customerEmail;

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= INITIAL PAYMENT =============
    if (paymentType === "initial" && projectCode && customerEmail) {
      try {
        // Extract and validate amounts from metadata
        const totalAmount = parseInt(metadata.totalAmount || "0");
        const firstPaymentAmount = parseInt(metadata.firstPaymentAmount || "0");
        const secondPaymentAmount = parseInt(
          metadata.secondPaymentAmount || "0"
        );

        // Validate that amounts are valid
        if (
          isNaN(totalAmount) ||
          isNaN(firstPaymentAmount) ||
          isNaN(secondPaymentAmount) ||
          totalAmount <= 0 ||
          firstPaymentAmount <= 0 ||
          secondPaymentAmount <= 0
        ) {
          console.error("❌ Invalid amounts in metadata:", {
            totalAmount: metadata.totalAmount,
            firstPaymentAmount: metadata.firstPaymentAmount,
            secondPaymentAmount: metadata.secondPaymentAmount,
          });
          return NextResponse.json(
            { error: "Invalid payment amounts in metadata" },
            { status: 400 }
          );
        }

        // CHECK if the Project already exists (created by the /payment-success fallback)
        let project = await prisma.project.findFirst({
          where: {
            OR: [
              { projectCode },
              { payments: { some: { stripeSessionId: session.id } } },
            ],
          },
          include: { payments: true, invoices: true },
        });

        if (project) {
          // Make sure the deposit row records this Checkout Session
          const { deposit } = getProjectCharges(project.payments);
          if (!deposit.stripeSessionId) {
            project = await prisma.project.update({
              where: { id: project.id },
              data: {
                payments: {
                  update: {
                    where: { id: deposit.id },
                    data: {
                      stripeSessionId: session.id,
                      status: "paid",
                      paidAt: deposit.paidAt ?? new Date(),
                    },
                  },
                },
              },
              include: { payments: true, invoices: true },
            });
          }
        } else {
          // CREATE Project with its two charges (and TermsAcceptance) atomically
          const data = {
              projectCode,
              email: customerEmail,
              name: customerName || "Client",
              planName: planName || "Unknown Plan",
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
                    termsVersion: TERMS_VERSION,
                    plan: planName,
                    ipAddress: "stripe-checkout",
                    userAgent: "stripe-checkout",
                  },
                },
              }),
          } satisfies Prisma.ProjectCreateInput;

          try {
            project = await prisma.project.create({
              data,
              include: { payments: true, invoices: true },
            });
          } catch (createError) {
            // The /payment-success fallback won the race (unique projectCode or
            // stripeSessionId): reload its row and continue with the invoice
            if (!isUniqueConstraintError(createError)) throw createError;
            project = await prisma.project.findFirstOrThrow({
              where: {
                OR: [
                  { projectCode },
                  { payments: { some: { stripeSessionId: session.id } } },
                ],
              },
              include: { payments: true, invoices: true },
            });
          }
        }

        // ============= CREATE INVOICE AND SEND EMAIL =============
        const emailErrors: string[] = [];

        // Check if initial invoice already exists
        const hasInitialInvoice = project.invoices.some(
          (inv) => inv.type === "initial"
        );

        if (!hasInitialInvoice) {
          try {
            await createInvoiceAndSendEmail({
              project,
              type: "initial",
              resend,
              stripeSessionId: session.id,
            });
          } catch (invoiceError) {
            const errorMsg = `Error creating invoice: ${invoiceError instanceof Error ? invoiceError.message : String(invoiceError)}`;
            console.error("❌ Invoice error:", errorMsg);
            emailErrors.push(errorMsg);
          }
        }

        // ============= ADMIN EMAIL =============
        const adminResult = await sendAdminInitialPaymentNotification(resend, {
          projectCode,
          customerName: customerName || "Unknown",
          customerEmail,
          planName: planName || "Unknown Plan",
          firstPaymentAmount,
          secondPaymentAmount,
          projectId: project.id,
        });

        if (!adminResult.success && adminResult.error) {
          emailErrors.push(adminResult.error);
        }

        // If there were email errors, include them in response (but don't fail)
        return NextResponse.json({
          received: true,
          projectId: project.id,
          ...(emailErrors.length > 0 && { emailErrors }),
        });
      } catch (err: unknown) {
        console.error("❌ Error processing initial payment:", err);
        throw err;
      }
    }

    // ============= FINAL PAYMENT =============
    else if (
      paymentType === "final" &&
      (metadata.projectId || metadata.paymentId) &&
      customerEmail
    ) {
      // Sessions created before the Project/Payment split carry `paymentId`;
      // Project kept those ids, so both name the same row
      const projectId = metadata.projectId || metadata.paymentId;

      try {
        // Check if the project exists and get current state
        let project = await prisma.project.findUnique({
          where: { id: projectId },
          include: { payments: true, invoices: true },
        });

        if (!project) {
          throw new Error("PROJECT_NOT_FOUND");
        }

        const { final } = getProjectCharges(project.payments);

        if (!isPaid(final)) {
          // Mark the final charge as paid and complete the project (one atomic write)
          project = await prisma.project.update({
            where: { id: projectId },
            data: {
              status: "completed",
              payments: {
                update: {
                  where: { id: final.id },
                  data: {
                    status: "paid",
                    paidAt: new Date(),
                    stripeSessionId: session.id,
                  },
                },
              },
            },
            include: { payments: true, invoices: true },
          });
        } else if (!final.stripeSessionId) {
          // Already paid (retry): only record the session if missing
          project = await prisma.project.update({
            where: { id: projectId },
            data: {
              payments: {
                update: {
                  where: { id: final.id },
                  data: { stripeSessionId: session.id },
                },
              },
            },
            include: { payments: true, invoices: true },
          });
        }

        // ============= CREATE INVOICES AND SEND EMAILS =============
        const emailErrors: string[] = [];

        // Check if invoices already exist
        const hasFinalInvoice = project.invoices.some(
          (inv) => inv.type === "final"
        );
        const hasSummaryInvoice = project.invoices.some(
          (inv) => inv.type === "summary"
        );

        // Create and send FINAL invoice if it doesn't exist
        if (!hasFinalInvoice) {
          try {
            await createInvoiceAndSendEmail({
              project,
              type: "final",
              resend,
              stripeSessionId: session.id,
            });
          } catch (invoiceError) {
            const errorMsg = `Error creating final invoice: ${invoiceError instanceof Error ? invoiceError.message : String(invoiceError)}`;
            console.error("❌ Final invoice error:", errorMsg);
            emailErrors.push(errorMsg);
          }
        }

        // Create and send SUMMARY invoice if it doesn't exist
        if (!hasSummaryInvoice) {
          try {
            await createInvoiceAndSendEmail({
              project,
              type: "summary",
              resend,
            });
          } catch (invoiceError) {
            const errorMsg = `Error creating summary invoice: ${invoiceError instanceof Error ? invoiceError.message : String(invoiceError)}`;
            console.error("❌ Summary invoice error:", errorMsg);
            emailErrors.push(errorMsg);
          }
        }

        // ============= ADMIN EMAIL =============
        const adminResult = await sendAdminFinalPaymentNotification(resend, {
          projectCode: project.projectCode,
          customerName: project.name,
          customerEmail,
          planName: project.planName,
          finalPaymentAmount: final.amount,
          totalAmount: project.totalAmount,
        });

        if (!adminResult.success && adminResult.error) {
          emailErrors.push(adminResult.error);
        }

        // If there were email errors, include them in response (but don't fail)
        return NextResponse.json({
          received: true,
          completed: true,
          ...(emailErrors.length > 0 && { emailErrors }),
        });
      } catch (err: unknown) {
        if (err instanceof Error && err.message === "PROJECT_NOT_FOUND") {
          console.error("❌ Project not found:", projectId);
          return NextResponse.json(
            { received: true, error: "Project not found" },
            { status: 404 }
          );
        }

        console.error("❌ Error processing final payment:", {
          error: err instanceof Error ? err.message : String(err),
          projectId,
          sessionId: session.id,
        });
        throw err; // Re-throw for Stripe to retry
      }
    }
    // ============= SUBSCRIPTION PAYMENT =============
    else if (paymentType === "subscription" && customerEmail) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY!);

        // Get subscription ID from the session
        const subscriptionId = session.subscription as string;

        if (!subscriptionId) {
          return NextResponse.json(
            { error: "No subscription ID in session" },
            { status: 400 }
          );
        }

        // Check if subscription already exists (idempotency)
        const existingSubscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (existingSubscription) {
          return NextResponse.json({
            received: true,
            duplicate: "SUBSCRIPTION_EXISTS",
          });
        }

        // Get subscription details from Stripe (with items expanded)
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionId,
          { expand: ["items.data.price"] }
        );
        const customerId = stripeSubscription.customer as string;
        const subscriptionItem = stripeSubscription.items.data[0];
        const amount = subscriptionItem?.price?.unit_amount || 20000;
        // In Stripe SDK v18+, current_period_end is on SubscriptionItem, not Subscription
        const currentPeriodEnd = subscriptionItem?.current_period_end;
        const currentPeriodStart = subscriptionItem?.current_period_start;
        const nextBillingDate = currentPeriodEnd
          ? new Date(currentPeriodEnd * 1000)
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days from now

        // Create Subscription and TermsAcceptance in transaction
        const subscription = await prisma.$transaction(async (tx) => {
          const newSubscription = await tx.subscription.create({
            data: {
              stripeSubscriptionId: subscriptionId,
              stripeCustomerId: customerId,
              email: customerEmail,
              name: customerName || "Client",
              planName: planName || "Monthly Website Maintenance",
              amount: amount,
              status: toSubscriptionStatus(stripeSubscription.status),
              currentPeriodStart: currentPeriodStart
                ? new Date(currentPeriodStart * 1000)
                : new Date(),
              currentPeriodEnd: nextBillingDate,
              stripeSessionId: session.id,
            },
          });

          // Create TermsAcceptance if termsAcceptedAt is provided
          if (metadata.termsAcceptedAt) {
            await tx.termsAcceptance.create({
              data: {
                subscriptionId: newSubscription.id,
                acceptedAt: new Date(metadata.termsAcceptedAt),
                termsVersion: TERMS_VERSION,
                plan: planName,
                ipAddress: "stripe-checkout",
                userAgent: "stripe-checkout",
              },
            });
          }

          return newSubscription;
        });

        // ============= SEND EMAILS =============
        const emailErrors: string[] = [];

        // Send customer confirmation email
        const customerResult = await sendSubscriptionConfirmation(resend, {
          customerEmail,
          customerName: customerName || "Client",
          planName: planName || "Monthly Website Maintenance",
          amount,
          nextBillingDate,
        });

        if (!customerResult.success && customerResult.error) {
          emailErrors.push(customerResult.error);
        }

        // Send admin notification email
        const adminResult = await sendAdminSubscriptionNotification(resend, {
          customerName: customerName || "Unknown",
          customerEmail,
          planName: planName || "Monthly Website Maintenance",
          amount,
          status: toSubscriptionStatus(stripeSubscription.status),
          stripeSubscriptionId: subscriptionId,
          nextBillingDate,
        });

        if (!adminResult.success && adminResult.error) {
          emailErrors.push(adminResult.error);
        }

        return NextResponse.json({
          received: true,
          subscriptionId: subscription.id,
          ...(emailErrors.length > 0 && { emailErrors }),
        });
      } catch (err: unknown) {
        // Handle Prisma unique constraint error (already processed)
        if (isUniqueConstraintError(err)) {
          return NextResponse.json({ received: true, duplicate: "constraint" });
        }

        console.error("❌ Error processing subscription:", err);
        throw err;
      }
    } else {
      return NextResponse.json({
        received: true,
        warning: "Conditions not met",
      });
    }
  }

  // ============= INVOICE PAID (Subscription Renewal) =============
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      typeof invoice.parent?.subscription_details?.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : null;

    // Only process subscription invoices (not the first one)
    if (subscriptionId && invoice.billing_reason !== "subscription_create") {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscriptionId,
          { expand: ["items.data.price"] }
        );

        const subscriptionItem = stripeSubscription.items.data[0];
        const currentPeriodEnd = subscriptionItem?.current_period_end;
        const currentPeriodStart = subscriptionItem?.current_period_start;

        await prisma.subscription.update({
          where: { stripeSubscriptionId: subscriptionId },
          data: {
            status: toSubscriptionStatus(stripeSubscription.status),
            currentPeriodStart: currentPeriodStart
              ? new Date(currentPeriodStart * 1000)
              : undefined,
            currentPeriodEnd: currentPeriodEnd
              ? new Date(currentPeriodEnd * 1000)
              : undefined,
          },
        });

        return NextResponse.json({ received: true, renewed: true });
      } catch (err) {
        console.error("❌ Error processing subscription renewal:", err);
        return NextResponse.json({
          received: true,
          warning: "Subscription not found in DB",
        });
      }
    }
  }

  // ============= INVOICE UPCOMING (Renewal Reminder) =============
  if (event.type === "invoice.upcoming") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      typeof invoice.parent?.subscription_details?.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : null;

    if (subscriptionId) {
      try {
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (subscription && subscription.status === "active") {
          const resend = new Resend(process.env.RESEND_API_KEY!);
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";

          // Calculate renewal date (from invoice or current period end)
          const renewalDate = invoice.next_payment_attempt
            ? new Date(invoice.next_payment_attempt * 1000)
            : subscription.currentPeriodEnd || new Date();

          await sendSubscriptionRenewalReminder(resend, {
            customerEmail: subscription.email,
            customerName: subscription.name,
            planName: subscription.planName,
            amount: subscription.amount,
            renewalDate,
            manageUrl: `${baseUrl}/manage-subscription`,
          });
        }

        return NextResponse.json({ received: true, reminderSent: true });
      } catch (err) {
        console.error("❌ Error sending renewal reminder:", err);
        return NextResponse.json({
          received: true,
          warning: "Error sending renewal reminder",
        });
      }
    }
  }

  // ============= INVOICE PAYMENT FAILED =============
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId =
      typeof invoice.parent?.subscription_details?.subscription === "string"
        ? invoice.parent.subscription_details.subscription
        : null;

    if (subscriptionId) {
      try {
        const subscription = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (subscription) {
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: "past_due" },
          });

          const resend = new Resend(process.env.RESEND_API_KEY!);
          const baseUrl =
            process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";

          // Email to customer with update payment link
          await sendSubscriptionPaymentFailed(resend, {
            customerEmail: subscription.email,
            customerName: subscription.name,
            planName: subscription.planName,
            amount: subscription.amount,
            updatePaymentUrl: `${baseUrl}/manage-subscription`,
          });

          // Email to admin
          await resend.emails.send({
            from: "RC Web Solutions <no-reply@rcweb.dev>",
            to: ADMIN_EMAIL,
            subject: `Payment Failed - ${subscription.email}`,
            html: `
              <h2>Subscription Payment Failed</h2>
              <p><strong>Customer:</strong> ${subscription.name}</p>
              <p><strong>Email:</strong> ${subscription.email}</p>
              <p><strong>Plan:</strong> ${subscription.planName}</p>
              <p><strong>Amount:</strong> $${(subscription.amount / 100).toFixed(2)}/month</p>
            `,
          });
        }

        return NextResponse.json({ received: true, paymentFailed: true });
      } catch (err) {
        console.error("❌ Error handling payment failure:", err);
        return NextResponse.json({
          received: true,
          warning: "Error processing payment failure",
        });
      }
    }
  }

  // ============= SUBSCRIPTION DELETED (Cancelled) =============
  if (event.type === "customer.subscription.deleted") {
    const stripeSubscription = event.data.object as Stripe.Subscription;
    const subscriptionId = stripeSubscription.id;

    try {
      const subscription = await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: "cancelled",
          cancelledAt: new Date(),
        },
      });

      const resend = new Resend(process.env.RESEND_API_KEY!);

      await resend.emails.send({
        from: "RC Web Solutions <no-reply@rcweb.dev>",
        to: subscription.email,
        subject: "Subscription Cancelled",
        html: `
          <h2>Subscription Cancelled</h2>
          <p>Hi ${subscription.name},</p>
          <p>Your <strong>${subscription.planName}</strong> subscription has been cancelled.</p>
          <p>We're sorry to see you go. If you change your mind, you can always resubscribe.</p>
          <p>Questions? Contact us at <a href="mailto:contactus@rcweb.dev">contactus@rcweb.dev</a></p>
        `,
      });

      await resend.emails.send({
        from: "RC Web Solutions <no-reply@rcweb.dev>",
        to: ADMIN_EMAIL,
        subject: `Subscription Cancelled - ${subscription.email}`,
        html: `
          <h2>Subscription Cancelled</h2>
          <p><strong>Customer:</strong> ${subscription.name}</p>
          <p><strong>Email:</strong> ${subscription.email}</p>
          <p><strong>Plan:</strong> ${subscription.planName}</p>
        `,
      });

      return NextResponse.json({ received: true, cancelled: true });
    } catch (err) {
      console.error("❌ Error processing subscription cancellation:", err);
      return NextResponse.json({
        received: true,
        warning: "Subscription not found",
      });
    }
  }

  // ============= SUBSCRIPTION UPDATED =============
  if (event.type === "customer.subscription.updated") {
    const stripeSubscription = event.data.object as Stripe.Subscription;
    const subscriptionId = stripeSubscription.id;

    try {
      const subscriptionItem = stripeSubscription.items.data[0];
      const currentPeriodEnd = subscriptionItem?.current_period_end;
      const currentPeriodStart = subscriptionItem?.current_period_start;

      await prisma.subscription.update({
        where: { stripeSubscriptionId: subscriptionId },
        data: {
          status: toSubscriptionStatus(stripeSubscription.status),
          currentPeriodStart: currentPeriodStart
            ? new Date(currentPeriodStart * 1000)
            : undefined,
          currentPeriodEnd: currentPeriodEnd
            ? new Date(currentPeriodEnd * 1000)
            : undefined,
        },
      });

      return NextResponse.json({ received: true, updated: true });
    } catch (err) {
      console.error("❌ Error updating subscription:", err);
      return NextResponse.json({
        received: true,
        warning: "Subscription not found",
      });
    }
  }

  return NextResponse.json({ received: true });
}
