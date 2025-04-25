"use client";

//Components
import Experience from "@/app/components/Experience";
import Projects from "@/app/components/Projects";
import About from "@/app/components/About";
import Contact from "@/app/components/Contact";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function Home() {
  useScrollSpy(["experience", "projects", "about", "contact"]);

  return (
    <main>
      <Experience />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
