/**
 * Generate the sitemap.xml file for a Next.js site
 *
 * Requirements:
 * - Next.js 13.3.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * 1. Update the manualRoutes array below with your site's routes
 * 2. Set the lastModified date for each route (format: YYYY-MM-DD)
 * 3. Optionally set changeFrequency and priority for each route
 * 4. The sitemap will be available at /sitemap.xml
 */

import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

type SitemapRoute = {
  route: string;
  lastModified?: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

type SitemapConfig = {
  baseUrl: string;
  manualRoutes: SitemapRoute[];
};

const sitemapConfig: SitemapConfig = {
  baseUrl: siteConfig.baseUrl,
  manualRoutes: [
    {
      route: "/",
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      route: "/privacy-policy",
      lastModified: "2025-10-07",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      route: "/terms-of-service",
      lastModified: "2025-10-07",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      route: "/refund-policy",
      lastModified: "2025-10-07",
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ],
};

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapConfig.manualRoutes.map((route) => ({
    url: `${sitemapConfig.baseUrl}${route.route}`,
    lastModified: route.lastModified || new Date().toISOString().split("T")[0],
    changeFrequency: route.changeFrequency || "monthly",
    priority: route.priority || 0.8,
  }));
}
