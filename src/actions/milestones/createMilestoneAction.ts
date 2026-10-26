"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { toMilestone } from "@/lib/milestone/toMilestone";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

export async function createMilestoneAction(
  projectId: string,
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
      data: { projectId, title, description, order },
    });

    return { success: true, data: { milestone: toMilestone(data) } };
  } catch (error) {
    console.error("Error creating milestone:", error);
    return { success: false, error: "Failed to create milestone" };
  }
}
