import Link from "next/link";
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
];

export default function QuickActions() {
  return (
    <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
      <h2 className="text-2xl font-bold text-white mb-4 font-iceland">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
          >
            <div>
              <p className="text-white font-medium font-inter">
                {action.title}
              </p>
              <p className="text-gray-400 text-sm font-inter">
                {action.description}
              </p>
            </div>
            <ArrowRightIcon
              className={`w-5 h-5 ${action.iconColor} group-hover:text-gold transition-colors`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
