import type { Metadata } from "next";
import PrivacyPolicy from "@/app/components/Sections/PrivacyPolicy";

export const metadata: Metadata = {
  title: "Privacy Policy - RC Web Solutions LLC",
  description:
    "Read our Privacy Policy for RC Web Solutions LLC: how we collect, use and protect your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <section id="privacy-policy">
      <PrivacyPolicy />
    </section>
  );
}
