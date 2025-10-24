import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/app/components/admin/AdminSidebar";
import SignOutButton from "@/app/components/ui/SignOutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Verificar autenticación y rol de admin
  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content wrapper */}
      <div className="lg:pl-64">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 font-inter text-sm sm:text-base">
                  Welcome, <span className="text-gold">{session.user.name}</span>
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
