"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { del } from "@vercel/blob";
import type { ActionResultSimple } from "@/types/common";

export async function deleteDeliverableAction(
  deliverableId: string
): Promise<ActionResultSimple> {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return {
      success: false,
      error: admin.error,
    };
  }

  const deliverable = await prisma.deliverable.findUnique({
    where: {
      id: deliverableId,
    },
  });

  if (!deliverable) {
    return {
      success: false,
      error: "Deliverable not found",
    };
  }

  try {
    if (deliverable.blobKey) {
      await del(deliverable.blobKey);
    } else if (deliverable.fileUrl) {
      await del(deliverable.fileUrl);
    }
  } catch (error) {
    console.error("Error deleting file from Vercel Blob:", error);
  }

  await prisma.deliverable.delete({
    where: {
      id: deliverableId,
    },
  });

  return {
    success: true,
  };
}
