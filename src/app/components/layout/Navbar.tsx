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
  const allNavigationItems = [...navigation.slice(0, -1), ...secondaryNavigation];

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
                    onClick={() => setActiveSection(item.name)}
                    className="px-3 py-2 text-sm font-inter transition-colors duration-300 relative group"
                  >
                    <span
                      className={clsx(
                        "relative z-10",
                        isActive ? "text-gold" : "text-white/80 group-hover:text-gold"
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
                  className="ml-4 px-4 py-2 bg-gold text-gray-900 rounded-lg text-sm font-inter font-medium hover:bg-gold/90 transition-all duration-300"
                >
                  {contactItem.name}
                </Link>
              )}

              {/* Client Portal - Discreet button */}
              <Link
                href="/client/login"
                className="ml-4 px-3 py-2 text-xs text-white/60 hover:text-gold transition-colors duration-300 font-inter border border-white/10 hover:border-gold/30 rounded-lg"
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
                      "text-sm font-inter transition-colors duration-300",
                      isActive ? "text-gold" : "text-white/80 hover:text-gold"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}

              {/* Contact Button */}
              {contactItem && (
                <Link
                  href={getHref(contactItem.hash)}
                  onClick={() => setActiveSection(contactItem.name)}
                  className="px-4 py-2 bg-gold text-gray-900 rounded-lg text-sm font-inter font-medium hover:bg-gold/90 transition-all duration-300"
                >
                  Let&#39;s Talk
                </Link>
              )}

              {/* Client Portal - Discreet button */}
              <Link
                href="/client/login"
                className="px-3 py-2 text-xs text-white/60 hover:text-gold transition-colors duration-300 font-inter border border-white/10 hover:border-gold/30 rounded-lg"
                aria-label="Client Portal"
              >
                Client Portal
              </Link>

              {/* More Menu */}
              <button
                type="button"
                onClick={handleClickModal}
                className="text-white/80 hover:text-gold transition-colors"
                aria-label="Open navigation menu"
              >
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={handleClickModal}
              className="lg:hidden inline-flex items-center justify-center rounded-md text-white/80 hover:text-gold transition-colors"
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
                <div className="flex h-full flex-col bg-gray-900 shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gold/10">
                    <Logo className="w-32 h-auto" />
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-md text-white/80 hover:text-gold transition-colors"
                      aria-label="Close menu"
                    >
                      <XMarkIcon aria-hidden="true" className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Navigation Items */}
                  <div className="flex-1 overflow-y-auto px-6 py-6">
                    <nav className="space-y-1">
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
                              className="block w-full mt-4 px-4 py-3 bg-gold text-gray-900 rounded-lg text-center font-inter font-medium hover:bg-gold/90 transition-all duration-300"
                            >
                              Get In Touch
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
                              "block px-4 py-3 rounded-lg text-base font-inter transition-all duration-300",
                              isActive
                                ? "bg-gold/20 text-gold"
                                : "text-white/80 hover:text-gold hover:bg-gold/5"
                            )}
                          >
                            {item.name}
                          </Link>
                        );
                      })}

                      {/* Client Portal - At the end of mobile menu */}
                      <div className="mt-4 pt-4 border-t border-gold/10">
                        <Link
                          href="/client/login"
                          onClick={handleClickModal}
                          className="block px-4 py-3 rounded-lg text-base font-inter transition-all duration-300 text-white/60 hover:text-gold hover:bg-gold/5"
                        >
                          Client Portal
                        </Link>
                      </div>
                    </nav>
                  </div>

                  {/* Footer Info */}
                  <div className="border-t border-gold/10 px-6 py-4">
                    <p className="text-sm font-inter text-white/50 text-center">
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
