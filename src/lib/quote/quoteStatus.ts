import type { Quote } from "@/generated/prisma/client";
import { QuoteStatus } from "@/generated/prisma/enums";

/** How long a sent quote can be accepted (decision of 2026-10-25) */
export const QUOTE_VALIDITY_DAYS = 30;

/**
 * The database keeps draft/sent/accepted/cancelled. "expired" is derived:
 * a sent quote whose expiresAt has passed. No cron, nothing to keep in sync.
 */
export type QuoteDisplayStatus = QuoteStatus | "expired";

const DAY_MS = 24 * 60 * 60 * 1000;

export function getQuoteExpiresAt(
  sentAt: Date,
  days: number = QUOTE_VALIDITY_DAYS
): Date {
  return new Date(sentAt.getTime() + days * DAY_MS);
}

type QuoteLifecycle = Pick<Quote, "status" | "expiresAt">;

export function isQuoteExpired(
  quote: QuoteLifecycle,
  now: Date = new Date()
): boolean {
  return (
    quote.status === QuoteStatus.sent &&
    quote.expiresAt !== null &&
    quote.expiresAt.getTime() <= now.getTime()
  );
}

export function getQuoteDisplayStatus(
  quote: QuoteLifecycle,
  now: Date = new Date()
): QuoteDisplayStatus {
  return isQuoteExpired(quote, now) ? "expired" : quote.status;
}

/** The customer can accept (pay the deposit of) a sent quote that has not expired */
export function canAcceptQuote(
  quote: QuoteLifecycle,
  now: Date = new Date()
): boolean {
  return getQuoteDisplayStatus(quote, now) === QuoteStatus.sent;
}

/** The admin can edit, send or cancel a quote until it is paid or cancelled */
export function isQuoteOpen(quote: Pick<Quote, "status">): boolean {
  return (
    quote.status === QuoteStatus.draft || quote.status === QuoteStatus.sent
  );
}

/**
 * Textarea → scope items: one per non-empty line, trimmed, with a leading
 * bullet ("-", "*", "•") removed so pasted lists come out clean.
 */
export function parseScopeLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s*/, "").trim())
    .filter((line) => line.length > 0);
}

export const QUOTE_STATUS_LABELS: Record<QuoteDisplayStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  expired: "Expired",
  accepted: "Accepted",
  cancelled: "Cancelled",
};
