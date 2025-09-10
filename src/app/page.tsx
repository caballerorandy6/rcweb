"use client";

//Components
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

import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function Home() {
  useScrollSpy([
    "home",
    "services",
    "projects",
    "testimonials",
    "process",
    "pricing",
    "faq",
    "experience",
    "about",
    "contact",
    "cta",
  ]);

  return (
    <main>
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
