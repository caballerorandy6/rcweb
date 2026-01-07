import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatsGrid from "@/app/components/admin/StatsGrid";
import StatsGridSkeleton from "@/app/components/skeletons/StatsGridSkeleton";
import QuickActions from "@/app/components/admin/QuickActions";

export default async function AdminDashboard() {
  const session = await auth();

  // Doble verificación (el middleware ya lo hace, pero por seguridad)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-gold font-iceland">
          Dashboard
        </h1>
        <p className="text-gray-400 font-inter mt-2">
          Overview of your admin panel
        </p>
      </div>

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
    </div>
  );
}
