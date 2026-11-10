import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import { Suspense } from "react";
import Script from "next/script";

import "../globals.css";
import { Toaster } from "sonner";

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MarketingPixels from "@/components/tracking/MarketingPixels";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import UTMTracker from "@/components/tracking/UTMTracker";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { localizedRootMetadata, rootMetadata } from "@/config/metadata";
import { routing } from "@/i18n/routing";
import { pickClientMessages } from "@/i18n/clientMessages";

/** Site-wide defaults in the page language: title template, description, OG */
export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return rootMetadata;
  return localizedRootMetadata(locale, await getTranslations({ locale, namespace: "Metadata" }));
}

// Both languages are prerendered. Pages with per-customer data (tokens,
// Checkout results) opt into per-request rendering on their own.
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export const dynamicParams = false;

/** Ad pixels ship only while a paid campaign is configured (see MarketingPixels). */
const hasMarketingPixels = Boolean(
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
    process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
);

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  // Lets next-intl read the locale without request headers (static rendering)
  setRequestLocale(locale);

  const [messages, t] = await Promise.all([getMessages(), getTranslations("Common")]);

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Note: next/font handles font preconnects automatically */}

        {/* Google Consent Mode v2. Measurement is on by default; a visitor who
            switched it off in the Privacy Policy is honoured before gtag.js
            runs. The key must match ANALYTICS_OPT_OUT_KEY in lib/analyticsOptOut. */}
        <Script
          id="google-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              try {
                if (localStorage.getItem('analytics-opt-out') === '1') {
                  gtag('consent', 'default', {
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'analytics_storage': 'denied',
                    'functionality_storage': 'denied',
                    'personalization_storage': 'denied'
                  });
                }
              } catch (e) {}
            `,
          }}
        />

        {/* Google tag (gtag.js), loaded once for Analytics and Google Ads.
            lazyOnload keeps it out of the TBT window; Ads is configured in
            MarketingPixels on this same library when a campaign runs. */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics-init"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                'anonymize_ip': true,
                'cookie_flags': 'SameSite=None;Secure'
              });
            `,
          }}
        />
      </head>
      <body
        className="antialiased text-pretty bg-gray-950"
      >
        {/* Skip to main content link for accessibility (WCAG 2.1 Level A) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-gold focus:text-black focus:rounded-lg focus:font-semibold focus:outline-hidden"
        >
          {t("skipToContent")}
        </a>
        {/* Ad pixels only while a paid campaign is configured (see MarketingPixels) */}
        {hasMarketingPixels ? <MarketingPixels /> : null}

        {/* Route-change tracking for Meta Pixel and UTM capture. GA4 page views
            on navigation come from its own enhanced measurement (history
            changes), so there is no manual page_view here. */}
        <Suspense fallback={null}>
          <FacebookPixel />
          <UTMTracker />
        </Suspense>

        <Toaster position="top-center" richColors closeButton containerAriaLabel={t("notifications")} />
        {/* Client components only get the namespaces they use (see clientMessages) */}
        <NextIntlClientProvider messages={pickClientMessages(messages)}>
          <ConditionalLayout header={<Header />} footer={<Footer />}>
            {children}
          </ConditionalLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
