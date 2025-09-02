"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import CustomBadge from "@/app/components/CustomBadge";
import useSectionObserver from "@/hooks/useSectionObserver";

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
      className="relative isolate overflow-hidden pt-14 h-screen bg-gray-950"
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          className="inset-0 -z-10 size-full object-cover object-right md:object-center opacity-35 image-gradient"
        >
          <source src="/hero.webm" type="video/webm" />
        </video>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-iceland tracking-tight sm:text-9xl text-gold">
            Randy Caballero
          </h1>
          <CustomBadge>Available for Projects</CustomBadge>
          <p className="mt-8 font-inter text-white/80 text-base">
            Full-Stack Developer specializing in Next.js with 3+ years creating
            digital solutions for businesses.
          </p>

          {/* Social Proof */}
          <div className="mt-6 flex justify-center gap-8 text-lg font-inter text-gold/70">
            <span>10+ Projects</span>
            <span>•</span>
            <span>5+ Happy Clients</span>
            <span>•</span>
            <span>100% Remote</span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center gap-x-6">
            <Link
              href="#services"
              className="text-sm/6 font-inter text-gray-900 bg-gold hover:bg-gold/90 p-3 px-6 rounded-md transition-all duration-200 ease-in-out hover:scale-105"
            >
              View Services
            </Link>
            <Link
              href="#contact"
              className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-3 px-6 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            >
              Schedule a Call
            </Link>
            <Link
              href="/resume.pdf"
              download="Randy Caballero - Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-3 px-6 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            >
              Download CV
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
