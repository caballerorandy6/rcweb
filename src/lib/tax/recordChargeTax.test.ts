import { afterEach, describe, expect, it, vi } from "vitest";

const { calculateOffStripeTax, recordOffStripeTax, captureException } = vi.hoisted(() => ({
  calculateOffStripeTax: vi.fn(),
  recordOffStripeTax: vi.fn(async () => "tax_123"),
  captureException: vi.fn(),
}));

vi.mock("./stripeTax", () => ({ calculateOffStripeTax, recordOffStripeTax }));
vi.mock("@sentry/nextjs", () => ({ captureException }));

import { BillingAddressSchema } from "./billingAddress";
import { recordChargeTax } from "./recordChargeTax";

const address = BillingAddressSchema.parse({
  line1: "1 Fountain Sq",
  city: "Missouri City",
  state: "TX",
  postalCode: "77489",
});
const now = new Date("2026-11-08T12:00:00Z");
const base = { projectCode: "AB3K9Z", kind: "deposit" as const, amount: 100000, taxAmount: 6600, address, now };

afterEach(() => vi.clearAllMocks());

describe("recordChargeTax", () => {
  it("records the calculation the customer saw when the tax matches and it has not expired", async () => {
    const result = await recordChargeTax({
      ...base,
      calculation: { id: "taxcalc_1", taxAmount: 6600, calculatedAt: new Date("2026-11-01T12:00:00Z") },
    });

    expect(result).toEqual({ transactionId: "tax_123" });
    expect(calculateOffStripeTax).not.toHaveBeenCalled();
    expect(recordOffStripeTax).toHaveBeenCalledWith({ calculationId: "taxcalc_1", reference: "AB3K9Z-deposit" });
  });

  it("recalculates when the stored calculation is too old, and records the new one if it agrees", async () => {
    calculateOffStripeTax.mockResolvedValueOnce({ ok: true, tax: { calculationId: "taxcalc_2", taxAmount: 6600 } });

    const result = await recordChargeTax({
      ...base,
      calculation: { id: "taxcalc_1", taxAmount: 6600, calculatedAt: new Date("2026-07-01T12:00:00Z") },
    });

    expect(result).toEqual({ transactionId: "tax_123" });
    expect(calculateOffStripeTax).toHaveBeenCalledWith({ amount: 100000, kind: "deposit", address });
    expect(recordOffStripeTax).toHaveBeenCalledWith({ calculationId: "taxcalc_2", reference: "AB3K9Z-deposit" });
  });

  it("records a sale without tax too: Stripe counts it toward the thresholds of other states", async () => {
    calculateOffStripeTax.mockResolvedValueOnce({ ok: true, tax: { calculationId: "taxcalc_3", taxAmount: 0 } });

    const result = await recordChargeTax({ ...base, taxAmount: 0, calculation: null });

    expect(result).toEqual({ transactionId: "tax_123" });
  });

  it("does not record anything when the tax entered differs from what Stripe calculates", async () => {
    calculateOffStripeTax.mockResolvedValueOnce({ ok: true, tax: { calculationId: "taxcalc_4", taxAmount: 6600 } });

    const result = await recordChargeTax({ ...base, taxAmount: 0, calculation: null });

    expect(result).toEqual({ warning: expect.stringContaining("$66.00") });
    expect(recordOffStripeTax).not.toHaveBeenCalled();
  });

  it("warns when there is no billing address to calculate from", async () => {
    const result = await recordChargeTax({ ...base, address: null, calculation: null });

    expect(result).toEqual({ warning: expect.stringContaining("billing address") });
    expect(calculateOffStripeTax).not.toHaveBeenCalled();
  });

  it("warns when Stripe cannot place the address", async () => {
    calculateOffStripeTax.mockResolvedValueOnce({ ok: false, reason: "invalid_location" });

    const result = await recordChargeTax({ ...base, calculation: null });

    expect(result).toEqual({ warning: expect.stringContaining("could not place") });
  });

  it("reports a Stripe failure to Sentry and returns a warning instead of throwing", async () => {
    recordOffStripeTax.mockRejectedValueOnce(new Error("Stripe is down"));

    const result = await recordChargeTax({
      ...base,
      calculation: { id: "taxcalc_1", taxAmount: 6600, calculatedAt: new Date("2026-11-01T12:00:00Z") },
    });

    expect(result).toEqual({ warning: expect.stringContaining("Stripe is down") });
    expect(captureException).toHaveBeenCalled();
  });
});
