"use server";

import { prisma } from "@/lib/prisma";

// Desuscribir UN contacto específico por email
export async function unsubscribeFromEmailAction(email: string) {
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

    return {
      success: true,
      message: `${email} has been unsubscribed from marketing emails.`,
    };
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
