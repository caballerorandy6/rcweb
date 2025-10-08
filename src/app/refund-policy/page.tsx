import RefundPolicy from "@/app/components/Sections/RefundPolicy";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Refund Policy for RC Web Solutions LLC. Understand our two-payment structure, no-refund policy after first payment, and cancellation terms for web development projects.",
  openGraph: {
    title: "Refund Policy | RC Web Solutions LLC",
    description:
      "Learn about RC Web Solutions LLC refund policy, payment structure, and cancellation terms.",
    url: `${siteConfig.baseUrl}/refund-policy`,
  },
  twitter: {
    card: "summary",
    title: "Refund Policy | RC Web Solutions LLC",
    description:
      "Learn about RC Web Solutions LLC refund policy, payment structure, and cancellation terms.",
  },
  robots: {
    index: true, // Refund policies should be indexed
    follow: true,
  },
};

export default function RefundPolicyPage() {
  return <RefundPolicy />;
}