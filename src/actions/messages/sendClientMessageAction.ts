"use server";

import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/authGuard";
import { auth } from "@/lib/auth";
import { sendNewClientMessageEmail } from "@/lib/email/senders";
import type { CreateMessageData } from "@/types/message";
import type { ActionResult } from "@/types/common";

export async function sendClientMessageAction(
  data: CreateMessageData
): Promise<ActionResult<{ messageId: string }>> {
  const client = await requireClient();

  if (!client.authorized) {
    return {
      success: false,
      error: client.error,
    };
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: data.paymentId,
      clientId: client.userId,
    },
  });

  if (!payment) {
    return {
      success: false,
      error: "Payment not found",
    };
  }

  if (!data.message || data.message.trim().length === 0) {
    return {
      success: false,
      error: "Message is required and cannot be empty",
    };
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "CLIENT") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const message = await prisma.projectMessage.create({
    data: {
      paymentId: data.paymentId,
      message: data.message.trim(),
      senderType: "client",
      senderEmail: session.user.email || payment.email,
      senderName: session.user.name || payment.name,
      isRead: false,
      attachments: {
        create: data.attachments?.map((a) => ({
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileSize: a.fileSize,
          mimeType: a.mimeType,
          blobKey: a.blobKey,
        })),
      },
    },
  });

  const projectCode = payment.projectCode;
  const planName = payment.planName;
  const clientName = payment.name;
  const clientEmail = payment.email;
  const adminEmail = process.env.ADMIN_EMAIL;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";
  const adminPanelUrl = `${baseUrl}/admin/projects/${projectCode}`;

  if (!adminEmail) {
    return {
      success: false,
      error: "Admin email not found in environment variables",
    };
  }

  try {
    const result = await sendNewClientMessageEmail({
      adminEmail,
      clientEmail,
      clientName,
      projectCode,
      planName,
      message: message.message,
      adminPanelUrl,
    });

    if (!result.success) {
      console.error("Failed to send email notification:", result.error);
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
  }

  return {
    success: true,
    data: {
      messageId: message.id,
    },
  };
}
