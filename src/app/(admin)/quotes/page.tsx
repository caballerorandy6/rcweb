import Link from "next/link";
import { getAllQuotesAction } from "@/actions/quotes/getAllQuotesAction";
import QuoteManagement from "@/components/admin/QuoteManagement";
import { genPageMetadata } from "@/utils/genPageMetadata";

export const metadata = genPageMetadata({
  title: "Quotes",
  description: "Written quotes for RC Web Solutions LLC projects.",
  pageRoute: "/quotes",
  noIndex: true,
});

// Always rendered per request (the action reads the session from headers);
// without this the build's prerender attempt logs a noisy bailout.
export const dynamic = "force-dynamic";

// The admin layout already checks the session; the action checks it again.
export default async function QuotesPage() {
  const result = await getAllQuotesAction();

  if (!result.success) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-6 font-inter">
        <p className="text-red-400">{result.error}</p>
        <Link href="/admin-dashboard" className="text-gold hover:underline">
          Back to dashboard
        </Link>
      </div>
    );
  }

  return <QuoteManagement quotes={result.data.quotes} />;
}
