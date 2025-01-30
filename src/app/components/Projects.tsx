import Image from "next/image";
import Link from "next/link";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

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
    name: 'Limo Renting',
    tecnologies: ["NextJS", "TypeScript", "TailwindCSS", "ShadcnUi"],
    description: 'A web application that allows you to rent limousines for special events.',
    image: '/limo-renting.webp',
    github: 'https://github.com/caballerorandy6/Limo-Renting-NextJS',
    url: 'https://limo-renting-next-js.vercel.app/',
  },
  // More people...
];

const Projects = () => {
  return <section id="projects" className="py-16"><Heading>Projects</Heading>
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {projects.map((item) => (
        <li
          key={item.name}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow-sm"
        >
          <div className="flex flex-1 flex-col p-8">
            <Image alt="" src={item.image} width={200} height={200} className="mx-auto size-32 shrink-0 rounded-full" />
            <h3 className="mt-6 text-sm font-medium text-gray-900">{item.name}</h3>
            <dl className="mt-1 flex grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              {/* Tecnologies es un array asi que lo voy a trabajar con el componente Badge para cada tecnologia con un map */}
              <dd className="text-sm text-gray-500">{item.tecnologies}</dd> 
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                  {item.description}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <Link
                  href={`mailto:${item.github}`}
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <EnvelopeIcon aria-hidden="true" className="size-5 text-gray-400" />
                  Email
                </Link>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`tel:${item.url}`}
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <PhoneIcon aria-hidden="true" className="size-5 text-gray-400" />
                  Call</a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  </section>;
};

export default Projects;
