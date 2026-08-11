"use client";

import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import Button from "@/components/ui/Button";
import CustomBadge from "@/components/ui/CustomBadge";
import useSectionObserver from "@/hooks/useSectionObserver";
import heroImage from "../../../public/hero.webp";
import { motion } from "framer-motion";
import { PhoneIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";

// Phone Conversion Tracking (Google Ads + Facebook + LinkedIn)
const trackPhoneConversion = () => {
  // Google Ads conversion
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17661176254/wW9-CKCVjLAbEL7TwOVB",
      value: 1.0,
      currency: "USD",
    });
  }

  // Facebook Pixel conversion
  trackFBPhoneCall();

  // LinkedIn conversion
  trackLinkedInConversion();
};

const Hero = () => {
  const ref = useSectionObserver({ sectionName: "Home" });

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-[100svh]"
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 min-h-[calc(100svh-8rem)] flex flex-col justify-center">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow: marca como contexto, no como titular */}
          <p className="mx-auto text-center text-sm sm:text-base font-inter font-semibold tracking-[0.25em] uppercase text-gold/80">
            RC Web Solutions · Houston, TX
          </p>

          {/* h1 fuera de motion.div para no bloquear LCP */}
          <h1 className="mt-4 text-5xl sm:text-7xl lg:text-8xl font-iceland tracking-tight text-gold animate-hero-title">
            Websites That Win Customers
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
          >
            <CustomBadge>Your Digital Partner</CustomBadge>
          </motion.div>

          <motion.p
            className="mt-8 mx-auto font-inter text-white/80 text-base sm:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
              delay: 0.1,
            }}
          >
            High-performance websites and web apps for small businesses — built
            to load fast, rank on Google, and turn visitors into clients.
          </motion.p>

          {/* Señales de calidad concretas */}
          <motion.div
            className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 sm:gap-x-12 text-sm sm:text-base md:text-lg font-inter font-semibold text-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.1,
            }}
          >
            <motion.span
              whileHover={{ scale: 1.1, color: "#D9C98A" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Sub-second Load Times
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1, color: "#D9C98A" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              95+ Lighthouse Scores
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1, color: "#D9C98A" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              English &amp; Español
            </motion.span>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.25,
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button href={"#services" as Route} size="lg">
                View Services
              </Button>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Button href={"/schedule" as Route} variant="secondary" size="md">
                Schedule a Call
              </Button>
            </motion.div>
          </motion.div>

          {/* Quick Contact Options */}
          <motion.div
            className="mt-8 text-center mx-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.35,
            }}
          >
            <p className="text-white/70 font-inter text-sm mb-3 text-center">
              Ready to start? Choose your preferred way:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <motion.a
                href="tel:+13463757534"
                onClick={trackPhoneConversion}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors duration-200 font-inter text-sm sm:text-base font-semibold"
              >
                <PhoneIcon className="w-5 h-5" />
                +1 (346) 375-7534
              </motion.a>
              <span className="text-white/40 hidden sm:inline" aria-hidden="true">|</span>
              <Link
                href={"/schedule" as Route}
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors duration-200 font-inter text-sm sm:text-base font-semibold"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                Book on Calendly
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
