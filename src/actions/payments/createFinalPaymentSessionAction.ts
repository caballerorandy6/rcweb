"use server";

import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { verifyProjectAccessAction } from "@/actions/projects/verifyProjectAccessAction";
import { openFinalPaymentCheckout } from "@/lib/project/finalPaymentCheckout";
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

    const checkout = await openFinalPaymentCheckout(
      verification.data.project,
      "form",
      (await getLocale()) as Locale
    );

    if (checkout.kind === "paid") {
      const t = await getTranslations("Actions");
      return { success: false, error: t("project.alreadyPaid") };
    }

    return { success: true, data: { sessionUrl: checkout.sessionUrl } };
  } catch (error) {
    console.error("❌ Error creating final payment:", error);
    const t = await getTranslations("Actions");
    return { success: false, error: t("project.sessionFailed") };
  }
}
