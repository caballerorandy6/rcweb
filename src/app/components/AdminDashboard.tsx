import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/app/components/SignOutButton";
import StatsGrid from "@/app/components/StatsGrid";
import StatsGridSkeleton from "@/app/components/StatsGridSkeleton";
import QuickActions from "@/app/components/QuickActions";

export default async function AdminDashboard() {
  //const { totalSMSsent } = await getSmsStatsAction();

  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="pt-24 lg:pt-32">
      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-50 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-4xl font-bold text-gold font-iceland">
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
        {/* Stats Grid with Suspense */}
        <Suspense fallback={<StatsGridSkeleton />}>
          <StatsGrid />
        </Suspense>

        {/* Quick Actions */}
        <QuickActions />

        {/* User Info */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <h2 className="text-2xl font-bold text-white mb-4 font-iceland">
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
