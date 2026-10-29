import type { Route } from "next";

// Single source of truth for the admin area paths. The sidebar builds its
// menu from these and ConditionalLayout hides the public header/footer on
// them, so a new admin page cannot end up with the public chrome by mistake.
export const ADMIN_ROUTES = {
  dashboard: "/admin-dashboard",
  contacts: "/contacts",
  quotes: "/quotes",
  projects: "/projects",
  invoices: "/manage-invoices",
  subscriptions: "/subscriptions",
  newsletter: "/newsletter",
  sms: "/sms",
} as const satisfies Record<string, Route>;

export const ADMIN_LOGIN_ROUTE = "/admin/login" as const satisfies Route;

// Path prefixes rendered without the public header and footer. They are
// matched by whole segment: "/projects" covers "/projects/123" but not the
// public "/projects-portfolio".
export const ADMIN_ROUTE_PREFIXES: readonly string[] = [
  "/admin",
  ...Object.values(ADMIN_ROUTES),
];

export const isAdminPath = (pathname: string | null) =>
  !!pathname &&
  ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
