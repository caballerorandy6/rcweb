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

/**
 * Check if current time is within allowed hours for sending SMS
 * Allowed: 9 AM - 8 PM local time
 */
function isWithinAllowedHours(): { allowed: boolean; message?: string } {
  const now = new Date();
  const hour = now.getHours();

  // Allow sending between 9 AM and 8 PM
  if (hour < 9 || hour >= 20) {
    return {
      allowed: false,
      message: `SMS campaigns can only be sent between 9:00 AM and 8:00 PM. Current time: ${now.toLocaleTimeString()}`,
    };
  }

  return { allowed: true };
}

export const sendSmsCampaignAction = async (
  messageContent: string,
  testMode = false,
  skipTimeValidation = false // For admin override or scheduled campaigns
): Promise<SmsActionResponse> => {
  try {
    // 1. Check if within allowed hours (skip for test mode or if explicitly allowed)
    if (!testMode && !skipTimeValidation) {
      const timeCheck = isWithinAllowedHours();
      if (!timeCheck.allowed) {
        return {
          success: false,
          message: timeCheck.message!,
        };
      }
    }

    // 2. Obtener contactos con consentimiento y teléfonos
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

    // 2. Preparar lista de mensajes
    const smsToSend = contactsWithPhone.flatMap((contact) =>
      contact.phones.map((phone) => ({
        to: phone.phone.startsWith("+") ? phone.phone : `+1${phone.phone}`,
        body: messageContent.replace(/{{name}}/g, contact.name || "Dear customer"),
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
      } catch (error) {
        console.error("Twilio error:", error);
        const twilioError = error as { message?: string; code?: number };
        const errorMessage = twilioError?.message || "Unknown error";
        const errorCode = twilioError?.code || 0;

        // Handle Twilio trial account restrictions
        if (errorCode === 21608) {
          return {
            success: false,
            message: "Cannot send SMS to unverified numbers with trial account. Please upgrade your Twilio account or verify the recipient number.",
          };
        }

        return {
          success: false,
          message: `Failed to send test SMS: ${errorMessage}`,
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
      } catch (error) {
        const twilioError = error as { message?: string; code?: number };
        const errorMessage = twilioError?.message || "Unknown error";
        const errorCode = twilioError?.code || 0;

        console.error(`Failed to send SMS to ${sms.to}:`, errorMessage);

        // Provide specific error messages for common Twilio errors
        if (errorCode === 21608) {
          errors.push(`${sms.to}: Unverified number (upgrade Twilio account required)`);
        } else if (errorCode === 21211) {
          errors.push(`${sms.to}: Invalid phone number`);
        } else if (errorCode === 21606) {
          errors.push(`${sms.to}: Phone number is not SMS capable`);
        } else {
          errors.push(`${sms.to}: ${errorMessage}`);
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
  } catch (error) {
    console.error("Error sending SMS campaign:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      message: errorObj?.message || "An unexpected error occurred",
    };
  }
};
