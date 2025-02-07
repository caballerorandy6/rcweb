import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RCWebContextProvider from "@/context/rcWebContext";

//Components
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-pretty bg-gray-950`}
      >
        <RCWebContextProvider>
          <Header />
          {children}
        </RCWebContextProvider>
      </body>
    </html>
  );
}
