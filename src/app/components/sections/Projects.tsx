"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { useRCWebStore } from "@/store/rcweb-store";
import { CodeBracketIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Heading from "@/app/components/ui/Heading";

import useSectionObserver from "@/hooks/useSectionObserver";
import { projects } from "@/lib/data";
import ProjectsList from "@/app/components/sections/ProjectsList";

import TechMarquee from "@/app/components/ui/TechMarquee";

const Projects = () => {
  const isExpanded = useRCWebStore((state) => state.isExpanded);
  const handleClickProjectsDialog = useRCWebStore((state) => state.handleClickProjectsDialog);
  const contentId = useId();

  const initialVisibleProjects = 3;
  const visibleProjects = isExpanded ? projects.length : initialVisibleProjects;

  const ref = useSectionObserver({
    sectionName: "Projects",
  });

  return (
    <section ref={ref} id="projects" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CodeBracketIcon className="w-8 text-gold" />}
          text="Discover my latest projects and case studies that showcase my skills and expertise in web development."
        >
          Projects
        </Heading>
        {/* Projects with smooth height animation */}
        <motion.div
          id={contentId}
          className="relative"
          initial={false}
          animate={{
            height: "auto",
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
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
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200 hover:scale-105"
              onClick={handleClickProjectsDialog}
              aria-expanded={isExpanded}
              aria-controls={contentId}
              aria-label={
                isExpanded
                  ? "Collapse projects list"
                  : `View all ${projects.length} projects`
              }
              whileTap={{ scale: 0.95 }}
            >
              <span>
                {isExpanded
                  ? "Show Less"
                  : `View All ${projects.length} Projects`}
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <ChevronDownIcon className="w-4 h-4 text-gold" />
              </motion.div>
            </motion.button>
          </motion.div>
        )}

        <motion.div
          className="mt-16 sm:mt-20 pt-12"
          layout
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <TechMarquee />
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
