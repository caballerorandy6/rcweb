"use client";

import { useId, useState, useTransition, type FormEvent, type InputHTMLAttributes } from "react";
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
  // Zelle needs the billing address first: sales tax depends on it
  const [showAddress, setShowAddress] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const checkboxId = useId();
  const hintId = useId();
  const addressId = useId();

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

  const handleZelle = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accepted) return;
    const data = new FormData(event.currentTarget);
    const field = (name: string) => String(data.get(name) ?? "");
    setAddressError(null);
    setPendingAction("zelle");
    startTransition(async () => {
      try {
        const result = await requestZellePaymentAction(token, {
          line1: field("line1"),
          line2: field("line2"),
          city: field("city"),
          state: field("state"),
          postalCode: field("postalCode"),
        });
        if (result.success) {
          toast.success(t("zelleThanks"));
          router.refresh();
        } else {
          setAddressError(result.error);
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
          // The hint is unmounted together with the card button
          aria-describedby={showAddress ? undefined : hintId}
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

      {/* While the Zelle form is open, its submit is the only main button:
          the card button above it read as "send this form" */}
      {showAddress ? null : (
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
      )}

      {zelleAvailable && !zelleRequested ? (
        <div className={showAddress ? "mt-6" : "mt-4 pt-4 border-t border-gold/20"}>
          {showAddress ? (
            <form onSubmit={handleZelle} aria-labelledby={`${addressId}-title`} className="font-inter">
              <h3 id={`${addressId}-title`} className="text-white font-semibold">
                {t("addressTitle")}
              </h3>
              <p className="text-gray-400 text-sm mt-1 mb-4">{t("addressHint")}</p>
              <div className="grid grid-cols-6 gap-3">
                <AddressField id={addressId} name="line1" label={t("line1")} autoComplete="address-line1" className="col-span-6" autoFocus required />
                <AddressField id={addressId} name="line2" label={t("line2")} autoComplete="address-line2" className="col-span-6" />
                <AddressField id={addressId} name="city" label={t("city")} autoComplete="address-level2" className="col-span-6 sm:col-span-3" required />
                <AddressField
                  id={addressId}
                  name="state"
                  label={t("state")}
                  autoComplete="address-level1"
                  className="col-span-2 sm:col-span-1"
                  inputClassName="uppercase"
                  placeholder="TX"
                  maxLength={2}
                  pattern="[A-Za-z]{2}"
                  title={t("stateFormat")}
                  required
                />
                <AddressField
                  id={addressId}
                  name="postalCode"
                  label={t("postalCode")}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  className="col-span-4 sm:col-span-2"
                  maxLength={10}
                  pattern="\d{5}(-\d{4})?"
                  title={t("postalCodeFormat")}
                  required
                />
              </div>
              {addressError ? (
                <p role="alert" className="mt-3 text-sm text-red-400">
                  {addressError}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={!accepted || isPending}>
                  {pendingAction === "zelle" ? t("oneMoment") : t("showZelle")}
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddress(false);
                    setAddressError(null);
                  }}
                  disabled={isPending}
                  className="text-sm text-gray-400 hover:text-white disabled:cursor-not-allowed"
                >
                  {t("cancelZelle")}
                </button>
              </div>
              {!accepted ? (
                <p className="text-gray-500 text-xs mt-2">{t("zelleHint")}</p>
              ) : null}
            </form>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowAddress(true)}
                disabled={!accepted || isPending}
                className="text-sm font-inter text-gold hover:underline disabled:text-gray-500 disabled:no-underline disabled:cursor-not-allowed"
              >
                {t("zelleAsk")}
              </button>
              <p className="text-gray-500 text-xs font-inter mt-1">
                {t("zelleHint")}
              </p>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}

const inputClasses =
  "w-full p-3 bg-gray-800/70 text-white rounded-xl border border-gray-700 placeholder:text-white/40 focus:border-gold focus:outline-hidden focus:ring-2 focus:ring-gold/20 transition";

function AddressField({
  id,
  name,
  label,
  className,
  inputClassName,
  ...input
}: {
  id: string;
  name: string;
  label: string;
  className?: string;
  inputClassName?: string;
} & Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "autoComplete" | "autoFocus" | "inputMode" | "maxLength" | "pattern" | "placeholder" | "required" | "title"
>) {
  return (
    <div className={className}>
      <label htmlFor={`${id}-${name}`} className="block text-sm text-gray-300 mb-1.5 font-medium">
        {label}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        type="text"
        className={`${inputClasses} ${inputClassName ?? ""}`}
        {...input}
      />
    </div>
  );
}
