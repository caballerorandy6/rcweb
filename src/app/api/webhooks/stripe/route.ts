// app/api/stripe/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { trackPaymentComplete } from "@/lib/analytics";

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
  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    console.log("🚨 WEBHOOK RECEIVED:", new Date().toISOString());
    console.log("🚀 Webhook endpoint reached");
    console.log("🌐 Full URL:", req.url);
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature") as string;

  if (isDev) {
    console.log("📦 Body length:", body.length);
    console.log("🔑 Signature present:", !!signature);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    console.log("✅ Signature verified, event:", event.type);
    console.log("✅ Event verified successfully");
  } catch (err) {
    console.error("❌ Error verifying webhook signature:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }

  console.log("🔔 Webhook received:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};

    const paymentType = metadata.paymentType;
    const projectCode = metadata.projectCode;
    const customerName = metadata.customerName;
    const planName = metadata.planName;
    const customerEmail = session.customer_email || metadata.customerEmail;

    if (isDev) {
      console.log("📋 Metadata received:", {
        paymentType,
        projectCode,
        customerEmail,
        planName,
        sessionId: session.id,
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY!);

    // ============= INITIAL PAYMENT =============
    if (paymentType === "initial" && projectCode && customerEmail) {
      try {
        console.log("💰 Processing INITIAL PAYMENT for:", projectCode);

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

        if (isDev) {
          console.log("💾 Creating new Payment with projectCode:", projectCode);
        }

        // CREATE Payment and TermsAcceptance in transaction with duplicate verification
        const payment = await prisma.$transaction(async (tx) => {
          // Verify duplicates inside transaction to avoid race conditions
          const existingByCode = await tx.payment.findUnique({
            where: { projectCode },
          });

          if (existingByCode) {
            console.log("⚠️ Payment already exists with projectCode:", projectCode);
            throw new Error("DUPLICATE_PROJECT_CODE");
          }

          const existingBySession = await tx.payment.findFirst({
            where: { firstSessionId: session.id },
          });

          if (existingBySession) {
            console.log("⚠️ Payment already exists with sessionId:", session.id);
            throw new Error("DUPLICATE_SESSION_ID");
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
            if (isDev) {
              console.log(
                "✅ TermsAcceptance created for paymentId:",
                newPayment.id
              );
            }
          }

          return newPayment;
        });

        console.log("✅ Payment created successfully with ID:", payment.id);

        // Track payment completion in Google Analytics
        trackPaymentComplete(firstPaymentAmount / 100, "initial_deposit");

        // ============= CLIENT EMAIL =============
        const emailErrors: string[] = [];

        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
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
          console.log("✅ Initial email sent to client");
        } catch (emailError) {
          const errorMsg = `Error sending email to client: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          emailErrors.push(errorMsg);
        }

        // ============= ADMIN EMAIL =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: "admin@rcweb.dev",
            subject: `💰 New advance payment received - Project ${projectCode}`,
            html: `
              <h2>New Initial Payment Received</h2>
              <p><strong>Project Code:</strong> ${projectCode}</p>
              <p><strong>Client:</strong> ${customerName || "Unknown"}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              <p><strong>Plan:</strong> ${planName}</p>
              <p><strong>Initial Payment:</strong> $${(firstPaymentAmount / 100).toFixed(2)}</p>
              <p><strong>Pending Payment:</strong> $${(secondPaymentAmount / 100).toFixed(2)}</p>
              <p><strong>Payment ID:</strong> ${payment.id}</p>
              <hr>
              <p>Remember to contact the client within 24 hours to discuss project details.</p>
            `,
          });
          console.log("✅ Email sent to admin");
        } catch (emailError) {
          const errorMsg = `Error sending email to admin: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          emailErrors.push(errorMsg);
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
            console.log("⚠️ Payment already processed (duplicate detected)");
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
          console.log("⚠️ Payment already processed (P2002 constraint)");
          return NextResponse.json({ received: true, duplicate: "constraint" });
        }

        console.error("❌ Error processing initial payment:", {
          error: err instanceof Error ? err.message : String(err),
          projectCode,
          sessionId: session.id,
        });
        throw err; // Re-throw for Stripe to retry
      }
    }

    // ============= FINAL PAYMENT =============
    else if (paymentType === "final" && metadata.paymentId && customerEmail) {
      console.log("💰 Processing FINAL PAYMENT");

      const paymentId = metadata.paymentId;

      try {
        // Use transaction for complete idempotency
        const payment = await prisma.$transaction(async (tx) => {
          const existingPayment = await tx.payment.findUnique({
            where: { id: paymentId },
          });

          if (!existingPayment) {
            console.error("❌ Payment not found:", paymentId);
            throw new Error("PAYMENT_NOT_FOUND");
          }

          // Check if already processed with this sessionId
          if (existingPayment.secondSessionId === session.id) {
            console.log(
              "⚠️ Final payment already processed with this sessionId:",
              session.id
            );
            throw new Error("DUPLICATE_FINAL_SESSION");
          }

          // Check if already processed (with another sessionId)
          if (existingPayment.secondPaid) {
            console.log("⚠️ Final payment already processed previously");
            throw new Error("ALREADY_PAID");
          }

          const updatedPayment = await tx.payment.update({
            where: { id: paymentId },
            data: {
              secondPaid: true,
              secondPaidAt: new Date(),
              secondSessionId: session.id,
              projectStatus: "completed",
            },
          });

          return updatedPayment;
        });

        console.log("✅ Payment updated - Project completed");

        // Track final payment completion in Google Analytics
        trackPaymentComplete(payment.secondPayment / 100, "final_payment");

        // ============= PROJECT COMPLETION EMAIL =============
        const emailErrors: string[] = [];

        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
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
          console.log("✅ Project completion email sent");
        } catch (emailError) {
          const errorMsg = `Error sending completion email: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          emailErrors.push(errorMsg);
        }

        // ============= ADMIN EMAIL =============
        try {
          await resend.emails.send({
            from: "RC Web <no-reply@rcweb.dev>",
            to: "admin@rcweb.dev",
            subject: `💰 Final Payment Received - ${payment.planName} - ${payment.projectCode}`,
            html: `
              <h2>Final Payment Completed ✅</h2>
              <p><strong>Project Code:</strong> ${payment.projectCode}</p>
              <p><strong>Client:</strong> ${payment.name} (${customerEmail})</p>
              <p><strong>Plan:</strong> ${payment.planName}</p>
              <p><strong>Final Payment:</strong> $${(payment.secondPayment / 100).toFixed(2)}</p>
              <p><strong>Total Project Value:</strong> $${(payment.totalAmount / 100).toFixed(2)}</p>
              <p><strong>Project Status:</strong> COMPLETED</p>
            `,
          });
          console.log("✅ Email sent to admin about final payment");
        } catch (emailError) {
          const errorMsg = `Error sending email to admin: ${emailError instanceof Error ? emailError.message : String(emailError)}`;
          console.error("❌", errorMsg);
          emailErrors.push(errorMsg);
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
            console.log(
              "⚠️ Final payment already processed:",
              err.message,
              "- Returning idempotent response"
            );
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
    } else {
      console.log("⚠️ Conditions not met to process payment");
      return NextResponse.json({
        received: true,
        warning: "Conditions not met",
      });
    }
  }

  return NextResponse.json({ received: true });
}
