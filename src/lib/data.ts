import { ProjectProps } from "@/components/sections/Project";
import type { OfferId } from "@/lib/offerIds";
import { formatCurrency } from "@/lib/utils";
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

// Fuente: resume de Randy Caballero (actualizado septiembre 2026)
export const experience: ExperienceProps[] = [
  {
    title: "Founder & Lead Developer",
    company: "RC Web Solutions LLC",
    location: "Houston, TX",
    description:
      "Built and deployed 20+ production Next.js sites for small businesses, most of them in the Houston area, owning the full cycle from requirements to post-launch maintenance, plus the analytics and paid-acquisition layer.",
    icon: React.createElement(BriefcaseIcon),
    date: "Sept 2022 - Present",
  },
  {
    title: "Software Developer",
    company: "Atser Systems Inc.",
    location: "Houston, TX",
    description:
      "Built responsive web applications with Next.js, TypeScript, Tailwind CSS, and shadcn/ui, integrating C#/.NET REST APIs in a cross-functional Agile team.",
    icon: React.createElement(BriefcaseIcon),
    date: "Nov 2024 - Apr 2025",
  },
  {
    title: "Software Developer",
    company: "Revature",
    location: "Houston, TX",
    description:
      "Developed and maintained website features alongside senior developers, integrating third-party APIs and running cross-browser testing.",
    icon: React.createElement(BriefcaseIcon),
    date: "Apr 2022 - Sept 2022",
  },
  {
    title: "Frontend Developer",
    company: "Empresa Agropecuaria de Camagüey",
    location: "Camagüey, Cuba",
    description:
      "Built web applications and real-time operational dashboards for agricultural management systems with JavaScript, HTML5, CSS3, and Bootstrap.",
    icon: React.createElement(BriefcaseIcon),
    date: "Sept 2015 - Feb 2017",
  },
  {
    title: "Doctor of Education (EdD)",
    company: "Nova Southeastern University",
    location: "Fort Lauderdale, FL",
    description: "Doctoral program in progress",
    icon: React.createElement(AcademicCapIcon),
    date: "May 2024 - Present",
  },
  {
    title: "M.S., Education",
    company: "Nova Southeastern University",
    location: "Fort Lauderdale, FL",
    description: "Master of Science in Education",
    icon: React.createElement(AcademicCapIcon),
    date: "May 2021 - Apr 2024",
  },
  {
    title: "B.S., Software Engineering",
    company: "Universidad de Camagüey",
    location: "Camagüey, Cuba",
    description: "Bachelor of Science in Software Engineering",
    icon: React.createElement(AcademicCapIcon),
    date: "Graduated July 2012",
  },
];

