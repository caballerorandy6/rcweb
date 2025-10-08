import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/Sections/PrivacyPolicy";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for RC Web Solutions LLC. Learn how we collect, use, and protect your personal data when using our web development services.",
  openGraph: {
    title: "Privacy Policy | RC Web Solutions LLC",
    description:
      "Learn how RC Web Solutions LLC collects, uses, and protects your personal data.",
    url: `${siteConfig.baseUrl}/privacy-policy`,
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | RC Web Solutions LLC",
    description:
      "Learn how RC Web Solutions LLC collects, uses, and protects your personal data.",
  },
  robots: {
    index: true, // Privacy policies should be indexed
    follow: true,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <section id="privacy-policy">
      <PrivacyPolicy />
    </section>
  );
}
