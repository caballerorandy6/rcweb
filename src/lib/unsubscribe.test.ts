import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/projectUrl", () => ({ SITE_BASE_URL: "https://www.rcweb.dev" }));

import {
  isValidUnsubscribeToken,
  unsubscribeToken,
  unsubscribeUrl,
  withUnsubscribeLink,
} from "./unsubscribe";

beforeAll(() => {
  vi.stubEnv("AUTH_SECRET", "test-secret");
});

describe("unsubscribe token", () => {
  it("accepts the token of the same address, whatever its case", () => {
    const token = unsubscribeToken("Ana@Example.com");
    expect(isValidUnsubscribeToken("ana@example.com", token)).toBe(true);
  });

  it("rejects the token of another address", () => {
    expect(isValidUnsubscribeToken("luis@example.com", unsubscribeToken("ana@example.com"))).toBe(false);
  });

  it("rejects a missing, empty or altered token", () => {
    const token = unsubscribeToken("ana@example.com");
    expect(isValidUnsubscribeToken("ana@example.com", undefined)).toBe(false);
    expect(isValidUnsubscribeToken("ana@example.com", "")).toBe(false);
    expect(isValidUnsubscribeToken("ana@example.com", token.slice(0, -1))).toBe(false);
    expect(isValidUnsubscribeToken("ana@example.com", token.slice(0, -1) + (token.endsWith("A") ? "B" : "A"))).toBe(false);
  });

  it("depends on the secret", () => {
    const token = unsubscribeToken("ana@example.com");
    vi.stubEnv("AUTH_SECRET", "another-secret");
    expect(isValidUnsubscribeToken("ana@example.com", token)).toBe(false);
    vi.stubEnv("AUTH_SECRET", "test-secret");
  });
});

describe("unsubscribeUrl", () => {
  it("links to the page in the customer's language with the address and its token", () => {
    const url = new URL(unsubscribeUrl("Ana+news@Example.com", "es"));
    expect(url.origin + url.pathname).toBe("https://www.rcweb.dev/es/cancelar-suscripcion");
    expect(url.searchParams.get("email")).toBe("ana+news@example.com");
    expect(isValidUnsubscribeToken("ana+news@example.com", url.searchParams.get("token"))).toBe(true);
  });
});

describe("withUnsubscribeLink", () => {
  it("puts the recipient's link where the placeholder is", () => {
    const html = withUnsubscribeLink('<a href="{{unsubscribe_url}}">Unsubscribe</a>', "ana@example.com");
    expect(html).toBe(`<a href="${unsubscribeUrl("ana@example.com")}">Unsubscribe</a>`);
  });

  it("adds the link before </body> when the campaign has no placeholder", () => {
    const html = withUnsubscribeLink("<html><body><p>Hi</p></body></html>", "ana@example.com");
    expect(html).toContain(unsubscribeUrl("ana@example.com"));
    expect(html.indexOf("Unsubscribe")).toBeLessThan(html.indexOf("</body>"));
  });

  it("adds the link at the end of a fragment", () => {
    expect(withUnsubscribeLink("<p>Hi</p>", "ana@example.com")).toMatch(/^<p>Hi<\/p><p .*Unsubscribe<\/a><\/p>$/);
  });
});
