"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { generateProjectCode } from "@/lib/utils";

export interface SplitPaymentResponse {
  success: boolean;
  sessionUrl?: string;
  projectCode?: string;
  error?: string;
}

const PAYMENT_TERMS = {
  INITIAL: 0.5, // 50% upfront
  FINAL: 0.5, // 50% upon completion
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
  }
): Promise<SplitPaymentResponse> {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-08-27.basil",
    });

    // Calcular montos
    const firstPaymentAmount = Math.round(plan.price * PAYMENT_TERMS.INITIAL);
    const secondPaymentAmount = plan.price - firstPaymentAmount;

    // Generar código único de proyecto
    const projectCode = generateProjectCode();

    // Crear registro en BD
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

    // Crear sesión de Stripe con toda la metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerInfo.email,
      // 👇 aquí va
      metadata: {
        paymentId: payment.id,
        projectCode: payment.projectCode,
        paymentType: "initial",
        customerName: customerInfo.name,
        planName: plan.name,
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&code=${projectCode}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/#pricing`,
    });

    // Guardar session ID en BD
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
    console.error("Error creating initial payment:", error);
    return {
      success: false,
      error: "Failed to create initial payment session",
    };
  }
}
