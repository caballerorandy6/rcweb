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

/** The default OG image (public/og-image.jpg) is 1200×630 */
const DEFAULT_OG_SIZE = { width: 1200, height: 630 };

type ArticleMetadata = {
  /** ISO date (YYYY-MM-DD) of publication */
  publishedTime: string;
  /** ISO date of the last material revision; omit when never revised */
  modifiedTime?: string;
  authors: string[];
  tags?: string[];
};

type PageMetadataProps = {
  title: string;
  description: string;
  pageRoute: string;
  ogImg?: string;
  noIndex?: boolean;
  /**
   * Blog posts: emits `og:type article` with its dates and author. The image
   * comes from the colocated `opengraph-image.tsx`; Next only applies that
   * file when `openGraph.images` is absent here, and Twitter inherits it, so
   * article pages deliberately set no image.
   */
  article?: ArticleMetadata;
};

export function genPageMetadata({
  title,
  description,
  pageRoute,
  ogImg,
  noIndex = false,
  article,
}: PageMetadataProps): Metadata {
  const url = `${siteConfig.baseUrl}${pageRoute}`;
  const ogImage = ogImg || siteConfig.defaultOgImg;
  const socialTitle = `${title} | ${siteConfig.siteName}`;

  const shared = {
    title: socialTitle,
    description,
    url,
    siteName: siteConfig.siteName,
    locale: "en_US",
  };

  const openGraph: Metadata["openGraph"] = article
    ? {
        ...shared,
        type: "article",
        publishedTime: article.publishedTime,
        modifiedTime: article.modifiedTime,
        authors: article.authors,
        tags: article.tags,
      }
    : {
        ...shared,
        type: "website",
        images: [{ url: ogImage, ...DEFAULT_OG_SIZE, alt: title }],
      };

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
        googleBot: {
          index: false,
          follow: false,
        },
      },
    }),
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      ...(!article && { images: [ogImage] }),
    },
  };
}
