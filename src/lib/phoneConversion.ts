import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";
import { trackManualContact } from "@/lib/analytics";

/**
 * A click on a phone number, wherever it is: GA4 manual-contact event,
 * Google Ads conversion, Facebook and LinkedIn. One place for the Ads label.
 */
export const trackPhoneConversion = () => {
  trackManualContact();
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "conversion", {
      send_to: "AW-17661176254/wW9-CKCVjLAbEL7TwOVB",
      value: 1.0,
      currency: "USD",
    });
  }
  trackFBPhoneCall();
  trackLinkedInConversion();
};
