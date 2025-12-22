import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  // Validate API key for n8n access
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

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
