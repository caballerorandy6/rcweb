import Image from "next/image";
import Link from "next/link";
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
          {/* Eyebrow: marca como contexto, no como titular */}
          <p className="mx-auto text-center text-sm sm:text-base font-inter font-semibold tracking-[0.25em] uppercase text-gold/80">
            RC Web Solutions · Houston, TX
          </p>

          {/* h1 = LCP: sin opacidad animada, solo transform */}
          <h1 className="mt-4 text-5xl sm:text-7xl lg:text-8xl font-iceland tracking-tight text-gold animate-hero-title">
            Websites That Win Customers
          </h1>

          <div className="animate-enter [animation-delay:100ms]">
            <CustomBadge>Your Digital Partner</CustomBadge>
          </div>

          <p className="mt-8 mx-auto font-inter text-white/80 text-base sm:text-lg animate-enter [animation-delay:150ms]">
            High-performance websites and web apps for small businesses — built
            to load fast, rank on Google, and turn visitors into clients.
          </p>

          {/* Señales de calidad concretas */}
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 sm:gap-x-12 text-sm sm:text-base md:text-lg font-inter font-semibold text-gold animate-enter [animation-delay:200ms]">
            {["Sub-second Load Times", "95+ Lighthouse Scores", "English & Español"].map(
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

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center animate-enter [animation-delay:250ms]">
            <Button href={"#services" as Route} size="lg">
              View Services
            </Button>
            <Button href={"/schedule" as Route} variant="secondary" size="md">
              Schedule a Call
            </Button>
          </div>

          {/* Quick Contact Options */}
          <div className="mt-8 text-center mx-auto flex flex-col items-center animate-enter [animation-delay:350ms]">
            <p className="text-white/70 font-inter text-sm mb-3 text-center">
              Ready to start? Choose your preferred way:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <PhoneLink
                href={COMPANY.phoneHref}
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-[color,transform] duration-200 hover:scale-105 font-inter text-sm sm:text-base font-semibold"
              >
                <PhoneIcon className="w-5 h-5" />
                {COMPANY.phone}
              </PhoneLink>
              <span className="text-white/40 hidden sm:inline" aria-hidden="true">|</span>
              <Link
                href={"/schedule" as Route}
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors duration-200 font-inter text-sm sm:text-base font-semibold"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                Book on Calendly
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
