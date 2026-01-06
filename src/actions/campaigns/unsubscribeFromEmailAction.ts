"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import type { ActionResultSimple } from "@/types/common";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function unsubscribeFromEmailAction(
  email: string
): Promise<ActionResultSimple> {
  try {
    const contact = await prisma.contact.findFirst({
      where: {
        emails: {
          some: { email: email.toLowerCase() },
        },
      },
    });

    if (!contact) {
      return { success: false, error: "Contact not found" };
    }

    await prisma.contact.update({
      where: { id: contact.id },
      data: { marketingConsent: false },
    });

    // 👉 Enviar correo de confirmación
    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: email,
      subject: "You've unsubscribed from our emails",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; background: #f9fafb; padding: 24px; border-radius: 12px;">
          <h1 style="text-align: center; color: #ef4444;">Unsubscribed Successfully</h1>
          <p style="color: #374151;">Hi ${contact.name || ""},</p>
          <p style="color: #374151;">You have successfully unsubscribed <strong>${email}</strong> from our marketing emails. You will no longer receive promotions, newsletters, or offers from RC Web.</p>
          <p style="color: #6b7280; font-size: 14px;">Note: You may still receive transactional emails related to your active projects or payments.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
          <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Changed your mind? <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="color: #7c3aed;">Visit our site</a> to resubscribe anytime.
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return { success: false, error: "Failed to unsubscribe" };
  }
}

// Generar token de desuscripción seguro (opcional pero recomendado)
export async function generateUnsubscribeToken(contactId: string) {
  // Podrías guardar esto en la BD con expiración
  const token = Buffer.from(`${contactId}-${Date.now()}`).toString("base64");
  return token;
}
