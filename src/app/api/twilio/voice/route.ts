/**
 * Twilio Voice Webhook
 * Handles incoming calls to +1 346 375 7534 and forwards them to your personal number
 */

import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

// Your personal phone number where calls will be forwarded
const FORWARD_TO_NUMBER = "+18325465983";

export async function POST() {
  try {
    // Create TwiML response
    const twiml = new VoiceResponse();

    // Optional: Play a greeting before forwarding
    twiml.say(
      {
        voice: "Polly.Joanna",
        language: "en-US",
      },
      "Thank you for calling R C Web Solutions. Please hold while we connect your call."
    );

    // Forward the call to your personal number
    twiml.dial(
      {
        callerId: "+13463757534", // Shows your Twilio number on caller ID
        timeout: 30, // Ring for 30 seconds
        action: "/api/twilio/voice/completed", // Optional: track call completion
      },
      FORWARD_TO_NUMBER
    );

    // If call is not answered, play voicemail message
    twiml.say(
      {
        voice: "Polly.Joanna",
        language: "en-US",
      },
      "Sorry, we are unable to take your call right now. Please visit our website at R C Web dot dev or try calling again later. Goodbye."
    );

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

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    message: "Twilio Voice Webhook is active",
    forwardTo: FORWARD_TO_NUMBER,
  });
}
