"use server";

import { prisma } from "@/lib/prisma";
import {
  UpdateClientProfileSchema,
  type UpdateClientProfileData,
} from "@/lib/zod";
import { auth } from "@/lib/auth";
import { ActionResult } from "@/types/common";

/**
 * Update client profile information (name, email, phone)
 */
export async function updateClientProfileAction(
  data: UpdateClientProfileData
): Promise<
  ActionResult<{ name: string; email: string; phone: string | null }>
> {
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
    const validated = UpdateClientProfileSchema.parse(data);

    // Check if email is already taken by another client
    if (validated.email !== session.user.email) {
      const existingClient = await prisma.client.findUnique({
        where: { email: validated.email },
      });

      if (existingClient && existingClient.id !== session.user.id) {
        return {
          success: false,
          error: "Email is already in use by another account",
        };
      }
    }

    // Update client profile
    const updatedClient = await prisma.client.update({
      where: { id: session.user.id },
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
      },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    return {
      success: true,
      data: updatedClient,
    };
  } catch (error) {
    console.error("Error updating client profile:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update profile. Please try again.",
    };
  }
}
