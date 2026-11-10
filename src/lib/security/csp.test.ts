import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy } from "./csp";

function directive(csp: string, name: string): string {
  const found = csp.split("; ").find((part) => part.startsWith(`${name} `));
  if (!found) throw new Error(`${name} missing in: ${csp}`);
  return found;
}

describe("buildContentSecurityPolicy", () => {
  it("allows inline scripts and the listed hosts only, without nonces", () => {
    const scriptSrc = directive(buildContentSecurityPolicy(false), "script-src");
    expect(scriptSrc).toContain("'unsafe-inline'");
    expect(scriptSrc).toContain("https://www.googletagmanager.com");
    // 'strict-dynamic' would make browsers ignore 'unsafe-inline' and the hosts
    expect(scriptSrc).not.toContain("'strict-dynamic'");
    expect(scriptSrc).not.toContain("'nonce-");
    expect(scriptSrc).not.toContain("'unsafe-eval'");
  });

  it("allows eval only in development", () => {
    expect(directive(buildContentSecurityPolicy(true), "script-src")).toContain("'unsafe-eval'");
  });

  it("keeps the hardening directives", () => {
    const csp = buildContentSecurityPolicy(false);
    expect(directive(csp, "object-src")).toBe("object-src 'none'");
    expect(directive(csp, "base-uri")).toBe("base-uri 'self'");
    expect(directive(csp, "frame-ancestors")).toBe("frame-ancestors 'self'");
    expect(directive(csp, "form-action")).toContain("https://checkout.stripe.com");
  });

  it("is a single-line header", () => {
    expect(buildContentSecurityPolicy(false)).not.toMatch(/[\r\n]/);
  });
});
