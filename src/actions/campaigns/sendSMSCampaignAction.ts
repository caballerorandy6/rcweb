"use server";

import { prisma } from "@/lib/prisma";
import twilio from "twilio";
import { trackSMSCampaignSent } from "@/lib/analytics";

// Inicializar cliente Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER!;
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID;

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
        body: messageContent,
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

    // 4. Modo de prueba - enviar a números específicos de prueba
    if (testMode) {
      // Números de prueba hardcodeados
      const TEST_NUMBERS = [
        "+18325465983",  // Número de prueba 1
        "+13464417386",  // Yani Cruz
      ];

      let successCount = 0;
      let failedCount = 0;
      const sentNumbers: string[] = [];
      const errors: string[] = [];

      for (const testNumber of TEST_NUMBERS) {
        try {
          const messageParams: {
            body: string;
            to: string;
            messagingServiceSid?: string;
            from?: string;
          } = {
            body: `[TEST] ${messageContent}`,
            to: testNumber,
          };

          // Use Messaging Service if available (required for A2P 10DLC compliance)
          if (TWILIO_MESSAGING_SERVICE_SID) {
            messageParams.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
          } else {
            messageParams.from = TWILIO_PHONE_NUMBER;
          }

          const message = await twilioClient.messages.create(messageParams);

          // Check if message has delivery issues
          if (message.status === "failed" || message.status === "undelivered") {
            errors.push(`${testNumber}: ${message.errorMessage || "Failed to deliver"}`);
            failedCount++;
          } else {
            sentNumbers.push(`${testNumber} (${message.sid})`);
            successCount++;
          }

          // Pequeña pausa entre mensajes
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error("Twilio error:", error);
          const twilioError = error as { message?: string; code?: number };
          const errorMessage = twilioError?.message || "Unknown error";
          const errorCode = twilioError?.code || 0;

          // Handle Twilio errors
          if (errorCode === 21608) {
            errors.push(`${testNumber}: Unverified number (trial account)`);
          } else if (errorCode === 21211) {
            errors.push(`${testNumber}: Invalid phone format`);
          } else if (errorCode === 21606) {
            errors.push(`${testNumber}: Not SMS capable`);
          } else if (errorCode === 30034) {
            errors.push(`${testNumber}: Blocked by carrier`);
          } else {
            errors.push(`${testNumber}: ${errorMessage}`);
          }
          failedCount++;
        }
      }

      // Update campaign
      await prisma.smsCampaign.update({
        where: { id: smsCampaign.id },
        data: { smsSent: successCount },
      });

      if (successCount === 0) {
        return {
          success: false,
          message: `Test SMS failed for all numbers. Errors: ${errors.join(", ")}`,
          sentCount: 0,
          failedCount,
        };
      }

      return {
        success: true,
        message: `Test SMS sent to ${successCount} number(s): ${sentNumbers.join(", ")}${failedCount > 0 ? `. Failed: ${errors.join(", ")}` : ""}`,
        sentCount: successCount,
        failedCount: failedCount > 0 ? failedCount : undefined,
      };
    }

    // 5. Envío masivo con manejo de errores individual
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

        for (const sms of smsToSend) {
      try {
        const messageParams: {
          body: string;
          to: string;
          messagingServiceSid?: string;
          from?: string;
        } = {
          body: sms.body,
          to: sms.to,
        };

        // Use Messaging Service if available (required for A2P 10DLC compliance)
        if (TWILIO_MESSAGING_SERVICE_SID) {
          messageParams.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
        } else {
          messageParams.from = TWILIO_PHONE_NUMBER;
        }

        const message = await twilioClient.messages.create(messageParams);

                                        // Check initial status
        if (message.status === "failed" || message.status === "undelivered") {
          console.error(`  ⚠️ SMS not delivered: ${message.errorMessage || "Unknown reason"}`);
          errors.push(`${sms.to}: ${message.errorMessage || "Failed to deliver"}`);
          failedCount++;
        } else {
          successCount++;
        }

        // Pequeña pausa entre mensajes para evitar límites de rate
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        const twilioError = error as { message?: string; code?: number };
        const errorMessage = twilioError?.message || "Unknown error";
        const errorCode = twilioError?.code || 0;

        console.error(`❌ Failed to send SMS to ${sms.to}:`);
        console.error(`  - Error: ${errorMessage}`);
        console.error(`  - Code: ${errorCode}`);

        // Provide specific error messages for common Twilio errors
        if (errorCode === 21608) {
          errors.push(`${sms.to}: Unverified number (upgrade Twilio account required)`);
        } else if (errorCode === 21211) {
          errors.push(`${sms.to}: Invalid phone number format`);
        } else if (errorCode === 21606) {
          errors.push(`${sms.to}: Phone number is not SMS capable`);
        } else if (errorCode === 21614) {
          errors.push(`${sms.to}: Invalid 'To' phone number`);
        } else if (errorCode === 21408) {
          errors.push(`${sms.to}: Permission to send SMS has not been enabled`);
        } else if (errorCode === 30034) {
          errors.push(`${sms.to}: Message blocked by carrier (number may have blocked you or opted out)`);
        } else if (errorCode === 30007) {
          errors.push(`${sms.to}: Message filtered as spam by carrier`);
        } else if (errorCode === 30006) {
          errors.push(`${sms.to}: Landline or unreachable carrier`);
        } else {
          errors.push(`${sms.to}: ${errorMessage} (Code: ${errorCode})`);
        }

        failedCount++;
      }
    }

        // 6. Actualizar registro de campaña
    await prisma.smsCampaign.update({
      where: { id: smsCampaign.id },
      data: { smsSent: successCount },
    });

    // Track SMS campaign sent in Google Analytics
    if (successCount > 0) {
      trackSMSCampaignSent(successCount);
    }

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
