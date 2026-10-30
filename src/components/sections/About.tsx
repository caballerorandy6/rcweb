import { siteConfig } from "@/config/site";

import Image from "next/image";
import Heading from "@/components/ui/Heading";
import Button from "@/components/ui/Button";
import { UserPlusIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Script from "next/script";
import { getLocale, getTranslations } from "next-intl/server";
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";

const About = async () => {
  const [t, locale] = await Promise.all([getTranslations("About"), getLocale()]);
  const gold = (chunks: React.ReactNode) => (
    <strong className="text-gold font-semibold">{chunks}</strong>
  );
  const goldText = (chunks: React.ReactNode) => (
    <span className="text-gold font-medium">{chunks}</span>
  );

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
            jobTitle: t("person.jobTitle"),
            description: t("person.description"),
            image: `${siteConfig.baseUrl}/randy-caballero-web-developer.avif`,
            url: `${siteConfig.baseUrl}${localizePathname("/about", locale as Locale)}`,
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
            text={t("subheading")}
          >
            {t("heading")}
          </Heading>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-base font-inter max-w-xl mx-auto lg:mx-0 lg:max-w-none w-full">
              <p className="text-sm sm:text-base text-gray-100 leading-relaxed pb-10 text-justify lg:text-left reveal">
                {t.rich("bio1", { strong: gold })}
              </p>

              <p className="text-sm sm:text-base text-gray-100 leading-relaxed text-justify lg:text-left reveal">
                {t.rich("bio2", { gold: goldText })}
              </p>
            </div>

            <div className="flex flex-col items-center lg:items-end reveal">
              <figure className="relative">
                <Image
                  src="/randy-caballero-web-developer.avif"
                  alt={t("imageAlt")}
                  width={510}
                  height={340}
                  sizes="(max-width: 768px) 100vw, 510px"
                  className="image-gradient rounded-2xl shadow-lg shadow-gray-900/50 hover:scale-105 transition-transform duration-300 ease-in-out border-2 border-gold/50 sepia w-full h-auto max-w-md lg:max-w-full animateProjectCard"
                  priority
                />

                {/* Badge de ubicación */}
                <div className="absolute bottom-4 left-4 bg-gray-900/90 backdrop-blur-xs px-4 py-2 rounded-lg border border-gold/30 shadow-lg">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-gold" />
                    <span className="text-white text-sm font-inter font-medium">
                      {t("location")}
                    </span>
                  </div>
                </div>
              </figure>

              {/* Texto de ubicación debajo de la foto */}
              <div className="text-center lg:text-right mt-6 space-y-1">
                <p className="text-gold font-inter text-sm font-semibold">{t("basedIn")}</p>
                <p className="text-gray-400 font-inter text-xs">{t("anywhere")}</p>
              </div>

              {/* Download CV Button */}
              <Button
                href="/resume.pdf"
                download="Randy Caballero - Resume.pdf"
                external
                variant="secondary"
                className="mt-6"
              >
                {t("downloadCv")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
