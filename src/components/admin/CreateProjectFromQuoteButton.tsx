"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BanknotesIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Modal from "@/components/ui/Modal";
import { createProjectFromQuoteAction } from "@/actions/quotes/createProjectFromQuoteAction";
import { MANUAL_PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from "@/lib/project/paymentMethod";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { AdminQuote } from "@/types/quote";

type CreateProjectFromQuoteButtonProps = {
  quote: Pick<
    AdminQuote,
    "id" | "quoteNumber" | "name" | "totalAmount" | "zelleRequestedAt" | "termsAcceptedAt"
  >;
  /** Cents: the 50 % the customer sent */
  depositAmount: number;
};

const button =
  "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap";
const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

/** Today as YYYY-MM-DD in the admin's timezone, for the date input */
function todayIso(): string {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

/**
 * "Deposit received": the customer paid the deposit of this quote outside
 * Stripe, so the admin creates the project by hand. The form only renders
 * while the dialog is open so the default date is computed in the browser.
 */
export default function CreateProjectFromQuoteButton({
  quote,
  depositAmount,
}: CreateProjectFromQuoteButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const methodRef = useRef<HTMLSelectElement>(null);
  const titleId = `deposit-received-${quote.id}`;

  const submit = (form: HTMLFormElement) => {
    const data = new FormData(form);
    const method = String(data.get("method")) as (typeof MANUAL_PAYMENT_METHODS)[number];
    const paidOn = String(data.get("paidOn"));
    startTransition(async () => {
      const result = await createProjectFromQuoteAction(quote.id, { method, paidOn });
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      setOpen(false);
      toast.success(`Project ${result.data.projectCode} created from ${quote.quoteNumber}`);
      if (result.data.invoiceErrors.length > 0) {
        toast.warning("Project created, but the invoice could not be sent", {
          description: result.data.invoiceErrors.join(" · "),
        });
      } else {
        toast.info("Invoice and progress link emailed to the client");
      }
      router.push(`/projects/${result.data.projectId}`);
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
        <BanknotesIcon className="w-5 h-5" aria-hidden="true" />
        Deposit received, create project
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
                Deposit received outside Stripe
              </h2>
              <p className="text-sm text-gray-300 mt-1">
                {quote.quoteNumber} · {quote.name} ·{" "}
                <span className="font-semibold text-white">{formatCurrency(depositAmount)}</span> of{" "}
                {formatCurrency(quote.totalAmount)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Creates the project with the deposit paid and the balance pending, marks the
                quote accepted and the lead won, and emails the client the invoice with their
                progress link. No charge is made.
              </p>
            </div>

            {quote.termsAcceptedAt ? (
              <p className="text-xs text-green-400">
                Terms accepted on the quote page on {formatDate(quote.termsAcceptedAt)}
                {quote.zelleRequestedAt ? " · Zelle requested" : ""}.
              </p>
            ) : (
              <p className="flex gap-2 text-xs text-amber-400">
                <ExclamationTriangleIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                The client has not accepted the terms on the quote page. The project will
                be created without a terms record; ask them to accept it there if you can.
              </p>
            )}

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
                {isPending ? "Creating…" : "Create project"}
              </button>
            </div>
          </form>
        ) : null}
      </Modal>
    </>
  );
}
