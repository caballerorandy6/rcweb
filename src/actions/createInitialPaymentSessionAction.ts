"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { generateProjectCode } from "@/lib/utils";

export interface SplitPaymentResponse {
  success: boolean;
  sessionUrl?: string;
  projectCode?: string;
  paymentId?: string;
  error?: string;
}

const PAYMENT_TERMS = {
  INITIAL: 0.5,
  FINAL: 0.5,
};

export async function createInitialPaymentSessionAction(
  plan: {
    name: string;
    price: number;
    description: string;
  },
  customerInfo: {
    email: string;
    name: string;
  },
  options?: { onlyCreateRecord?: boolean }
): Promise<SplitPaymentResponse> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    // calcular montos
    const firstPaymentAmount = Math.round(plan.price * PAYMENT_TERMS.INITIAL);
    const secondPaymentAmount = plan.price - firstPaymentAmount;
    const projectCode = generateProjectCode();

    // guardar en BD
    const payment = await prisma.payment.create({
      data: {
        projectCode,
        email: customerInfo.email,
        name: customerInfo.name,
        planName: plan.name,
        totalAmount: plan.price,
        firstPayment: firstPaymentAmount,
        secondPayment: secondPaymentAmount,
      },
    });

    if (options?.onlyCreateRecord) {
      return {
        success: true,
        paymentId: payment.id,
        projectCode,
      };
    }

    // crear sesión Stripe con toda la metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerInfo.email,
      metadata: {
        paymentId: payment.id,
        projectCode,
        paymentType: "initial",
        planName: plan.name,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} - Initial Payment (50%)`,
              description: `Initial payment for ${plan.description}`,
            },
            unit_amount: firstPaymentAmount,
          },
          quantity: 1,
        },
      ],
      automatic_tax: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&code=${projectCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
    });

    // actualizar con el id de la sesión
    await prisma.payment.update({
      where: { id: payment.id },
      data: { firstSessionId: session.id },
    });

    return {
      success: true,
      sessionUrl: session.url!,
      projectCode,
    };
  } catch (error) {
    console.error("❌ Error creando sesión inicial:", error);
    return {
      success: false,
      error: "Failed to create initial payment session",
    };
  }
}
