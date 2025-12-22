/**
 * Twilio Voice Dial Status Webhook
 * Handles what happens after attempting to forward the call
 */

import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
import { validateTwilioSignature, forbiddenTwilioResponse } from "@/lib/twilioAuth";

const VoiceResponse = twilio.twiml.VoiceResponse;

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

    const dialCallStatus = formData.get("DialCallStatus");

    const twiml = new VoiceResponse();

    // If call was not answered (busy, no-answer, failed, or canceled)
    if (
      dialCallStatus === "no-answer" ||
      dialCallStatus === "busy" ||
      dialCallStatus === "failed" ||
      dialCallStatus === "canceled"
    ) {
      // Play voicemail greeting
      twiml.say(
        {
          voice: "Polly.Joanna",
          language: "en-US",
        },
        "Hi, you've reached Randy Caballero with RC Web Solutions. I'm currently unavailable. Please leave your name, number, and a brief message, and I'll get back to you within a few hours. Thanks!"
      );

      // Record the voicemail
      twiml.record({
        maxLength: 120, // Max 2 minutes
        timeout: 5, // Stop recording after 5 seconds of silence
        transcribe: true, // Get transcription of the voicemail
        transcribeCallback: "/api/twilio/voice/transcription",
        recordingStatusCallback: "/api/twilio/voice/recording",
        playBeep: true, // Play beep before recording
      });

      // After recording, say goodbye
      twiml.say(
        {
          voice: "Polly.Joanna",
          language: "en-US",
        },
        "Thank you for your message. Goodbye."
      );
    }
    // If call was completed successfully, just hang up
    else if (dialCallStatus === "completed") {
      twiml.hangup();
    }

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error) {
    console.error("Error in dial status webhook:", error);

    const errorTwiml = new VoiceResponse();
    errorTwiml.say("An error occurred. Goodbye.");

    return new NextResponse(errorTwiml.toString(), {
      status: 500,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Dial status webhook is active",
  });
}
