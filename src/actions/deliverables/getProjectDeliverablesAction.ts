"use server";

import { prisma } from "@/lib/prisma";
import { requireClient } from "@/lib/authGuard";
import type { ClientDeliverable } from "@/types/deliverable";
import type { ActionResult } from "@/types/common";

export async function getProjectDeliverablesAction(
  projectCode: string
): Promise<ActionResult<{ deliverables: ClientDeliverable[] }>> {
  const client = await requireClient();

  if (!client.authorized) {
    return {
      success: false,
      error: client.error,
    };
  }

  const clientId = client.userId;

  const payment = await prisma.payment.findFirst({
    where: {
      clientId: clientId,
      projectCode: projectCode,
    },
    select: {
      id: true,
      projectCode: true,
      planName: true,
    },
  });

  if (!payment) {
    return {
      success: false,
      error: "Payment not found",
    };
  }

  const deliverables = await prisma.deliverable.findMany({
    where: {
      paymentId: payment.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // 4. Mapear y retornar
  const mappedDeliverables = deliverables.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    type: d.type,
    fileUrl: d.fileUrl,
    fileSize: d.fileSize,
    mimeType: d.mimeType,
    createdAt: d.createdAt.toISOString(),
    updatedAt: d.updatedAt.toISOString(),
    projectCode: payment.projectCode,
    planName: payment.planName,
  }));

  return {
    success: true,
    data: {
      deliverables: mappedDeliverables,
    },
  };
}
