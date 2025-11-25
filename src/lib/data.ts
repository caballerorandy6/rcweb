import { ProjectProps } from "@/app/components/Sections/Project";
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
//import Wordpress from "@/app/components/icons/Wordpress";
import NodeJS from "@/app/components/icons/NodeJS";
import { TeachMarqueeProps } from "@/app/components/ui/TechMarquee";
import { BriefcaseIcon, AcademicCapIcon } from "@heroicons/react/24/outline";
import { NavigationProps } from "@/app/components/layout/Navbar";
import { ExperienceProps } from "@/app/components/Sections/Experience";
import {
  ChatBubbleLeftRightIcon,
  PencilSquareIcon,
  CodeBracketSquareIcon,
  RocketLaunchIcon,
  CodeBracketIcon,
  ChartBarIcon,
  CubeTransparentIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ScaleIcon,
  MapPinIcon,
  ClockIcon,
  DocumentCheckIcon,
  XCircleIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

export const navigation: NavigationProps[] = [
  { name: "Home", hash: "/#home" },
  { name: "Services", hash: "/#services" }, // Lo más importante primero
  { name: "Projects", hash: "/#projects" }, // Muestras tu trabajo
  { name: "Testimonials", hash: "/#testimonials" }, // Respaldas con pruebas sociales
  { name: "Blog", hash: "/blog" }, // Ruta completa para página separada
  { name: "Process", hash: "/#process" }, // Explicas cómo trabajas
  { name: "Pricing", hash: "/#pricing" }, // El cliente ya confía, ahora ve el costo
  { name: "FAQ", hash: "/#faq" }, // Resuelves dudas comunes
  { name: "Experience", hash: "/#experience" }, // Refuerzas credibilidad
  { name: "Certifications", hash: "/#certifications" },
  { name: "About", hash: "/#about" }, // Quién eres (menos prioridad que lo anterior)
  { name: "Contact", hash: "/#contact" }, // Punto de conversión
  { name: "CTA", hash: "/#cta" }, // Botón extra destacado
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
    name: "Todo List App",
    tecnologies: [
      "NextJS",
      "TypeScript",
      "TailwindCSS",
      "NodeJS",
      "Express",
      "MySQL",
      "Prisma",
      "Zod",
    ],
    description:
      "A simple Todo List application built with Next.js, TypeScript, TailwindCSS, Node, Express, MySQL, Prisma, and Zod.",
    image: "/todo-list-app.avif",
    github: "https://github.com/caballerorandy6/todo-app-frontend",
    url: "https://todo-app-frontend-flame-nu.vercel.app/",
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
    href: "https://nodejs.org/",
    name: "Node.js",
    icon: React.createElement(NodeJS),
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
  // {
  //   href: "https://wordpress.org/",
  //   name: "WordPress",
  //   icon: React.createElement(Wordpress),
  // },
];

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
      "https://res.cloudinary.com/caballerorandy/image/upload/v1761020506/RC%20Web/Modern_JavaScript_from_the_beginning_s1lmqm.jpg",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1761020506/RC%20Web/Modern_JavaScript_from_the_beginning_s1lmqm.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/c_thumb,w_200,g_face/v1761020506/RC%20Web/Modern_JavaScript_from_the_beginning_s1lmqm.jpg",
  },
  {
    name: "HTML and CSS from the Beginning Including SASS",
    platform: "Udemy",
    description: "Learn HTML and CSS from the beginning, including SASS.",
    tutor: "Brad Traversy",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1761020530/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_ijoey5.jpg",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1761020530/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_ijoey5.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/c_thumb,w_200,g_face/v1761020530/RC%20Web/HTML_and_CSS_From_The_Beginning_Including_Sass_ijoey5.jpg",
  },
  {
    name: "Git + GitHub todo un Sistea de Control de Versiones",
    platform: "Udemy",
    description:
      "Aprende a utilizar Git y GitHub para el control de versiones.",
    tutor: "Fernando Herrera",
    image:
      "https://res.cloudinary.com/caballerorandy/image/upload/v1761020549/RC%20Web/Git_GitHub_gj28lk.jpg",
    url: "https://res.cloudinary.com/caballerorandy/image/upload/v1761020549/RC%20Web/Git_GitHub_gj28lk.jpg",
    pdfThumbnail:
      "https://res.cloudinary.com/caballerorandy/image/upload/c_thumb,w_200,g_face/v1761020549/RC%20Web/Git_GitHub_gj28lk.jpg",
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

export const processSteps = [
  {
    icon: ChatBubbleLeftRightIcon,
    title: "Discovery",
    week: "Week 1",
    description:
      "Free initial consultation to understand your needs and objectives.",
    details: [
      "Requirements analysis",
      "Competition research",
      "Detailed proposal",
      "Transparent quote",
    ],
  },
  {
    icon: PencilSquareIcon,
    title: "Design & Planning",
    week: "Weeks 1-2",
    description: "Create wireframes and define your application architecture.",
    details: [
      "Interactive mockups",
      "Tech stack selection",
      "Project timeline",
      "Review & feedback",
    ],
  },
  {
    icon: CodeBracketSquareIcon,
    title: "Iterative Development",
    week: "Weeks 2-5",
    description:
      "Build your application with weekly demos and continuous adjustments.",
    details: [
      "Weekly sprints",
      "Friday demos",
      "Continuous testing",
      "Real-time adjustments",
    ],
  },
  {
    icon: RocketLaunchIcon,
    title: "Launch & Support",
    week: "Week 6",
    description:
      "Production deployment with training and 30 days of included support.",
    details: [
      "Secure deployment",
      "Complete training",
      "Documentation",
      "30-day support",
    ],
  },
];

export const services = [
  {
    icon: RocketLaunchIcon,
    title: "Full-Stack Web Applications",
    description:
      "Complete applications built with Next.js 14, TypeScript, and scalable databases.",
    features: ["SPA/SSR", "Admin Panel", "RESTful APIs", "Authentication"],
    highlight: "Like GSM AC, Limo Renting & Little Lemon Restaurant",
  },
  {
    icon: CodeBracketIcon,
    title: "High-Converting Landing Pages",
    description:
      "Optimized websites designed to convert visitors into customers with modern design.",
    features: ["Responsive", "SEO", "Analytics", "Animations"],
    highlight: "95+ Lighthouse Score",
  },
  {
    icon: CubeTransparentIcon,
    title: "Management Systems",
    description:
      "Custom dashboards to automate and manage your business efficiently.",
    features: ["Dashboard", "Reports", "Bulk Email", "User Management"],
    highlight: "15 hours/week saved",
  },
  {
    icon: ChartBarIcon,
    title: "Digital Consulting",
    description:
      "Web strategy and optimization with 3+ years of digital marketing experience.",
    features: ["Web Audit", "SEO", "Performance"],
    highlight: "60% more organic traffic",
  },
];

export const faqs = [
  {
    question: "Do you work with clients outside USA?",
    answer:
      "I work with clients worldwide. My projects are fully remote, and I use tools like Zoom and Slack to communicate and collaborate effectively. Payments are easy and secure through Stripe, so you can work with me from anywhere.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on the scope: Landing pages: 1-2 weeks, Professional websites: 3-4 weeks, Advanced websites: 5-6 weeks, E-commerce: 6-10 weeks, Web applications: 8-12+ weeks. I always provide realistic timelines and meet them.",
  },
  {
    question: "Do you offer post-launch support?",
    answer:
      "Yes! Support duration varies by project type: Landing pages include 30 days, Professional/Advanced websites include 30-60 days, E-commerce includes 90 days, and Web applications include 6 months. After that, maintenance plans start at $150/month including updates, backups, and priority support.",
  },
  {
    question: "Do you work with technologies besides Next.js?",
    answer:
      "My specialty is the React/Next.js ecosystem with TypeScript, Node.js, and PostgreSQL - enterprise technology at small business pricing. I also have experience with vanilla JavaScript, and can adapt to project needs. I always recommend the best technology for each case.",
  },
  {
    question: "How does the payment process work?",
    answer:
      "I use a two-payment structure — 50% upfront to kick off your project and 50% once it's completed and delivered. Payment plans are available for projects over $3,000. You can pay conveniently via Zelle or through Stripe on my website.",
  },
  {
    question: "Can I see progress during development?",
    answer:
      "Absolutely! I provide weekly progress updates and you'll have access to a staging environment where you can see real-time progress. I respond within 24 hours (usually much faster) to any questions or concerns. Transparency is key to my process.",
  },
];

// export const pricingPlans = [
//   {
//     name: "Starter",
//     price: "$1,499",
//     range: "$1,499 - $2,999",
//     duration: "2-3 weeks",
//     description: "Perfect for small businesses starting their digital journey",
//     features: [
//       "5-7 page responsive website",
//       "Mobile-optimized design",
//       "Basic SEO setup",
//       "Contact form integration",
//       "Social media links",
//       "Google Analytics setup",
//       "1 month free support",
//     ],
//     ideal: "Ideal for: Local businesses, freelancers, personal brands",
//     featured: false,
//     cta: "Start Your Project",
//   },
//   {
//     name: "Growth",
//     price: "$3,499",
//     range: "$3,499 - $5,999",
//     duration: "3-5 weeks",
//     description: "Scale your business with advanced features and functionality",
//     features: [
//       "10-15 page dynamic website",
//       "Custom animations & interactions",
//       "Advanced SEO optimization",
//       "CMS integration (blog/news)",
//       "Email marketing integration",
//       "Lead capture & automation",
//       "Google My Business setup",
//       "3 months free support",
//     ],
//     ideal: "Ideal for: Growing startups, service businesses, B2B companies",
//     featured: true,
//     cta: "Most Popular Choice",
//   },
//   {
//     name: "Premium",
//     price: "$7,999",
//     range: "$7,999 - $14,999",
//     duration: "6-8 weeks",
//     description: "Complete digital solution for established businesses",
//     features: [
//       "20+ page custom website",
//       "E-commerce functionality",
//       "Custom web application features",
//       "API integrations",
//       "Advanced analytics dashboard",
//       "Multi-language support",
//       "A/B testing setup",
//       "6 months premium support",
//       "Monthly performance reports",
//     ],
//     ideal: "Ideal for: Established SMBs, E-commerce, Multi-location businesses",
//     featured: false,
//     cta: "Transform Your Business",
//   },
// ];

export const additionalServices = [
  {
    service: "Monthly Maintenance",
    price: "$150-$500/month",
    description: "Security updates, content changes, performance monitoring, priority support",
  },
  {
    service: "Content Creation",
    price: "$500-$2,000",
    description: "Professional copywriting and content strategy",
  },
  {
    service: "Email Marketing Setup",
    price: "$999",
    description: "Complete email automation and campaign setup",
  },
  {
    service: "Social Media Integration",
    price: "$799",
    description: "Full social media feed integration and automation",
  },
];

export const paymentTerms = {
  upfront: "30%",
  milestone: "40%",
  delivery: "30%",
  description: "Flexible payment terms to ease cash flow for small businesses",
};

export const pricingPlans = [
  {
    id: "landing-page",
    name: "Landing Pages",
    price: "$800",
    priceInCents: 80000, // $800.00
    range: "$800 - $1,500",
    duration: "1-2 weeks",
    description: "Single page focused on conversions",
    features: [
      "Lead generation",
      "Service showcase",
      "Event promotion",
      "Quick online presence",
      "Mobile-optimized design",
      "Contact form integration",
      "Basic SEO setup",
    ],
    ideal: "Perfect for: New businesses, product launches, event promotion",
    featured: false,
    cta: "Start Your Project",
  },
  {
    id: "professional-website",
    name: "Professional Websites",
    price: "$2,500",
    priceInCents: 250000, // $2,500.00
    range: "$2,500 - $5,000",
    duration: "3-4 weeks",
    description: "5-10 pages with custom design",
    features: [
      "Small businesses",
      "Professional services",
      "Portfolios",
      "Company websites",
      "Responsive design",
      "SEO optimization",
      "Analytics integration",
      "30-day support",
    ],
    ideal: "Perfect for: Established businesses, professional services, portfolios",
    featured: true,
    cta: "Most Popular Choice",
  },
  {
    id: "advanced-website",
    name: "Advanced Websites",
    price: "$5,000",
    priceInCents: 500000, // $5,000.00
    range: "$5,000 - $8,000",
    duration: "5-6 weeks",
    description: "Complex functionality and integrations",
    features: [
      "Custom features",
      "Database integration",
      "User authentication",
      "API integrations",
      "Advanced SEO",
      "Content management",
      "Email automation",
      "60-day support",
    ],
    ideal: "Perfect for: Growing businesses, custom requirements, advanced features",
    featured: false,
    cta: "Build Advanced Features",
  },
  {
    id: "ecommerce",
    name: "Custom E-commerce",
    price: "$6,000",
    priceInCents: 600000, // $6,000.00
    range: "$6,000 - $15,000",
    duration: "6-10 weeks",
    description: "Full online store with payment processing",
    features: [
      "Product sales",
      "Inventory management",
      "Order processing",
      "Customer accounts",
      "Payment gateway integration",
      "Shopping cart",
      "Admin dashboard",
      "90-day support",
    ],
    ideal: "Perfect for: Retail businesses, online stores, product-based companies",
    featured: false,
    cta: "Launch Your Store",
  },
  {
    id: "web-application",
    name: "Web Applications",
    price: "$8,000",
    priceInCents: 800000, // $8,000.00
    range: "Starting at $8,000",
    duration: "8-12+ weeks",
    description: "Custom platforms and systems",
    features: [
      "SaaS products",
      "Custom tools",
      "Member portals",
      "Complex systems",
      "Database architecture",
      "API development",
      "Third-party integrations",
      "6-month priority support",
    ],
    ideal: "Perfect for: Startups, enterprise solutions, custom applications",
    featured: false,
    cta: "Build Your Platform",
  },
];

export const deliverables = {
  "Landing Pages": [
    "Complete source code repository",
    "Deployment on your hosting",
    "Basic documentation",
    "30 days of post-launch support",
    "Training session (1 hour)",
  ],
  "Professional Websites": [
    "Complete source code repository",
    "Deployment and configuration",
    "Comprehensive documentation",
    "30 days of post-launch support",
    "Training sessions (2 hours)",
    "Basic SEO setup",
    "Analytics integration",
  ],
  "Advanced Websites": [
    "Complete source code repository",
    "Multi-environment deployment",
    "Technical documentation",
    "60 days of priority support",
    "Training sessions (3 hours)",
    "Advanced SEO optimization",
    "Analytics and monitoring setup",
    "Performance optimization",
  ],
  "Custom E-commerce": [
    "Complete source code repository",
    "Multi-environment deployment",
    "Full technical documentation",
    "90 days of priority support",
    "Training sessions (4 hours)",
    "Advanced SEO optimization",
    "Analytics and monitoring setup",
    "Performance optimization",
    "Security hardening",
    "Payment gateway integration",
  ],
  "Web Applications": [
    "Complete source code repository",
    "Multi-environment deployment",
    "Comprehensive technical documentation",
    "6 months of priority support",
    "Training sessions (5 hours)",
    "Advanced SEO optimization",
    "Analytics and monitoring setup",
    "Performance optimization",
    "Security hardening",
    "API documentation",
    "Ongoing consulting (first 30 days)",
  ],
};

export const testimonials = [
  {
    content:
      "Randy transformed our business idea into a functional platform. The real-time booking system he developed increased our conversions by 40%. Professional and always available.",
    author: "Michael Rodriguez",
    role: "CEO, Limo Renting Houston",
    image: "/testimonials/client1.jpg",
    rating: 5,
    project: "Booking Platform",
  },
  {
    content:
      "The admin dashboard Randy created saved us 15 hours per week in management. The bulk email feature was exactly what we needed. Excellent work.",
    author: "Sarah Johnson",
    role: "Manager, GSM AC Services",
    image: "/testimonials/client2.jpg",
    rating: 5,
    project: "Management System",
  },
  {
    content:
      "Working with Randy was excellent. He not only developed our site but also advised us on digital strategy. Our organic traffic grew 60% in 3 months.",
    author: "Carlos Mendez",
    role: "Professional Photographer",
    image: "/testimonials/client3.jpg",
    rating: 5,
    project: "Portfolio + Marketing",
  },
];

export const extraFooterLinks = [
  { name: "Privacy Policy", hash: "/privacy-policy" },
  { name: "Terms of Service", hash: "/terms-of-service" },
  { name: "Refund Policy", hash: "/refund-policy" },
  { name: "Free Guide", hash: "/guide" },
];

export const sections = [
  {
    icon: React.createElement(BriefcaseIcon, { className: "w-6 h-6" }),
    title: "Our Services",
    content:
      "RC Web Solutions LLC specializes in Full-Stack Web Applications (Next.js 14+, TypeScript, React, PostgreSQL), High-Converting Landing Pages, Custom Management Systems (dashboards, analytics, user management), API Development (RESTful, authentication, third-party integrations), and Digital Consulting (web audits, SEO optimization, performance enhancement). All services include responsive design, security best practices, and scalable architecture.",
    color: "from-purple-500/20 to-purple-600/20",
  },
  {
    icon: React.createElement(DevicePhoneMobileIcon, { className: "w-6 h-6" }),
    title: "SMS/Text Message Marketing",
    content:
      "RC Web Solutions LLC may send promotional SMS messages to phone numbers provided by users who have explicitly opted in to receive such communications. By providing your phone number and checking the marketing consent box, you consent to receive text messages about our services, promotions, and updates. SMS consent is completely optional and not required to use our services or make a purchase. Message and data rates may apply. You can opt-out at any time by replying STOP to any message. We use Twilio as our SMS service provider. Phone numbers are stored securely and are never shared with third parties for marketing purposes. We retain phone numbers as long as you maintain consent; upon opt-out, your number is immediately removed from marketing lists.",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: React.createElement(CurrencyDollarIcon, { className: "w-6 h-6" }),
    title: "Payment Terms",
    content:
      "A 50% non-refundable deposit is required to initiate any project. This deposit secures your project timeline and covers initial development costs. The remaining 50% balance is due upon project completion and before final delivery of all assets. We accept payments via Stripe (credit/debit cards) and Zelle. Refunds are only provided in cases of non-delivery or documented breach of contract by RC Web Solutions LLC. Late payments may result in project delays and additional fees.",
    color: "from-green-500/20 to-green-600/20",
  },
  {
    icon: React.createElement(ShieldCheckIcon, { className: "w-6 h-6" }),
    title: "Intellectual Property Rights",
    content:
      "Upon receipt of full payment, all deliverables including source code, designs, graphics, and digital assets become the exclusive property of the client, unless otherwise specified in a separate written agreement. RC Web Solutions LLC retains the right to showcase completed projects in our portfolio and marketing materials unless confidentiality is explicitly requested. Pre-existing tools, libraries, and frameworks remain property of their respective owners and are licensed accordingly.",
    color: "from-blue-500/20 to-blue-600/20",
  },
  {
    icon: React.createElement(ScaleIcon, { className: "w-6 h-6" }),
    title: "Warranties & Liability",
    content:
      'All services are provided "as is" without warranties of any kind, express or implied. RC Web Solutions LLC is not liable for indirect, incidental, consequential, or punitive damages arising from the use or inability to use our services. Our maximum liability shall not exceed the total amount paid for the specific service. We provide a 30-day bug-fix warranty for all custom development work. Third-party integrations and hosting services are subject to their respective terms.',
    color: "from-orange-500/20 to-orange-600/20",
  },
  {
    icon: React.createElement(ClockIcon, { className: "w-6 h-6" }),
    title: "Project Timeline & Changes",
    content:
      "Project timelines are estimates and may vary based on complexity, client responsiveness, and scope changes. Delays caused by client-side factors (content delays, feedback, approvals) will extend the timeline accordingly. Scope changes or additional features not included in the original agreement will be quoted separately and may affect the project timeline and cost. We require 48-hour notice for meetings and provide weekly progress updates.",
    color: "from-cyan-500/20 to-cyan-600/20",
  },
  {
    icon: React.createElement(DocumentCheckIcon, { className: "w-6 h-6" }),
    title: "Client Responsibilities",
    content:
      "Clients are responsible for providing accurate project requirements, timely feedback, necessary content (text, images, branding), and access to required accounts (hosting, domain, APIs). Clients must review and approve deliverables within 5 business days. Failure to provide timely feedback may result in project delays. Clients are responsible for maintaining backups and ensuring compliance with applicable laws and regulations for their website content.",
    color: "from-indigo-500/20 to-indigo-600/20",
  },
  {
    icon: React.createElement(XCircleIcon, { className: "w-6 h-6" }),
    title: "Termination & Cancellation",
    content:
      "Either party may terminate the agreement with 14 days written notice. Upon termination by client before completion, the deposit is non-refundable, and client will be invoiced for work completed to date at our hourly rate. RC Web Solutions LLC reserves the right to terminate services immediately for non-payment, violation of terms, or abusive behavior. Upon termination, all work completed will be delivered, but source code access requires full payment.",
    color: "from-red-500/20 to-red-600/20",
  },
  {
    icon: React.createElement(MapPinIcon, { className: "w-6 h-6" }),
    title: "Governing Law & Jurisdiction",
    content:
      "These Terms of Service are governed by and construed in accordance with the laws of the State of Texas, United States of America, without regard to its conflict of law provisions. Any legal action or proceeding arising under these terms shall be brought exclusively in the state or federal courts located in Harris County, Houston, Texas. Both parties consent to the jurisdiction and venue of such courts. If any provision is found unenforceable, the remaining provisions remain in full effect.",
    color: "from-amber-500/20 to-amber-600/20",
  },
];

export const thirdPartyLinks = [
  { name: "Google Analytics", url: "https://policies.google.com/privacy" },
  { name: "Resend", url: "https://resend.com/legal/privacy-policy" },
  { name: "Stripe", url: "https://stripe.com/us/privacy" },
  { name: "Zelle", url: "https://www.zelle.com/legal/legal-and-privacy" },
  { name: "Twilio", url: "https://www.twilio.com/legal/privacy" },
];

export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/rcwebsolutions",
    ariaLabel: "Connect on LinkedIn",
    bgColor: "bg-[#0A66C2]",
    hoverColor: "hover:bg-[#004182]",
    delay: 0.1,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "Phone",
    url: "tel:+13463757534",
    ariaLabel: "Call directly",
    bgColor: "bg-blue-600",
    hoverColor: "hover:bg-blue-700",
    delay: 0.15,
    isButton: true,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "WhatsApp",
    url: "https://wa.me/18325465983?text=Hi%20Randy%2C%20I%20saw%20your%20portfolio%20and%20I%27m%20interested%20in%20discussing%20a%20project",
    ariaLabel: "Contact via WhatsApp",
    bgColor: "bg-[#25D366]",
    hoverColor: "hover:bg-[#128C7E]",
    delay: 0.2,
    isButton: true,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "Tik Tok",
    url: "https://www.tiktok.com/@rcwebsolutionsllc",
    ariaLabel: "Connect on Tik Tok",
    bgColor: "bg-transparent",
    hoverColor: "hover:bg-[#4FC3F7]",
    delay: 0.4,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/rcwebsolutionsllc",
    ariaLabel: "Connect on Facebook",
    bgColor: "bg-[#1877F2]",
    hoverColor: "hover:bg-[#155DBB]",
    delay: 0.25,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/rcwebsolutionsllc",
    ariaLabel: "Connect on Instagram",
    bgColor: "bg-[#E1306C]",
    hoverColor: "hover:bg-[#C13584]",
    delay: 0.3,
    iconSize: "w-6 h-6 lg:w-8 lg:h-8",
  },
  {
    name: "X",
    url: "https://x.com/RCWeb2025",
    ariaLabel: "Connect on X",
    bgColor: "bg-transparent",
    hoverColor: "hover:bg-gray-100",
    delay: 0.35,
    iconSize: "w-4 h-4 lg:w-6 lg:h-6",
  },
];

