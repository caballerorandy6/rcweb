/**
 * Twilio Voice Transcription Webhook
 * Receives voicemail transcriptions and sends email notification
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract transcription details
    const transcriptionText = formData.get("TranscriptionText");
    const transcriptionStatus = formData.get("TranscriptionStatus");
    const recordingSid = formData.get("RecordingSid");
    const callSid = formData.get("CallSid");
    const from = formData.get("From");

    // Log transcription information
    console.log("Voicemail transcription received:", {
      transcriptionStatus,
      transcriptionText,
      recordingSid,
      from,
      timestamp: new Date().toISOString(),
    });

    // If transcription was successful, send email with text
    if (transcriptionStatus === "completed" && transcriptionText) {
      await sendEmailWithQuota({
        from: "RC Web Solutions <noreply@rcweb.dev>",
        to: "contactus@rcweb.dev",
        subject: `Voicemail Transcription from ${from}`,
        html: `
          <h2>Voicemail Transcription</h2>
          <p><strong>From:</strong> ${from}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <h3>Message:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${transcriptionText}
          </p>
          <hr>
          <p style="font-size: 12px; color: #666;">
            Recording SID: ${recordingSid}<br>
            Call SID: ${callSid}
          </p>
        `,
      });

      console.log("Transcription email sent successfully");
    } else {
      console.log("Transcription failed or not available:", transcriptionStatus);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error handling voicemail transcription:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process transcription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Transcription webhook is active",
  });
}
