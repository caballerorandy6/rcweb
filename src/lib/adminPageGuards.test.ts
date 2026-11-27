import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Next.js renders a layout and its page at the same time, so the session
// check in the admin layout does not stop a page from reading the database:
// the rows travel in the RSC payload next to the redirect. A Server Component
// that queries Prisma itself must check the session first. (Pages that load
// their data through Server Actions are covered by actionGuards.test.ts.)

const SRC = join(process.cwd(), "src");

function componentFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return componentFiles(path);
    return name.endsWith(".tsx") ? [path] : [];
  });
}

const prismaComponents = [join(SRC, "app"), join(SRC, "components")]
  .flatMap(componentFiles)
  .map((path) => ({ path: relative(SRC, path), code: readFileSync(path, "utf8") }))
  .filter(({ code }) => /from "@\/lib\/prisma"/.test(code));

// Customer pages: the unguessable token in the URL is the credential
const PUBLIC_PRISMA_COMPONENTS: Record<string, string> = {
  "app/[locale]/quote/[token]/page.tsx": "quote, by its token",
  "app/[locale]/pay/[token]/page.tsx": "final payment, by the project's payment token",
  "app/[locale]/manage-subscription/[token]/page.tsx": "billing portal, by the subscription's token",
  "app/[locale]/payment-success/page.tsx": "receipt, by the Checkout Session id Stripe returns",
};

describe("Server Components that read the database", () => {
  it("finds them", () => {
    expect(prismaComponents.length).toBeGreaterThan(4);
  });

  it("lists as public only files that exist", () => {
    const paths = prismaComponents.map(({ path }) => path);
    for (const path of Object.keys(PUBLIC_PRISMA_COMPONENTS)) expect(paths).toContain(path);
  });

  it("check the admin session before the first query unless listed as public", () => {
    const unguarded = prismaComponents
      .filter(({ path }) => !(path in PUBLIC_PRISMA_COMPONENTS))
      .filter(({ code }) => {
        const guard = code.indexOf("await requireAdminPage()");
        const firstQuery = code.indexOf("prisma.");
        return guard === -1 || guard > firstQuery;
      })
      .map(({ path }) => path);

    expect(unguarded).toEqual([]);
  });
});
