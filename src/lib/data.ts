import { ProjectProps } from "@/components/sections/Project";
import type { OfferId } from "@/lib/offerIds";
import { formatCurrency } from "@/lib/utils";
import en from "@/messages/en.json";
import React from "react";
import JavaScriptIcon from "@/components/icons/Javascript";
import ReactIcon from "@/components/icons/React";
import NextJS from "@/components/icons/NextJS";
import PostgreSQL from "@/components/icons/PostgreSQL";
import TailwindCSS from "@/components/icons/TailwindCSS";
import Docker from "@/components/icons/Docker";
import TypeScript from "@/components/icons/TypeScript";
import AWS from "@/components/icons/AWS";
import MySQL from "@/components/icons/MySQL";
import Prisma from "@/components/icons/Prisma";
import MongoDB from "@/components/icons/MongoDB";
import SASS from "@/components/icons/SASS";
import Jira from "@/components/icons/Jira";
//import Wordpress from "@/components/icons/Wordpress";
import NodeJS from "@/components/icons/NodeJS";
import { TeachMarqueeProps } from "@/components/ui/TechMarquee";
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { ExperienceProps } from "@/components/sections/Experience";
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  CodeBracketSquareIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

/**
 * English copy for the catalogue lives in `src/messages/en.json` (namespace
 * `Catalog`), next to its Spanish twin, so the two dictionaries stay in step.
 * The objects below add what a dictionary cannot hold: ids, slugs, prices,
 * icons, images and links. Public pages render the localized copy through
 * `getLocalizedCatalog()` (lib/catalog); admin, Stripe and invoices use these
 * English objects directly.
 */
const copy = en.Catalog;

// Fuente: resume de Randy Caballero (actualizado septiembre 2026). Copy in
// en.json (About.experience.items); company and location are proper names.
export type ExperienceKey = keyof typeof en.About.experience.items;

const experienceShapes: { key: ExperienceKey; company: string; location: string; icon: React.ReactNode }[] = [
  { key: "founder", company: "RC Web Solutions LLC", location: "Houston, TX", icon: React.createElement(BriefcaseIcon) },
  { key: "atser", company: "Atser Systems Inc.", location: "Houston, TX", icon: React.createElement(BriefcaseIcon) },
  { key: "revature", company: "Revature", location: "Houston, TX", icon: React.createElement(BriefcaseIcon) },
  { key: "camaguey", company: "Empresa Agropecuaria de Camagüey", location: "Camagüey, Cuba", icon: React.createElement(BriefcaseIcon) },
  { key: "edd", company: "Nova Southeastern University", location: "Fort Lauderdale, FL", icon: React.createElement(AcademicCapIcon) },
  { key: "msed", company: "Nova Southeastern University", location: "Fort Lauderdale, FL", icon: React.createElement(AcademicCapIcon) },
  { key: "bs", company: "Universidad de Camagüey", location: "Camagüey, Cuba", icon: React.createElement(AcademicCapIcon) },
];

export const experience: ExperienceProps[] = experienceShapes.map((shape) => ({
  ...shape,
  ...en.About.experience.items[shape.key],
}));

export { experienceShapes };

