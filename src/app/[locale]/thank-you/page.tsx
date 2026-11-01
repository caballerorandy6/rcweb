import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/company";
import type { Locale } from "@/i18n/routing";
import { genPageMetadata } from "@/utils/genPageMetadata";
import { CheckCircleIcon, EnvelopeIcon, ClockIcon } from "@heroicons/react/24/outline";

export async function generateMetadata({ params }: PageProps<"/[locale]/thank-you">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "ThankYou" });
  return genPageMetadata({
    title: t("metadata.title"),
    description: t("metadata.description"),
    locale,
    pathname: "/thank-you",
    noIndex: true,
  });
}

const STEP_ICONS = [EnvelopeIcon, ClockIcon, CheckCircleIcon];

export default async function ThankYouPage() {
  const t = await getTranslations("ThankYou");
  const steps = (t.raw("steps") as { title: string; description: string }[]).map((step, i) => ({
    ...step,
    icon: STEP_ICONS[i],
  }));

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gold/20 rounded-full blur-2xl animate-pulse"></div>
            <CheckCircleIcon className="w-20 h-20 sm:w-24 sm:h-24 text-gold relative" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-linear-to-br from-gray-800/95 to-gray-900/95 rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-2xl border border-gray-700/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-gold text-center mb-4 md:mb-6 font-iceland">
            {t("title")}
          </h1>

          <div className="w-20 sm:w-24 h-1 bg-linear-to-r from-transparent via-gold to-transparent mx-auto mb-6 sm:mb-8 rounded-full"></div>

          <p className="text-lg sm:text-xl text-gray-300 text-center mb-8 sm:mb-10 font-inter">
            {t("received")}
          </p>

          {/* What's Next Section */}
          <div className="space-y-6 mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center mb-4 sm:mb-6 font-inter">
              {t("whatNext")}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {steps.map((step) => (
                <div
                  key={step.title}
                  className="flex items-start space-x-3 sm:space-x-4 p-4 sm:p-5 bg-gray-800/50 rounded-xl border border-gray-700/30 hover:border-gold/30 transition-colors"
                >
                  <div className="shrink-0 mt-0.5 sm:mt-1">
                    <step.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-1 font-inter">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base font-inter">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-900/50 rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-700/30">
            <p className="text-center text-gray-300 mb-3 text-sm sm:text-base font-inter">
              {t("needHelp")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-sm sm:text-base font-inter">
              <a
                href={COMPANY.phoneHref}
                className="text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <span className="mr-2">📱</span>
                {COMPANY.phoneDisplay}
              </a>
              <span className="hidden sm:inline text-gray-600">|</span>
              <a
                href={`mailto:${COMPANY.contactEmail}`}
                className="text-gold hover:text-gold-light transition-colors flex items-center"
              >
                <span className="mr-2">✉️</span>
                {COMPANY.contactEmail}
              </a>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center">
            <Button href="/" size="lg">
              {t("backHome")}
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 sm:mt-8 text-center px-4">
          <p className="text-gray-500 text-xs sm:text-sm font-inter">
            {t("secure")}
          </p>
        </div>
      </div>
    </div>
  );
}
