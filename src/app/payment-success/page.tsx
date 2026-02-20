import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { handlePaymentSuccessAction } from "@/actions/payments/handlePaymentSuccessAction";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import SubscriptionSuccess from "@/components/payment/SubscriptionSuccess";
import PaymentSuccessSkeleton from "@/components/skeletons/PaymentSuccessSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Payment Successful - Thank You!",
  description:
    "Your payment has been successfully processed. Thank you for choosing RC Web Solutions LLC for your project.",
  pageRoute: "/payment-success",
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

interface PageProps {
  searchParams: SearchParams;
}

async function findSubscriptionWithRetry(sessionId: string) {
  const maxAttempts = 15;
  const delayMs = 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const subscription = await prisma.subscription.findFirst({
      where: { stripeSessionId: sessionId },
    });

    if (subscription) return { subscription, fallbackUsed: false };

    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return { subscription: null, fallbackUsed: true };
}

async function Content({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id as string;
  const isSubscription = params.subscription === "true";
  const code = params.code as string;

  if (!sessionId) {
    return (
      <PaymentSuccess error="No session ID provided. Please contact support if you completed a payment." />
    );
  }

  // Subscription flow
  if (isSubscription) {
    const { subscription, fallbackUsed } = await findSubscriptionWithRetry(sessionId);

    if (!subscription) {
      return (
        <SubscriptionSuccess
          error="Subscription is being processed. Please check your email for confirmation."
          fallbackUsed={fallbackUsed}
        />
      );
    }

    return <SubscriptionSuccess subscription={subscription} fallbackUsed={fallbackUsed} />;
  }

  // Payment flow
  const result = await handlePaymentSuccessAction(sessionId, code);

  return (
    <PaymentSuccess
      payment={result.payment}
      error={result.error}
      projectCode={code || result.payment?.projectCode}
      fallbackUsed={result.fallbackUsed}
    />
  );
}

export default function PaymentSuccessPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<PaymentSuccessSkeleton />}>
      <Content searchParams={searchParams} />
    </Suspense>
  );
}
