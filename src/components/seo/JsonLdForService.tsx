import { siteConfig } from "@/config/site";

type JsonLdForServiceProps = {
  name: string;
  description: string;
  price: number;
  duration: string;
};

export function JsonLdForService({
  name,
  description,
  price,
  duration,
}: JsonLdForServiceProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${name} - Web Development`,
    description,
    provider: {
      "@type": "Organization",
      name: siteConfig.siteName,
      url: siteConfig.baseUrl,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
    },
    estimatedDuration: duration,
    serviceType: "Web Development",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
