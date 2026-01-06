"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

export async function createMilestoneAction(
  paymentId: string,
  title: string,
  description: string | null,
  order: number
): Promise<ActionResult<{ milestone: Milestone }>> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
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

    return { success: true, data: { milestone } };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { success: false, error: "Failed to create milestone" };
  }
}
