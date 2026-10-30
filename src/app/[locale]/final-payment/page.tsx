import FinalPayment from "@/components/payment/FinalPayment";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Final Payment - Complete Your Project",
  description:
    "Complete your final payment to receive your completed project. Secure payment processing through Stripe for RC Web Solutions LLC projects.",
  pageRoute: "/final-payment",
  noIndex: true,
});

// Reasons /pay/[token] sends the customer here instead of to Stripe
const NOTICES: Record<string, string> = {
  "invalid-link":
    "That payment link is not valid. Enter your email and project code below to continue.",
  "project-not-ready":
    "Your project is not ready for the final payment yet. You'll receive an email as soon as it is.",
  "payment-failed":
    "We couldn't start the payment from your link. Try again below or contact support.",
  "too-many-requests":
    "Too many attempts from your connection. Wait a minute and try again.",
};

type SearchParams = Promise<{ error?: string | string[] }>;

export default async function FinalPaymentPage(props: {
  searchParams: SearchParams;
}) {
  const { error } = await props.searchParams;
  const notice = typeof error === "string" ? NOTICES[error] : undefined;

  return (
    <section id="final-payment">
      <FinalPayment notice={notice} />
    </section>
  );
}
