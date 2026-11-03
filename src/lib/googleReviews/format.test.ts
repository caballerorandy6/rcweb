import { describe, expect, it } from "vitest";
import { reviewOriginalText } from "./format";

describe("reviewOriginalText", () => {
  it("keeps only what the customer wrote when Google added a translation", () => {
    const comment =
      "(Translated by Google) Excellent work, delivered on time.\n\n(Original)\nExcelente trabajo, entregado a tiempo.";
    expect(reviewOriginalText(comment)).toBe("Excelente trabajo, entregado a tiempo.");
  });

  it("returns untranslated reviews untouched (trimmed)", () => {
    expect(reviewOriginalText("  Clean and modern site. ")).toBe("Clean and modern site.");
  });
});
