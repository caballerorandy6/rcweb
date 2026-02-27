"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/contacts") || pathname?.startsWith("/newsletter") || pathname?.startsWith("/sms") || pathname?.startsWith("/projects") || pathname?.startsWith("/manage-invoices");

  return (
    <>
      {!isAdminRoute && <Header />}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
