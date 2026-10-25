"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { QuoteInputSchema, type QuoteInput, type QuoteData } from "@/lib/zod";
import { createQuoteAction } from "@/actions/quotes/createQuoteAction";
import { updateQuoteAction } from "@/actions/quotes/updateQuoteAction";
import { sendQuoteAction } from "@/actions/quotes/sendQuoteAction";
import { QUOTE_VALIDITY_DAYS } from "@/lib/quote/quoteStatus";
import type { QuoteOfferOption } from "@/lib/quote/offerOptions";
import type { AdminQuote } from "@/types/quote";

type PrefillContact = {
  id: string;
  name: string;
  email: string;
  serviceInterest: string | null;
};

type QuoteFormProps = {
  offerOptions: QuoteOfferOption[];
  /** Lead the quote is written for (from /quotes/new?contactId=…) */
  contact: PrefillContact | null;
} & ({ mode: "create"; quote?: undefined } | { mode: "edit"; quote: AdminQuote });

const inputClass =
  "w-full p-3 bg-gray-800/80 text-white rounded-xl border border-gray-700/60 focus:outline-hidden focus:border-gold focus:ring-2 focus:ring-gold/20 transition duration-300 font-inter placeholder-gray-500 hover:bg-gray-800";
const labelClass = "block text-sm text-gray-300 font-inter mb-1.5";
const errorClass = "mt-1.5 text-sm text-red-400 font-inter";

function isKnownOffer(options: QuoteOfferOption[], id: string | null): id is QuoteOfferOption["id"] {
  return options.some((option) => option.id === id);
}

