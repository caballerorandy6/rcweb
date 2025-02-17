import Image from "next/image";
import Link from "next/link";
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
        />
      </div>

      {/* Technologies */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gold">{name}</h3>
        <p className="mt-2 text-sm text-gray-400">{description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-4">
          {tecnologies.map((item, index) => (
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
          href={github}
          target="_blank"
          className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50"
        >
          <GithubIcon className="inline-block w-5 h-5 mr-2" />
          GitHub
        </Link>
        <Link
          href={url}
          target="_blank"
          className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-br-lg"
        >
          <Website className="inline-block w-5 h-5 mr-2" />
          Preview
        </Link>
      </div>
    </>
  );
};

export default Project;
