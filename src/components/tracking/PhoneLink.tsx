"use client";

import type { ReactNode } from "react";
import { trackFBPhoneCall } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";

// Phone Conversion Tracking (Google Ads + Facebook + LinkedIn)
const trackPhoneConversion = () => {
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

interface PhoneLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/** tel: link that reports the call as a conversion; the only client bit of the Hero */
export default function PhoneLink({ href, className, children }: PhoneLinkProps) {
  return (
    <a href={href} onClick={trackPhoneConversion} className={className}>
      {children}
    </a>
  );
}
