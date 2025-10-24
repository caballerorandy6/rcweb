"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkAndReserveEmailQuota, releaseEmailQuota } from "@/lib/emailQuota";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function downloadGuideAction(email: string) {
  try {
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: "Invalid email address",
      };
    }

    // 1. Verificar si el email ya existe en la base de datos
    const existingEmail = await prisma.contactEmail.findUnique({
      where: { email },
    });

    // 2. Si no existe, crear nuevo contacto
    if (!existingEmail) {
      await prisma.contact.create({
        data: {
          name: "Guide Download", // Nombre placeholder
          marketingConsent: false, // No tiene consentimiento de marketing aún
          source: "guide_download",
          emails: {
            create: {
              email,
            },
          },
        },
      });
    }

    // 3. Verificar quota de emails
    const quotaCheck = await checkAndReserveEmailQuota(1);
    if (!quotaCheck.canSend) {
      console.warn(`⚠️ Email quota exceeded: ${quotaCheck.message}`);
      // Aún descarga el PDF del lado del cliente, pero no envía email
      return {
        success: true,
        message: "Guide will be downloaded. Email delivery may be delayed due to quota.",
        emailSent: false,
      };
    }

    // 4. Leer el PDF desde el filesystem
    const pdfPath = path.join(process.cwd(), "public", "web-development-guide.pdf");
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBuffer.toString("base64");

    // 5. Enviar email con el PDF adjunto
    const { error } = await resend.emails.send({
      from: "RC Web Solutions <contactus@rcweb.dev>",
      to: email,
      subject: "Your Free Web Development Guide 📘",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #D4AF37 0%, #F4E5A1 100%);
                padding: 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .header h1 {
                color: #1a1a1a;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e0e0e0;
                border-top: none;
              }
              .button {
                display: inline-block;
                background: #D4AF37;
                color: #1a1a1a;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
              }
              .footer {
                background: #f5f5f5;
                padding: 20px;
                text-align: center;
                border-radius: 0 0 10px 10px;
                font-size: 12px;
                color: #666;
              }
              .tips {
                background: #f9f9f9;
                border-left: 4px solid #D4AF37;
                padding: 15px;
                margin: 20px 0;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🎉 Your Free Guide is Here!</h1>
            </div>

            <div class="content">
              <p>Hi there!</p>

              <p>Thank you for downloading our <strong>Web Development Guide for Small Businesses</strong>. We're excited to help you on your web journey!</p>

              <div class="tips">
                <h3 style="margin-top: 0; color: #D4AF37;">📚 What's Inside:</h3>
                <ul>
                  <li>How to choose the right web development approach</li>
                  <li>Understanding modern web technologies</li>
                  <li>SEO fundamentals for small businesses</li>
                  <li>Website security best practices</li>
                  <li>Cost-effective development strategies</li>
                  <li>And much more!</li>
                </ul>
              </div>

              <p>The PDF is attached to this email. If you have any questions or need help with your web project, don't hesitate to reach out!</p>

              <center>
                <a href="https://rcweb.dev/#contact" class="button">Let's Talk About Your Project</a>
              </center>

              <p style="margin-top: 30px;">Best regards,<br><strong>Randy Caballero</strong><br>RC Web Solutions LLC</p>
            </div>

            <div class="footer">
              <p>RC Web Solutions LLC | Houston, TX 77085<br>
              📧 contactus@rcweb.dev | 📱 (346) 375-7534<br>
              🌐 <a href="https://rcweb.dev" style="color: #D4AF37;">rcweb.dev</a></p>

              <p style="margin-top: 15px; font-size: 11px;">
                You received this email because you downloaded our Web Development Guide.<br>
                <a href="https://rcweb.dev/unsubscribe" style="color: #999;">Unsubscribe</a>
              </p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: "RC-Web-Development-Guide.pdf",
          content: pdfBase64,
        },
      ],
    });

    // 6. Manejar errores del envío de email
    if (error) {
      // Liberar quota si el email falló
      await releaseEmailQuota(1);

      console.error("Error sending email:", error);

      // El PDF se descarga de todos modos en el cliente
      return {
        success: true,
        message: "Guide downloaded. There was an issue sending the email, but you can still access the PDF.",
        emailSent: false,
      };
    }

    // 7. Success!
    return {
      success: true,
      message: "Guide downloaded and sent to your email!",
      emailSent: true,
    };

  } catch (error) {
    console.error("Error in downloadGuideAction:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred. Please try again.",
    };
  }
}
