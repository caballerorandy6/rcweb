"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { recordManualPaymentAction } from "@/actions/payments/recordManualPaymentAction";
import { MANUAL_PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/project/paymentMethod";
import { formatCurrency } from "@/lib/utils";
import type { AdminProjectPayment } from "@/types/project";

type RecordPaymentButtonProps = {
  projectId: string;
  payment: Pick<AdminProjectPayment, "id" | "kind" | "amount">;
  /** "Deposit (50%)" / "Final payment (50%)" */
  label: string;
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
export default function RecordPaymentButton({ projectId, payment, label }: RecordPaymentButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const methodRef = useRef<HTMLSelectElement>(null);
  const titleId = `record-payment-${payment.id}`;

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const method = String(data.get("method"));
    const paidOn = String(data.get("paidOn"));
    startTransition(async () => {
      const result = await recordManualPaymentAction(projectId, {
        kind: payment.kind,
        method: method as (typeof MANUAL_PAYMENT_METHODS)[number],
        paidOn,
      });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(
        payment.kind === "final"
          ? "Final payment recorded — project completed"
          : "Deposit recorded"
      );
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
        onClick={() => setOpen(true)}
        className={`${button} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
      >
        <BanknotesIcon className="w-4 h-4" aria-hidden="true" />
        Record payment
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
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

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className={`${button} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
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
