"use server";

import { prisma } from "@/lib/prisma";

export async function getTotalContactsAction() {
  const count = await prisma.contact.count();
  return count;
}
