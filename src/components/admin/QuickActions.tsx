import Link from "next/link";
import type { Route } from "next";
import {
  PlusCircleIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  DocumentPlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

const quickActions = [
  {
    href: "/projects?action=new",
    title: "New Project",
    description: "Create a project",
    icon: <PlusCircleIcon className="w-5 h-5" />,
    color: "text-blue-400",
  },
  {
    href: "/contacts?action=new",
    title: "Add Contact",
    description: "New lead entry",
    icon: <UserPlusIcon className="w-5 h-5" />,
    color: "text-green-400",
  },
  {
    href: "/newsletter",
    title: "Send Newsletter",
    description: "Email campaign",
    icon: <EnvelopeIcon className="w-5 h-5" />,
    color: "text-purple-400",
  },
  {
    href: "/sms",
    title: "Send SMS",
    description: "SMS campaign",
    icon: <ChatBubbleLeftRightIcon className="w-5 h-5" />,
    color: "text-cyan-400",
  },
  {
    href: "/manage-invoices",
    title: "View Invoices",
    description: "Manage payments",
    icon: <DocumentPlusIcon className="w-5 h-5" />,
    color: "text-yellow-400",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-gray-800/80 rounded-xl p-4 sm:p-6 border border-gray-700/50">
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 font-iceland">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href as Route}
            className="flex flex-col items-center justify-center p-4 bg-gray-700/40 hover:bg-gray-700/60 rounded-lg transition-all duration-200 group border border-transparent hover:border-gray-600 text-center"
          >
            <span
              className={`${action.color} mb-2 group-hover:scale-110 transition-transform`}
            >
              {action.icon}
            </span>
            <p className="text-white font-medium font-inter text-sm truncate w-full">
              {action.title}
            </p>
            <p className="text-gray-500 text-xs font-inter truncate w-full">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
