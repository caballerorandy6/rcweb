import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";

/**
 * Called by the Stripe webhook once the deposit of a quoted project is paid:
 * marks the quote accepted, links it to the Project and ties the project to
 * the quote's lead (WON). Idempotent and never throws: the payment is
 * already recorded and must not be retried because of bookkeeping.
 */
export async function markQuoteAccepted(
  quoteId: string,
  projectId: string
): Promise<boolean> {
  try {
    return await prisma.$transaction(async (tx) => {
      const quote = await tx.quote.findUnique({
        where: { id: quoteId },
        select: { status: true, projectId: true, contactId: true, acceptedAt: true },
      });

      if (!quote) {
        Sentry.captureMessage("Checkout metadata names a quote that does not exist", {
          level: "warning",
          tags: { feature: "quotes" },
          extra: { quoteId, projectId },
        });
        return false;
      }

      // Retry of the same event: nothing left to do
      if (quote.projectId === projectId) return false;

      if (quote.projectId) {
        // The customer paid the same quote twice from two Checkout Sessions
        Sentry.captureMessage("Quote already belongs to another project", {
          level: "error",
          tags: { feature: "quotes" },
          extra: { quoteId, projectId, existingProjectId: quote.projectId },
        });
        return false;
      }

      await tx.quote.update({
        where: { id: quoteId },
        data: {
          status: "accepted",
          acceptedAt: quote.acceptedAt ?? new Date(),
          projectId,
        },
      });

      if (quote.contactId) {
        // linkProjectToContact() may already have matched the lead by email;
        // the quote's lead only fills the gap
        const project = await tx.project.findUniqueOrThrow({
          where: { id: projectId },
          select: { contactId: true },
        });
        if (!project.contactId) {
          await tx.project.update({
            where: { id: projectId },
            data: { contactId: quote.contactId },
          });
        }
        await tx.contact.update({
          where: { id: quote.contactId },
          data: { leadStatus: "WON" },
        });
      }

      return true;
    });
  } catch (error) {
    console.error("Error marking quote as accepted:", error);
    Sentry.captureException(error, {
      tags: { feature: "quotes" },
      extra: { quoteId, projectId },
    });
    return false;
  }
}
