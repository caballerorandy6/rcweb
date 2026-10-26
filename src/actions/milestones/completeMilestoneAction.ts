"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { notifyMilestoneCompleted } from "@/lib/milestone/notifyMilestoneCompleted";
import { toMilestone } from "@/lib/milestone/toMilestone";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

export type CompleteMilestoneData = {
  milestone: Milestone;
  /** Null when the admin chose not to email the customer */
  notification: { sent: true } | { sent: false; error: string } | null;
};

/**
 * Marks a milestone completed and, unless told otherwise, emails the customer.
 * A failed email never undoes the completion: the admin gets the reason and a
 * "Notify customer" button to retry.
 */
export async function completeMilestoneAction(
  id: string,
  options: { notifyCustomer: boolean }
): Promise<ActionResult<CompleteMilestoneData>> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
  }

  try {
    const completed = await prisma.milestone.update({
      where: { id },
      data: { status: "completed", completedAt: new Date() },
    });

    if (!options.notifyCustomer) {
      return { success: true, data: { milestone: toMilestone(completed), notification: null } };
    }

    const notified = await notifyMilestoneCompleted(id);
    if (!notified.success) {
      return {
        success: true,
        data: {
          milestone: toMilestone(completed),
          notification: { sent: false, error: notified.error },
        },
      };
    }

    return { success: true, data: { milestone: notified.milestone, notification: { sent: true } } };
  } catch (error) {
    console.error("Error completing milestone:", error);
    return { success: false, error: "Failed to complete milestone" };
  }
}
