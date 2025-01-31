import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

//Icons
import GithubIcon from "@/app/components/icons/Github";
import Website from "@/app/components/icons/Website";

//Components
import Heading from "./Heading";

interface ProjectProps {
  name: string;
  tecnologies: string[];
  description: string;
  image: string;
  github: string;
  url: string;
}

//Arrays
const projects: ProjectProps[] = [
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
  return (
    <section id="projects" className="py-16">
      <Heading>Projects</Heading>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-10/12 mx-auto"
      >
        {projects.map((item) => (
          <li
            key={item.name}
            className="col-span-1 flex flex-col divide-y divide-gray-800 bg-gray-900 text-center shadow-sm border-2 border-gold/50 rounded-lg"
          >
            <div className="flex flex-1 flex-col border-b-2 border-gold/50">
              <Image
                alt="Limo Renting"
                src={item.image}
                width={1000}
                height={1000}
                className="mx-auto w-full  object-cover rounded-t-md border-b-2 border-gold/50"
              />
              <div className="p-4">
                <h3 className="my-2 font-bold text-gold font-mono text-xl">
                  {item.name}
                </h3>
                <dl className="my-4 flex grow flex-col justify-between">
                  <dd className="text-sm flex flex-wrap justify-center gap-1">
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
                  </dd>
                  <dd className="mt-1">
                    <span className="inline-flex items-center px-2 text-xs font-medium text-gray-300 mt-4">
                      {item.description}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-700">
                <div className="flex w-0 flex-1">
                  <Link
                    href={item.github}
                    target="_blank"
                    className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 py-4 text-sm font-semibold text-gold hover:bg-gray-800 transition-colors cursor-pointer border-r border-gold/50"
                  >
                    <GithubIcon />
                    Github
                  </Link>
                </div>
                <div className="-ml-px flex w-0 flex-1">
                  <Link
                    href={item.url}
                    target="_blank"
                    className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 py-4 text-sm font-semibold text-gold hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <Website />
                    Website
                  </Link>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;
