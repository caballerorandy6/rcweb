import { z } from "zod";

// Schema de validación para formularios de contacto
export const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z.email({ message: "Invalid email address" }),
  phone: z
    .string()
    .min(10, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" }),
  message: z
    .string()
    .min(2, { message: "Message is too short" })
    .max(500, { message: "Message is too long" })
    .optional(), // mensaje opcional para captura rápida de contactos
  marketingConsent: z
    .boolean()
    .describe("Consent to receive marketing emails and messages"),
});

// Checkout: el cliente solo envía el ID del plan. Precio, nombre y descripción
// se leen en el servidor desde pricingPlans para que no se puedan manipular.
export const CheckoutRequestSchema = z.object({
  planId: z.string().min(1, { message: "Plan is required" }),
  customer: z.object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Name is too short" })
      .max(100, { message: "Name is too long" }),
    email: z.string().trim().pipe(z.email({ message: "Invalid email address" })),
  }),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

// Schema de validación
export const LoginSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginData = z.infer<typeof LoginSchema>;

// Manage Subscription Schema
export const ManageSubscriptionSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

// Blog Subscription Schema: subscribing adds the email to the newsletter
// audience (Contact with marketingConsent)
export const BlogSubscriptionSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

export type BlogSubscriptionData = z.infer<typeof BlogSubscriptionSchema>;
export type ManageSubscriptionData = z.infer<typeof ManageSubscriptionSchema>;
export type FormData = z.infer<typeof FormSchema>;
