import PaymentComplete from "@/app/components/PaymentComplete";
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
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-gold">Loading...</div></div>}>
      <PaymentComplete />
    </Suspense>
  );
}
