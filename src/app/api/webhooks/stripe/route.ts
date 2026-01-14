// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";
import { trackPaymentComplete } from "@/lib/analytics";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import {
  sendSubscriptionConfirmation,
  sendAdminSubscriptionNotification,
  sendAdminInitialPaymentNotification,
  sendAdminFinalPaymentNotification,
  sendSubscriptionRenewalReminder,
  sendSubscriptionPaymentFailed,
  sendSetupPasswordEmail,
} from "@/lib/email";

// Environment variables validation
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
}
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is not configured");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const TERMS_VERSION = "2025-09-25"; // Centralized terms version

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

        // CHECK if Payment already exists (created by fallback)
        let payment = await prisma.payment.findFirst({
          where: {
            OR: [{ projectCode }, { firstSessionId: session.id }],
          },
          include: {
            invoices: true,
          },
        });

        // If payment exists but has no invoices, we'll create the invoice below
        if (payment) {
          // If payment doesn't have the session ID, update it
          if (!payment.firstSessionId) {
            payment = await prisma.payment.update({
              where: { id: payment.id },
              data: { firstSessionId: session.id },
              include: { invoices: true },
            });
          }
        }

        // CREATE Payment and TermsAcceptance if it doesn't exist
        let clientWasCreated = false;
        let clientSetupToken: string | null = null;

        if (!payment) {
          payment = await prisma.$transaction(async (tx) => {
            // Try to find existing client by email (in case they registered before paying)
            let existingClient = await tx.client.findUnique({
              where: { email: customerEmail },
            });

            // If client doesn't exist, create it automatically (Opción 1)
            if (!existingClient) {
              const setupToken = crypto.randomBytes(32).toString("hex");
              const setupTokenExpiry = new Date();
              setupTokenExpiry.setDate(setupTokenExpiry.getDate() + 30); // 30 días de validez

              existingClient = await tx.client.create({
                data: {
                  email: customerEmail,
                  name: customerName || "Client",
                  password: null, // Sin contraseña hasta que la establezca
                  emailVerified: new Date(),
                  isActive: true,
                  setupToken,
                  setupTokenExpiry,
                },
              });

              clientWasCreated = true;
              clientSetupToken = setupToken;
            }

            const newPayment = await tx.payment.create({
              data: {
                projectCode,
                email: customerEmail,
                name: customerName || "Client",
                planName: planName || "Unknown Plan",
                totalAmount,
                firstPayment: firstPaymentAmount,
                secondPayment: secondPaymentAmount,
                firstPaid: true,
                firstPaidAt: new Date(),
                firstSessionId: session.id,
                projectStatus: "in_progress",
                // Link to client (ya existe o fue creado arriba)
                clientId: existingClient.id,
              },
              include: {
                invoices: true,
              },
            });

            if (metadata.termsAcceptedAt) {
              await tx.termsAcceptance.create({
                data: {
                  paymentId: newPayment.id,
                  acceptedAt: new Date(metadata.termsAcceptedAt),
                  termsVersion: TERMS_VERSION,
                  plan: planName,
                  ipAddress: "stripe-checkout",
                  userAgent: "stripe-checkout",
                },
              });
            }

            return newPayment;
          });

          // Track payment completion in Google Analytics
          trackPaymentComplete(firstPaymentAmount / 100, "initial_deposit");
        }

        // ============= CREATE INVOICE AND SEND EMAIL =============
        const emailErrors: string[] = [];

        // Check if initial invoice already exists
        const hasInitialInvoice = payment.invoices.some(
          (inv) => inv.type === "initial"
        );

        if (!hasInitialInvoice) {
          try {
            await createInvoiceAndSendEmail({
              payment,
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

        // ============= SEND SETUP PASSWORD EMAIL =============
        // If client was created automatically, send setup password email
        if (clientWasCreated && clientSetupToken && payment.accessToken) {
          try {
            const baseUrl =
              process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";
            const setupPasswordUrl = `${baseUrl}/client/setup-password?token=${clientSetupToken}`;

            const setupEmailResult = await sendSetupPasswordEmail({
              customerEmail,
              customerName: customerName || "Client",
              setupPasswordUrl,
              projectCode: payment.projectCode,
              accessToken: payment.accessToken,
            });

            if (!setupEmailResult.success && setupEmailResult.error) {
              emailErrors.push(
                `Setup password email error: ${setupEmailResult.error}`
              );
            }
          } catch (setupEmailError) {
            const errorMsg = `Error sending setup password email: ${setupEmailError instanceof Error ? setupEmailError.message : String(setupEmailError)}`;
            console.error("❌ Setup password email error:", errorMsg);
            emailErrors.push(errorMsg);
          }
        }

        // ============= CLIENT EMAIL (OLD - COMMENTED OUT) =============
        // NOTE: The email with invoice PDF is now sent by createInvoiceAndSendEmail above
        // The old email code has been commented out to avoid duplicate emails

        /*
        try {
          await resend.emails.send({
            from: "RC Web Solutions <no-reply@rcweb.dev>",
            to: customerEmail,
            subject: `✅ Payment Confirmed - Your Project Code`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 48px 32px; text-align: center;">
                              <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              </div>
                              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Payment Confirmed!</h1>
                              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your project has been initiated</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 32px;">
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Hi <strong>${customerName || "Client"}</strong>,
                              </p>
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                                Thank you for your initial payment. We've started working on your <strong style="color: #7c3aed;">${planName}</strong> project!
                              </p>
                              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border: 2px solid #f59e0b; border-radius: 12px; padding: 24px; text-align: center; margin: 0 0 32px 0;">
                                <p style="margin: 0 0 8px 0; color: #92400e; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                  Your Project Code
                                </p>
                                <p style="margin: 8px 0; font-family: 'Courier New', monospace; font-size: 36px; color: #d97706; font-weight: bold; letter-spacing: 4px;">
                                  ${projectCode}
                                </p>
                                <p style="margin: 8px 0 0 0; color: #92400e; font-size: 13px;">
                                  Save this code - Required for final payment
                                </p>
                              </div>
                              <div style="background-color: #f9fafb; border-radius: 12px; padding: 24px; margin: 0 0 32px 0;">
                                <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 16px 0;">What Happens Next?</h3>
                                <ol style="color: #4b5563; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                  <li style="margin-bottom: 8px;">We'll contact you within <strong>24 hours</strong> to discuss project details</li>
                                  <li style="margin-bottom: 8px;">Project development time based on your plan</li>
                                  <li style="margin-bottom: 8px;">We'll notify you when ready for final payment</li>
                                  <li>All deliverables provided after final payment</li>
                                </ol>
                              </div>
                              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; margin: 0 0 32px 0;">
                                <h3 style="color: #111827; font-size: 16px; font-weight: 600; margin: 0 0 12px 0;">Payment Summary</h3>
                                <table style="width: 100%; font-size: 14px;">
                                  <tr>
                                    <td style="padding: 4px 0; color: #6b7280;">Initial Payment (50%):</td>
                                    <td style="text-align: right; color: #059669; font-weight: 600;">$${(firstPaymentAmount / 100).toFixed(2)} ✓</td>
                                  </tr>
                                  <tr>
                                    <td style="padding: 4px 0; color: #6b7280;">Final Payment (50%):</td>
                                    <td style="text-align: right; color: #6b7280;">$${(secondPaymentAmount / 100).toFixed(2)}</td>
                                  </tr>
                                  <tr style="border-top: 1px solid #d1d5db;">
                                    <td style="padding: 8px 0 0 0; color: #374151; font-weight: 600;">Total Project Cost:</td>
                                    <td style="padding: 8px 0 0 0; text-align: right; color: #374151; font-weight: 600;">$${(totalAmount / 100).toFixed(2)}</td>
                                  </tr>
                                </table>
                              </div>
                              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
                              <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
                                Questions? Contact us at <a href="mailto:contactus@rcweb.dev" style="color: #7c3aed; text-decoration: none;">contactus@rcweb.dev</a>
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
          });
                  } catch (emailError) {
          const errorMsg = `Error sending email to client: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          // emailErrors.push(errorMsg);
        }
        */

        // ============= ADMIN EMAIL =============
        const adminResult = await sendAdminInitialPaymentNotification(resend, {
          projectCode,
          customerName: customerName || "Unknown",
          customerEmail,
          planName: planName || "Unknown Plan",
          firstPaymentAmount,
          secondPaymentAmount,
          paymentId: payment.id,
        });

        if (!adminResult.success && adminResult.error) {
          emailErrors.push(adminResult.error);
        }

        // If there were email errors, include them in response (but don't fail)
        return NextResponse.json({
          received: true,
          paymentId: payment.id,
          ...(emailErrors.length > 0 && { emailErrors }),
        });
      } catch (err: unknown) {
        // Handle duplicates in an idempotent way
        if (err instanceof Error) {
          if (
            err.message === "DUPLICATE_PROJECT_CODE" ||
            err.message === "DUPLICATE_SESSION_ID"
          ) {
            return NextResponse.json({
              received: true,
              duplicate: err.message,
            });
          }
        }

        // If it's a Prisma unique constraint error, it means it was already processed
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: string }).code === "P2002"
        ) {
          return NextResponse.json({ received: true, duplicate: "constraint" });
        }

        console.error("❌ Error processing initial payment:", err);
        throw err;
      }
    }

    // ============= FINAL PAYMENT =============
    else if (paymentType === "final" && metadata.paymentId && customerEmail) {
      const paymentId = metadata.paymentId;

      try {
        // Check if payment exists and get current state
        let payment = await prisma.payment.findUnique({
          where: { id: paymentId },
          include: { invoices: true },
        });

        if (!payment) {
          throw new Error("PAYMENT_NOT_FOUND");
        }

        // If payment not marked as secondPaid yet, update it
        if (!payment.secondPaid) {
          payment = await prisma.payment.update({
            where: { id: paymentId },
            data: {
              secondPaid: true,
              secondPaidAt: new Date(),
              secondSessionId: session.id,
              projectStatus: "completed",
            },
            include: { invoices: true },
          });
          // Track final payment completion in Google Analytics
          trackPaymentComplete(payment.secondPayment / 100, "final_payment");
        } else {
          // Update session ID if not set
          if (!payment.secondSessionId) {
            payment = await prisma.payment.update({
              where: { id: paymentId },
              data: { secondSessionId: session.id },
              include: { invoices: true },
            });
          }
        }

        // ============= CREATE INVOICES AND SEND EMAILS =============
        const emailErrors: string[] = [];

        // Check if invoices already exist
        const hasFinalInvoice = payment.invoices.some(
          (inv) => inv.type === "final"
        );
        const hasSummaryInvoice = payment.invoices.some(
          (inv) => inv.type === "summary"
        );

        // Create and send FINAL invoice if it doesn't exist
        if (!hasFinalInvoice) {
          try {
            await createInvoiceAndSendEmail({
              payment,
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
              payment,
              type: "summary",
              resend,
            });
          } catch (invoiceError) {
            const errorMsg = `Error creating summary invoice: ${invoiceError instanceof Error ? invoiceError.message : String(invoiceError)}`;
            console.error("❌ Summary invoice error:", errorMsg);
            emailErrors.push(errorMsg);
          }
        }

        // ============= PROJECT COMPLETION EMAIL (OLD - COMMENTED OUT) =============
        // NOTE: Emails with invoice PDFs are now sent by createInvoiceAndSendEmail above
        // The old email code has been commented out to avoid duplicate emails

        /*
        const oldEmailErrors: string[] = [];

        try {
          await resend.emails.send({
            from: "RC Web Solutions <no-reply@rcweb.dev>",
            to: customerEmail,
            subject: `🎉 Project Complete - ${payment.planName} Website Ready!`,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f3f4f6; padding: 40px 20px;">
                    <tr>
                      <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                          <tr>
                            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 48px 32px; text-align: center;">
                              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: 700;">Project Complete!</h1>
                              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Your ${payment.planName} website is ready</p>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 40px 32px;">
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                                Hi <strong>${payment.name}</strong>,
                              </p>
                              <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
                                Congratulations! Your project has been successfully completed and your final payment of 
                                <strong style="color: #059669; font-size: 18px;">$${(payment.secondPayment / 100).toFixed(2)}</strong> has been received.
                              </p>
                              <div style="background-color: #f3f4f6; border-radius: 12px; padding: 20px; text-align: center;">
                                <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px 0;">Need help? We're here for you!</p>
                                <a href="mailto:contactus@rcweb.dev" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Email Support</a>
                              </div>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </body>
              </html>
            `,
          });
                  } catch (emailError) {
          const errorMsg = `Error sending completion email: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          // oldEmailErrors.push(errorMsg);
        }
        */

        // ============= ADMIN EMAIL =============
        const adminResult = await sendAdminFinalPaymentNotification(resend, {
          projectCode: payment.projectCode,
          customerName: payment.name,
          customerEmail,
          planName: payment.planName,
          finalPaymentAmount: payment.secondPayment,
          totalAmount: payment.totalAmount,
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
        // Handle idempotency-specific errors
        if (err instanceof Error) {
          if (err.message === "PAYMENT_NOT_FOUND") {
            console.error("❌ Payment not found:", paymentId);
            return NextResponse.json(
              { received: true, error: "Payment not found" },
              { status: 404 }
            );
          }

          if (
            err.message === "DUPLICATE_FINAL_SESSION" ||
            err.message === "ALREADY_PAID"
          ) {
            return NextResponse.json({
              received: true,
              duplicate: err.message,
            });
          }
        }

        console.error("❌ Error processing final payment:", {
          error: err instanceof Error ? err.message : String(err),
          paymentId,
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
              status: stripeSubscription.status,
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
          status: stripeSubscription.status,
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
        if (
          typeof err === "object" &&
          err !== null &&
          "code" in err &&
          (err as { code?: string }).code === "P2002"
        ) {
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
            status: stripeSubscription.status,
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

          console.log("✅ Renewal reminder sent to:", subscription.email);
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
            to: "admin@rcweb.dev",
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
        to: "admin@rcweb.dev",
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
          status: stripeSubscription.status,
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
