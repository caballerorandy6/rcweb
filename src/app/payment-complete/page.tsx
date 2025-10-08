import PaymentComplete from "@/app/components/PaymentComplete";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Payment Successful - Thank You!",
  description:
    "Your payment has been successfully processed. Thank you for choosing RC Web Solutions LLC.",
  pageRoute: "/payment-complete",
});

export default function PaymentCompletePage() {
  return <PaymentComplete />;
}
