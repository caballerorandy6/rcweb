"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import {
  checkAndReserveEmailQuota,
  releaseEmailQuota,
  canSendTodayForCampaign,
  getCurrentQuota,
} from "@/lib/emailQuota";

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface BatchNewsletterResponse {
  success: boolean;
  message: string;
  campaignId?: string;
  sentCount?: number;
  totalEmails?: number;
  status?: string;
  failedCount?: number;
}

/**
 * Check if there's already a campaign being sent (lock mechanism)
 */
async function checkCampaignLock(): Promise<{ isLocked: boolean; message?: string }> {
  const activeCampaign = await prisma.emailCampaign.findFirst({
    where: {
      status: "sending",
      lastBatchSentAt: {
        gte: new Date(Date.now() - 10 * 60 * 1000), // Last 10 minutes
      },
    },
  });

  if (activeCampaign) {
    return {
      isLocked: true,
      message: "Another campaign is currently being sent. Please wait a few minutes and try again.",
    };
  }

  return { isLocked: false };
}

/**
 * Creates a new campaign and sends the first batch (up to available quota)
 */
export const createAndSendBatchCampaign = async (
  subject: string,
  htmlContent: string,
  testMode = false
): Promise<BatchNewsletterResponse> => {
  try {
    // Check campaign lock
    const lockCheck = await checkCampaignLock();
    if (lockCheck.isLocked) {
      return {
        success: false,
        message: lockCheck.message!,
      };
    }

    // Get all eligible contacts with emails
    const contactsWithEmail = await prisma.contact.findMany({
      where: {
        marketingConsent: true,
        emails: {
          some: {},
        },
      },
      select: {
        name: true,
        emails: {
          select: {
            email: true,
          },
        },
      },
    });

    if (contactsWithEmail.length === 0) {
      return {
        success: false,
        message: "No eligible contacts found to send.",
      };
    }

    // Create list of all emails to send
    const allEmailsToSend = contactsWithEmail.flatMap((contact) =>
      contact.emails.map((email) => ({
        from: "RC Web <no-reply@rcweb.dev>",
        to: email.email,
        subject: subject.replace(/{{name}}/g, contact.name),
        html: htmlContent.replace(/{{name}}/g, contact.name),
        contactName: contact.name,
      }))
    );

    if (allEmailsToSend.length === 0) {
      return { success: false, message: "No valid emails to send." };
    }

    // Test mode: send only one email (doesn't count against quota)
    if (testMode) {
      const testEmail = allEmailsToSend[0];
      const { error } = await resend.emails.send({
        from: testEmail.from,
        to: testEmail.to,
        subject: `[TEST] ${testEmail.subject}`,
        html: testEmail.html,
      });

      if (error) throw new Error(error.message);

      return {
        success: true,
        message: `Test email sent to ${testEmail.to}`,
        sentCount: 1,
        totalEmails: allEmailsToSend.length,
      };
    }

    // Check current quota
    const currentQuota = await getCurrentQuota();

    if (currentQuota.available === 0) {
      return {
        success: false,
        message: `Daily email limit reached (${currentQuota.used}/${currentQuota.limit}). Please try again tomorrow.`,
      };
    }

    // Determine how many emails we can send
    const emailsToSendNow = Math.min(allEmailsToSend.length, currentQuota.available);

    // Reserve quota
    const quotaReservation = await checkAndReserveEmailQuota(emailsToSendNow);

    if (!quotaReservation.canSend) {
      return {
        success: false,
        message: quotaReservation.message || "Unable to reserve email quota.",
      };
    }

    // Create campaign in database
    let campaign;
    try {
      campaign = await prisma.emailCampaign.create({
        data: {
          name: subject,
          subject: subject,
          htmlContent: htmlContent,
          totalEmails: allEmailsToSend.length,
          emailsSent: 0,
          status: "sending", // Lock the campaign
          sentAt: new Date(),
        },
      });
    } catch (error) {
      // Release quota if campaign creation fails
      await releaseEmailQuota(quotaReservation.reserved);
      throw error;
    }

    // Send first batch
    const firstBatch = allEmailsToSend.slice(0, emailsToSendNow);

    let sendResult;
    try {
      sendResult = await resend.batch.send(
        firstBatch.map(({ from, to, subject, html }) => ({ from, to, subject, html }))
      );
    } catch (error) {
      // Release quota and mark campaign as failed
      await releaseEmailQuota(quotaReservation.reserved);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "failed" },
      });
      throw error;
    }

    const { data, error } = sendResult;

    if (error && !data) {
      // Complete failure - release quota and mark as failed
      await releaseEmailQuota(quotaReservation.reserved);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "failed" },
      });
      throw new Error(error.message);
    }

    // Process individual results
    const results = data?.data?.map((response, index) => ({
      email: firstBatch[index],
      success: !!response.id,
      resendId: response.id || null,
    })) || [];

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    // If all failed, release quota
    if (successCount === 0) {
      await releaseEmailQuota(quotaReservation.reserved);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "failed" },
      });
      return {
        success: false,
        message: "The campaign was processed, but no emails could be sent.",
      };
    }

    // Release quota for failed emails
    if (failedCount > 0) {
      await releaseEmailQuota(failedCount);
    }

    // Save individual email logs
    await prisma.campaignEmailLog.createMany({
      data: results.map((result) => ({
        campaignId: campaign.id,
        emailAddress: result.email.to,
        contactName: result.email.contactName,
        resendId: result.resendId,
        status: result.success ? "sent" : "failed",
        errorMessage: result.success ? null : "Failed to send",
      })),
    });

    // Update campaign status
    const newStatus =
      successCount >= allEmailsToSend.length ? "completed" : "in_progress";

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        emailsSent: successCount,
        status: newStatus,
        lastBatchSentAt: new Date(),
        completedAt: newStatus === "completed" ? new Date() : null,
      },
    });

    const remainingEmails = allEmailsToSend.length - successCount;

    if (remainingEmails > 0) {
      return {
        success: true,
        message: `First batch sent! ${successCount} emails sent successfully${failedCount > 0 ? `, ${failedCount} failed` : ""}. ${remainingEmails} emails remaining. Continue tomorrow.`,
        campaignId: campaign.id,
        sentCount: successCount,
        totalEmails: allEmailsToSend.length,
        status: newStatus,
        failedCount,
      };
    }

    return {
      success: true,
      message: `Campaign completed! All ${successCount} emails sent successfully${failedCount > 0 ? ` (${failedCount} failed)` : ""}.`,
      campaignId: campaign.id,
      sentCount: successCount,
      totalEmails: allEmailsToSend.length,
      status: newStatus,
      failedCount,
    };
  } catch (error: unknown) {
    console.error("Error creating batch campaign:", error);
    let message = "An unexpected server error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message: string }).message;
    }
    return {
      success: false,
      message,
    };
  }
};

