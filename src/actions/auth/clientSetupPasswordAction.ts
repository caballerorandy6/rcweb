"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SetupPasswordSchema, type SetupPasswordData } from "@/lib/zod";

export interface SetupPasswordResult {
  success: boolean;
  error?: string;
  clientId?: string;
}

/**
 * Set up initial password for a client using setupToken
 * This is used when a client account is created automatically after payment
 */
export async function clientSetupPasswordAction(
  data: SetupPasswordData
): Promise<SetupPasswordResult> {
  try {
    // Validate input
    const validated = SetupPasswordSchema.parse(data);

    // Find client by setupToken
    const client = await prisma.client.findFirst({
      where: {
        setupToken: validated.token,
        setupTokenExpiry: {
          gte: new Date(), // Token must not be expired
        },
      },
    });

    if (!client) {
      return {
        success: false,
        error: "Invalid or expired token. Please request a new setup link.",
      };
    }

    // Check if client already has a password
    if (client.password) {
      return {
        success: false,
        error: "Password has already been set. Please use the login page.",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Update client with password and clear setup token
    await prisma.client.update({
      where: { id: client.id },
      data: {
        password: hashedPassword,
        setupToken: null,
        setupTokenExpiry: null,
        emailVerified: new Date(), // Ensure email is verified
      },
    });

    return {
      success: true,
      clientId: client.id,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error setting up password:", errorMessage);

    if (error instanceof Error && errorMessage.includes("Token")) {
      return {
        success: false,
        error: "Invalid or expired token. Please request a new setup link.",
      };
    }

    return {
      success: false,
      error: "Failed to set up password. Please try again.",
    };
  }
}

