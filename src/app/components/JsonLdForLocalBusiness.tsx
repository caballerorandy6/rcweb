import { siteConfig } from "@/config/site";

export function JsonLdForLocalBusiness() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.baseUrl}/#localbusiness`,
    name: siteConfig.siteName,
    image: `${siteConfig.baseUrl}/og-image.jpg`,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    telephone: "+1-346-375-7534",
    email: siteConfig.author.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Houston",
      addressLocality: "Houston",
      addressRegion: "TX",
      postalCode: "77085",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 29.7604,
      longitude: -95.3698,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    sameAs: [
      siteConfig.social.linkedin,
      `https://x.com/${siteConfig.social.twitter.replace("@", "")}`,
      "https://www.facebook.com/rcwebsolutionsllc",
      "https://www.instagram.com/rcwebsolutionsllc",
      "https://www.tiktok.com/@rcwebsolutionsllc",
    ],
    priceRange: "$$",
    paymentAccepted: ["Cash", "Credit Card", "Zelle", "Stripe"],
    currenciesAccepted: "USD",
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 29.7604,
        longitude: -95.3698,
      },
      geoRadius: "100000", // 100km radius
    },
    serviceType: [
      "Web Development",
      "Full-Stack Development",
      "Next.js Development",
      "React Development",
      "Custom Web Applications",
      "Landing Pages",
      "E-commerce Development",
      "Digital Consulting",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
