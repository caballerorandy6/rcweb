import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="relative isolate overflow-hidden pt-14 h-screen bg-gray-950">
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
              className="rounded-md bg-gold/40 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-gold/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold transition-colors font-mono"
            >
              Download CV
            </Link>
            <Link
              href="#experience"
              className="text-sm/6 font-semibold text-white hover:bg-gold/40 p-2 rounded-md transition-colors font-mono"
            >
              Experience{" "}
              <span aria-hidden="true" className="text-lg/6">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
