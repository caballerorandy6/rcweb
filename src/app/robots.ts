/**
 * Generate the robots.txt file for a Next.js site
 *
 * Requirements:
 * - Next.js 13.3.0 or higher
 * - Next.js App Router
 *
 * Usage:
 * 1. Update the allow array with routes you want search engines to index
 * 2. Update the disallow array with routes you DON'T want indexed
 * 3. The baseUrl is automatically pulled from siteConfig
 * 4. The robots.txt will be available at /robots.txt
 */

import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/blog",
          "/schedule",
          "/offer",
          "/guide",
          "/privacy-policy",
          "/terms-of-service",
          "/refund-policy",
        ],
        disallow: [
          "/admin/login",
          "/admin-dashboard",
          "/contacts",
          "/newsletter",
          "/projects",
          "/sms",
          "/manage-invoices",
          "/api/invoice/*",
          "/final-payment",
          "/payment-complete",
          "/payment-success",
          "/pay/*",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
