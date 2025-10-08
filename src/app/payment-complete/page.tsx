import PaymentComplete from "@/app/components/PaymentComplete";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Successful - Thank You!",
  description:
    "Your payment has been successfully processed. Thank you for choosing RC Web Solutions LLC.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PaymentCompletePage() {
  return <PaymentComplete />;
}
