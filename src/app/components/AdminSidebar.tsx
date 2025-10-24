"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import {
  HomeIcon,
  UsersIcon,
  FolderIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  UsersIcon as UsersIconSolid,
  FolderIcon as FolderIconSolid,
  EnvelopeIcon as EnvelopeIconSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid,
  DocumentTextIcon as DocumentTextIconSolid,
  ArrowLeftIcon as ArrowLeftIconSolid,
} from "@heroicons/react/24/solid";

interface NavItem {
  name: string;
  href: Route;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconSolid: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/admin-dashboard",
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
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
  {
    name: "Back to Site",
    href: "/",
    icon: ArrowLeftIcon,
    iconSolid: ArrowLeftIconSolid,
  },
];

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: Route) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 text-gray-300 hover:text-gold transition-colors"
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-40
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <Link
              href="/admin-dashboard"
              className="text-2xl font-bold text-gold font-iceland hover:text-gold/80 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              RC Web Admin
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = isActive(item.href) ? item.iconSolid : item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg font-inter font-medium
                    transition-all duration-200
                    ${
                      isActive(item.href)
                        ? "bg-gold/20 text-gold border border-gold/30"
                        : "text-gray-300 hover:bg-gray-800/50 hover:text-gold border border-transparent"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700/50">
            <div className="text-xs text-gray-500 text-center font-inter">
              © 2025 RC Web Solutions LLC
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
