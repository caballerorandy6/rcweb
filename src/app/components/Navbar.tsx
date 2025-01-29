"use client";

import Link from "next/link";
import clsx from "clsx";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useRCWeb from "@/libs/hooks/useRCWeb";

//Components
import Logo from "@/app/components/Logo";

interface NavigationProps {
  name: string;
  id: string;
  href: string;
  hash: string;
}

const navigation: NavigationProps[] = [
  { name: "Home", id: "hero", href: "/", hash: "#hero" },
  {
    name: "Experience",
    id: "experience",
    href: "/experience",
    hash: "#experience",
  },
  { name: "Projects", id: "projects", href: "/projects", hash: "#projects" },
  { name: "About", id: "about", href: "/about", hash: "#about" },
  { name: "Contact", id: "contact", href: "/contact", hash: "#contact" },
];

const Navbar = () => {
  const rcWeb = useRCWeb();

  if (!rcWeb) {
    return null;
  }

  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    activeSection,
    setActiveSection,
    setTimeOfLastClick,
  } = rcWeb;

  console.log(activeSection);

  return (
    <>
      <nav
        aria-label="Global"
        className="flex items-center lg:px-8 justify-around"
      >
        <div className="flex lg:flex-1">
          <Logo />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <Bars3Icon
              aria-hidden="true"
              className="size-10 text-white mr-10"
            />
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.hash}
              className={clsx(
                "hover:text-gold font-mono font-bold transition-colors text-white",
                {
                  "text-gold": activeSection === item.name,
                }
              )}
              onClick={() => {
                setActiveSection(item.name);
                setTimeOfLastClick(Date.now());
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-50 justify-around" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-white/10">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 px-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/25">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-gray-800"
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
