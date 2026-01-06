"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";

export interface SubscriptionData {
  id: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  email: string;
  name: string;
  planName: string;
  amount: number;
  currency: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export async function getAllSubscriptionsAction(): Promise<
  ActionResult<{ subscriptions: SubscriptionData[] }>
> {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: {
        subscriptions: subscriptions.map((sub) => ({
          id: sub.id,
          stripeSubscriptionId: sub.stripeSubscriptionId,
          stripeCustomerId: sub.stripeCustomerId,
          email: sub.email,
          name: sub.name,
          planName: sub.planName,
          amount: sub.amount,
          currency: sub.currency,
          status: sub.status,
          currentPeriodStart: sub.currentPeriodStart?.toISOString() || null,
          currentPeriodEnd: sub.currentPeriodEnd?.toISOString() || null,
          cancelledAt: sub.cancelledAt?.toISOString() || null,
        createdAt: sub.createdAt.toISOString(),
      })),
      },
    };
  } catch (error) {
    console.error("❌ Error fetching subscriptions:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch subscriptions",
    };
  }
}
