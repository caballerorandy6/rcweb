import Image from "next/image";
import { Link, type Href } from "@/i18n/navigation";

//Icons
import GithubIcon from "@/components/icons/Github";
import Website from "@/components/icons/Website";

import type en from "@/messages/en.json";

export type ProjectKey = keyof typeof en.Catalog.projects;

export interface ProjectProps {
  /** Stable id; also the key of its description in the dictionaries */
  id: ProjectKey;
  name: string;
  tecnologies: string[];
  description: string;
  image: string;
  github?: string;
  url: string;
  caseStudy?: Href;
  /** Above the fold on the page that renders it (first row of the portfolio) */
  priority?: boolean;
}

/** Button captions, translated by the list that renders the cards */
export type ProjectLabels = { caseStudy: string; preview: string; github: string };

const Project = ({
  name,
  tecnologies,
  description,
  image,
  github,
  url,
  caseStudy,
  priority = false,
  labels,
}: ProjectProps & { labels: ProjectLabels }) => {
  return (
    <>
      <div className="overflow-hidden rounded-t-2xl">
        <Image
          alt={name}
          src={image}
          width={1000}
          height={1000}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 384px, 400px"
          className="w-full h-36 object-cover rounded-t-2xl transition-transform duration-300 hover:scale-110"
          priority={priority}
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
            className="flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition rounded-bl-2xl border-r border-gold/50"
          >
            <GithubIcon className="inline-block w-5 h-5 mr-2" />
            {labels.github}
          </a>
        )}
        {caseStudy && (
          <Link
            href={caseStudy}
            className={`flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition border-r border-gold/50 ${!github ? "rounded-bl-2xl" : ""}`}
          >
            {labels.caseStudy}
          </Link>
        )}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 py-3 text-base font-inter text-gold hover:bg-gray-800 transition ${github || caseStudy ? "rounded-br-2xl" : "rounded-b-2xl"}`}
        >
          <Website className="inline-block w-5 h-5 mr-2" />
          {labels.preview}
        </a>
      </div>
    </>
  );
};

export default Project;
