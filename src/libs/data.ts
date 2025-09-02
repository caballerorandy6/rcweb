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
import MySQL from "@/app/components/icons/MySQL";
import Prisma from "@/app/components/icons/Prisma";
import MongoDB from "@/app/components/icons/MongoDB";
import SASS from "@/app/components/icons/SASS";
import Jira from "@/app/components/icons/Jira";
import Wordpress from "@/app/components/icons/Wordpress";
import { TeachMarqueeProps } from "@/app/components/TechMarquee";
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { NavigationProps } from "@/app/components/Navbar";
import { ExperienceProps } from "@/app/components/Sections/Experience";

export const navigation: NavigationProps[] = [
  { name: "Home", hash: "#home" },
  { name: "Services", hash: "#services" },
  { name: "Projects", hash: "#projects" },
  { name: "Process", hash: "#process" },
  {
    name: "Experience",
    hash: "#experience",
  },
  { name: "Testimonials", hash: "#testimonials" },
  { name: "About", hash: "#about" },
  { name: "Pricing", hash: "#pricing" },
  { name: "FAQ", hash: "#faq" },
  { name: "Contact", hash: "#contact" },
  { name: "CTA", hash: "#cta" },
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
      "This web-based platform streamlines the process of renting limousines for special occasions, offering users real-time access to vehicle availability, service customization, and secure booking—all within a modern, responsive interface.",
    image: "/limo-renting.avif",
    github: "https://github.com/caballerorandy6/Limo-Renting-NextJS",
    url: "https://limo-renting-next-js-nu.vercel.app/",
  },
  {
    name: "GSM AC ",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "Tailwind UI",
      "Zod",
      "Zustand",
      "Prisma",
      "PostgreSQL",
      "Docker",
    ],
    description:
      "Developed a SPA for dynamic air conditioning service requests with real-time client-side rendering and an admin dashboard for managing listings and bulk email campaigns.",
    image: "/gsmactx.avif",
    github: "https://github.com/caballerorandy6/gsmactx_2.0",
    url: "https://www.gsmactx.com/",
  },
  {
    name: "Photographer Portfolio",
    tecnologies: ["HTML", "CSS", "SASS"],
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
    href: "https://www.mysql.com/",
    name: "MySQL",
    icon: React.createElement(MySQL),
  },
  {
    href: "https://www.prisma.io/",
    name: "Prisma",
    icon: React.createElement(Prisma),
  },
  {
    href: "https://www.mongodb.com/",
    name: "MongoDB",
    icon: React.createElement(MongoDB),
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
  {
    href: "https://sass-lang.com/",
    name: "SASS",
    icon: React.createElement(SASS),
  },
  {
    href: "https://www.atlassian.com/software/jira",
    name: "Jira",
    icon: React.createElement(Jira),
  },
  {
    href: "https://wordpress.org/",
    name: "WordPress",
    icon: React.createElement(Wordpress),
  },
];

//Repeated icons for the TechMarquee to avoid no gap between last and first icon
export const repeatedIcons = [...teachMarqueeData, ...teachMarqueeData];

export const certifications = [
  {
    name: "Evaluation of the Bachelor's Degree in Software Engineering",
    platform: "Universidad de Camaguey, Cuba",
    description:
      "An evaluation of the Bachelor's degree program in Software Engineering.",
    tutor: "Universidad de Camaguey, Cuba",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/randy_caballero-software_engineer_title_evaluation_bq77pk.avif",
  },
  {
    name: "Master of Science",
    platform: "Nova Southeastern University",
    description: "Master of Science in Education",
    tutor: "Nova Southeastern University",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Master_of_Science_Title_zapkmh.avif",
  },
  {
    name: "Modern JavaScript from Beginning",
    platform: "Udemy",
    description: "Learn modern JavaScript from the beginning.",
    tutor: "Brad Traversy",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1755197584/RC%20Web/Modern_JavaScript_from_the_beginning_iegcou.jpg",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755197584/RC%20Web/Modern_JavaScript_from_the_beginning_iegcou.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1755197584/RC%20Web/Modern_JavaScript_from_the_beginning_iegcou.avif",
  },
  {
    name: "HTML and CSS from the Beginning Including SASS",
    platform: "Udemy",
    description: "Learn HTML and CSS from the beginning, including SASS.",
    tutor: "Brad Traversy",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1755197571/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_nadww4.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755197571/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_nadww4.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1755197571/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_nadww4.avif",
  },
  {
    name: "Git + GitHub todo un Sistea de Control de Versiones",
    platform: "Udemy",
    description:
      "Aprende a utilizar Git y GitHub para el control de versiones.",
    tutor: "Fernando Herrera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1755197551/RC%20Web/Git_GitHub_sosdeb.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755197551/RC%20Web/Git_GitHub_sosdeb.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755197551/RC%20Web/Git_GitHub_sosdeb.avif",
  },
  {
    name: "React Basics",
    platform: "Coursera",
    description: "Learn the fundamentals of React.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_React_Basics_oiuwkw.avif",
  },
  {
    name: "Advanced React",
    platform: "Coursera",
    description: "Build on your React knowledge with advanced concepts.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_Advanced_React_gilkkk.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196092/RC%20Web/Coursera_-_Advanced_React_gilkkk.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_Advanced_React_gilkkk.avif",
  },
  {
    name: "Introduction to Front-End Development",
    platform: "Coursera",
    description: "Learn the basics of frontend development.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_Introduction_to_Front-End_Development_mdyuav.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Coursera_-_Introduction_to_Front-End_Development_mdyuav.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_Introduction_to_Front-End_Development_mdyuav.avif",
  },
  {
    name: "Programming with JavaScript",
    platform: "Coursera",
    description: "Learn the fundamentals of JavaScript.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_Programming_with_JavaScript_ioxvot.avif",
  },
  {
    name: "Version Control",
    platform: "Coursera",
    description: "Learn the basics of version control with Git.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_Version_Control_jcakao.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Coursera_Version_Control_jcakao.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_Version_Control_jcakao.avif",
  },
  {
    name: "HTML and CSS in Depth",
    platform: "Coursera",
    description: "Master the fundamentals of HTML and CSS.",
    tutor: "Coursera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/f_auto,w_1200,c_fill,q_auto/v1755196091/RC%20Web/Coursera_-_HTML_and_CSS_in_depth_qwz3ec.webp",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1755196091/RC%20Web/Coursera_-_HTML_and_CSS_in_depth_qwz3ec.ai",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/pg_1,w_200,h_200,c_fill/v1755196091/RC%20Web/Coursera_-_HTML_and_CSS_in_depth_qwz3ec.avif",
  },
];
