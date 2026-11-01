"use server";

import { emailTranslator } from "@/lib/email/i18n";
import { z } from "zod";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { getQuoteDisplayStatus } from "@/lib/quote/quoteStatus";
import { createInitialPaymentCheckout } from "@/lib/project/initialPaymentCheckout";
import { getQuoteUrl } from "@/lib/projectUrl";
import type { ActionResult } from "@/types/common";

const TokenSchema = z.uuid();

/**
 * Public: the customer accepted the terms on /quote/[token] and wants to pay
 * the deposit. Creates the Checkout Session with the quote in its metadata;
 * the webhook creates the Project and marks the quote accepted once paid.
 */
export async function acceptQuoteAction(
  token: string
): Promise<ActionResult<{ sessionUrl: string }>> {
  // Messages and the success page follow the language of the quote page
  const [t, locale] = await Promise.all([getTranslations("Actions"), getLocale()]);
  try {
    if (!TokenSchema.safeParse(token).success) {
      return { success: false, error: t("quote.invalid") };
    }

    // Every call creates a Checkout Session: cap it per IP
    const rateCheck = await checkActionRateLimit(rateLimiters.api);
    if (!rateCheck.success) {
      return { success: false, error: t("tooManyRequests") };
    }

    const quote = await prisma.quote.findUnique({ where: { token } });
    if (!quote || quote.status === "draft") {
      return { success: false, error: t("quote.invalid") };
    }

    const status = getQuoteDisplayStatus(quote);
    if (status === "accepted") {
      return { success: false, error: t("quote.accepted") };
    }
    if (status === "cancelled") {
      return { success: false, error: t("quote.withdrawn") };
    }
    if (status === "expired") {
      return { success: false, error: t("quote.expired") };
    }

    const { sessionUrl } = await createInitialPaymentCheckout({
      planName: quote.planName,
      totalAmount: quote.totalAmount,
      customerName: quote.name,
      customerEmail: quote.email,
      quoteId: quote.id,
      description: emailTranslator(locale as Locale)("checkout.quoteDescription", { quoteNumber: quote.quoteNumber }),
      cancelUrl: getQuoteUrl(quote.token, locale as Locale),
      locale: locale as Locale,
    });

    return { success: true, data: { sessionUrl } };
  } catch (error) {
    console.error("❌ Error accepting quote:", error);
    return { success: false, error: t("quote.paymentFailed") };
  }
}
