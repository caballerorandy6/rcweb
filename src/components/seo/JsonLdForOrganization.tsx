import { siteConfig } from "@/config/site";

export function JsonLdForOrganization() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.siteName,
    alternateName: siteConfig.siteNameShort,
    url: siteConfig.baseUrl,
    logo: `${siteConfig.baseUrl}/logo.png`,
    description: siteConfig.description,
    email: siteConfig.author.email,
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
      email: siteConfig.author.email,
    },
    sameAs: [
      siteConfig.social.linkedin,
      `https://x.com/${siteConfig.social.twitter.replace("@", "")}`,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
      siteConfig.social.nextdoor,
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-346-375-7534",
      contactType: "Customer Service",
      email: siteConfig.author.email,
      availableLanguage: ["English", "Spanish"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
