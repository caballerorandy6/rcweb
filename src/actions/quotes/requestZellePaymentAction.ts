"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";
import { getQuoteDisplayStatus } from "@/lib/quote/quoteStatus";
import { splitDepositAmount } from "@/lib/project/charges";
import { isZelleAvailable } from "@/lib/company";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import { sendAdminZelleRequestNotification } from "@/lib/email/senders";
import type { ActionResult } from "@/types/common";

const TokenSchema = z.uuid();

/**
 * Public: the customer accepted the terms on /quote/[token] and will pay the
 * deposit by Zelle instead of card. Records the acceptance (server time, IP,
 * user agent) on the quote, since there is no Checkout Session to carry it,
 * and tells the admin. The project is created when the admin confirms the
 * money arrived (createProjectFromQuoteAction).
 */
export async function requestZellePaymentAction(
  token: string
): Promise<ActionResult<{ depositAmount: number }>> {
  try {
    if (!TokenSchema.safeParse(token).success) {
      return { success: false, error: "This quote link is not valid" };
    }
    if (!isZelleAvailable()) {
      return { success: false, error: "Zelle payments are not available right now" };
    }

    const rateCheck = await checkActionRateLimit(rateLimiters.api);
    if (!rateCheck.success) {
      return { success: false, error: rateCheck.error ?? "Too many requests" };
    }

    const quote = await prisma.quote.findUnique({ where: { token } });
    if (!quote || quote.status === "draft") {
      return { success: false, error: "This quote link is not valid" };
    }

    const status = getQuoteDisplayStatus(quote);
    if (status === "accepted") {
      return { success: false, error: "This quote has already been accepted" };
    }
    if (status === "cancelled") {
      return { success: false, error: "This quote has been withdrawn" };
    }
    if (status === "expired") {
      return {
        success: false,
        error: "This quote has expired. Reply to the email to request an updated one",
      };
    }

    const headerList = await headers();
    const ipAddress = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const userAgent = headerList.get("user-agent")?.slice(0, 500) || "unknown";
    const now = new Date();

    await prisma.quote.update({
      where: { id: quote.id },
      data: {
        zelleRequestedAt: quote.zelleRequestedAt ?? now,
        // Keep the first acceptance: pressing the button twice is not a new contract
        termsAcceptedAt: quote.termsAcceptedAt ?? now,
        termsIp: quote.termsIp ?? ipAddress,
        termsUserAgent: quote.termsUserAgent ?? userAgent,
      },
    });

    const { deposit } = splitDepositAmount(quote.totalAmount);

    // First request only: the admin does not need a reminder per click
    if (!quote.zelleRequestedAt) {
      await sendAdminZelleRequestNotification(new Resend(process.env.RESEND_API_KEY!), {
        quoteNumber: quote.quoteNumber,
        customerName: quote.name,
        customerEmail: quote.email,
        planName: quote.planName,
        depositAmount: deposit,
        adminQuoteUrl: `${SITE_BASE_URL}/quotes/${quote.id}`,
      });
    }

    return { success: true, data: { depositAmount: deposit } };
  } catch (error) {
    console.error("❌ Error requesting Zelle payment:", error);
    return { success: false, error: "Something went wrong. Please try again" };
  }
}
