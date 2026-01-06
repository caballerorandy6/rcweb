// src/lib/email/senders/sendSetupPasswordEmail.tsx

import { Resend } from "resend";
import { render } from "@react-email/components";
import * as React from "react";
import {
  SetupPasswordEmail,
  type SetupPasswordEmailProps,
} from "../templates";
import { sendEmailWithQuota } from "@/lib/sendEmailWithQuota";

export interface SendSetupPasswordEmailParams
  extends SetupPasswordEmailProps {
  customerEmail: string;
}

export async function sendSetupPasswordEmail(
  params: SendSetupPasswordEmailParams
): Promise<{ success: boolean; error?: string }> {
  const {
    customerEmail,
    customerName,
    setupPasswordUrl,
    projectCode,
    accessToken,
  } = params;

  try {
    const html = await render(
      <SetupPasswordEmail
        customerName={customerName}
        setupPasswordUrl={setupPasswordUrl}
        projectCode={projectCode}
        accessToken={accessToken}
      />
    );

    const result = await sendEmailWithQuota({
      from: "RC Web <no-reply@rcweb.dev>",
      to: customerEmail,
      subject: `Complete Your Account Setup - ${customerName}`,
      html,
    });

    if (result.success) {
      console.log("✅ Setup password email sent to:", customerEmail);
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending setup password email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}

