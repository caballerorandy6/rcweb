import type { Offer } from "@/lib/data";
import { offerToSchemaOffer } from "@/lib/seo/offerJsonLd";
import { ORGANIZATION_ID } from "@/components/seo/JsonLdForLocalBusiness";

/** One Service entity per catalogue offer, on the home page */
export function JsonLdForService({ offer }: { offer: Offer }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${offer.title} - Web Development`,
    description: `${offer.description}. ${offer.ideal}`,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    offers: offerToSchemaOffer(offer),
    estimatedDuration: offer.duration,
    serviceType: "Web Development",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
