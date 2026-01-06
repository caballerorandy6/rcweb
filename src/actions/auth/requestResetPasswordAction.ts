"use server";

import { prisma } from "@/lib/prisma";
import {
  ResetPasswordRequestSchema,
  type ResetPasswordRequestData,
} from "@/lib/zod";
import { sendResetPasswordEmail } from "@/lib/email/senders/sendResetPasswordEmail";
import { siteConfig } from "@/config/site";
import crypto from "crypto";

export interface RequestResetPasswordResult {
  success: boolean;
  error?: string;
}

/**
 * Request password reset for a client
 * Generates a reset token and sends an email with the reset link
 */
export async function requestResetPasswordAction(
  data: ResetPasswordRequestData
): Promise<RequestResetPasswordResult> {
  try {
    // Validate input
    const validated = ResetPasswordRequestSchema.parse(data);

    // Find client by email
    const client = await prisma.client.findUnique({
      where: { email: validated.email },
    });

    // Always return success to prevent email enumeration
    // But only send email if client exists and has a password
    if (!client || !client.password) {
      return {
        success: true,
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour validity

    // Update client with reset token
    await prisma.client.update({
      where: { id: client.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send reset password email
    const resetPasswordUrl = `${siteConfig.baseUrl}/client/reset-password?token=${resetToken}`;

    await sendResetPasswordEmail({
      customerEmail: client.email,
      customerName: client.name,
      resetPasswordUrl,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    return {
      success: true, // Still return success to prevent email enumeration
    };
  }
}
