import { describe, expect, it } from "vitest";
import { effectiveTaxRate } from "./types";

describe("effectiveTaxRate", () => {
  it("derives the percentage from what was charged", () => {
    expect(effectiveTaxRate(100000, 6600)).toBe(6.6);
    expect(effectiveTaxRate(50000, 3300)).toBe(6.6);
  });
  it("is 0 when no tax was collected or there is nothing to tax", () => {
    expect(effectiveTaxRate(100000, 0)).toBe(0);
    expect(effectiveTaxRate(0, 0)).toBe(0);
  });
});
