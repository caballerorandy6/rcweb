"use server";

import { signOut, auth } from "@/lib/auth";

export const signOutAction = async () => {
  const session = await auth();
  // Redirect to appropriate login page based on role
  const redirectTo =
    session?.user?.role === "CLIENT" ? "/client/login" : "/login";
  await signOut({ redirectTo });
};
