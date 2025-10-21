import type { Metadata } from "next";
import { Geist, Geist_Mono, Iceland, Inter } from "next/font/google";
import { Suspense } from "react";

import "./globals.css";
import { Toaster } from "sonner";

import ConditionalLayout from "@/app/components/ConditionalLayout";
import CookieConsentProvider from "@/app/components/CookieConsentProvider";
import Analytics from "@/app/components/Analytics";
import FacebookPixel from "@/app/components/FacebookPixel";
import LinkedInInsightTag from "@/app/components/LinkedInInsightTag";
import { siteConfig } from "@/config/site";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Not critical
});

const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-iceland",
  display: "swap",
  preload: true, // Used in headings
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true, // Primary body font
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: {
    default: `${siteConfig.siteNameShort} - Full-Stack Web Development Services`,
    template: `%s | ${siteConfig.siteNameShort}`,
  },
  description: siteConfig.description,
  keywords: [
    "web development",
    "Next.js developer",
    "React developer",
    "full-stack developer",
    "freelance web developer",
    "custom web applications",
    siteConfig.author.name,
    "web development services",
  ],
  authors: [{ name: siteConfig.author.name }],
  creator: siteConfig.author.name,
  publisher: siteConfig.siteName,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.baseUrl,
    siteName: siteConfig.siteName,
    title: `${siteConfig.siteNameShort} - Professional Web Development Services`,
    description:
      "Full-stack web development services specializing in Next.js and React. Custom solutions for your business needs.",
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
    title: `${siteConfig.siteNameShort} - Professional Web Development Services`,
    description:
      "Full-stack web development services specializing in Next.js and React.",
    images: [siteConfig.defaultOgImg],
    creator: siteConfig.social.twitter,
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        {/* Critical preconnects for fonts - always needed regardless of consent */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Note: Tracking preconnects moved to CookieConsentProvider (conditional based on consent) */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${iceland.variable} ${inter.variable} antialiased text-pretty bg-gray-950`}
      >
        {/* Cookie Consent & Tracking Scripts */}
        <CookieConsentProvider />

        {/* Client-side tracking for route changes (only fires if user consented) */}
        <Suspense fallback={null}>
          <Analytics />
          <FacebookPixel />
          <LinkedInInsightTag />
        </Suspense>

        {/* Vercel Analytics (essential, no personal data) */}
        <VercelAnalytics />

        <Toaster position="bottom-right" richColors closeButton={true} />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
