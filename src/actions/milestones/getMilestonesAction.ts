"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

export async function getMilestonesAction(
  paymentId: string
): Promise<ActionResult<{ milestones: Milestone[] }>> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
  }

  try {
    const data = await prisma.milestone.findMany({
      where: { paymentId },
      orderBy: { order: "asc" },
    });

    const milestones: Milestone[] = data.map((m) => ({
      id: m.id,
      paymentId: m.paymentId,
      title: m.title,
      description: m.description,
      order: m.order,
      status: m.status,
      dueDate: m.dueDate?.toISOString() ?? null,
      completedAt: m.completedAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));

    return { success: true, data: { milestones } };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return { success: false, error: "Failed to fetch milestones" };
  }
}
