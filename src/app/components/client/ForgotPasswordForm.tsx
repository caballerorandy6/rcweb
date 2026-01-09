"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import type { Route } from "next";
import {
  ResetPasswordRequestSchema,
  type ResetPasswordRequestData,
} from "@/lib/zod";
import { requestResetPasswordAction } from "@/actions/auth/requestResetPasswordAction";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!error) return;

    const errorMessages: Record<string, string> = {
      "missing-token": "Reset link is missing. Please request a new one.",
      "invalid-token":
        "Invalid or expired reset link. Please request a new one.",
    };

    const errorMessage =
      errorMessages[error] ?? "An error occurred. Please try again.";

    toast.error(errorMessage);
    // Clean URL
    router.replace("/client/forgot-password" as Route);
  }, [error, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordRequestData>({
    resolver: zodResolver(ResetPasswordRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordRequestData> = async (data) => {
    const toastId = toast.loading("Sending reset link...");

    try {
      const result = await requestResetPasswordAction(data);

      if (result.success) {
        toast.success(
          "If an account exists with this email, you will receive a password reset link.",
          { id: toastId }
        );
        setEmailSent(true);
      } else if (!result.success) {
        toast.error(
          result.error || "Failed to send reset link. Please try again.",
          { id: toastId }
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
        <div className="w-full max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 rounded-2xl blur-xl"></div>

            <div className="relative space-y-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gold/30 transition-all duration-500">
              <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

              <div className="relative text-center">
                <h2 className="text-4xl md:text-5xl text-gold font-bold font-iceland tracking-wide mb-4">
                  Check Your Email
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
                <p className="text-gray-400 text-sm mt-4 font-inter">
                  We've sent a password reset link to your email address. Please
                  check your inbox and follow the instructions.
                </p>
                <p className="text-gray-500 text-xs mt-4 font-inter">
                  Didn't receive the email? Check your spam folder or{" "}
                  <Link
                    href="/client/forgot-password"
                    className="text-gold hover:text-yellow-200 transition-colors"
                  >
                    try again
                  </Link>
                  .
                </p>
                <div className="mt-6">
                  <Link
                    href="/client/login"
                    className="relative inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                    <span className="relative flex items-center justify-center">
                      Back to Login
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-purple-500/5 rounded-2xl blur-xl"></div>

          <div className="relative space-y-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 hover:border-gold/30 transition-all duration-500">
            <div className="absolute top-0 left-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 bg-purple-500/10 rounded-full blur-2xl"></div>

            <div className="relative">
              <h2 className="text-4xl md:text-5xl text-gold font-bold text-center font-iceland tracking-wide">
                Forgot Password
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
              <p className="text-center text-gray-400 text-sm mt-4 font-inter">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <div className="relative">
                  <input
                    {...register("email")}
                    type="text"
                    id="email"
                    className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
                    placeholder="Email"
                    autoComplete="email"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="email"
                  render={({ message }) => (
                    <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {message}
                    </p>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="relative w-full py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                  <span className="relative flex items-center justify-center">
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                    {!isSubmitting && (
                      <svg
                        className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="text-center">
              <p className="text-gray-500 text-xs font-inter">
                Remember your password?{" "}
                <Link
                  href="/client/login"
                  className="text-gold hover:text-yellow-200 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