export const projects: ProjectProps[] = [
  // Client work first (most complete projects lead), then live personal apps;
  // demos and course exercises are not listed
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
    description:
      "Custom website and admin dashboard for a Houston HVAC company. Automated email campaigns, service request management, and real-time client-side rendering. Saved the business 15+ hours per week.",
    image: "/gsmactx.avif",
    url: "https://www.gsmactx.com/",
    caseStudy: "/case-study/gsmactx",
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
    description:
      "Official website and private admin dashboard with Stripe payment links for a Houston snack cart rental business. Booking form, local SEO, and card payments that let them book companies and schools.",
    image: "/dulce-antojo.avif",
    github: "https://github.com/caballerorandy6/dulce-antojo",
    url: "https://dulce-antojo.vercel.app/",
    caseStudy: "/case-study/dulce-antojo",
  },
  {
    name: "Clínica Hispana Gessner",
    tecnologies: [
      "NextJS",
      "React",
      "TypeScript",
      "TailwindCSS",
      "Shadcn UI",
      "Zod",
    ],
    description:
      "Bilingual website for a Houston clinic featuring online appointment booking, service information, and local SEO to reach Spanish-speaking patients.",
    image: "/clinica-gessner.avif",
    url: "https://www.clinicagessner.com/",
    caseStudy: "/case-study/clinica-gessner",
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
    description:
      "Professional bilingual website for a Houston clinic with Spanish-speaking patients. Features local SEO, service pages, and patient-friendly design optimized for mobile.",
    image: "/clinica-hispana-airline.avif",
    url: "https://www.clinicahispanaairline.com/",
    caseStudy: "/case-study/clinica-airline",
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
    description:
      "Landing page for a Houston-based home services company specializing in patio construction, motorized screens, and awning installations. Features local SEO optimization with JSON-LD schema and video gallery integration.",
    image: "/leos-home-experts.webp",
    github: "https://github.com/caballerorandy6/leos-home-experts",
    url: "https://www.ac-remodelingservice.com/",
    caseStudy: "/case-study/leos-home-experts",
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
    description:
      "A modern website for a beauty salon that showcases services, allows online bookings, and provides contact information, built with Next.js and Tailwind CSS.",
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
    description:
      "This web-based platform streamlines the process of renting limousines for special occasions, offering users real-time access to vehicle availability, service customization, and secure booking—all within a modern, responsive interface.",
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

export const certifications = [
  {
    name: "B.S., Software Engineering",
    platform: "Universidad de Camagüey, Cuba",
    description:
      "Bachelor's degree in Software Engineering, evaluated as equivalent to a U.S. bachelor's degree.",
    tutor: "Universidad de Camagüey, Cuba",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,q_auto/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.webp",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.avif",
  },
  {
    name: "M.S., Education",
    platform: "Nova Southeastern University",
    description: "Master of Science in Education.",
    tutor: "Nova Southeastern University",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,q_auto/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.webp",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.avif",
  },
  {
    name: "Advanced React",
    platform: "Meta on Coursera",
    description:
      "Hooks, context, higher-order components, testing and performance in React applications.",
    tutor: "Meta",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_Advanced_React_gilkkk.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,q_auto/v1755196091/RC%20Web/Coursera_-_Advanced_React_gilkkk.webp",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_Advanced_React_gilkkk.avif",
  },
  {
    name: "React Basics",
    platform: "Meta on Coursera",
    description: "Components, state, props and routing in React.",
    tutor: "Meta",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,q_auto/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.webp",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.avif",
  },
  {
    name: "Programming with JavaScript",
    platform: "Meta on Coursera",
    description:
      "JavaScript fundamentals, data structures and testing with Jest.",
    tutor: "Meta",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,q_auto/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.webp",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.avif",
  },
];

export const processSteps = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Discovery",
    week: "Week 1",
    description:
      "Free video call to understand your needs and objectives, wherever you are.",
    details: [
      "Requirements analysis",
      "Competition research",
      "Detailed proposal",
      "Transparent quote",
    ],
  },
  {
    icon: PencilSquareIcon,
    title: "Design & Planning",
    week: "Weeks 1-2",
    description: "Create wireframes and define your application architecture.",
    details: [
      "Interactive mockups",
      "Tech stack selection",
      "Project timeline",
      "Review & feedback",
    ],
  },
  {
    icon: CodeBracketSquareIcon,
    title: "Iterative Development",
    week: "Weeks 2-5",
    description:
      "Build your application with weekly demos and continuous adjustments.",
    details: [
      "Weekly sprints",
      "Friday demos",
      "Continuous testing",
      "Real-time adjustments",
    ],
  },
  {
    icon: RocketLaunchIcon,
    title: "Launch & Support",
    week: "Week 6",
    description:
      "Production deployment with training and post-launch support (30-180 days depending on plan).",
    details: [
      "Secure deployment",
      "Complete training",
      "Documentation",
      "Post-launch support included",
    ],
  },
];

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

