"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface NewsletterActionResponse {
  success: boolean;
  message: string;
  sentCount?: number;
}

export const sendNewsletterAction = async (
  subject: string,
  htmlContent: string,
  testMode = false
): Promise<NewsletterActionResponse> => {
  try {
    // 1. Obtener contactos con consentimiento que tengan al menos un email
    const contactsWithEmail = await prisma.contact.findMany({
      where: {
        marketingConsent: true,
        emails: {
          some: {}, // Asegura que solo traemos contactos con emails
        },
      },
      select: {
        name: true,
        emails: {
          select: {
            email: true,
          },
        },
      },
    });

    if (contactsWithEmail.length === 0) {
      return {
        success: false,
        message: "No eligible contacts found to send.",
      };
    }

    // 2. Usar flatMap para crear una lista de envío correcta.
    // Esto crea un objeto por CADA email, no por cada contacto.
    const emailsToSend = contactsWithEmail.flatMap((contact) =>
      contact.emails.map((email) => ({
        from: "RC Web <no-reply@rcweb.dev>",
        to: email.email,
        subject: subject.replace(/{{name}}/g, contact.name), // Personalizar también el asunto
        html: htmlContent.replace(/{{name}}/g, contact.name),
      }))
    );

    if (emailsToSend.length === 0) {
      return { success: false, message: "No valid emails to send." };
    }

    // 3. Test mode: send only the first email in the list
    if (testMode) {
      const testEmail = emailsToSend[0];
      const { error } = await resend.emails.send({
        ...testEmail,
        subject: `[TEST] ${testEmail.subject}`,
      });

      if (error) throw new Error(error.message);

      return {
        success: true,
        message: `Test email sent to ${testEmail.to}`,
        sentCount: 1,
      };
    }

    // 4. Envío de campaña real (simplificado y más robusto)
    const { data, error } = await resend.batch.send(emailsToSend);

    if (error) {
      // Este error ocurre si la petición a Resend falla por completo (ej. API key inválida)
      console.error("Error en la API de Resend Batch:", error);
      throw error;
    }

    // Contamos cuántos correos se enviaron exitosamente dentro del lote
    const successfulSends =
      data.data.filter((response) => response.id).length ?? 0;

    if (successfulSends === 0) {
      return {
        success: false,
        message: "The campaign was processed, but no emails could be sent.",
      };
    }

    return {
      success: true,
      message: `Campaign sent. ${successfulSends} of ${emailsToSend.length} emails processed successfully.`,
      sentCount: successfulSends,
    };
  } catch (error: unknown) {
    console.error("Error sending newsletter campaign:", error);
    let message = "An unexpected server error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message: string }).message;
    }
    return {
      success: false,
      message,
    };
  }
};
