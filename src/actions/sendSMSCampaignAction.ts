"use server";

import { prisma } from "@/lib/prisma";
import twilio from "twilio";

// Inicializar cliente Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;

export interface SmsActionResponse {
  success: boolean;
  message: string;
  sentCount?: number;
  failedCount?: number;
}

export const sendSmsCampaignAction = async (
  messageContent: string,
  testMode = false
): Promise<SmsActionResponse> => {
  try {
    // 1. Obtener contactos con consentimiento y teléfonos
    const contactsWithPhone = await prisma.contact.findMany({
      where: {
        marketingConsent: true,
        phones: {
          some: {}, // Solo contactos con al menos un teléfono
        },
      },
      select: {
        name: true,
        phones: {
          select: {
            phone: true,
          },
        },
      },
    });

    if (contactsWithPhone.length === 0) {
      return {
        success: false,
        message: "No contacts with phone numbers and marketing consent found.",
      };
    }

    // 2. Preparar lista de mensajes personalizados
    const smsToSend = contactsWithPhone.flatMap((contact) =>
      contact.phones.map((phone) => ({
        to: phone.phone.startsWith("+") ? phone.phone : `+1${phone.phone}`,
        body: messageContent.replace(/{{name}}/g, contact.name),
        name: contact.name,
      }))
    );

    if (smsToSend.length === 0) {
      return { success: false, message: "No valid phone numbers to send." };
    }

    // 3. Crear registro de campaña
    const smsCampaign = await prisma.smsCampaign.create({
      data: {
        name: `SMS Campaign - ${new Date().toLocaleDateString()}`,
        sentAt: new Date(),
        smsSent: 0,
      },
    });

    // 4. Modo de prueba - enviar solo al primer número
    if (testMode) {
      const testSms = smsToSend[0];

      try {
        const message = await twilioClient.messages.create({
          body: `[TEST] ${testSms.body}`,
          from: TWILIO_PHONE_NUMBER,
          to: testSms.to,
        });

        console.log(`Test SMS sent: ${message.sid}`);

        await prisma.smsCampaign.update({
          where: { id: smsCampaign.id },
          data: { smsSent: 1 },
        });

        return {
          success: true,
          message: `Test SMS sent to ${testSms.to}`,
          sentCount: 1,
        };
      } catch (error: unknown) {
        console.error("Twilio error:", error);
        return {
          success: false,
          message: `Failed to send test SMS: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }

    // 5. Envío masivo con manejo de errores individual
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const sms of smsToSend) {
      try {
        const message = await twilioClient.messages.create({
          body: sms.body,
          from: TWILIO_PHONE_NUMBER,
          to: sms.to,
        });

        console.log(`SMS sent successfully: ${message.sid}`);
        successCount++;

        // Pequeña pausa entre mensajes para evitar límites de rate
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to send SMS to ${sms.to}:`, error.message);
          errors.push(`${sms.to}: ${error.message}`);
        } else {
          console.error(`Failed to send SMS to ${sms.to}:`, error);
          errors.push(`${sms.to}: Unknown error`);
        }
        failedCount++;
      }
    }

    // 6. Actualizar registro de campaña
    await prisma.smsCampaign.update({
      where: { id: smsCampaign.id },
      data: { smsSent: successCount },
    });

    // 8. Preparar mensaje de respuesta
    let responseMessage = `Campaign sent: ${successCount} successful`;
    if (failedCount > 0) {
      responseMessage += `, ${failedCount} failed`;
    }

    return {
      success: successCount > 0,
      message: responseMessage,
      sentCount: successCount,
      failedCount: failedCount > 0 ? failedCount : undefined,
    };
  } catch (error: unknown) {
    console.error("Error sending SMS campaign:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};