export const offers: Offer[] = [
  {
    id: "business-website",
    slug: "web-design-houston",
    title: "Business Website",
    icon: RocketLaunchIcon,
    summary:
      "From a one-page landing to a full 5-10 page site: custom design, mobile-first, built to turn visitors into calls and form submissions.",
    tags: ["Custom Design", "Local SEO", "Contact Forms", "Loads in under 2 seconds"],
    highlight: "Like Clínica Gessner & Leo's Home Experts",
    priceFromCents: 100000,
    pricing: "from",
    supportDays: 30,
    range: "$1,000 - $6,000",
    duration: "1-4 weeks",
    description:
      "A landing page at a fixed price, or a 5-10 page site quoted on scope",
    features: [
      "Custom, mobile-first design",
      "Contact form and click-to-call",
      "Local SEO setup",
      "Analytics integration",
      "Loads in under 2 seconds",
      "30-day support",
    ],
    ideal:
      "Perfect for: new businesses, professional services, product launches",
    featured: true,
    checkout: {
      id: "landing-page",
      name: "Professional Landing Page Development",
      priceInCents: 100000, // $1,000.00
      mode: "payment",
      cta: "Start a Landing Page",
    },
    quoteCta: "Quote a Full Website",
  },
  {
    id: "website-redesign",
    slug: "website-redesign-houston",
    title: "Website Redesign & Modernization",
    icon: CubeTransparentIcon,
    summary:
      "Your current site rebuilt on modern technology: faster, mobile-friendly, and easier for customers to use, with your content migrated.",
    tags: ["Modern Design", "Performance Boost", "Mobile Optimization", "Content Migration"],
    highlight: "Like GSM A/C",
    priceFromCents: 350000,
    pricing: "from",
    supportDays: 45,
    range: "$3,500 - $8,000",
    duration: "4-6 weeks",
    description: "Your outdated website rebuilt without losing what works",
    features: [
      "Modern design and aesthetics",
      "Performance optimization",
      "Mobile responsive upgrade",
      "Content migration",
      "Rankings preserved and improved",
      "45-day support",
    ],
    ideal:
      "Perfect for: businesses with old websites, legacy code or poor performance",
    featured: false,
    quoteCta: "Get a Quote",
  },
  {
    id: "admin-dashboard",
    slug: "admin-dashboard-houston",
    title: "Admin Dashboard & Automation",
    icon: ChartBarIcon,
    summary:
      "A private panel to manage leads, customers, payments and campaigns from one place, with the repetitive work automated.",
    tags: ["Lead & Customer Management", "Email & SMS Campaigns", "Stripe Payments", "Reports"],
    highlight: "GSM saves 15 hours/week",
    priceFromCents: 750000,
    pricing: "from",
    supportDays: 60,
    range: "$7,500 - $15,000",
    duration: "5-6 weeks",
    description: "A tailored admin panel for your day-to-day operations",
    features: [
      "Custom forms and workflows",
      "Lead and customer management",
      "Email and SMS campaigns",
      "Stripe payments",
      "Reports and data visualization",
      "API integrations",
      "60-day support",
    ],
    ideal:
      "Perfect for: service businesses, operations management, automation",
    featured: false,
    quoteCta: "Get a Quote",
  },
  {
    id: "store-and-apps",
    slug: "ecommerce-houston",
    title: "Online Store & Custom Web Apps",
    icon: CodeBracketIcon,
    summary:
      "Full-featured online stores with Stripe and custom platforms: booking systems, member areas, internal tools. No monthly platform fees.",
    tags: ["Stripe Checkout", "Booking Systems", "User Accounts", "API Integrations"],
    highlight: "Like RC Beauty Salon",
    priceFromCents: 800000,
    pricing: "from",
    supportDays: 90,
    range: "$8,000 - $20,000+",
    duration: "6-12+ weeks",
    description:
      "An online store with payment processing, or a custom platform built around your business",
    features: [
      "Stripe checkout and subscriptions",
      "Inventory and order processing",
      "Customer accounts",
      "Booking systems and member areas",
      "Database and API development",
      "Third-party integrations",
      "90-day support",
    ],
    ideal:
      "Perfect for: retail, online stores, booking-based and product-based businesses",
    featured: false,
    quoteCta: "Get a Quote",
  },
  {
    id: "maintenance",
    slug: "website-maintenance-houston",
    title: "Monthly Maintenance & Support",
    icon: ShieldCheckIcon,
    summary:
      "Ongoing maintenance, security updates, backups, and technical support so your website keeps working while you run your business.",
    tags: ["Security Updates", "Uptime Monitoring", "Content Updates", "Priority Support"],
    highlight: "Peace of mind guaranteed",
    priceFromCents: 20000,
    pricing: "fixed",
    supportDays: null,
    range: "Cancel anytime",
    duration: "Ongoing",
    description: "Monthly maintenance and support for any website I built",
    features: [
      "Security patches and updates",
      "Performance and uptime monitoring",
      "Content updates",
      "Backup management",
      "Technical support",
      "Same-day response for urgent issues",
    ],
    ideal: "Perfect for: every business that wants peace of mind",
    featured: false,
    checkout: {
      id: "website-maintenance",
      name: "Monthly Website Maintenance and Support",
      priceInCents: 20000, // $200.00/month
      mode: "subscription",
      cta: "Start Maintenance Plan",
    },
  },
];

