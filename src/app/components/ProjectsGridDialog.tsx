"use client";

import Project from "@/app/components/Project";
import { projects } from "@/libs/arrays";

const ProjectsGridDialog = () => {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full w-ful gap-6 px-2"
    >
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
    </ul>
  );
};

export default ProjectsGridDialog;
