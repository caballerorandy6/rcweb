import stripe from "@/lib/stripe";
import { splitDepositAmount } from "@/lib/project/charges";
import { uniqueProjectCode } from "@/lib/project/uniqueProjectCode";
import { SITE_BASE_URL } from "@/lib/projectUrl";
import type { InitialCheckoutMetadataInput } from "@/lib/checkoutMetadata";

export interface InitialPaymentInput {
  /** Product name on the Stripe session, the invoices and Project.planName */
  planName: string;
  /** Total of the project in cents; the customer pays half now */
  totalAmount: number;
  customerName: string;
  /** Lowercased: it becomes Project.email */
  customerEmail: string;
  /** Set when the sale comes from a written quote; the webhook marks it accepted */
  quoteId?: string;
  /** Line-item description under the product name in Checkout */
  description?: string;
  /** Where the customer lands if they leave Checkout */
  cancelUrl: string;
}

/**
 * Creates the Checkout Session for the 50 % deposit of a new project. Nothing
 * is written to the database here: the webhook creates the Project from the
 * session metadata once Stripe confirms the payment. Shared by the public
 * catalogue checkout and by quote acceptance.
 */
export async function createInitialPaymentCheckout(
  input: InitialPaymentInput
): Promise<{ sessionUrl: string; projectCode: string }> {
  const projectCode = await uniqueProjectCode();
  const { deposit, balance } = splitDepositAmount(input.totalAmount);

  // Recorded on the server so the acceptance date is trustworthy
  const termsAcceptedAt = new Date().toISOString();

  const metadata = {
    paymentType: "initial",
    projectCode,
    planName: input.planName,
    customerName: input.customerName,
    customerEmail: input.customerEmail,
    firstPaymentAmount: deposit.toString(),
    secondPaymentAmount: balance.toString(),
    totalAmount: input.totalAmount.toString(),
    termsAcceptedAt,
    ...(input.quoteId && { quoteId: input.quoteId }),
  } satisfies InitialCheckoutMetadataInput;

  const session = await stripe.checkout.sessions.create({
    allowed_payment_method_types: ["card"],
    mode: "payment",
    customer_email: input.customerEmail,
    billing_address_collection: "required",
    metadata,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${input.planName} - Initial Payment (50%)`,
            description:
              input.description ??
              `50% deposit for ${input.planName}; the balance is due on delivery`,
          },
          unit_amount: deposit,
        },
        quantity: 1,
      },
    ],
    automatic_tax: { enabled: true },
    success_url: `${SITE_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&code=${projectCode}`,
    cancel_url: input.cancelUrl,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL");
  }

  return { sessionUrl: session.url, projectCode };
}
