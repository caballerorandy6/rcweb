import { prisma } from "@/lib/prisma";
import { quoteOfferOptions } from "@/lib/quote/offerOptions";
import QuoteForm from "@/components/admin/QuoteForm";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "New Quote",
  description: "Write a quote for a scoped project.",
  pageRoute: "/quotes/new",
  noIndex: true,
});

type SearchParams = Promise<{ contactId?: string | string[] }>;

// Reached from the Quotes list, the dashboard quick action or a contact row
// (?contactId=… prefills the customer from that lead).
export default async function NewQuotePage(props: { searchParams: SearchParams }) {
  const { contactId } = await props.searchParams;

  const contact =
    typeof contactId === "string"
      ? await prisma.contact.findUnique({
          where: { id: contactId },
          select: {
            id: true,
            name: true,
            serviceInterest: true,
            emails: { select: { email: true }, take: 1 },
          },
        })
      : null;

  return (
    <QuoteForm
      mode="create"
      offerOptions={quoteOfferOptions}
      contact={
        contact
          ? {
              id: contact.id,
              name: contact.name,
              email: contact.emails[0]?.email ?? "",
              serviceInterest: contact.serviceInterest,
            }
          : null
      }
    />
  );
}
