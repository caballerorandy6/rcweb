"use server";

import { randomBytes } from "node:crypto";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionPortalLink } from "@/lib/email/senders";
import type { ActionResultSimple } from "@/types/common";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { ManageSubscriptionSchema } from "@/lib/zod";

const resend = new Resend(process.env.RESEND_API_KEY);

/** The emailed link stays valid this long; the email copy promises 24 hours. */
export const PORTAL_LINK_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Emails a magic link to /manage-subscription/[token]. That page creates the
 * Stripe Customer Portal session at click time, because a portal session
 * URL itself expires five minutes after creation.
 */
export async function sendPortalLinkAction(
  email: string
): Promise<ActionResultSimple> {
  try {
    const rateCheck = await checkActionRateLimit(rateLimiters.contact);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error! };
    }

    const parsed = ManageSubscriptionSchema.safeParse({ email });
    if (!parsed.success) {
      return { success: false, error: "Please enter a valid email address" };
    }

    const subscription = await prisma.subscription.findFirst({
      where: { email: parsed.data.email.toLowerCase() },
      orderBy: { createdAt: "desc" },
      select: { id: true, email: true, name: true, planName: true },
    });

    // Same answer whether or not the email exists, to avoid enumeration.
    if (!subscription) {
      return { success: true };
    }

    const token = randomBytes(32).toString("base64url");
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        portalToken: token,
        portalTokenExpiresAt: new Date(Date.now() + PORTAL_LINK_TTL_MS),
      },
    });

    const emailResult = await sendSubscriptionPortalLink(resend, {
      customerEmail: subscription.email,
      customerName: subscription.name,
      portalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/manage-subscription/${token}`,
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
