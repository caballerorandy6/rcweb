"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FormSchema, type FormData } from "@/lib/zod";
import { Resend } from "resend";
import { checkAndReserveEmailQuota, releaseEmailQuota } from "@/lib/emailQuota";
import { escapeHtml, sanitizeEmail, sanitizePhone } from "@/lib/sanitize";

export interface CreateContactAction {
  success: boolean;
  message: string;
  errors: Record<string, string[]>;
}

export interface UTMData {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  referrer?: string | null;
  landingPage?: string | null;
}

const resend = new Resend(process.env.RESEND_API_KEY!);

const RECAPTCHA_ACTION = "submit_contact_form";
const RECAPTCHA_MIN_SCORE = 0.5;

async function verifyRecaptcha(token: string | undefined): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("⚠️ reCAPTCHA secret key not configured; skipping verification");
    return true;
  }

  // Sin token no hay forma de probar que es una persona: un bot podría omitirlo.
  if (!token) {
    return false;
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: secretKey, response: token }),
    });

    const data = await response.json();

    // El token debe ser válido, venir de este formulario y tener score de humano
    if (
      data.success &&
      data.action === RECAPTCHA_ACTION &&
      data.score >= RECAPTCHA_MIN_SCORE
    ) {
      return true;
    }

    console.warn(
      `🚫 reCAPTCHA failed. Score: ${data.score}, Action: ${data.action}, Success: ${data.success}, Hostname: ${data.hostname}, Errors: ${JSON.stringify(data["error-codes"] ?? [])}`
    );
    return false;
  } catch (error) {
    // Si Google no responde se deja pasar para no bloquear clientes reales;
    // un atacante no puede provocar esta falla desde el navegador.
    console.error("❌ reCAPTCHA verification error:", error);
    return true;
  }
}

export const createContactAction = async (
  data: FormData,
  recaptchaToken?: string,
  timeSpent?: number,
  source: string = "contact_form",
  utmData?: UTMData
): Promise<CreateContactAction> => {
  // El admin crea contactos manualmente desde el dashboard sin reCAPTCHA.
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const skipBotChecks = isAdmin || process.env.NODE_ENV === "development";

  if (!skipBotChecks) {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      console.warn("🚫 Bot detected: reCAPTCHA failed");
      return {
        success: false,
        message: "Verification failed. Please refresh the page and try again.",
        errors: {},
      };
    }

    // Anti-Bot Validation: Check minimum time (3 seconds)
    if (timeSpent !== undefined && timeSpent < 3000) {
      console.warn(`🚫 Bot detected: Form submitted too quickly (${timeSpent}ms)`);
      return {
        success: false,
        message: "Please take a moment to review your message.",
        errors: {},
      };
    }
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
          source,
          emails: email ? { create: { email } } : undefined,
          phones: phone ? { create: { phone } } : undefined,
          // UTM tracking data
          utmSource: utmData?.utmSource || null,
          utmMedium: utmData?.utmMedium || null,
          utmCampaign: utmData?.utmCampaign || null,
          utmTerm: utmData?.utmTerm || null,
          utmContent: utmData?.utmContent || null,
          referrer: utmData?.referrer || null,
          landingPage: utmData?.landingPage || null,
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
