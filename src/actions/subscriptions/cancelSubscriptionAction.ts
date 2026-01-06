"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Cancels a subscription immediately via Stripe API
 * Updates local database after successful cancellation
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

    // Cancel in Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Update local database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: "cancelled",
        cancelledAt: new Date(),
      },
    });

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
