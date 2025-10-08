import FinalPayment from "@/app/components/FinalPayment";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Final Payment - Complete Your Project",
  description:
    "Complete your final payment to receive your completed project. Secure payment processing through Stripe for RC Web Solutions LLC projects.",
  openGraph: {
    title: "Final Payment - Complete Your Project | RC Web",
    description:
      "Complete your final payment to receive your completed project. Secure payment processing through Stripe.",
    url: `${siteConfig.baseUrl}/final-payment`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Final Payment - Complete Your Project | RC Web",
    description:
      "Complete your final payment to receive your completed project. Secure payment processing through Stripe.",
  },
  robots: {
    index: false, // Don't index payment pages
    follow: false,
  },
};

const FinalPaymentPage = () => {
  return (
    <section id="final-payment">
      <FinalPayment />
    </section>
  );
};

export default FinalPaymentPage;
