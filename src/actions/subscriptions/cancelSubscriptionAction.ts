"use server";

import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

/**
 * Cancels a subscription immediately via Stripe API.
 * The customer.subscription.deleted webhook marks the row cancelled and sends
 * the emails; writing it here would make the webhook skip them.
 */
export async function cancelSubscriptionAction(
  subscriptionId: string
): Promise<ActionResultSimple> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    return { success: false, error: authCheck.error };
  }

  try {
    // Find subscription in database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    return { success: true };
  } catch (error) {
    console.error("❌ Error cancelling subscription:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to cancel subscription",
    };
  }
}
