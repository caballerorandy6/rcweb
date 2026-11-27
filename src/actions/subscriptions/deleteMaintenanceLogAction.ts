"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { isMonthReported, SENT_MONTH_ERROR } from "@/lib/maintenanceReport/sentMonth";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({ id: z.uuid() });

/** Removes a work log entry typed by mistake */
export async function deleteMaintenanceLogAction(input: {
  id: string;
}): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid entry" };
  }

  try {
    const entry = await prisma.maintenanceLog.findUnique({
      where: { id: parsed.data.id },
      select: { subscriptionId: true, workedOn: true },
    });
    if (!entry) {
      // Already removed from another tab
      return { success: false, error: "This entry no longer exists" };
    }
    if (await isMonthReported(entry.subscriptionId, entry.workedOn)) {
      return { success: false, error: SENT_MONTH_ERROR };
    }
    // deleteMany: no error if another tab removed it in between
    await prisma.maintenanceLog.deleteMany({ where: { id: parsed.data.id } });
    revalidatePath(`/subscriptions/${entry.subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting a maintenance log entry:", error);
    return { success: false, error: "Failed to delete the entry" };
  }
}
