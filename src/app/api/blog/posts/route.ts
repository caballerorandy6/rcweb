import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";

export async function GET() {
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

    return NextResponse.json({
      success: true,
      posts: pendingPosts,
      count: pendingPosts.length,
    });
  } catch (error) {
    console.error("Error in /api/blog/posts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}
