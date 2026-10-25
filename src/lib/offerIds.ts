/**
 * Offer ids of the service catalogue, kept apart from src/lib/data.ts so
 * client bundles (the contact form, its Zod schema) do not drag in the
 * whole catalogue with its icons and copy. `offers` in data.ts is typed
 * against this list.
 */
export const OFFER_IDS = [
  "business-website",
  "website-redesign",
  "admin-dashboard",
  "store-and-apps",
  "maintenance",
] as const;

export type OfferId = (typeof OFFER_IDS)[number];

export function isOfferId(value: unknown): value is OfferId {
  return typeof value === "string" && (OFFER_IDS as readonly string[]).includes(value);
}
