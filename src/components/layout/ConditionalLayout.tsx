"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

// Rutas del panel admin que usan su propio layout sin header ni footer públicos.
const ADMIN_ROUTE_PREFIXES = [
  "/admin",
  "/admin-dashboard",
  "/contacts",
  "/newsletter",
  "/sms",
  "/projects",
  "/manage-invoices",
];

// Se compara por segmento completo: "/projects" coincide con "/projects" y
// "/projects/123", pero no con "/projects-portfolio", que es una página pública.
const isAdminRoute = (pathname: string | null) =>
  !!pathname &&
  ADMIN_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSiteChrome = isAdminRoute(pathname);

  return (
    <>
      {!hideSiteChrome && <Header />}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {!hideSiteChrome && <Footer />}
    </>
  );
}
