"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { BlogSubscriptionSchema, BlogSubscriptionData } from "@/lib/zod";
import { toast } from "sonner";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { subscribeToBlogAction } from "@/actions/subscriptions/subscribeToBlogAction";
import { trackFBLead } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/components/tracking/LinkedInInsightTag";
import { trackSubmitLeadForm } from "@/lib/analytics";

const BlogSubscriptionForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogSubscriptionData>({
    resolver: zodResolver(BlogSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<BlogSubscriptionData> = async (data) => {
    const toastId = toast.loading("Subscribing...");

    try {
      const result = await subscribeToBlogAction(data);

      if (result.success) {
        // Track conversions
        trackFBLead();
        trackLinkedInConversion();
        trackSubmitLeadForm(data.email);

        toast.success(result.message, { id: toastId });
        reset();
      } else {
        toast.error(result.message, { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  return (
    <div id="newsletter" className="w-full max-w-md mx-auto">
      <div className="bg-gray-900/80 backdrop-blur-xs border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="w-6 h-6 text-gold" />
          <h2 className="text-xl font-bold text-white font-iceland">
            Subscribe to Blog
          </h2>
        </div>

        <p className="text-gray-400 text-sm font-inter mb-6">
          Get new articles about web development, React and Next.js, plus
          occasional offers from RC Web Solutions, by email.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="blog-email" className="sr-only">
              Email address
            </label>
            <input
              {...register("email")}
              id="blog-email"
              type="email"
              placeholder="your@email.com"
              aria-label="Email address for blog subscription"
              className="w-full p-3 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-500"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p className="text-red-400 text-sm mt-2 font-inter">
                  {message}
                </p>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </Button>

          <p className="text-gray-500 text-xs font-inter text-center">
            By subscribing you agree to receive emails from RC Web Solutions
            LLC. No spam.{" "}
            <Link
              href="/unsubscribe"
              className="text-gold hover:text-gold-light transition-colors underline"
            >
              Unsubscribe anytime
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default BlogSubscriptionForm;
