"use server";

import { randomBytes } from "node:crypto";
import { getLocale, getTranslations } from "next-intl/server";
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { sendSubscriptionPortalLink } from "@/lib/email/senders";
import type { ActionResultSimple } from "@/types/common";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { ManageSubscriptionSchema } from "@/lib/zod";
import { portalSubscriptions } from "@/lib/subscriptionPortal";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * The emailed link stays valid this long; the email copy promises 24 hours.
 * Not exported: a "use server" file may only export async functions.
 */
const PORTAL_LINK_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Emails a magic link to /manage-subscription/[token]. That page creates the
 * Stripe Customer Portal session at click time, because a portal session
 * URL itself expires five minutes after creation.
 *
 * Someone who subscribed twice with the same email gets one link per plan
 * that is still alive, in a single email (see portalSubscriptions).
 */
export async function sendPortalLinkAction(
  email: string
): Promise<ActionResultSimple> {
  const [t, locale] = await Promise.all([getTranslations("Actions"), getLocale()]);
  try {
    const rateCheck = await checkActionRateLimit(rateLimiters.contact);
    if (!rateCheck.success) {
      return { success: false, error: t("tooManyRequests") };
    }

    const parsed = ManageSubscriptionSchema.safeParse({ email });
    if (!parsed.success) {
      return { success: false, error: t("portal.invalidEmail") };
    }

    const subscriptions = portalSubscriptions(
      await prisma.subscription.findMany({
        where: { email: parsed.data.email.toLowerCase() },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          email: true,
          name: true,
          planName: true,
          status: true,
          stripeCustomerId: true,
          createdAt: true,
        },
      })
    );

    // Same answer whether or not the email exists, to avoid enumeration.
    const [latest] = subscriptions;
    if (!latest) {
      return { success: true };
    }

    const expiresAt = new Date(Date.now() + PORTAL_LINK_TTL_MS);
    const links = await Promise.all(
      subscriptions.map(async (subscription) => {
        const token = randomBytes(32).toString("base64url");
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { portalToken: token, portalTokenExpiresAt: expiresAt },
        });
        return {
          planName: subscription.planName,
          startedAt: subscription.createdAt,
          // The emailed link keeps the language the customer asked in
          portalUrl: `${process.env.NEXT_PUBLIC_BASE_URL}${localizePathname("/manage-subscription/[token]", locale as Locale, { token })}`,
        };
      })
    );

    const emailResult = await sendSubscriptionPortalLink(resend, {
      customerEmail: latest.email,
      customerName: latest.name,
      // The email keeps the language the customer asked in
      locale,
      links,
    });

    if (!emailResult.success) {
      console.error("Failed to send portal link email:", emailResult.error);
      return { success: false, error: t("portal.emailFailed") };
    }

    return { success: true };
  } catch (error) {
    console.error("❌ Error sending portal link:", error);
    return { success: false, error: t("portal.failed") };
  }
}
