import Image from "next/image";
import type { Route } from "next";
import Button from "@/components/ui/Button";
import CustomBadge from "@/components/ui/CustomBadge";
import PhoneLink from "@/components/tracking/PhoneLink";
import { COMPANY } from "@/lib/company";
import heroImage from "../../../public/hero.webp";
import { PhoneIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

/**
 * Server Component: the headline (LCP) and every CTA are in the initial HTML.
 * Entrance motion is CSS only (animate-enter), so nothing waits for JS.
 */
const Hero = () => {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-svh"
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right md:object-center opacity-35"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/30 to-black/70"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 min-h-[calc(100svh-8rem)] flex flex-col justify-center">
        <div className="mx-auto max-w-3xl text-center">
          {/* h1 = LCP: sin opacidad animada, solo transform */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-iceland tracking-tight text-gold animate-hero-title">
            Websites That Win Customers
          </h1>

          <div className="animate-enter [animation-delay:100ms]">
            <CustomBadge>Your Digital Partner</CustomBadge>
          </div>

          <p className="mt-8 mx-auto max-w-xl font-inter text-white/80 text-base sm:text-lg animate-enter [animation-delay:150ms]">
            Fast websites and web apps for small service businesses, with
            booking, payments and local SEO built in. Based in Houston, working
            with clients anywhere.
          </p>

          {/* Señales de calidad concretas */}
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 sm:gap-x-12 text-sm sm:text-base md:text-lg font-inter font-semibold text-gold animate-enter [animation-delay:200ms]">
            {["Loads in Under 2 Seconds", "Local SEO Built In", "English & Español"].map(
              (signal) => (
                <li
                  key={signal}
                  className="transition-[color,transform] duration-200 hover:scale-110 hover:text-gold-light"
                >
                  {signal}
                </li>
              )
            )}
          </ul>

          {/* One primary action (free call), one secondary (services); the
              phone line below is the only other way in, not a third CTA */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center animate-enter [animation-delay:250ms]">
            <Button href={"/schedule" as Route} size="lg">
              <CalendarDaysIcon className="w-5 h-5" />
              Schedule a Free Call
            </Button>
            <Button href={"#services" as Route} variant="secondary" size="lg">
              View Services
            </Button>
          </div>

          <p className="mt-8 text-center font-inter text-sm sm:text-base text-white/70 animate-enter [animation-delay:350ms]">
            Or call directly:{" "}
            <PhoneLink
              href={COMPANY.phoneHref}
              className="inline-flex items-center gap-2 font-semibold text-gold hover:text-gold/80 transition-[color,transform] duration-200 hover:scale-105"
            >
              <PhoneIcon className="w-5 h-5" />
              {COMPANY.phone}
            </PhoneLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
