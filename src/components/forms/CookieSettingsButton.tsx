"use client";

import { openCookieSettings } from "@/lib/cookieConsent";

interface CookieSettingsButtonProps {
  className?: string;
  children?: React.ReactNode;
}

/** Reopens the cookie banner so visitors can change an earlier choice. */
export default function CookieSettingsButton({
  className,
  children = "Cookie Settings",
}: CookieSettingsButtonProps) {
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      {children}
    </button>
  );
}
