"use server";

import { verifyProjectAccessAction } from "@/actions/projects/verifyProjectAccessAction";
import { createFinalPaymentCheckout } from "@/lib/project/finalPaymentCheckout";

interface SplitPaymentResponse {
  success: boolean;
  sessionUrl?: string;
  error?: string;
}

/** Final payment from the manual form: email + project code identify the project. */
export async function createFinalPaymentSessionAction(
  email: string,
  projectCode: string
): Promise<SplitPaymentResponse> {
  try {
    const verification = await verifyProjectAccessAction(email, projectCode);

    if (!verification.success) {
      return { success: false, error: verification.error };
    }

    const sessionUrl = await createFinalPaymentCheckout(
      { ...verification.data.project, email: email.trim().toLowerCase() },
      "form"
    );

    return { success: true, sessionUrl };
  } catch (error) {
    console.error("❌ Error creating final payment:", error);
    return { success: false, error: "Failed to create payment session" };
  }
}
