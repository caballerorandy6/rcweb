/**
 * Site navigation. Kept apart from `data.ts` on purpose: the navbar, the
 * scroll spy and the UI store are client code, and importing the whole
 * catalogue (plans, services, portfolio, icons) from them would ship it on
 * every page.
 */
export interface NavigationProps {
  name: string;
  hash: string;
}

// Main navigation - Only essential links (5 max for optimal UX)
export const navigation: NavigationProps[] = [
  { name: "Services", hash: "/#services" },
  { name: "Projects", hash: "/#projects" },
  { name: "Pricing", hash: "/#pricing" },
  { name: "Blog", hash: "/#blog" },
  { name: "About", hash: "/about" },
  { name: "Contact", hash: "/#contact" },
  { name: "CTA", hash: "/#cta" }, // Hidden, used for scroll behavior
];

// Secondary navigation - For footer or "More" menu
export const secondaryNavigation: NavigationProps[] = [
  { name: "Process", hash: "/#process" },
  { name: "FAQ", hash: "/#faq" },
];

// Footer-only navigation
export const footerNavigation: NavigationProps[] = [
  { name: "About", hash: "/about" },
  { name: "Testimonials", hash: "/#testimonials" },
  { name: "Schedule", hash: "/schedule" },
  { name: "Houston, TX", hash: "/web-developer-houston-tx" },
];

export const extraFooterLinks: NavigationProps[] = [
  { name: "Privacy Policy", hash: "/privacy-policy" },
  { name: "Terms of Service", hash: "/terms-of-service" },
  { name: "Refund Policy", hash: "/refund-policy" },
  { name: "Manage Subscription", hash: "/manage-subscription" },
];
