"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { auth } from "@/lib/auth";
import type { CreateDeliverableData } from "@/types/deliverable";
import type { ActionResult } from "@/types/common";

export async function createDeliverableAction(
  data: CreateDeliverableData
): Promise<ActionResult<{ deliverableId: string }>> {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return {
      success: false,
      error: admin.error,
    };
  }

  const payment = await prisma.payment.findUnique({
    where: { id: data.paymentId },
  });

  if (!payment) {
    return {
      success: false,
      error: "Payment not found",
    };
  }

  const session = await auth();
  const adminEmail = session?.user?.email || null;

  if (!adminEmail) {
    return {
      success: false,
      error: "Admin email not found",
    };
  }

  const deliverable = await prisma.deliverable.create({
    data: {
      paymentId: data.paymentId,
      name: data.name,
      description: data.description,
      type: data.type,
      fileUrl: data.fileUrl,
      blobKey: data.blobKey,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      uploadedBy: adminEmail,
    },
  });

  return {
    success: true,
    data: {
      deliverableId: deliverable.id,
    },
  };
}
