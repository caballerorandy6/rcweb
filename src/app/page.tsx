import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

// Hero loads immediately (above the fold)
import Hero from "@/components/sections/Hero";

// Lazy load sections below the fold for better LCP
const Services = dynamic(() => import("@/components/sections/Services"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Contact = dynamic(() => import("@/components/sections/Contact"));
const CTA = dynamic(() => import("@/components/sections/FloatingCTA"));

import ScrollSpy from "@/components/ui/ScrollSpy";
import { JsonLdForFaq } from "@/components/seo/JsonLdForFaq";
import { JsonLdForService } from "@/components/seo/JsonLdForService";
import { JsonLdForOrganization } from "@/components/seo/JsonLdForOrganization";
import { JsonLdForLocalBusiness } from "@/components/seo/JsonLdForLocalBusiness";
import { JsonLdForWebSite } from "@/components/seo/JsonLdForWebSite";
import { faqs, pricingPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Professional full-stack web development services by Randy Caballero. Custom websites, web applications, and scalable digital solutions built with Next.js, React, and modern technologies. Flexible pricing plans for startups, small businesses, and enterprises.",
  alternates: {
    canonical: siteConfig.baseUrl,
  },
};

export default function Home() {
  return (
    <main>
      <JsonLdForOrganization />
      <JsonLdForLocalBusiness />
      <JsonLdForWebSite />
      <JsonLdForFaq faqs={faqs} />
      {pricingPlans.map((plan) => (
        <JsonLdForService
          key={plan.id}
          name={plan.name}
          description={`${plan.description}. ${plan.ideal}`}
          price={plan.priceInCents / 100}
          duration={plan.duration}
        />
      ))}
      <ScrollSpy />
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <CTA />
    </main>
  );
}
