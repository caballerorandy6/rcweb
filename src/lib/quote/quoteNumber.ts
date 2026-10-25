import { prisma } from "@/lib/prisma";

const QUOTE_NUMBER_PATTERN = /^Q-(\d{4})-(\d{3,})$/;

/**
 * "Q-2026-001" → "Q-2026-002"; a different year or no previous number
 * starts the sequence again at 001. Pure, so it can be unit tested.
 */
export function nextQuoteNumber(last: string | null, year: number): string {
  const prefix = `Q-${year}-`;
  const match = last?.match(QUOTE_NUMBER_PATTERN);
  const sequence =
    match && Number(match[1]) === year ? Number.parseInt(match[2], 10) + 1 : 1;
  return `${prefix}${String(sequence).padStart(3, "0")}`;
}

/**
 * Sequential per year, like invoice numbers. There is one admin, so the
 * read-then-write race is theoretical; the unique index turns it into an
 * error rather than a duplicate.
 */
export async function generateQuoteNumber(now: Date = new Date()): Promise<string> {
  const year = now.getFullYear();
  const last = await prisma.quote.findFirst({
    where: { quoteNumber: { startsWith: `Q-${year}-` } },
    orderBy: { createdAt: "desc" },
    select: { quoteNumber: true },
  });
  return nextQuoteNumber(last?.quoteNumber ?? null, year);
}
