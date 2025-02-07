"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import Image from "next/image";
import Link from "next/link";

//Components
import Logo from "@/app/components/Logo";
import LetsContactDialog from "./LetsContactDialog";
import CustomBadge from "@/app/components/CustomBadge";

//Icons
import { ArrowDownIcon } from "@heroicons/react/24/outline";

//Hooks
import { useRCWeb } from "@/hooks/useRCWeb";

const Hero = () => {
  const { setIsOpen, activeSection, setActiveSection } = useRCWeb();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) {
      setActiveSection("Home");
    }
  }, [inView, activeSection, setActiveSection]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate overflow-hidden pt-14 h-screen bg-gray-950"
    >
      {/* Asegura que la imagen de fondo solo se aplique a esta sección */}
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          alt="Background"
          src="/background.webp"
          width={1920}
          height={1080}
          className="ixed inset-0 -z-10 size-full object-cover opacity-50 image-gradient"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex flex-col justify-center">
        <Logo />

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl font-mono text-gold">
            I&apos;m Randy Caballero
          </h1>
          <CustomBadge>Open to Work</CustomBadge>
          <p className="mt-8 text-lg font-medium text-gray-400 sm:text-xl/8 font-sans">
            +3 years of experience. Software Engineer and Programming
            Specialized in developing unique web applications.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/Randy Caballero - Resume.pdf"
              download="Randy Caballero - Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono flex items-center gap-x-1 border-2 border-gold/50"
            >
              Download CV
            </Link>
            <Link
              href="#experience"
              className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono flex items-center gap-x-1 border-2 border-gold/50"
            >
              Experience <ArrowDownIcon className="text-white h-4" />
            </Link>
            <button
              type="button"
              className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono flex items-center gap-x-1 border-2 border-gold/50"
              onClick={() => setIsOpen(true)}
            >
              Let&apos;s Connect
            </button>
            <LetsContactDialog />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
