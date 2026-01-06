"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ResetPasswordSchema, type ResetPasswordData } from "@/lib/zod";
import { resetPasswordAction } from "@/actions/auth/resetPasswordAction";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordData> = async (data) => {
    const toastId = toast.loading("Resetting your password...");

    try {
      const result = await resetPasswordAction(data);

      if (result.success) {
        toast.success("Password reset successfully! Redirecting to login...", {
          id: toastId,
        });

        setTimeout(() => {
          router.push("/client/login" as Route);
        }, 1500);
        return;
      }

      const errorMessage = !result.success
        ? result.error
        : "Failed to reset password. Please try again.";
      toast.error(errorMessage, { id: toastId });
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

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
                Reset Password
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
              <p className="text-center text-gray-400 text-sm mt-4 font-inter">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Password Field */}
              <div className="group">
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full p-4 pr-12 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
                    placeholder="New Password (min. 8 characters)"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="password"
                  render={({ message }) => (
                    <p className="text-red-400 text-sm mt-2 font-inter animate-pulse flex items-center">
                      <span className="w-1 h-1 bg-red-400 rounded-full mr-2"></span>
                      {message}
                    </p>
                  )}
                />
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <div className="relative">
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="w-full p-4 pr-12 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold transition-colors"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <ErrorMessage
                  errors={errors}
                  name="confirmPassword"
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
                    {isSubmitting ? "Resetting..." : "Reset Password"}
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
