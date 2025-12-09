import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

// Components
import Hero from "@/app/components/Sections/Hero";
import Services from "@/app/components/Sections/Services";
import Projects from "@/app/components/Sections/Projects";
import Process from "@/app/components/Sections/Process";
import Experience from "@/app/components/Sections/Experience";
import Testimonials from "@/app/components/Sections/Testimonials";
import About from "@/app/components/Sections/About";
import Pricing from "@/app/components/Sections/Pricing";
import FAQ from "@/app/components/Sections/FAQ";
import Contact from "@/app/components/Sections/Contact";
import CTA from "@/app/components/Sections/FloatingCTA";
import Certifications from "@/app/components/Sections/Certifications";
import ScrollSpy from "@/app/components/ui/ScrollSpy";
import { JsonLdForFaq } from "@/app/components/seo/JsonLdForFaq";
import { JsonLdForService } from "@/app/components/seo/JsonLdForService";
import { JsonLdForOrganization } from "@/app/components/seo/JsonLdForOrganization";
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
      <Testimonials />
      <Process />
      <Pricing />
      <FAQ />
      <Experience />
      <Certifications />
      <About />
      <Contact />
      <CTA />
    </main>
  );
}
