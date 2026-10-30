import { PaymentMethod } from "@/generated/prisma/enums";

export { PaymentMethod };

/** How a charge was collected, as printed on invoices and in the admin */
export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  stripe: "Credit card (Stripe)",
  zelle: "Zelle",
  cash: "Cash",
  other: "Other",
};

/** Methods the admin can pick when recording a payment received outside Stripe */
export const MANUAL_PAYMENT_METHODS = ["zelle", "cash", "other"] as const satisfies readonly PaymentMethod[];
export type ManualPaymentMethod = (typeof MANUAL_PAYMENT_METHODS)[number];
