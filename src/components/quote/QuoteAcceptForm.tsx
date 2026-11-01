"use client";

import { useId, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { acceptQuoteAction } from "@/actions/quotes/acceptQuoteAction";
import { requestZellePaymentAction } from "@/actions/quotes/requestZellePaymentAction";
import { formatCurrency } from "@/lib/utils";

interface QuoteAcceptFormProps {
  token: string;
  /** Cents */
  depositAmount: number;
  /** Zelle is offered when the business has a Zelle contact configured */
  zelleAvailable: boolean;
  /** The customer already chose Zelle: the page shows the instructions above */
  zelleRequested: boolean;
}

/**
 * Terms checkbox + "Accept and pay" button. The server records the
 * acceptance time and sends the customer to Stripe Checkout for the deposit,
 * or, if they prefer Zelle, records the acceptance on the quote and shows
 * the transfer instructions.
 */
export default function QuoteAcceptForm({
  token,
  depositAmount,
  zelleAvailable,
  zelleRequested,
}: QuoteAcceptFormProps) {
  const router = useRouter();
  const t = useTranslations("Quote.form");
  // Choosing Zelle already meant accepting the terms
  const [accepted, setAccepted] = useState(zelleRequested);
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<"card" | "zelle" | null>(null);
  const checkboxId = useId();
  const hintId = useId();

  const handleAccept = () => {
    if (!accepted) return;
    setPendingAction("card");
    startTransition(async () => {
      const result = await acceptQuoteAction(token);
      if (result.success) {
        toast.success(t("redirecting"));
        window.location.href = result.data.sessionUrl;
      } else {
        toast.error(result.error);
        setPendingAction(null);
      }
    });
  };

  const handleZelle = () => {
    if (!accepted) return;
    setPendingAction("zelle");
    startTransition(async () => {
      try {
        const result = await requestZellePaymentAction(token);
        if (result.success) {
          toast.success(t("zelleThanks"));
          router.refresh();
        } else {
          toast.error(result.error);
        }
      } finally {
        setPendingAction(null);
      }
    });
  };

  return (
    <div className="bg-gold/10 border border-gold/40 rounded-xl p-6 mb-8">
      <h2 className="text-xl text-white font-iceland mb-4">
        {zelleRequested ? t("readyCard") : t("ready")}
      </h2>

      <label htmlFor={checkboxId} className="flex gap-3 cursor-pointer font-inter">
        <input
          id={checkboxId}
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          aria-describedby={hintId}
          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-600 bg-gray-900 text-gold focus:ring-gold focus:ring-offset-gray-900"
        />
        <span className="text-gray-300 text-sm">
          {t.rich("agree", {
            terms: (chunks) => (
              <Link href="/terms-of-service" target="_blank" className="text-gold hover:underline">
                {chunks}
              </Link>
            ),
            refund: (chunks) => (
              <Link href="/refund-policy" target="_blank" className="text-gold hover:underline">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <Button onClick={handleAccept} disabled={!accepted || isPending} size="lg">
          <ShieldCheckIcon className="w-5 h-5" aria-hidden="true" />
          {pendingAction === "card"
            ? t("processing")
            : t("accept", { amount: formatCurrency(depositAmount) })}
        </Button>
        <p id={hintId} className="text-gray-500 text-xs font-inter">
          {t("secure")}
        </p>
      </div>

      {zelleAvailable && !zelleRequested ? (
        <div className="mt-4 pt-4 border-t border-gold/20">
          <button
            type="button"
            onClick={handleZelle}
            disabled={!accepted || isPending}
            className="text-sm font-inter text-gold hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
          >
            {pendingAction === "zelle" ? t("oneMoment") : t("zelleAsk")}
          </button>
          <p className="text-gray-500 text-xs font-inter mt-1">
            {t("zelleHint")}
          </p>
        </div>
      ) : null}
    </div>
  );
}