export const projects: ProjectProps[] = [
  // Clients, current and past, first, then demos (`demo: true`, labelled on the card and never
  // presented as clients). Best work leads within each group; course exercises are not listed.
  {
    name: "GSM AC & General Contractor",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "Tailwind UI",
      "Zod",
      "Zustand",
      "Prisma",
      "PostgreSQL",
      "Docker",
    ],
    id: "gsmactx",
    description: copy.projects.gsmactx,
    image: "/gsmactx.avif",
    url: "https://www.gsmactx.com/",
    caseStudy: "/case-study/gsmactx",
  },
  {
    name: "Clínica Hispana Airline",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
    ],
    id: "clinicaAirline",
    description: copy.projects.clinicaAirline,
    image: "/clinica-hispana-airline.avif",
    url: "https://www.clinicahispanaairline.com/",
    caseStudy: "/case-study/clinica-airline",
  },
  {
    name: "Clínica Hispana Nueva Salud Gessner",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
    ],
    id: "clinicaGessner",
    description: copy.projects.clinicaGessner,
    image: "/clinica-gessner.avif",
    url: "https://www.clinicagessner.com/",
    caseStudy: "/case-study/clinica-gessner",
  },
  {
    name: "Leo's Home Experts",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
      "React Hook Form",
    ],
    id: "leosHomeExperts",
    description: copy.projects.leosHomeExperts,
    image: "/leos-home-experts.webp",
    github: "https://github.com/caballerorandy6/leos-home-experts",
    url: "https://www.ac-remodelingservice.com/",
    caseStudy: "/case-study/leos-home-experts",
  },
  {
    name: "Dulce Antojo Snack Carts",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
      "Stripe",
    ],
    id: "dulceAntojo",
    description: copy.projects.dulceAntojo,
    image: "/dulce-antojo.avif",
    github: "https://github.com/caballerorandy6/dulce-antojo",
    url: "https://dulce-antojo-snack-carts.vercel.app/",
    caseStudy: "/case-study/dulce-antojo",
  },
  {
    name: "MIRA Eyewear",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Prisma",
      "PostgreSQL",
      "Stripe",
    ],
    id: "miraEyewear",
    demo: true,
    description: copy.projects.miraEyewear,
    image: "/mira-eyewear.avif",
    github: "https://github.com/caballerorandy6/optica",
    url: "https://optica-dun.vercel.app/",
  },
  {
    name: "Order System",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Prisma",
      "PostgreSQL",
      "Better Auth",
    ],
    id: "orderSystem",
    demo: true,
    description: copy.projects.orderSystem,
    image: "/order-system.avif",
    github: "https://github.com/caballerorandy6/optical-ordering-system",
    url: "https://optical-ordering-system.vercel.app/",
  },
  {
    name: "RC Beauty Salon",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
      "Zustand",
      "Prisma",
      "PostgreSQL",
      "Cloudinary",
    ],
    id: "rcBeautySalon",
    demo: true,
    description: copy.projects.rcBeautySalon,
    image: "/rcbeautysalon.avif",
    github: "https://github.com/caballerorandy6/rcbeautysalon",
    url: "https://www.rcbeautysalon.org/",
  },
  {
    name: "Limo Renting",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
      "Zustand",
    ],
    id: "limoRenting",
    demo: true,
    description: copy.projects.limoRenting,
    image: "/limo-renting.avif",
    github: "https://github.com/caballerorandy6/Limo-Renting-NextJS",
    url: "https://limo-renting-next-js-nu.vercel.app/",
  },
];

export const teachMarqueeData: TeachMarqueeProps[] = [
  {
    href: "https://www.javascript.com/",
    name: "JavaScript",
    icon: React.createElement(JavaScriptIcon),
  },
  {
    href: "https://www.typescriptlang.org/",
    name: "TypeScript",
    icon: React.createElement(TypeScript),
  },
  {
    href: "https://reactjs.org/",
    name: "React",
    icon: React.createElement(ReactIcon),
  },
  {
    href: "https://www.nextjs.org/",
    name: "Next.js",
    icon: React.createElement(NextJS),
  },
  {
    href: "https://tailwindcss.com/",
    name: "Tailwind CSS",
    icon: React.createElement(TailwindCSS),
  },
  {
    href: "https://nodejs.org/",
    name: "Node.js",
    icon: React.createElement(NodeJS),
  },
  {
    href: "https://www.postgresql.org/",
    name: "PostgreSQL",
    icon: React.createElement(PostgreSQL),
  },
  {
    href: "https://www.mysql.com/",
    name: "MySQL",
    icon: React.createElement(MySQL),
  },
  {
    href: "https://www.prisma.io/",
    name: "Prisma",
    icon: React.createElement(Prisma),
  },
  {
    href: "https://www.mongodb.com/",
    name: "MongoDB",
    icon: React.createElement(MongoDB),
  },
  {
    href: "https://www.docker.com/",
    name: "Docker",
    icon: React.createElement(Docker),
  },
  {
    href: "https://aws.amazon.com/",
    name: "AWS",
    icon: React.createElement(AWS),
  },
  {
    href: "https://sass-lang.com/",
    name: "SASS",
    icon: React.createElement(SASS),
  },
  {
    href: "https://www.atlassian.com/software/jira",
    name: "Jira",
    icon: React.createElement(Jira),
  },
  // {
  //   href: "https://wordpress.org/",
  //   name: "WordPress",
  //   icon: React.createElement(Wordpress),
  // },
];

