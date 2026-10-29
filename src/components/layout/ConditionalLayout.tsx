"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { isAdminPath } from "@/config/adminRoutes";

// The admin area has its own layout (sidebar) and no public header or footer.
export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideSiteChrome = isAdminPath(pathname);

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
