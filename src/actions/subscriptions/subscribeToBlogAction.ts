"use server";

import { prisma } from "@/lib/prisma";
import { BlogSubscriptionData, BlogSubscriptionSchema } from "@/lib/zod";
import { sendNewLeadNotification } from "@/lib/email/senders/sendNewLeadNotification";

const SOURCE = "blog_subscription";

/**
 * Blog subscribers are newsletter contacts: the email joins (or re-joins) the
 * Contact table with marketing consent, so campaigns reach a single audience
 * and /unsubscribe works for everyone.
 */
export const subscribeToBlogAction = async (data: BlogSubscriptionData) => {
  const parsedData = BlogSubscriptionSchema.safeParse(data);

  if (!parsedData.success) {
    const firstError = parsedData.error.issues[0]?.message || "Invalid data";
    return { success: false, message: firstError };
  }

  const email = parsedData.data.email.toLowerCase();

  try {
    const existingEmail = await prisma.contactEmail.findUnique({
      where: { email },
      select: { contact: { select: { id: true, marketingConsent: true } } },
    });

    if (existingEmail) {
      if (existingEmail.contact.marketingConsent) {
        return {
          success: false,
          message: "This email is already subscribed to the blog.",
        };
      }

      // Known lead (or someone who unsubscribed) opting back in
      await prisma.contact.update({
        where: { id: existingEmail.contact.id },
        data: { marketingConsent: true },
      });

      return { success: true, message: "Successfully subscribed to the blog." };
    }

    await prisma.contact.create({
      data: {
        name: "Blog Subscriber",
        marketingConsent: true,
        source: SOURCE,
        emails: { create: { email } },
      },
    });

    // Admin notification is best-effort; the subscription already succeeded
    await sendNewLeadNotification({
      leadName: "Blog Subscriber",
      leadEmail: email,
      source: SOURCE,
    }).catch((error) => console.error("Blog lead notification failed:", error));

    return { success: true, message: "Successfully subscribed to the blog." };
  } catch (error) {
    console.error("Error subscribing to blog:", error);
    return {
      success: false,
      message: "An error occurred while subscribing to the blog.",
    };
  }
};
