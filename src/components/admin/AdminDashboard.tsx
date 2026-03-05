import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StatsGrid from "@/components/admin/StatsGrid";
import StatsGridSkeleton from "@/components/skeletons/StatsGridSkeleton";
import QuickActions from "@/components/admin/QuickActions";
import LeadsBySource from "@/components/admin/LeadsBySource";
import LeadsBySourceSkeleton from "@/components/skeletons/LeadsBySourceSkeleton";
import LeadsTrendChartWrapper from "@/components/admin/LeadsTrendChartWrapper";
import LeadsTrendChartSkeleton from "@/components/skeletons/LeadsTrendChartSkeleton";
import LeadsByUTM from "@/components/admin/LeadsByUTM";
import LeadsByUTMSkeleton from "@/components/skeletons/LeadsByUTMSkeleton";
import RevenueAttribution from "@/components/admin/RevenueAttribution";
import RevenueAttributionSkeleton from "@/components/skeletons/RevenueAttributionSkeleton";

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

      {/* Lead Trends Chart */}
      <Suspense fallback={<LeadsTrendChartSkeleton />}>
        <LeadsTrendChartWrapper />
      </Suspense>

      {/* Leads by Source */}
      <Suspense fallback={<LeadsBySourceSkeleton />}>
        <LeadsBySource />
      </Suspense>

      {/* UTM Tracking */}
      <Suspense fallback={<LeadsByUTMSkeleton />}>
        <LeadsByUTM />
      </Suspense>

      {/* Revenue Attribution */}
      <Suspense fallback={<RevenueAttributionSkeleton />}>
        <RevenueAttribution />
      </Suspense>
    </div>
  );
}