export type CertificationKey = keyof typeof en.About.certifications.items;

const CLOUDINARY = "https://res.cloudinary.com/caballerorandy/image/upload";
const cloudinary = (file: string) => ({
  image: `${CLOUDINARY}/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/${file}.webp`,
  url: `${CLOUDINARY}/f_auto,q_auto/v1755196091/RC%20Web/${file}.webp`,
  pdfThumbnail: `${CLOUDINARY}/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/${file}.avif`,
});

export const certificationShapes: {
  key: CertificationKey;
  platform: string;
  tutor: string;
  image: string;
  url: string;
  pdfThumbnail?: string;
}[] = [
  { key: "bs", platform: "Universidad de Camagüey, Cuba", tutor: "Universidad de Camagüey, Cuba", ...cloudinary("randy_caballero-software_engineer_title_evaluation_bq77pk") },
  { key: "msed", platform: "Nova Southeastern University", tutor: "Nova Southeastern University", ...cloudinary("Master_of_Science_Title_zapkmh") },
  { key: "advancedReact", platform: "Meta on Coursera", tutor: "Meta", ...cloudinary("Coursera_-_Advanced_React_gilkkk") },
  { key: "reactBasics", platform: "Meta on Coursera", tutor: "Meta", ...cloudinary("Coursera_-_React_Basics_oiuwkw") },
  { key: "javascript", platform: "Meta on Coursera", tutor: "Meta", ...cloudinary("Coursera_-_Programming_with_JavaScript_ioxvot") },
];

export const certifications = certificationShapes.map((shape) => ({
  ...shape,
  ...en.About.certifications.items[shape.key],
}));

export type ProcessStepKey = keyof typeof copy.process;

export const processSteps = (
  [
    ["discovery", ChatBubbleLeftRightIcon],
    ["design", PencilSquareIcon],
    ["development", CodeBracketSquareIcon],
    ["launch", RocketLaunchIcon],
  ] as const
).map(([key, icon]) => ({ key, icon, ...copy.process[key] }));

// Service catalogue: the single source for the home "How I Can Help You"
// cards, the pricing cards, the /services pages and the Stripe checkout.
// Five offers, decided on 2026-10-18 (PR #35). Prices do not change here
// without Randy's say-so: they are deliberately below the US market.
export type { OfferId } from "@/lib/offerIds";

/** A fixed-scope entry point that can be paid on the site through Stripe. */
export type CheckoutPlan = {
  /** Sent in the checkout request; stays stable (Stripe metadata, invoices) */
  id: string;
  /** Product name on the Stripe session, the invoice and the Project row */
  name: string;
  priceInCents: number;
  mode: "payment" | "subscription";
  cta: string;
};

export type Offer = {
  id: OfferId;
  /** /services/[slug] */
  slug: string;
  /** /es/servicios/[slug] */
  slugEs: string;
  title: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  /** Home card copy */
  summary: string;
  tags: string[];
  highlight: string;
  priceFromCents: number;
  /** "from": quoted on scope, shown as "From $X"; "fixed": the price is the price */
  pricing: "from" | "fixed";
  /** Included post-launch support; null for the ongoing plan */
  supportDays: number | null;
  /** Pricing card detail */
  range: string;
  duration: string;
  description: string;
  features: string[];
  ideal: string;
  featured: boolean;
  /** Present when part of the offer has a fixed price and can be paid now */
  checkout?: CheckoutPlan;
  /** Button text for the "agree the scope first" path (/schedule); absent when there is nothing to quote */
  quoteCta?: string;
};

/** Text fields of an offer; the part that differs per language */
export type OfferCopy = Pick<
  Offer,
  "title" | "summary" | "tags" | "highlight" | "range" | "duration" | "description" | "features" | "ideal"
> & { checkoutCta?: string; quoteCta?: string };

type OfferShape = Omit<Offer, keyof OfferCopy | "quoteCta" | "checkout"> & {
  checkout?: Omit<CheckoutPlan, "cta">;
};

