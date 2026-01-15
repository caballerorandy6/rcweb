import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getTotalContactsAction = cache(async () => {
  const count = await prisma.contact.count();
  return count;
});
