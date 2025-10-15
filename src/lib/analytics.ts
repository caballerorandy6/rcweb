export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
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
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Specific event trackers for RC Web Solutions

// 1. Contact form submit
export const trackContactFormSubmit = (formLocation: string) => {
  event({
    action: "contact_form_submitted",
    category: "lead_generation",
    label: formLocation, // e.g., "homepage", "services_page"
  });
};

// 2. Quote request
export const trackQuoteRequest = (packageType: string) => {
  event({
    action: "quote_requested",
    category: "lead_generation",
    label: packageType, // "starter", "growth", "premium"
  });
};

// 3. Payment complete
export const trackPaymentComplete = (amount: number, paymentType: string) => {
  event({
    action: "purchase",
    category: "ecommerce",
    label: paymentType, // "initial_deposit", "final_payment"
    value: amount,
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
