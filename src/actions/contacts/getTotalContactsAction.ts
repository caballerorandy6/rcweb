"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export async function getTotalContactsAction() {
  const authCheck = await requireAdmin();
  if (!authCheck.authorized) {
    throw new Error(authCheck.error);
  }

  const count = await prisma.contact.count();
  return count;
}
