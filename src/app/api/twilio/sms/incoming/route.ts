// API Route to handle incoming SMS messages from Twilio
// Twilio will POST to this endpoint when someone sends an SMS to your number

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import twilio from "twilio";
import { validateTwilioSignature, forbiddenTwilioSmsResponse } from "@/lib/twilioAuth";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Convert FormData to object for signature validation
    const params: Record<string, string> = {};
    formData.forEach((value, key) => {
      params[key] = value.toString();
    });

    // Validate Twilio signature
    const isValid = await validateTwilioSignature(request, params);
    if (!isValid) {
      return forbiddenTwilioSmsResponse();
    }

    // Extract Twilio parameters
    const from = formData.get("From") as string; // User's phone number
    const body = (formData.get("Body") as string)?.trim().toUpperCase();
    const messageSid = formData.get("MessageSid") as string;

                // Initialize TwiML response
    const twiml = new twilio.twiml.MessagingResponse();

    // Normalize phone number to E.164 format
    const normalizedPhone = from.startsWith("+") ? from : `+1${from}`;

    // Handle different commands
    switch (body) {
      case "START":
      case "SUBSCRIBE":
      case "YES":
        await handleOptIn(normalizedPhone);
        twiml.message(
          "RC Web Solutions: You are now subscribed to marketing updates about our web development services. For help reply HELP. To opt-out reply STOP. Msg&data rates may apply."
        );
        break;

      case "STOP":
      case "UNSUBSCRIBE":
      case "CANCEL":
      case "END":
      case "QUIT":
        await handleOptOut(normalizedPhone);
        // Twilio automatically handles STOP, but we log it
        twiml.message(
          "RC Web Solutions: You have been unsubscribed. You will not receive any more messages from us. Reply START to resubscribe."
        );
        break;

      case "HELP":
      case "INFO":
        twiml.message(
          "RC Web Solutions - Professional web development services. Reply START to subscribe to updates or STOP to unsubscribe. Questions? Call (346) 375-7534 or visit rcweb.dev"
        );
        break;

      default:
        // Unknown command - provide helpful response
        twiml.message(
          "RC Web Solutions: Thanks for your message! Reply START to subscribe, STOP to unsubscribe, or HELP for more info. Call us at (346) 375-7534"
        );
        break;
    }

    // Log the interaction
    await logSmsInteraction(normalizedPhone, body, "received", messageSid);

    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("❌ Error processing incoming SMS:", error);

    // Return error response in TwiML format
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message("We're sorry, there was an error processing your request. Please try again later or call (346) 375-7534");

    return new NextResponse(twiml.toString(), {
      status: 200, // Always return 200 to Twilio to prevent retries
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

/**
 * Handle user opting in to SMS marketing
 */
async function handleOptIn(phoneNumber: string) {
  try {
        // Check if contact exists with this phone number
    const existingPhone = await prisma.contactPhone.findFirst({
      where: { phone: phoneNumber },
      include: { contact: true },
    });

    if (existingPhone) {
      // Update existing contact to opt-in
      await prisma.contact.update({
        where: { id: existingPhone.contactId },
        data: {
          marketingConsent: true,
          updatedAt: new Date(),
        },
      });
          } else {
      // Create new contact with opt-in
      await prisma.contact.create({
        data: {
          name: `SMS Subscriber ${phoneNumber.slice(-4)}`,
          marketingConsent: true,
          source: "SMS_OPT_IN",
          phones: {
            create: {
              phone: phoneNumber,
              type: "mobile",
            },
          },
        },
      });
          }
  } catch (error) {
    console.error("❌ Error handling opt-in:", error);
    throw error;
  }
}

/**
 * Handle user opting out of SMS marketing
 */
async function handleOptOut(phoneNumber: string) {
  try {
        // Find contact with this phone number
    const existingPhone = await prisma.contactPhone.findFirst({
      where: { phone: phoneNumber },
      include: { contact: true },
    });

    if (existingPhone) {
      // Update contact to opt-out
      await prisma.contact.update({
        where: { id: existingPhone.contactId },
        data: {
          marketingConsent: false,
          updatedAt: new Date(),
        },
      });
          } else {
      // Create contact record with opt-out to prevent future messages
      await prisma.contact.create({
        data: {
          name: `SMS Unsubscribed ${phoneNumber.slice(-4)}`,
          marketingConsent: false,
          source: "SMS_OPT_OUT",
          phones: {
            create: {
              phone: phoneNumber,
              type: "mobile",
            },
          },
        },
      });
          }
  } catch (error) {
    console.error("❌ Error handling opt-out:", error);
    throw error;
  }
}

/**
 * Log SMS interaction for tracking
 */
async function logSmsInteraction(
  phoneNumber: string,
  message: string,
  direction: "received" | "sent",
  twilioSid?: string
) {
  try {
        // Detect command
    const upperMessage = message.toUpperCase();
    let command: string | null = null;

    if (["START", "SUBSCRIBE", "YES"].includes(upperMessage)) {
      command = "OPT_IN";
    } else if (["STOP", "UNSUBSCRIBE", "CANCEL", "END", "QUIT"].includes(upperMessage)) {
      command = "OPT_OUT";
    } else if (["HELP", "INFO"].includes(upperMessage)) {
      command = "HELP";
    }

    // Save to database
    await prisma.smsLog.create({
      data: {
        phoneNumber,
        message,
        direction,
        command,
        twilioSid,
        status: direction === "received" ? "received" : "queued",
      },
    });

      } catch (error) {
    console.error("❌ Error logging SMS interaction:", error);
    // Don't throw - logging shouldn't break the flow
  }
}

// Handle GET requests (for debugging)
export async function GET() {
  return NextResponse.json({
    message: "Twilio SMS Webhook Endpoint",
    status: "active",
    supportedCommands: ["START", "SUBSCRIBE", "STOP", "HELP"],
  });
}
