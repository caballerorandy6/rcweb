import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verificar autenticación y rol de admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 pt-[72px]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content wrapper */}
      <div className="lg:pl-64 min-h-[calc(100vh-72px)]">
        {/* Page content - extra padding on mobile for hamburger */}
        <main className="p-4 pt-16 sm:p-6 sm:pt-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
