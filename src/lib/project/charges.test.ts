import { describe, expect, it } from "vitest";
import type { Payment } from "@/generated/prisma/client";
import { getProjectCharges, isPaid } from "./charges";

function payment(overrides: Partial<Payment>): Payment {
  return {
    id: "pay_1",
    projectId: "proj_1",
    kind: "deposit",
    amount: 50000,
    status: "pending",
    stripeSessionId: null,
    paidAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("getProjectCharges", () => {
  it("returns the deposit and final rows regardless of order", () => {
    const final = payment({ id: "pay_f", kind: "final", status: "paid" });
    const deposit = payment({ id: "pay_d", kind: "deposit" });

    const charges = getProjectCharges([final, deposit]);

    expect(charges.deposit.id).toBe("pay_d");
    expect(charges.final.id).toBe("pay_f");
  });

  it("throws when a project is missing one of its charges", () => {
    expect(() => getProjectCharges([payment({})])).toThrow(
      /missing its deposit or final payment/
    );
    expect(() => getProjectCharges([])).toThrow();
  });
});

describe("isPaid", () => {
  it("is true only for paid rows", () => {
    expect(isPaid(payment({ status: "paid" }))).toBe(true);
    expect(isPaid(payment({ status: "pending" }))).toBe(false);
  });
});
