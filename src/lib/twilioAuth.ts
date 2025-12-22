import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;

/**
 * Validates Twilio webhook signature
 * @see https://www.twilio.com/docs/usage/webhooks/webhooks-security
 */
export async function validateTwilioSignature(
  request: NextRequest,
  params: Record<string, string>
): Promise<boolean> {
  try {
    const signature = request.headers.get("x-twilio-signature");

    if (!signature) {
      console.error("Missing Twilio signature header");
      return false;
    }

    // Get the full URL that Twilio used to call us
    const url = request.url;

    // Validate the request
    const isValid = twilio.validateRequest(
      TWILIO_AUTH_TOKEN,
      signature,
      url,
      params
    );

    if (!isValid) {
      console.error("Invalid Twilio signature");
    }

    return isValid;
  } catch (error) {
    console.error("Error validating Twilio signature:", error);
    return false;
  }
}

/**
 * Returns 403 response for invalid Twilio Voice requests
 */
export function forbiddenTwilioResponse(): NextResponse {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say("Unauthorized request.");

  return new NextResponse(twiml.toString(), {
    status: 403,
    headers: { "Content-Type": "text/xml" },
  });
}

/**
 * Returns 403 response for invalid Twilio SMS requests
 */
export function forbiddenTwilioSmsResponse(): NextResponse {
  const twiml = new twilio.twiml.MessagingResponse();

  return new NextResponse(twiml.toString(), {
    status: 403,
    headers: { "Content-Type": "text/xml" },
  });
}
