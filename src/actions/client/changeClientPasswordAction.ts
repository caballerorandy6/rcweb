"use server";

import { prisma } from "@/lib/prisma";
import { ChangePasswordSchema, type ChangePasswordData } from "@/lib/zod";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { ActionResultSimple } from "@/types/common";

/**
 * Change client password
 */
export async function changeClientPasswordAction(
  data: ChangePasswordData
): Promise<ActionResultSimple> {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user || session.user.role !== "CLIENT") {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Validate input
    const validated = ChangePasswordSchema.parse(data);

    // Get current client with password
    const client = await prisma.client.findUnique({
      where: { id: session.user.id },
      select: {
        password: true,
      },
    });

    if (!client) {
      return {
        success: false,
        error: "Client not found",
      };
    }

    // Verify current password
    if (!client.password) {
      return {
        success: false,
        error: "No password set. Please use the setup password link.",
      };
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      validated.currentPassword,
      client.password
    );

    if (!isCurrentPasswordValid) {
      return {
        success: false,
        error: "Current password is incorrect",
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Update password
    await prisma.client.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      success: true as const,
    };
  } catch (error) {
    console.error("Error changing client password:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to change password. Please try again.",
    };
  }
}
