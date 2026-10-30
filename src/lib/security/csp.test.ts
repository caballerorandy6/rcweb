import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, createCspNonce } from "./csp";

function directive(csp: string, name: string): string {
  const found = csp.split("; ").find((part) => part.startsWith(`${name} `));
  if (!found) throw new Error(`${name} missing in: ${csp}`);
  return found;
}

describe("buildContentSecurityPolicy", () => {
  const nonce = "dGVzdC1ub25jZQ==";

  it("trusts only nonced scripts and what they load", () => {
    const scriptSrc = directive(buildContentSecurityPolicy(nonce, false), "script-src");
    expect(scriptSrc).toContain(`'nonce-${nonce}'`);
    expect(scriptSrc).toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'unsafe-inline'");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  it("allows eval only in development", () => {
    expect(directive(buildContentSecurityPolicy(nonce, true), "script-src")).toContain(
      "'unsafe-eval'"
    );
  });

  it("keeps the hardening directives", () => {
    const csp = buildContentSecurityPolicy(nonce, false);
    expect(directive(csp, "object-src")).toBe("object-src 'none'");
    expect(directive(csp, "base-uri")).toBe("base-uri 'self'");
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'self'");
    expect(directive(csp, "form-action")).toContain("https://checkout.stripe.com");
  });

  it("is a single-line header", () => {
    expect(buildContentSecurityPolicy(nonce, false)).not.toMatch(/[\r\n]/);
  });
});

describe("createCspNonce", () => {
  it("is base64 and unique per call", () => {
    const a = createCspNonce();
    const b = createCspNonce();
    expect(a).toMatch(/^[A-Za-z0-9+/]+=*$/);
    expect(a).not.toBe(b);
  });
});
