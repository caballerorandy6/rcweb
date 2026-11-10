import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_ROUTE_PREFIXES } from "@/config/adminRoutes";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createIntlMiddleware(routing);

/**
 * Language routing (next-intl). English keeps its unprefixed URLs and is
 * rewritten internally to `/en/...`; `/es/...` with translated slugs is
 * rewritten to the matching `[locale]` route (`/es/sobre-mi` → `/es/about`).
 * Nobody is redirected by browser language or cookie; the URL alone decides
 * (see lib/i18n/routing).
 *
 * The security headers, Content-Security-Policy included, are static and
 * live in next.config.ts, so the pages behind these rewrites can be
 * prerendered.
 */
export function proxy(request: NextRequest) {
  // The backoffice has no locale segment: skip the language routing, which
  // would rewrite /admin-dashboard to /en/admin-dashboard.
  if (isBackofficePath(request.nextUrl.pathname)) return NextResponse.next();
  // `/en/...` is the internal path of the English pages. next-intl sends it to
  // the unprefixed URL with a 307; a 308 tells Google the move is permanent.
  const unprefixed = stripDefaultLocale(request.nextUrl.pathname);
  if (unprefixed !== null) {
    const url = request.nextUrl.clone();
    url.pathname = unprefixed;
    return NextResponse.redirect(url, 308);
  }
  return handleI18nRouting(request);
}

/** `/en` → `/`, `/en/blog/x` → `/blog/x`; null when the path has no `/en` prefix */
function stripDefaultLocale(pathname: string): string | null {
  if (pathname === "/en") return "/";
  return pathname.startsWith("/en/") ? pathname.slice(3) : null;
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
      // carry no locale. Router
      // prefetches do go through: `/es/sobre-mi` only exists after the
      // locale rewrite, payload or page alike.
      source: "/((?!api|monitoring|_next/static|_next/image|.*\\..*).*)",
    },
  ],
};
