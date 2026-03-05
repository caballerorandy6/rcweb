"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import SignOutButton from "@/components/ui/SignOutButton";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CreditCardIcon,
  Bars3Icon,
  XMarkIcon,
  WrenchScrewdriverIcon,
  CurrencyDollarIcon,
  PhoneIcon,
  NewspaperIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  FolderIcon as FolderIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  PhoneIcon as PhoneIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  name: string;
  href: Route;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  external?: boolean;
}

// Public site navigation (links to main website sections)
const publicNavigation: NavItem[] = [
  {
    name: "Home",
    href: "/" as Route,
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
    external: true,
  },
  {
    name: "Services",
    href: "/#services" as Route,
    icon: WrenchScrewdriverIcon,
    iconSolid: WrenchScrewdriverIconSolid,
    external: true,
  },
  {
    name: "Projects",
    href: "/#projects" as Route,
    icon: FolderIcon,
    iconSolid: FolderIconSolid,
    external: true,
  },
  {
    name: "Pricing",
    href: "/#pricing" as Route,
    icon: CurrencyDollarIcon,
    iconSolid: CurrencyDollarIconSolid,
    external: true,
  },
  {
    name: "Blog",
    href: "/blog" as Route,
    icon: NewspaperIcon,
    iconSolid: NewspaperIconSolid,
    external: true,
  },
  {
    name: "Contact",
    href: "/#contact" as Route,
    icon: PhoneIcon,
    iconSolid: PhoneIconSolid,
    external: true,
  },
];

// Admin navigation
const adminNavigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin-dashboard",
    icon: Squares2X2Icon,
    iconSolid: Squares2X2IconSolid,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderIcon,
    iconSolid: FolderIconSolid,
  },
  {
    name: "Invoices",
    href: "/manage-invoices",
    icon: DocumentTextIcon,
    iconSolid: DocumentTextIconSolid,
  },
  {
    name: "Subscriptions",
    href: "/subscriptions" as Route,
    icon: CreditCardIcon,
    iconSolid: CreditCardIconSolid,
  },
  {
    name: "Contacts",
    href: "/contacts",
    icon: UsersIcon,
    iconSolid: UsersIconSolid,
  },
  {
    name: "Newsletter",
    href: "/newsletter",
    icon: EnvelopeIcon,
    iconSolid: EnvelopeIconSolid,
  },
  {
    name: "SMS Campaign",
    href: "/sms",
    icon: ChatBubbleLeftRightIcon,
    iconSolid: ChatBubbleLeftRightIconSolid,
  },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: Route) => pathname === href;

  return (
    <>
      {/* Mobile Header - fixed at very top */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center justify-between px-4 py-3">
          <Link
            href="/admin-dashboard"
            className="text-xl font-bold text-gold font-iceland"
          >
            RC Web Admin
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="inline-flex items-center justify-center rounded-md text-white/80 hover:text-gold transition-colors"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed left, Mobile: drawer from right */}
      <aside
        className={`fixed w-64 bg-gray-900 z-50 transform transition-transform duration-300 ease-in-out
          top-[48px] h-[calc(100vh-48px)] right-0 border-l border-gray-800
          lg:top-[72px] lg:h-[calc(100vh-72px)] lg:left-0 lg:right-auto lg:border-l-0 lg:border-r lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header with close button */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800 bg-gray-900">
            <Link
              href="/admin-dashboard"
              className="text-xl font-bold text-gold font-iceland hover:text-gold/80 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              RC Web Admin
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {/* Admin Section - Primary */}
            <div className="mb-4">
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter">
                Admin Panel
              </h3>
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const Icon = isActive(item.href) ? item.iconSolid : item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm transition-all duration-200 ${
                        isActive(item.href)
                          ? "bg-gold/10 text-gold border border-gold/20"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-800 my-4" />

            {/* Public Site Section - Collapsible */}
            <details className="group">
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter hover:text-gray-400 transition-colors">
                <span>Public Site</span>
                <svg
                  className="w-3 h-3 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="space-y-1 mt-2">
                {publicNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg font-inter text-sm text-gray-400 hover:bg-gray-800 hover:text-gold transition-all duration-200"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </details>
          </nav>

          {/* Footer */}
          <div className="px-3 py-4 border-t border-gray-800 space-y-3 bg-gray-900">
            <SignOutButton />
            <div className="text-[10px] text-gray-600 text-center font-inter">
              © 2025 RC Web Solutions LLC
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
