"use server";

import twilio from "twilio";

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

export interface SmsDeliveryStats {
  total: number;
  delivered: number;
  sent: number;
  failed: number;
  undelivered: number;
  queued: number;
  accepted: number;
  sending: number;
  receiving: number;
  received: number;
  canceled: number;
  deliveryRate: number;
  failedMessages: Array<{
    to: string;
    status: string;
    errorCode: number | null;
    errorMessage: string | null;
    dateSent: string;
    sid: string;
  }>;
  errorCodes: Record<number, number>; // errorCode -> count
}

export async function getSmsDeliveryStatsAction(
  hoursAgo: number = 24
): Promise<{ success: boolean; data?: SmsDeliveryStats; message?: string }> {
  try {
    // Calcular fecha de inicio
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hoursAgo);

    // Obtener mensajes de Twilio
    const messages = await twilioClient.messages.list({
      dateSentAfter: startDate,
      limit: 2000, // Máximo permitido por Twilio
    });

    // Calcular estadísticas
    const stats: SmsDeliveryStats = {
      total: messages.length,
      delivered: 0,
      sent: 0,
      failed: 0,
      undelivered: 0,
      queued: 0,
      accepted: 0,
      sending: 0,
      receiving: 0,
      received: 0,
      canceled: 0,
      deliveryRate: 0,
      failedMessages: [],
      errorCodes: {},
    };

    messages.forEach((msg) => {
      switch (msg.status) {
        case "delivered":
          stats.delivered++;
          break;
        case "sent":
          stats.sent++;
          break;
        case "queued":
          stats.queued++;
          break;
        case "accepted":
          stats.accepted++;
          break;
        case "sending":
          stats.sending++;
          break;
        case "receiving":
          stats.receiving++;
          break;
        case "received":
          stats.received++;
          break;
        case "canceled":
          stats.canceled++;
          break;
        case "failed":
          stats.failed++;
          stats.failedMessages.push({
            to: msg.to,
            status: msg.status,
            errorCode: msg.errorCode || null,
            errorMessage: msg.errorMessage || null,
            dateSent: msg.dateSent?.toISOString() || "",
            sid: msg.sid,
          });
          // Track error codes
          if (msg.errorCode) {
            stats.errorCodes[msg.errorCode] =
              (stats.errorCodes[msg.errorCode] || 0) + 1;
          }
          break;
        case "undelivered":
          stats.undelivered++;
          stats.failedMessages.push({
            to: msg.to,
            status: msg.status,
            errorCode: msg.errorCode || null,
            errorMessage: msg.errorMessage || null,
            dateSent: msg.dateSent?.toISOString() || "",
            sid: msg.sid,
          });
          // Track error codes
          if (msg.errorCode) {
            stats.errorCodes[msg.errorCode] =
              (stats.errorCodes[msg.errorCode] || 0) + 1;
          }
          break;
      }
    });

    // Calcular tasa de entrega
    if (stats.total > 0) {
      stats.deliveryRate = (stats.delivered / stats.total) * 100;
    }

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching SMS delivery stats:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      message: errorObj?.message || "Failed to fetch delivery stats",
    };
  }
}
