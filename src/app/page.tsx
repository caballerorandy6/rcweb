import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Components
import Hero from "@/app/components/sections/Hero";
import Services from "@/app/components/sections/Services";
import Projects from "@/app/components/sections/Projects";
import Process from "@/app/components/sections/Process";
import Experience from "@/app/components/sections/Experience";
import Testimonials from "@/app/components/sections/Testimonials";
import Pricing from "@/app/components/sections/Pricing";
import FAQ from "@/app/components/sections/FAQ";
import Contact from "@/app/components/sections/Contact";
import CTA from "@/app/components/sections/FloatingCTA";
import Certifications from "@/app/components/sections/Certifications";
import ScrollSpy from "@/app/components/ui/ScrollSpy";
import { JsonLdForFaq } from "@/app/components/seo/JsonLdForFaq";
import { JsonLdForService } from "@/app/components/seo/JsonLdForService";
import { JsonLdForOrganization } from "@/app/components/seo/JsonLdForOrganization";
import { JsonLdForLocalBusiness } from "@/app/components/seo/JsonLdForLocalBusiness";
import { JsonLdForWebSite } from "@/app/components/seo/JsonLdForWebSite";
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
      <Experience />
      <Certifications />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Contact />
      <CTA />
    </main>
  );
}
