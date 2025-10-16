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
import ScrollSpy from "@/app/components/ScrollSpy";
import { JsonLdForFaq } from "@/app/components/JsonLdForFaq";
import { JsonLdForProduct } from "@/app/components/JsonLdForProduct";
import { JsonLdForOrganization } from "@/app/components/JsonLdForOrganization";
import { JsonLdForLocalBusiness } from "@/app/components/JsonLdForLocalBusiness";
import { faqs, pricingPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Professional full-stack web development services by Randy Caballero. Custom websites, web applications, and scalable digital solutions built with Next.js, React, and modern technologies. Flexible pricing plans for startups, small businesses, and enterprises.",
  keywords: [
    "web development services",
    "Next.js development",
    "React web applications",
    "custom website development",
    "full-stack developer",
    "freelance web developer",
    "modern web solutions",
    "scalable web applications",
    "business websites",
    "e-commerce development",
  ],
  openGraph: {
    title: "RC Web - Professional Web Development Services",
    description:
      "Transform your business with custom web solutions. Specializing in Next.js, React, and full-stack development. 5+ years of experience delivering scalable, modern applications.",
    url: siteConfig.baseUrl,
    siteName: "RC Web Solutions LLC",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "RC Web - Professional Web Development Services by Randy Caballero",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RC Web - Professional Web Development Services",
    description:
      "Custom web solutions built with Next.js and React. Flexible pricing for businesses of all sizes.",
    images: ["/og-image.jpg"],
    creator: "@RCWeb2025",
  },
  alternates: {
    canonical: siteConfig.baseUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return (
    <main>
      <JsonLdForOrganization />
      <JsonLdForLocalBusiness />
      <JsonLdForFaq faqs={faqs} />
      {pricingPlans.map((plan) => (
        <JsonLdForProduct
          key={plan.id}
          name={`${plan.name} Plan - Web Development Services`}
          description={`${plan.description}. ${plan.ideal}. Includes: ${plan.features.join(", ")}`}
          image={`${siteConfig.baseUrl}/og-image.jpg`}
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
