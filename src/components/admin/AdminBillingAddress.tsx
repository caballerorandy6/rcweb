"use client";

import { useState, useTransition, type InputHTMLAttributes } from "react";
import { estimateChargeTaxAction } from "@/actions/payments/estimateChargeTaxAction";
import type { BillingAddressInput } from "@/lib/tax/billingAddress";
import { formatCurrency } from "@/lib/utils";

const input =
  "w-full bg-gray-900/60 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-hidden focus:border-gold font-inter text-sm";

const FIELDS = ["line1", "line2", "city", "state", "postalCode"] as const;

/** The address typed in <AdminBillingAddress>, read from the dialog's form */
export function readBillingAddress(data: FormData): BillingAddressInput {
  const field = (name: (typeof FIELDS)[number]) => String(data.get(`billing-${name}`) ?? "");
  return {
    line1: field("line1"),
    line2: field("line2"),
    city: field("city"),
    state: field("state"),
    postalCode: field("postalCode"),
  };
}

type AdminBillingAddressProps = {
  idPrefix: string;
  /** Cents of the charge, before tax */
  amount: number;
  kind: "deposit" | "final";
  /** Tax Stripe calculated for the address, or null when the address changed since */
  onCalculated: (taxCents: number | null) => void;
};

/**
 * Billing address fields for a charge paid outside Stripe when none is on
 * file. "Calculate tax" asks Stripe Tax and hands the amount to the dialog;
 * editing the address afterwards clears it, so the dialog cannot be sent
 * with a tax that belongs to another address.
 */
export default function AdminBillingAddress({ idPrefix, amount, kind, onCalculated }: AdminBillingAddressProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; error: boolean } | null>(null);

  const calculate = (button: HTMLButtonElement) => {
    const form = button.form;
    if (!form) return;
    const required = FIELDS.filter((name) => name !== "line2").map(
      (name) => form.elements.namedItem(`billing-${name}`) as HTMLInputElement
    );
    const firstInvalid = required.find((field) => !field.checkValidity());
    if (firstInvalid) {
      firstInvalid.reportValidity();
      return;
    }
    const address = readBillingAddress(new FormData(form));
    startTransition(async () => {
      const result = await estimateChargeTaxAction({ amount, kind, address });
      if (!result.success) {
        setMessage({ text: result.error, error: true });
        onCalculated(null);
        return;
      }
      setMessage({
        text: `Stripe Tax: ${formatCurrency(result.data.taxAmount)} for ${result.data.place}.`,
        error: false,
      });
      onCalculated(result.data.taxAmount);
    });
  };

  const field = (
    name: (typeof FIELDS)[number],
    label: string,
    props: InputHTMLAttributes<HTMLInputElement> = {}
  ) => (
    <div className={name === "state" ? "w-20 shrink-0" : "flex-1 min-w-0"}>
      <label htmlFor={`${idPrefix}-${name}`} className="block text-xs text-gray-300 mb-1">
        {label}
      </label>
      <input
        id={`${idPrefix}-${name}`}
        name={`billing-${name}`}
        type="text"
        onChange={() => {
          // The calculated tax no longer matches this address
          setMessage(null);
          onCalculated(null);
        }}
        className={input}
        {...props}
      />
    </div>
  );

  return (
    <fieldset className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
      <legend className="px-1 text-xs text-amber-300">Customer billing address</legend>
      <p className="text-xs text-gray-400">
        None on file. Sales tax depends on where the customer is, so enter it to calculate the
        tax and record the sale in Stripe Tax.
      </p>
      {field("line1", "Street address", { required: true, autoComplete: "off" })}
      {field("line2", "Apt, suite (optional)", { autoComplete: "off" })}
      <div className="flex gap-2">
        {field("city", "City", { required: true, autoComplete: "off" })}
        {field("state", "State", {
          required: true,
          maxLength: 2,
          pattern: "[A-Za-z]{2}",
          placeholder: "TX",
          className: `${input} uppercase`,
        })}
        {field("postalCode", "ZIP", {
          required: true,
          inputMode: "numeric",
          pattern: "\\d{5}(-\\d{4})?",
          maxLength: 10,
        })}
      </div>
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          onClick={(event) => calculate(event.currentTarget)}
          disabled={isPending}
          className="inline-flex items-center px-2.5 py-1.5 rounded-lg text-xs font-medium border bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70 disabled:opacity-50"
        >
          {isPending ? "Calculating…" : "Calculate tax"}
        </button>
        {message ? (
          <p role="status" className={`text-xs ${message.error ? "text-red-400" : "text-green-400"}`}>
            {message.text}
          </p>
        ) : null}
      </div>
    </fieldset>
  );
}
