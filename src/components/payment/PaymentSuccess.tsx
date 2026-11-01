"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { COMPANY } from "@/lib/company";
import { useRouter } from "@/i18n/navigation";
import Button from "@/components/ui/Button";
import {
  ArrowPathIcon,
  CheckCircleIcon,
  DocumentDuplicateIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import type { PaymentSuccessData } from "@/types/project";
import { trackLeadConversion, trackPurchase } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { trackFBPurchase } from "@/components/tracking/FacebookPixel";
import { trackLinkedInConversion } from "@/lib/linkedin";

interface PaymentSuccessClientProps {
  project?: PaymentSuccessData | null;
  error?: string;
  projectCode?: string;
  /** Stripe confirmed the payment but the webhook has not written the project yet */
  processing?: boolean;
}

export default function PaymentSuccess({
  project,
  error,
  projectCode,
  processing,
}: PaymentSuccessClientProps) {
  const t = useTranslations("PaymentSuccess");
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (project && !error) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Track purchase conversion (deposit paid)
      const paymentAmount = project.depositAmount;

      trackPurchase(
        paymentAmount / 100, // Convert cents to dollars
        'USD',
        project.stripeSessionId ?? undefined
      );

      // Track Facebook Pixel Purchase
      trackFBPurchase(paymentAmount / 100, 'USD');

      // Track LinkedIn Conversion
      trackLinkedInConversion();

      // Track lead conversion (payment completed = lead converted to customer)
      trackLeadConversion();
    }
  }, [project, error]);

  const copyToClipboard = () => {
    if (projectCode) {
      navigator.clipboard.writeText(projectCode);
      setCopied(true);
      toast.success(t("copied"));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-24 sm:py-32">
        <div className="max-w-md w-full bg-gray-800/50 border border-gold/30 rounded-2xl p-8 text-center animate-enter">
          <div className="text-gold mb-4">
            <ArrowPathIcon className="w-16 h-16 mx-auto animate-spin [animation-duration:3s]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {t("processing.title")}
          </h2>
          <p className="text-gray-300 mb-6 font-inter">{t("processing.text")}</p>
          {projectCode && (
            <p className="text-sm text-gray-400 mb-6 font-inter">
              {t.rich("processing.code", {
                code: () => (
                  <span className="font-mono font-bold text-gold tracking-wider">{projectCode}</span>
                ),
              })}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 font-inter">
            <Button onClick={() => router.refresh()} className="flex-1">
              {t("processing.checkAgain")}
            </Button>
            <Button href={`mailto:${COMPANY.contactEmail}`} variant="secondary" className="flex-1">
              {t("support")}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-6 font-inter">{t("processing.invoice")}</p>
        </div>
      </div>
    );
  }

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
            {t("error.title")}
          </h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <p className="text-sm text-gray-400 mb-6">{t("error.text")}</p>
          <Button href={`mailto:${COMPANY.contactEmail}`}>{t("support")}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-900 to-black flex items-center justify-center px-4  py-24 sm:py-32">
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
            {t("title")}
          </h1>

          <p className="text-gray-300 text-center mb-8 font-inter">{t("thanks")}</p>

          {/* Project Code Display */}
          {projectCode && (
            <div
              className="bg-linear-to-r from-gold/20 to-yellow-500/20 rounded-xl p-6 mb-8 border border-gold/30 font-inter flex flex-col items-center animate-enter [animation-delay:400ms]"
            >
              <p className="text-sm text-gold mb-2 text-center uppercase tracking-wide">
                {t("codeLabel")}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-mono font-bold text-gold tracking-wider">
                  {projectCode}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gold/20 rounded-lg transition-colors"
                  title={t("copy")}
                  aria-label={t("copy")}
                >
                  <DocumentDuplicateIcon
                    className={`w-6 h-6 ${copied ? "text-green-500" : "text-gold"}`}
                  />
                </button>
              </div>
              <p className="text-xs text-center mt-3 text-gray-400">
                {t("saveCode")}
              </p>
            </div>
          )}

          {/* Payment Details */}
          {project && (
            <div className="space-y-3 mb-8 font-inter">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t("plan")}</span>
                <span className="text-white font-medium">
                  {project.planName}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t("paid")}</span>
                <span className="text-green-500 font-medium">
                  {formatCurrency(project.depositAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t("remaining")}</span>
                <span className="text-yellow-500 font-medium">
                  {formatCurrency(project.finalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{t("status")}</span>
                <span className="text-blue-500 font-medium">{t("inProgress")}</span>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-500/30 font-inter">
            <h3 className="text-blue-400 font-semibold mb-2">{t("next.title")}</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              {(t.raw("next.items") as string[]).map((item) => (
                <li key={item}>• {item}</li>
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
