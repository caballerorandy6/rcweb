"use client";

import Project from "@/app/components/Project";
import { ProjectProps } from "@/app/components/Project";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useId } from "react";

const ProjectsList = ({ projects }: { projects: ProjectProps[] }) => {
  const headingId = useId();
  const contentId = useId();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const item: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      layout
      transition={{
        layout: {
          duration: 0.5,
          ease: "easeInOut",
        },
      }}
      id={contentId}
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-6 lg:px-8"
    >
      <motion.ul
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {projects.map((project, index) => (
            <motion.li
              key={project.name}
              layout
              variants={item}
              initial="hidden"
              animate="show"
              exit="exit"
              custom={index}
              className="col-span-1 flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full animateProjectCard"
              whileHover={{
                scale: 1.03,
                borderColor: "rgba(203, 178, 106, 0.8)",
                transition: { duration: 0.2 },
              }}
            >
              <Project
                name={project.name}
                tecnologies={project.tecnologies}
                description={project.description}
                image={project.image}
                github={project.github}
                url={project.url}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </motion.div>
  );
};

export default ProjectsList;
