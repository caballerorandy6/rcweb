import { handlePaymentSuccessAction } from "@/actions/payments/handlePaymentSuccessAction";
import PaymentSuccess from "@/app/components/payment/PaymentSuccess";
import PaymentSuccessSkeleton from "@/app/components/skeletons/PaymentSuccessSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { Suspense } from "react";

export const metadata = genPageMetadata({
  title: "Payment Successful - Thank You!",
  description:
    "Your payment has been successfully processed. Thank you for choosing RC Web Solutions LLC for your project.",
  pageRoute: "/payment-success",
});

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function PaymentSuccessWrapper({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const sessionId = params.session_id as string;
  const code = params.code as string;

  // Manejar el payment con race condition handling
  const result = await handlePaymentSuccessAction(sessionId, code);

  if (result.fallbackUsed) {
    console.warn("⚠️ Webhook no proccess on time, fallback used");
  }

  return (
    <PaymentSuccess
      payment={result.payment}
      error={result.error}
      projectCode={code || result.payment?.projectCode}
      fallbackUsed={result.fallbackUsed}
    />
  );
}

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <Suspense fallback={<PaymentSuccessSkeleton />}>
      <PaymentSuccessWrapper searchParams={searchParams} />
    </Suspense>
  );
}
