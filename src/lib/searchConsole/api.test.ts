import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/searchConsole/auth", () => ({
  getSearchConsoleAccessToken: vi.fn(async () => "token"),
}));

import { querySearchAnalytics, SearchConsoleApiError } from "./api";

const config = {
  GCP_PROJECT_NUMBER: "1",
  GCP_SERVICE_ACCOUNT_EMAIL: "sa@example.iam.gserviceaccount.com",
  GCP_WORKLOAD_IDENTITY_POOL_ID: "vercel",
  GCP_WORKLOAD_IDENTITY_POOL_PROVIDER_ID: "vercel",
  SEARCH_CONSOLE_SITE_URL: "sc-domain:example.com",
};

const row = (i: number) => ({ keys: [`k${i}`], clicks: i, impressions: i, ctr: 1, position: 1 });

afterEach(() => vi.unstubAllGlobals());

describe("querySearchAnalytics", () => {
  it("follows startRow until a page comes back short", async () => {
    const bodies: Array<{ startRow: number; rowLimit: number }> = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, init: RequestInit) => {
        const body = JSON.parse(String(init.body));
        bodies.push({ startRow: body.startRow, rowLimit: body.rowLimit });
        const rows = body.startRow === 0 ? [row(1), row(2)] : [row(3)];
        return new Response(JSON.stringify({ rows }), { status: 200 });
      })
    );

    const rows = await querySearchAnalytics(config, {
      startDate: "2026-10-01",
      endDate: "2026-10-07",
      dimensions: ["query"],
      rowLimit: 2,
    });

    expect(rows.map((r) => r.keys[0])).toEqual(["k1", "k2", "k3"]);
    expect(bodies).toEqual([
      { startRow: 0, rowLimit: 2 },
      { startRow: 2, rowLimit: 2 },
    ]);
  });

  it("treats a missing rows array as empty and surfaces HTTP errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 200 })));
    await expect(
      querySearchAnalytics(config, { startDate: "2026-10-01", endDate: "2026-10-07", dimensions: ["date"] })
    ).resolves.toEqual([]);

    vi.stubGlobal("fetch", vi.fn(async () => new Response("quota", { status: 429 })));
    await expect(
      querySearchAnalytics(config, { startDate: "2026-10-01", endDate: "2026-10-07", dimensions: ["date"] })
    ).rejects.toBeInstanceOf(SearchConsoleApiError);
  });
});
