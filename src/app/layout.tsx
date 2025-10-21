import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono, Iceland, Inter } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";

import "./globals.css";
import { Toaster } from "sonner";

import ConditionalLayout from "@/app/components/ConditionalLayout";
import Analytics from "@/app/components/Analytics";
import FacebookPixel from "@/app/components/FacebookPixel";
import LinkedInInsightTag from "@/app/components/LinkedInInsightTag";
import { siteConfig } from "@/config/site";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const FACEBOOK_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-iceland",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Conditional preconnects for analytics/ads */}
        {GOOGLE_ADS_ID && (
          <>
            <link rel="preconnect" href="https://googleads.g.doubleclick.net" />
            <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
          </>
        )}
        {FACEBOOK_PIXEL_ID && (
          <>
            <link rel="preconnect" href="https://connect.facebook.net" />
            <link rel="dns-prefetch" href="https://connect.facebook.net" />
            <link rel="preconnect" href="https://www.facebook.com" />
            <link rel="dns-prefetch" href="https://www.facebook.com" />
          </>
        )}
        {LINKEDIN_PARTNER_ID && (
          <>
            <link rel="preconnect" href="https://snap.licdn.com" />
            <link rel="dns-prefetch" href="https://snap.licdn.com" />
          </>
        )}

        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}

        {/* Facebook Pixel */}
        {FACEBOOK_PIXEL_ID && (
          <>
            <Script id="facebook-pixel" strategy="lazyOnload">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FACEBOOK_PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              <Image
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}

        {/* LinkedIn Insight Tag */}
        {LINKEDIN_PARTNER_ID && (
          <>
            <Script id="linkedin-insight" strategy="lazyOnload">
              {`
                _linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
                window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
                window._linkedin_data_partner_ids.push(_linkedin_partner_id);
                (function(l) {
                  if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
                  window.lintrk.q=[]}
                  var s = document.getElementsByTagName("script")[0];
                  var b = document.createElement("script");
                  b.type = "text/javascript";b.async = true;
                  b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
                  s.parentNode.insertBefore(b, s);
                })(window.lintrk);
              `}
            </Script>
            <noscript>
              <Image
                height="1"
                width="1"
                style={{ display: "none" }}
                alt=""
                src={`https://px.ads.linkedin.com/collect/?pid=${LINKEDIN_PARTNER_ID}&fmt=gif`}
              />
            </noscript>
          </>
        )}

        {/* Google Ads Conversion Tracking */}
        {GOOGLE_ADS_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-ads-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GOOGLE_ADS_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${iceland.variable} ${inter.variable} antialiased text-pretty bg-gray-950`}
      >
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}

        {/* Google Analytics - Mantener por ahora, migraremos a GTM después */}
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}

        <Suspense fallback={null}>
          <Analytics />
          <FacebookPixel />
          <LinkedInInsightTag />
        </Suspense>
        <VercelAnalytics />
        <Toaster position="bottom-right" richColors closeButton={true} />
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
