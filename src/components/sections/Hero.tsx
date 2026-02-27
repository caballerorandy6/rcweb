"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import CustomBadge from "@/components/ui/CustomBadge";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion } from "framer-motion";
import { PhoneIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";

// Phone Conversion Tracking (Google Ads + Facebook)
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
};

const Hero = () => {
  const ref = useSectionObserver({ sectionName: "Home" });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.5;
    }
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate overflow-hidden pt-24 sm:pt-32 pb-16 sm:pb-24 h-screen"
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster="/background.avif"
          aria-hidden="true"
          className="inset-0 -z-10 size-full object-cover object-right md:object-center opacity-35"
        >
          <source src="/hero.webm" type="video/webm" />
          <track kind="captions" label="No audio" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex flex-col justify-center">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          <h1 className="text-5xl font-iceland tracking-tight sm:text-9xl text-gold animate-hero-title">
            RC Web Solutions
          </h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
          >
            <CustomBadge>Your Digital Partner</CustomBadge>
          </motion.div>

          <motion.p
            className="mt-8 font-inter text-white/80 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
              delay: 0.3,
            }}
          >
            We build high-performance websites and web applications that help
            businesses grow online.
          </motion.p>

          {/* Social Proof con animación */}
          <motion.div
            className="mt-6 flex justify-center gap-8 sm:gap-12 text-sm sm:text-base md:text-lg font-inter font-semibold text-gold/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.4,
            }}
          >
            <motion.span
              whileHover={{ scale: 1.1, color: "#fbbf24" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              10+ Projects
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1, color: "#fbbf24" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              5+ Happy Clients
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1, color: "#fbbf24" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              100% Remote
            </motion.span>
          </motion.div>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.5,
            }}
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.55,
              }}
            >
              <Link
                href={"#services" as Route}
                className="relative inline-flex items-center justify-center px-6 py-4 text-base sm:text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <span className="relative flex items-center justify-center">
                  View Services
                </span>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 17 },
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: 0.6,
              }}
            >
              <Link
                href={"/schedule" as Route}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm sm:text-base font-inter font-semibold text-gold border-2 border-gold/50 hover:bg-gold/10 hover:border-gold/60 rounded-lg transition-all duration-200"
              >
                Schedule a Call
              </Link>
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
              delay: 0.7,
            }}
          >
            <p className="text-white/60 font-inter text-sm mb-3 text-center">
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
              <span className="text-white/50 hidden sm:inline">|</span>
              <Link
                href={"/schedule" as Route}
                className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors duration-200 font-inter text-sm sm:text-base font-semibold"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                Book on Calendly
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
