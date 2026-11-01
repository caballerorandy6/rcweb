import type { Href } from "@/i18n/navigation";

/**
 * Site navigation. Kept apart from `data.ts` on purpose: the navbar, the
 * scroll spy and the UI store are client code, and importing the whole
 * catalogue (plans, services, portfolio, icons) from them would ship it on
 * every page.
 *
 * Items carry a stable `key` (also the message key under `Nav`) and a
 * locale-aware `href`; the visible label comes from the dictionary.
 */
export type NavKey =
  | "home"
  | "services"
  | "projects"
  | "pricing"
  | "blog"
  | "about"
  | "contact"
  | "process"
  | "faq"
  | "testimonials"
  | "schedule"
  | "houston"
  | "privacy"
  | "terms"
  | "refund"
  | "manageSubscription"
  | "privacyChoices";

export interface NavigationItem {
  key: NavKey;
  href: Href;
}

/** Home sections highlighted by the scroll spy (ids of the `<section>`s) */
export type SectionKey =
  | NavKey
  | "cta"
  | "experience"
  | "certifications";

const section = (hash: string): Href => ({ pathname: "/", hash });

// Main navigation - Only essential links (5 max for optimal UX)
export const navigation: NavigationItem[] = [
  { key: "services", href: section("services") },
  { key: "projects", href: section("projects") },
  { key: "pricing", href: section("pricing") },
  { key: "blog", href: section("blog") },
  { key: "about", href: "/about" },
];

export const contactItem: NavigationItem = { key: "contact", href: section("contact") };

// Secondary navigation - For footer or "More" menu
export const secondaryNavigation: NavigationItem[] = [
  { key: "process", href: section("process") },
  { key: "faq", href: section("faq") },
];

// Footer-only navigation
export const footerNavigation: NavigationItem[] = [
  { key: "about", href: "/about" },
  { key: "testimonials", href: section("testimonials") },
  { key: "schedule", href: "/schedule" },
  { key: "houston", href: "/web-developer-houston-tx" },
];

export const extraFooterLinks: NavigationItem[] = [
  { key: "privacy", href: "/privacy-policy" },
  { key: "terms", href: "/terms-of-service" },
  { key: "refund", href: "/refund-policy" },
  { key: "manageSubscription", href: "/manage-subscription" },
  { key: "privacyChoices", href: { pathname: "/privacy-policy", hash: "cookies" } },
];
