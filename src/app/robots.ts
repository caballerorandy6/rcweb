/**
 * robots.txt. Public pages are listed in both languages (the English URL and
 * its `/es/...` translation come from routing.pathnames, so a renamed slug
 * cannot drift from here); the backoffice and the token/transactional pages
 * are kept out of the index in both languages too.
 */

import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { localizePathname } from "@/i18n/paths";
import { routing, type AppPathname } from "@/i18n/routing";

/** The same page in every language, e.g. `/services` and `/es/servicios` */
function everyLanguage(pathname: AppPathname, params?: Record<string, string>): string[] {
  return routing.locales.map((locale) => localizePathname(pathname, locale, params));
}

const PUBLIC_PAGES: AppPathname[] = [
  "/",
  "/about",
  "/blog",
  "/schedule",
  "/privacy-policy",
  "/terms-of-service",
  "/refund-policy",
  "/web-developer-houston-tx",
  "/services",
  "/projects-portfolio",
  "/case-study/clinica-gessner",
  "/case-study/clinica-airline",
  "/case-study/leos-home-experts",
  "/case-study/dulce-antojo",
  "/case-study/gsmactx",
];

/** Public pages that must not be indexed: payment steps and one-visitor links */
const PRIVATE_PAGES: AppPathname[] = [
  "/final-payment",
  "/payment-complete",
  "/payment-success",
  "/unsubscribe",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          ...PUBLIC_PAGES.flatMap((pathname) => everyLanguage(pathname)),
          ...everyLanguage("/services/[slug]", { slug: "*" }),
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
          "/api/cron/*",
          "/tools/*",
          ...PRIVATE_PAGES.flatMap((pathname) => everyLanguage(pathname)),
          ...everyLanguage("/pay/[token]", { token: "*" }),
        ],
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
  };
}
