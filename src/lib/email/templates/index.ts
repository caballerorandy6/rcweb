// src/lib/email/templates/index.ts

// Customer email templates (React components)
export {
  SubscriptionConfirmationEmail,
  type SubscriptionConfirmationEmailProps,
} from "./SubscriptionConfirmationEmail";

export {
  InitialPaymentConfirmationEmail,
  type InitialPaymentConfirmationEmailProps,
} from "./InitialPaymentConfirmationEmail";

export {
  InvoiceEmail,
  type InvoiceEmailProps,
  type InvoiceEmailType,
} from "./InvoiceEmail";

export {
  ProjectReadyEmail,
  type ProjectReadyEmailProps,
} from "./ProjectReadyEmail";

// Admin email templates (React components)
export {
  AdminNotificationEmail,
  type AdminNotificationEmailProps,
} from "./AdminNotificationEmail";