export const refundSections = [
  {
    title: "Two-Payment Project Structure",
    content:
      "All projects require two payments: First payment (50%) to start the project, and second payment (50%) upon completion. Once the first payment is made, the project begins immediately and work commences.",
    icon: React.createElement(CurrencyDollarIcon, { className: "w-6 h-6" }),
    color: "from-blue-500/10 to-blue-600/10",
  },
  {
    title: "NO Refunds After First Payment",
    content:
      "Once the first payment is processed, the project starts immediately and this payment becomes NON-REFUNDABLE. If you decide not to continue with the project after the first payment, no refund will be issued as we have already invested time and resources.",
    icon: React.createElement(DocumentTextIcon, { className: "w-6 h-6" }),
    color: "from-red-500/10 to-red-600/10",
  },
  {
    title: "Cancellation Before Payment",
    content:
      "You may cancel your order at any time BEFORE making the first payment with no penalty. Once payment is processed, the no-refund policy takes effect immediately.",
    icon: React.createElement(ClockIcon, { className: "w-6 h-6" }),
    color: "from-green-500/10 to-green-600/10",
  },
  {
    title: "Contact for Questions",
    content:
      "If you have any questions or concerns about starting a project, please contact us at support@rcwebsolutionsllc.com BEFORE making your first payment. We're happy to discuss your project and address any concerns.",
    icon: React.createElement(DocumentTextIcon, { className: "w-6 h-6" }),
    color: "from-purple-500/10 to-purple-600/10",
  },
  {
    title: "Non-Refundable Items",
    content:
      "First payment (project initiation), second payment (project completion), custom development work, third-party services purchased on your behalf, domain registrations, and hosting services are all non-refundable.",
    icon: React.createElement(XCircleIcon, { className: "w-6 h-6" }),
    color: "from-amber-500/10 to-amber-600/10",
  },
];
