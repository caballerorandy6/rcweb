"use server";

import { prisma } from "@/lib/prisma";

const DAILY_LIMIT = 100; // Resend free plan limit

/**
 * Get today's date in UTC (YYYY-MM-DD format for consistent daily tracking)
 */
function getTodayUTC(): Date {
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return todayUTC;
}

/**
 * Get current quota usage for today
 */
export async function getCurrentQuota(): Promise<{
  date: Date;
  used: number;
  available: number;
  limit: number;
}> {
  const today = getTodayUTC();

  const quota = await prisma.dailyEmailQuota.findUnique({
    where: { date: today },
  });

  const used = quota?.emailsSent ?? 0;
  const available = DAILY_LIMIT - used;

  return {
    date: today,
    used,
    available: Math.max(0, available),
    limit: DAILY_LIMIT,
  };
}

/**
 * Check if we can send the requested number of emails
 * If yes, reserve the quota (increment the counter)
 */
export async function checkAndReserveEmailQuota(
  emailCount: number
): Promise<{
  canSend: boolean;
  available: number;
  reserved: number;
  message?: string;
}> {
  if (emailCount <= 0) {
    return {
      canSend: false,
      available: 0,
      reserved: 0,
      message: "Email count must be greater than 0",
    };
  }

  const today = getTodayUTC();

  // Use upsert with transaction to prevent race conditions
  const result = await prisma.$transaction(async (tx) => {
    // Get or create today's quota
    const quota = await tx.dailyEmailQuota.upsert({
      where: { date: today },
      create: {
        date: today,
        emailsSent: 0,
      },
      update: {},
    });

    const available = DAILY_LIMIT - quota.emailsSent;

    // Check if we have enough quota
    if (available < emailCount) {
      return {
        canSend: false,
        available: Math.max(0, available),
        reserved: 0,
        message: `Daily limit reached. Only ${Math.max(0, available)} of ${DAILY_LIMIT} emails available today. Resets at midnight UTC.`,
      };
    }

    // Reserve the quota by incrementing
    await tx.dailyEmailQuota.update({
      where: { date: today },
      data: {
        emailsSent: {
          increment: emailCount,
        },
      },
    });

    return {
      canSend: true,
      available: available - emailCount,
      reserved: emailCount,
    };
  });

  return result;
}

/**
 * Release reserved quota if sending fails
 * (rollback the reservation)
 */
export async function releaseEmailQuota(emailCount: number): Promise<void> {
  if (emailCount <= 0) return;

  const today = getTodayUTC();

  await prisma.dailyEmailQuota.updateMany({
    where: {
      date: today,
      emailsSent: {
        gte: emailCount, // Only decrement if we have enough
      },
    },
    data: {
      emailsSent: {
        decrement: emailCount,
      },
    },
  });
}

/**
 * Get time until next reset (midnight UTC)
 */
export async function getTimeUntilReset(): Promise<{
  hours: number;
  minutes: number;
  resetTime: Date;
}> {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  const diffMs = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return {
    hours,
    minutes,
    resetTime: tomorrow,
  };
}

/**
 * Check if we can send today (based on last sent date, not 24 hours)
 */
export async function canSendTodayForCampaign(lastBatchSentAt: Date | null): Promise<{
  canSend: boolean;
  message?: string;
  hoursUntilReset?: number;
}> {
  if (!lastBatchSentAt) {
    return { canSend: true };
  }

  const today = getTodayUTC();
  const lastSentDate = new Date(
    Date.UTC(
      lastBatchSentAt.getUTCFullYear(),
      lastBatchSentAt.getUTCMonth(),
      lastBatchSentAt.getUTCDate()
    )
  );

  // If last sent was before today (UTC), we can send
  if (lastSentDate < today) {
    return { canSend: true };
  }

  // Last sent was today, need to wait until tomorrow
  const resetInfo = await getTimeUntilReset();

  return {
    canSend: false,
    message: `Campaign already sent today. Please wait until midnight UTC (${resetInfo.hours}h ${resetInfo.minutes}m remaining).`,
    hoursUntilReset: resetInfo.hours,
  };
}