const offerCopy = (id: OfferId): OfferCopy => copy.offers[id];

/** Structure + English copy; `localizeOffer()` swaps the copy for another language */
export function buildOffer(shape: OfferShape, text: OfferCopy): Offer {
  const { checkoutCta, quoteCta, ...fields } = text;
  const { checkout, ...rest } = shape;
  return {
    ...rest,
    ...fields,
    ...(checkout && { checkout: { ...checkout, cta: checkoutCta ?? "" } }),
    ...(quoteCta && { quoteCta }),
  };
}

const offerShapes: OfferShape[] = [
  {
    id: "business-website",
    slug: "web-design-houston",
    slugEs: "diseno-web-houston",
    icon: RocketLaunchIcon,
    priceFromCents: 100000,
    pricing: "from",
    supportDays: 30,
    featured: true,
    checkout: {
      id: "landing-page",
      name: "Professional Landing Page Development",
      priceInCents: 100000, // $1,000.00
      mode: "payment",
    },
  },
  {
    id: "website-redesign",
    slug: "website-redesign-houston",
    slugEs: "rediseno-web-houston",
    icon: CubeTransparentIcon,
    priceFromCents: 350000,
    pricing: "from",
    supportDays: 45,
    featured: false,
  },
  {
    id: "admin-dashboard",
    slug: "admin-dashboard-houston",
    slugEs: "panel-de-administracion-houston",
    icon: ChartBarIcon,
    priceFromCents: 750000,
    pricing: "from",
    supportDays: 60,
    featured: false,
  },
  {
    id: "store-and-apps",
    slug: "ecommerce-houston",
    slugEs: "tienda-en-linea-houston",
    icon: CodeBracketIcon,
    priceFromCents: 800000,
    pricing: "from",
    supportDays: 90,
    featured: false,
  },
  {
    id: "maintenance",
    slug: "website-maintenance-houston",
    slugEs: "mantenimiento-web-houston",
    icon: ShieldCheckIcon,
    priceFromCents: 20000,
    pricing: "fixed",
    supportDays: null,
    featured: false,
    checkout: {
      id: "website-maintenance",
      name: "Monthly Website Maintenance and Support",
      priceInCents: 20000, // $200.00/month
      mode: "subscription",
    },
  },
];

export const offers: Offer[] = offerShapes.map((shape) =>
  buildOffer(shape, offerCopy(shape.id))
);

/** Everything that can be paid on the site; the checkout action only accepts these */
export const checkoutPlans: CheckoutPlan[] = offers.flatMap((offer) =>
  offer.checkout ? [offer.checkout] : []
);

/** What the contact forms need from the catalogue (id + title; nothing heavier crosses to the client) */
export const serviceOptions = offers.map(({ id, title }) => ({ id, title }));

export type PriceLabels = { from: string; perMonth: string };
const EN_PRICE_LABELS: PriceLabels = { from: copy.priceFrom, perMonth: copy.perMonth };

/** "From" + "$3,500", or just "$200/month": the two halves every price display uses */
export function offerPriceParts(
  offer: Offer,
  labels: PriceLabels = EN_PRICE_LABELS
): {
  prefix: string | null;
  amount: string;
} {
  const base = formatCurrency(offer.priceFromCents, true);
  const amount = offer.checkout?.mode === "subscription" ? `${base}${labels.perMonth}` : base;
  return { prefix: offer.pricing === "from" ? labels.from : null, amount };
}

/** "From $3,500" / "$200/month" */
export function offerPriceLabel(offer: Offer, labels?: PriceLabels): string {
  const { prefix, amount } = offerPriceParts(offer, labels);
  return prefix ? `${prefix} ${amount}` : amount;
}

export type FaqKey = Exclude<keyof typeof copy.faqs, "supportItem">;
export const FAQ_KEYS = ["outsideUsa", "timeline", "support", "technologies", "payments", "progress"] as const satisfies readonly FaqKey[];

/** Pieces the FAQ answers interpolate: timelines and support per quoted offer, maintenance price */
export type FaqValues = {
  durations: string;
  supports: string;
  maintenanceTitle: string;
  maintenancePrice: string;
};

