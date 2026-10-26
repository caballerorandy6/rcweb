"use server";

import { requireAdmin } from "@/lib/authGuard";
import { notifyMilestoneCompleted } from "@/lib/milestone/notifyMilestoneCompleted";
import type { Milestone } from "@/types/milestone";
import type { ActionResult } from "@/types/common";

/** Sends (or re-sends) the "milestone completed" email to the customer. */
export async function notifyMilestoneAction(
  id: string
): Promise<ActionResult<{ milestone: Milestone }>> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
  }

  try {
    const result = await notifyMilestoneCompleted(id);
    if (!result.success) {
      return { success: false, error: result.error };
    }
    return { success: true, data: { milestone: result.milestone } };
  } catch (error) {
    console.error("Error notifying milestone:", error);
    return { success: false, error: "Failed to email the customer" };
  }
}
