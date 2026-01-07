import z from "zod";

// Schema de validación para formularios de contacto
export const FormSchema = z.object({
  name: z.string().min(2, { message: "Name is too short" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
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
    .default(false)
    .describe("Consent to receive marketing emails and messages"),
});

// Schema de validación
export const LoginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginData = z.infer<typeof LoginSchema>;

// Manage Subscription Schema
export const ManageSubscriptionSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

// Blog Subscription Schema
export const BlogSubscriptionSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  preferredLanguage: z.enum(["en", "es"], {
    required_error: "Please select a language",
  }),
});

// Client Registration Schema (for form validation - includes confirmPassword)
export const ClientRegisterFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Client Registration Schema (for action - excludes confirmPassword)
export const ClientRegisterSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
});

export type ClientRegisterFormData = z.infer<typeof ClientRegisterFormSchema>;
export type ClientRegisterData = z.infer<typeof ClientRegisterSchema>;

// Reset Password Request Schema
export const ResetPasswordRequestSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

// Reset Password Schema
export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Setup Password Schema (for initial password setup)
export const SetupPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Update Client Profile Schema
export const UpdateClientProfileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  phone: z
    .string()
    .min(10, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .optional()
    .or(z.literal("")),
});

// Change Password Schema (for form validation - includes confirmPassword)
export const ChangePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Change Password Schema (for action - excludes confirmPassword)
export const ChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type BlogSubscriptionData = z.infer<typeof BlogSubscriptionSchema>;
export type ManageSubscriptionData = z.infer<typeof ManageSubscriptionSchema>;
export type FormData = z.infer<typeof FormSchema>;
// ClientRegisterData is already defined above
export type ResetPasswordRequestData = z.infer<
  typeof ResetPasswordRequestSchema
>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;
export type SetupPasswordData = z.infer<typeof SetupPasswordSchema>;
export type UpdateClientProfileData = z.infer<typeof UpdateClientProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>;
export type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;
