import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ADMIN_LOGIN_ROUTE } from "@/config/adminRoutes";

export type AuthResult =
  | { authorized: true; userId: string }
  | { authorized: false; error: string };

/**
 * Verifies the current user is an authenticated admin
 * Use this in server actions to protect admin-only operations
 */
export async function requireAdmin(): Promise<AuthResult> {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return { authorized: false, error: "Not authenticated" };
    }

    if (session.user.role !== "ADMIN") {
      return {
        authorized: false,
        error: "Unauthorized: Admin access required",
      };
    }

    return { authorized: true, userId: session.user.id };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authorized: false, error: "Authentication failed" };
  }
}

/**
 * Sends anyone who is not a signed-in admin to the login page.
 *
 * Call it at the top of an admin page that reads the database itself. The
 * check in the admin layout is not enough for those: Next.js renders a layout
 * and its page at the same time, so the page's data is already in the
 * response (the RSC payload) when the layout redirects.
 */
export async function requireAdminPage(): Promise<void> {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) redirect(ADMIN_LOGIN_ROUTE);
}
