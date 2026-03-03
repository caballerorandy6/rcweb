"use client";

import { useState, useEffect } from "react";

interface UseExitIntentOptions {
  threshold?: number;
  delayMs?: number;
  cookieName?: string;
  cookieExpiryDays?: number;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    threshold = 50,
    delayMs = 5000,
    cookieName = "exit-intent-shown",
    cookieExpiryDays = 7,
  } = options;

  const [showPopup, setShowPopup] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const wasRecentlyShown = () => {
    if (typeof window === "undefined") return true;

    const lastShown = localStorage.getItem(cookieName);
    if (!lastShown) return false;

    const lastShownDate = new Date(parseInt(lastShown));
    const expiryDate = new Date(
      lastShownDate.getTime() + cookieExpiryDays * 24 * 60 * 60 * 1000
    );

    return new Date() < expiryDate;
  };

  const markAsShown = () => {
    if (typeof window === "undefined") return;
    localStorage.setItem(cookieName, Date.now().toString());
  };

  const closePopup = () => {
    setShowPopup(false);
    markAsShown();
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't run on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) return;

    // Don't show if recently shown
    if (wasRecentlyShown()) return;

    // Enable after delay
    const enableTimer = setTimeout(() => {
      setIsEnabled(true);
    }, delayMs);

    return () => clearTimeout(enableTimer);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= threshold && !showPopup) {
        setShowPopup(true);
        markAsShown();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isEnabled, showPopup, threshold]);

  return { showPopup, closePopup };
}
