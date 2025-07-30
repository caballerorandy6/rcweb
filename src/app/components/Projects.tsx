"use client";

import { useRCWebStore } from "@/store/rcweb-store";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/Heading";
import ProjectsDialog from "@/app/components/ProjectsDialog";
import ProjectsGrid from "@/app/components/ProjectsGrid";
import useSectionObserver from "@/hooks/useSectionObserver";

const Projects = () => {
  const { handleClickProjectsDialog } = useRCWebStore();

  const ref = useSectionObserver({
    sectionName: "Projects",
  });

  return (
    <section ref={ref} id="projects" className="py-16 w-10/12 mx-auto">
      <Heading icon={<CodeBracketIcon className="w-8 text-gold" />}>
        Projects
      </Heading>

      <ProjectsGrid />

      <div className="flex justify-center mt-12 mb-10">
        <button
          type="button"
          className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
          onClick={handleClickProjectsDialog}
        >
          All Projects
        </button>

        <ProjectsDialog />
      </div>
    </section>
  );
};

export default Projects;
