import { prisma } from "@/lib/prisma";
import type { Quote } from "@/generated/prisma/client";
import { sendQuoteEmail } from "@/lib/email/senders/sendQuoteEmail";
import { getQuoteUrl } from "@/lib/projectUrl";
import { splitDepositAmount } from "@/lib/project/charges";
import { getQuoteExpiresAt, isQuoteOpen } from "./quoteStatus";

export type SendQuoteResult =
  | { success: true; quote: Quote }
  | { success: false; error: string };

/**
 * Emails the customer their link to /quote/{token} and marks the quote sent
 * with a fresh validity window. Re-sending extends the window. The lead with
 * the same email (picked by hand or matched here) moves to PROPOSAL_SENT.
 * The email goes first: a quote is only "sent" once the customer has it.
 */
export async function sendQuote(quote: Quote): Promise<SendQuoteResult> {
  if (!isQuoteOpen(quote)) {
    return { success: false, error: `A ${quote.status} quote cannot be sent` };
  }

  const sentAt = new Date();
  const expiresAt = getQuoteExpiresAt(sentAt);
  const { deposit, balance } = splitDepositAmount(quote.totalAmount);

  const sent = await sendQuoteEmail({
    customerEmail: quote.email,
    customerName: quote.name,
    quoteNumber: quote.quoteNumber,
    planName: quote.planName,
    scope: quote.scope,
    notes: quote.notes,
    totalAmount: quote.totalAmount,
    depositAmount: deposit,
    balanceAmount: balance,
    expiresAt,
    quoteUrl: getQuoteUrl(quote.token),
  });

  if (!sent.success) {
    return { success: false, error: sent.error ?? "Email could not be sent" };
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Contact emails were stored as typed; the quote email is lowercased
    const contactId =
      quote.contactId ??
      (
        await tx.contactEmail.findFirst({
          where: { email: { equals: quote.email, mode: "insensitive" } },
          select: { contactId: true },
        })
      )?.contactId ??
      null;

    if (contactId) {
      await tx.contact.updateMany({
        where: { id: contactId, leadStatus: { not: "WON" } },
        data: { leadStatus: "PROPOSAL_SENT" },
      });
    }

    return tx.quote.update({
      where: { id: quote.id },
      data: { status: "sent", sentAt, expiresAt, contactId },
    });
  });

  return { success: true, quote: updated };
}
