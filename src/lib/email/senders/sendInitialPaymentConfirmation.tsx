// src/lib/email/senders/sendInitialPaymentConfirmation.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import {
  InitialPaymentConfirmationEmail,
  type InitialPaymentConfirmationEmailProps,
} from "../templates";

export interface SendInitialPaymentConfirmationParams
  extends InitialPaymentConfirmationEmailProps {
  customerEmail: string;
}

export async function sendInitialPaymentConfirmation(
  resend: Resend,
  params: SendInitialPaymentConfirmationParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    planName,
    projectCode,
    firstPaymentAmount,
    secondPaymentAmount,
    totalAmount,
  } = params;

  try {
    const html = await render(
      <InitialPaymentConfirmationEmail
        customerName={customerName}
        planName={planName}
        projectCode={projectCode}
        firstPaymentAmount={firstPaymentAmount}
        secondPaymentAmount={secondPaymentAmount}
        totalAmount={totalAmount}
      />
    );

    await resend.emails.send({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Payment Confirmed - Your Project Code`,
      html,
    });

    console.log(
      "✅ Initial payment confirmation email sent to:",
      customerEmail
    );
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "❌ Error sending initial payment confirmation:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
