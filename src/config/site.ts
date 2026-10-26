export type SiteConfig = {
  baseUrl: string;
  siteName: string;
  siteNameShort: string;
  defaultOgImg: string;
  /** Square brand mark for JSON-LD `logo` (Google needs ≥112×112) */
  logoImg: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  /** Public profiles Randy actually keeps; used for JSON-LD sameAs */
  social: {
    linkedin: string;
    github: string;
    facebook: string;
    instagram: string;
    nextdoor: string;
    tiktok: string;
  };
};

export const siteConfig: SiteConfig = {
  // Canonical host: the apex redirects here, so sitemap/JSON-LD must use www
  baseUrl: "https://www.rcweb.dev",
  siteName: "RC Web Solutions LLC",
  siteNameShort: "RC Web Solutions",
  defaultOgImg: "/og-image.jpg",
  logoImg: "/icon-512x512.png",
  description:
    "Randy Caballero builds and maintains fast websites and web apps for small service businesses: booking, Stripe payments and local SEO built in. Based in Houston, TX, working with small businesses anywhere. Next.js, React, English & Spanish.",
  author: {
    name: "Randy Caballero",
    email: "contactus@rcweb.dev",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/109039912/",
    github: "https://github.com/caballerorandy6",
    facebook: "https://www.facebook.com/rcwebsolutionsllc",
    instagram: "https://www.instagram.com/rcwebsolutionsllc/",
    nextdoor: "https://nextdoor.com/page/rc-web-solutions-llc/",
    tiktok: "https://www.tiktok.com/@rcwebsolutionsllc",
  },
};
