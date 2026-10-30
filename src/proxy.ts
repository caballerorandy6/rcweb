import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROUTE_PREFIXES } from "@/config/adminRoutes";
import { routing } from "@/i18n/routing";
import { buildContentSecurityPolicy, createCspNonce } from "@/lib/security/csp";

const handleI18nRouting = createIntlMiddleware(routing);

/**
 * Two jobs per page request:
 *
 * 1. Language routing (next-intl). English keeps its unprefixed URLs and is
 *    rewritten internally to `/en/...`; `/es/...` with translated slugs is
 *    rewritten to the matching `[locale]` route (`/es/sobre-mi` →
 *    `/es/about`). Nobody is redirected by browser language or cookie; the
 *    URL alone decides (see lib/i18n/routing).
 *
 * 2. Content Security Policy with a fresh nonce (see lib/security/csp). The
 *    policy travels twice: in the request headers, where Next.js reads the
 *    `'nonce-…'` token and stamps it on its own scripts and on every
 *    `next/script`, and in the response, for the browser. That needs pages
 *    rendered per request, which the root layout forces
 *    (`dynamic = "force-dynamic"`).
 *
 * The other security headers are static and stay in next.config.ts.
 */
export function proxy(request: NextRequest) {
  const nonce = createCspNonce();
  const csp = buildContentSecurityPolicy(nonce, process.env.NODE_ENV === "development");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", csp);

  // The backoffice has no locale segment: skip the language routing (which
  // would rewrite /admin-dashboard to /en/admin-dashboard) and only add the CSP.
  const response = isBackofficePath(request.nextUrl.pathname)
    ? NextResponse.next({ request: { headers: requestHeaders } })
    : // next-intl forwards the incoming request headers into its rewrite, so
      // the nonce reaches the renderer through a request that already carries it.
      handleI18nRouting(new NextRequest(request, { headers: requestHeaders }));
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

/** Admin pages, their login and the internal tools (see app/(backoffice)) */
const BACKOFFICE_PREFIXES = [...ADMIN_ROUTE_PREFIXES, "/tools"];

function isBackofficePath(pathname: string): boolean {
  return BACKOFFICE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export const config = {
  matcher: [
    {
      // Pages only: API routes, the Sentry tunnel, Next's bundles and images
      // and files with an extension (sitemap.xml, robots.txt, fonts, icons)
      // carry no HTML, so they need neither locale nor CSP. Router
      // prefetches do go through: `/es/sobre-mi` only exists after the
      // locale rewrite, payload or page alike.
      source: "/((?!api|monitoring|_next/static|_next/image|.*\\..*).*)",
    },
  ],
};
