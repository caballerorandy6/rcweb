"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Route } from "next";
import CustomBadge from "@/app/components/ui/CustomBadge";
import useSectionObserver from "@/hooks/useSectionObserver";
import { motion } from "framer-motion";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { trackFBPhoneCall } from "@/app/components/tracking/FacebookPixel";

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
      className="relative isolate overflow-hidden pt-14 h-screen"
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
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
          <motion.h1
            className="text-5xl font-iceland tracking-tight sm:text-9xl text-gold"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 20,
              delay: 0.2,
            }}
          >
            Randy Caballero
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.5,
            }}
          >
            <CustomBadge>Available for Projects</CustomBadge>
          </motion.div>

          <motion.p
            className="mt-8 font-inter text-white/80 text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 22,
              delay: 0.7,
            }}
          >
            Full-Stack Developer specializing in Next.js with 5+ years creating
            digital solutions for businesses.
          </motion.p>

          {/* Social Proof con animación */}
          <motion.div
            className="mt-6 flex justify-center gap-12 text-lg font-inter font-semibold text-gold/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.9,
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
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center gap-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 1.1,
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
                delay: 1.2,
              }}
            >
              <Link
                href={"#services" as Route}
                className="inline-block text-sm/6 font-inter text-gray-900 bg-gold hover:bg-gold/90 p-3 px-6 rounded-md transition-colors duration-200"
              >
                View Services
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
                delay: 1.3,
              }}
            >
              <Link
                href={"#contact" as Route}
                className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-3 px-6 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-colors duration-200"
              >
                Schedule a Call
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
                delay: 1.4,
              }}
            >
              <a
                href="/resume.pdf"
                download="Randy Caballero - Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-3 px-6 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-colors duration-200"
              >
                Download CV
              </a>
            </motion.div>
          </motion.div>

          {/* Phone Number CTA */}
          <motion.div
            className="mt-8 text-center mx-auto flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 1.5,
            }}
          >
            <p className="text-white/60 font-inter text-sm mb-2 text-center">
              Or call us directly:
            </p>
            <motion.a
              href="tel:+13463757534"
              onClick={trackPhoneConversion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 text-gold hover:text-gold/80 transition-colors font-inter text-lg font-semibold"
            >
              <PhoneIcon className="w-5 h-5" />
              +1 (346) 375-7534
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
