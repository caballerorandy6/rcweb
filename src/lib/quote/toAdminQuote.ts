import type { Quote } from "@/generated/prisma/client";
import type { AdminQuote } from "@/types/quote";
import { getQuoteDisplayStatus } from "./quoteStatus";

export type QuoteWithProject = Quote & {
  project: { projectCode: string } | null;
};

export function toAdminQuote(quote: QuoteWithProject, now: Date = new Date()): AdminQuote {
  return {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    token: quote.token,
    email: quote.email,
    name: quote.name,
    offerId: quote.offerId,
    planName: quote.planName,
    scope: quote.scope,
    notes: quote.notes,
    totalAmount: quote.totalAmount,
    status: quote.status,
    displayStatus: getQuoteDisplayStatus(quote, now),
    sentAt: quote.sentAt?.toISOString() ?? null,
    expiresAt: quote.expiresAt?.toISOString() ?? null,
    viewedAt: quote.viewedAt?.toISOString() ?? null,
    acceptedAt: quote.acceptedAt?.toISOString() ?? null,
    createdAt: quote.createdAt.toISOString(),
    contactId: quote.contactId,
    projectId: quote.projectId,
    projectCode: quote.project?.projectCode ?? null,
  };
}
