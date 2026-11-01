import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ADMIN_LOGIN_ROUTE } from "@/config/adminRoutes";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect(ADMIN_LOGIN_ROUTE);
  }

  // Mobile: a 3rem top bar (see AdminSidebar). Desktop: the sidebar spans
  // the full height on the left and the content starts at the very top.
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-950 to-gray-900 pt-12 lg:pt-0">
      <AdminSidebar />
      <div className="lg:pl-64 min-h-[calc(100vh-3rem)] lg:min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
