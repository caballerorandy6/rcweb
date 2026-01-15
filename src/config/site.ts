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
    linkedin: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    nextdoor: string;
  };
};

export const siteConfig: SiteConfig = {
  baseUrl: "https://rcweb.dev",
  siteName: "RC Web Solutions LLC",
  siteNameShort: "RC Web Solutions",
  defaultOgImg: "/og-image.jpg",
  description:
    "RC Web Solutions builds high-performance websites and web applications for businesses. Custom digital solutions with Next.js, React, and modern technologies.",
  author: {
    name: "Randy Caballero",
    email: "contactus@rcweb.dev",
  },
  social: {
    twitter: "@RCWeb2025",
    linkedin: "https://www.linkedin.com/company/rcwebsolutions",
    facebook: "https://www.facebook.com/rcwebsolutionsllc",
    instagram: "https://www.instagram.com/rcwebsolutionsllc",
    tiktok: "https://www.tiktok.com/@rcwebsolutionsllc",
    nextdoor: "https://nextdoor.com/page/rc-web-solutions-llc",
  },
};
