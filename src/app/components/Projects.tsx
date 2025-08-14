"use client";

import { useId } from "react";
import { useRCWebStore } from "@/store/rcweb-store";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/Heading";

import useSectionObserver from "@/hooks/useSectionObserver";
import { projects } from "@/libs/arrays";
import ProjectsList from "./ProjectsList";

import TechMarquee from "@/app/components/TechMarquee";

const Projects = () => {
  const { isExpanded, handleClickProjectsDialog } = useRCWebStore();
  const contentId = useId();

  const initialVisibleProjects = 3;
  const visibleProjects = isExpanded ? projects.length : initialVisibleProjects;

  const ref = useSectionObserver({
    sectionName: "Projects",
  });

  return (
    <section ref={ref} id="projects" className="py-32 w-10/12 mx-auto">
      <Heading icon={<CodeBracketIcon className="w-8 text-gold" />}>
        Projects
      </Heading>

      <ProjectsList projects={projects.slice(0, visibleProjects)} />

      {projects.length > initialVisibleProjects && (
        <div className="flex justify-center mt-12 mb-10">
          <button
            type="button"
            className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            onClick={handleClickProjectsDialog}
            aria-expanded={isExpanded}
            aria-controls={contentId}
          >
            {isExpanded ? "Show Less" : "All Projects"}
          </button>
        </div>
      )}
      <div className="w-full mx-auto mt-16">
        <TechMarquee />
      </div>
    </section>
  );
};

export default Projects;
