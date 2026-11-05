/**
 * Page metadata: title, description, canonical, Open Graph and Twitter cards,
 * plus the hreflang pairs when the page exists in both languages.
 *
 * Usage (public page, localized):
 *   export async function generateMetadata({ params }: PageProps<"/[locale]/services">) {
 *     const { locale } = await params;
 *     const t = await getTranslations({ locale, namespace: "Services.metadata" });
 *     return genPageMetadata({ title: t("title"), description: t("description"), locale, pathname: "/services" });
 *   }
 *
 * Backoffice pages (no translation) pass `pageRoute` instead of `pathname`.
 */

import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { localizePathname, languageAlternates } from "@/i18n/paths";
import { routing, type AppPathname, type Locale } from "@/i18n/routing";

/** The default OG image (public/og-image.jpg) is 1200×630 */
const DEFAULT_OG_SIZE = { width: 1200, height: 630 };

const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };

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
  /** Language of this rendering; English when omitted */
  locale?: Locale;
  /** Internal pathname (key of routing.pathnames); emits canonical + hreflang */
  pathname?: AppPathname;
  /** Values for the dynamic segments of `pathname` */
  params?: Record<string, string | number>;
  /** Pages with one language only (hreflang off): the plain route, e.g. "/admin/login" */
  pageRoute?: string;
  /** Skip hreflang although the pathname is bilingual (e.g. a post without translation) */
  hreflang?: boolean;
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
  locale = routing.defaultLocale,
  pathname,
  params,
  pageRoute,
  hreflang = true,
  ogImg,
  noIndex = false,
  article,
}: PageMetadataProps): Metadata {
  const route = pathname ? localizePathname(pathname, locale, params) : (pageRoute ?? "/");
  const url = `${siteConfig.baseUrl}${route}`;
  const ogImage = ogImg || siteConfig.defaultOgImg;
  // A title that already carries the brand (the home page) does not repeat it
  const socialTitle = title.includes(siteConfig.siteNameShort) ? title : `${title} | ${siteConfig.siteName}`;

  const shared = {
    title: socialTitle,
    description,
    url,
    siteName: siteConfig.siteName,
    locale: OG_LOCALE[locale],
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
    // Skip the layout's "| RC Web Solutions" template when the brand is already there
    title: socialTitle === title ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      ...(pathname &&
        hreflang && { languages: languageAlternates(siteConfig.baseUrl, pathname, params) }),
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
