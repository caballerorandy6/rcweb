import { createTranslator } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { checkoutPlans } from "@/lib/data";
import { emailTranslator } from "@/lib/email/i18n";
import en from "@/messages/en.json";
import es from "@/messages/es.json";

const MAINTENANCE_PLAN = checkoutPlans.find(
  (p) => p.mode === "subscription"
)?.name;
const MESSAGES = { en, es };

/**
 * `Subscription.planName` is stored in English (the admin reads it, and so
 * does Stripe's metadata); customers see it in their own language. Names from
 * older plans have no translation and are shown as stored.
 */
export function subscriptionPlanName(stored: string, locale: Locale): string {
  if (stored !== MAINTENANCE_PLAN) return stored;
  return emailTranslator(locale)("subscription.maintenancePlanName");
}

/**
 * What the plan includes, exactly as the pricing cards sell it. The success
 * page and the confirmation email read this list instead of keeping copies,
 * so what the customer bought and what they are told they got never drift.
 * Works with no request locale (webhooks).
 */
export function maintenancePlanFeatures(locale: Locale): string[] {
  const t = createTranslator({
    locale,
    messages: MESSAGES[locale],
    namespace: "Catalog",
  });
  return t.raw("offers.maintenance.features") as string[];
}
