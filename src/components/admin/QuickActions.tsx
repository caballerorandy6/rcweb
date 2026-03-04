import Link from "next/link";
import type { Route } from "next";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const quickActions = [
  {
    href: "/contacts",
    title: "View Contacts",
    description: "Manage all contacts",
    iconColor: "text-gray-400",
  },
  {
    href: "/newsletter",
    title: "Send Newsletter",
    description: "Email campaign",
    iconColor: "text-gray-400",
  },
  {
    href: "/sms",
    title: "Send SMS",
    description: "SMS campaign",
    iconColor: "text-gray-400",
  },
  {
    href: "/projects",
    title: "View Projects",
    description: "Manage all projects",
    iconColor: "text-gray-400",
  },
  {
    href: "/manage-invoices",
    title: "Manage Invoices",
    description: "View all invoices",
    iconColor: "text-gray-400",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 font-iceland">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href as Route}
            className="flex items-center justify-between p-3 sm:p-4 bg-gray-700/40 hover:bg-gray-700/60 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-600"
          >
            <div className="min-w-0 flex-1">
              <p className="text-white font-medium font-inter text-sm sm:text-base truncate">
                {action.title}
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-inter truncate">
                {action.description}
              </p>
            </div>
            <ArrowRightIcon
              className={`w-4 h-4 sm:w-5 sm:h-5 ${action.iconColor} group-hover:text-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
