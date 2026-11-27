import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Every export of a "use server" file is an HTTP endpoint anyone can call,
// whatever page imports it: the admin layout does not protect it. So each
// one either calls requireAdmin() or is listed here as public on purpose.
const PUBLIC_ACTIONS: Record<string, string> = {
  signOutAction: "ends the caller's own session",
  createContactAction: "contact form (reCAPTCHA); the admin branch checks the session",
  subscribeToBlogAction: "newsletter sign-up form",
  unsubscribeFromEmailAction: "unsubscribe link in emails",
  createStripeCheckoutAction: "subscription Checkout from the pricing page",
  acceptQuoteAction: "customer link, by quote token",
  requestZellePaymentAction: "customer link, by quote token",
  createFinalPaymentSessionAction: "customer form, by email + project code",
  verifyProjectAccessAction: "customer form, by email + project code",
  getPublicMilestonesAction: "customer link, by project access token",
  sendPortalLinkAction: "emails the portal link to the subscription's own address",
};

const SRC = join(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "generated" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const serverFiles = sourceFiles(SRC)
  .map((path) => ({ path: relative(SRC, path), code: readFileSync(path, "utf8") }))
  .filter(({ code }) => /^\s*["']use server["']/.test(code));

/** Each exported function with the source that runs until the next export */
function exportedFunctions(code: string) {
  const starts = [...code.matchAll(/^export\s+(?:async\s+function|function|const)\s+(\w+)/gm)];
  return starts.map((match, i) => ({
    name: match[1],
    body: code.slice(match.index, starts[i + 1]?.index ?? code.length),
  }));
}

describe("Server Action access", () => {
  it("finds the action files", () => {
    expect(serverFiles.length).toBeGreaterThan(50);
  });

  it('keeps "use server" inside src/actions', () => {
    expect(serverFiles.filter(({ path }) => !path.startsWith("actions/")).map(({ path }) => path)).toEqual([]);
  });

  it("guards every export with requireAdmin() unless it is listed as public", () => {
    const unguarded = serverFiles.flatMap(({ path, code }) =>
      exportedFunctions(code)
        .filter(({ name, body }) => !(name in PUBLIC_ACTIONS) && !/await requireAdmin\(\)/.test(body))
        .map(({ name }) => `${path}: ${name}`)
    );
    expect(unguarded).toEqual([]);
  });

  it("lists as public only actions that exist and are not admin-only", () => {
    const exported = new Map(
      serverFiles.flatMap(({ code }) => exportedFunctions(code).map(({ name, body }) => [name, body] as const))
    );
    for (const name of Object.keys(PUBLIC_ACTIONS)) {
      expect(exported.has(name), name).toBe(true);
      expect(/await requireAdmin\(\)/.test(exported.get(name) ?? ""), name).toBe(false);
    }
  });
});
