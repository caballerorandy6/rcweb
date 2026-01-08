"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { BlogSubscriptionSchema, BlogSubscriptionData } from "@/lib/zod";
import { toast } from "sonner";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { subscribeToBlogAction } from "@/actions/subscriptions/subscribeToBlogAction";

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
      preferredLanguage: "en",
    },
  });

  const onSubmit: SubmitHandler<BlogSubscriptionData> = async (data) => {
    const toastId = toast.loading("Subscribing...");

    try {
      const result = await subscribeToBlogAction(data);

      if (result.success) {
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
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="w-6 h-6 text-gold" />
          <h3 className="text-xl font-bold text-white font-iceland">
            Subscribe to Blog
          </h3>
        </div>

        <p className="text-gray-400 text-sm font-inter mb-6">
          Get notified when I publish new articles about web development, React,
          Next.js, and more.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="your@email.com"
              className="w-full p-3 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 font-inter placeholder-gray-500"
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

          {/* Language Selection */}
          <div>
            <label className="text-sm text-gray-400 font-inter mb-2 block">
              Email Notifications Language
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  {...register("preferredLanguage")}
                  type="radio"
                  value="en"
                  className="w-4 h-4 text-gold bg-gray-800 border-gray-600 focus:ring-gold/20 focus:ring-2"
                />
                <span className="text-white font-inter text-sm group-hover:text-gold transition-colors">
                  English
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  {...register("preferredLanguage")}
                  type="radio"
                  value="es"
                  className="w-4 h-4 text-gold bg-gray-800 border-gray-600 focus:ring-gold/20 focus:ring-2"
                />
                <span className="text-white font-inter text-sm group-hover:text-gold transition-colors">
                  Español
                </span>
              </label>
            </div>
            <p className="text-gray-500 text-xs font-inter mt-2">
              Blog content is in English. Notifications will be sent in your
              preferred language.
            </p>
            <ErrorMessage
              errors={errors}
              name="preferredLanguage"
              render={({ message }) => (
                <p className="text-red-400 text-sm mt-2 font-inter">
                  {message}
                </p>
              )}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full py-3 text-lg font-semibold text-black bg-gradient-to-r from-gold via-yellow-200 to-gold hover:from-yellow-200 hover:via-gold hover:to-yellow-200 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gold/25 font-inter group overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12 disabled:translate-x-[-100%]"></div>
            <span className="relative flex items-center justify-center">
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </span>
          </button>

          <p className="text-gray-500 text-xs font-inter text-center">
            No spam.{" "}
            <a
              href="/blog/unsubscribe"
              className="text-gold hover:text-yellow-200 transition-colors underline"
            >
              Unsubscribe anytime
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default BlogSubscriptionForm;
