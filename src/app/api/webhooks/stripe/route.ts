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
import { createProjectFromDeposit } from "@/lib/project/createProjectFromDeposit";
import { isUniqueConstraintError } from "@/lib/prismaErrors";
import {
  isOwnCheckoutSession,
  parseCheckoutMetadata,
} from "@/lib/checkoutMetadata";
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

    // Sessions we did not create (Payment Links, Dashboard) carry none of our
    // metadata: acknowledge them so Stripe does not retry for days
    if (!isOwnCheckoutSession(session.metadata)) {
      return NextResponse.json({
        received: true,
        warning: "Checkout Session without a known paymentType",
      });
    }

    // Our own actions wrote this metadata and Stripe signed the event, so a
    // parse failure is a bug on our side: answer 400 so the delivery shows as
    // failed in the Stripe dashboard instead of being silently acknowledged.
    const parsed = parseCheckoutMetadata(session.metadata);
    if (!parsed.success) {
      console.error("❌ Invalid Checkout Session metadata:", {
        sessionId: session.id,
        issues: parsed.error.issues,
      });
      return NextResponse.json(
        { error: "Invalid checkout metadata" },
        { status: 400 }
      );
    }
    const metadata = parsed.data;

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= INITIAL PAYMENT =============
    // createProjectFromDeposit() is the only place a Project is created. Stripe
    // retries the event until it gets a 2xx, so the same session can arrive
    // more than once and the unique projectCode tells whether it was processed.
    if (metadata.paymentType === "initial") {
      const {
        projectCode,
        customerEmail,
        customerName,
        planName,
        firstPaymentAmount,
        secondPaymentAmount,
        totalAmount,
        termsAcceptedAt,
      } = metadata;

      try {
        const { project, emailErrors } = await createProjectFromDeposit(
          {
            projectCode,
            customerEmail,
            customerName,
            planName,
            totalAmount,
            firstPaymentAmount,
            secondPaymentAmount,
            deposit: { method: "stripe", paidAt: new Date(), stripeSessionId: session.id },
            terms: {
              acceptedAt: termsAcceptedAt,
              termsVersion: TERMS_VERSION,
              ipAddress: "stripe-checkout",
              userAgent: "stripe-checkout",
            },
            quoteId: metadata.quoteId,
          },
          resend
        );

        // ============= ADMIN EMAIL =============
        const adminResult = await sendAdminInitialPaymentNotification(resend, {
          projectCode,
          customerName,
          customerEmail,
          planName,
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
    else if (metadata.paymentType === "final") {
      const { projectId } = metadata;

      try {
        let project = await prisma.project.findUnique({
          where: { id: projectId },
          include: { payments: true, invoices: true },
        });

        if (!project) {
          throw new Error("PROJECT_NOT_FOUND");
        }

        // The session could only be created while the project was
        // ready_for_payment (createFinalPaymentSessionAction). The customer
        // has paid by now, so the charge is recorded whatever the status is.
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
          customerEmail: project.email,
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
    else {
      const { customerEmail, customerName, planName, termsAcceptedAt } =
        metadata;

      try {
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
              name: customerName,
              planName,
              amount: amount,
              status: toSubscriptionStatus(stripeSubscription.status),
              currentPeriodStart: currentPeriodStart
                ? new Date(currentPeriodStart * 1000)
                : new Date(),
              currentPeriodEnd: nextBillingDate,
              stripeSessionId: session.id,
            },
          });

          await tx.termsAcceptance.create({
            data: {
              subscriptionId: newSubscription.id,
              acceptedAt: termsAcceptedAt,
              termsVersion: TERMS_VERSION,
              plan: planName,
              ipAddress: "stripe-checkout",
              userAgent: "stripe-checkout",
            },
          });

          return newSubscription;
        });

        // ============= SEND EMAILS =============
        const emailErrors: string[] = [];

        // Send customer confirmation email
        const customerResult = await sendSubscriptionConfirmation(resend, {
          customerEmail,
          customerName,
          planName,
          amount,
          nextBillingDate,
        });

        if (!customerResult.success && customerResult.error) {
          emailErrors.push(customerResult.error);
        }

        // Send admin notification email
        const adminResult = await sendAdminSubscriptionNotification(resend, {
          customerName,
          customerEmail,
          planName,
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
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.rcweb.dev";

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
            process.env.NEXT_PUBLIC_BASE_URL || "https://www.rcweb.dev";

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
