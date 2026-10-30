"use client";

import clsx from "clsx";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { useRCWebStore } from "@/store/rcweb-store";
import Logo from "@/components/layout/Logo";
import LanguageSwitch from "@/components/layout/LanguageSwitch";
import Button from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import { contactItem, navigation, secondaryNavigation } from "@/lib/navigation";
import { withViewTransition } from "@/lib/viewTransition";

/** Items that fit the compact (tablet) bar */
const COMPACT_KEYS = new Set(["services", "projects", "pricing", "blog", "about"]);

const Navbar = () => {
  const t = useTranslations("Nav");

  // Use individual selectors to prevent unnecessary re-renders
  const activeSection = useRCWebStore((state) => state.activeSection);
  const setActiveSection = useRCWebStore((state) => state.setActiveSection);
  const isOpen = useRCWebStore((state) => state.isOpen);
  const setIsOpen = useRCWebStore((state) => state.setIsOpen);
  const handleClickModal = useRCWebStore((state) => state.handleClickModal);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Locale-agnostic pathname: "/" on both the English and the Spanish home
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Highlight the item of a full page (e.g. /about) when landing on it
  useEffect(() => {
    const matchingItem = navigation.find(
      (item) => typeof item.href === "string" && item.href === pathname
    );
    if (matchingItem && matchingItem.key !== activeSection) {
      setActiveSection(matchingItem.key);
    }
  }, [pathname, activeSection, setActiveSection]);

  const compactNavigation = navigation.filter((item) => COMPACT_KEYS.has(item.key));

  // Combine main and secondary navigation for mobile menu
  const allNavigationItems = [...navigation, contactItem, ...secondaryNavigation];

  return (
    <>
      <nav
        aria-label={t("global")}
        className="fixed top-0 left-0 right-0 z-40 animateHeadingDialog"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Logo className="w-32 lg:w-36 xl:w-40 h-auto" />

            {/* Desktop Navigation - Hidden on smaller screens */}
            <div className="hidden 2xl:flex items-center gap-x-1">
              {navigation.map((item) => {
                const isActive = activeSection === item.key;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      withViewTransition(() => setActiveSection(item.key));
                      // Asegurar que el estado se mantenga después del scroll
                      setTimeout(() => {
                        setActiveSection(item.key);
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
                      {t(item.key)}
                    </span>
                    {/* The pill slides between items via a View Transition */}
                    {isActive && (
                      <span className="bg-gold/20 rounded-full absolute inset-0 -z-10 [view-transition-name:navbar-active-tab]" />
                    )}
                  </Link>
                );
              })}

              {/* Contact as CTA Button */}
              <Button
                href={contactItem.href}
                size="sm"
                className="ml-4"
                onClick={() => setActiveSection(contactItem.key)}
              >
                {t("contact")}
              </Button>

              <LanguageSwitch className="ml-3" />
            </div>

            {/* Tablet/Large Screen Compact Menu */}
            <div className="hidden lg:flex 2xl:hidden items-center gap-x-4">
              {compactNavigation.map((item) => {
                const isActive = activeSection === item.key;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() =>
                      withViewTransition(() => setActiveSection(item.key))
                    }
                    className={clsx(
                      "px-2 py-1 text-sm font-inter transition-colors duration-300 cursor-pointer relative group",
                      isActive ? "text-gold" : "text-white/80 hover:text-gold"
                    )}
                  >
                    <span className="relative z-10">{t(item.key)}</span>
                    {isActive && (
                      <span className="bg-gold/20 rounded-full absolute inset-0 -z-10 [view-transition-name:navbar-active-tab-tablet]" />
                    )}
                  </Link>
                );
              })}

              {/* Contact Button */}
              <Button
                href={contactItem.href}
                size="sm"
                onClick={() => setActiveSection(contactItem.key)}
              >
                {t("letsTalk")}
              </Button>

              <LanguageSwitch />

              {/* More Menu */}
              <button
                type="button"
                onClick={handleClickModal}
                className="p-2.5 -m-2.5 rounded-lg text-white/80 hover:text-gold transition-colors cursor-pointer"
                aria-label={t("openMenu")}
                aria-expanded={isOpen}
                aria-controls="site-menu"
              >
                <Bars3Icon className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile: language + menu button */}
            <div className="flex lg:hidden items-center gap-x-3">
              <LanguageSwitch />
              <button
                type="button"
                onClick={handleClickModal}
                className="inline-flex items-center justify-center p-2.5 -m-2.5 rounded-lg text-white/80 hover:text-gold transition-colors cursor-pointer"
                aria-label={t("openMenu")}
                aria-expanded={isOpen}
                aria-controls="site-menu"
              >
                <Bars3Icon aria-hidden="true" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer solo fuera del homepage: el hero full-screen ya vive bajo el nav transparente */}
      {!isHomePage && <div className="h-[72px]" />}

      {/* Mobile/Tablet Drawer */}
      <Modal
        id="site-menu"
        aria-label={t("siteMenu")}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        initialFocus={closeButtonRef}
        className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-screen max-w-sm bg-transparent p-0 text-inherit backdrop:bg-black/50"
      >
        <div className="flex h-full flex-col bg-linear-to-b from-gray-900 via-gray-900 to-gray-950 shadow-2xl border-l border-gold/10">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gold/20 bg-gold/5">
            <Logo className="w-32 h-auto" onClick={handleClickModal} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-white/80 hover:text-gold hover:bg-gold/10 transition duration-300 cursor-pointer"
              aria-label={t("closeMenu")}
            >
              <XMarkIcon aria-hidden="true" className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <nav aria-label={t("site")} className="space-y-2">
              {allNavigationItems.map((item) => {
                const isActive = activeSection === item.key;

                // Style Contact differently
                if (item.key === "contact") {
                  return (
                    <Button
                      key={item.key}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      size="lg"
                      fullWidth
                      className="mt-6"
                      onClick={() => {
                        setActiveSection(item.key);
                        handleClickModal();
                      }}
                    >
                      {t("getInTouch")}
                    </Button>
                  );
                }

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={() => {
                      setActiveSection(item.key);
                      handleClickModal();
                    }}
                    className={clsx(
                      "relative block px-4 py-3.5 rounded-xl text-base font-inter font-medium transition duration-300 cursor-pointer group overflow-hidden",
                      isActive
                        ? "bg-gold/20 text-gold border border-gold/30 shadow-lg shadow-gold/10"
                        : "text-white/80 hover:text-gold border border-transparent hover:border-gold/30 hover:bg-gold/10 hover:shadow-md hover:shadow-gold/5 transform hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    {!isActive && (
                      <span className="absolute inset-0 bg-linear-to-r from-gold/0 via-gold/5 to-gold/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
                    )}
                    <span className="relative z-10">{t(item.key)}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer Info */}
          <div className="border-t border-gold/20 px-6 py-5 bg-gold/5 flex items-center justify-between gap-4">
            <p className="text-sm font-inter text-white/60">{t("tagline")}</p>
            <LanguageSwitch onNavigate={() => setIsOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
