"use server";

import { z } from "zod";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { getQuoteDisplayStatus } from "@/lib/quote/quoteStatus";
import { splitDepositAmount } from "@/lib/project/charges";
import { isZelleAvailable } from "@/lib/company";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import { sendAdminZelleRequestNotification } from "@/lib/email/senders";
import { BillingAddressSchema, type BillingAddressInput } from "@/lib/tax/billingAddress";
import { calculateOffStripeTax } from "@/lib/tax/stripeTax";
import type { ActionResult } from "@/types/common";

const TokenSchema = z.uuid();

/**
 * Public: the customer accepted the terms on /quote/[token] and will pay the
 * deposit by Zelle instead of card. Records the acceptance (server time, IP,
 * user agent) on the quote, since there is no Checkout Session to carry it,
 * calculates the sales tax on the deposit from the billing address (Stripe
 * Tax, as Checkout would) and tells the admin. The project is created when
 * the admin confirms the money arrived (createProjectFromQuoteAction).
 */
export async function requestZellePaymentAction(
  token: string,
  address: BillingAddressInput
): Promise<ActionResult<{ depositAmount: number; taxAmount: number }>> {
  const [t, locale] = await Promise.all([getTranslations("Actions"), getLocale()]);
  try {
    if (!TokenSchema.safeParse(token).success) {
      return { success: false, error: t("quote.invalid") };
    }
    // Zelle only works between US bank accounts
    const parsedAddress = BillingAddressSchema.safeParse({ ...address, country: "US" });
    if (!parsedAddress.success) {
      return { success: false, error: t("quote.addressInvalid") };
    }
    if (!isZelleAvailable()) {
      return { success: false, error: t("quote.zelleUnavailable") };
    }

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

    const { deposit } = splitDepositAmount(quote.totalAmount);

    // A second request keeps the first calculation: the instructions the
    // customer already saw must not change
    let tax = quote.zelleTaxCalculationId
      ? { calculationId: quote.zelleTaxCalculationId, taxAmount: quote.zelleTaxAmount ?? 0 }
      : null;
    if (!tax) {
      const calculated = await calculateOffStripeTax({
        amount: deposit,
        kind: "deposit",
        address: parsedAddress.data,
      });
      if (!calculated.ok) {
        return { success: false, error: t("quote.addressInvalid") };
      }
      tax = calculated.tax;
    }

    const headerList = await headers();
    const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = headerList.get("user-agent")?.slice(0, 500) || "unknown";
    const now = new Date();

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        // The project takes its language from here when the admin creates it
        locale: locale as Locale,
        zelleRequestedAt: quote.zelleRequestedAt ?? now,
        // Keep the first acceptance: pressing the button twice is not a new contract
        termsAcceptedAt: quote.termsAcceptedAt ?? now,
        termsIp: quote.termsIp ?? ipAddress,
        termsUserAgent: quote.termsUserAgent ?? userAgent,
        ...(quote.zelleTaxCalculationId
          ? {}
          : {
              billingAddress: parsedAddress.data,
              zelleTaxCalculationId: tax.calculationId,
              zelleTaxAmount: tax.taxAmount,
            }),
      },
    });

    // First request only: the admin does not need a reminder per click
    if (!quote.zelleRequestedAt) {
      await sendAdminZelleRequestNotification(new Resend(process.env.RESEND_API_KEY!), {
        quoteNumber: quote.quoteNumber,
        customerName: quote.name,
        customerEmail: quote.email,
        planName: quote.planName,
        depositAmount: deposit,
        taxAmount: tax.taxAmount,
        adminQuoteUrl: `${SITE_BASE_URL}/quotes/${quote.id}`,
      });
    }

    return { success: true, data: { depositAmount: deposit, taxAmount: tax.taxAmount } };
  } catch (error) {
    console.error("❌ Error requesting Zelle payment:", error);
    return { success: false, error: t("quote.failed") };
  }
}
