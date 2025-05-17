import Project from "@/app/components/Project";
import { projects } from "@/libs/arrays";

const ProjectsGrid = () => {
  return (
    <ul
      role="list"
      className="grid w-full gap-6
                 grid-cols-1
                 sm:grid-cols-2
                 xl:grid-cols-3
                 "
    >
      {projects.slice(0, 12).map((p) => (
        <li
          key={p.name}
          className="flex flex-col h-full rounded-lg border border-gold/50
                     bg-gray-900/90 text-center shadow-md transition-shadow
                     hover:shadow-lg"
        >
          <Project {...p} />
        </li>
      ))}
    </ul>
  );
};

export default ProjectsGrid;
