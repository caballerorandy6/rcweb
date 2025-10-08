import TermsOfService from "@/app/components/Sections/TermsOfService";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for RC Web Solutions LLC. Review our service terms, payment conditions, intellectual property rights, warranties, liability, and client responsibilities for web development projects.",
  openGraph: {
    title: "Terms of Service | RC Web Solutions LLC",
    description:
      "Review RC Web Solutions LLC Terms of Service for web development projects and digital services.",
    url: "https://rcweb.dev/terms-of-service",
  },
  twitter: {
    card: "summary",
    title: "Terms of Service | RC Web Solutions LLC",
    description:
      "Review RC Web Solutions LLC Terms of Service for web development projects and digital services.",
  },
  robots: {
    index: true, // Terms of Service should be indexed
    follow: true,
  },
};

export default function TermsOfServicePage() {
  return (
    <section id="terms-of-service">
      <TermsOfService />
    </section>
  );
}
