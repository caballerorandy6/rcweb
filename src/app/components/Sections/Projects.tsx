"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useRCWebStore } from "@/store/rcweb-store";
import { CodeBracketIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/Heading";

import useSectionObserver from "@/hooks/useSectionObserver";
import { projects } from "@/lib/data";
import ProjectsList from "@/app/components/ProjectsList";

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
    <section ref={ref} id="projects" className="pt-24 sm:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CodeBracketIcon className="w-8 text-gold" />}
          text="Discover my latest projects and case studies that showcase my skills
            and expertise in web development."
        >
          Projects
        </Heading>
        {/* Projects with smooth height animation */}
        <motion.div
          className="relative"
          initial={false}
          animate={{
            height: "auto",
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        >
          <ProjectsList projects={projects.slice(0, visibleProjects)} />
          {/* Gradient overlay when collapsed */}
        </motion.div>

        {projects.length > initialVisibleProjects && (
          <motion.div
            className="flex justify-center mt-10"
            layout
            transition={{
              layout: { duration: 0.3 },
              ease: "easeInOut",
            }}
          >
            <motion.button
              type="button"
              className="group text-sm font-inter text-white/80 hover:bg-gold/20 px-6 py-2.5 rounded-lg flex items-center gap-x-2 border border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
              onClick={handleClickProjectsDialog}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `View All ${projects.length} Projects`}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronDownIcon className="w-4 h-4 text-gold" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        <motion.div
          className="mt-20 pt-12"
          layout
          transition={{ duration: 0.3 }}
        >
          <TechMarquee />
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
