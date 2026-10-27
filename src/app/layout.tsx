import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "sonner";

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import MarketingPixels from "@/components/tracking/MarketingPixels";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import UTMTracker from "@/components/tracking/UTMTracker";
import { siteConfig } from "@/config/site";

const iceland = localFont({
  src: "./fonts/Iceland.woff2",
  variable: "--next-font-iceland",
  display: "swap",
  weight: "400",
  preload: true,
});

const inter = localFont({
  src: "./fonts/InterVF-latin.woff2", // latin + latin-ext subset (85 KB vs 230 KB)
  variable: "--next-font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.siteNameShort} | Custom Websites & Web Apps for Small Businesses`,
    template: `%s | ${siteConfig.siteNameShort}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteNameShort} | Custom Websites & Web Apps for Small Businesses`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImg,
        width: 1200,
        height: 630,
        alt: `${siteConfig.siteNameShort} - ${siteConfig.author.name} Web Development Services`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.siteNameShort} | Custom Websites & Web Apps for Small Businesses`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImg],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code", // Not needed - already verified via another method
    other: {
      "p:domain_verify": "0340a7e019235de2546885b39d869e08",
    },
  },
  other: {
    "theme-color": "#030712",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: siteConfig.siteNameShort,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

/** Ad pixels ship only while a paid campaign is configured (see MarketingPixels). */
const hasMarketingPixels = Boolean(
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
    process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID ||
    process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${iceland.variable} ${inter.variable}`}
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
          Skip to main content
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

        <Toaster position="top-center" richColors closeButton />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
