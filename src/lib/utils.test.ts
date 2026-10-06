import { describe, expect, it } from "vitest";
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  generateProjectCode,
  validateUSPhoneNumber,
} from "./utils";

describe("validateUSPhoneNumber", () => {
  it("accepts 10 digits with any formatting", () => {
    expect(validateUSPhoneNumber("(346) 375-7534")).toBe(true);
    expect(validateUSPhoneNumber("3463757534")).toBe(true);
  });

  it("accepts 11 digits only with a leading 1", () => {
    expect(validateUSPhoneNumber("+1 346 375 7534")).toBe(true);
    expect(validateUSPhoneNumber("23463757534")).toBe(false);
  });

  it("rejects other lengths", () => {
    expect(validateUSPhoneNumber("346375")).toBe(false);
    expect(validateUSPhoneNumber("")).toBe(false);
  });
});

describe("generateProjectCode", () => {
  it("returns 6 characters without ambiguous ones (I, O, 0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      expect(generateProjectCode()).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/);
    }
  });
});

describe("formatCurrency", () => {
  it("formats cents as USD", () => {
    expect(formatCurrency(100000)).toBe("$1,000.00");
    expect(formatCurrency(50)).toBe("$0.50");
    expect(formatCurrency(0)).toBe("$0.00");
  });
});

describe("formatDate", () => {
  it("formats Date and ISO strings", () => {
    const date = new Date(2026, 0, 15);
    expect(formatDate(date)).toBe("Jan 15, 2026");
    expect(formatDate(date, { month: "long" })).toBe("January 15, 2026");
  });

  it("returns N/A for null or invalid input", () => {
    expect(formatDate(null)).toBe("N/A");
    expect(formatDate("not a date")).toBe("N/A");
  });
});

describe("formatFileSize", () => {
  it("picks the unit by size", () => {
    expect(formatFileSize(null)).toBe("Unknown size");
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.00 KB");
    expect(formatFileSize(3 * 1024 * 1024)).toBe("3.00 MB");
  });
});
