// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { Resend } from "resend";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import { toSubscriptionStatus } from "@/lib/subscriptionStatus";
import { getProjectCharges } from "@/lib/project/charges";
import { markChargePaid } from "@/lib/project/markChargePaid";
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
} from "@/lib/email";
import { fromStripeAddress } from "@/lib/tax/billingAddress";
import {
  handleChargeRefunded,
  handleDisputeClosed,
  handleDisputeCreated,
  reportUnrecordedFinalPayment,
} from "@/lib/stripe/webhook/paymentIssues";
import {
  handleInvoicePaid,
  handleInvoicePaymentFailed,
  handleInvoiceUpcoming,
  handleSubscriptionDeleted,
  handleSubscriptionUpdated,
} from "@/lib/stripe/webhook/subscriptions";

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
    // Stripe Tax added this on top of the charge; it is 0 outside Texas
    const taxAmount = session.total_details?.amount_tax ?? 0;
    // Refund and dispute events name the PaymentIntent, not the session
    const stripePaymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : (session.payment_intent?.id ?? undefined);

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
        const { project, created, emailErrors } = await createProjectFromDeposit(
          {
            projectCode,
            customerEmail,
            customerName,
            locale: metadata.locale,
            planName,
            totalAmount,
            firstPaymentAmount,
            secondPaymentAmount,
            deposit: {
              method: "stripe",
              paidAt: new Date(),
              stripeSessionId: session.id,
              stripePaymentIntentId,
              taxAmount,
            },
            terms: {
              acceptedAt: termsAcceptedAt,
              termsVersion: TERMS_VERSION,
              ipAddress: "stripe-checkout",
              userAgent: "stripe-checkout",
            },
            quoteId: metadata.quoteId,
            billingAddress: fromStripeAddress(session.customer_details?.address),
          },
          resend
        );

        // ============= ADMIN EMAIL =============
        // Only for the delivery that created the project: a Stripe retry or a manual
        // resend (to recover a failed invoice) must not notify the admin again
        if (created) {
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
        let { final } = getProjectCharges(project.payments);

        // Only one delivery marks the charge paid, however many arrive at once,
        // and only a pending charge: one that was paid and refunded keeps
        // describing the money that went back.
        let firstDelivery = false;
        if (final.status === "pending") {
          firstDelivery = await markChargePaid({
            projectId,
            chargeId: final.id,
            charge: {
              paidAt: new Date(),
              checkoutSessionId: null,
              stripeSessionId: session.id,
              stripePaymentIntentId,
              taxAmount,
            },
            project: { status: "completed" },
          });
          project = await prisma.project.findUniqueOrThrow({
            where: { id: projectId },
            include: { payments: true, invoices: true },
          });
          final = getProjectCharges(project.payments).final;
        }

        // The charge was settled by something else (another session, Zelle or
        // cash, or a payment since refunded): this is a second payment. It is
        // not recorded anywhere; the admin is told to refund it.
        if (final.stripeSessionId !== session.id) {
          const emailError = await reportUnrecordedFinalPayment(resend, {
            project,
            final,
            sessionId: session.id,
            amountPaid: session.amount_total ?? 0,
            paymentIntentId: stripePaymentIntentId,
          });
          return NextResponse.json({
            received: true,
            warning: "Final payment already settled; second payment not recorded",
            ...(emailError && { emailErrors: [emailError] }),
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
            Sentry.captureException(invoiceError, {
              tags: { feature: "stripe-webhook" },
              extra: { projectId, sessionId: session.id, type: "final" },
            });
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
            Sentry.captureException(invoiceError, {
              tags: { feature: "stripe-webhook" },
              extra: { projectId, sessionId: session.id, type: "summary" },
            });
            emailErrors.push(errorMsg);
          }
        }

        // ============= ADMIN EMAIL =============
        // Only for the delivery that recorded the payment: a Stripe retry or a
        // resend (to recover a failed invoice) must not notify the admin again
        if (firstDelivery) {
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
      const { customerEmail, customerName, planName, termsAcceptedAt, locale } =
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
              locale,
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

        // Every Checkout makes its own Stripe customer, so nothing stops the
        // same email from subscribing twice: the admin is told, and decides.
        // The row exists and a retry would send nothing, so a failed count
        // must not stop the emails.
        const otherActiveSubscriptions = await prisma.subscription
          .count({
            where: {
              email: customerEmail,
              status: { not: "cancelled" },
              id: { not: subscription.id },
            },
          })
          .catch((error: unknown) => {
            Sentry.captureException(error, {
              tags: { feature: "stripe-webhook" },
              extra: { event: event.type, subscriptionId },
            });
            return 0;
          });

        // ============= SEND EMAILS =============
        const emailErrors: string[] = [];

        // Send customer confirmation email
        const customerResult = await sendSubscriptionConfirmation(resend, {
          customerEmail,
          customerName,
          locale,
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
          otherActiveSubscriptions,
        });

        if (!adminResult.success && adminResult.error) {
          emailErrors.push(adminResult.error);
        }

        // The row exists, so a retry would not send them again: make a
        // customer left without their confirmation visible
        if (emailErrors.length > 0) {
          Sentry.captureMessage("Subscription email not sent", {
            level: "error",
            tags: { feature: "stripe-webhook" },
            extra: { event: event.type, subscriptionId, emailErrors },
          });
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

  // ============= SUBSCRIPTION LIFECYCLE =============
  // Renewals, reminders, failed payments and cancellations of a maintenance
  // plan. The handlers answer 2xx with a warning for a subscription we have
  // no row for and throw on a database or Stripe error, so Stripe retries.
  if (event.type === "invoice.paid") {
    return NextResponse.json(await handleInvoicePaid(event.data.object));
  }
  if (
    event.type === "invoice.upcoming" ||
    event.type === "invoice.payment_failed" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.updated"
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const result =
      event.type === "invoice.upcoming"
        ? await handleInvoiceUpcoming(event.data.object, resend)
        : event.type === "invoice.payment_failed"
          ? await handleInvoicePaymentFailed(event.data.object, resend)
          : event.type === "customer.subscription.deleted"
            ? await handleSubscriptionDeleted(event.data.object, resend)
            : await handleSubscriptionUpdated(event.data.object, resend);
    return NextResponse.json(result);
  }

  // ============= REFUNDS AND DISPUTES =============
  // Money going back to a customer of a 50/50 project. The handlers answer
  // 2xx with a warning for charges that are not project payments, ask for a
  // retry (409) when our own checkout.session.completed has not been
  // processed yet, and throw only on database errors, so Stripe retries those.
  if (
    event.type === "charge.refunded" ||
    event.type === "charge.dispute.created" ||
    event.type === "charge.dispute.closed"
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const result =
      event.type === "charge.refunded"
        ? await handleChargeRefunded(event.data.object, resend)
        : event.type === "charge.dispute.created"
          ? await handleDisputeCreated(event.data.object, resend)
          : await handleDisputeClosed(event.data.object, resend);
    return NextResponse.json(result, { status: result.retry ? 409 : 200 });
  }

  return NextResponse.json({ received: true });
}
