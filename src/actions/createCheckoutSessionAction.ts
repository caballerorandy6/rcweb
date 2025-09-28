"use server";

import Stripe from "stripe";

export interface CheckoutSessionResponse {
  success: boolean;
  sessionUrl?: string;
  error?: string;
}

export async function createCheckoutSessionAction({
  plan,
  customer,
  termsAcceptedAt,
  paymentId,
}: {
  plan: {
    name: string;
    price: number;
    description: string;
  };
  customer: {
    email: string;
    name: string;
  };
  termsAcceptedAt: string;
  paymentId: string;
}): Promise<CheckoutSessionResponse> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    const firstPaymentAmount = Math.round(plan.price * 0.5);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customer.email,
      billing_address_collection: "required",
      customer_creation: "always",
      metadata: {
        paymentId,
        paymentType: "initial",
        planName: plan.name,
        planPrice: plan.price.toString(),
        customerName: customer.name,
        customerEmail: customer.email,
        termsAcceptedAt,
        firstPaymentAmount: firstPaymentAmount.toString(),
        secondPaymentAmount: (plan.price - firstPaymentAmount).toString(),
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} - Initial Payment (50%)`,
              description: `Initial payment for ${plan.description}`,
              tax_code: "txcd_10000000",
            },
            unit_amount: firstPaymentAmount,
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true }, // ✅
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
    });

    return {
      success: true,
      sessionUrl: session.url!,
    };
  } catch (error) {
    console.error("❌ Error creating Stripe session:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create checkout session",
    };
  }
}
