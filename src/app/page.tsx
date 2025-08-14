"use client";

//Components
import Hero from "@/app/components/Hero";
import Experience from "@/app/components/Experience";
import Projects from "@/app/components/Projects";
import About from "@/app/components/About";
import Contact from "@/app/components/Contact";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function Home() {
  useScrollSpy(["home", "experience", "projects", "about", "contact"]);

  return (
    <main>
      <Hero />
      <Experience />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
