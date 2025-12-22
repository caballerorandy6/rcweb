import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  // Validate API key for n8n access
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const posts = getAllPosts();

    const notifiedSlugs = await prisma.notifiedBlogPost.findMany({
      select: { slug: true },
    });

    const notifiedSlugsSet = new Set(notifiedSlugs.map((item) => item.slug));

    const postsWithNotificationStatus = posts.map((post) => ({
      ...post,
      isNotified: notifiedSlugsSet.has(post.slug),
    }));

    const pendingPosts = postsWithNotificationStatus.filter(
      (post) => !post.isNotified
    );

    // Sort by date descending and get only the most recent post
    const sortedPosts = pendingPosts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Return only the most recent unnotified post (or empty array if none)
    const latestPost = sortedPosts.length > 0 ? [sortedPosts[0]] : [];

    return NextResponse.json({
      success: true,
      posts: latestPost,
      count: latestPost.length,
    });
  } catch (error) {
    console.error("Error in /api/blog/posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
