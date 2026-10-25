"use client";

import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import WhatsAppIcon from "@/components/icons/WhatsApp";
import { COMPANY } from "@/lib/company";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackManualContact } from "@/lib/analytics";
import { trackLinkedInConversion } from "@/lib/linkedin";

// Phone Conversion Tracking (Google Ads + Facebook + LinkedIn)
const trackPhoneConversion = () => {
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

/** The direct ways to reach Randy; a client island only for the call tracking */
export default function ScheduleChannels() {
  return (
    <div className="flex flex-col gap-3">
      <Button href={COMPANY.phoneHref} onClick={trackPhoneConversion} size="lg" fullWidth>
        <PhoneIcon className="h-5 w-5" aria-hidden="true" />
        Call {COMPANY.phoneDisplay}
      </Button>
      <Button
        href={COMPANY.whatsappHref}
        variant="secondary"
        size="lg"
        fullWidth
        external
      >
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </Button>
      <Button
        href={`mailto:${COMPANY.contactEmail}`}
        variant="secondary"
        size="lg"
        fullWidth
      >
        <EnvelopeIcon className="h-5 w-5" aria-hidden="true" />
        {COMPANY.contactEmail}
      </Button>
    </div>
  );
}
