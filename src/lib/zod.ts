import { z } from "zod";
import { ContactChannel } from "@/generated/prisma/enums";
import { OFFER_IDS } from "@/lib/offerIds";
import { parseScopeLines } from "@/lib/quote/quoteStatus";
import en from "@/messages/en.json";

// Zod 4 probes `Function("")` once to decide whether it may JIT-compile
// object parsers. The probe is caught, but the browser still reports it as
// a CSP violation (script-src has no 'unsafe-eval'). Skipping it costs
// nothing noticeable on forms this size and keeps the console clean.
z.config({ jitless: true });

/** Messages of the contact form validation; `Forms.validation` in the dictionaries */
export type ContactValidationMessages = {
  nameShort: string;
  emailInvalid: string;
  phoneShort: string;
  phoneLong: string;
  messageLong: string;
  messageShort: string;
};

/**
 * Contact form schema with messages in the visitor's language. The client
 * builds it from `useTranslations("Forms.validation")`; the server validates
 * again with the English default below.
 */
export function buildFormSchema(m: ContactValidationMessages) {
  return z.object({
    name: z.string().min(2, { message: m.nameShort }),
    email: z.email({ message: m.emailInvalid }),
    phone: z
      .string()
      .min(10, { message: m.phoneShort })
      .max(15, { message: m.phoneLong }),
    // Optional for quick lead capture: an empty field must not fail min()
    message: z
      .string()
      .max(500, { message: m.messageLong })
      .refine((value) => value.length === 0 || value.trim().length >= 2, {
        message: m.messageShort,
      })
      .optional(),
    marketingConsent: z
      .boolean()
      .describe("Consent to receive marketing emails and messages"),
    // Which offer the lead is asking about; "" is the "not sure yet" option
    service: z.union([z.enum(OFFER_IDS), z.literal("")]).optional(),
    // How they want to be reached; the admin's manual form leaves it empty
    preferredChannel: z.enum(ContactChannel).optional(),
  });
}

// Schema de validación para formularios de contacto (mensajes en inglés)
export const FormSchema = buildFormSchema(en.Forms.validation);

// Checkout: el cliente solo envía el ID del plan. Precio, nombre y descripción
// se leen en el servidor desde checkoutPlans para que no se puedan manipular.
export const CheckoutRequestSchema = z.object({
  planId: z.string().min(1, { message: "Plan is required" }),
  customer: z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name is too short" })
      .max(100, { message: "Name is too long" }),
    // Lowercased: it becomes Project.email and the final-payment form compares it
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email({ message: "Invalid email address" })),
  }),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

// Admin quote form. The scope textarea becomes one item per line; the total
// is typed in dollars and the action stores it in cents.
export const QuoteInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name is too short" })
    .max(100, { message: "Name is too long" }),
  // Lowercased: it becomes Project.email when the deposit is paid
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Invalid email address" })),
  // Catalogue offer the quote is based on; "" is a custom quote
  offerId: z.union([z.enum(OFFER_IDS), z.literal("")]).optional(),
  planName: z
    .string()
    .trim()
    .min(2, { message: "Plan name is too short" })
    .max(120, { message: "Plan name is too long" }),
  scope: z
    .string()
    .transform(parseScopeLines)
    .pipe(
      z
        .array(z.string().max(200, { message: "Keep each scope item under 200 characters" }))
        .min(1, { message: "Add at least one scope item" })
        .max(40, { message: "Too many scope items" })
    ),
  notes: z.string().trim().max(2000, { message: "Notes are too long" }).optional(),
  totalDollars: z.coerce
    .number({ message: "Enter the total amount" })
    .min(100, { message: "The minimum quote is $100" })
    .max(500000, { message: "Amount is too large" }),
  // Lead the quote is for; the form's hidden field sends "" when there is none
  contactId: z.union([z.uuid(), z.literal("")]).optional(),
});

/** What the form sends (scope as text, total as typed) */
export type QuoteInput = z.input<typeof QuoteInputSchema>;
/** What the action works with (scope as items, total as a number) */
export type QuoteData = z.output<typeof QuoteInputSchema>;

// Schema de validación
export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginData = z.infer<typeof LoginSchema>;

/** Single-email forms (manage subscription, blog) with the message in the visitor's language */
export function buildEmailSchema(message: string) {
  return z.object({ email: z.email({ message }) });
}

// Manage Subscription Schema
export const ManageSubscriptionSchema = buildEmailSchema("Please enter a valid email address");

// Blog Subscription Schema: subscribing adds the email to the newsletter
// audience (Contact with marketingConsent)
export const BlogSubscriptionSchema = buildEmailSchema("Please enter a valid email address");

export type BlogSubscriptionData = z.infer<typeof BlogSubscriptionSchema>;
export type ManageSubscriptionData = z.infer<typeof ManageSubscriptionSchema>;
export type FormData = z.infer<typeof FormSchema>;
