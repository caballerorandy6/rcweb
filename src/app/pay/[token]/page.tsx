import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { Route } from "next";
import { createFinalPaymentSessionAction } from "@/actions/payments/createFinalPaymentSessionAction";
import { Metadata } from "next";
import { getProjectCharges, isPaid } from "@/lib/project/charges";

export const metadata: Metadata = {
  title: "Processing Payment…",
  description: "Redirecting to secure payment checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

type Params = Promise<{ token: string }>;

export default async function MagicLinkPaymentPage(props: { params: Params }) {
  const params = await props.params;
  const { token } = params;

  if (!token) {
    redirect("/final-payment?error=invalid-link");
  }

  const project = await prisma.project.findUnique({
    where: { accessToken: token },
    include: { payments: true },
  });

  if (!project) {
    redirect("/final-payment?error=invalid-link");
  }

  if (isPaid(getProjectCharges(project.payments).final)) {
    redirect("/payment-complete");
  }

  if (project.status !== "ready_for_payment") {
    redirect("/final-payment?error=project-not-ready");
  }

  const result = await createFinalPaymentSessionAction(
    project.email,
    project.projectCode
  );

  if (result.success && result.sessionUrl) {
    redirect(result.sessionUrl as Route);
  } else {
    redirect("/final-payment?error=payment-failed" as Route);
  }
}
