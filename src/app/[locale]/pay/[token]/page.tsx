import { prisma } from "@/lib/prisma";
import { redirect as redirectExternal } from "next/navigation";
import type { Metadata, Route } from "next";
import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
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

type Params = Promise<{ token: string; locale: Locale }>;

// Magic link from the "project ready" email: the access token identifies the
// project, so no email or code is asked for.
export default async function MagicLinkPaymentPage(props: { params: Params }) {
  const { token, locale } = await props.params;
  // Annotated so TypeScript narrows after each call, like redirect() itself
  const fail: (error: string) => never = (error) =>
    redirect({ href: { pathname: "/final-payment", query: { error } }, locale });

  if (!token) {
    fail("invalid-link");
  }

  // Every visit creates a Checkout Session: cap it per IP, with the general
  // API budget rather than the contact form's
  const rateCheck = await checkActionRateLimit(rateLimiters.api);
  if (!rateCheck.success) {
    fail("too-many-requests");
  }

  const project = await prisma.project.findUnique({
    where: { accessToken: token },
    include: { payments: true },
  });

  if (!project) {
    fail("invalid-link");
  }

  const { final } = getProjectCharges(project.payments);

  if (isPaid(final)) {
    redirect({ href: "/payment-complete", locale });
  }

  if (project.status !== "ready_for_payment") {
    fail("project-not-ready");
  }

  let sessionUrl: string;
  try {
    sessionUrl = await createFinalPaymentCheckout(
      { ...project, finalAmount: final.amount },
      "magic-link",
      locale
    );
  } catch (error) {
    console.error("❌ Error creating final payment from magic link:", error);
    fail("payment-failed");
  }

  redirectExternal(sessionUrl as Route);
}
