"use server";

import { prisma } from "@/lib/prisma";
import { BlogSubscriptionData, BlogSubscriptionSchema } from "@/lib/zod";

export const subscribeToBlogAction = async (data: BlogSubscriptionData) => {
  // Validar los datos de entrada
  const parsedData = BlogSubscriptionSchema.safeParse(data);

  if (!parsedData.success) {
    return {
      success: false,
      message: "Invalid email address",
    };
  }

  const { email, preferredLanguage } = parsedData.data;

  try {
    const existingSubscription = await prisma.blogSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscription?.isActive) {
      return {
        success: false,
        message: "This email is already subscribed to the blog.",
      };
    }

    await prisma.blogSubscriber.upsert({
      where: { email },
      update: { isActive: true, unsubscribedAt: null, preferredLanguage },
      create: { email, isActive: true, preferredLanguage },
    });

    return {
      success: true,
      message: "Successfully subscribed to the blog.",
    };
  } catch (error) {
    console.error("Error subscribing to blog:", error);
    return {
      success: false,
      message: "An error occurred while subscribing to the blog.",
    };
  }
};
