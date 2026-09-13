import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";

//Icons
import GithubIcon from "@/components/icons/Github";
import Website from "@/components/icons/Website";

export interface ProjectProps {
  name: string;
  tecnologies: string[];
  description: string;
  image: string;
  github?: string;
  url: string;
  caseStudy?: string;
}

const Project = ({
  name,
  tecnologies,
  description,
  image,
  github,
  url,
  caseStudy,
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
      <div className="p-5 grow flex flex-col">
        <h3 className="text-2xl font-iceland text-gold">{name}</h3>
        <p className="mt-2 text-base text-white/80 font-inter line-clamp-3">{description}</p>

        <div className="flex flex-wrap justify-center gap-1 mt-4 min-h-[60px]">
          {tecnologies.map((item) => (
            <span
              key={item}
              className="inline-flex gap-2 items-center rounded-full px-2.5 py-0.5 text-xs font-inter bg-gold/10 text-gold ring-1 ring-inset ring-gold/20 transition-colors hover:bg-gold/20"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex divide-gray-700 border-t border-gold/50 mt-auto">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50"
          >
            <GithubIcon className="inline-block w-5 h-5 mr-2" />
            GitHub
          </a>
        )}
        {caseStudy && (
          <Link
            href={caseStudy as Route}
            className={`flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition border-r border-gold/50 ${!github ? "rounded-bl-lg" : ""}`}
          >
            Case Study
          </Link>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition ${github || caseStudy ? "rounded-br-lg" : "rounded-b-lg"}`}
        >
          <Website className="inline-block w-5 h-5 mr-2" />
          Preview
        </a>
      </div>
    </>
  );
};

export default Project;
