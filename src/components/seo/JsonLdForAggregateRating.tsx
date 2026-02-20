import { siteConfig } from "@/config/site";

interface JsonLdForAggregateRatingProps {
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export default function JsonLdForAggregateRating({
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: JsonLdForAggregateRatingProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.baseUrl}/#business`,
    name: siteConfig.siteName,
    image: `${siteConfig.baseUrl}/logo.png`,
    url: siteConfig.baseUrl,
    telephone: "+1-346-375-7534",
    email: siteConfig.author.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      postalCode: "77002",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.7604,
      longitude: -95.3698,
    },
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      bestRating: bestRating,
      worstRating: worstRating,
      reviewCount: reviewCount,
    },
    sameAs: [
      siteConfig.social.linkedin,
      `https://x.com/${siteConfig.social.twitter.replace("@", "")}`,
      "https://www.facebook.com/rcwebsolutionsllc",
      "https://www.instagram.com/rcwebsolutionsllc",
      "https://www.tiktok.com/@rcwebsolutionsllc",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
