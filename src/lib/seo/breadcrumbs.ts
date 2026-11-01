import { getTranslations } from "next-intl/server";
import { siteConfig } from "@/config/site";
import { localizePathname } from "@/i18n/paths";
import type { AppPathname, Locale } from "@/i18n/routing";

type Crumb = {
  /** Label key under `Breadcrumb`, or a literal name (brands, post titles) */
  key?: "home" | "services" | "projects" | "caseStudies" | "about" | "letsTalk" | "houston" | "blog";
  name?: string;
  pathname?: AppPathname;
  params?: Record<string, string | number>;
  /** A node without its own page (e.g. "Case Studies"): keeps the old URL */
  href?: string;
};

/** BreadcrumbList items with translated labels and the URLs of the current language */
export async function localizedBreadcrumbs(locale: Locale, crumbs: Crumb[]) {
  const t = await getTranslations({ locale, namespace: "Breadcrumb" });
  return crumbs.map((crumb) => ({
    name: crumb.key ? t(crumb.key) : (crumb.name ?? ""),
    item: `${siteConfig.baseUrl}${
      crumb.pathname ? localizePathname(crumb.pathname, locale, crumb.params) : (crumb.href ?? "")
    }`,
  }));
}
