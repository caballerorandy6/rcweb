//Components
import Project from "@/app/components/Project";

import { projects } from "@/libs/arrays";

//Arrays

const ProjectsGrid = () => {
  return (
    <ul
      role="list"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-8/12 mx-auto gap-4"
    >
      {projects.slice(-3).map((item) => (
        <li
          key={item.name}
          className="justify-center col-span-1 flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg transition-shadow w-full animateProjectCard"
        >
          <Project
            key={item.name}
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

export default ProjectsGrid;
