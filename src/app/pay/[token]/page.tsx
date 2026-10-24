import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Route } from "next";
import type { Metadata } from "next";
import { getProjectCharges, isPaid } from "@/lib/project/charges";
import { createFinalPaymentCheckout } from "@/lib/project/finalPaymentCheckout";
import { checkActionRateLimit, rateLimiters } from "@/lib/rateLimit";

export const metadata: Metadata = {
  title: "Processing Payment…",
  description: "Redirecting to secure payment checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

type Params = Promise<{ token: string }>;

// Magic link from the "project ready" email: the access token identifies the
// project, so no email or code is asked for.
export default async function MagicLinkPaymentPage(props: { params: Params }) {
  const { token } = await props.params;

  if (!token) {
    redirect("/final-payment?error=invalid-link");
  }

  // Every visit creates a Checkout Session: cap it per IP, with the general
  // API budget rather than the contact form's
  const rateCheck = await checkActionRateLimit(rateLimiters.api);
  if (!rateCheck.success) {
    redirect("/final-payment?error=too-many-requests");
  }

  const project = await prisma.project.findUnique({
    where: { accessToken: token },
    include: { payments: true },
  });

  if (!project) {
    redirect("/final-payment?error=invalid-link");
  }

  const { final } = getProjectCharges(project.payments);

  if (isPaid(final)) {
    redirect("/payment-complete");
  }

  if (project.status !== "ready_for_payment") {
    redirect("/final-payment?error=project-not-ready");
  }

  let sessionUrl: string;
  try {
    sessionUrl = await createFinalPaymentCheckout(
      { ...project, finalAmount: final.amount },
      "magic-link"
    );
  } catch (error) {
    console.error("❌ Error creating final payment from magic link:", error);
    redirect("/final-payment?error=payment-failed");
  }

  redirect(sessionUrl as Route);
}
