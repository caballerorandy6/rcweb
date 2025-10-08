import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/privacy-policy", "/terms-of-service", "/refund-policy"],
        disallow: [
          "/login",
          "/admin-dashboard",
          "/contacts",
          "/newsletter",
          "/projects",
          "/sms",
          "/final-payment",
          "/payment-complete",
          "/payment-success",
          "/pay/*",
          "/unsubscribe",
        ],
      },
    ],
    sitemap: "https://rcweb.dev/sitemap.xml",
  };
}
