"use client";

import { useInView } from "react-intersection-observer";

import Image from "next/image";
import Link from "next/link";

//Components
import Logo from "@/app/components/Logo";
import DialogForm from "./DialogForm";

//Icons
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

//Hooks
import { useRCWeb } from "@/hooks/useRCWeb";
import { useEffect } from "react";

const Hero = () => {
  const { isOpen, setIsOpen, setActiveSection } = useRCWeb();

  const { ref, inView } = useInView({
    threshold: 0.75,
  });

  useEffect(() => {
    if (inView) setActiveSection("Home");
  }, [inView, setActiveSection]);

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
              className="rounded-md bg-gold/50 border-gold/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-transparent hover:border-2 transition font-mono"
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
              className="rounded-md bg-gold/50 border-gold/50 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-transparent hover:border-2 transition font-mono"
              onClick={() => setIsOpen(true)}
            >
              Let&apos;s Connect
            </button>
            <Dialog
              open={isOpen}
              onClose={() => setIsOpen(false)}
              className="relative z-10"
            >
              <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
              />

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                  >
                    Let&apos;s Connect
                    <DialogForm />
                  </DialogPanel>
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
