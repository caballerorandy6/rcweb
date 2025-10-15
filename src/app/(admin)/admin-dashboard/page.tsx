import AdminDashboard from "@/app/components/AdminDashboard";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Admin Dashboard",
  description: "Admin dashboard for RC Web Solutions LLC management panel.",
  pageRoute: "/admin-dashboard",
});

export default function AdminDashboardPage() {
  return (
    <section id="admin-dashboard" className="min-h-screen">
      <AdminDashboard />
    </section>
  );
}
