import type { QuoteStatus } from "@/generated/prisma/enums";
import type { QuoteDisplayStatus } from "@/lib/quote/quoteStatus";

/**
 * Quote as the admin pages see it. Serializable (dates as ISO strings): it
 * crosses the server → client boundary.
 */
export type AdminQuote = {
  id: string;
  quoteNumber: string;
  token: string;
  email: string;
  name: string;
  offerId: string | null;
  planName: string;
  scope: string[];
  notes: string | null;
  /** Cents */
  totalAmount: number;
  status: QuoteStatus;
  /** status, or "expired" for a sent quote past its expiry */
  displayStatus: QuoteDisplayStatus;
  sentAt: string | null;
  expiresAt: string | null;
  viewedAt: string | null;
  acceptedAt: string | null;
  /** Customer chose Zelle for the deposit on the quote page */
  zelleRequestedAt: string | null;
  /** Terms accepted on the quote page without a Checkout Session (Zelle) */
  termsAcceptedAt: string | null;
  createdAt: string;
  contactId: string | null;
  projectId: string | null;
  /** Code of the project created when the deposit was paid */
  projectCode: string | null;
};
