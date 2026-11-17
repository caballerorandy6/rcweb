import { describe, expect, it } from "vitest";
import { nextInvoiceNumber, validateInvoiceNumber } from "./generateInvoiceNumber";

describe("nextInvoiceNumber", () => {
  it("starts the year at 001", () => {
    expect(nextInvoiceNumber([], 2026)).toBe("INV-2026-001");
  });

  it("follows the highest number of the year, whatever the order", () => {
    expect(
      nextInvoiceNumber(["INV-2026-002", "INV-2026-011", "INV-2026-001"], 2026)
    ).toBe("INV-2026-012");
  });

  it("ignores other years and malformed numbers", () => {
    expect(
      nextInvoiceNumber(["INV-2025-500", "INV-2026-003", "INV-2026-abc", "garbage"], 2026)
    ).toBe("INV-2026-004");
  });

  it("goes past 999 instead of handing out 1000 forever", () => {
    expect(nextInvoiceNumber(["INV-2026-999"], 2026)).toBe("INV-2026-1000");
    // Sorted as text, "999" comes after "1000": the highest number must win
    expect(nextInvoiceNumber(["INV-2026-999", "INV-2026-1000"], 2026)).toBe(
      "INV-2026-1001"
    );
  });
});

describe("validateInvoiceNumber", () => {
  it("accepts three or more digits", () => {
    expect(validateInvoiceNumber("INV-2026-001")).toBe(true);
    expect(validateInvoiceNumber("INV-2026-1000")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(validateInvoiceNumber("INV-2026-01")).toBe(false);
    expect(validateInvoiceNumber("INV-26-001")).toBe(false);
    expect(validateInvoiceNumber("INV-2026-001.pdf")).toBe(false);
    expect(validateInvoiceNumber("../INV-2026-001")).toBe(false);
  });
});
