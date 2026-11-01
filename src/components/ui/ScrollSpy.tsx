"use client";

import { useScrollSpy } from "@/hooks/useScrollSpy";
import type { SectionKey } from "@/lib/navigation";

const HOME_SECTIONS: SectionKey[] = [
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
];

export default function ScrollSpy() {
  useScrollSpy(HOME_SECTIONS);

  return null;
}
