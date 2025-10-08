export type SiteConfig = {
  baseUrl: string;
  siteName: string;
  siteNameShort: string;
  defaultOgImg: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  social: {
    twitter: string;
  };
};

export const siteConfig: SiteConfig = {
  baseUrl: "https://rcweb.dev",
  siteName: "RC Web Solutions LLC",
  siteNameShort: "RC Web",
  defaultOgImg: "/og-image.jpg",
  description:
    "Professional full-stack web development services by Randy Caballero. Custom websites, web applications, and scalable digital solutions built with Next.js, React, and modern technologies.",
  author: {
    name: "Randy Caballero",
    email: "contactus@rcweb.dev",
  },
  social: {
    twitter: "@RCWeb2025",
  },
};
