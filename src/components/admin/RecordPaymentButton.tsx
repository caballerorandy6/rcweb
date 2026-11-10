"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { recordManualPaymentAction } from "@/actions/payments/recordManualPaymentAction";
import {
  previewChargeTaxAction,
  type ChargeTaxPreview,
} from "@/actions/payments/previewChargeTaxAction";
import AdminBillingAddress, { readBillingAddress } from "@/components/admin/AdminBillingAddress";
import { MANUAL_PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/project/paymentMethod";
import type { OffStripeTax } from "@/lib/tax/stripeTax";
import { formatCurrency } from "@/lib/utils";
import type { AdminProjectPayment } from "@/types/project";

type RecordPaymentButtonProps = {
  projectId: string;
  payment: Pick<AdminProjectPayment, "id" | "kind" | "amount">;
  /** "Deposit (50%)" / "Final payment (50%)" */
  label: string;
  /** No usable address on file: the admin types it and calculates before recording */
  hasBillingAddress: boolean;
};

const button =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

/** Today as YYYY-MM-DD in the admin's timezone, for the date input */
function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * Records a charge paid outside Stripe (Zelle, cash…). The form only
 * renders while the dialog is open so the default date is computed in the
 * browser, never during SSR.
 */
export default function RecordPaymentButton({
  projectId,
  payment,
  label,
  hasBillingAddress,
}: RecordPaymentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const methodRef = useRef<HTMLSelectElement>(null);
  const titleId = `record-payment-${payment.id}`;
  const needsAddress = !hasBillingAddress;
  const [taxDollars, setTaxDollars] = useState("0");
  const [preview, setPreview] = useState<ChargeTaxPreview | "loading" | null>(null);
  // Stripe Tax's calculation behind the suggested amount (address on file or
  // the one typed below); the action records it instead of calculating again
  const [calculation, setCalculation] = useState<OffStripeTax | null>(null);
  // Each opening gets a number so a preview from a dialog that was closed or
  // reopened meanwhile cannot overwrite the current one
  const openSeq = useRef(0);

  // Suggest the tax Stripe calculates for the billing address on file
  const openDialog = async () => {
    const seq = ++openSeq.current;
    setOpen(true);
    setTaxDollars("0");
    setCalculation(null);
    if (needsAddress) {
      setPreview(null);
      return;
    }
    setPreview("loading");
    const result = await previewChargeTaxAction(projectId, payment.kind);
    if (seq !== openSeq.current) return;
    if (!result.success) {
      setPreview({ taxAmount: null, reason: result.error });
      return;
    }
    setPreview(result.data);
    if (result.data.taxAmount !== null) {
      setTaxDollars((result.data.taxAmount / 100).toFixed(2));
      setCalculation({ calculationId: result.data.calculationId, taxAmount: result.data.taxAmount });
    }
  };

  const closeDialog = () => {
    openSeq.current += 1;
    setOpen(false);
  };

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const method = String(data.get("method"));
    const paidOn = String(data.get("paidOn"));
    const taxCents = Math.round(Number(data.get("taxDollars")) * 100);
    startTransition(async () => {
      const result = await recordManualPaymentAction(projectId, {
        kind: payment.kind,
        method: method as (typeof MANUAL_PAYMENT_METHODS)[number],
        paidOn,
        taxCents,
        ...(calculation ? { calculation } : {}),
        ...(needsAddress ? { billingAddress: readBillingAddress(data) } : {}),
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      closeDialog();
      toast.success(
        payment.kind === "final"
          ? "Final payment recorded — project completed"
          : "Deposit recorded"
      );
      if (result.data.taxWarning) {
        toast.warning("Sale not recorded in Stripe Tax", {
          description: result.data.taxWarning,
          duration: 15_000,
        });
      }
      if (result.data.invoiceErrors.length > 0) {
        toast.warning("Payment recorded, but an invoice could not be sent", {
          description: result.data.invoiceErrors.join(" · "),
        });
      } else {
        toast.info("Invoice emailed to the client");
      }
      router.refresh();
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className={`${button} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
      >
        <BanknotesIcon className="w-4 h-4" aria-hidden="true" />
        Record payment
      </button>

      <Modal
        open={open}
        onClose={closeDialog}
        preventClose={isPending}
        initialFocus={methodRef}
        aria-labelledby={titleId}
        className="m-auto w-[calc(100%-2rem)] max-w-sm bg-transparent p-0 text-inherit backdrop:bg-black/70 backdrop:backdrop-blur-xs"
      >
        {open ? (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              submit(event.currentTarget);
            }}
            className="bg-gray-900/95 rounded-2xl p-6 border border-gold/20 shadow-2xl space-y-4 font-inter"
          >
            <div>
              <h2 id={titleId} className="text-xl text-gold font-iceland">
                Record payment received outside Stripe
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                {label} · <span className="font-semibold text-white">{formatCurrency(payment.amount)}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Marks the charge as paid
                {payment.kind === "final" ? ", completes the project" : ""} and emails the
                invoice to the client. No charge is made.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor={`${titleId}-method`} className="block text-xs text-gray-300">
                Paid by
              </label>
              <select
                id={`${titleId}-method`}
                name="method"
                ref={methodRef}
                required
                defaultValue="zelle"
                className={input}
              >
                {MANUAL_PAYMENT_METHODS.map((method) => (
                  <option key={method} value={method}>
                    {PAYMENT_METHOD_LABELS[method]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor={`${titleId}-date`} className="block text-xs text-gray-300">
                Date received
              </label>
              <input
                id={`${titleId}-date`}
                name="paidOn"
                type="date"
                required
                defaultValue={todayIso()}
                max={todayIso()}
                className={input}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor={`${titleId}-tax`} className="block text-xs text-gray-300">
                Sales tax included (USD)
              </label>
              <input
                id={`${titleId}-tax`}
                name="taxDollars"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={taxDollars}
                onChange={(event) => setTaxDollars(event.target.value)}
                aria-describedby={`${titleId}-tax-note`}
                required
                className={input}
              />
              <p id={`${titleId}-tax-note`} className="text-xs text-gray-500" aria-live="polite">
                {needsAddress ? (
                  calculation === null ? (
                    "Enter the billing address below and calculate the tax."
                  ) : (
                    "Calculated by Stripe Tax for the address below. Change it only if the customer sent a different amount."
                  )
                ) : preview === "loading" ? (
                  "Calculating with Stripe Tax…"
                ) : preview && preview.taxAmount !== null ? (
                  <>
                    Calculated by Stripe Tax for {preview.place}. Change it only if the customer
                    sent a different amount; the sale is recorded in Stripe Tax when it matches.
                  </>
                ) : (
                  <>
                    {preview ? `${preview.reason}. ` : ""}Enter the tax the customer sent, if any.
                    It goes on the invoice; the sale will not be recorded in Stripe Tax.
                  </>
                )}
              </p>
            </div>

            {needsAddress ? (
              <AdminBillingAddress
                idPrefix={`${titleId}-billing`}
                amount={payment.amount}
                kind={payment.kind}
                onCalculated={(tax) => {
                  setCalculation(tax);
                  if (tax) setTaxDollars((tax.taxAmount / 100).toFixed(2));
                }}
              />
            ) : null}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDialog}
                disabled={isPending}
                className={`${button} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending || preview === "loading" || (needsAddress && calculation === null)}
                className={`${button} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
              >
                {isPending ? "Recording…" : "Record payment"}
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </>
  );
}
