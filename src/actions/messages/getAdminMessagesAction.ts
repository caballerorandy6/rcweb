"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { AdminMessage } from "@/types/message";
import type { ActionResult } from "@/types/common";

export async function getAdminMessagesAction(
  paymentId: string
): Promise<ActionResult<{ messages: AdminMessage[] }>> {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return { success: false, error: admin.error };
  }

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId },
  });

  if (!payment) {
    return { success: false, error: "Project not found" };
  }

  const messages = await prisma.projectMessage.findMany({
    where: { paymentId: payment.id },
    include: { attachments: true },
    orderBy: { createdAt: "asc" },
  });

  const unreadCount = messages.filter(
    (m) => m.senderType === "client" && !m.isRead
  ).length;

  const mappedMessages: AdminMessage[] = messages.map((m) => ({
    id: m.id,
    paymentId: m.paymentId,
    projectCode: payment.projectCode,
    planName: payment.planName,
    clientName: payment.name,
    clientEmail: payment.email,
    message: m.message,
    senderType: m.senderType as "client" | "admin",
    senderName: m.senderName,
    senderEmail: m.senderEmail,
    isRead: m.isRead,
    readAt: m.readAt?.toISOString() || null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
    attachments: m.attachments.map((att) => ({
      id: att.id,
      fileName: att.fileName,
      fileUrl: att.fileUrl,
      fileSize: att.fileSize,
      mimeType: att.mimeType,
    })),
    unreadCount,
  }));

  // Marcar mensajes del cliente como leídos
  const unreadIds = messages
    .filter((m) => m.senderType === "client" && !m.isRead)
    .map((m) => m.id);

  if (unreadIds.length > 0) {
    await prisma.projectMessage.updateMany({
      where: { id: { in: unreadIds } },
      data: { isRead: true, readAt: new Date() },
    });
  }

  return { success: true, data: { messages: mappedMessages } };
}
