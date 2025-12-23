import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { success: false, error: "notificationIds array is required" },
        { status: 400 }
      );
    }

    const result = await prisma.milestoneNotification.updateMany({
      where: {
        id: { in: notificationIds },
        sentAt: null,
      },
      data: {
        sentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      markedCount: result.count,
    });
  } catch (error) {
    console.error("Error marking notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark notifications" },
      { status: 500 }
    );
  }
}
