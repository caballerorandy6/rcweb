"use client";

import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import { useRCWebStore } from "@/store/rcweb-store";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "@/app/components/Logo";
import { navigation } from "@/libs/data";

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

  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center p-6 justify-center w-full"
      >
        {/* 🟨 NAV MOBILE (visible hasta lg) */}
        <div className="flex items-center justify-between w-10/12 lg:hidden rounded-full px-6 animateHeadingDialog">
          <Logo className="w-40 h-auto" /> {/* Tamaño base para mobile */}
          <button
            type="button"
            onClick={handleClickModal}
            className="inline-flex items-center justify-center rounded-md text-gray-400"
          >
            <Bars3Icon aria-hidden="true" className="size-10 text-white" />
          </button>
        </div>

        {/* 🟩 NAV DESKTOP (desde lg) */}
        {/* Se cambió "hidden md:flex" a "hidden lg:flex" */}
        <div className="hidden lg:flex items-center justify-center relative w-full px-6">
          {/* Logo a la izquierda */}
          <div className="absolute left-6">
            <Logo className="w-28 md:w-32 lg:w-36 xl:w-40 h-auto animateHeadingDialog" />
          </div>

          {/* Menú centrado */}
          <div className="flex items-center gap-x-8 animateHeadingDialog px-6 py-2 rounded-full">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.hash}
                onClick={() => setActiveSection(item.name)}
                className={clsx(
                  "-mx-3 block rounded-lg px-3 text-base/7 font-inter text-white hover:text-gold relative transition-colors",
                  {
                    "text-white": activeSection === item.name,
                  }
                )}
              >
                {item.name}
                {item.name === activeSection && (
                  <motion.span
                    className="bg-gold/40 rounded-full absolute inset-0 -z-10 p-0.5"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* 🟥 MODAL: NAV MOBILE (Drawer desde la derecha) */}
      {/* Se cambió "className="md:hidden"" a "className="lg:hidden"" */}
      <nav>
        <Dialog open={isOpen} onClose={handleClickModal} className="lg:hidden">
          <div className="fixed inset-0 z-50 justify-between" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between px-4 pt-4">
              <Logo className="w-24 h-auto" />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
              >
                <XMarkIcon aria-hidden="true" className="size-6 mr-10" />
              </button>
            </div>
            <div className="mt-6 px-6 flow-root">
              <div className="-my-6 divide-y">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.hash}
                      onClick={() => {
                        setActiveSection(item.name);
                        handleClickModal();
                      }}
                      className={clsx(
                        "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-inter text-white hover:text-gold",
                        {
                          "bg-gold/40": activeSection === item.name,
                        }
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </nav>
    </>
  );
};

export default Navbar;
