import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

// Temporary endpoint to mark all existing posts as notified
// DELETE THIS FILE after using it once
export async function POST(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const posts = getAllPosts();

    // Get already notified slugs
    const notifiedSlugs = await prisma.notifiedBlogPost.findMany({
      select: { slug: true },
    });
    const notifiedSet = new Set(notifiedSlugs.map((n) => n.slug));

    // Filter posts that are not yet notified
    const postsToMark = posts.filter((post) => !notifiedSet.has(post.slug));

    // Mark all as notified
    const results = await Promise.all(
      postsToMark.map((post) =>
        prisma.notifiedBlogPost.create({
          data: {
            slug: post.slug,
            title: post.title,
          },
        })
      )
    );

    return NextResponse.json({
      success: true,
      message: `Marked ${results.length} posts as notified`,
      posts: results.map((r) => r.slug),
    });
  } catch (error) {
    console.error("Error marking posts as notified:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark posts" },
      { status: 500 }
    );
  }
}
