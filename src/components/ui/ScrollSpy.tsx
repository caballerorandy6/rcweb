"use client";

import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function ScrollSpy() {
  useScrollSpy([
    "home",
    "services",
    "projects",
    "testimonials",
    "process",
    "pricing",
    "faq",
    "experience",
    "about",
    "contact",
    "cta",
  ]);

  return null;
}
