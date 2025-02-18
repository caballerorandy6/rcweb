"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useRCWebStore } from "@/store/rcweb-store";

//Icons
import { CodeBracketIcon } from "@heroicons/react/24/outline";

//Components
import Heading from "@/app/components/Heading";
import ProjectsDialog from "@/app/components/ProjectsDialog";
import ProjectsGrid from "@/app/components/ProjectsGrid";

const Projects = () => {
  const { setActiveSection, handleClickProjectsDialog } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Projects");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="projects" className="py-16 min-h-screen">
      <Heading icon={<CodeBracketIcon className="w-8 text-gold" />}>
        Projects
      </Heading>

      <ProjectsGrid />

      <button
        type="button"
        className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono flex items-center gap-x-1 border-2 border-gold/50 mt-16 mx-auto cursor-pointer"
        onClick={handleClickProjectsDialog}
      >
        See all Projects
      </button>
      <ProjectsDialog />
    </section>
  );
};

export default Projects;
