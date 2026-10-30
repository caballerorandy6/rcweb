import { NextResponse, type NextRequest } from "next/server";
import { buildContentSecurityPolicy, createCspNonce } from "@/lib/security/csp";

/**
 * Per-request Content Security Policy with a fresh nonce (see lib/security/csp).
 *
 * The policy travels twice: in the response, for the browser, and in the
 * request headers, where Next.js reads the `'nonce-…'` token and stamps it on
 * its own scripts and on every `next/script`. That needs pages rendered per
 * request, which the root layout forces (`dynamic = "force-dynamic"`).
 *
 * The other security headers are static and stay in next.config.ts.
 */
export function proxy(request: NextRequest) {
  const nonce = createCspNonce();
  const csp = buildContentSecurityPolicy(nonce, process.env.NODE_ENV === "development");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      // Pages only: API routes, the Sentry tunnel, Next's bundles and images
      // and files with an extension (sitemap.xml, robots.txt, fonts, icons)
      // carry no HTML, so they need no CSP. Router prefetches are skipped
      // too: the RSC payload has no script tags.
      source: "/((?!api|monitoring|_next/static|_next/image|.*\\..*).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