/**
 * Continue sending emails for an existing campaign
 */
export const continueBatchCampaign = async (
  campaignId: string
): Promise<BatchNewsletterResponse> => {
  try {
    // Check campaign lock
    const lockCheck = await checkCampaignLock();
    if (lockCheck.isLocked) {
      return {
        success: false,
        message: lockCheck.message!,
      };
    }

    // Get campaign details
    const campaign = await prisma.emailCampaign.findUnique({
      where: { id: campaignId },
    });

    if (!campaign) {
      return {
        success: false,
        message: "Campaign not found.",
      };
    }

    if (campaign.status === "completed") {
      return {
        success: false,
        message: "Campaign already completed.",
      };
    }

    // Check if we can send today (based on last sent date)
    const canSendCheck = await canSendTodayForCampaign(campaign.lastBatchSentAt);

    if (!canSendCheck.canSend) {
      return {
        success: false,
        message: canSendCheck.message!,
        campaignId: campaign.id,
        sentCount: campaign.emailsSent,
        totalEmails: campaign.totalEmails,
        status: campaign.status,
      };
    }

    // Get emails already sent for this campaign
    const sentEmailsLog = await prisma.campaignEmailLog.findMany({
      where: {
        campaignId: campaign.id,
        status: "sent",
      },
      select: {
        emailAddress: true,
      },
    });

    const sentEmailAddresses = new Set(sentEmailsLog.map((log) => log.emailAddress));

    // Get all current eligible contacts
    const contactsWithEmail = await prisma.contact.findMany({
      where: {
        marketingConsent: true,
        emails: {
          some: {},
        },
      },
      select: {
        name: true,
        emails: {
          select: {
            email: true,
          },
        },
      },
    });

    // Create list of all current emails
    const allCurrentEmails = contactsWithEmail.flatMap((contact) =>
      contact.emails.map((email) => ({
        from: "RC Web <no-reply@rcweb.dev>",
        to: email.email,
        subject: campaign.subject.replace(/{{name}}/g, contact.name),
        html: campaign.htmlContent.replace(/{{name}}/g, contact.name),
        contactName: contact.name,
      }))
    );

    // Filter out already sent emails
    const remainingEmails = allCurrentEmails.filter(
      (email) => !sentEmailAddresses.has(email.to)
    );

    if (remainingEmails.length === 0) {
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: {
          status: "completed",
          completedAt: new Date(),
        },
      });

      return {
        success: true,
        message: "Campaign already completed. No more emails to send.",
        campaignId: campaign.id,
        sentCount: campaign.emailsSent,
        totalEmails: campaign.totalEmails,
        status: "completed",
      };
    }

    // Check current quota
    const currentQuota = await getCurrentQuota();

    if (currentQuota.available === 0) {
      return {
        success: false,
        message: `Daily email limit reached (${currentQuota.used}/${currentQuota.limit}). Please try again tomorrow.`,
        campaignId: campaign.id,
        sentCount: campaign.emailsSent,
        totalEmails: campaign.totalEmails,
        status: campaign.status,
      };
    }

    // Determine how many we can send
    const emailsToSendNow = Math.min(remainingEmails.length, currentQuota.available);

    // Reserve quota
    const quotaReservation = await checkAndReserveEmailQuota(emailsToSendNow);

    if (!quotaReservation.canSend) {
      return {
        success: false,
        message: quotaReservation.message || "Unable to reserve email quota.",
        campaignId: campaign.id,
        sentCount: campaign.emailsSent,
        totalEmails: campaign.totalEmails,
        status: campaign.status,
      };
    }

    // Mark campaign as sending (lock)
    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { status: "sending" },
    });

    // Send next batch
    const nextBatch = remainingEmails.slice(0, emailsToSendNow);

    let sendResult;
    try {
      sendResult = await resend.batch.send(
        nextBatch.map(({ from, to, subject, html }) => ({ from, to, subject, html }))
      );
    } catch (error) {
      // Release quota and restore status
      await releaseEmailQuota(quotaReservation.reserved);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "in_progress" },
      });
      throw error;
    }

    const { data, error } = sendResult;

    if (error && !data) {
      await releaseEmailQuota(quotaReservation.reserved);
      await prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: "in_progress" },
      });
      throw new Error(error.message);
    }

    // Process individual results
    const results = data?.data?.map((response, index) => ({
      email: nextBatch[index],
      success: !!response.id,
      resendId: response.id || null,
    })) || [];

    const successCount = results.filter((r) => r.success).length;
    const failedCount = results.filter((r) => !r.success).length;

    // If all failed, release quota
    if (successCount === 0) {
      await releaseEmailQuota(quotaReservation.reserved);
      return {
        success: false,
        message: "No emails could be sent in this batch.",
        campaignId: campaign.id,
        sentCount: campaign.emailsSent,
        totalEmails: campaign.totalEmails,
        status: campaign.status,
      };
    }

    // Release quota for failed emails
    if (failedCount > 0) {
      await releaseEmailQuota(failedCount);
    }

    // Save individual email logs
    await prisma.campaignEmailLog.createMany({
      data: results.map((result) => ({
        campaignId: campaign.id,
        emailAddress: result.email.to,
        contactName: result.email.contactName,
        resendId: result.resendId,
        status: result.success ? "sent" : "failed",
        errorMessage: result.success ? null : "Failed to send",
      })),
    });

    // Update campaign
    const totalSent = campaign.emailsSent + successCount;
    const newStatus = remainingEmails.length - successCount <= 0 ? "completed" : "in_progress";

    await prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: {
        emailsSent: totalSent,
        status: newStatus,
        lastBatchSentAt: new Date(),
        completedAt: newStatus === "completed" ? new Date() : null,
      },
    });

    const remaining = remainingEmails.length - successCount;

    if (remaining > 0) {
      return {
        success: true,
        message: `Batch sent! ${successCount} emails sent${failedCount > 0 ? `, ${failedCount} failed` : ""}. Progress: ${totalSent}/${campaign.totalEmails}. ${remaining} remaining.`,
        campaignId: campaign.id,
        sentCount: totalSent,
        totalEmails: campaign.totalEmails,
        status: newStatus,
        failedCount,
      };
    }

    return {
      success: true,
      message: `Campaign completed! Total: ${totalSent} emails sent successfully${failedCount > 0 ? ` (${failedCount} failed)` : ""}.`,
      campaignId: campaign.id,
      sentCount: totalSent,
      totalEmails: campaign.totalEmails,
      status: newStatus,
      failedCount,
    };
  } catch (error: unknown) {
    console.error("Error continuing batch campaign:", error);
    let message = "An unexpected server error occurred.";
    if (error && typeof error === "object" && "message" in error) {
      message = (error as { message: string }).message;
    }
    return {
      success: false,
      message,
    };
  }
};

/**
 * Get all campaigns with their status
 */
export const getAllCampaigns = async () => {
  try {
    const campaigns = await prisma.emailCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      campaigns,
    };
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return {
      success: false,
      campaigns: [],
    };
  }
};

/**
 * Get current quota status
 */
export const getQuotaStatus = async () => {
  try {
    const quota = await getCurrentQuota();
    return {
      success: true,
      quota,
    };
  } catch (error) {
    console.error("Error fetching quota:", error);
    return {
      success: false,
      quota: null,
    };
  }
};
