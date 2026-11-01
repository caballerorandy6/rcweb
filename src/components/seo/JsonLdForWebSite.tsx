import { siteConfig } from "@/config/site";
import { getLocale, getTranslations } from "next-intl/server";
import { ORGANIZATION_ID } from "@/components/seo/JsonLdForLocalBusiness";
import { IN_LANGUAGE } from "@/lib/seo/inLanguage";
import type { Locale } from "@/i18n/routing";

/** The site itself; the publisher is the company block rendered next to it. No SearchAction: the site has no search. */
export async function JsonLdForWebSite() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations("Metadata")]);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    name: siteConfig.siteName,
    alternateName: siteConfig.siteNameShort,
    url: siteConfig.baseUrl,
    description: t("siteDescription"),
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: IN_LANGUAGE[locale as Locale],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
