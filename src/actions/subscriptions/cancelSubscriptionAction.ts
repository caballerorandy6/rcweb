"use server";

import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { requireAdmin } from "@/lib/authGuard";
import type { ActionResultSimple } from "@/types/common";

const InputSchema = z.uuid();

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

  const parsed = InputSchema.safeParse(subscriptionId);
  if (!parsed.success) {
    return { success: false, error: "Subscription not found" };
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: parsed.data },
      select: { stripeSubscriptionId: true, status: true },
    });

    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }
    if (subscription.status === "cancelled") {
      return { success: false, error: "This subscription is already cancelled" };
    }

    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    return { success: true };
  } catch (error) {
    // Stripe answers "No such subscription" for one that is already cancelled:
    // a second click from another tab, before the webhook updated our row
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === "resource_missing"
    ) {
      return {
        success: false,
        error: "Stripe already has this subscription as cancelled. Reload the page in a moment.",
      };
    }
    Sentry.captureException(error);
    return { success: false, error: "Failed to cancel the subscription. Try again or cancel it in Stripe." };
  }
}
