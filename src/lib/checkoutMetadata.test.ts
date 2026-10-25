import { describe, expect, it } from "vitest";
import { isOwnCheckoutSession, parseCheckoutMetadata } from "./checkoutMetadata";

const initial = {
  paymentType: "initial",
  projectCode: "AB3K9Z",
  planName: "Starter Site",
  customerName: "Ana Pérez",
  customerEmail: " Ana@Example.com ",
  firstPaymentAmount: "50000",
  secondPaymentAmount: "50000",
  totalAmount: "100000",
  termsAcceptedAt: "2026-10-24T18:00:00.000Z",
};

describe("parseCheckoutMetadata", () => {
  it("parses an initial payment: amounts as numbers, email lowercased, date as Date", () => {
    const result = parseCheckoutMetadata(initial);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toMatchObject({
      paymentType: "initial",
      customerEmail: "ana@example.com",
      firstPaymentAmount: 50000,
      totalAmount: 100000,
    });
    if (result.data.paymentType !== "initial") return;
    expect(result.data.termsAcceptedAt).toEqual(
      new Date("2026-10-24T18:00:00.000Z")
    );
  });

  it("accepts an initial payment with or without the quote it pays", () => {
    expect(parseCheckoutMetadata(initial).success).toBe(true);
    const withQuote = parseCheckoutMetadata({
      ...initial,
      quoteId: "7b1f2e6a-3c4d-4e5f-8a9b-0c1d2e3f4a5b",
    });
    expect(withQuote.success).toBe(true);
    if (!withQuote.success || withQuote.data.paymentType !== "initial") return;
    expect(withQuote.data.quoteId).toBe("7b1f2e6a-3c4d-4e5f-8a9b-0c1d2e3f4a5b");
  });

  it("rejects a quote id that is not a uuid", () => {
    expect(parseCheckoutMetadata({ ...initial, quoteId: "Q-2026-001" }).success).toBe(false);
  });

  it("rejects an initial payment with a non-numeric or zero amount", () => {
    expect(
      parseCheckoutMetadata({ ...initial, firstPaymentAmount: "12.5" }).success
    ).toBe(false);
    expect(
      parseCheckoutMetadata({ ...initial, totalAmount: "0" }).success
    ).toBe(false);
  });

  it("parses a final payment by project id", () => {
    const result = parseCheckoutMetadata({
      paymentType: "final",
      projectId: "7b1f2e6a-3c4d-4e5f-8a9b-0c1d2e3f4a5b",
      projectCode: "AB3K9Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a final payment without a valid project id", () => {
    const result = parseCheckoutMetadata({
      paymentType: "final",
      projectId: "not-a-uuid",
      projectCode: "AB3K9Z",
    });
    expect(result.success).toBe(false);
  });

  it("tells our sessions apart from Payment Links or Dashboard ones", () => {
    expect(isOwnCheckoutSession(initial)).toBe(true);
    expect(isOwnCheckoutSession({ paymentType: "final" })).toBe(true);
    expect(isOwnCheckoutSession({ order: "42" })).toBe(false);
    expect(isOwnCheckoutSession(null)).toBe(false);
  });

  it("rejects an unknown payment type and an empty session", () => {
    expect(parseCheckoutMetadata({ paymentType: "other" }).success).toBe(false);
    expect(parseCheckoutMetadata(null).success).toBe(false);
  });
});
