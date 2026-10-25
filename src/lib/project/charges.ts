import type { Payment, Prisma } from "@/generated/prisma/client";
import { PaymentKind, PaymentStatus } from "@/generated/prisma/enums";

/**
 * A 50/50 project always has exactly two Payment rows: the deposit and the
 * final payment. This helper picks them out of `project.payments`.
 */
export type ProjectCharges = { deposit: Payment; final: Payment };

export function getProjectCharges(payments: Payment[]): ProjectCharges {
  const deposit = payments.find((p) => p.kind === PaymentKind.deposit);
  const final = payments.find((p) => p.kind === PaymentKind.final);

  if (!deposit || !final) {
    throw new Error("Project is missing its deposit or final payment row");
  }

  return { deposit, final };
}

export function isPaid(payment: Pick<Payment, "status">): boolean {
  return payment.status === PaymentStatus.paid;
}

export type ProjectWithPayments = Prisma.ProjectGetPayload<{
  include: { payments: true };
}>;

/** Every project is sold 50/50: the deposit is half, the final payment the rest */
export const DEPOSIT_PERCENT = 50;

export function splitDepositAmount(totalAmount: number): {
  deposit: number;
  balance: number;
} {
  const deposit = Math.round((totalAmount * DEPOSIT_PERCENT) / 100);
  return { deposit, balance: totalAmount - deposit };
}