export default function QuoteForm(props: QuoteFormProps) {
  const { offerOptions, contact, mode } = props;
  const quote = props.mode === "edit" ? props.quote : undefined;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // A lead's "Interested in" offer prefills the select and suggests title and price
  const leadOffer = isKnownOffer(offerOptions, contact?.serviceInterest ?? null)
    ? offerOptions.find((option) => option.id === contact!.serviceInterest)
    : undefined;
  const prefillOffer = quote?.offerId ?? leadOffer?.id ?? "";

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<QuoteInput, unknown, QuoteData>({
    resolver: zodResolver(QuoteInputSchema),
    defaultValues: {
      name: quote?.name ?? contact?.name ?? "",
      email: quote?.email ?? contact?.email ?? "",
      offerId: (prefillOffer ?? "") as QuoteInput["offerId"],
      planName: quote?.planName ?? leadOffer?.title ?? "",
      scope: quote?.scope.join("\n") ?? "",
      notes: quote?.notes ?? "",
      totalDollars: quote ? quote.totalAmount / 100 : leadOffer ? leadOffer.priceFromCents / 100 : "",
      contactId: quote?.contactId ?? contact?.id ?? undefined,
    },
  });

  // Picking an offer suggests its title and starting price; typed values win
  const handleOfferChange = (offerId: string) => {
    const offer = offerOptions.find((option) => option.id === offerId);
    if (!offer) return;
    const { planName, totalDollars } = getValues();
    const previous = offerOptions.find((option) => option.title === planName);
    if (!planName || previous) setValue("planName", offer.title, { shouldDirty: true });
    if (totalDollars === "" || totalDollars === undefined) {
      setValue("totalDollars", offer.priceFromCents / 100, { shouldDirty: true });
    }
  };

  const submit = (send: boolean) =>
    handleSubmit(() => {
      // The actions re-validate the raw form values with the same schema
      const input = getValues();
      startTransition(async () => {
        if (mode === "create") {
          const result = await createQuoteAction(input, { send });
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          const { quote: saved, emailError } = result.data;
          if (send && emailError) {
            toast.warning(`Quote ${saved.quoteNumber} saved as a draft, but the email failed`, {
              description: emailError,
            });
          } else if (send) {
            toast.success(`Quote ${saved.quoteNumber} sent to ${saved.email}`);
          } else {
            toast.success(`Quote ${saved.quoteNumber} saved as a draft`);
          }
        } else {
          const result = await updateQuoteAction(quote!.id, input);
          if (!result.success) {
            toast.error(result.error);
            return;
          }
          if (send) {
            const sent = await sendQuoteAction(quote!.id);
            if (!sent.success) {
              toast.warning("Changes saved, but the email failed", { description: sent.error });
            } else {
              toast.success(`Quote ${quote!.quoteNumber} sent to ${sent.data.quote.email}`);
            }
          } else {
            toast.success("Quote updated");
          }
        }
        router.push("/quotes");
        router.refresh();
      });
    })();

  const sendLabel =
    mode === "create" ? "Save & Send" : quote!.status === "sent" ? "Save & Resend" : "Save & Send";

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-3xl">
      <div>
        <Link href="/quotes" className="text-sm text-gray-400 hover:text-gold font-inter">
          ← Quotes
        </Link>
        <h1 className="text-3xl sm:text-4xl text-gold font-iceland mt-2">
          {mode === "create" ? "New Quote" : `Edit Quote ${quote!.quoteNumber}`}
        </h1>
        <p className="text-gray-400 font-inter mt-1">
          The customer gets a link to read the scope, accept the terms and pay the 50 %
          deposit. Quotes stay valid for {QUOTE_VALIDITY_DAYS} days after sending.
        </p>
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submit(false);
        }}
        className="space-y-6 bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl p-5 sm:p-6"
      >
        <input type="hidden" {...register("contactId")} />

        <fieldset className="grid sm:grid-cols-2 gap-4">
          <legend className="sr-only">Customer</legend>
          <div>
            <label htmlFor="quote-name" className={labelClass}>
              Customer name
            </label>
            <input
              id="quote-name"
              {...register("name")}
              autoComplete="off"
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? "quote-name-error" : undefined}
              className={inputClass}
            />
            {errors.name ? (
              <p id="quote-name-error" className={errorClass}>
                {errors.name.message}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="quote-email" className={labelClass}>
              Customer email
            </label>
            <input
              id="quote-email"
              type="email"
              inputMode="email"
              {...register("email")}
              autoComplete="off"
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "quote-email-error" : undefined}
              className={inputClass}
            />
            {errors.email ? (
              <p id="quote-email-error" className={errorClass}>
                {errors.email.message}
              </p>
            ) : null}
          </div>
        </fieldset>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quote-offer" className={labelClass}>
              Based on
            </label>
            <select
              id="quote-offer"
              {...register("offerId", {
                onChange: (event) => handleOfferChange(event.target.value),
              })}
              className={inputClass}
            >
              <option value="">Custom quote</option>
              {offerOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="quote-total" className={labelClass}>
              Total (USD)
            </label>
            <input
              id="quote-total"
              type="number"
              inputMode="decimal"
              min={100}
              step={50}
              {...register("totalDollars")}
              aria-invalid={errors.totalDollars ? true : undefined}
              aria-describedby="quote-total-hint"
              className={inputClass}
            />
            <p id="quote-total-hint" className={errors.totalDollars ? errorClass : "mt-1.5 text-xs text-gray-500 font-inter"}>
              {errors.totalDollars?.message ?? "The deposit is half; the balance is due on delivery."}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="quote-plan" className={labelClass}>
            Project name
          </label>
          <input
            id="quote-plan"
            {...register("planName")}
            placeholder="Website Redesign for Ana's Bakery"
            aria-invalid={errors.planName ? true : undefined}
            aria-describedby={errors.planName ? "quote-plan-error" : "quote-plan-hint"}
            className={inputClass}
          />
          {errors.planName ? (
            <p id="quote-plan-error" className={errorClass}>
              {errors.planName.message}
            </p>
          ) : (
            <p id="quote-plan-hint" className="mt-1.5 text-xs text-gray-500 font-inter">
              Shown on the Stripe checkout, the invoices and the project.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-scope" className={labelClass}>
            What&apos;s included
          </label>
          <textarea
            id="quote-scope"
            {...register("scope")}
            rows={7}
            placeholder={"One item per line:\nMigrate the current 8 pages\nNew mobile-first design\n45 days of post-launch support"}
            aria-invalid={errors.scope ? true : undefined}
            aria-describedby={errors.scope ? "quote-scope-error" : "quote-scope-hint"}
            className={`${inputClass} resize-y`}
          />
          {errors.scope ? (
            <p id="quote-scope-error" className={errorClass}>
              {errors.scope.message}
            </p>
          ) : (
            <p id="quote-scope-hint" className="mt-1.5 text-xs text-gray-500 font-inter">
              One item per line. Leading dashes or bullets are removed.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="quote-notes" className={labelClass}>
            Notes <span className="text-gray-500">(optional)</span>
          </label>
          <textarea
            id="quote-notes"
            {...register("notes")}
            rows={3}
            placeholder="Timeline, assumptions, what is not included…"
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? "quote-notes-error" : undefined}
            className={`${inputClass} resize-y`}
          />
          {errors.notes ? (
            <p id="quote-notes-error" className={errorClass}>
              {errors.notes.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button type="button" onClick={() => submit(true)} disabled={isPending}>
            <PaperAirplaneIcon className="w-5 h-5" aria-hidden="true" />
            {isPending ? "Saving…" : sendLabel}
          </Button>
          <Button type="submit" variant="secondary" disabled={isPending}>
            {mode === "create" ? "Save as Draft" : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
