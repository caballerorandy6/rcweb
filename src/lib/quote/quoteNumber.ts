import { prisma } from "@/lib/prisma";

const QUOTE_NUMBER_PATTERN = /^Q-(\d{4})-(\d{3,})$/;

/**
 * Next number after the highest sequence used in `year` among `existing`
 * ("Q-2026-007" → "Q-2026-008"); other years and malformed values are
 * ignored, and an empty year starts at 001. Pure, so it can be unit tested.
 */
export function nextQuoteNumber(existing: readonly string[], year: number): string {
  let highest = 0;
  for (const number of existing) {
    const match = number.match(QUOTE_NUMBER_PATTERN);
    if (!match || Number(match[1]) !== year) continue;
    highest = Math.max(highest, Number.parseInt(match[2], 10));
  }
  return `Q-${year}-${String(highest + 1).padStart(3, "0")}`;
}

/**
 * Sequential per year, like invoice numbers. There is one admin, so the
 * read-then-write race is theoretical; the unique index turns it into an
 * error rather than a duplicate.
 */
export async function generateQuoteNumber(now: Date = new Date()): Promise<string> {
  const year = now.getFullYear();
  const existing = await prisma.quote.findMany({
    where: { quoteNumber: { startsWith: `Q-${year}-` } },
    select: { quoteNumber: true },
  });
  return nextQuoteNumber(
    existing.map((quote) => quote.quoteNumber),
    year
  );
}
