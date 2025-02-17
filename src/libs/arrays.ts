import { ProjectProps } from "@/app/components/Project";

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
