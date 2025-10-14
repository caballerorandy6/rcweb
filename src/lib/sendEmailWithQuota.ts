"use server";

import { Resend } from "resend";
import { checkAndReserveEmailQuota, releaseEmailQuota } from "./emailQuota";

const resend = new Resend(process.env.RESEND_API_KEY!);

export interface EmailOptions {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send a single email with automatic quota management
 * Returns success even if quota is exceeded (logs warning but doesn't fail the operation)
 */
export async function sendEmailWithQuota(
  options: EmailOptions,
  config?: { failOnQuotaExceeded?: boolean }
): Promise<{ success: boolean; error?: string }> {
  // Check and reserve quota
  const quotaCheck = await checkAndReserveEmailQuota(1);

  if (!quotaCheck.canSend) {
    console.warn(`⚠️ Email quota exceeded: ${quotaCheck.message}`);

    if (config?.failOnQuotaExceeded) {
      return {
        success: false,
        error: quotaCheck.message,
      };
    }

    // Return success but don't send (graceful degradation)
    return { success: true };
  }

  // Send email
  try {
    const { error } = await resend.emails.send(options);

    if (error) {
      // Release quota on failure
      await releaseEmailQuota(1);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    // Release quota on exception
    await releaseEmailQuota(1);
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Send multiple emails with automatic quota management
 * Only sends as many as quota allows
 */
export async function sendMultipleEmailsWithQuota(
  emails: EmailOptions[]
): Promise<{
  success: boolean;
  sentCount: number;
  totalCount: number;
  error?: string;
}> {
  if (emails.length === 0) {
    return { success: true, sentCount: 0, totalCount: 0 };
  }

  // Check and reserve quota for all emails
  const quotaCheck = await checkAndReserveEmailQuota(emails.length);

  if (!quotaCheck.canSend) {
    console.warn(`⚠️ Cannot send ${emails.length} emails: ${quotaCheck.message}`);
    return {
      success: false,
      sentCount: 0,
      totalCount: emails.length,
      error: quotaCheck.message,
    };
  }

  // Send emails
  let successCount = 0;
  let failedCount = 0;

  const results = await Promise.allSettled(
    emails.map((email) => resend.emails.send(email))
  );

  for (const result of results) {
    if (result.status === "fulfilled" && !result.value.error) {
      successCount++;
    } else {
      failedCount++;
    }
  }

  // Release quota for failed emails
  if (failedCount > 0) {
    await releaseEmailQuota(failedCount);
  }

  return {
    success: successCount > 0,
    sentCount: successCount,
    totalCount: emails.length,
    error: failedCount > 0 ? `${failedCount} emails failed to send` : undefined,
  };
}
