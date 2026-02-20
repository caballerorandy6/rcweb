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
      {/* Mobile menu button - positioned below public navbar */}
      <div className="lg:hidden fixed top-[84px] left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-gold transition-colors shadow-lg"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-[72px] bg-black/50 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - starts below public navbar */}
      <aside
        className={`fixed top-[72px] left-0 h-[calc(100vh-72px)] w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
            <Link
              href="/admin-dashboard"
              className="text-xl font-bold text-gold font-iceland hover:text-gold/80 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              RC Web Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            {/* Public Site Section */}
            <div className="mb-4">
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter">
                Public Site
              </h3>
              <div className="space-y-0.5">
                {publicNavigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-1.5 rounded-md font-inter text-sm text-gray-400 hover:bg-gray-800/50 hover:text-gold transition-all duration-200"
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700/50 my-3" />

            {/* Admin Section */}
            <div>
              <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter">
                Admin Panel
              </h3>
              <div className="space-y-0.5">
                {adminNavigation.map((item) => {
                  const Icon = isActive(item.href) ? item.iconSolid : item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-md font-inter text-sm transition-all duration-200 ${isActive(item.href) ? "bg-gold/20 text-gold" : "text-gray-300 hover:bg-gray-800/50 hover:text-gold"}`}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="px-3 py-3 border-t border-gray-700/50 space-y-3">
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
