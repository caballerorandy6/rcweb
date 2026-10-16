/**
 * Twilio Voice Webhook
 * Handles incoming calls to +1 346 375 7534 and forwards them to your personal number
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { validateTwilioSignature, forbiddenTwilioResponse } from "@/lib/twilioAuth";

const VoiceResponse = twilio.twiml.VoiceResponse;

// Personal phone number where calls are forwarded (E.164, e.g. +18325551234)
const FORWARD_TO_NUMBER = process.env.TWILIO_FORWARD_TO_NUMBER;
// Twilio number shown on caller ID when forwarding
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

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
      return forbiddenTwilioResponse();
    }
    // Create TwiML response
    const twiml = new VoiceResponse();

    // Without a forwarding number we cannot dial anyone: go straight to voicemail
    if (!FORWARD_TO_NUMBER || !TWILIO_PHONE_NUMBER) {
      console.error(
        "TWILIO_FORWARD_TO_NUMBER or TWILIO_PHONE_NUMBER is not set; sending caller to voicemail"
      );
      twiml.redirect({ method: "POST" }, "/api/twilio/voice/dialed");
      return new NextResponse(twiml.toString(), {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Optional: Play a greeting before forwarding
    twiml.say(
      {
        voice: "Polly.Joanna",
        language: "en-US",
      },
      "Thank you for calling R C Web Solutions. Please hold while we connect your call."
    );

    // Forward the call to your personal number
    const dial = twiml.dial({
      callerId: TWILIO_PHONE_NUMBER, // Shows your Twilio number on caller ID
      timeout: 30, // Ring for 30 seconds
      action: "/api/twilio/voice/dialed", // Check if call was answered
    });
    dial.number(FORWARD_TO_NUMBER);

    // Return TwiML response
    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error handling voice call:", error);

    // Return error TwiML
    const errorTwiml = new VoiceResponse();
    errorTwiml.say("We're sorry, an error occurred. Please try again later.");

    return new NextResponse(errorTwiml.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}
