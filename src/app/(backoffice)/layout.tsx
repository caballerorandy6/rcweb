import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Toaster } from "sonner";

import "../globals.css";
import { fontVariables } from "@/app/fonts";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { rootMetadata } from "@/config/metadata";
import { pickClientMessages } from "@/i18n/clientMessages";

export const metadata: Metadata = rootMetadata;

// Per-request rendering: the CSP nonce (src/proxy.ts) is stamped at render time
export const dynamic = "force-dynamic";

/**
 * Root layout for everything that has no public, translated version: the
 * admin area, its login and the internal tools. English only, no locale
 * segment, no analytics. The public site lives under `app/[locale]`.
 */
export default async function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="antialiased text-pretty bg-gray-950">
        <Toaster position="top-center" richColors closeButton />
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          <ConditionalLayout header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
