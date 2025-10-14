"use server";

import { prisma } from "@/lib/prisma";
import twilio from "twilio";

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

    // 4. Modo de prueba - enviar solo al primer número
    if (testMode) {
      const testSms = smsToSend[0];

      try {
        const messageParams: {
          body: string;
          to: string;
          messagingServiceSid?: string;
          from?: string;
        } = {
          body: `[TEST] ${testSms.body}`,
          to: testSms.to,
        };

        // Use Messaging Service if available (required for A2P 10DLC compliance)
        if (TWILIO_MESSAGING_SERVICE_SID) {
          messageParams.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
          console.log(`📡 Using Messaging Service: ${TWILIO_MESSAGING_SERVICE_SID}`);
        } else {
          messageParams.from = TWILIO_PHONE_NUMBER;
          console.log(`📱 Using direct number: ${TWILIO_PHONE_NUMBER}`);
        }

        const message = await twilioClient.messages.create(messageParams);

        console.log(`📱 Test SMS Details:`);
        console.log(`  - SID: ${message.sid}`);
        console.log(`  - To: ${testSms.to}`);
        console.log(`  - Status: ${message.status}`);
        console.log(`  - Error Code: ${message.errorCode || "None"}`);
        console.log(`  - Error Message: ${message.errorMessage || "None"}`);

        await prisma.smsCampaign.update({
          where: { id: smsCampaign.id },
          data: { smsSent: 1 },
        });

        // Check if message has delivery issues
        if (message.status === "failed" || message.status === "undelivered") {
          return {
            success: false,
            message: `SMS was not delivered to ${testSms.to}. Status: ${message.status}. ${message.errorMessage ? `Error: ${message.errorMessage}` : "Check Twilio logs for details."}`,
            sentCount: 0,
          };
        }

        return {
          success: true,
          message: `Test SMS sent to ${testSms.to} (SID: ${message.sid}, Status: ${message.status}). Check Twilio logs if not received.`,
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

        if (errorCode === 21211) {
          return {
            success: false,
            message: `Invalid phone number format: ${testSms.to}. Please use E.164 format (+1XXXXXXXXXX)`,
          };
        }

        if (errorCode === 21606) {
          return {
            success: false,
            message: `The number ${testSms.to} is not capable of receiving SMS messages.`,
          };
        }

        if (errorCode === 30034) {
          return {
            success: false,
            message: `Message blocked by carrier to ${testSms.to}. This number may have blocked your Twilio number, opted out, or the carrier is filtering messages as spam. Check Twilio logs for details.`,
          };
        }

        if (errorCode === 30007) {
          return {
            success: false,
            message: `Message filtered by carrier to ${testSms.to}. The carrier detected the message as spam or violated their policies.`,
          };
        }

        return {
          success: false,
          message: `Failed to send test SMS: ${errorMessage} (Code: ${errorCode})`,
        };
      }
    }

    // 5. Envío masivo con manejo de errores individual
    let successCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    console.log(`📤 Starting SMS campaign: ${smsToSend.length} messages to send`);

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

        console.log(`📱 SMS to ${sms.to}:`);
        console.log(`  - SID: ${message.sid}`);
        console.log(`  - Status: ${message.status}`);
        console.log(`  - Error Code: ${message.errorCode || "None"}`);

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

    console.log(`📊 Campaign Results: ${successCount} sent, ${failedCount} failed`);

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
