import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";

// Sections are Server Components: they ship HTML, not JS, so there is
// nothing to lazy-load. Only the floating CTA (client) is split off.
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import BlogPreview from "@/components/sections/BlogPreview";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

const CTA = dynamic(() => import("@/components/sections/FloatingCTA"));

import ScrollSpy from "@/components/ui/ScrollSpy";
import { JsonLdForFaq } from "@/components/seo/JsonLdForFaq";
import { JsonLdForService } from "@/components/seo/JsonLdForService";
import { JsonLdForOrganization } from "@/components/seo/JsonLdForOrganization";
import { JsonLdForLocalBusiness } from "@/components/seo/JsonLdForLocalBusiness";
import { JsonLdForWebSite } from "@/components/seo/JsonLdForWebSite";
import { faqs, offers } from "@/lib/data";

export const metadata: Metadata = {
  title: "Custom Websites & Web Apps for Small Businesses | RC Web Solutions",
  description:
    "Randy Caballero builds fast websites and web apps for small service businesses: booking, Stripe payments and local SEO built in. Based in Houston, TX, working with clients anywhere. From $1,000. Free consultation.",
  alternates: {
    canonical: siteConfig.baseUrl,
  },
};

export default function Home() {
  return (
    <div>
      <JsonLdForOrganization />
      <JsonLdForLocalBusiness />
      <JsonLdForWebSite />
      <JsonLdForFaq faqs={faqs} />
      {offers.map((offer) => (
        <JsonLdForService key={offer.id} offer={offer} />
      ))}
      <ScrollSpy />
      <Hero />
      <Services />
      <Projects />
      <Process />
      <Testimonials />
      <Pricing />
      <BlogPreview />
      <FAQ />
      <Contact />
      <CTA />
    </div>
  );
}
