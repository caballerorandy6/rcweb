"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { Milestone } from "@/types/milestone";

type CreateMilestoneResult =
  | { success: true; milestone: Milestone }
  | { success: false; message: string };

export async function createMilestoneAction(
  paymentId: string,
  title: string,
  description: string | null,
  order: number
): Promise<CreateMilestoneResult> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const data = await prisma.milestone.create({
      data: { paymentId, title, description, order },
    });

    const milestone: Milestone = {
      id: data.id,
      paymentId: data.paymentId,
      title: data.title,
      description: data.description,
      order: data.order,
      status: data.status,
      dueDate: data.dueDate?.toISOString() ?? null,
      completedAt: data.completedAt?.toISOString() ?? null,
      createdAt: data.createdAt.toISOString(),
      updatedAt: data.updatedAt.toISOString(),
    };

    return { success: true, milestone };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { success: false, message: "Failed to create milestone" };
  }
}
