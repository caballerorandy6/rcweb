import { ProjectProps } from "@/app/components/Project";
import React from "react";
import JavaScriptIcon from "@/app/components/icons/Javascript";
import ReactIcon from "@/app/components/icons/React";
import NextJS from "@/app/components/icons/NextJS";
import PostgreSQL from "@/app/components/icons/PostgreSQL";
import TailwindCSS from "@/app/components/icons/TailwindCSS";
import Docker from "@/app/components/icons/Docker";
import TypeScript from "@/app/components/icons/TypeScript";
import AWS from "@/app/components/icons/AWS";
import { TeachMarqueeProps } from "@/app/components/TechMarquee";
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { NavigationProps } from "@/app/components/Navbar";
import { ExperienceProps } from "@/app/components/Experience";

export const navigation: NavigationProps[] = [
  { name: "Home", hash: "#home" },
  {
    name: "Experience",
    hash: "#experience",
  },
  { name: "Projects", hash: "#projects" },
  { name: "About", hash: "#about" },
  { name: "Contact", hash: "#contact" },
];

export const experience: ExperienceProps[] = [
  {
    title: "Freelance Web Developer and Digital Marketing",
    company: "Freelancer",
    location: "Houston, TX",
    description: "Web Developer and Digital Marketing Specialist",
    icon: React.createElement(BriefcaseIcon),
    date: "January 2022 - Present",
  },
  {
    title: "Software Developer",
    company: "Atser Technologies, Inc.",
    location: "Houston, TX",
    description: "Software Developer",
    icon: React.createElement(BriefcaseIcon),
    date: "November 2024 - April 2025",
  },
  {
    title: "Software Developer",
    company: "Revature",
    location: "Houston, TX",
    description: "Software Developer",
    icon: React.createElement(BriefcaseIcon),
    date: "August 2022 - September 2022",
  },

  {
    title: "Bachelor of Software Engineering",
    company: "Universidad de Camaguey, Ignacio Agramonte Loynaz",
    location: "Camaguey, Cuba",
    description: "Software Engineer Student",
    icon: React.createElement(AcademicCapIcon),
    date: "September 2007 - July 2012",
  },
];

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
    image: "/limo-renting.avif",
    github: "https://github.com/caballerorandy6/Limo-Renting-NextJS",
    url: "https://limo-renting-next-js-nu.vercel.app/",
  },
  {
    name: "GSM AC ",
    tecnologies: ["React", "TailwindCSS", "JavaScript", "Vite"],
    description:
      "The SPA allows users to explore and request HVAC installation, repair, and maintenance services dynamically without page reloads.",
    image: "/gsmactx.avif",
    github: "https://github.com/caballerorandy6/gsmactx_2.0",
    url: "https://www.gsmactx.com/",
  },
  {
    name: "Photographer Portfolio",
    tecnologies: ["html", "css", "sass"],
    description:
      "The website is an online portfolio showcasing a photographer's work, providing visitors with a collection of images and information about their services.",
    image: "/photographer.avif",
    github: "https://github.com/caballerorandy6/photographer-portfolio",
    url: "https://photographerportfolio1.netlify.app",
  },
  {
    name: "Little Lemon Restaurant",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "ShadcnUi",
      "Zod",
      "Zustand",
      "Prisma",
      "PostgreSQL",
    ],
    description:
      "A restaurant website that showcases the menu, location, and contact information, built with Next.js and Tailwind CSS.",
    image: "/littlelemon.avif",
    github: "https://github.com/caballerorandy6/little-lemon-restaurant",
    url: "https://little-lemon-restaurant-nine-omega.vercel.app/",
  },
  {
    name: "Search Drinks",
    tecnologies: ["React", "Vite"],
    description:
      "The website allows users to search for and explore various drinks, providing details about their ingredients and preparation methods.",
    image: "/searchdrinks.avif",
    github: "https://github.com/caballerorandy6/seachdrinks",
    url: "https://seachdrinks.netlify.app/",
  },
];

export const teachMarqueeData: TeachMarqueeProps[] = [
  {
    href: "https://www.javascript.com/",
    name: "JavaScript",
    icon: React.createElement(JavaScriptIcon),
  },
  {
    href: "https://www.typescriptlang.org/",
    name: "TypeScript",
    icon: React.createElement(TypeScript),
  },
  {
    href: "https://reactjs.org/",
    name: "React",
    icon: React.createElement(ReactIcon),
  },
  {
    href: "https://www.nextjs.org/",
    name: "Next.js",
    icon: React.createElement(NextJS),
  },
  {
    href: "https://tailwindcss.com/",
    name: "Tailwind CSS",
    icon: React.createElement(TailwindCSS),
  },
  {
    href: "https://www.postgresql.org/",
    name: "PostgreSQL",
    icon: React.createElement(PostgreSQL),
  },
  {
    href: "https://www.docker.com/",
    name: "Docker",
    icon: React.createElement(Docker),
  },
  {
    href: "https://aws.amazon.com/",
    name: "AWS",
    icon: React.createElement(AWS),
  },
];
