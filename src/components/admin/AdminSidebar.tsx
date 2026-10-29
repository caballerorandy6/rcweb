"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import SignOutButton from "@/components/ui/SignOutButton";
import { ADMIN_ROUTES } from "@/config/adminRoutes";
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
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ArrowTopRightOnSquareIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import {
  UsersIcon as UsersIconSolid,
  FolderIcon as FolderIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  CreditCardIcon as CreditCardIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  ClipboardDocumentListIcon as ClipboardDocumentListIconSolid,
  StarIcon as StarIconSolid,
} from "@heroicons/react/24/solid";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

interface NavItem {
  name: string;
  href: Route;
  icon: IconComponent;
  iconSolid: IconComponent;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

// Grouped by how the work flows: a contact becomes a quote, the quote a
// project, the project its invoices. Marketing reaches the people already
// in the database.
const adminGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: ADMIN_ROUTES.dashboard,
        icon: Squares2X2Icon,
        iconSolid: Squares2X2IconSolid,
      },
    ],
  },
  {
    title: "Sales",
    items: [
      {
        name: "Contacts",
        href: ADMIN_ROUTES.contacts,
        icon: UsersIcon,
        iconSolid: UsersIconSolid,
      },
      {
        name: "Quotes",
        href: ADMIN_ROUTES.quotes,
        icon: ClipboardDocumentListIcon,
        iconSolid: ClipboardDocumentListIconSolid,
      },
      {
        name: "Projects",
        href: ADMIN_ROUTES.projects,
        icon: FolderIcon,
        iconSolid: FolderIconSolid,
      },
      {
        name: "Invoices",
        href: ADMIN_ROUTES.invoices,
        icon: DocumentTextIcon,
        iconSolid: DocumentTextIconSolid,
      },
      {
        name: "Subscriptions",
        href: ADMIN_ROUTES.subscriptions,
        icon: CreditCardIcon,
        iconSolid: CreditCardIconSolid,
      },
    ],
  },
  {
    title: "Marketing",
    items: [
      {
        name: "Newsletter",
        href: ADMIN_ROUTES.newsletter,
        icon: EnvelopeIcon,
        iconSolid: EnvelopeIconSolid,
      },
      {
        name: "SMS",
        href: ADMIN_ROUTES.sms,
        icon: ChatBubbleLeftRightIcon,
        iconSolid: ChatBubbleLeftRightIconSolid,
      },
      {
        name: "Reviews",
        href: ADMIN_ROUTES.reviews,
        icon: StarIcon,
        iconSolid: StarIconSolid,
      },
    ],
  },
];

// Shortcuts to the public site, collapsed by default
const publicLinks: { name: string; href: Route; icon: IconComponent }[] = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Services", href: "/#services", icon: WrenchScrewdriverIcon },
  { name: "Projects", href: "/#projects", icon: FolderIcon },
  { name: "Pricing", href: "/#pricing", icon: CurrencyDollarIcon },
  { name: "Blog", href: "/blog", icon: NewspaperIcon },
  { name: "Contact", href: "/#contact", icon: PhoneIcon },
];

const SIDEBAR_ID = "admin-sidebar";

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const closeSidebar = () => setSidebarOpen(false);

  const isActive = (href: Route) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile top bar (3rem, matched by the layout's padding) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-gray-900/95 backdrop-blur-xs border-b border-gray-800">
        <div className="flex h-full items-center justify-between px-4">
          <Link
            href={ADMIN_ROUTES.dashboard}
            className="text-xl text-gold font-iceland"
          >
            RC Web Admin
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen((open) => !open)}
            className="inline-flex items-center justify-center p-2.5 -m-2.5 rounded-md text-white/80 hover:text-gold transition-colors"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            aria-expanded={sidebarOpen}
            aria-controls={SIDEBAR_ID}
          >
            {sidebarOpen ? (
              <XMarkIcon className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Bars3Icon className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {sidebarOpen ? (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      ) : null}

      {/* Desktop: fixed full-height column on the left. Mobile: drawer from the right. */}
      <aside
        id={SIDEBAR_ID}
        aria-label="Admin"
        className={`fixed w-64 bg-gray-900 z-50 transform transition-transform motion-reduce:transition-none duration-300 ease-in-out
          top-12 h-[calc(100vh-3rem)] right-0 border-l border-gray-800
          lg:top-0 lg:h-screen lg:left-0 lg:right-auto lg:border-l-0 lg:border-r lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand (desktop only; the mobile top bar already shows it) */}
          <div className="hidden lg:flex items-center px-5 h-16 border-b border-gray-800">
            <Link
              href={ADMIN_ROUTES.dashboard}
              className="text-xl text-gold font-iceland hover:text-gold/80 transition-colors"
            >
              RC Web Admin
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin">
            {adminGroups.map((group) => (
              <div key={group.title} className="mb-5">
                <h3 className="px-3 mb-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const active = isActive(item.href);
                    const Icon = active ? item.iconSolid : item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={closeSidebar}
                          aria-current={active ? "page" : undefined}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-inter text-sm transition-colors duration-200 ${
                            active
                              ? "bg-gold/10 text-gold border border-gold/20"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="border-t border-gray-800 my-4" />

            {/* Public site shortcuts */}
            <details className="group">
              <summary className="flex items-center justify-between px-3 py-2 cursor-pointer list-none text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-inter hover:text-gray-400 transition-colors">
                <span>Public site</span>
                <ChevronDownIcon className="w-3 h-3 transition-transform motion-reduce:transition-none group-open:rotate-180" aria-hidden="true" />
              </summary>
              <ul className="space-y-1 mt-2">
                {publicLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeSidebar}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg font-inter text-sm text-gray-400 hover:bg-gray-800 hover:text-gold transition-colors duration-200"
                      >
                        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="flex-1">{item.name}</span>
                        <ArrowTopRightOnSquareIcon className="h-3 w-3 text-gray-600" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          </nav>

          <div className="px-3 py-4 border-t border-gray-800 space-y-3">
            <SignOutButton />
            <p className="text-[10px] text-gray-600 text-center font-inter">
              © {new Date().getFullYear()} RC Web Solutions LLC
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
