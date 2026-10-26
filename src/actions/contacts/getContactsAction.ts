"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";
import type { ContactChannel, LeadStatus } from "@/generated/prisma/enums";

export type ContactWithRelations = {
  id: string;
  name: string;
  marketingConsent: boolean;
  leadStatus: LeadStatus;
  source: string | null;
  serviceInterest: string | null;
  preferredChannel: ContactChannel | null;
  createdAt: Date;
  emails: { id: string; email: string }[];
  phones: { id: string; phone: string }[];
};

/** Every contact, newest first, with the columns the admin list shows */
export async function getContactsAction(): Promise<
  ActionResult<{ contacts: ContactWithRelations[] }>
> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    const contacts = await prisma.contact.findMany({
      select: {
        id: true,
        name: true,
        marketingConsent: true,
        leadStatus: true,
        source: true,
        serviceInterest: true,
        preferredChannel: true,
        createdAt: true,
        emails: { select: { id: true, email: true } },
        phones: { select: { id: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: { contacts } };
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return { success: false, error: "Failed to fetch contacts" };
  }
}
