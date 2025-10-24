"use server";

import { signOut } from "@/lib/auth";

export const signOutAction = async () => {
  await signOut({ redirectTo: "/login" });
};
