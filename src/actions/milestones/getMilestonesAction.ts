"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { Milestone } from "@/types/milestone";

type GetMilestonesResult =
  | { success: true; milestones: Milestone[] }
  | { success: false; message: string };

export async function getMilestonesAction(
  paymentId: string
): Promise<GetMilestonesResult> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
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

    return { success: true, milestones };
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return { success: false, message: "Failed to fetch milestones" };
  }
}
