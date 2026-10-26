import { siteConfig } from "@/config/site";
import { ORGANIZATION_ID } from "@/components/seo/JsonLdForLocalBusiness";

/** The site itself; the publisher is the company block rendered next to it. No SearchAction: the site has no search. */
export function JsonLdForWebSite() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.baseUrl}/#website`,
    name: siteConfig.siteName,
    alternateName: siteConfig.siteNameShort,
    url: siteConfig.baseUrl,
    description: siteConfig.description,
    publisher: { "@id": ORGANIZATION_ID },
    inLanguage: "en-US",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
