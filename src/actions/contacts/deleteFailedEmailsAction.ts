"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types/common";
import { requireAdmin } from "@/lib/authGuard";

type DeleteResult = {
  deletedCount: number;
  cleanedContactsCount: number;
};

export async function deleteFailedEmailsAction(
  emailAddresses: string[]
): Promise<ActionResult<DeleteResult>> {
  try {
    const authCheck = await requireAdmin();
    if (!authCheck.authorized) {
      return { success: false, error: authCheck.error };
    }

    if (emailAddresses.length === 0) {
      return {
        success: false,
        error: "No email addresses provided",
      };
    }

    // Normalize email addresses to lowercase
    const normalizedEmails = emailAddresses.map((email) =>
      email.toLowerCase().trim()
    );

    // Get all ContactEmail records that match
    const contactEmailsToDelete = await prisma.contactEmail.findMany({
      where: {
        email: {
          in: normalizedEmails,
        },
      },
      select: {
        id: true,
        email: true,
        contactId: true,
      },
    });

    // Delete ContactEmail records
    const result = await prisma.contactEmail.deleteMany({
      where: {
        id: {
          in: contactEmailsToDelete.map((ce) => ce.id),
        },
      },
    });

    // Clean up contacts without any emails or phones
    const contactsWithoutEmailsOrPhones = await prisma.contact.findMany({
      where: {
        AND: [
          {
            emails: {
              none: {},
            },
          },
          {
            phones: {
              none: {},
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (contactsWithoutEmailsOrPhones.length > 0) {
      await prisma.contact.deleteMany({
        where: {
          id: {
            in: contactsWithoutEmailsOrPhones.map((c) => c.id),
          },
        },
      });
    }

    return {
      success: true,
      data: {
        deletedCount: result.count,
        cleanedContactsCount: contactsWithoutEmailsOrPhones.length,
      },
    };
  } catch (error) {
    console.error("Error deleting failed emails:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      error: errorObj?.message || "Failed to delete email addresses",
    };
  }
}

/**
 * Delete emails that have failed status in campaign logs
 */
export async function deleteFailedEmailsFromCampaignsAction(): Promise<
  ActionResult<DeleteResult>
> {
  try {
    // Get all emails with failed, bounced, or undelivered status from campaign logs
    const failedEmailLogs = await prisma.campaignEmailLog.findMany({
      where: {
        status: {
          in: ["failed", "bounced", "undelivered"],
        },
      },
      select: {
        emailAddress: true,
        status: true,
      },
      distinct: ["emailAddress"],
    });

    if (failedEmailLogs.length === 0) {
      return {
        success: true,
        data: {
          deletedCount: 0,
          cleanedContactsCount: 0,
        },
      };
    }

    // Extract email addresses
    const emailAddresses = failedEmailLogs.map((log) => log.emailAddress);

    // Use the existing deleteFailedEmailsAction to delete them
    const result = await deleteFailedEmailsAction(emailAddresses);

    return result;
  } catch (error) {
    console.error("Error deleting failed emails from campaigns:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      error: errorObj?.message || "Failed to delete emails from campaign logs",
    };
  }
}
