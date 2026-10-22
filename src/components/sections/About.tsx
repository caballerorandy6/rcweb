import { siteConfig } from "@/config/site";

import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Script from "next/script";

const About = () => {
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
              "Full-stack developer with 6+ years building React and Next.js applications. Founder of RC Web Solutions LLC, based in Houston, TX, with 20+ production sites shipped for small businesses across the US.",
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

      <section id="about" className="pt-24 sm:pt-32 pb-16 sm:pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Heading
          as="h1"
            icon={<UserPlusIcon className="w-8 text-gold" />}
            text="The Developer Behind RC Web Solutions"
          >
            Meet the Founder
          </Heading>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-base font-inter max-w-xl mx-auto lg:mx-0 lg:max-w-none w-full">
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed pb-10 text-justify lg:text-left reveal">
                Full-stack developer with{" "}
                <strong className="text-gold font-semibold">
                  6+ years of experience
                </strong>{" "}
                building React and Next.js applications. Through RC Web
                Solutions I have built and shipped{" "}
                <strong className="text-gold font-semibold">
                  20+ production sites
                </strong>{" "}
                for small businesses, most of them in the Houston area, from
                the frontend and APIs to the database and deployment. I work
                remotely with clients anywhere: video calls, a staging
                site you can check at any time, and Stripe payments. Before founding the agency I worked as a
                software developer at Atser Systems Inc. and Revature, contributing
                to{" "}
                <strong className="text-gold font-semibold">
                  full-stack application development
                </strong>{" "}
                in Agile teams.
              </p>

              <p className="text-sm sm:text-base text-gray-100 leading-relaxed text-justify lg:text-left reveal">
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
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end reveal">
              <figure className="relative">
                <Image
                  src="/randy-caballero-web-developer.avif"
                  alt="Randy Caballero - Full-Stack Web Developer in Houston, TX"
                  width={500}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="image-gradient rounded-2xl shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia w-full max-w-md lg:max-w-full animateProjectCard"
                  priority
                />

                {/* Badge de ubicación */}
                <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-xs px-4 py-2 rounded-lg border border-gold/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gold" />
                    <span className="text-white text-sm font-inter font-medium">
                      Houston, TX
                    </span>
                  </div>
                </div>
              </figure>

              {/* Texto de ubicación debajo de la foto */}
              <div className="text-center lg:text-right mt-6 space-y-1">
                <p className="text-gold font-inter text-sm font-semibold">
                  Based in Houston, TX
                </p>
                <p className="text-gray-400 font-inter text-xs">
                  Working with clients anywhere
                </p>
              </div>

              {/* Download CV Button */}
              <Button
                href="/resume.pdf"
                download="Randy Caballero - Resume.pdf"
                external
                variant="secondary"
                className="mt-6"
              >
                Download CV
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
