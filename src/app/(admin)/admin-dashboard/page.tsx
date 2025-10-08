import { Suspense } from "react";
import AdminDashboard from "@/app/components/AdminDashboard";
import AdminDashboardSkeleton from "@/app/components/AdminDashboardSkeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for RC Web Solutions LLC management panel.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminDashboardPage() {
  return (
    <section id="admin-dashboard" className="min-h-screen">
      <Suspense fallback={<AdminDashboardSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
}