export function faqValues(
  localizedOffers: Offer[],
  supportItem: (title: string, days: number) => string,
  labels?: PriceLabels
): FaqValues {
  const quoted = localizedOffers.filter((o) => o.pricing === "from");
  const maintenance = localizedOffers.find((o) => o.id === "maintenance")!;
  return {
    durations: quoted.map((o) => `${o.title}: ${o.duration}`).join(", "),
    supports: quoted.map((o) => supportItem(o.title, o.supportDays ?? 0)).join(", "),
    maintenanceTitle: maintenance.title,
    maintenancePrice: offerPriceLabel(maintenance, labels),
  };
}

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? "");
}

/** English FAQs (JSON-LD on the English home, admin); public pages use getLocalizedCatalog() */
export const faqs = (() => {
  const values = faqValues(offers, (title, days) =>
    fill(copy.faqs.supportItem, { title, days: String(days) })
  );
  return FAQ_KEYS.map((key) => ({
    key,
    question: copy.faqs[key].question,
    answer: fill(copy.faqs[key].answer, values),
  }));
})();

export type TestimonialKey = keyof typeof copy.testimonials;

const testimonialAuthors: Record<TestimonialKey, { author: string; company: string; rating: number }> = {
  chapelli: { author: "Michel Chapelli", company: "GSM A/C & General Contractor Inc.", rating: 5 },
  lecour: { author: "Leonardo Lecour Acosta", company: "Leo's Home Experts", rating: 5 },
  aguilar: { author: "Yoannis Aguilar Fonseca", company: "", rating: 5 },
};

export const testimonials = (Object.keys(testimonialAuthors) as TestimonialKey[]).map((key) => ({
  key,
  ...testimonialAuthors[key],
  ...copy.testimonials[key],
}));

// Google Reviews - Link to leave a review
export const GOOGLE_REVIEW_URL = "https://g.page/r/CaUssahd8MITEAE/review";

/** Long-form content of /services/[slug]; slug, title, icon and price come from the offer */
export type ServicePage = {
  offerId: OfferId;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subheadline: string;
  content: string;
  features: {
    title: string;
    description: string;
  }[];
  relatedProjects: string[];
  cta: string;
};

/** Long-form copy of a service page; `Services.pages.<offerId>` in the dictionaries */
export type ServicePageCopy = Omit<ServicePage, "offerId" | "relatedProjects">;

/** What the dictionary cannot hold: which portfolio projects each page shows */
export const servicePageShapes: { offerId: OfferId; relatedProjects: string[] }[] = [
  { offerId: "business-website", relatedProjects: ["Clínica Hispana Nueva Salud Gessner", "Clínica Hispana Airline", "Leo's Home Experts"] },
  { offerId: "website-redesign", relatedProjects: ["GSM AC & General Contractor", "Clínica Hispana Airline"] },
  { offerId: "admin-dashboard", relatedProjects: ["GSM AC & General Contractor", "Dulce Antojo Snack Carts"] },
  { offerId: "store-and-apps", relatedProjects: ["Dulce Antojo Snack Carts", "GSM AC & General Contractor"] },
  { offerId: "maintenance", relatedProjects: ["Clínica Hispana Nueva Salud Gessner", "Leo's Home Experts", "GSM AC & General Contractor"] },
];

export const servicePages: ServicePage[] = servicePageShapes.map((shape) => ({
  ...shape,
  ...(en.Services.pages[shape.offerId] as ServicePageCopy),
}));

/** Slug of an offer in a language: /services/web-design-houston ↔ /es/servicios/diseno-web-houston */
export function offerSlug(offer: Offer, locale: "en" | "es"): string {
  return locale === "es" ? offer.slugEs : offer.slug;
}

/** The offer behind a /services/[slug] URL, in either language */
export function findOfferBySlug(slug: string): Offer | undefined {
  return offers.find((o) => o.slug === slug || o.slugEs === slug);
}

/** Offer + its long-form page (English copy), looked up by /services/[slug] */
export function getServicePage(slug: string) {
  const offer = findOfferBySlug(slug);
  const page = offer && servicePages.find((p) => p.offerId === offer.id);
  return offer && page ? { offer, page } : null;
}
