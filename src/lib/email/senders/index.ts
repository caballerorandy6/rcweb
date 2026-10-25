// src/lib/email/senders/index.ts

// Customer email senders
export {
  sendSubscriptionConfirmation,
  type SendSubscriptionConfirmationParams,
} from "./sendSubscriptionConfirmation";

export {
  sendInvoiceEmail,
  type SendInvoiceEmailParams,
} from "./sendInvoiceEmail";

export {
  sendProjectReadyEmail,
  type SendProjectReadyEmailParams,
} from "./sendProjectReadyEmail";

export {
  sendSubscriptionPortalLink,
  type SendSubscriptionPortalLinkParams,
} from "./sendSubscriptionPortalLink";

export {
  sendSubscriptionRenewalReminder,
  type SendSubscriptionRenewalReminderParams,
} from "./sendSubscriptionRenewalReminder";

export {
  sendSubscriptionPaymentFailed,
  type SendSubscriptionPaymentFailedParams,
} from "./sendSubscriptionPaymentFailed";

export {
  sendContactConfirmationEmail,
  type SendContactConfirmationEmailParams,
} from "./sendContactConfirmationEmail";


// Admin email senders
export {
  sendAdminSubscriptionNotification,
  type AdminSubscriptionNotificationParams,
} from "./sendAdminSubscriptionNotification";

export {
  sendAdminInitialPaymentNotification,
  type AdminInitialPaymentNotificationParams,
} from "./sendAdminInitialPaymentNotification";

export {
  sendAdminFinalPaymentNotification,
  type AdminFinalPaymentNotificationParams,
} from "./sendAdminFinalPaymentNotification";
