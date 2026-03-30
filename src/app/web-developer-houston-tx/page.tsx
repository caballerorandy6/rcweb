import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";

import { genPageMetadata } from "@/utils/genPageMetadata";
import { JsonLdForBreadcrumb } from "@/components/seo/JsonLdForBreadcrumb";
import { JsonLdForLocalBusiness } from "@/components/seo/JsonLdForLocalBusiness";
import { siteConfig } from "@/config/site";
import {
  MapPinIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

export const metadata: Metadata = genPageMetadata({
  title: "Web Developer in Houston, TX | Custom Websites for Local Businesses",
  description:
    "Looking for a web developer in Houston, TX? Randy Caballero builds fast, custom websites for small businesses in Katy, Sugar Land, The Heights, East Houston & beyond. Bilingual English & Spanish. Free consultation.",
  pageRoute: "/web-developer-houston-tx",
});

const houstonAreas = [
  "Downtown Houston",
  "The Heights",
  "Katy",
  "Sugar Land",
  "Cypress",
  "Spring",
  "Pearland",
  "Pasadena",
  "The Woodlands",
  "East Houston",
  "Bellaire",
  "Missouri City",
  "Richmond",
  "Humble",
  "League City",
];

const services = [
  {
    icon: GlobeAltIcon,
    title: "Custom Business Websites",
    description:
      "Professional websites built with Next.js and React that load fast, rank well on Google, and convert visitors into customers.",
  },
  {
    icon: DevicePhoneMobileIcon,
    title: "Mobile-First Design",
    description:
      "Every site is designed mobile-first because over 60% of your Houston customers are searching from their phones.",
  },
  {
    icon: RocketLaunchIcon,
    title: "E-Commerce Solutions",
    description:
      "Online stores with Stripe payments, inventory management, and everything your Houston business needs to sell online.",
  },
  {
    icon: ShieldCheckIcon,
    title: "SEO & Local Visibility",
    description:
      "Built-in local SEO so your business shows up when Houston customers search for your services on Google.",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Bilingual Websites",
    description:
      "English and Spanish websites that reach Houston's diverse community. Latino-owned business that understands the market.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Affordable Plans",
    description:
      "Transparent pricing starting at $997. No hidden fees, 50/50 payment split, and a dedicated client portal to track progress.",
  },
];

const caseStudies = [
  {
    name: "Clínica Hispana Gessner",
    result: "Professional bilingual website for a Houston Hispanic clinic with online appointment booking",
    industry: "Healthcare",
    url: "https://www.clinicagessner.com/",
  },
  {
    name: "Clínica Hispana Airline",
    result: "Bilingual clinic website with local SEO targeting the Hispanic community in Houston",
    industry: "Healthcare",
    url: "https://www.clinicahispanaairline.com/",
  },
  {
    name: "GSM A/C & General Contractor",
    result: "Saved 15 hours/week with automated admin dashboard and email campaigns",
    industry: "HVAC Services",
    url: "/case-study/gsmactx",
  },
  {
    name: "Leo's Home Experts",
    result: "Local SEO optimized landing page with video gallery and lead capture",
    industry: "Home Services",
    url: "https://www.ac-remodelingservice.com/",
  },
  {
    name: "Dulce Antojo Snack Carts",
    result: "Conversion-optimized landing page for event catering bookings",
    industry: "Food & Events",
    url: "https://www.dulcesantojosnackcarts.com/",
  },
];

export default function WebDeveloperHoustonPage() {
  return (
    <>
      <JsonLdForBreadcrumb
        itemList={[
          { name: "Home", item: siteConfig.baseUrl },
          {
            name: "Web Developer Houston TX",
            item: `${siteConfig.baseUrl}/web-developer-houston-tx`,
          },
        ]}
      />
      <JsonLdForLocalBusiness />

      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-sm font-medium text-gold mb-8">
                <MapPinIcon className="h-4 w-4" />
                Houston, Texas
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-iceland">
                Web Developer in{" "}
                <span className="text-gold">Houston, TX</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-300 font-inter">
                I&apos;m Randy Caballero, a full-stack web developer based in
                Houston, Texas. I build fast, modern websites and web
                applications that help local businesses grow online. Bilingual
                service in English and Spanish.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schedule"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-yellow-200 to-gold px-6 py-4 text-base font-semibold text-black hover:from-yellow-200 hover:via-gold hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                  Free Consultation
                </Link>
                <a
                  href="tel:+13463757534"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gold/50 px-6 py-3 text-base font-semibold text-gold hover:bg-gold/10 hover:border-gold/60 transition-all duration-200 font-inter"
                >
                  <PhoneIcon className="h-5 w-5" />
                  (346) 375-7534
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose a Local Houston Developer */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                Why Hire a Local Houston Web Developer?
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">
                Working with a developer who knows Houston means your website is
                built to reach the right customers in your area.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-gold/30 transition-colors duration-300"
                >
                  <service.icon className="h-8 w-8 text-gold mb-4" />
                  <h3 className="text-xl font-semibold text-white font-iceland">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-gray-400 font-inter leading-7">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Houston Case Studies */}
        <section className="py-20 sm:py-28 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                Houston Businesses I&apos;ve Helped
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">
                Real results for real Houston businesses — from HVAC contractors
                to home service companies.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {caseStudies.map((study) => (
                <Link
                  key={study.name}
                  href={study.url as Route}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-gold/30 transition-all duration-300"
                >
                  <span className="text-sm font-medium text-gold/70 font-inter">
                    {study.industry}
                  </span>
                  <h3 className="mt-2 text-xl font-semibold text-white font-iceland group-hover:text-gold transition-colors">
                    {study.name}
                  </h3>
                  <p className="mt-3 text-gray-400 font-inter leading-7">
                    {study.result}
                  </p>
                  <span className="mt-4 inline-flex text-sm font-medium text-gold group-hover:underline font-inter">
                    View project &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Areas Served */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                Serving the Greater Houston Area
              </h2>
              <p className="mt-4 text-lg text-gray-400 font-inter">
                Based in Houston, I work with businesses across the entire
                metropolitan area. 100% remote-friendly with in-person meetings
                available.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {houstonAreas.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 font-inter"
                >
                  <MapPinIcon className="h-3.5 w-3.5 text-gold/70" />
                  {area}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 sm:py-28 bg-white/[0.02]">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                What You Get Working With Me
              </h2>
            </div>

            <div className="mx-auto max-w-3xl">
              {[
                "Custom website built with Next.js — the same technology used by Nike, Netflix, and Twitch",
                "Mobile-responsive design that works on every device",
                "Built-in SEO so Google can find your Houston business",
                "Fast loading speeds (under 2 seconds) that keep visitors engaged",
                "Bilingual support — I speak English and Spanish fluently",
                "Dedicated client portal to track your project progress in real-time",
                "50/50 payment plan — pay half upfront, half on delivery",
                "Free 30-minute consultation — no obligation, no pressure",
              ].map((item) => (
                <div
                  key={item}
                  className="flex gap-4 py-4 border-b border-white/5 last:border-b-0"
                >
                  <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-gold" />
                  <p className="text-gray-300 font-inter">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl font-iceland">
                Ready to Grow Your Houston Business Online?
              </h2>
              <p className="mt-6 text-lg text-gray-400 font-inter">
                Let&apos;s talk about your project. Book a free 30-minute
                consultation and I&apos;ll show you exactly how a custom website
                can bring more customers to your business.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/schedule"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold via-yellow-200 to-gold px-8 py-4 text-lg font-semibold text-black hover:from-yellow-200 hover:via-gold hover:to-yellow-200 transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter"
                >
                  <CalendarDaysIcon className="h-5 w-5" />
                  Schedule Free Consultation
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500 font-inter">
                Or call directly:{" "}
                <a
                  href="tel:+13463757534"
                  className="text-gold hover:underline"
                >
                  (346) 375-7534
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
