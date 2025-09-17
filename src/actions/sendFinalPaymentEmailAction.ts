"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendFinalPaymentEmail(projectCode: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { projectCode },
    });

    if (!payment) {
      return { success: false, error: "Project not found" };
    }

    // Generar URL con token seguro
    const paymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${payment.accessToken}`;

    // Enviar email con Resend o tu servicio preferido
    await resend.emails.send({
      from: "noreply@rcweb.dev",
      to: payment.email,
      subject: `Your project ${payment.planName} is ready!`,
      html: `
        <h2>Project Complete! 🎉</h2>
        <p>Hi ${payment.name},</p>
        <p>Great news! Your ${payment.planName} project is complete and ready for final review.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Project Code:</strong> ${payment.projectCode}</p>
          <p><strong>Final Payment Due:</strong> $${(payment.secondPayment / 100).toFixed(2)}</p>
        </div>
        
        <p>You can complete your payment in two ways:</p>
        <ol>
          <li><strong>Direct Link:</strong> <a href="${paymentUrl}">Click here to pay</a></li>
          <li><strong>Manual Access:</strong> Visit rcweb.dev/final-payment and use:
            <ul>
              <li>Email: ${payment.email}</li>
              <li>Project Code: ${payment.projectCode}</li>
            </ul>
          </li>
        </ol>
        
        <p>Once payment is complete, you'll receive all project files and documentation.</p>
        
        <p>Best regards,<br>RC Web Team</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
