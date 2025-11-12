"use server";

import { prisma } from "@/lib/prisma";

export async function deleteFailedEmailsAction(
  emailAddresses: string[]
): Promise<{ success: boolean; message: string; deletedCount?: number }> {
  try {
    if (emailAddresses.length === 0) {
      return {
        success: false,
        message: "No email addresses provided",
      };
    }

    console.log("📥 Received emails to delete:", emailAddresses);

    // Normalize email addresses to lowercase
    const normalizedEmails = emailAddresses.map((email) =>
      email.toLowerCase().trim()
    );
    console.log("🔍 Normalized emails:", normalizedEmails);

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

    console.log("📱 Found matching email IDs:", contactEmailsToDelete.length);

    // Delete ContactEmail records
    const result = await prisma.contactEmail.deleteMany({
      where: {
        id: {
          in: contactEmailsToDelete.map((ce) => ce.id),
        },
      },
    });

    console.log("✅ Deleted count:", result.count);

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
      console.log(
        `🧹 Found ${contactsWithoutEmailsOrPhones.length} contacts without emails or phones`
      );

      await prisma.contact.deleteMany({
        where: {
          id: {
            in: contactsWithoutEmailsOrPhones.map((c) => c.id),
          },
        },
      });

      console.log(
        `✅ Cleaned up ${contactsWithoutEmailsOrPhones.length} empty contacts`
      );
    }

    return {
      success: true,
      message: `Deleted ${result.count} email address(es) and cleaned up ${contactsWithoutEmailsOrPhones.length} empty contacts`,
      deletedCount: result.count,
    };
  } catch (error) {
    console.error("Error deleting failed emails:", error);
    const errorObj = error as { message?: string };
    return {
      success: false,
      message: errorObj?.message || "Failed to delete email addresses",
    };
  }
}

/**
 * Delete emails that have failed status in campaign logs
 */
export async function deleteFailedEmailsFromCampaignsAction(): Promise<{
  success: boolean;
  message: string;
  deletedCount?: number;
}> {
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
        message: "No failed emails found in campaign logs",
        deletedCount: 0,
      };
    }

    console.log(
      `📧 Found ${failedEmailLogs.length} unique failed email addresses in campaign logs`
    );

    // Group by status for reporting
    const statusGroups = failedEmailLogs.reduce(
      (acc, log) => {
        acc[log.status] = (acc[log.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    console.log("Status breakdown:", statusGroups);

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
      message:
        errorObj?.message || "Failed to delete emails from campaign logs",
    };
  }
}
