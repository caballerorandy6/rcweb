"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { toast } from "sonner";
import { sendPortalLinkAction } from "@/actions/subscriptions/sendPortalLinkAction";
import { ManageSubscriptionSchema, ManageSubscriptionData } from "@/lib/zod";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function ManageSubscription() {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ManageSubscriptionData>({
    resolver: zodResolver(ManageSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ManageSubscriptionData> = async (data) => {
    const toastId = toast.loading("Sending management link...");

    const result = await sendPortalLinkAction(data.email);

    if (result.success) {
      toast.success("Check your email for the management link!", { id: toastId });
      setIsSuccess(true);
      reset();
    } else if (!result.success) {
      toast.error(result.error || "An error occurred. Please try again.", { id: toastId });
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

            {/* Header */}
            <div className="relative">
              <h1 className="text-4xl md:text-5xl text-gold font-bold text-center font-iceland tracking-wide">
                Manage Subscription
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-4 rounded-full"></div>
              <p className="text-center text-gray-400 text-sm mt-4 font-inter">
                Enter your email to receive a secure management link
              </p>
            </div>

            {isSuccess ? (
              /* Success State */
              <div className="relative text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                  <CheckCircleIcon className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold font-iceland text-white mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-400 font-inter mb-6">
                  If you have an active subscription, we&apos;ve sent a secure link to manage it.
                  The link will expire in 24 hours.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-gold hover:text-yellow-400 font-inter font-medium transition-colors"
                >
                  Send another link
                </button>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
                {/* Email Field */}
                <div className="group">
                  <div className="relative">
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-400 hover:bg-gray-800 peer backdrop-blur-sm"
                      placeholder="your@email.com"
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
                      {isSubmitting ? "Sending..." : "Send Management Link"}
                      {!isSubmitting && (
                        <svg
                          className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            )}

            {/* Help Text */}
            <div className="relative pt-6 border-t border-gray-700/50">
              <h3 className="text-sm font-medium font-inter text-gray-300 mb-3">
                What can you do with the management link?
              </h3>
              <ul className="space-y-2 text-sm text-gray-400 font-inter">
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  Update your payment method
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  View your billing history and invoices
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold mt-0.5">•</span>
                  Cancel your subscription at any time
                </li>
              </ul>
            </div>

            {/* Footer */}
            <div className="relative text-center">
              <p className="text-gray-500 text-xs font-inter">
                Need help?{" "}
                <a
                  href="mailto:contactus@rcweb.dev"
                  className="text-gold hover:text-yellow-400 transition-colors"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
