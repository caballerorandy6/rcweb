import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subscribers = await prisma.blogSubscriber.findMany({
      where: { isActive: true },
      select: { email: true, preferredLanguage: true },
    });

    // Return array directly for n8n compatibility
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
