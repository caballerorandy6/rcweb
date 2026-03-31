import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

// Hero loads immediately (above the fold)
import Hero from "@/components/sections/Hero";

// Lazy load sections below the fold for better LCP
const Services = dynamic(() => import("@/components/sections/Services"));
const LeadMagnetBanner = dynamic(() => import("@/components/sections/LeadMagnetBanner"));
const Projects = dynamic(() => import("@/components/sections/Projects"));
const Process = dynamic(() => import("@/components/sections/Process"));
const Testimonials = dynamic(() => import("@/components/sections/Testimonials"));
const Pricing = dynamic(() => import("@/components/sections/Pricing"));
const BlogPreview = dynamic(() => import("@/components/sections/BlogPreview"));
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
  title: "Web Developer Houston TX | Custom Websites for Small Businesses",
  description:
    "Houston TX web developer Randy Caballero builds custom websites and web apps for small businesses. Next.js, React, bilingual English & Spanish. From $997. Free consultation.",
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
      <LeadMagnetBanner />
      <Projects />
      <Process />
      <Testimonials />
      <Pricing />
      <BlogPreview />
      <FAQ />
      <Contact />
      <CTA />
    </main>
  );
}
