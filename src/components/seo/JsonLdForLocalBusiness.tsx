import { siteConfig } from "@/config/site";
import { offers } from "@/lib/data";
import { offerToSchemaOffer } from "@/lib/seo/offerJsonLd";

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
      // Same five offers as the pricing section and /services
      itemListElement: offers.map((offer) => ({
        ...offerToSchemaOffer(offer),
        itemOffered: {
          "@type": "Service",
          name: offer.title,
          description: offer.description,
        },
      })),
    },
    founder: {
      "@type": "Person",
      name: siteConfig.author.name,
      jobTitle: "Full-Stack Developer",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.github,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
