"use client";

import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { COMPANY } from "@/lib/company";
import Button from "@/components/ui/Button";
import {
  CheckCircleIcon,
  CalendarIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import confetti from "canvas-confetti";
import type { Subscription } from "@/generated/prisma/client";
import { trackLeadConversion, trackPurchase } from "@/lib/analytics";
import { formatCurrency, formatDate as formatDateUtil } from "@/lib/utils";
import { trackFBPurchase } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";

interface SubscriptionSuccessProps {
  subscription?: Subscription | null;
  error?: string;
}

export default function SubscriptionSuccess({
  subscription,
  error,
}: SubscriptionSuccessProps) {
  const t = useTranslations("PaymentSuccess");
  const locale = useLocale();
  useEffect(() => {
    if (subscription && !error) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      trackPurchase(
        subscription.amount / 100,
        subscription.currency,
        subscription.stripeSubscriptionId
      );

      // Track Facebook Pixel Purchase
      trackFBPurchase(subscription.amount / 100, subscription.currency);

      // Track LinkedIn Conversion
      trackLinkedInConversion();

      trackLeadConversion();
    }
  }, [subscription, error]);

  const formatDate = (date: Date | null) => {
    if (!date) return t("subscription.in30Days");
    return formatDateUtil(date, { month: "long", locale });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-24 sm:py-32">
        <div
          className="max-w-md w-full bg-red-900/20 border border-red-500/50 rounded-2xl p-8 text-center animate-enter"
        >
          <div className="text-red-500 mb-4">
            <ExclamationTriangleIcon className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t("subscription.errorTitle")}
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400 mb-6">{t("subscription.errorText")}</p>
          <Button href={`mailto:${COMPANY.contactEmail}`}>{t("support")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center px-4 py-24 sm:py-32">
      <div className="max-w-2xl w-full animate-enter">
        {/* Success Icon */}
        <div className="text-center mb-8 animate-enter [animation-delay:200ms]">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500/20 rounded-full mb-4">
            <CheckCircleIcon className="w-16 h-16 text-green-500" />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-gray-800/50 backdrop-blur-xs rounded-2xl p-8 border border-gold/20">
          <h1 className="text-4xl font-bold text-gold text-center mb-4">
            {t("subscription.title")}
          </h1>

          <p className="text-gray-300 text-center mb-8 font-inter">{t("subscription.thanks")}</p>

          {/* Subscription Details */}
          {subscription && (
            <div className="space-y-4 mb-8 animate-enter [animation-delay:300ms]">
              {/* Plan Info */}
              <div className="bg-linear-to-r from-gold/20 to-yellow-500/20 rounded-xl p-6 border border-gold/30">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCardIcon className="w-6 h-6 text-gold" />
                  <span className="text-lg font-semibold text-gold">
                    {subscription.planName}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">{t("subscription.monthly")}</span>
                    <p className="text-white font-semibold text-lg">
                      {formatCurrency(subscription.amount)}{t("subscription.perMonth")}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">{t("subscription.status")}</span>
                    <p className="text-green-500 font-semibold capitalize">
                      {subscription.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Info */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="text-gray-400 text-sm">{t("subscription.nextBilling")}</span>
                    <p className="text-white font-medium">
                      {formatDate(subscription.currentPeriodEnd)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">{t("subscription.email")}</span>
                    <p className="text-white">{subscription.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">{t("subscription.id")}</span>
                    <p className="text-gray-300 font-mono text-xs truncate">
                      {subscription.stripeSubscriptionId}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* What's Included */}
          <div className="bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-500/30 font-inter">
            <h3 className="text-blue-400 font-semibold mb-3">{t("subscription.includedTitle")}</h3>
            <ul className="text-sm text-gray-300 space-y-2">
              {(t.raw("subscription.included") as string[]).map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 font-inter">
            <Button href="/" className="flex-1">
              {t("home")}
            </Button>
            <Button href={`mailto:${COMPANY.contactEmail}`} variant="secondary" className="flex-1">
              {t("support")}
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 text-sm mt-6 font-inter mx-auto">{t("footer")}</p>
      </div>
    </div>
  );
}
