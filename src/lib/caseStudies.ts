import { getTranslations } from "next-intl/server";
import type { Href } from "@/i18n/navigation";
import type { AppPathname, Locale } from "@/i18n/routing";
import type en from "@/messages/en.json";
import type { CaseStudyData } from "@/components/sections/CaseStudyTemplate";

export type CaseStudyKey = keyof typeof en.CaseStudies.items;

type CaseStudyCopy = (typeof en.CaseStudies.items)[CaseStudyKey];

/**
 * What the dictionaries cannot hold for each case study: route, site, image,
 * stat values, tech stack, icons, the testimonial's author and where the
 * CTAs go. The copy comes from `CaseStudies.items.<key>` in both languages.
 */
type CaseStudyShape = {
  pathname: AppPathname;
  siteUrl: `https://${string}`;
  image: string;
  stats: { value: string; suffix: string }[];
  techStack: string[];
  challengeIcons: string[];
  resultIcons: string[];
  testimonialAuthor?: string;
  ctaHrefs: Href[];
};

const webDesignService: Href = { pathname: "/services/[slug]", params: { slug: "web-design-houston" } };

export const caseStudyShapes: Record<CaseStudyKey, CaseStudyShape> = {
  gsmactx: {
    pathname: "/case-study/gsmactx",
    siteUrl: "https://www.gsmactx.com/",
    image: "/gsmactx.avif",
    stats: [
      { value: "15", suffix: "+" },
      { value: "2", suffix: "" },
      { value: "95", suffix: "+" },
      { value: "1", suffix: "" },
    ],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Tailwind UI", "Prisma", "PostgreSQL", "Docker", "Zod", "Zustand"],
    challengeIcons: ["clock", "wrench", "phone"],
    resultIcons: ["clock", "envelope", "chart"],
    testimonialAuthor: "Michel Chapelli",
    ctaHrefs: [{ pathname: "/", hash: "contact" }, "/schedule"],
  },
  dulceAntojo: {
    pathname: "/case-study/dulce-antojo",
    siteUrl: "https://dulce-antojo-snack-carts.vercel.app/",
    image: "/dulce-antojo.avif",
    stats: [
      { value: "5", suffix: "★" },
      { value: "13", suffix: "+" },
      { value: "95", suffix: "+" },
      { value: "<2s", suffix: "" },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod", "Stripe", "Turso", "Resend"],
    challengeIcons: ["phone", "chart", "envelope"],
    resultIcons: ["chart", "wrench", "star"],
    ctaHrefs: ["/schedule", webDesignService],
  },
  clinicaGessner: {
    pathname: "/case-study/clinica-gessner",
    siteUrl: "https://www.clinicagessner.com/",
    image: "/clinica-gessner.avif",
    stats: [
      { value: "5", suffix: "★" },
      { value: "2", suffix: "" },
      { value: "95", suffix: "+" },
      { value: "<2s", suffix: "" },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod"],
    challengeIcons: ["phone", "globe", "search"],
    resultIcons: ["search", "envelope", "star"],
    ctaHrefs: ["/schedule", webDesignService],
  },
  clinicaAirline: {
    pathname: "/case-study/clinica-airline",
    siteUrl: "https://www.clinicahispanaairline.com/",
    image: "/clinica-hispana-airline.avif",
    stats: [
      { value: "5", suffix: "★" },
      { value: "2", suffix: "" },
      { value: "95", suffix: "+" },
      { value: "<2s", suffix: "" },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod"],
    challengeIcons: ["phone", "globe", "search"],
    resultIcons: ["search", "envelope", "star"],
    ctaHrefs: ["/schedule", webDesignService],
  },
  leosHomeExperts: {
    pathname: "/case-study/leos-home-experts",
    siteUrl: "https://www.ac-remodelingservice.com/",
    image: "/leos-home-experts.webp",
    stats: [
      { value: "5", suffix: "★" },
      { value: "150", suffix: "mi" },
      { value: "95", suffix: "+" },
      { value: "<2s", suffix: "" },
    ],
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Shadcn UI", "Zod", "React Hook Form"],
    challengeIcons: ["phone", "video", "search"],
    resultIcons: ["wrench", "envelope", "star"],
    testimonialAuthor: "Leonardo Lecour Acosta",
    ctaHrefs: ["/schedule", webDesignService],
  },
};

/** Copy + structure of one case study in a language, ready for the template */
export async function getCaseStudy(key: CaseStudyKey, locale: Locale) {
  const t = await getTranslations({ locale, namespace: "CaseStudies" });
  // next-intl types `raw` keys as literals; a union-built key needs the widening
  const raw = t.raw as (path: string) => unknown;
  const copy = raw(`items.${key}`) as CaseStudyCopy & {
    testimonial?: { quote: string; company: string };
  };
  const shape = caseStudyShapes[key];

  const data: CaseStudyData = {
    name: copy.name,
    nameHighlight: copy.nameHighlight,
    subtitle: copy.subtitle,
    siteUrl: shape.siteUrl,
    image: shape.image,
    imageAlt: copy.imageAlt,
    stats: shape.stats.map((stat, i) => ({ ...stat, label: copy.stats[i] })),
    techStack: shape.techStack,
    challengesIntro: copy.challengesIntro,
    challenges: copy.challenges.map((c, i) => ({ ...c, icon: shape.challengeIcons[i] })),
    solutionsIntro: copy.solutionsIntro,
    solutions: copy.solutions,
    results: copy.results.map((r, i) => ({ ...r, icon: shape.resultIcons[i] })),
    ...(copy.testimonial &&
      shape.testimonialAuthor && {
        testimonial: { ...copy.testimonial, author: shape.testimonialAuthor },
      }),
    ctaTitle: copy.ctaTitle,
    ctaTitleHighlight: copy.ctaTitleHighlight,
    ctaDescription: copy.ctaDescription,
    ctaLinks: copy.ctaLinks.map((label, i) => ({ label, href: shape.ctaHrefs[i], primary: i === 0 })),
  };

  return {
    data,
    meta: { title: copy.metaTitle, description: copy.metaDescription, crumb: copy.crumb },
    pathname: shape.pathname,
  };
}
