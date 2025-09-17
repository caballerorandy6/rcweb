import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { createFinalPaymentSessionAction } from "@/actions/createFinalPaymentSessionAction";

export default async function MagicLinkPaymentPage({
  params,
}: {
  params: { token: string };
}) {
  const payment = await prisma.payment.findUnique({
    where: { accessToken: params.token },
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

  // Auto-crear sesión de pago
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
