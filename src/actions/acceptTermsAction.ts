"use server";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export interface AcceptTermsActionProps {
  userId?: string;
  paymentId?: string;
  plan?: string;
  ipAddress?: string;
  userAgent?: string;
  termsVersion?: string;
}

export async function acceptTermsAction({
  userId,
  paymentId,
  plan,
  ipAddress,
  userAgent,
  termsVersion = "2025-09-25",
}: AcceptTermsActionProps) {
  const h = await headers();
  const ip =
    ipAddress || h.get("x-forwarded-for") || h.get("x-real-ip") || "unknown";
  const ua = userAgent || h.get("user-agent") || "unknown";

  const acceptance = await prisma.termsAcceptance.create({
    data: {
      userId,
      paymentId,
      plan,
      ipAddress: ip,
      userAgent: ua,
      termsVersion,
      acceptedAt: new Date(),
    },
  });

  return acceptance;
}
