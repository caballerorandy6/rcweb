import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subscribers = await prisma.blogSubscriber.findMany({
      select: { isActive: true, preferredLanguage: true },
    });

    if (!subscribers) {
      return NextResponse.json(
        { success: false, error: "No subscribers found" },
        { status: 404 }
      );
    }
    const count = subscribers.length;
    return NextResponse.json({ success: true, subscribers, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
