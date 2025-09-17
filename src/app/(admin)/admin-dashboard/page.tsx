import { Suspense } from "react";
import Spinner from "@/app/components/Spinner";
import AdminDashboard from "@/app/components/AdminDashboard";

const AdminDashboardPage = async () => {
  return (
    <section id="admin-dashboard" className="min-h-screen">
      <Suspense fallback={<Spinner />}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
};

export default AdminDashboardPage;
