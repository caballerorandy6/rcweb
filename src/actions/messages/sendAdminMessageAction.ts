"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { auth } from "@/lib/auth";
import { sendNewAdminMessageEmail } from "@/lib/email/senders";
import type { CreateMessageData } from "@/types/message";
import type { ActionResult } from "@/types/common";

export async function sendAdminMessageAction(
  data: CreateMessageData
): Promise<ActionResult<{ messageId: string }>> {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return {
      success: false,
      error: admin.error,
    };
  }

  const payment = await prisma.payment.findFirst({
    where: {
      id: data.paymentId,
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

  if (data.message.length > 5000) {
    return {
      success: false,
      error: "Message must be less than 5000 characters",
    };
  }

  if (data.attachments && data.attachments.length > 5) {
    return {
      success: false,
      error: "You can only attach up to 5 files",
    };
  }

  if (data.attachments && data.attachments.length > 0) {
    for (const attachment of data.attachments) {
      if (attachment.fileSize > 10 * 1024 * 1024) {
        return {
          success: false,
          error: "File size exceeds maximum limit of 10MB",
        };
      }
    }
  }

  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const adminEmail = session.user.email;
  const adminName = session.user.name;

  if (!adminEmail) {
    return {
      success: false,
      error: "Admin email not found",
    };
  }

  const message = await prisma.projectMessage.create({
    data: {
      paymentId: data.paymentId,
      message: data.message.trim(),
      senderType: "admin",
      senderEmail: adminEmail,
      senderName: adminName || "RC Web Solutions",
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
    include: {
      attachments: true,
    },
  });

  const client = await prisma.client.findFirst({
    where: {
      id: payment?.clientId || "",
    },
  });
  
  if (!client) {
    return {
      success: false,
      error: "Client not found",
    };
  }

  const clientEmail = client?.email || payment?.email || "";
  const clientName = client?.name || payment?.name || "";
  const projectCode = payment?.projectCode || "";
  const planName = payment?.planName || "";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";
  const clientPortalUrl = `${baseUrl}/project/${payment.accessToken}`;

  try {
    const result = await sendNewAdminMessageEmail({
      customerEmail: clientEmail,
      customerName: clientName,
      projectCode: projectCode,
      planName: planName,
      message: message.message,
      clientPortalUrl: clientPortalUrl,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to send email notification",
      };
    }
  } catch (error) {
    console.error("Error sending email notification:", error);
    return {
      success: false,
      error: "Failed to send email notification",
    };
  }

  return {
    success: true,
    data: {
      messageId: message.id,
    },
  };
}
