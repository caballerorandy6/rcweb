"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

export async function deleteMilestoneAction(
  id: string
): Promise<ActionResultSimple> {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return { success: false, error: auth.error || "Unauthorized" };
  }

  try {
    await prisma.milestone.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Error deleting milestone:", error);
    return { success: false, error: "Failed to delete milestone" };
  }
}
