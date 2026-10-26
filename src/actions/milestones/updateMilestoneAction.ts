"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { toMilestone } from "@/lib/milestone/toMilestone";
import type { Milestone, MilestoneStatus } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

/** Rename, describe or move a milestone back/forward. Completing goes through completeMilestoneAction. */
type UpdateMilestoneData = {
  title?: string;
  description?: string | null;
  status?: Exclude<MilestoneStatus, "completed">;
};

export async function updateMilestoneAction(
  id: string,
  updateData: UpdateMilestoneData
): Promise<ActionResult<{ milestone: Milestone }>> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
  }

  try {
    const data = await prisma.milestone.update({
      where: { id },
      // Leaving the completed state clears its timestamps
      data: updateData.status ? { ...updateData, completedAt: null, notifiedAt: null } : updateData,
    });

    return { success: true, data: { milestone: toMilestone(data) } };
  } catch (error) {
    console.error("Error updating milestone:", error);
    return { success: false, error: "Failed to update milestone" };
  }
}
