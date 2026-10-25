import { offers } from "@/lib/data";
import type { OfferId } from "@/lib/offerIds";

/** What the quote form needs from the catalogue (no icons or copy cross to the client) */
export type QuoteOfferOption = {
  id: OfferId;
  title: string;
  /** Starting price in cents, suggested as the default total */
  priceFromCents: number;
};

export const quoteOfferOptions: QuoteOfferOption[] = offers
  // The maintenance plan is a subscription, not something to quote
  .filter((offer) => offer.checkout?.mode !== "subscription")
  .map(({ id, title, priceFromCents }) => ({ id, title, priceFromCents }));
