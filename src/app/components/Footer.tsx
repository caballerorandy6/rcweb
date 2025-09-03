import Link from "next/link";
import { navigation } from "@/libs/data";
import Logo from "@/app/components/Logo";

const Footer = () => {
  const mainNavigation = navigation.slice(0, -2);
  const contactItem = navigation.find((item) => item.name === "Contact");

  // Dividir en grupos para mejor organización
  const primaryLinks = mainNavigation.slice(0, 4);
  const secondaryLinks = mainNavigation.slice(4);

  return (
    <footer className="relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>

      <div className="relative bg-gradient-to-b from-transparent to-gray-900/50 pt-16 pb-8">
        <div className="mx-auto w-11/12 max-w-7xl">
          {/* Sección principal del footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Columna del logo y descripción */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <Logo className="w-40 h-auto" />
              </div>
              <p className="text-white/60 font-inter text-sm leading-relaxed mb-6">
                Crafting exceptional digital experiences with modern web
                technologies. Let&apos;s build something amazing together.
              </p>

              {/* Contact CTA */}
              {contactItem && (
                <div className="flex justify-center lg:justify-start">
                  <Link
                    href={contactItem.hash}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gold to-yellow-200 text-gray-900 rounded-lg text-sm font-inter font-medium hover:from-yellow-200 hover:to-gold transition-all duration-300 transform hover:scale-105 group"
                  >
                    Get In Touch
                    <svg
                      className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              )}
            </div>

            {/* Columna de navegación primaria */}
            <div className="lg:col-span-1 text-center lg:text-left">
              <h3 className="text-gold font-inter font-semibold text-sm uppercase tracking-wide mb-6 relative inline-block lg:block">
                Navigation
                <div className="absolute -bottom-2 left-1/2 lg:left-0 w-8 h-0.5 bg-gold rounded-full transform -translate-x-1/2 lg:translate-x-0"></div>
              </h3>
              <ul className="space-y-3">
                {primaryLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.hash}
                      className="text-white/70 hover:text-gold transition-colors duration-200 font-inter text-sm flex items-center justify-center lg:justify-start group"
                    >
                      <span className="w-1 h-1 bg-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1 text-center lg:text-left">
              <h3 className="text-gold font-inter font-semibold text-sm uppercase tracking-wide mb-6 relative inline-block lg:block">
                More
                <div className="absolute -bottom-2 left-1/2 lg:left-0 w-8 h-0.5 bg-gold rounded-full transform -translate-x-1/2 lg:translate-x-0"></div>
              </h3>
              <ul className="space-y-3">
                {secondaryLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.hash}
                      className="text-white/70 hover:text-gold transition-colors duration-200 font-inter text-sm flex items-center justify-center lg:justify-start group"
                    >
                      <span className="w-1 h-1 bg-gold rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-1 text-center lg:text-left">
              <h3 className="text-gold font-inter font-semibold text-sm uppercase tracking-wide mb-6 relative inline-block lg:block">
                Connect
                <div className="absolute -bottom-2 left-1/2 lg:left-0 w-8 h-0.5 bg-gold rounded-full transform -translate-x-1/2 lg:translate-x-0"></div>
              </h3>
              <div className="space-y-4">
                <div className="text-white/60 font-inter text-sm">
                  <p className="mb-2">Ready to start your project?</p>
                  <p className="text-xs text-white/50">
                    Available for freelance opportunities
                  </p>
                </div>

                <div className="flex items-center justify-center lg:justify-start">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-400 font-inter text-xs font-medium">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8"></div>

          {/* Footer inferior */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
            {/* Links de navegación compactos para mobile */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {mainNavigation.slice(0, 4).map((item) => (
                <Link
                  key={item.name}
                  href={item.hash}
                  className="text-white/50 hover:text-gold transition-colors font-inter text-xs relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gold font-iceland text-xl md:text-2xl mb-1 relative inline-block">
                © {new Date().getFullYear()} RC Web
                <span className="absolute -top-1 -right-2 w-1 h-1 bg-gold rounded-full animate-ping"></span>
              </p>
              <p className="text-white/40 font-inter text-xs">
                All Rights Reserved
              </p>
            </div>
          </div>

          {/* Elementos decorativos inferiores */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-1 h-1 bg-gold/50 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-gold/30 rounded-full animate-pulse delay-100"></div>
            <div className="w-1 h-1 bg-gold/50 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
