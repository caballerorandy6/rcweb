"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { QuoteInputSchema, type QuoteInput } from "@/lib/zod";
import { generateQuoteNumber } from "@/lib/quote/quoteNumber";
import { sendQuote } from "@/lib/quote/sendQuote";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import type { AdminQuote } from "@/types/quote";
import type { ActionResult } from "@/types/common";

export type CreateQuoteData = {
  quote: AdminQuote;
  /** Set when the quote was saved but the customer email could not be sent (it stays a draft) */
  emailError?: string;
};

/** Saves a quote as a draft, or saves and emails it to the customer. */
export async function createQuoteAction(
  input: QuoteInput,
  options: { send: boolean } = { send: false }
): Promise<ActionResult<CreateQuoteData>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const parsed = QuoteInputSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid quote data",
      };
    }
    const data = parsed.data;

    if (data.contactId) {
      const contact = await prisma.contact.findUnique({
        where: { id: data.contactId },
        select: { id: true },
      });
      if (!contact) {
        return { success: false, error: "Contact not found" };
      }
    }

    const quoteNumber = await generateQuoteNumber();

    let quote = await prisma.quote.create({
      data: {
        quoteNumber,
        email: data.email,
        name: data.name,
        offerId: data.offerId || null,
        planName: data.planName,
        scope: data.scope,
        notes: data.notes || null,
        totalAmount: Math.round(data.totalDollars * 100),
        contactId: data.contactId ?? null,
      },
    });

    let emailError: string | undefined;
    if (options.send) {
      const sent = await sendQuote(quote);
      if (sent.success) {
        quote = sent.quote;
      } else {
        emailError = sent.error;
      }
    }

    revalidatePath("/quotes");
    revalidatePath("/contacts");

    return {
      success: true,
      data: { quote: toAdminQuote({ ...quote, project: null }), emailError },
    };
  } catch (error) {
    console.error("Error creating quote:", error);
    return { success: false, error: "Failed to create quote" };
  }
}
