/**
 * Twilio Voice Call Completion Webhook
 * Logs call details after forwarding completes
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extract call details
    const callSid = formData.get("CallSid");
    const callStatus = formData.get("CallStatus");
    const callDuration = formData.get("CallDuration");
    const from = formData.get("From");
    const to = formData.get("To");
    const dialCallStatus = formData.get("DialCallStatus");

    // Log call information
    console.log("Call completed:", {
      callSid,
      callStatus,
      dialCallStatus,
      callDuration: `${callDuration} seconds`,
      from,
      to,
      timestamp: new Date().toISOString(),
    });

    // You can save this to your database if needed
    // await prisma.callLog.create({ data: { ... } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging call completion:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log call" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Call completion webhook is active",
  });
}
