"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { isAdminPath } from "@/config/adminRoutes";

type ConditionalLayoutProps = {
  children: ReactNode;
  /** Rendered by the server layout (Footer reads translations on the server) */
  header: ReactNode;
  footer: ReactNode;
};

// The admin area has its own layout (sidebar) and no public header or footer.
export default function ConditionalLayout({
  children,
  header,
  footer,
}: ConditionalLayoutProps) {
  const pathname = usePathname();
  const hideSiteChrome = isAdminPath(pathname);

  return (
    <>
      {!hideSiteChrome && header}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {!hideSiteChrome && footer}
    </>
  );
}
