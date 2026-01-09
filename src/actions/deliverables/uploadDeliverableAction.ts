"use server";

import { requireAdmin } from "@/lib/authGuard";
import { auth } from "@/lib/auth";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import type { DeliverableType } from "@/types/deliverable";

export async function uploadDeliverableAction(
  formData: FormData
): Promise<ActionResult<{ deliverableId: string; fileUrl: string }>> {
  const admin = await requireAdmin();

  if (!admin.authorized) {
    return {
      success: false,
      error: admin.error,
    };
  }

  const paymentId = formData.get("paymentId") as string;
  const name = formData.get("name") as string;
  const file = formData.get("file") as File | null;
  const description = formData.get("description") as string | null;
  const type = formData.get("type") as string | null;

  if (!paymentId || typeof paymentId !== "string" || paymentId.trim() === "") {
    return {
      success: false,
      error: "Payment ID is required",
    };
  }

  if (!name || typeof name !== "string" || name.trim() === "") {
    return {
      success: false,
      error: "Name is required",
    };
  }

  if (!file || !(file instanceof File)) {
    return {
      success: false,
      error: "File is required",
    };
  }

  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "File size exceeds maximum limit of 100MB",
    };
  }

  const validTypes: DeliverableType[] = [
    "source_code",
    "documentation",
    "assets",
    "credentials",
    "other",
  ];
  if (!type || !validTypes.includes(type as DeliverableType)) {
    return {
      success: false,
      error: `Invalid type. Must be one of: ${validTypes.join(", ")}`,
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

  const payment = await prisma.payment.findFirst({
    where: {
      id: paymentId,
    },
  });

  if (!payment) {
    return {
      success: false,
      error: "Payment not found",
    };
  }

  try {
    const fileName = file.name;
    const filePath = `deliverables/${paymentId}/${fileName}`;
    const fileBuffer = await file.arrayBuffer();

    const blob = await put(filePath, fileBuffer, {
      access: "public",
      contentType: file.type || undefined,
      addRandomSuffix: true,
    });

    const deliverable = await prisma.deliverable.create({
      data: {
        paymentId: paymentId,
        name: name.trim(),
        description: description?.trim() || null,
        type: type as DeliverableType,
        fileUrl: blob.url,
        blobKey: blob.pathname,
        fileSize: file.size,
        mimeType: file.type || null,
        uploadedBy: adminEmail,
      },
    });

    return {
      success: true,
      data: {
        deliverableId: deliverable.id,
        fileUrl: blob.url,
      },
    };
  } catch (error) {
    console.error("Error uploading deliverable:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to upload deliverable",
    };
  }
}
