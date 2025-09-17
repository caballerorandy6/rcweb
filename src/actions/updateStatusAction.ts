"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

// Actualizar estado y enviar email cuando está listo
export async function updateProjectStatusWithEmail(
  projectCode: string,
  status: string
) {
  try {
    const payment = await prisma.payment.update({
      where: { projectCode },
      data: {
        projectStatus: status,
        projectReady: status === "ready_for_payment" ? new Date() : undefined,
      },
    });

    // Enviar email si está listo para pago final
    if (status === "ready_for_payment") {
      await resend.emails.send({
        from: "RC Web <no-reply@rcweb.dev>",
        to: payment.email,
        subject: "🎉 Your project is ready! Final payment required",
        html: `[tu template HTML aquí]`,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed to update" };
  }
}
