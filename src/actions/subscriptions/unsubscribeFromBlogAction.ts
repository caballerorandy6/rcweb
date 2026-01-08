"use server";

import { prisma } from "@/lib/prisma";
import type { ActionResultSimple } from "@/types/common";
import { sendBlogUnsubscribeEmail } from "@/lib/email/senders/sendBlogUnsubscribeEmail";

export const unsubscribeFromBlogAction = async (
  email: string
): Promise<ActionResultSimple> => {
  if (!email || !email.includes("@")) {
    return {
      success: false,
      error: "Invalid email address",
    };
  }

  try {
    const subscriber = await prisma.blogSubscriber.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!subscriber) {
      return {
        success: false,
        error: "Email not found in our blog subscribers list.",
      };
    }

    if (!subscriber.isActive) {
      return {
        success: false,
        error: "This email is already unsubscribed from the blog.",
      };
    }

    // Update subscription status
    await prisma.blogSubscriber.update({
      where: { email: email.toLowerCase() },
      data: {
        isActive: false,
        unsubscribedAt: new Date(),
      },
    });

    // Send confirmation email
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";
    const resubscribeUrl = `${baseUrl}/blog#newsletter`;
    const emailResult = await sendBlogUnsubscribeEmail({
      customerEmail: email.toLowerCase(),
      resubscribeUrl,
    });

    if (!emailResult.success) {
      // Log error but don't fail the unsubscribe operation
      console.error(
        "⚠️ Failed to send unsubscribe confirmation email:",
        emailResult.error
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error unsubscribing from blog:", error);
    return {
      success: false,
      error: "Failed to unsubscribe from blog. Please try again.",
    };
  }
};

