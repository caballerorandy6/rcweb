import type { Metadata } from "next";
import { Geist, Geist_Mono, Iceland, Inter } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

// Components
import Header from "@/app/components/Header";
import Footer from "./components/Footer";

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
  title: {
    default: "RC Web",
    template: "%s | Randy Caballero",
  },
  description: "Randy Caballero Personal Portfolio.",
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
