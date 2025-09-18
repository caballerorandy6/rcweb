"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { generateProjectCode } from "@/lib/utils";
////import { Resend } from "resend";

////const resend = new Resend(process.env.RESEND_API_KEY!);

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

//Primer Pago - Crear sesión de pago inicial
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

    // Crear sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerInfo.email,
      metadata: {
        paymentId: payment.id,
        projectCode: payment.projectCode,
        paymentType: "initial",
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

    // Guardar session ID
    await prisma.payment.update({
      where: { id: payment.id },
      data: { firstSessionId: session.id },
    });

    // // await resend.emails.send({
    // //   from: "RC Web <no-reply@rcweb.dev>",
    // //   to: customerInfo.email,
    // //   subject: "✅ Payment Confirmed - Save Your Project Code",
    // //   html: `
    // //     <h2>Payment Confirmed!</h2>
    // //     <p>Hi ${customerInfo.name},</p>
    // //     <p>Your initial payment has been processed successfully.</p>

    // //     <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
    // //       <h3>Your Project Code: <code style="font-size: 24px; color: #d97706;">${projectCode}</code></h3>
    // //       <h4>Email Address: <code style="font-size: 18px; color: #2563eb;">${customerInfo.email}</code></h4>
    // //       <p>Save this code! You'll need it for the final payment.</p>
    // //     </div>

    // //     <p><strong>Final Payment Instructions:</strong></p>
    // //     <p>When your project is ready, visit: ${process.env.NEXT_PUBLIC_BASE_URL}/final-payment</p>
    // //     <p>You'll need:</p>
    // //     <ul>
    // //       <li>Your email: ${customerInfo.email}</li>
    // //       <li>Your project code: ${projectCode}</li>
    // //     </ul>

    // //     <p>Thank you for your business!</p>
    // //   `,
    // // });

    return {
      success: true,
      sessionUrl: session.url!,
      projectCode, // Retornar el código para mostrarlo al cliente
    };
  } catch (error) {
    console.error("Error creating initial payment:", error);
    return {
      success: false,
      error: "Failed to create initial payment session",
    };
  }
}
