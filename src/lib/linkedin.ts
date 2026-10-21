declare global {
  interface Window {
    _linkedin_data_partner_ids?: string[];
    lintrk?: (action: string, data?: Record<string, unknown>) => void;
  }
}

// LinkedIn Conversion ID for "Contact Form Lead - rcweb.dev"
// Created in LinkedIn Campaign Manager: Measurement > Conversion tracking
const LINKEDIN_CONVERSION_ID = 26696657;

/** Reports a lead to LinkedIn; a no-op until the Insight Tag has loaded. */
export const trackLinkedInConversion = () => {
  if (typeof window !== "undefined" && window.lintrk) {
    window.lintrk("track", { conversion_id: LINKEDIN_CONVERSION_ID });
  }
};
