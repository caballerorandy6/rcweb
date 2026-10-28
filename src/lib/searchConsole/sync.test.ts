import { describe, expect, it, vi } from "vitest";
import { pickTopItems } from "./sync";

vi.mock("@/lib/prisma", () => ({ prisma: {} }));
vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

const row = (day: string, key: string, clicks: number, impressions: number) => ({
  keys: [day, key],
  clicks,
  impressions,
  ctr: impressions ? clicks / impressions : 0,
  position: 5,
});

describe("pickTopItems", () => {
  it("keeps the top N per day ordered by clicks, then impressions", () => {
    const rows = [
      row("2026-10-20", "a", 1, 10),
      row("2026-10-20", "b", 0, 50),
      row("2026-10-20", "c", 0, 5),
      row("2026-10-21", "d", 3, 3),
    ];
    const items = pickTopItems(rows, "QUERY", 2);
    expect(items.map((i) => [i.date.toISOString().slice(0, 10), i.key])).toEqual([
      ["2026-10-20", "a"],
      ["2026-10-20", "b"],
      ["2026-10-21", "d"],
    ]);
    expect(items[0]).toMatchObject({ dimension: "QUERY", clicks: 1, impressions: 10, position: 5 });
  });

  it("returns nothing for an empty response", () => {
    expect(pickTopItems([], "PAGE", 100)).toEqual([]);
  });
});
