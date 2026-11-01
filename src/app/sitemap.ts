import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import { offers } from "@/lib/data";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import { languageAlternates, localizePathname } from "@/i18n/paths";
import { routing, type AppPathname } from "@/i18n/routing";

type Params = Record<string, string | number>;

type StaticRoute = {
  pathname: AppPathname;
  params?: Params;
  /** Date of the last content change (YYYY-MM-DD). Bump it when the page changes. */
  lastModified: string;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

/**
 * Public pages. `lastModified` is a real date (from the last change to the
 * page or its sections), never "today": a sitemap that claims every page
 * changed every day teaches Google to ignore the field.
 */
const STATIC_ROUTES: StaticRoute[] = [
  { pathname: "/", lastModified: "2026-10-25", changeFrequency: "weekly", priority: 1.0 },
  { pathname: "/about", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.8 },
  { pathname: "/blog", lastModified: "2026-10-22", changeFrequency: "weekly", priority: 0.8 },
  { pathname: "/schedule", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.9 },
  { pathname: "/projects-portfolio", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.8 },
  { pathname: "/case-study/clinica-gessner", lastModified: "2026-11-01", changeFrequency: "monthly", priority: 0.7 },
  { pathname: "/case-study/clinica-airline", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.7 },
  { pathname: "/case-study/leos-home-experts", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.7 },
  { pathname: "/case-study/dulce-antojo", lastModified: "2026-11-01", changeFrequency: "monthly", priority: 0.7 },
  { pathname: "/case-study/gsmactx", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.7 },
  { pathname: "/web-developer-houston-tx", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.9 },
  { pathname: "/services", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.9 },
  ...offers.map((offer) => ({
    pathname: "/services/[slug]" as const,
    params: { slug: offer.slug },
    lastModified: "2026-10-25",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { pathname: "/privacy-policy", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
  { pathname: "/terms-of-service", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
  { pathname: "/refund-policy", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
];

type EntryFields = Pick<MetadataRoute.Sitemap[number], "lastModified" | "changeFrequency" | "priority">;

/**
 * One `<url>` per language for a page that exists in both, each listing the
 * other language and `x-default` as alternates (Google reads hreflang from
 * the sitemap as well as from `<head>`).
 */
function localizedEntries(pathname: AppPathname, params: Params | undefined, fields: EntryFields): MetadataRoute.Sitemap {
  const languages = languageAlternates(siteConfig.baseUrl, pathname, params);
  return routing.locales.map((locale) => ({
    url: `${siteConfig.baseUrl}${localizePathname(pathname, locale, params)}`,
    alternates: { languages },
    ...fields,
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.flatMap(({ pathname, params, ...fields }) =>
    localizedEntries(pathname, params, fields)
  );

  // English posts define the list; a post appears in Spanish (and with
  // alternates) only once its translation exists in content/blog/es.
  const postEntries = getAllPosts().flatMap((post) => {
    const fields: EntryFields = {
      lastModified: post.updated || post.date || undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    };
    const params = { slug: post.slug };
    if (post.translations.length === routing.locales.length) {
      return localizedEntries("/blog/[slug]", params, fields);
    }
    return [{ url: `${siteConfig.baseUrl}${localizePathname("/blog/[slug]", "en", params)}`, ...fields }];
  });

  return [...staticEntries, ...postEntries];
}
