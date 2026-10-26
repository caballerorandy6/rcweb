import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPosts } from "@/lib/blog";
import { offers } from "@/lib/data";
import { LEGAL_LAST_UPDATED } from "@/lib/company";

type StaticRoute = {
  route: string;
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
  { route: "/", lastModified: "2026-10-25", changeFrequency: "weekly", priority: 1.0 },
  { route: "/about", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.8 },
  { route: "/blog", lastModified: "2026-10-22", changeFrequency: "weekly", priority: 0.8 },
  { route: "/schedule", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.9 },
  { route: "/projects-portfolio", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.8 },
  { route: "/case-study/clinica-gessner", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.7 },
  { route: "/case-study/clinica-airline", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.7 },
  { route: "/case-study/leos-home-experts", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.7 },
  { route: "/case-study/dulce-antojo", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.7 },
  { route: "/case-study/gsmactx", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.7 },
  { route: "/web-developer-houston-tx", lastModified: "2026-10-22", changeFrequency: "monthly", priority: 0.9 },
  { route: "/services", lastModified: "2026-10-25", changeFrequency: "monthly", priority: 0.9 },
  ...offers.map((offer) => ({
    route: `/services/${offer.slug}`,
    lastModified: "2026-10-25",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  })),
  { route: "/privacy-policy", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
  { route: "/terms-of-service", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
  { route: "/refund-policy", lastModified: LEGAL_LAST_UPDATED.version, changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map(({ route, ...rest }) => ({
    url: `${siteConfig.baseUrl}${route}`,
    ...rest,
  }));

  const postEntries = getAllPosts().map((post) => ({
    url: `${siteConfig.baseUrl}/blog/${post.slug}`,
    lastModified: post.date || undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...postEntries];
}
