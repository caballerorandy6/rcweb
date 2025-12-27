"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateApiKey, unauthorizedResponse } from "@/lib/apiAuth";

export async function GET(request: NextRequest) {
  if (!validateApiKey(request)) {
    return unauthorizedResponse("Invalid or missing API key");
  }

  try {
    const notifications = await prisma.milestoneNotification.findMany({
      where: { sentAt: null },
      orderBy: { createdAt: "asc" },
      include: {
        milestone: {
          include: {
            payment: {
              include: {
                milestones: {
                  orderBy: { order: "asc" },
                },
              },
            },
          },
        },
      },
    });

    // Format response for n8n
    const formatted = notifications.map((n) => {
      const allMilestones = n.milestone.payment.milestones;
      const completedCount = allMilestones.filter(
        (m) => m.status === "completed"
      ).length;
      const progressPercent =
        allMilestones.length > 0
          ? Math.round((completedCount / allMilestones.length) * 100)
          : 0;

      return {
        id: n.id,
        type: n.type,
        projectCode: n.projectCode,
        clientName: n.clientName,
        clientEmail: n.clientEmail,
        milestoneTitle: n.milestoneTitle,
        accessToken: n.accessToken,
        projectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/project/${n.accessToken}`,
        progress: {
          completed: completedCount,
          total: allMilestones.length,
          percent: progressPercent,
        },
        createdAt: n.createdAt.toISOString(),
      };
    });

    return NextResponse.json({
      success: true,
      count: formatted.length,
      notifications: formatted,
    });
  } catch (error) {
    console.error("Error fetching pending notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
