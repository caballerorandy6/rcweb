import { Metadata } from "next";
import ForgotPasswordForm from "@/app/components/client/ForgotPasswordForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata: Metadata = genPageMetadata({
  title: "Forgot Password - Client Portal",
  description: "Request a password reset link for your RC Web Solutions client portal.",
  pageRoute: "/client/forgot-password",
});

export default function ForgotPasswordPage() {
  return (
    <section id="forgot-password">
      <ForgotPasswordForm />
    </section>
  );
}

