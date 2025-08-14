"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import LetsContactDialog from "@/app/components/LetsContactDialog";
import CustomBadge from "@/app/components/CustomBadge";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

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
            I&apos;m Randy Caballero
          </h1>
          <CustomBadge>Open to Work</CustomBadge>
          <p className="mt-8 font-inter text-white/80 text-base">
            +3 years of experience. Software Engineer and Programming
            Specialized in developing unique web applications.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center gap-x-6">
            <Link
              href="/resume.pdf"
              download="Randy Caballero - Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            >
              Download CV
            </Link>
            <Link
              href="#experience"
              className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            >
              Experience <ArrowDownIcon className="text-white h-4" />
            </Link>
            <Link
              href="/#contact"
              className="text-sm/6 font-inter text-white/80 hover:bg-gold/20 p-2 rounded-md flex items-center gap-x-1 border-2 border-gold/50 transition-all duration-200 ease-in-out hover:scale-105"
            >
              Let&apos;s Connect
            </Link>
            <LetsContactDialog />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
