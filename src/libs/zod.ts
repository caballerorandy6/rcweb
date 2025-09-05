// libs/zod.ts
import z from "zod";

export const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is too short" })
    .nonempty({ message: "Full Name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .nonempty({ message: "Email is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .nonempty({
      message: "Phone number is required",
    }),
  message: z
    .string()
    .min(2, { message: "Message is too short" })
    .max(500, { message: "Message is too long" })
    .optional(), // mensaje opcional para captura rápida de contactos
  marketingConsent: z
    .boolean()
    .default(false)
    .describe("Consent to receive marketing emails and messages"),
});

// Infer the type
export type FormData = z.infer<typeof FormSchema>;
