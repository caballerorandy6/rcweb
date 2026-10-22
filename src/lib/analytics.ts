/**
 * Google Analytics 4 / Google Ads events.
 *
 * The site loads gtag.js only (no Google Tag Manager), so every event goes
 * through `gtag('event', …)`. Pushing `{ event }` objects into `dataLayer`
 * would reach nobody. All helpers are browser-only and no-ops on the server;
 * Consent Mode decides whether the hit carries cookies.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

type EventParams = Record<string, string | number | boolean | undefined>;

const sendEvent = (eventName: string, params: EventParams = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", eventName, { send_to: GA_MEASUREMENT_ID, ...params });
};

/** Generic engagement event: `category`/`label` become GA4 event parameters. */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  sendEvent(action, { event_category: category, event_label: label, value });
};

export const trackContactFormSubmit = (formLocation: string) => {
  sendEvent("contact_form_submit", { form_location: formLocation });
};

/**
 * Google Ads conversion "manual_event_CONTACT" (phone calls and other direct
 * contact), imported into Ads from GA4.
 */
export const trackManualContact = () => {
  sendEvent("manual_event_CONTACT");
};

/** Google Ads conversion "close_convert_lead": a lead became a customer. */
export const trackLeadConversion = () => {
  sendEvent("close_convert_lead");
};

/** E.164 as Google expects it for user-provided data; US numbers get +1. */
const toE164 = (phone: string): string | undefined => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return undefined;
};

/**
 * Google Ads conversion "SUBMIT_LEAD_FORM" (name must match the Ads action).
 * Email and phone go through `user_data` (enhanced conversions, hashed by
 * gtag before leaving the browser), never as plain event parameters, since
 * GA4 forbids personally identifiable information in events.
 */
export const trackSubmitLeadForm = (email?: string, phone?: string) => {
  if (typeof window === "undefined" || !window.gtag) return;
  const userData: Record<string, string> = {};
  if (email) userData.email = email.trim().toLowerCase();
  const phoneNumber = phone ? toE164(phone) : undefined;
  if (phoneNumber) userData.phone_number = phoneNumber;
  if (Object.keys(userData).length > 0) {
    window.gtag("set", "user_data", userData);
  }
  sendEvent("SUBMIT_LEAD_FORM");
};

/** GA4 `purchase` event, also the Ads purchase conversion. */
export const trackPurchase = (
  value: number,
  currency: string = "USD",
  transactionId?: string
) => {
  sendEvent("purchase", { value, currency, transaction_id: transactionId });
};
