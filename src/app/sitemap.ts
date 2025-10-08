import { MetadataRoute } from "next";

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
  baseUrl: "https://rcweb.dev",
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
