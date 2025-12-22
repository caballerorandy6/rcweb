import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

export async function POST(request: NextRequest) {
  // Validate API key for n8n access
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const { slug, title } = await request.json();

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: "Missing slug or title" },
        { status: 400 }
      );
    }

    const existing = await prisma.notifiedBlogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json({ success: true, message: "Already notified" });
    }

    await prisma.notifiedBlogPost.create({
      data: { slug, title },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to notify blog post" },
      { status: 500 }
    );
  }
}