/** Everything that can be paid on the site; the checkout action only accepts these */
export const checkoutPlans: CheckoutPlan[] = offers.flatMap((offer) =>
  offer.checkout ? [offer.checkout] : []
);

/** What the contact forms need from the catalogue (id + title; nothing heavier crosses to the client) */
export const serviceOptions = offers.map(({ id, title }) => ({ id, title }));

const offerById = Object.fromEntries(offers.map((o) => [o.id, o])) as Record<
  OfferId,
  Offer
>;

/** "From" + "$3,500", or just "$200/month": the two halves every price display uses */
export function offerPriceParts(offer: Offer): {
  prefix: "From" | null;
  amount: string;
} {
  const base = formatCurrency(offer.priceFromCents, true);
  const amount = offer.checkout?.mode === "subscription" ? `${base}/month` : base;
  return { prefix: offer.pricing === "from" ? "From" : null, amount };
}

/** "From $3,500" / "$200/month" */
export function offerPriceLabel(offer: Offer): string {
  const { prefix, amount } = offerPriceParts(offer);
  return prefix ? `${prefix} ${amount}` : amount;
}

const quotedOffers = offers.filter((o) => o.pricing === "from");


export const faqs = [
  {
    question: "Do you work with clients outside USA?",
    answer:
      "I work with clients worldwide. Projects are fully remote, and I use tools like Zoom and Slack to communicate and collaborate effectively. Payments are easy and secure through Stripe, so you can work with me from anywhere.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      `It depends on the scope: ${quotedOffers
        .map((o) => `${o.title}: ${o.duration}`)
        .join(", ")}. I always provide realistic timelines and meet them.`,
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      `Yes! Every project includes complimentary post-launch support. The duration depends on the service: ${quotedOffers
        .map((o) => `${o.title} (${o.supportDays} days)`)
        .join(", ")}. Support covers bug fixes, minor adjustments, and technical assistance. After that, the ${offerById.maintenance.title} plan is ${offerPriceLabel(offerById.maintenance)} and covers security updates, performance monitoring, content updates and priority support.`,
  },
  {
    question: "Do you work with technologies besides Next.js?",
    answer:
      "My specialty is the React/Next.js ecosystem with TypeScript, Node.js, and PostgreSQL - enterprise technology at small business pricing. I also have experience with vanilla JavaScript, and can adapt to project needs. I always recommend the best technology for each case.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "Two payments: 50% to start and 50% when the project is delivered. The landing page and the maintenance plan can be paid directly on this site through Stripe. For everything else we agree on the scope and the final price first, and then you receive a secure Stripe payment link. Zelle is also accepted.",
  },
  {
    question: "Can I see progress during development?",
    answer:
      "Absolutely! I provide weekly progress updates and you'll have access to a staging environment where you can see real-time progress. I respond within 24 hours (usually much faster) to any questions or concerns. Transparency is key to my process.",
  },
];


export const testimonials = [
  {
    content:
      "Randy transformed our business with a complete website rebuild. Our old site was slow and outdated – the new one is fast, modern, and professional. But the real value was the custom admin dashboard he created for managing our customer communications. We're now saving 15 hours per week on administrative tasks. What used to take hours now takes minutes. Randy's custom email campaign system is intuitive and exactly what we needed. Randy was professional, communicative, and delivered on time. He explained everything clearly and was always available. Highly recommend RC Web Solutions to any Houston business.",
    author: "Michel Chapelli",
    company: "GSM A/C & General Contractor Inc.",
    rating: 5,
    highlight: "Saving 15 hours per week",
  },
  {
    content:
      "Working with Randy from RC Web Solutions LLC was a great experience. He was professional, responsive, and really took the time to understand my business. The website turned out clean, modern, and easy for customers to use. I'm very happy with the results and would definitely recommend him to anyone needing a professional website.",
    author: "Leonardo Lecour Acosta",
    company: "Leo's Home Experts",
    rating: 5,
    highlight: "Clean, modern, and easy to use",
  },
  {
    content:
      "Excellent experience working on the development of our website. Professional, responsible, and technically skilled. Delivered on time, optimized speed and SEO structure, and was always willing to improve details.",
    author: "Yoannis Aguilar Fonseca",
    company: "",
    rating: 5,
    highlight: "Optimized speed and SEO",
  },
];

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

export const servicePages: ServicePage[] = [
  {
    offerId: "business-website",
    metaTitle: "Business Website Design Houston TX | Custom Sites from $1,000",
    metaDescription:
      "Custom business websites built with Next.js: mobile-first, fast, with local SEO and bilingual English/Spanish support. Based in Houston, TX, working anywhere. From $1,000.",
    headline: "Business Websites Built to Bring in Calls",
    subheadline:
      "From a one-page landing to a full 5-10 page site: custom design, mobile-first, built to turn visitors into calls, appointments and form submissions.",
    content:
      "Your website is often the first contact a customer has with your business, and it works while you are busy with everything else. I build business websites that load in under two seconds, read well on a phone and make it obvious how to call you or book. Every site is designed mobile-first because most people looking for a local service are searching from their phones. I use Next.js and React, the same stack large companies rely on, so the site stays fast and keeps ranking as it grows. A landing page has a fixed price and can be started right here; a larger site is quoted after a short conversation about the pages you need. English and Spanish versions are included when your customers speak both, written by a native Spanish speaker rather than a translator plugin.",
    features: [
      {
        title: "Mobile-First Design",
        description:
          "Designed for phone screens first, then scaled up. The buttons, forms and phone number work where your customers actually are.",
      },
      {
        title: "Loads in Under 2 Seconds",
        description:
          "Built with Next.js, with images and scripts kept lean. Google rewards fast sites, and visitors stay instead of leaving.",
      },
      {
        title: "Local SEO Built In",
        description:
          "Meta tags, structured data and a clean page structure so Google understands what you do and where you serve. Search Console and analytics set up before launch.",
      },
      {
        title: "Bilingual When You Need It",
        description:
          "English and Spanish in one site, with the right language shown to each searcher. Localized by a native speaker, not machine-translated.",
      },
      {
        title: "Contact Forms and Click-to-Call",
        description:
          "Calls to action placed where they convert, spam-protected forms, and leads delivered to your inbox or your admin panel.",
      },
      {
        title: "30 Days of Support",
        description:
          "After launch I stay available for adjustments and questions. Source code, domain and hosting are yours.",
      },
    ],
    relatedProjects: ["Clínica Hispana Gessner", "Clínica Hispana Airline", "Leo's Home Experts"],
    cta: "Get a Custom Website",
  },
  {
    offerId: "website-redesign",
    metaTitle: "Website Redesign Houston TX | Modernize Your Site from $3,500",
    metaDescription:
      "Website redesign and modernization: your current site rebuilt on Next.js, faster and mobile-friendly, with your content and rankings migrated. Based in Houston, TX. From $3,500.",
    headline: "Website Redesign & Modernization",
    subheadline:
      "Your current site rebuilt on modern technology: faster, mobile-friendly and easier for customers to use, with your content and your Google rankings carried over.",
    content:
      "An old website costs you customers quietly: it loads slowly on phones, looks dated next to competitors and is hard to update. A redesign is not just a new coat of paint. I rebuild the site on Next.js, keep every page and URL that already ranks, set up redirects for anything that moves and migrate your content, photos and reviews. The result is a site that loads in under two seconds, works on every screen and that you can keep updating without breaking it. That is what I did for GSM A/C, whose rebuilt site went from a slow template to a fast, conversion-focused site that now books jobs on its own. The price depends on how many pages you have and what needs to be rewritten, so we agree on the scope first.",
    features: [
      {
        title: "Modern Design",
        description:
          "A clean, current look built around your brand, with clear calls to action instead of cluttered templates.",
      },
      {
        title: "Performance Boost",
        description:
          "Rebuilt from scratch on Next.js: faster load times, better Core Web Vitals and no plugins slowing things down.",
      },
      {
        title: "Mobile Optimization",
        description:
          "Every page redesigned for phones first, so the people searching from their car can still call you with one tap.",
      },
      {
        title: "Content Migration",
        description:
          "Pages, blog posts, images and reviews moved over. Nothing you have built up gets lost in the move.",
      },
      {
        title: "Rankings Preserved",
        description:
          "Existing URLs kept or redirected, structured data added and Search Console checked after launch so Google keeps sending traffic.",
      },
      {
        title: "45 Days of Support",
        description:
          "Time to catch the details that only show up once real customers use the new site.",
      },
    ],
    relatedProjects: ["GSM AC & General Contractor", "Clínica Hispana Airline"],
    cta: "Quote My Redesign",
  },
  {
    offerId: "admin-dashboard",
    metaTitle: "Custom Admin Dashboard Houston TX | Business Automation from $7,500",
    metaDescription:
      "Custom admin dashboards for small businesses: leads, customers, payments, email and SMS campaigns and reports in one private panel, with the repetitive work automated. From $7,500.",
    headline: "Admin Dashboard & Automation",
    subheadline:
      "A private panel to manage leads, customers, payments and campaigns from one place, with the repetitive work automated.",
    content:
      "Most small businesses run on a mix of spreadsheets, text messages and three different apps that do not talk to each other. A custom admin dashboard puts that in one place: your leads come in from the website, you see who called, who paid and who needs a follow-up, and campaigns go out by email or SMS from the same screen. I build these panels with Next.js, TypeScript and PostgreSQL, the stack this very site runs on, and connect them to the tools you already use, such as Stripe, Google or Twilio. The scope is tailored to how you work: for GSM A/C the dashboard replaced about fifteen hours a week of manual follow-up. We start with a conversation about your daily routine, agree on what the first version needs to do, and build from there.",
    features: [
      {
        title: "Lead and Customer Management",
        description:
          "Every inquiry from your website, phone or campaigns lands in one list with its status, notes and history.",
      },
      {
        title: "Custom Forms and Workflows",
        description:
          "The forms, statuses and steps that match your business, not a generic CRM you have to bend to fit.",
      },
      {
        title: "Email and SMS Campaigns",
        description:
          "Send newsletters and text campaigns to the customers who opted in, with consent, quotas and unsubscribe handled for you.",
      },
      {
        title: "Stripe Payments",
        description:
          "Deposits, final payments, subscriptions and invoices tracked in the panel, with secure payment links for your customers.",
      },
      {
        title: "Reports and Data Visualization",
        description:
          "Leads by source, revenue by month, campaign results: the numbers you need to decide, without exporting anything.",
      },
      {
        title: "API Integrations and 60 Days of Support",
        description:
          "Connections to the services you already pay for, and two months of support to tune the panel once your team uses it daily.",
      },
    ],
    relatedProjects: ["GSM AC & General Contractor", "RC Beauty Salon"],
    cta: "Quote My Dashboard",
  },
  {
    offerId: "store-and-apps",
    metaTitle: "E-Commerce & Custom Web Apps Houston TX | Online Stores from $8,000",
    metaDescription:
      "Custom online stores with Stripe payments and custom web applications: booking systems, member areas and internal tools built with Next.js. No monthly platform fees. From $8,000.",
    headline: "Online Store & Custom Web Apps",
    subheadline:
      "Full-featured online stores with Stripe and custom platforms built around your business: booking systems, member areas, internal tools. No monthly platform fees.",
    content:
      "Template platforms are a quick start and a long-term ceiling: monthly fees, limited customization, slow pages and plugins that break on every update. When your business outgrows them, I build the store or the platform you actually need. An online store includes Stripe payment processing, real-time inventory, order tracking, customer accounts and an admin panel where you run everything. A custom web application can be a booking system like the one RC Beauty Salon uses, a member area, a portal for your clients or an internal tool for your team. You own the code, pay only for hosting and Stripe's standard fees, and every feature is built for your workflow. Projects this size start with a scoping conversation and a written quote, then a 50% deposit to begin.",
    features: [
      {
        title: "Stripe Checkout and Subscriptions",
        description:
          "Cards, Apple Pay and Google Pay, one-time purchases or recurring plans, with receipts and refunds handled through Stripe.",
      },
      {
        title: "Inventory and Order Processing",
        description:
          "Stock levels, product variants, low-stock alerts and an order flow from paid to shipped, all visible in your admin panel.",
      },
      {
        title: "Customer Accounts",
        description:
          "Order history, saved details and member-only content when your business needs it, with secure sign-in.",
      },
      {
        title: "Booking Systems and Member Areas",
        description:
          "Appointments, reservations and private areas built into the site, so customers book and pay without calling.",
      },
      {
        title: "Database and API Development",
        description:
          "PostgreSQL databases and APIs designed to grow with you, plus integrations with the third-party services you already use.",
      },
      {
        title: "No Platform Fees and 90 Days of Support",
        description:
          "No monthly subscription to a store builder, and three months of support after launch while the first orders come in.",
      },
    ],
    relatedProjects: ["RC Beauty Salon", "GSM AC & General Contractor"],
    cta: "Quote My Project",
  },
  {
    offerId: "maintenance",
    metaTitle: "Website Maintenance & Support | $200/month, Cancel Anytime",
    metaDescription:
      "Monthly website maintenance and support: security updates, backups, uptime monitoring, content updates and technical support for sites I built. $200/month, cancel anytime.",
    headline: "Monthly Maintenance & Support",
    subheadline:
      "Ongoing maintenance, security updates, backups and technical support so your website keeps working while you run your business.",
    content:
      "A website is not finished when it launches. Dependencies get security updates, hosting and domains renew, content goes stale and one day a form stops sending. The maintenance plan covers that for any site I built: I keep the stack updated, monitor uptime and performance, keep backups, make the small content changes you send me and answer technical questions the same day when something is urgent. It is a monthly subscription paid through Stripe that you can cancel at any time from the link in your invoice email. If you need bigger changes, such as a new page or a new feature, I quote them separately so the monthly price stays predictable.",
    features: [
      {
        title: "Security Patches and Updates",
        description:
          "Framework, dependencies and hosting kept current so known vulnerabilities do not sit on your site.",
      },
      {
        title: "Performance and Uptime Monitoring",
        description:
          "I get alerted if the site goes down or slows down, usually before you or your customers notice.",
      },
      {
        title: "Content Updates",
        description:
          "Send me the new photo, price or opening hours and it is live without you touching anything.",
      },
      {
        title: "Backup Management",
        description:
          "Regular backups of your site and database, tested, so a mistake or an outage is a restore and not a rebuild.",
      },
      {
        title: "Technical Support",
        description:
          "Domain, email, analytics or a form that stopped working: one person to write to who already knows your site.",
      },
      {
        title: "Same-Day Response for Urgent Issues",
        description:
          "When the site is down or a payment fails, I respond the same day. Cancel anytime; no long-term contract.",
      },
    ],
    relatedProjects: ["Clínica Hispana Gessner", "Leo's Home Experts", "GSM AC & General Contractor"],
    cta: "Start Maintenance Plan",
  },
];

/** Offer + its long-form page, looked up by /services/[slug] */
export function getServicePage(slug: string) {
  const offer = offers.find((o) => o.slug === slug);
  const page = offer && servicePages.find((p) => p.offerId === offer.id);
  return offer && page ? { offer, page } : null;
}
