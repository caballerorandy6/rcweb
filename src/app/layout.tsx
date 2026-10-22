import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import Script from "next/script";

import "./globals.css";
import { Toaster } from "sonner";

import ConditionalLayout from "@/components/layout/ConditionalLayout";
import CookieConsentProvider from "@/components/forms/CookieConsentProvider";
import Analytics from "@/components/tracking/Analytics";
import FacebookPixel from "@/components/tracking/FacebookPixel";
import LinkedInInsightTag from "@/components/tracking/LinkedInInsightTag";
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

        {/* Google Consent Mode v2 - Must load BEFORE gtag */}
        <Script
          id="google-consent-mode"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              // Default consent to denied for everything
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted',
                'wait_for_update': 500
              });
            `,
          }}
        />

        {/* Google tag (gtag.js), loaded once for Analytics and Google Ads.
            lazyOnload keeps it out of the TBT window; Ads is configured in
            CookieConsentProvider after consent on this same library. */}
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

        {/* COMMENTED: Google Tag Manager - Not using ads, uncomment if running ad campaigns
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
        */}

        {/* Note: Tracking preconnects moved to CookieConsentProvider (conditional based on consent) */}
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
        {/* Cookie Consent & Tracking Scripts */}
        <CookieConsentProvider />

        {/* Client-side tracking for route changes (only fires if user consented) */}
        <Suspense fallback={null}>
          <Analytics />
          <FacebookPixel />
          <LinkedInInsightTag />
          <UTMTracker />
        </Suspense>

        <Toaster position="top-center" richColors closeButton />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
