"use server";

import { verifyProjectAccessAction } from "@/actions/projects/verifyProjectAccessAction";
import { createFinalPaymentCheckout } from "@/lib/project/finalPaymentCheckout";
import type { ActionResult } from "@/types/common";

/** Final payment from the manual form: email + project code identify the project. */
export async function createFinalPaymentSessionAction(
  email: string,
  projectCode: string
): Promise<ActionResult<{ sessionUrl: string }>> {
  try {
    const verification = await verifyProjectAccessAction(email, projectCode);

    if (!verification.success) {
      return { success: false, error: verification.error };
    }

    const sessionUrl = await createFinalPaymentCheckout(
      verification.data.project,
      "form"
    );

    return { success: true, data: { sessionUrl } };
  } catch (error) {
    console.error("❌ Error creating final payment:", error);
    return { success: false, error: "Failed to create payment session" };
  }
}
