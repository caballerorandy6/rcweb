import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isQuoteOpen, QUOTE_STATUS_LABELS } from "@/lib/quote/quoteStatus";
import { quoteOfferOptions } from "@/lib/quote/offerOptions";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import QuoteForm from "@/components/admin/QuoteForm";
import CreateProjectFromQuoteButton from "@/components/admin/CreateProjectFromQuoteButton";
import { splitDepositAmount } from "@/lib/project/charges";
import { formatCurrency, formatDate } from "@/lib/utils";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Edit Quote",
  description: "Edit a written quote.",
  pageRoute: "/quotes",
  noIndex: true,
});

type Params = Promise<{ id: string }>;

export default async function EditQuotePage(props: { params: Params }) {
  const { id } = await props.params;

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: { project: { select: { projectCode: true } } },
  });
  if (!quote) notFound();

  if (!isQuoteOpen(quote)) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-inter space-y-3">
        <h1 className="text-3xl text-gold font-iceland">Quote {quote.quoteNumber}</h1>
        <p className="text-gray-300">
          This quote is {QUOTE_STATUS_LABELS[quote.status].toLowerCase()} and can no
          longer be edited.
        </p>
        <Link href="/quotes" className="text-gold hover:underline">
          ← Back to quotes
        </Link>
      </div>
    );
  }

  const adminQuote = toAdminQuote(quote);
  const { deposit } = splitDepositAmount(quote.totalAmount);

  return (
    <>
      {quote.status === "sent" ? (
        <section
          aria-label="Deposit received outside Stripe"
          className="mx-4 sm:mx-6 lg:mx-8 mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4 sm:p-5 font-inter flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <p className="text-sm text-white">
              Did the client pay the {formatCurrency(deposit)} deposit by Zelle or cash?
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {quote.zelleRequestedAt
                ? `The client chose Zelle on ${formatDate(quote.zelleRequestedAt)} and accepted the terms.`
                : "Card payments create the project on their own; only money received outside Stripe needs this."}
            </p>
          </div>
          <CreateProjectFromQuoteButton quote={adminQuote} depositAmount={deposit} />
        </section>
      ) : null}
      <QuoteForm mode="edit" offerOptions={quoteOfferOptions} quote={adminQuote} contact={null} />
    </>
  );
}
