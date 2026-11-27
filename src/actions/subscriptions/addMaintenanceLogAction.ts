"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import { workLogWindow } from "@/lib/maintenanceHours";
import { isMonthReported, SENT_MONTH_ERROR } from "@/lib/maintenanceReport/sentMonth";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({
  subscriptionId: z.uuid(),
  workedOn: z.iso.date(),
  // A single entry longer than a working day is a typo
  minutes: z.number().int().min(1).max(600),
  description: z.string().trim().min(1).max(1000),
});

/** Logs a piece of work done under a maintenance plan */
export async function addMaintenanceLogAction(
  input: z.input<typeof InputSchema>
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Check the date, the minutes (1–600) and the description" };
  }

  const { subscriptionId, workedOn, minutes, description } = parsed.data;
  // Only the two months the page lists: an older or future entry would be
  // counted in a report without ever being visible, or removable, here
  const { earliest, today } = workLogWindow(new Date());
  if (workedOn < earliest || workedOn > today) {
    return { success: false, error: `The date must be between ${earliest} and today` };
  }

  // @db.Date column: midnight UTC keeps the calendar day as typed
  const day = new Date(`${workedOn}T00:00:00.000Z`);
  try {
    // The page only shows the form for an active plan; a tab left open
    // from before a cancellation must not add hours to it
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      select: { status: true },
    });
    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    if (subscription.status !== "active") {
      return { success: false, error: "Work can only be logged on an active subscription" };
    }
    if (await isMonthReported(subscriptionId, day)) {
      return { success: false, error: SENT_MONTH_ERROR };
    }
    await prisma.maintenanceLog.create({
      data: {
        subscriptionId,
        workedOn: day,
        minutes,
        description,
      },
    });
    revalidatePath(`/subscriptions/${subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error adding a maintenance log entry:", error);
    return { success: false, error: "Failed to save the entry" };
  }
}
