"use client";

import { siteConfig } from "@/config/site";

import Image from "next/image";
import Heading from "@/components/ui/Heading";
import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion, Variants } from "framer-motion";
import Script from "next/script";

const About = () => {
  const ref = useSectionObserver({ sectionName: "About" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const paragraphVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 200, damping: 20 },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: -30 },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { type: "spring", stiffness: 150, damping: 20, delay: 0.3 },
    },
  };

  return (
    <>
      {/* Schema Markup para SEO */}
      <Script
        id="about-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Randy Caballero",
            jobTitle: "Full-Stack Web Developer",
            description:
              "Full-stack developer with 6+ years building React and Next.js applications. Founder of RC Web Solutions LLC in Houston, TX, with 20+ production sites shipped.",
            image: `${siteConfig.baseUrl}/randy-caballero-web-developer.avif`,
            url: `${siteConfig.baseUrl}/about`,
            sameAs: [
              "https://www.linkedin.com/in/caballerorandy",
              "https://github.com/caballerorandy6",
            ],
            alumniOf: [
              { "@type": "CollegeOrUniversity", name: "Nova Southeastern University" },
              { "@type": "CollegeOrUniversity", name: "Universidad de Camagüey" },
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Houston",
              addressRegion: "TX",
              addressCountry: "US",
            },
            worksFor: {
              "@type": "Organization",
              name: "RC Web Solutions LLC",
            },
            knowsAbout: [
              "React",
              "Next.js",
              "TypeScript",
              "Node.js",
              "PostgreSQL",
              "Prisma",
              "Full-Stack Development",
              "Google Ads",
              "Meta Ads",
              "Local SEO",
            ],
          }),
        }}
      />

      <section ref={ref} id="about" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Heading
          as="h1"
            icon={<UserPlusIcon className="w-8 text-gold" />}
            text="The Developer Behind RC Web Solutions"
          >
            Meet the Founder
          </Heading>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              className="text-base font-inter max-w-xl mx-auto lg:mx-0 lg:max-w-none w-full"
              variants={containerVariants}
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              style={{ opacity: 1 }}
            >
              <motion.p
                className="text-sm sm:text-base text-gray-100 leading-relaxed pb-10 text-justify lg:text-left"
                variants={paragraphVariants}
              >
                Full-stack developer with{" "}
                <strong className="text-gold font-semibold">
                  6+ years of experience
                </strong>{" "}
                building React and Next.js applications. Through RC Web
                Solutions I have built and shipped{" "}
                <strong className="text-gold font-semibold">
                  20+ production sites
                </strong>{" "}
                for Houston businesses, from the frontend and APIs to the
                database and deployment. Before founding the agency I worked as a
                software developer at Atser Systems Inc. and Revature, contributing
                to{" "}
                <strong className="text-gold font-semibold">
                  full-stack application development
                </strong>{" "}
                in Agile teams.
              </motion.p>

              <motion.p
                className="text-sm sm:text-base text-gray-100 leading-relaxed text-justify lg:text-left"
                variants={paragraphVariants}
              >
                I work across the full stack with{" "}
                <span className="text-gold font-medium">
                  Next.js, TypeScript, Node.js, PostgreSQL, and Prisma
                </span>
                , and I also own the layer that brings customers in:{" "}
                <span className="text-gold font-medium">
                  Google Ads, Meta Ads, conversion tracking, and local SEO
                </span>
                . On one client site I cut load time from 7–8 seconds to under 1
                second, which restored the performance of their paid campaigns.
              </motion.p>
            </motion.div>

            <motion.div
              initial={false}
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={imageVariants}
              style={{ opacity: 1 }}
              className="flex flex-col items-center lg:items-end"
            >
              <motion.figure className="relative">
                <Image
                  src="/randy-caballero-web-developer.avif"
                  alt="Randy Caballero - Full-Stack Web Developer in Houston, TX"
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="image-gradient rounded-lg shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia w-full max-w-md lg:max-w-full animateProjectCard"
                  priority
                />

                {/* Badge de ubicación */}
                <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gold/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gold" />
                    <span className="text-white text-sm font-inter font-medium">
                      Houston, TX
                    </span>
                  </div>
                </div>
              </motion.figure>

              {/* Texto de ubicación debajo de la foto */}
              <div className="text-center lg:text-right mt-6 space-y-1">
                <p className="text-gold font-inter text-sm font-semibold">
                  Based in Houston, TX
                </p>
                <p className="text-gray-400 font-inter text-xs">
                  Serving clients nationwide
                </p>
              </div>

              {/* Download CV Button */}
              <motion.a
                href="/resume.pdf"
                download="Randy Caballero - Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200"
              >
                Download CV
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
