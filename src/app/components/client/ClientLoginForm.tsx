"use client";

import LoginForm from "@/app/components/auth/LoginForm";
import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ClientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (!error) return;

    const errorMessages: Record<string, string> = {
      "missing-token": "Setup link is missing. Please check your email.",
      "invalid-token":
        "Invalid or expired setup link. Please request a new one.",
      "password-already-set": "Password has already been set. Please sign in.",
    };

    const errorMessage =
      errorMessages[error] ?? "An error occurred. Please try again.";

    toast.error(errorMessage);
    // Clean URL
    router.replace("/client/login" as Route);
  }, [error, router]);

  const handleSuccess = () => {
    setTimeout(() => {
      window.location.href = "/client/dashboard";
    }, 100);
  };

  return (
    <LoginForm
      title="Client Login"
      subtitle="Access your client portal"
      redirectPath={"/client/dashboard" as Route}
      footerText={
        <>
          <Link
            href="/client/forgot-password"
            className="text-gold hover:text-yellow-200 transition-colors block mb-2"
          >
            Forgot your password?
          </Link>
          <p className="text-gray-500 text-xs font-inter">
            Don't have an account?{" "}
            <Link
              href="/client/register"
              className="text-gold hover:text-yellow-200 transition-colors font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </>
      }
      onSuccess={handleSuccess}
    />
  );
}
