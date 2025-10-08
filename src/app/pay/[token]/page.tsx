import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createFinalPaymentSessionAction } from "@/actions/createFinalPaymentSessionAction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Processing Payment...",
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

  const payment = await prisma.payment.findUnique({
    where: { accessToken: token },
  });

  if (!payment) {
    redirect("/final-payment?error=invalid-link");
  }

  if (payment.secondPaid) {
    redirect("/payment-complete");
  }

  if (payment.projectStatus !== "ready_for_payment") {
    redirect("/final-payment?error=project-not-ready");
  }

  const result = await createFinalPaymentSessionAction(
    payment.email,
    payment.projectCode
  );

  if (result.success && result.sessionUrl) {
    redirect(result.sessionUrl);
  } else {
    redirect("/final-payment?error=payment-failed");
  }
}
