"use server";

import Stripe from "stripe";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionPortalLink } from "@/lib/email/senders";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendPortalLinkResult {
  success: boolean;
  error?: string;
}

/**
 * Sends a magic link email to the customer to access their Stripe Customer Portal
 * This allows customers to manage their subscription without needing an account
 */
export async function sendPortalLinkAction(
  email: string
): Promise<SendPortalLinkResult> {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" };
    }

    // Find subscription by email
    const subscription = await prisma.subscription.findFirst({
      where: { email: email.toLowerCase() },
      orderBy: { createdAt: "desc" },
    });

    if (!subscription) {
      // For security, don't reveal if email exists or not
      // But still return success to prevent email enumeration
      return { success: true };
    }

    // Create customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    });

    // Send email with portal link
    const emailResult = await sendSubscriptionPortalLink(resend, {
      customerEmail: subscription.email,
      customerName: subscription.name,
      portalUrl: session.url,
      planName: subscription.planName,
    });

    if (!emailResult.success) {
      console.error("Failed to send portal link email:", emailResult.error);
      return { success: false, error: "Failed to send email. Please try again." };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error sending portal link:", error);
    return {
      success: false,
      error: "An error occurred. Please try again later.",
    };
  }
}
