"use client";

import Project from "@/app/components/Project";
import { ProjectProps } from "@/app/components/Project";
import { motion, AnimatePresence } from "framer-motion";
import { useId } from "react";

const ProjectsList = ({ projects }: { projects: ProjectProps[] }) => {
  const headingId = useId();
  const contentId = useId();

  return (
    <motion.div
      layout
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      id={contentId}
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-6 lg:px-8"
    >
      <ul className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
        <AnimatePresence>
          {projects.map((item) => (
            <li
              key={item.name}
              className="col-span-1 flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full animateProjectCard"
            >
              <Project
                name={item.name}
                tecnologies={item.tecnologies}
                description={item.description}
                image={item.image}
                github={item.github}
                url={item.url}
              />
            </li>
          ))}
        </AnimatePresence>
      </ul>
    </motion.div>
  );
};

export default ProjectsList;
