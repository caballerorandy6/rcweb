import Link from "next/link";
import type { Route } from "next";
import { navigation, secondaryNavigation, footerNavigation, extraFooterLinks } from "@/lib/data";
import Logo from "@/app/components/layout/Logo";

export default function Footer() {
  const mainNavigation = navigation.slice(0, -2);
  const contactItem = navigation.find((item) => item.name === "Contact");

  // Dividir en grupos para mejor organización
  const primaryLinks = mainNavigation;
  const secondaryLinks = secondaryNavigation;

  return (
    <footer className="relative bg-gradient-to-b from-gray-900/95 to-black overflow-hidden">
      {/* Elementos decorativos de fondo - Mejorados */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-[80px]" />
      </div>

      {/* Línea decorativa superior */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-16">
          {/* Grid principal - Mejorado con mejor responsividad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
            {/* Columna principal con logo - Ocupa 2 columnas en lg */}
            <div className="sm:col-span-2 lg:col-span-2 flex flex-col items-center lg:items-start">
              <Logo className="w-36 lg:w-40 h-auto mb-6" />
              <p className="text-white/60 font-inter text-sm leading-relaxed mb-6 text-center lg:text-left max-w-sm mx-auto lg:mx-0">
                Crafting exceptional digital experiences with modern web
                technologies. Let&apos;s build something amazing together.
              </p>

              {/* Contact CTA */}
              {contactItem && (
                <Link
                  href={contactItem.hash as Route}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-yellow-300 text-gray-900 rounded-lg text-sm font-inter font-semibold hover:from-yellow-300 hover:to-gold transition-all duration-300 hover:shadow-lg hover:shadow-gold/20 hover:-translate-y-0.5 group"
                >
                  Get In Touch
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
              )}
            </div>

            {/* Columnas de navegación - Cada una ocupa 1 columna */}
            <div className="text-center sm:text-left sm:col-span-1">
              <h2 className="text-gold font-inter font-semibold text-sm uppercase tracking-wider mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent hidden sm:block" />
                Navigation
              </h2>
              <ul className="space-y-2">
                {primaryLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.hash as Route}
                      className="text-white/60 hover:text-gold transition-all duration-200 font-inter text-sm inline-flex items-center justify-center sm:justify-start w-full sm:w-auto group"
                    >
                      <span className="w-1 h-1 bg-gold/50 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left sm:col-span-1">
              <h2 className="text-gold font-inter font-semibold text-sm uppercase tracking-wider mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent hidden sm:block" />
                More
              </h2>
              <ul className="space-y-2">
                {secondaryLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.hash as Route}
                      className="text-white/60 hover:text-gold transition-all duration-200 font-inter text-sm inline-flex items-center justify-center sm:justify-start w-full sm:w-auto group"
                    >
                      <span className="w-1 h-1 bg-gold/50 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {item.name}
                    </Link>
                  </li>
                ))}
                {footerNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.hash as Route}
                      className="text-white/60 hover:text-gold transition-all duration-200 font-inter text-sm inline-flex items-center justify-center sm:justify-start w-full sm:w-auto group"
                    >
                      <span className="w-1 h-1 bg-gold/50 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center sm:text-left sm:col-span-1">
              <h2 className="text-gold font-inter font-semibold text-sm uppercase tracking-wider mb-4 flex items-center justify-center sm:justify-start gap-2">
                <span className="w-8 h-px bg-gradient-to-r from-gold/50 to-transparent hidden sm:block" />
                Connect
              </h2>
              <div className="space-y-3">
                <p className="text-white/60 font-inter text-sm">
                  Ready to start your project?
                </p>
                <p className="text-white/40 font-inter text-xs">
                  Available for freelance opportunities
                </p>

                {/* Estado de disponibilidad */}
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  <span className="text-green-400 font-inter text-xs font-medium">
                    Available Now
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="my-8 lg:my-12">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Links secundarios y copyright - Flex mejorado */}
          <div className="space-y-6">
            {/* Links navegación y legales */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              {/* Links principales */}
              <nav className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-2">
                {mainNavigation.slice(0, 4).map((item) => (
                  <Link
                    key={item.name}
                    href={item.hash as Route}
                    className="text-white/50 hover:text-gold transition-colors duration-200 font-inter text-xs relative group"
                  >
                    {item.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>

              {/* Links legales */}
              <nav className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2">
                {extraFooterLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.hash as Route}
                    className="text-white/50 hover:text-gold transition-colors duration-200 font-inter text-xs relative group"
                  >
                    {link.name}
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Copyright - Centrado */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
              <p className="text-gold font-iceland text-xl lg:text-2xl flex items-center gap-2">
                © {new Date().getFullYear()} RC Web Solutions LLC
                {/* <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold" />
                </span> */}
              </p>
              <span className="text-white/30">•</span>
              <p className="text-white/40 font-inter text-xs">
                All Rights Reserved
              </p>
            </div>

            {/* Decoración final */}
            <div className="flex justify-center gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-gold/40 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
