import { auth } from "@/lib/auth";

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
      return { authorized: false, error: "Unauthorized: Admin access required" };
    }

    return { authorized: true, userId: session.user.id };
  } catch (error) {
    console.error("Auth check failed:", error);
    return { authorized: false, error: "Authentication failed" };
  }
}
