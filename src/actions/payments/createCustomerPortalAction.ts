"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export interface CustomerPortalResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Creates a Stripe Customer Portal session for subscription management
 * Allows customers to update payment method, cancel subscription, view invoices
 */
export async function createCustomerPortalAction(
  email: string
): Promise<CustomerPortalResponse> {
  try {
    // Find subscription by email
    const subscription = await prisma.subscription.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      return {
        success: false,
        error: "No subscription found for this email",
      };
    }

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    return {
      success: true,
      url: session.url,
    };
  } catch (error) {
    console.error("❌ Error creating customer portal session:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create portal session",
    };
  }
}
