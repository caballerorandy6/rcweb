import { Suspense } from "react";
import AdminDashboard from "@/app/components/AdminDashboard";
import AdminDashboardSkeleton from "@/app/components/AdminDashboardSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Admin Dashboard",
  description: "Admin dashboard for RC Web Solutions LLC management panel.",
  pageRoute: "/admin-dashboard",
});

export default function AdminDashboardPage() {
  return (
    <section id="admin-dashboard" className="min-h-screen">
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
}
