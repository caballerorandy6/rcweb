"use client";

import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Dialog, DialogPanel } from "@headlessui/react";

//Hooks
import { useRCWebStore } from "@/store/rcweb-store";

//Icons
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

//Components
import Logo from "@/app/components/Logo";

//Data
import { navigation } from "@/libs/arrays";

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
        className="flex items-center p-4 justify-center w-full"
      >
        <div className="flex animateHeadingDialog items-center justify-between w-10/12 sm:hidden rounded-full py-2 px-6">
          <Image
            src="/logo2.avif"
            alt="Logo"
            width={1000}
            height={1000}
            className="w-10 h-auto"
            priority={false}
          />

          <button
            type="button"
            onClick={handleClickModal}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <Bars3Icon aria-hidden="true" className="size-10 text-white" />
          </button>
        </div>

        <div className="hidden sm:flex justify-start relative">
          <div className="flex items-center animateHeadingDialog py-2 px-6 gap-x-8 rounded-full">
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
                    className="bg-gold/40 rounded-full absolute inset-0 -z-10 p-0.5"
                    layoutId="activeSection"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  ></motion.span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <nav>
        <Dialog open={isOpen} onClose={handleClickModal} className="md:hidden">
          <div className="fixed inset-0 z-50 justify-between" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-white/10">
            <div className="flex items-center justify-between">
              <Logo />
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
      </nav>
    </>
  );
};

export default Navbar;
