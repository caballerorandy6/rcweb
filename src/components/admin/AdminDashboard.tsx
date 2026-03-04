import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatsGrid from "@/components/admin/StatsGrid";
import StatsGridSkeleton from "@/components/skeletons/StatsGridSkeleton";
import QuickActions from "@/components/admin/QuickActions";
import LeadsBySource from "@/components/admin/LeadsBySource";
import LeadsBySourceSkeleton from "@/components/skeletons/LeadsBySourceSkeleton";

export default async function AdminDashboard() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gold font-iceland">
            Dashboard
          </h1>
          <p className="text-gray-400 font-inter text-sm sm:text-base mt-1">
            Overview of your admin panel
          </p>
        </div>
        <p className="text-xs text-gray-500 font-inter">
          Logged in as <span className="text-gold">{session.user.name}</span>
        </p>
      </div>

      {/* Stats Grid with Suspense */}
      <Suspense fallback={<StatsGridSkeleton />}>
        <StatsGrid />
      </Suspense>

      {/* Quick Actions */}
      <QuickActions />

      {/* Leads by Source */}
      <Suspense fallback={<LeadsBySourceSkeleton />}>
        <LeadsBySource />
      </Suspense>

      {/* User Info - Collapsible on mobile */}
      <details className="bg-gray-800/80 rounded-xl border border-gray-700/50 group">
        <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer list-none">
          <h2 className="text-lg sm:text-xl font-bold text-white font-iceland">
            Session Information
          </h2>
          <svg
            className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0 font-inter">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">Username</span>
              <span className="text-white text-sm font-medium">{session.user.name}</span>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">Email</span>
              <span className="text-white text-sm font-medium truncate block">{session.user.email}</span>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">Role</span>
              <span className="text-gold text-sm font-medium uppercase">{session.user.role}</span>
            </div>
            <div className="bg-gray-700/30 rounded-lg p-3">
              <span className="text-xs text-gray-500 block mb-1">Session ID</span>
              <span className="text-gray-400 text-sm font-mono">{session.user.id.substring(0, 12)}...</span>
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
