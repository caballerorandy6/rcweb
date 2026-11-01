"use client";

import Button from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { buildEmailSchema, type BlogSubscriptionData } from "@/lib/zod";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { subscribeToBlogAction } from "@/actions/subscriptions/subscribeToBlogAction";
import { trackFBLead } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";
import { trackSubmitLeadForm } from "@/lib/analytics";

const BlogSubscriptionForm = () => {
  const t = useTranslations("BlogSubscribe");
  const schema = useMemo(() => buildEmailSchema(t("invalidEmail")), [t]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BlogSubscriptionData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<BlogSubscriptionData> = async (data) => {
    const toastId = toast.loading(t("toasts.subscribing"));

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
      toast.error(t("toasts.failed"), { id: toastId });
    }
  };

  return (
    <div id="newsletter" className="w-full max-w-md mx-auto">
      <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="w-6 h-6 text-gold" />
          <h2 className="text-2xl text-white font-iceland">
            {t("title")}
          </h2>
        </div>

        <p className="text-gray-400 text-sm font-inter mb-6">{t("text")}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="blog-email" className="sr-only">
              {t("email")}
            </label>
            <input
              {...register("email")}
              id="blog-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              aria-required="true"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "blog-email-error" : undefined}
              placeholder={t("placeholder")}
              className="w-full p-3 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-400"
            />
            <ErrorMessage
              errors={errors}
              name="email"
              render={({ message }) => (
                <p id="blog-email-error" role="alert" className="text-red-400 text-sm mt-2 font-inter">
                  {message}
                </p>
              )}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? t("subscribing") : t("subscribe")}
          </Button>

          <p className="text-gray-400 text-xs font-inter text-center">
            {t.rich("consent", {
              link: (chunks) => (
                <Link href="/unsubscribe" className="text-gold hover:text-gold-light transition-colors underline">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </form>
      </div>
    </div>
  );
};

export default BlogSubscriptionForm;
