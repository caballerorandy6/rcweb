"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  EnvelopeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { unsubscribeFromBlogAction } from "@/actions/subscriptions/unsubscribeFromBlogAction";

const unsubscribeSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type UnsubscribeFormData = z.infer<typeof unsubscribeSchema>;

export default function BlogUnsubscribeForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email");
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<UnsubscribeFormData>({
    resolver: zodResolver(unsubscribeSchema),
    defaultValues: {
      email: emailFromUrl || "",
    },
  });

  // Set email from URL if available
  if (emailFromUrl && !isUnsubscribed) {
    setValue("email", emailFromUrl);
  }

  const onSubmit: SubmitHandler<UnsubscribeFormData> = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Unsubscribing...");

    try {
      const result = await unsubscribeFromBlogAction(data.email);

      if (result.success) {
        toast.success(
          "Successfully unsubscribed from blog notifications.",
          { id: toastId }
        );
        setIsUnsubscribed(true);
      } else {
        toast.error(
          result.error || "Failed to unsubscribe. Please try again.",
          { id: toastId }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 lg:p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircleIcon className="w-16 h-16 text-green-400" />
        </div>
        <h1 className="text-3xl md:text-4xl text-gold font-bold font-iceland mb-4">
          Successfully Unsubscribed
        </h1>
        <p className="text-gray-400 font-inter text-lg mb-6">
          You have been successfully unsubscribed from our blog notifications.
          You will no longer receive emails when we publish new blog posts.
        </p>
        <p className="text-gray-500 font-inter text-sm">
          Changed your mind? You can resubscribe anytime from our{" "}
          <a
            href="/blog#newsletter"
            className="text-gold hover:text-yellow-200 transition-colors underline"
          >
            blog page
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 p-8 lg:p-12 rounded-2xl shadow-2xl backdrop-blur-sm border border-gray-700/50">
      <div className="flex items-center gap-3 mb-6">
        <EnvelopeIcon className="w-8 h-8 text-gold" />
        <h1 className="text-3xl md:text-4xl text-gold font-bold font-iceland">
          Unsubscribe from Blog
        </h1>
      </div>

      <p className="text-gray-400 font-inter text-base mb-8">
        Enter your email address to unsubscribe from blog notifications. You
        will no longer receive emails when we publish new blog posts.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-400 mb-2 font-inter"
          >
            Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="your@email.com"
            className="w-full p-4 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-500"
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-2 font-inter">
              {errors.email.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="relative w-full py-4 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 disabled:translate-x-[-100%]"></div>
          <span className="relative flex items-center justify-center">
            {isSubmitting ? "Unsubscribing..." : "Unsubscribe"}
          </span>
        </button>

        <p className="text-gray-500 text-xs font-inter text-center">
          You can resubscribe anytime from our{" "}
          <a
            href="/blog#newsletter"
            className="text-gold hover:text-yellow-200 transition-colors underline"
          >
            blog page
          </a>
          .
        </p>
      </form>
    </div>
  );
}

