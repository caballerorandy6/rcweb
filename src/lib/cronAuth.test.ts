import { afterEach, describe, expect, it, vi } from "vitest";
import { isCronRequestAuthorized } from "./cronAuth";

const SECRET = "cron-secret-for-tests";

function request(authorization?: string) {
  return new Request("https://example.test/api/cron/maintenance-reports", {
    headers: authorization === undefined ? {} : { authorization },
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isCronRequestAuthorized", () => {
  it("accepts the bearer token Vercel sends", () => {
    vi.stubEnv("CRON_SECRET", SECRET);

    expect(isCronRequestAuthorized(request(`Bearer ${SECRET}`))).toBe(true);
  });

  it.each([
    ["no header", undefined],
    ["an empty header", ""],
    ["the secret without the scheme", SECRET],
    ["another scheme", `Basic ${SECRET}`],
    ["a wrong secret of the same length", `Bearer ${"x".repeat(SECRET.length)}`],
    ["the secret with something after it", `Bearer ${SECRET}x`],
    ["only the start of the secret", `Bearer ${SECRET.slice(0, -1)}`],
    ["a lowercase scheme", `bearer ${SECRET}`],
  ])("rejects %s", (_name, authorization) => {
    vi.stubEnv("CRON_SECRET", SECRET);

    expect(isCronRequestAuthorized(request(authorization))).toBe(false);
  });

  it("rejects everything while the secret is not configured", () => {
    vi.stubEnv("CRON_SECRET", "");

    expect(isCronRequestAuthorized(request("Bearer "))).toBe(false);
    expect(isCronRequestAuthorized(request("Bearer undefined"))).toBe(false);
    expect(isCronRequestAuthorized(request())).toBe(false);
  });
});
