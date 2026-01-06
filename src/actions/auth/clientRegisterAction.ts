"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ClientRegisterSchema, type ClientRegisterData } from "@/lib/zod";
import { sendWelcomeEmail } from "@/lib/email";
import { siteConfig } from "@/config/site";

export interface RegisterResult {
  success: boolean;
  error?: string;
  clientId?: string;
}

/**
 * Register a new client account
 * Also links existing payments to the client if email matches
 */
export async function clientRegisterAction(
  data: ClientRegisterData
): Promise<RegisterResult> {
  try {
    // Validate input
    const validated = ClientRegisterSchema.parse(data);

    // Check if client already exists
    const existingClient = await prisma.client.findUnique({
      where: { email: validated.email },
    });

    if (existingClient) {
      // If client exists but has no password, update it
      if (!existingClient.password) {
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        await prisma.client.update({
          where: { id: existingClient.id },
          data: {
            password: hashedPassword,
            name: validated.name,
            emailVerified: new Date(),
          },
        });

        // Link existing payments to this client
        await prisma.payment.updateMany({
          where: { email: validated.email, clientId: null },
          data: { clientId: existingClient.id },
        });

        // Send welcome email
        await sendWelcomeEmail({
          customerEmail: validated.email,
          customerName: validated.name,
          loginUrl: `${siteConfig.baseUrl}/client/login`,
        });

        return {
          success: true,
          clientId: existingClient.id,
        };
      }

      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Create new client
    const client = await prisma.$transaction(async (tx) => {
      const newClient = await tx.client.create({
        data: {
          email: validated.email,
          password: hashedPassword,
          name: validated.name,
          emailVerified: new Date(),
          isActive: true,
        },
      });

      // Link existing payments to this client (if any)
      await tx.payment.updateMany({
        where: { email: validated.email, clientId: null },
        data: { clientId: newClient.id },
      });

      return newClient;
    });

    // Send welcome email
    await sendWelcomeEmail({
      customerEmail: validated.email,
      customerName: validated.name,
      loginUrl: `${siteConfig.baseUrl}/client/login`,
    });

    return {
      success: true,
      clientId: client.id,
    };
  } catch (error) {
    console.error("Error registering client:", error);

    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        error: "An account with this email already exists",
      };
    }

    return {
      success: false,
      error: "Failed to create account. Please try again.",
    };
  }
}
