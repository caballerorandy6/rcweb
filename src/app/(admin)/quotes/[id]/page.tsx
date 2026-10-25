import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isQuoteOpen, QUOTE_STATUS_LABELS } from "@/lib/quote/quoteStatus";
import { quoteOfferOptions } from "@/lib/quote/offerOptions";
import { toAdminQuote } from "@/lib/quote/toAdminQuote";
import QuoteForm from "@/components/admin/QuoteForm";
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

  return (
    <QuoteForm mode="edit" offerOptions={quoteOfferOptions} quote={toAdminQuote(quote)} contact={null} />
  );
}
