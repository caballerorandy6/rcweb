import { siteConfig } from "@/config/site";

export function JsonLdForLocalBusiness() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteConfig.baseUrl}/#localbusiness`,
    name: siteConfig.siteName,
    alternateName: siteConfig.siteNameShort,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    telephone: "+1-346-375-7534",
    email: siteConfig.author.email,
    image: `${siteConfig.baseUrl}/logo.png`,
    logo: `${siteConfig.baseUrl}/logo.png`,
    priceRange: "$$",
    currenciesAccepted: "USD",
    paymentAccepted: ["Credit Card", "Debit Card", "Zelle"],
    areaServed: [
      {
        "@type": "City",
        name: "Houston",
        "@id": "https://www.wikidata.org/wiki/Q16555",
      },
      {
        "@type": "State",
        name: "Texas",
        "@id": "https://www.wikidata.org/wiki/Q1439",
      },
      {
        "@type": "Country",
        name: "United States",
        "@id": "https://www.wikidata.org/wiki/Q30",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.7604,
      longitude: -95.3698,
    },
    serviceType: [
      "Web Development",
      "Web Design",
      "E-commerce Development",
      "Custom Web Applications",
      "API Development",
      "Digital Consulting",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Starter Website",
            description: "Professional landing page for small businesses",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Website",
            description: "Full-featured business website with CMS",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Solution",
            description: "Custom web applications and e-commerce platforms",
          },
        },
      ],
    },
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
      jobTitle: "Full-Stack Developer",
    },
    sameAs: [
      siteConfig.social.linkedin,
      `https://x.com/${siteConfig.social.twitter.replace("@", "")}`,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.tiktok,
      siteConfig.social.nextdoor,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
