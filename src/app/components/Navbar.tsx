"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

//Components
import Logo from "@/app/components/Logo";

interface NavigationProps {
  name: string;
  hash: string;
}

const navigation: NavigationProps[] = [
  { name: "Home", hash: "#home" },
  {
    name: "Experience",
    hash: "#experience",
  },
  { name: "Projects", hash: "#projects" },
  { name: "About", hash: "#about" },
  { name: "Contact", hash: "#contact" },
];

const Navbar = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuClick = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center lg:px-8 justify-between w-full"
      >
        <Logo />

        <div className="flex md:hidden">
          <button
            type="button"
            onClick={handleMobileMenuClick}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <Bars3Icon
              aria-hidden="true"
              className="size-10 text-white mr-10"
            />
          </button>
        </div>
        <div className="hidden md:flex justify-start relative w-8/12">
          <div className="flex items-center bg-gray-900/40 backdrop-blur-md py-4 px-8 gap-x-8 rounded-full">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.hash}
                onClick={() => setActiveSection(item.name)}
                className={clsx(
                  "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:text-gold relative transition-colors",
                  {
                    "text-white": activeSection === item.name,
                  }
                )}
              >
                {item.name}
                {item.name === activeSection && (
                  <motion.span
                    className="bg-gold/40 rounded-full absolute inset-0 -z-10"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  ></motion.span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={handleMobileMenuClick}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 justify-between" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={handleMobileMenuClick}
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
                      handleMobileMenuClick();
                    }}
                    className={clsx(
                      "-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:text-gold",
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
    </>
  );
};

export default Navbar;
