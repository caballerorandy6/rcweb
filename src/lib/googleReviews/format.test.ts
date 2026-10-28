import { describe, expect, it } from "vitest";
import { reviewDisplayText } from "./format";

describe("reviewDisplayText", () => {
  it("keeps only Google's translation of a review written in another language", () => {
    const comment =
      "(Translated by Google) Excellent work, delivered on time.\n\n(Original)\nExcelente trabajo, entregado a tiempo.";
    expect(reviewDisplayText(comment)).toBe("Excellent work, delivered on time.");
  });

  it("returns English reviews untouched (trimmed)", () => {
    expect(reviewDisplayText("  Clean and modern site. ")).toBe("Clean and modern site.");
  });
});
