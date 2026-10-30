// src/lib/email/templates/index.ts

// Customer email templates (React components)
export {
  SubscriptionConfirmationEmail,
  type SubscriptionConfirmationEmailProps,
} from "./SubscriptionConfirmationEmail";

export {
  InvoiceEmail,
  type InvoiceEmailProps,
  type InvoiceEmailType,
} from "./InvoiceEmail";

export {
  ProjectReadyEmail,
  type ProjectReadyEmailProps,
} from "./ProjectReadyEmail";

export {
  SubscriptionPortalLinkEmail,
  type SubscriptionPortalLinkEmailProps,
} from "./SubscriptionPortalLinkEmail";

export {
  SubscriptionRenewalReminderEmail,
  type SubscriptionRenewalReminderEmailProps,
} from "./SubscriptionRenewalReminderEmail";

export {
  SubscriptionPaymentFailedEmail,
  type SubscriptionPaymentFailedEmailProps,
} from "./SubscriptionPaymentFailedEmail";

export {
  ContactConfirmationEmail,
  type ContactConfirmationEmailProps,
} from "./ContactConfirmationEmail";

export { QuoteEmail, type QuoteEmailProps } from "./QuoteEmail";

export {
  MilestoneCompletedEmail,
  type MilestoneCompletedEmailProps,
} from "./MilestoneCompletedEmail";


// Admin email templates (React components)
export {
  AdminNotificationEmail,
  type AdminNotificationEmailProps,
} from "./AdminNotificationEmail";

export {
  ZelleRequestAdminEmail,
  type ZelleRequestAdminEmailProps,
} from "./ZelleRequestAdminEmail";
