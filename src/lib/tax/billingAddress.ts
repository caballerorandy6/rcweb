import { z } from "zod";
import type Stripe from "stripe";

// Customer billing address, saved as Json on Quote and Project. Stripe Tax
// needs at least the ZIP code for a US customer (only the country elsewhere),
// and the full address is the proof of where the customer is when no tax is
// charged.

const optionalText = z
  .string()
  .trim()
  .max(200)
  .optional()
  .transform((value) => (value ? value : undefined));

export const BillingAddressSchema = z
  .object({
    line1: z.string().trim().min(1).max(200),
    line2: optionalText,
    city: z.string().trim().min(1).max(100),
    state: optionalText.transform((value) => value?.toUpperCase()),
    postalCode: optionalText,
    country: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^[A-Z]{2}$/)
      .default("US"),
  })
  .superRefine((address, ctx) => {
    if (address.country !== "US") return;
    if (!address.state || !/^[A-Z]{2}$/.test(address.state)) {
      ctx.addIssue({ code: "custom", path: ["state"], message: "Use the two-letter state code" });
    }
    if (!address.postalCode || !/^\d{5}(-\d{4})?$/.test(address.postalCode)) {
      ctx.addIssue({ code: "custom", path: ["postalCode"], message: "Enter a valid ZIP code" });
    }
  });

export type BillingAddress = z.output<typeof BillingAddressSchema>;
export type BillingAddressInput = z.input<typeof BillingAddressSchema>;

/** Address of a Checkout Session's customer, or null when it is incomplete */
export function fromStripeAddress(
  address: Stripe.Address | null | undefined
): BillingAddress | null {
  if (!address) return null;
  const result = BillingAddressSchema.safeParse({
    line1: address.line1 ?? "",
    line2: address.line2 ?? undefined,
    city: address.city ?? "",
    state: address.state ?? undefined,
    postalCode: address.postal_code ?? undefined,
    country: address.country ?? undefined,
  });
  return result.success ? result.data : null;
}

/** The address in the shape of the Stripe Tax API */
export function toStripeAddress(
  address: BillingAddress
): Stripe.Tax.CalculationCreateParams.CustomerDetails.Address {
  return {
    line1: address.line1,
    ...(address.line2 ? { line2: address.line2 } : {}),
    city: address.city,
    ...(address.state ? { state: address.state } : {}),
    ...(address.postalCode ? { postal_code: address.postalCode } : {}),
    country: address.country,
  };
}

/** Reads back an address from a Json column; null when missing or malformed */
export function parseStoredBillingAddress(value: unknown): BillingAddress | null {
  const result = BillingAddressSchema.safeParse(value);
  return result.success ? result.data : null;
}

/** "Missouri City, TX 77489": enough for the admin to see where the tax comes from */
export function formatBillingPlace(address: BillingAddress): string {
  const region = address.state
    ? [address.state, address.postalCode].filter(Boolean).join(" ")
    : address.country;
  return `${address.city}, ${region}`;
}
