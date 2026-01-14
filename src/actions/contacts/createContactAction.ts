"use server";

import { prisma } from "@/lib/prisma";
import { FormSchema, type FormData } from "@/lib/zod";
import { Resend } from "resend";
import { checkAndReserveEmailQuota, releaseEmailQuota } from "@/lib/emailQuota";
import { escapeHtml, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

export interface CreateContactAction {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!secretKey || !token) {
    console.warn("⚠️ reCAPTCHA not configured or no token provided");
    return true; // Allow submission if reCAPTCHA not configured
  }

  // Skip reCAPTCHA verification in development
  if (isDevelopment) {
    console.log("🔧 Development mode: Skipping reCAPTCHA verification");
    return true;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    // Score ranges from 0.0 (bot) to 1.0 (human)
    // We require a minimum score of 0.5
    if (data.success && data.score >= 0.5) {
            return true;
    }

    console.warn(`🚫 reCAPTCHA failed. Score: ${data.score}, Success: ${data.success}`);
    return false;
  } catch (error) {
    console.error("❌ reCAPTCHA verification error:", error);
    return true; // Allow submission on error to not block real users
  }
}

export const createContactAction = async (
  data: FormData,
  recaptchaToken?: string,
  timeSpent?: number
): Promise<CreateContactAction> => {
  // Anti-Bot Validation: Verify reCAPTCHA
  if (recaptchaToken) {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      console.warn("🚫 Bot detected: reCAPTCHA failed");
      return {
        success: false,
        message: "Verification failed. Please try again.",
        errors: {},
      };
    }
  }

  // Anti-Bot Validation: Check minimum time (3 seconds)
  if (timeSpent && timeSpent < 3000) {
    console.warn(`🚫 Bot detected: Form submitted too quickly (${timeSpent}ms)`);
    return {
      success: false,
      message: "Please take a moment to review your message.",
      errors: {},
    };
  }

  const parsed = FormSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation Failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const { name, email, phone, marketingConsent, message } = parsed.data;

    // Sanitize user inputs for HTML email rendering (prevents XSS)
    const safeName = escapeHtml(name);
    const safeEmail = sanitizeEmail(email);
    const safePhone = sanitizePhone(phone);
    const safeMessage = escapeHtml(message);

    // 1. Buscar contacto por email
    let contact = email
      ? await prisma.contact.findFirst({
          where: { emails: { some: { email } } },
          include: { emails: true, phones: true },
        })
      : null;

    // 2. Si no existe por email, buscar por teléfono
    if (!contact && phone) {
      contact = await prisma.contact.findFirst({
        where: { phones: { some: { phone } } },
        include: { emails: true, phones: true },
      });
    }

    // 3. Si existe contacto, actualizar y agregar nuevos emails/phones
    if (contact) {
      await prisma.contact.update({
        where: { id: contact.id },
        data: {
          name,
          marketingConsent,
          emails: email
            ? {
                connectOrCreate: {
                  where: { email },
                  create: { email },
                },
              }
            : undefined,
          phones: phone
            ? {
                connectOrCreate: {
                  where: { phone },
                  create: { phone },
                },
              }
            : undefined,
        },
      });
    } else {
      // 4. Si no existe, crear nuevo contacto con email y teléfono
      await prisma.contact.create({
        data: {
          name,
          marketingConsent,
          emails: email ? { create: { email } } : undefined,
          phones: phone ? { create: { phone } } : undefined,
        },
      });
    }

    // 5. Trigger n8n Lead Nurturing workflow (only if marketingConsent)
    if (marketingConsent && email) {
      try {
        const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/new-contact";
        await fetch(n8nWebhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone }),
        });
        console.log("✅ n8n webhook triggered for lead nurturing");
      } catch (webhookError) {
        // Don't fail the request if webhook fails
        console.error("⚠️ Failed to trigger n8n webhook:", webhookError);
      }
    }

    // 6. Verificar y reservar cuota (1 email al admin, confirmación va por n8n)
    const quotaCheck = await checkAndReserveEmailQuota(1);

    if (!quotaCheck.canSend) {
      console.warn(`⚠️ Quota limit reached: ${quotaCheck.message}`);
      // Still return success for contact creation, but don't send emails
      return {
        success: true,
        message: "Message received successfully!",
        errors: {},
      };
    }

    // 6. Enviar email al admin (el email de confirmación al usuario se envía via n8n)
    try {
      await resend.emails.send({
          from: "RC Web Solutions <no-reply@rcweb.dev>",
          to: ["admin@rcweb.dev"],
          subject: `📩 New message from ${safeName}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;">

                        <!-- Header -->
                        <tr>
                          <td style="background:linear-gradient(135deg,#6366f1 0%,#7c3aed 100%);padding:40px 32px;text-align:center;">
                            <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:50%;padding:16px;margin-bottom:16px;">
                              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 4h16v16H4z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                              </svg>
                            </div>
                            <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">New Website Message</h1>
                            <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">A new inquiry was submitted through the contact form</p>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:32px;">
                            <p style="font-size:16px;color:#374151;margin:0 0 24px;">You have received a new message from your website contact form:</p>

                            <!-- Info Box -->
                            <div style="background-color:#f9fafb;border-radius:12px;padding:24px;margin-bottom:32px;">
                              <table style="width:100%;font-size:14px;">
                                <tr>
                                  <td style="color:#6b7280;padding:6px 0;">Name:</td>
                                  <td style="text-align:right;font-weight:600;color:#374151;">${safeName}</td>
                                </tr>
                                <tr>
                                  <td style="color:#6b7280;padding:6px 0;">Email:</td>
                                  <td style="text-align:right;font-weight:600;color:#374151;">${safeEmail}</td>
                                </tr>
                                <tr>
                                  <td style="color:#6b7280;padding:6px 0;">Phone:</td>
                                  <td style="text-align:right;font-weight:600;color:#374151;">${safePhone || "Not provided"}</td>
                                </tr>
                              </table>
                            </div>

                            <!-- Message -->
                            <div style="background:linear-gradient(135deg,#ede9fe 0%,#ddd6fe 100%);border-left:4px solid #7c3aed;border-radius:8px;padding:20px;margin-bottom:32px;">
                              <p style="color:#5b21b6;font-weight:600;font-size:16px;margin:0 0 12px;">Message:</p>
                              <p style="color:#374151;font-size:14px;line-height:1.6;margin:0;">${safeMessage}</p>
                            </div>

                            <!-- Footer -->
                            <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
                            <p style="text-align:center;color:#6b7280;font-size:14px;margin:0;">
                              Reply directly to <a href="mailto:${safeEmail}" style="color:#7c3aed;text-decoration:none;">${safeEmail}</a> to respond to this message.
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

      // Email de confirmación al usuario (DESACTIVADO - Ahora se envía via n8n Lead Nurturing)
        // email
        //   ? resend.emails.send({
        //       from: "RC Web Solution <contactus@rcweb.dev>",
        //       to: [email],
        //       subject: "Got your message! - RC Web Solution",
        //       html: `
        //     <!DOCTYPE html>
        //     <html>
        //       <head>
        //         <meta charset="utf-8">
        //         <meta name="viewport" content="width=device-width, initial-scale=1.0">
        //       </head>
        //       <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
        //         <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
        //           <tr>
        //             <td align="center">
        //               <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;">

        //                 <!-- Header -->
        //                 <tr>
        //                   <td style="background:linear-gradient(135deg,#6366f1 0%,#7c3aed 100%);padding:40px 32px;text-align:center;">
        //                     <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;">Thanks for reaching out!</h1>
        //                     <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:16px;">RC Web Solution</p>
        //                   </td>
        //                 </tr>

        //                 <!-- Body -->
        //                 <tr>
        //                   <td style="padding:32px;">
        //                     <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
        //                       Hi there,
        //                     </p>

        //                     <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
        //                       Thanks for reaching out to <strong>RC Web Solution</strong>!
        //                     </p>

        //                     <p style="font-size:16px;color:#374151;margin:0 0 24px;line-height:1.6;">
        //                       I've received your email and will respond within <strong>24 hours</strong> (usually much sooner).
        //                     </p>

        //                     <!-- Contact Options -->
        //                     <div style="background-color:#f9fafb;border-radius:12px;padding:24px;margin-bottom:24px;">
        //                       <p style="font-size:16px;color:#374151;margin:0 0 16px;font-weight:600;">In the meantime, feel free to:</p>
        //                       <table style="width:100%;font-size:14px;">
        //                         <tr>
        //                           <td style="padding:8px 0;">
        //                             <span style="font-size:18px;margin-right:8px;">📱</span>
        //                             <span style="color:#374151;">Call/text me directly: <a href="tel:+13463757534" style="color:#7c3aed;text-decoration:none;font-weight:600;">+1 346 375 7534</a></span>
        //                           </td>
        //                         </tr>
        //                         <tr>
        //                           <td style="padding:8px 0;">
        //                             <span style="font-size:18px;margin-right:8px;">🌐</span>
        //                             <span style="color:#374151;">Check out my portfolio: <a href="https://rcweb.dev" style="color:#7c3aed;text-decoration:none;font-weight:600;">https://rcweb.dev</a></span>
        //                           </td>
        //                         </tr>
        //                       </table>
        //                     </div>

        //                     <!-- Availability Badge -->
        //                     <div style="background:linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%);border-left:4px solid #22c55e;border-radius:8px;padding:20px;margin-bottom:32px;">
        //                       <p style="color:#166534;font-weight:600;font-size:16px;margin:0;">
        //                         <span style="font-size:18px;margin-right:8px;">🟢</span>
        //                         Good news: I'm currently available and can start new projects immediately.
        //                       </p>
        //                     </div>

        //                     <p style="font-size:16px;color:#374151;margin:0 0 8px;">Talk soon,</p>
        //                     <p style="font-size:16px;color:#374151;margin:0;font-weight:600;">Randy Caballero</p>
        //                     <p style="font-size:14px;color:#6b7280;margin:0;">RC Web Solution LLC</p>

        //                     <!-- Footer -->
        //                     <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
        //                     <table style="width:100%;font-size:14px;color:#6b7280;">
        //                       <tr>
        //                         <td style="padding:4px 0;">📧 <a href="mailto:contactus@rcweb.dev" style="color:#7c3aed;text-decoration:none;">contactus@rcweb.dev</a></td>
        //                       </tr>
        //                       <tr>
        //                         <td style="padding:4px 0;">📱 <a href="tel:+13463757534" style="color:#7c3aed;text-decoration:none;">+1 346 375 7534</a></td>
        //                       </tr>
        //                       <tr>
        //                         <td style="padding:4px 0;">🌐 <a href="https://rcweb.dev" style="color:#7c3aed;text-decoration:none;">https://rcweb.dev</a></td>
        //                       </tr>
        //                     </table>
        //                   </td>
        //                 </tr>

        //               </table>
        //             </td>
        //           </tr>
        //         </table>
        //       </body>
        //     </html>
        //   `,
        //     })
        //   : Promise.resolve(),
    } catch (emailError) {
      console.error("❌ Failed to send email:", emailError);
      // Release quota on email send failure
      await releaseEmailQuota(1);
      throw emailError;
    }

    return {
      success: true,
      message: "Message sent successfully!",
      errors: {},
    };
  } catch (error) {
    console.error("Error in createContactAction:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      success: false,
      message: `Failed to send message: ${errorMessage}`,
      errors: {},
    };
  }
};
