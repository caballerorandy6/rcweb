"use client";

import type { ReactNode } from "react";
import { trackPhoneConversion } from "@/lib/phoneConversion";

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
