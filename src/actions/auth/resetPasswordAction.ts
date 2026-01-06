"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ResetPasswordSchema, type ResetPasswordData } from "@/lib/zod";

export interface ResetPasswordResult {
  success: boolean;
  error?: string;
  clientId?: string;
}

/**
 * Reset password for a client using resetToken
 * This is used when a client already has a password and wants to change it
 */
export async function resetPasswordAction(
  data: ResetPasswordData
): Promise<ResetPasswordResult> {
  try {
    // Validate input
    const validated = ResetPasswordSchema.parse(data);

    // Find client by resetToken
    const client = await prisma.client.findFirst({
      where: {
        resetToken: validated.token,
        resetTokenExpiry: {
          gte: new Date(), // Token must not be expired
        },
      },
    });

    if (!client) {
      return {
        success: false,
        error: "Invalid or expired token. Please request a new reset link.",
      };
    }

    // Client must have a password (this is for reset, not initial setup)
    if (!client.password) {
      return {
        success: false,
        error: "Please use the setup password link instead.",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Update client with new password and clear reset token
    await prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return {
      success: true,
      clientId: client.id,
    };
  } catch (error) {
    console.error("Error resetting password:", error);

    if (error instanceof Error && error.message.includes("Token")) {
      return {
        success: false,
        error: "Invalid or expired token. Please request a new reset link.",
      };
    }

    return {
      success: false,
      error: "Failed to reset password. Please try again.",
    };
  }
}

