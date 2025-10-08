import type { Metadata } from "next";
import { Geist, Geist_Mono, Iceland, Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

import Header from "@/app/components/Header";
import Footer from "./components/Footer";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const iceland = Iceland({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-iceland",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${iceland.variable} ${inter.variable} antialiased text-pretty bg-gray-950`}
      >
        <Header />
        <Toaster position="bottom-right" richColors closeButton={true} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
