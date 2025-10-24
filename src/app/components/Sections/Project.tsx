import Image from "next/image";
import clsx from "clsx";

//Icons
import GithubIcon from "@/app/components/icons/Github";
import Website from "@/app/components/icons/Website";

export interface ProjectProps {
  name: string;
  tecnologies: string[];
  description: string;
  image: string;
  github: string;
  url: string;
}

const Project = ({
  name,
  tecnologies,
  description,
  image,
  github,
  url,
}: ProjectProps) => {
  return (
    <>
      <div className="overflow-hidden rounded-t-lg">
        <Image
          alt={name}
          src={image}
          width={1000}
          height={1000}
          className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
          priority={false}
        />
      </div>

      {/* Technologies */}
      <div className="p-5 flex-grow flex flex-col">
        <h2 className="text-2xl font-iceland text-gold">{name}</h2>
        <p className="mt-2 text-base text-white/80 font-inter">{description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-4">
          {tecnologies.map((item, index) => (
            <span
              key={index}
              className={clsx(
                "inline-flex gap-2 items-center rounded-full px-2 py-0.5 text-xs font-inter",
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
                  "bg-red-500 text-white": item === "HTML",
                  "bg-pink-500 text-white": item === "CSS",
                  "bg-purple-500 text-white": item === "SASS",
                  "bg-green-500 text-white": item === "PostgreSQL",
                  "bg-gray-800 text-white": item === "Prisma",
                  "bg-orange-500 text-white": item === "Docker",
                  "bg-teal-500 text-white": item === "Tailwind UI",
                  "bg-lime-500 text-black": item === "Express",
                  "bg-red-700 text-white": item === "NodeJS",
                  "bg-gray-700 text-white": item === "Framer Motion",
                  "bg-yellow-400 text-black": item === "Supabase",
                  "bg-blue-700 text-white": item === "MySQL",
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
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50"
        >
          <GithubIcon className="inline-block w-5 h-5 mr-2" />
          GitHub
        </a>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-br-lg"
        >
          <Website className="inline-block w-5 h-5 mr-2" />
          Preview
        </a>
      </div>
    </>
  );
};

export default Project;
