import { prisma } from "@/lib/prisma";

export const getTotalContactsAction = async () => {
  const count = await prisma.contact.count();
  return count;
};
