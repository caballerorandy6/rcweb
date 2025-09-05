// // actions/sendNewsletterAction.ts
// "use server";

// import { prisma } from "@/libs/prisma";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY!);

// export interface NewsletterActionResponse {
//   success: boolean;
//   message: string;
//   sentCount?: number;
// }

// export const sendNewsletterAction = async (
//   subject: string,
//   htmlContent: string,
//   testMode = false
// ): Promise<NewsletterActionResponse> => {
//   try {
//     // 1. Obtener contactos con consentimiento y sus emails
//     const contacts = await prisma.contact.findMany({
//       where: {
//         marketingConsent: true,
//       },
//       include: {
//         emails: true,
//       },
//     });

//     // 2. Filtrar contactos que tienen al menos un email
//     const contactsWithEmail = contacts.filter((c) => c.emails.length > 0);

//     if (contactsWithEmail.length === 0) {
//       return {
//         success: false,
//         message: "No valid contacts were found.",
//       };
//     }

//     // 3. Modo de prueba - enviar solo al primer contacto
//     if (testMode) {
//       const testContact = contactsWithEmail[0];
//       const testEmail = testContact.emails[0].email;
//       const personalizedHtml = htmlContent.replace(
//         /{{name}}/g,
//         testContact.name
//       );

//       const { error } = await resend.emails.send({
//         from: "RC Web <no-reply@rcweb.dev>",
//         to: testEmail,
//         subject: `[TEST] ${subject}`,
//         html: personalizedHtml,
//       });

//       if (error) {
//         throw new Error(error.message);
//       }

//       return {
//         success: true,
//         message: `Test email sent to ${testEmail}`,
//         sentCount: 1,
//       };
//     }

//     // 4. Preparar emails personalizados para envío masivo
//     const emailsToSend = contactsWithEmail.map((contact) => ({
//       from: "RC Web <no-reply@rcweb.dev>",
//       to: contact.emails[0].email,
//       subject: subject,
//       html: htmlContent.replace(/{{name}}/g, contact.name),
//     }));

//     // 5. Enviar en lotes (Resend permite hasta 100 emails por batch)
//     const batchSize = 100;
//     let totalSent = 0;
//     const errors = [];

//     for (let i = 0; i < emailsToSend.length; i += batchSize) {
//       const batch = emailsToSend.slice(i, i + batchSize);

//       try {
//         // Si es un solo email, usar send normal
//         if (batch.length === 1) {
//           const { error } = await resend.emails.send(batch[0]);
//           if (error) throw error;
//           totalSent++;
//         } else {
//           // Para múltiples emails, usar batch
//           const { error } = await resend.batch.send(batch);
//           if (error) throw error;
//           totalSent += batch.length;
//         }

//         // Esperar entre lotes para evitar rate limits
//         if (i + batchSize < emailsToSend.length) {
//           await new Promise((resolve) => setTimeout(resolve, 1000));
//         }
//       } catch (batchError: unknown) {
//         console.error(`Error in batch ${i / batchSize + 1}:`, batchError);
//         if (
//           batchError &&
//           typeof batchError === "object" &&
//           "message" in batchError
//         ) {
//           errors.push((batchError as { message: string }).message);
//         } else {
//           errors.push(String(batchError));
//         }
//       }
//     }

//     // 6. Retornar resultado
//     if (totalSent === 0) {
//       return {
//         success: false,
//         message: "No emails could be sent. Check your Resend settings.",
//       };
//     }

//     return {
//       success: true,
//       message: `Campaign successfully sent to ${totalSent} of ${emailsToSend.length} contacts.`,
//       sentCount: totalSent,
//     };
//   } catch (error: unknown) {
//     console.error("Error sending newsletter:", error);
//     let message = "An error occurred while sending the campaign.";
//     if (error && typeof error === "object" && "message" in error) {
//       message = (error as { message: string }).message;
//     }
//     return {
//       success: false,
//       message,
//     };
//   }
// };

"use server";

// actions/sendNewsletterAction.ts
"use server";

import { prisma } from "@/libs/prisma";
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
