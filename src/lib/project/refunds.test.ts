import { describe, expect, it } from "vitest";
import {
  applyLostDispute,
  applyRefund,
  netRefunded,
  recognizedRevenue,
  toDisputeStatus,
} from "./refunds";

const paid = {
  status: "paid" as const,
  amount: 100000,
  taxAmount: 6600,
  refundedAmount: 0,
  refundedAt: null,
};
const at = new Date("2026-11-10T20:00:00Z");

describe("applyRefund", () => {
  it("marks the charge refunded when Stripe says the whole charge went back", () => {
    expect(applyRefund(paid, { amountRefunded: 106600, refunded: true }, at)).toEqual({
      status: "refunded",
      refundedAmount: 106600,
      refundedAt: at,
    });
  });

  it("keeps a partial refund as paid, with the cumulative amount from Stripe", () => {
    expect(applyRefund(paid, { amountRefunded: 20000, refunded: false }, at)).toEqual({
      status: "paid",
      refundedAmount: 20000,
      refundedAt: at,
    });
  });

  it("is idempotent: a retry with the same amount changes nothing, not even the date", () => {
    const already = { ...paid, refundedAmount: 20000, refundedAt: new Date("2026-11-01T00:00:00Z") };
    const later = new Date("2026-11-12T00:00:00Z");

    expect(applyRefund(already, { amountRefunded: 20000, refunded: false }, later)).toBeNull();
  });

  it("treats a refund equal to the total as full even if the flag lags behind", () => {
    const result = applyRefund(paid, { amountRefunded: 106600, refunded: false }, at);

    expect(result?.status).toBe("refunded");
  });

  it("never lowers the refunded amount (events can arrive out of order)", () => {
    const already = { ...paid, refundedAmount: 50000, refundedAt: at };

    expect(applyRefund(already, { amountRefunded: 20000, refunded: false }, at)).toBeNull();
  });

  it("ignores a refund on a charge that was never paid", () => {
    expect(applyRefund({ ...paid, status: "pending" }, { amountRefunded: 500, refunded: false }, at)).toBeNull();
  });
});

describe("applyLostDispute", () => {
  it("counts the disputed amount as returned and refunds the charge when it covers it all", () => {
    expect(applyLostDispute(paid, 106600, at)).toEqual({
      status: "refunded",
      refundedAmount: 106600,
      refundedAt: at,
    });
  });

  it("adds a partial chargeback on top of an earlier partial refund, capped at the total", () => {
    const already = { ...paid, refundedAmount: 80000, refundedAt: at };

    expect(applyLostDispute(already, 50000, at)).toEqual({
      status: "refunded",
      refundedAmount: 106600,
      refundedAt: at,
    });
  });

  it("keeps the charge paid when the lost dispute is only part of it", () => {
    expect(applyLostDispute(paid, 30000, at)).toEqual({
      status: "paid",
      refundedAmount: 30000,
      refundedAt: at,
    });
  });
});

describe("netRefunded / recognizedRevenue", () => {
  it("splits a refund between revenue and tax in the charge's own proportion", () => {
    // 20 000 of 106 600 went back: 18 762 of it was revenue, the rest tax
    expect(netRefunded({ ...paid, refundedAmount: 20000 })).toBe(18762);
  });

  it("returns the whole revenue for a refunded charge", () => {
    expect(netRefunded({ ...paid, status: "refunded", refundedAmount: 106600 })).toBe(100000);
    expect(recognizedRevenue({ ...paid, status: "refunded", refundedAmount: 106600 })).toBe(0);
  });

  it("recognizes the full amount of an untouched paid charge and nothing for a pending one", () => {
    expect(recognizedRevenue(paid)).toBe(100000);
    expect(recognizedRevenue({ ...paid, status: "pending" })).toBe(0);
  });

  it("handles charges without tax", () => {
    expect(netRefunded({ ...paid, taxAmount: 0, refundedAmount: 25000 })).toBe(25000);
  });
});

describe("toDisputeStatus", () => {
  it("maps every Stripe status to open, won or lost", () => {
    expect(toDisputeStatus("needs_response")).toBe("open");
    expect(toDisputeStatus("under_review")).toBe("open");
    expect(toDisputeStatus("warning_needs_response")).toBe("open");
    expect(toDisputeStatus("warning_under_review")).toBe("open");
    expect(toDisputeStatus("warning_closed")).toBe("won");
    expect(toDisputeStatus("won")).toBe("won");
    expect(toDisputeStatus("lost")).toBe("lost");
  });
});
