"use server";

import { z } from "zod";
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
  try {
    if (!TokenSchema.safeParse(token).success) {
      return { success: false, error: "This quote link is not valid" };
    }

    // Every call creates a Checkout Session: cap it per IP
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

    const { sessionUrl } = await createInitialPaymentCheckout({
      planName: quote.planName,
      totalAmount: quote.totalAmount,
      customerName: quote.name,
      customerEmail: quote.email,
      quoteId: quote.id,
      description: `50% deposit for quote ${quote.quoteNumber}; the balance is due on delivery`,
      cancelUrl: getQuoteUrl(quote.token),
    });

    return { success: true, data: { sessionUrl } };
  } catch (error) {
    console.error("❌ Error accepting quote:", error);
    return { success: false, error: "Failed to start the payment. Please try again" };
  }
}
