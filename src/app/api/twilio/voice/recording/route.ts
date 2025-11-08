/**
 * Twilio Voice Recording Webhook
 * Receives voicemail recordings and sends email notification
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract recording details
    const recordingSid = formData.get("RecordingSid");
    const recordingUrl = formData.get("RecordingUrl");
    const recordingDuration = formData.get("RecordingDuration");
    const callSid = formData.get("CallSid");
    const from = formData.get("From");
    const to = formData.get("To");

    // Log voicemail information
    console.log("Voicemail received:", {
      recordingSid,
      recordingUrl,
      recordingDuration: `${recordingDuration} seconds`,
      from,
      to,
      timestamp: new Date().toISOString(),
    });

    // Send email notification with voicemail details
    await sendEmailWithQuota({
      from: "RC Web Solutions <noreply@rcweb.dev>",
      to: "contactus@rcweb.dev",
      subject: `New Voicemail from ${from}`,
      html: `
        <h2>New Voicemail Received</h2>
        <p><strong>From:</strong> ${from}</p>
        <p><strong>To:</strong> ${to}</p>
        <p><strong>Duration:</strong> ${recordingDuration} seconds</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Recording URL:</strong> <a href="${recordingUrl}.mp3">${recordingUrl}.mp3</a></p>
        <p><strong>Play Recording:</strong> <a href="${recordingUrl}">Listen Here</a></p>
        <hr>
        <p>Recording SID: ${recordingSid}</p>
        <p>Call SID: ${callSid}</p>
      `,
    });

    console.log("Voicemail notification email sent successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling voicemail recording:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process voicemail" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Recording webhook is active",
  });
}
