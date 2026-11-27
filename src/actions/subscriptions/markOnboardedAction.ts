"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/authGuard";
import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.object({ subscriptionId: z.uuid() });

/**
 * Records that monitoring, backups and access are in place for a maintenance
 * customer, which takes the subscription out of "Needs attention". Only the
 * first call writes: the date is when onboarding was done, not the last click.
 * Only an active plan is onboarded, as the page says.
 */
export async function markOnboardedAction(input: {
  subscriptionId: string;
}): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  const parsed = InputSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid subscription" };
  }

  try {
    const { count } = await prisma.subscription.updateMany({
      where: { id: parsed.data.subscriptionId, onboardingAt: null, status: "active" },
      data: { onboardingAt: new Date() },
    });
    if (count === 0) {
      const subscription = await prisma.subscription.findUnique({
        where: { id: parsed.data.subscriptionId },
        select: { onboardingAt: true },
      });
      if (!subscription) {
        return { success: false, error: "Subscription not found" };
      }
      // Already done from another tab: nothing to change, nothing to report
      if (!subscription.onboardingAt) {
        return { success: false, error: "Only an active subscription can be onboarded" };
      }
    }
    revalidatePath(`/subscriptions/${parsed.data.subscriptionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error marking the subscription onboarded:", error);
    return { success: false, error: "Failed to mark the subscription onboarded" };
  }
}
