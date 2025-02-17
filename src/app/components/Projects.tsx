"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useInView } from "react-intersection-observer";
import { useRCWebStore } from "@/store/rcweb-store";

//Icons
import GithubIcon from "@/app/components/icons/Github";
import Website from "@/app/components/icons/Website";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

//Components
import Heading from "@/app/components/Heading";
import ProjectsDialog from "@/app/components/ProjectsDialog";

interface ProjectProps {
  name: string;
  tecnologies: string[];
  description: string;
  image: string;
  github: string;
  url: string;
}

//Arrays
export const projects: ProjectProps[] = [
  {
    name: "Limo Renting",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "ShadcnUi",
      "Zod",
      "Zustand",
    ],
    description:
      "A web application that allows you to rent limousines for special events.",
    image: "/limo-renting.webp",
    github: "https://github.com/caballerorandy6/Limo-Renting-NextJS",
    url: "https://limo-renting-next-js.vercel.app/",
  },
  {
    name: "GSM AC ",
    tecnologies: ["React", "TailwindCSS", "JavaScript", "Vite"],
    description:
      "The SPA allows users to explore and request HVAC installation, repair, and maintenance services dynamically without page reloads.",
    image: "/gsmactx.webp",
    github: "https://github.com/caballerorandy6/GSM_AC_frontend",
    url: "https://www.gsmactx.com/",
  },
  {
    name: "Search Drinks",
    tecnologies: ["React", "Vite"],
    description:
      "The website allows users to search for and explore various drinks, providing details about their ingredients and preparation methods.",
    image: "/searchdrinks.webp",
    github: "https://github.com/caballerorandy6/seachdrinks",
    url: "https://seachdrinks.netlify.app/",
  },
  {
    name: "Photographer Portfolio",
    tecnologies: ["html", "css", "sass"],
    description:
      "The website is an online portfolio showcasing a photographer's work, providing visitors with a collection of images and information about their services.",
    image: "/photographer.webp",
    github: "https://github.com/caballerorandy6/photographer-portfolio",
    url: "https://photographerportfolio1.netlify.app",
  },
];

const Projects = () => {
  const { setActiveSection, handleClickProjetsDialog } = useRCWebStore();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Projects");
    }
  }, [inView, setActiveSection]);

  return (
    <section ref={ref} id="projects" className="py-16">
      <Heading icon={<CodeBracketIcon className="w-8 text-gold" />}>
        Projects
      </Heading>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-10/12 mx-auto"
      >
        {projects.map((item) => (
          <li
            key={item.name}
            className="col-span-1 flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg transition-shadow animateProjectCard"
          >
            <div className="overflow-hidden rounded-t-lg">
              <Image
                alt={item.name}
                src={item.image}
                width={1000}
                height={1000}
                className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
              />
            </div>

            {/* Technologies */}
            <div className="p-5 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-gold">{item.name}</h3>
              <p className="mt-2 text-sm text-gray-400">{item.description}</p>

              <div className="flex flex-wrap justify-center gap-1 mt-4">
                {item.tecnologies.map((item, index) => (
                  <span
                    key={index}
                    className={clsx(
                      "inline-flex gap-2 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      {
                        "bg-black/50 text-white": item === "NextJS",
                        "bg-blue-500 text-white": item === "TypeScript",
                        "bg-indigo-500 text-white": item === "TailwindCSS",
                        "bg-gray-500 text-white": item === "ShadcnUi",
                        "bg-yellow-500 text-black": item === "JavaScript",
                        "bg-cyan-500 text-white": item === "React",
                        "bg-violet-500 text-white": item === "Vite",
                        "bg-fuchsia-500 text-white": item === "Zod",
                        "bg-white/90 text-blue-700": item === "Zustand",
                        "bg-red-500 text-white": item === "html",
                        "bg-pink-500 text-white": item === "css",
                        "bg-purple-500 text-white": item === "sass",
                      }
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex divide-gray-700 border-t border-gold/50 mt-auto">
              <Link
                href={item.github}
                target="_blank"
                className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50"
              >
                <GithubIcon className="inline-block w-5 h-5 mr-2" />
                GitHub
              </Link>
              <Link
                href={item.url}
                target="_blank"
                className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-br-lg"
              >
                <Website className="inline-block w-5 h-5 mr-2" />
                Preview
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono flex items-center gap-x-1 border-2 border-gold/50 mt-16 mx-auto"
        onClick={handleClickProjetsDialog}
      >
        See all Projects
      </button>
      <ProjectsDialog />
    </section>
  );
};

export default Projects;
