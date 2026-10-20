import Project from "@/components/sections/Project";
import type { ProjectProps } from "@/components/sections/Project";

// Server Component: cards render in the HTML and reveal on scroll via CSS
const ProjectsList = ({ projects }: { projects: ProjectProps[] }) => {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-8">
      <ul className="mx-auto mt-16 flex flex-wrap justify-center gap-x-8 gap-y-20">
        {projects.map((project) => (
          <li
            key={project.name}
            className="reveal flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-2xl shadow-md transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.03] hover:border-gold/80 hover:shadow-lg w-full max-w-sm lg:max-w-[calc((100%-4rem)/3)]"
          >
            <Project
              name={project.name}
              tecnologies={project.tecnologies}
              description={project.description}
              image={project.image}
              github={project.github}
              url={project.url}
              caseStudy={project.caseStudy}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsList;
