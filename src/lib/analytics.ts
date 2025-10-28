export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Extend Window interface to include dataLayer
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

// Helper para enviar eventos a GTM dataLayer
const pushToDataLayer = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
};

// Track page views
export const pageview = (url: string) => {
  pushToDataLayer("page_view", {
    page_path: url,
  });
};

// Track custom events (legacy - mantener por compatibilidad)
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
  pushToDataLayer(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Specific event trackers for RC Web Solutions (GTM-ready)

// 1. Contact form submit
export const trackContactFormSubmit = (formLocation: string) => {
  pushToDataLayer("contact_form_submit", {
    form_location: formLocation, // e.g., "homepage", "contact_section"
  });
};

// 2. Quote request
export const trackQuoteRequest = (packageType: string) => {
  pushToDataLayer("quote_request", {
    package_type: packageType, // "starter", "growth", "premium"
  });
};

// 3. Payment complete (Legacy - kept for backward compatibility)
export const trackPaymentComplete = (amount: number, paymentType: string) => {
  pushToDataLayer("purchase", {
    value: amount,
    currency: "USD",
    payment_type: paymentType, // "initial_deposit", "final_payment"
  });
};

// 4. Campaign clicks
export const trackCampaignClick = (
  campaignType: "sms" | "email",
  campaignName?: string
) => {
  event({
    action: "campaign_click",
    category: "marketing",
    label: `${campaignType}${campaignName ? `_${campaignName}` : ""}`,
  });
};

// 5. Portfolio view
export const trackPortfolioView = (projectName?: string) => {
  event({
    action: "portfolio_view",
    category: "engagement",
    label: projectName,
  });
};

// Additional useful events

// Button clicks (CTA)
export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: "button_click",
    category: "engagement",
    label: `${buttonName}_${location}`,
  });
};

// Outbound link clicks
export const trackOutboundClick = (url: string) => {
  event({
    action: "outbound_click",
    category: "engagement",
    label: url,
  });
};

// Email campaign sent (admin action)
export const trackEmailCampaignSent = (recipientCount: number) => {
  event({
    action: "email_campaign_sent",
    category: "marketing_admin",
    label: "campaign",
    value: recipientCount,
  });
};

// SMS campaign sent (admin action)
export const trackSMSCampaignSent = (recipientCount: number) => {
  event({
    action: "sms_campaign_sent",
    category: "marketing_admin",
    label: "campaign",
    value: recipientCount,
  });
};

// Google Ads Conversion Events
// These events match the conversion actions created in Google Ads
// Events are sent to GA4 which then reports to Google Ads

// 1. Manual Contact Event (for phone calls, direct contact)
export const trackManualContact = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Send to GA4 (which Google Ads listens to)
    window.gtag('event', 'manual_event_CONTACT', {
      send_to: GA_MEASUREMENT_ID,
    });
  }
};

// 2. Lead Conversion Event (when a lead is closed/converted)
export const trackLeadConversion = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Send to GA4 (which Google Ads listens to)
    window.gtag('event', 'close_convert_lead', {
      send_to: GA_MEASUREMENT_ID,
    });
  }
};

// 3. Submit Lead Form Event
export const trackSubmitLeadForm = (email?: string, phone?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Send to GA4 (which Google Ads listens to)
    // Event name must match exactly what's in Google Ads: "SUBMIT_LEAD_FORM"
    window.gtag('event', 'SUBMIT_LEAD_FORM', {
      send_to: GA_MEASUREMENT_ID,
      email,
      phone_number: phone,
    });
  }
};

// 4. Purchase Event (for completed payments)
export const trackPurchase = (value: number, currency: string = 'USD', transactionId?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Send to GA4 (which Google Ads listens to)
    window.gtag('event', 'purchase', {
      send_to: GA_MEASUREMENT_ID,
      value,
      currency,
      transaction_id: transactionId,
    });
  }
};

// 5. Qualify Lead Event (when a lead is qualified)
export const trackQualifyLead = () => {
  if (typeof window !== 'undefined' && window.gtag) {
    // Send to GA4 (which Google Ads listens to)
    window.gtag('event', 'qualify_lead', {
      send_to: GA_MEASUREMENT_ID,
    });
  }
};
