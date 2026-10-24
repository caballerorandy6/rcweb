import { z } from "zod";
import type Stripe from "stripe";

// Stripe keeps Checkout Session metadata as flat string → string pairs. These
// schemas are the single definition of what our sessions carry: the actions
// that create them build the object from the *Input types, and the webhook
// parses the session back with parseCheckoutMetadata().

const integerCents = z
  .string()
  .regex(/^\d+$/, "Amount must be an integer number of cents")
  .transform(Number)
  .pipe(z.number().int().positive());

const email = z.string().trim().toLowerCase().pipe(z.email());

const isoDate = z.iso.datetime().transform((value) => new Date(value));

export const InitialCheckoutMetadataSchema = z.object({
  paymentType: z.literal("initial"),
  // 6 chars from generateProjectCode(); unique in Project
  projectCode: z.string().regex(/^[A-Z0-9]{6}$/),
  planName: z.string().trim().min(1),
  customerName: z.string().trim().min(1),
  customerEmail: email,
  firstPaymentAmount: integerCents,
  secondPaymentAmount: integerCents,
  totalAmount: integerCents,
  termsAcceptedAt: isoDate,
});

export const FinalCheckoutMetadataSchema = z.object({
  paymentType: z.literal("final"),
  projectId: z.uuid(),
  // Informative only (shows up in the Stripe dashboard); the lookup key is projectId
  projectCode: z.string(),
});

export const SubscriptionCheckoutMetadataSchema = z.object({
  paymentType: z.literal("subscription"),
  planName: z.string().trim().min(1),
  customerName: z.string().trim().min(1),
  customerEmail: email,
  termsAcceptedAt: isoDate,
});

export const CheckoutMetadataSchema = z.discriminatedUnion("paymentType", [
  InitialCheckoutMetadataSchema,
  FinalCheckoutMetadataSchema,
  SubscriptionCheckoutMetadataSchema,
]);

/** What the actions put in the session (all strings, as Stripe stores them) */
export type InitialCheckoutMetadataInput = z.input<
  typeof InitialCheckoutMetadataSchema
>;
export type FinalCheckoutMetadataInput = z.input<
  typeof FinalCheckoutMetadataSchema
>;
export type SubscriptionCheckoutMetadataInput = z.input<
  typeof SubscriptionCheckoutMetadataSchema
>;

/** What the webhook works with (amounts as numbers, dates as Date) */
export type CheckoutMetadata = z.output<typeof CheckoutMetadataSchema>;

export function parseCheckoutMetadata(metadata: Stripe.Metadata | null) {
  return CheckoutMetadataSchema.safeParse(metadata ?? {});
}
