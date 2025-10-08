/**
 * Generate metadata for a page in Next.js
 *
 * Requirements:
 * - Next.js 13.2.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * import { genPageMetadata } from "@/utils/genPageMetadata";
 *
 * export const metadata = genPageMetadata({
 *   title: "Page Title",
 *   description: "Page description",
 *   pageRoute: "/page-route",
 *   ogImg: "/og-custom.png", // optional
 * });
 */

import { Metadata } from "next";
import { siteConfig } from "@/config/site";

type PageMetadataProps = {
  title: string;
  description: string;
  pageRoute: string;
  ogImg?: string;
};

export function genPageMetadata({
  title,
  description,
  pageRoute,
  ogImg,
}: PageMetadataProps): Metadata {
  const url = `${siteConfig.baseUrl}${pageRoute}`;
  const ogImage = ogImg || siteConfig.defaultOgImg;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${siteConfig.siteName}`,
      description,
      url,
      siteName: siteConfig.siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.siteName}`,
      description,
      images: [ogImage],
      creator: siteConfig.social.twitter,
    },
  };
}
