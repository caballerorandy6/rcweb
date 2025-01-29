//Components
import Experience from "@/app/components/Experience";
import Projects from "@/app/components/Projects";
import About from "@/app/components/About";
import Contact from "@/app/components/Contact";

export default function Home() {
  return (
    <main>
      <Experience />
      <Projects />
      <About />
      <Contact />
    </main>
  );
}
