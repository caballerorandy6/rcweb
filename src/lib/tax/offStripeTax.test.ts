import { describe, expect, it } from "vitest";
import { BillingAddressSchema } from "./billingAddress";
import {
  buildTaxCalculationParams,
  OffStripeTaxSchema,
  isCalculationFresh,
  taxTransactionReference,
} from "./offStripeTax";

const address = BillingAddressSchema.parse({
  line1: "123 Main St",
  city: "Missouri City",
  state: "TX",
  postalCode: "77489",
});

describe("buildTaxCalculationParams", () => {
  it("calculates one tax-exclusive line with the account's preset tax code", () => {
    const params = buildTaxCalculationParams({ amount: 50000, kind: "deposit", address });
    expect(params).toEqual({
      currency: "usd",
      line_items: [{ amount: 50000, reference: "deposit", tax_behavior: "exclusive" }],
      customer_details: {
        address: {
          line1: "123 Main St",
          city: "Missouri City",
          state: "TX",
          postal_code: "77489",
          country: "US",
        },
        address_source: "billing",
      },
    });
    // Same rule as Checkout: no tax_code, so Stripe uses Website Design
    expect(params.line_items[0]).not.toHaveProperty("tax_code");
  });

  it("rejects an amount that is not a positive number of cents", () => {
    expect(() => buildTaxCalculationParams({ amount: 0, kind: "final", address })).toThrow();
    expect(() => buildTaxCalculationParams({ amount: 10.5, kind: "final", address })).toThrow();
  });
});

describe("taxTransactionReference", () => {
  it("is the project code plus the charge, unique per Payment row", () => {
    expect(taxTransactionReference("AB3K9Z", "deposit")).toBe("AB3K9Z-deposit");
    expect(taxTransactionReference("AB3K9Z", "final")).toBe("AB3K9Z-final");
  });
});

describe("isCalculationFresh", () => {
  const calculatedAt = new Date("2026-11-01T12:00:00Z");
  const daysLater = (days: number) => new Date(calculatedAt.getTime() + days * 86_400_000);

  it("is usable for 89 days, leaving a margin before Stripe's 90-day expiry", () => {
    expect(isCalculationFresh(calculatedAt, daysLater(0))).toBe(true);
    expect(isCalculationFresh(calculatedAt, daysLater(88.9))).toBe(true);
    expect(isCalculationFresh(calculatedAt, daysLater(89))).toBe(false);
    expect(isCalculationFresh(calculatedAt, daysLater(120))).toBe(false);
  });
});

describe("OffStripeTaxSchema", () => {
  it("accepts the calculation a dialog sends back", () => {
    expect(OffStripeTaxSchema.parse({ calculationId: "taxcalc_1Abc", taxAmount: 6600 })).toEqual({
      calculationId: "taxcalc_1Abc",
      taxAmount: 6600,
    });
  });

  it("rejects ids that are not Stripe Tax calculations and non-cent amounts", () => {
    expect(OffStripeTaxSchema.safeParse({ calculationId: "tax_1Abc", taxAmount: 6600 }).success).toBe(false);
    expect(OffStripeTaxSchema.safeParse({ calculationId: "taxcalc_1Abc", taxAmount: -1 }).success).toBe(false);
    expect(OffStripeTaxSchema.safeParse({ calculationId: "taxcalc_1Abc", taxAmount: 66.5 }).success).toBe(false);
  });
});
