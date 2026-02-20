import PaymentComplete from "@/components/payment/PaymentComplete";
import PaymentCompleteSkeleton from "@/components/skeletons/PaymentCompleteSkeleton";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { Suspense } from "react";

export const metadata = genPageMetadata({
  title: "Payment Successful - Thank You!",
  description:
    "Your payment has been successfully processed. Thank you for choosing RC Web Solutions LLC.",
  pageRoute: "/payment-complete",
});

export default function PaymentCompletePage() {
  return (
    <Suspense fallback={<PaymentCompleteSkeleton />}>
      <PaymentComplete />
    </Suspense>
  );
}
