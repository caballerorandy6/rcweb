"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import LetsContactDialog from "@/app/components/LetsContactDialog";
import CustomBadge from "@/app/components/CustomBadge";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { useRCWebStore } from "@/store/rcweb-store";
import useSectionObserver from "@/hooks/useSectionObserver";

const Hero = () => {
  const { setOpenLetsContactDialog, setActiveSection } = useRCWebStore();

  const ref = useSectionObserver({ sectionName: "Home" });

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate overflow-hidden pt-14 h-screen bg-gray-950"
    >
      <div className="absolute inset-0 -z-10 h-full w-full">
        <Image
          alt="Background"
          src="/background.avif"
          width={1920}
          height={1080}
          className="inset-0 -z-10 size-full object-cover object-right md:object-center opacity-50 image-gradient"
          priority
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 h-full flex flex-col justify-center">
        <div className="hidden md:block">
          <Logo />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl font-mono text-gold">
            I&apos;m Randy Caballero
          </h1>
          <CustomBadge>Open to Work</CustomBadge>
          <p className="mt-8 font-mono  text-white/80 text-base">
            +3 years of experience. Software Engineer and Programming
            Specialized in developing unique web applications.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center gap-x-6">
            <Link
              href="/resume.pdf"
              download="Randy Caballero - Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm/6 font-semibold text-white/80 hover:bg-gold/40 p-2 rounded-md transition-colors font-sans flex items-center gap-x-1 border-2 border-gold/50"
            >
              Download CV
            </Link>
            <Link
              href="#experience"
              className="text-sm/6 font-semibold text-white/80 hover:bg-gold/40 p-2 rounded-md transition-colors font-sans flex items-center gap-x-1 border-2 border-gold/50"
            >
              Experience <ArrowDownIcon className="text-white h-4" />
            </Link>
            <button
              type="button"
              className="text-sm/6 font-semibold text-white/80 hover:bg-gold/40 p-2 rounded-md transition-colors font-sans flex items-center gap-x-1 border-2 border-gold/50"
              onClick={() => {
                setOpenLetsContactDialog(true);
                setActiveSection("Contact");
              }}
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
