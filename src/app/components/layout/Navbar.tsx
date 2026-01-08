"use client";

import Link from "next/link";
import type { Route } from "next";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useRCWebStore } from "@/store/rcweb-store";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "@/app/components/layout/Logo";
import { navigation, secondaryNavigation } from "@/lib/data";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export interface NavigationProps {
  name: string;
  hash: string;
}

const Navbar = () => {
  const {
    activeSection,
    setActiveSection,
    isOpen,
    setIsOpen,
    handleClickModal,
  } = useRCWebStore();

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Sincronizar activeSection con pathname para rutas completas como /blog
  useEffect(() => {
    // Encontrar el item de navegación que coincide con el pathname actual
    const matchingItem = navigation.find((item) => {
      // Para rutas completas como /blog
      if (item.hash.startsWith("/") && !item.hash.includes("#")) {
        return pathname === item.hash;
      }
      return false;
    });

    // Si encontramos un match y no es el activeSection actual, actualizarlo
    if (matchingItem && matchingItem.name !== activeSection) {
      setActiveSection(matchingItem.name);
    }
  }, [pathname, activeSection, setActiveSection]);

  // Función helper para obtener el href correcto
  const getHref = (hash: string): Route => {
    // Si el hash ya empieza con /, es una ruta completa
    if (hash.startsWith("/")) {
      return hash as Route;
    }
    // Si estamos en homepage, retorna el hash tal cual
    // Si no, construye la ruta completa
    return (isHomePage ? hash : `/${hash}`) as Route;
  };

  // Separate Contact as CTA button
  const mainNavigation = navigation.slice(0, -2); // All except Contact and CTA
  const contactItem = navigation.find((item) => item.name === "Contact");

  // Combine main and secondary navigation for mobile menu
  const allNavigationItems = [
    ...navigation.slice(0, -1),
    ...secondaryNavigation,
  ];

  return (
    <>
      <nav
        aria-label="Global"
        className="fixed top-0 left-0 right-0 z-40 animateHeadingDialog"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Logo className="w-32 lg:w-36 xl:w-40 h-auto" />

            {/* Desktop Navigation - Hidden on smaller screens */}
            <div className="hidden 2xl:flex items-center gap-x-1">
              {mainNavigation.map((item) => {
                const isActive = activeSection === item.name;

                return (
                  <Link
                    key={item.name}
                    href={getHref(item.hash)}
                    onClick={() => {
                      setActiveSection(item.name);
                      // Asegurar que el estado se mantenga después del scroll
                      setTimeout(() => {
                        setActiveSection(item.name);
                      }, 500);
                    }}
                    className="px-3 py-1 text-sm font-inter transition-colors duration-300 relative group cursor-pointer"
                  >
                    <span
                      className={clsx(
                        "relative z-10",
                        isActive
                          ? "text-gold"
                          : "text-white/80 group-hover:text-gold"
                      )}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <motion.span
                        className="bg-gold/20 rounded-full absolute inset-0 -z-10"
                        layoutId="navbar-active-tab"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                          mass: 0.8,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Contact as CTA Button */}
              {contactItem && (
                <Link
                  href={getHref(contactItem.hash)}
                  onClick={() => setActiveSection(contactItem.name)}
                  className="relative ml-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative">{contactItem.name}</span>
                </Link>
              )}

              {/* Client Portal - Discreet button */}
              <Link
                href="/client/login"
                className="ml-4 px-3 py-2 text-xs font-semibold text-white/70 hover:text-gold transition-all duration-300 font-inter border border-gold/20 hover:border-gold/50 hover:bg-gold/5 rounded-lg cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-sm"
                aria-label="Client Portal"
              >
                Client Portal
              </Link>
            </div>

            {/* Tablet/Large Screen Compact Menu */}
            <div className="hidden lg:flex 2xl:hidden items-center gap-x-4">
              {/* Show only key items */}
              {["Services", "Projects", "Pricing"].map((itemName) => {
                const item = navigation.find((n) => n.name === itemName);
                if (!item) return null;
                const isActive = activeSection === item.name;
                return (
                  <Link
                    key={item.name}
                    href={getHref(item.hash)}
                    onClick={() => setActiveSection(item.name)}
                    className={clsx(
                      "px-2 py-1 text-sm font-inter transition-colors duration-300 cursor-pointer relative group",
                      isActive ? "text-gold" : "text-white/80 hover:text-gold"
                    )}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.span
                        className="bg-gold/20 rounded-full absolute inset-0 -z-10"
                        layoutId="navbar-active-tab-tablet"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 35,
                          mass: 0.8,
                        }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Contact Button */}
              {contactItem && (
                <Link
                  href={getHref(contactItem.hash)}
                  onClick={() => setActiveSection(contactItem.name)}
                  className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative">Let&#39;s Talk</span>
                </Link>
              )}

              {/* Client Portal - Discreet button */}
              <Link
                href="/client/login"
                className="px-3 py-2 text-xs font-semibold text-white/70 hover:text-gold transition-all duration-300 font-inter border border-gold/20 hover:border-gold/50 hover:bg-gold/5 rounded-lg cursor-pointer hover:scale-105 active:scale-95 backdrop-blur-sm"
                aria-label="Client Portal"
              >
                Client Portal
              </Link>

              {/* More Menu */}
              <button
                type="button"
                onClick={handleClickModal}
                className="text-white/80 hover:text-gold transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={handleClickModal}
              className="lg:hidden inline-flex items-center justify-center rounded-md text-white/80 hover:text-gold transition-colors cursor-pointer"
              aria-label="Open mobile menu"
            >
              <Bars3Icon aria-hidden="true" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />

      {/* Mobile/Tablet Drawer */}
      <Dialog
        open={isOpen}
        onClose={handleClickModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <DialogPanel className="pointer-events-auto w-screen max-w-sm">
                <div className="flex h-full flex-col bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 backdrop-blur-xl shadow-2xl border-l border-gold/10">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20 bg-gold/5">
                    <Logo className="w-32 h-auto" />
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg p-2 text-white/80 hover:text-gold hover:bg-gold/10 transition-all duration-300 cursor-pointer"
                      aria-label="Close menu"
                    >
                      <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <nav className="space-y-2">
                      {allNavigationItems.map((item) => {
                        // Skip CTA from regular menu
                        if (item.name === "CTA") return null;

                        const isActive = activeSection === item.name;

                        // Style Contact differently
                        if (item.name === "Contact") {
                          return (
                            <Link
                              key={item.name}
                              href={getHref(item.hash)}
                              onClick={() => {
                                setActiveSection(item.name);
                                handleClickModal();
                              }}
                              className="relative block w-full mt-6 px-6 py-4 text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                              <span className="relative flex items-center justify-center">
                                Get In Touch
                              </span>
                            </Link>
                          );
                        }

                        return (
                          <Link
                            key={item.name}
                            href={getHref(item.hash)}
                            onClick={() => {
                              setActiveSection(item.name);
                              handleClickModal();
                            }}
                            className={clsx(
                              "relative block px-4 py-3.5 rounded-xl text-base font-inter font-medium transition-all duration-300 cursor-pointer group overflow-hidden",
                              isActive
                                ? "bg-gold/20 text-gold border border-gold/30 shadow-lg shadow-gold/10"
                                : "text-white/80 hover:text-gold border border-transparent hover:border-gold/30 hover:bg-gold/10 hover:shadow-md hover:shadow-gold/5 transform hover:scale-[1.02] active:scale-[0.98]"
                            )}
                          >
                            {!isActive && (
                              <span className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></span>
                            )}
                            <span className="relative z-10">{item.name}</span>
                          </Link>
                        );
                      })}

                      {/* Client Portal - At the end of mobile menu */}
                      <div className="mt-6 pt-6 border-t border-gold/20">
                        <Link
                          href="/client/login"
                          onClick={handleClickModal}
                          className="block px-4 py-3.5 rounded-xl text-base font-inter font-semibold transition-all duration-300 text-white/70 hover:text-gold hover:bg-gold/10 hover:border hover:border-gold/30 cursor-pointer border border-gold/20"
                        >
                          Client Portal
                        </Link>
                      </div>
                    </nav>
                  </div>

                  {/* Footer Info */}
                  <div className="border-t border-gold/20 px-6 py-5 bg-gold/5">
                    <p className="text-sm font-inter text-white/60 text-center">
                      Available for freelance projects
                    </p>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default Navbar;
