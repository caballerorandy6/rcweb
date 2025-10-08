import FinalPayment from "@/app/components/FinalPayment";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Final Payment - Complete Your Project",
  description:
    "Complete your final payment to receive your completed project. Secure payment processing through Stripe for RC Web Solutions LLC projects.",
  pageRoute: "/final-payment",
});

const FinalPaymentPage = () => {
  return (
    <section id="final-payment">
      <FinalPayment />
    </section>
  );
};

export default FinalPaymentPage;
