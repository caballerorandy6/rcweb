"use client";

import Link from "next/link";
import type { Route } from "next";
import { CodeBracketIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import useSectionObserver from "@/hooks/useSectionObserver";
import { projects } from "@/lib/data";
import ProjectsList from "@/components/sections/ProjectsList";
import TechMarquee from "@/components/ui/TechMarquee";
import { motion } from "framer-motion";

const FEATURED_COUNT = 3;

const Projects = () => {
  const ref = useSectionObserver({ sectionName: "Projects" });

  // Show only projects that have case studies (real clients)
  const featuredProjects = projects
    .filter((p) => p.caseStudy)
    .slice(0, FEATURED_COUNT);

  // Fallback to first 3 if none have case studies
  const displayProjects =
    featuredProjects.length > 0 ? featuredProjects : projects.slice(0, FEATURED_COUNT);

  return (
    <section ref={ref} id="projects" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Heading
          icon={<CodeBracketIcon className="w-8 text-gold" />}
          text="Real results for real Houston businesses"
        >
          Featured Projects
        </Heading>

        <ProjectsList projects={displayProjects} />

        {/* View All Projects */}
        <div className="flex justify-center mt-12">
          <Link
            href={"/projects-portfolio" as Route}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-xl transition-all duration-200 hover:scale-105"
          >
            View All {projects.length} Projects
            <span>&rarr;</span>
          </Link>
        </div>

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
