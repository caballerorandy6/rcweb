import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/generated/prisma/client";

/**
 * Links a Project to the Contact that shares its email (revenue attribution)
 * and marks that lead as WON. Safe to call more than once: a project that is
 * already linked is left alone. Never throws: attribution must not break the
 * payment flow that calls it.
 */
export async function linkProjectToContact(
  project: Pick<Project, "id" | "email" | "contactId">
): Promise<boolean> {
  try {
    if (project.contactId) return false;

    // Contact emails were stored as typed in the form; the project email is
    // lowercased, so compare without case
    const contactEmail = await prisma.contactEmail.findFirst({
      where: { email: { equals: project.email, mode: "insensitive" } },
      select: { contactId: true },
    });

    if (!contactEmail) return false;

    await prisma.$transaction([
      prisma.project.update({
        where: { id: project.id },
        data: { contactId: contactEmail.contactId },
      }),
      prisma.contact.update({
        where: { id: contactEmail.contactId },
        data: { leadStatus: "WON" },
      }),
    ]);

    return true;
  } catch (error) {
    console.error("Error linking project to contact:", error);
    Sentry.captureException(error, {
      tags: { feature: "revenue-attribution" },
      extra: { projectId: project.id },
    });
    return false;
  }
}
