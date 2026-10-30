"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { toast } from "sonner";
import {
  BanknotesIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  PaperAirplaneIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getQuoteUrl } from "@/lib/projectUrl";
import { QUOTE_STATUS_LABELS, type QuoteDisplayStatus } from "@/lib/quote/quoteStatus";
import { sendQuoteAction } from "@/actions/quotes/sendQuoteAction";
import { cancelQuoteAction } from "@/actions/quotes/cancelQuoteAction";
import type { AdminQuote } from "@/types/quote";

type QuoteManagementProps = {
  quotes: AdminQuote[];
};

const STATUS_CLASSES: Record<QuoteDisplayStatus, string> = {
  draft: "bg-gray-500/10 text-gray-300 border-gray-500/40",
  sent: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  expired: "bg-amber-500/10 text-amber-400 border-amber-500/40",
  accepted: "bg-green-500/10 text-green-400 border-green-500/40",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/40",
};

const iconButton =
  "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

/** List of quotes with their lifecycle actions. Data comes from the Server Component; actions refresh it. */
export default function QuoteManagement({ quotes }: QuoteManagementProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState<{ id: string; action: "send" | "cancel" } | null>(null);
  const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);

  const open = quotes.filter((q) => q.displayStatus === "sent");
  const stats = {
    open: open.length,
    openValue: open.reduce((sum, q) => sum + q.totalAmount, 0),
    drafts: quotes.filter((q) => q.displayStatus === "draft").length,
    accepted: quotes.filter((q) => q.displayStatus === "accepted").length,
    expired: quotes.filter((q) => q.displayStatus === "expired").length,
  };

  const run = (quoteId: string, action: "send" | "cancel", work: () => Promise<void>) => {
    setBusy({ id: quoteId, action });
    startTransition(async () => {
      try {
        await work();
      } finally {
        setBusy(null);
      }
    });
  };

  const handleSend = (quote: AdminQuote) =>
    run(quote.id, "send", async () => {
      const result = await sendQuoteAction(quote.id);
      if (result.success) {
        toast.success(`Quote ${quote.quoteNumber} sent to ${quote.email}`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });

  const handleCancel = (quote: AdminQuote) =>
    run(quote.id, "cancel", async () => {
      setConfirmCancelId(null);
      const result = await cancelQuoteAction(quote.id);
      if (result.success) {
        toast.success(`Quote ${quote.quoteNumber} cancelled`);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });

  const handleCopyLink = async (quote: AdminQuote) => {
    try {
      await navigator.clipboard.writeText(getQuoteUrl(quote.token));
      toast.success("Quote link copied");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-gold font-iceland mb-2">Quotes</h1>
          <p className="text-base sm:text-lg text-gray-400 font-inter">
            Written quotes: send the link, the customer accepts and pays the deposit
          </p>
        </div>
        <Button href="/quotes/new" size="sm" className="self-start sm:self-auto">
          + New Quote
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-inter">
        <StatCard label="Open" value={String(stats.open)} hint={formatCurrency(stats.openValue, true)} accent="blue" />
        <StatCard label="Drafts" value={String(stats.drafts)} accent="gray" />
        <StatCard label="Accepted" value={String(stats.accepted)} accent="green" />
        <StatCard label="Expired" value={String(stats.expired)} accent="amber" />
      </div>

      <div className="bg-linear-to-br from-gray-800/80 to-gray-900/80 border border-gray-700/50 rounded-xl overflow-hidden shadow-xl shadow-black/20 font-inter">
        {quotes.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            <p className="mb-4">No quotes yet.</p>
            <Button href="/quotes/new" size="sm">
              Write the first quote
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-700/80 to-gray-800/80 text-left border-b border-gray-700/50">
                  <Th>Quote</Th>
                  <Th>Client</Th>
                  <Th className="hidden md:table-cell">Project</Th>
                  <Th className="hidden lg:table-cell">Total</Th>
                  <Th>Status</Th>
                  <Th className="hidden lg:table-cell">Dates</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                {quotes.map((quote) => {
                  const isOpen = quote.status === "draft" || quote.status === "sent";
                  const rowBusy = isPending && busy?.id === quote.id;
                  const sending = rowBusy && busy?.action === "send";
                  const cancelling = rowBusy && busy?.action === "cancel";
                  return (
                    <tr key={quote.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <span className="font-mono text-sm font-semibold text-gold whitespace-nowrap">{quote.quoteNumber}</span>
                        {quote.projectCode ? (
                          <div className="text-xs text-gray-400 mt-1">
                            Project <span className="font-mono text-green-400">{quote.projectCode}</span>
                          </div>
                        ) : null}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <div className="text-sm text-white font-semibold">{quote.name}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[160px] sm:max-w-none">{quote.email}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">{quote.planName}</div>
                        <div className="lg:hidden text-xs font-semibold text-gold mt-1">
                          {formatCurrency(quote.totalAmount)}
                        </div>
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 align-top text-sm text-white">{quote.planName}</td>
                      <td className="hidden lg:table-cell px-6 py-4 align-top text-sm text-white font-semibold">
                        {formatCurrency(quote.totalAmount)}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_CLASSES[quote.displayStatus]}`}
                        >
                          {QUOTE_STATUS_LABELS[quote.displayStatus]}
                        </span>
                        {quote.status === "sent" ? (
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                            <EyeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            {quote.viewedAt ? `Opened ${formatDate(quote.viewedAt)}` : "Not opened yet"}
                          </div>
                        ) : null}
                        {quote.status === "sent" && quote.zelleRequestedAt ? (
                          <div className="flex items-center gap-1 text-xs text-gold mt-1.5">
                            <BanknotesIcon className="w-3.5 h-3.5" aria-hidden="true" />
                            Zelle requested {formatDate(quote.zelleRequestedAt)}
                          </div>
                        ) : null}
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 align-top text-xs text-gray-400 space-y-1">
                        <div>Created {formatDate(quote.createdAt)}</div>
                        {quote.sentAt ? <div>Sent {formatDate(quote.sentAt)}</div> : null}
                        {quote.expiresAt && quote.status === "sent" ? (
                          <div>
                            {quote.displayStatus === "expired" ? "Expired" : "Expires"} {formatDate(quote.expiresAt)}
                          </div>
                        ) : null}
                        {quote.acceptedAt ? <div>Accepted {formatDate(quote.acceptedAt)}</div> : null}
                      </td>
                      <td className="px-4 sm:px-6 py-4 align-top min-w-[14rem]">
                        <div className="flex flex-wrap gap-2">
                          {isOpen ? (
                            <button
                              type="button"
                              onClick={() => handleSend(quote)}
                              disabled={rowBusy}
                              className={`${iconButton} bg-gold/10 text-gold border-gold/30 hover:bg-gold/20`}
                            >
                              <PaperAirplaneIcon className="w-4 h-4" aria-hidden="true" />
                              {sending ? "Sending…" : quote.status === "sent" ? "Resend" : "Send"}
                            </button>
                          ) : null}
                          {quote.status !== "draft" ? (
                            <button
                              type="button"
                              onClick={() => handleCopyLink(quote)}
                              className={`${iconButton} bg-gray-700/40 text-gray-200 border-gray-600 hover:bg-gray-700/70`}
                            >
                              <ClipboardDocumentIcon className="w-4 h-4" aria-hidden="true" />
                              Copy link
                            </button>
                          ) : null}
                          {isOpen ? (
                            <Link
                              href={`/quotes/${quote.id}` as Route}
                              className={`${iconButton} bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20`}
                            >
                              <PencilSquareIcon className="w-4 h-4" aria-hidden="true" />
                              Edit
                            </Link>
                          ) : null}
                          {isOpen && confirmCancelId !== quote.id ? (
                            <button
                              type="button"
                              onClick={() => setConfirmCancelId(quote.id)}
                              disabled={rowBusy}
                              className={`${iconButton} bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20`}
                            >
                              <XMarkIcon className="w-4 h-4" aria-hidden="true" />
                              Cancel
                            </button>
                          ) : null}
                          {isOpen && confirmCancelId === quote.id ? (
                            <span className="flex flex-wrap items-center gap-2 text-xs text-gray-300 basis-full">
                              Withdraw this quote?
                              <button
                                type="button"
                                onClick={() => handleCancel(quote)}
                                disabled={rowBusy}
                                className={`${iconButton} bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30`}
                              >
                                {cancelling ? "Cancelling…" : "Yes, cancel"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmCancelId(null)}
                                disabled={rowBusy}
                                className={`${iconButton} bg-gray-700/40 text-gray-300 border-gray-600`}
                              >
                                Keep
                              </button>
                            </span>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={`px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-gold uppercase tracking-wider ${className}`}
    >
      {children}
    </th>
  );
}

const ACCENTS = {
  blue: "border-blue-500/20 hover:border-blue-500/40 text-blue-400",
  gray: "border-gray-500/20 hover:border-gray-500/40 text-gray-200",
  green: "border-green-500/20 hover:border-green-500/40 text-green-400",
  amber: "border-amber-500/20 hover:border-amber-500/40 text-amber-400",
} as const;

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: keyof typeof ACCENTS;
}) {
  return (
    <div
      className={`bg-linear-to-br from-gray-800/80 to-gray-900/80 border rounded-xl p-4 sm:p-6 shadow-lg shadow-black/20 transition-colors duration-300 ${ACCENTS[accent]}`}
    >
      <h3 className="text-gray-400 text-xs sm:text-sm mb-2 font-medium">{label}</h3>
      <p className="text-2xl sm:text-3xl font-iceland">{value}</p>
      {hint ? <p className="text-xs text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}
