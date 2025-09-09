import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/app/components/SignOutButton";
import { getTotalContactsAction } from "@/actions/getTotalContactsAction";
import { getMarketingConsentAction } from "@/actions/getMarketingConsentAction";

export default async function AdminDashboard() {
  const totalContacts = await getTotalContactsAction();
  const totalMarketingConsent = await getMarketingConsentAction();

  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="pt-24 lg:pt-32">
      {/* Header */}
      <header className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gold font-iceland">
                RC Web Admin
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300 font-inter">
                Welcome, {session.user.name}
              </span>
            </div>

            <SignOutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter">
                  Total Contacts
                </p>
                <p className="text-3xl font-bold text-white mt-1 font-inter">
                  {totalContacts}
                </p>
              </div>
              <div className="text-gold">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter">
                  Marketing Consent
                </p>
                <p className="text-3xl font-bold text-green-400 mt-1 font-inter">
                  {totalMarketingConsent}
                </p>
              </div>
              <div className="text-green-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter">Emails Sent</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">0</p>
              </div>
              <div className="text-blue-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-inter">SMS Sent</p>
                <p className="text-3xl font-bold text-purple-400 mt-1">0</p>
              </div>
              <div className="text-purple-400">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 mb-8">
          <h2 className="text-xl font-bold text-white mb-4 font-iceland">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/contacts"
              className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
            >
              <div>
                <p className="text-white font-medium font-inter">
                  View Contacts
                </p>
                <p className="text-gray-400 text-sm">Manage all contacts</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/newsletter"
              className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
            >
              <div>
                <p className="text-white font-medium font-inter">
                  Send Newsletter
                </p>
                <p className="text-gray-400 text-sm">Email campaign</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            <Link
              href="/sms"
              className="flex items-center justify-between p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-colors group"
            >
              <div>
                <p className="text-white font-medium font-inter">Send SMS</p>
                <p className="text-gray-400 text-sm">SMS campaign</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h2 className="text-xl font-bold text-white mb-4 font-iceland">
            Session Information
          </h2>
          <div className="space-y-2 font-inter">
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Username:</span>
              <span className="text-white">{session.user.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Email:</span>
              <span className="text-white">{session.user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700/50">
              <span className="text-gray-400">Role:</span>
              <span className="text-gold uppercase">{session.user.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Session ID:</span>
              <span className="text-gray-500 text-sm">
                {session.user.id.substring(0, 8)}...
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
