import { describe, expect, it } from "vitest";
import { MAX_CHUNK_BYTES, MIN_CHUNK_BYTES, planChunks } from "./chunks";

describe("planChunks", () => {
  it("sends a small file whole", () => {
    const plan = planChunks(3_000_000);
    expect(plan).toEqual({
      chunkSize: 3_000_000,
      totalChunkCount: 1,
      ranges: [{ start: 0, end: 2_999_999 }],
    });
  });

  it("merges trailing bytes into the last chunk like TikTok's example", () => {
    const plan = planChunks(50_000_123);
    expect(plan.chunkSize).toBe(10_000_000);
    expect(plan.totalChunkCount).toBe(5);
    expect(plan.ranges.at(-1)).toEqual({ start: 40_000_000, end: 50_000_122 });
    const covered = plan.ranges.reduce((sum, r) => sum + (r.end - r.start + 1), 0);
    expect(covered).toBe(50_000_123);
  });

  it("keeps every chunk inside TikTok's limits", () => {
    for (const size of [5_500_000, 12_000_000, 99_999_999, 700_000_000]) {
      const plan = planChunks(size);
      expect(plan.chunkSize).toBeGreaterThanOrEqual(Math.min(size, MIN_CHUNK_BYTES));
      expect(plan.chunkSize).toBeLessThanOrEqual(MAX_CHUNK_BYTES);
      expect(plan.ranges[0].start).toBe(0);
      expect(plan.ranges.at(-1)?.end).toBe(size - 1);
      for (let i = 1; i < plan.ranges.length; i++) {
        expect(plan.ranges[i].start).toBe(plan.ranges[i - 1].end + 1);
      }
      expect(plan.totalChunkCount).toBeLessThanOrEqual(1000);
    }
  });

  it("rejects invalid sizes", () => {
    expect(() => planChunks(0)).toThrow();
    expect(() => planChunks(1.5)).toThrow();
    expect(() => planChunks(5 * 1024 * 1024 * 1024)).toThrow();
  });
});
