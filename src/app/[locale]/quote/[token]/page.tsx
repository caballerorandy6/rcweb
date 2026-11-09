import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import PageMessages from "@/components/layout/PageMessages";
import type { Locale } from "@/i18n/routing";
import { after } from "next/server";
import { Link } from "@/i18n/navigation";
import {
  BanknotesIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  UserIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { prisma } from "@/lib/prisma";
import { COMPANY, ZELLE_PAYMENT, isZelleAvailable } from "@/lib/company";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEPOSIT_PERCENT, splitDepositAmount } from "@/lib/project/charges";
import { getQuoteDisplayStatus } from "@/lib/quote/quoteStatus";
import QuoteAcceptForm from "@/components/quote/QuoteAcceptForm";

type Props = PageProps<"/[locale]/quote/[token]">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: "Quote" });
  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    robots: { index: false, follow: false },
  };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Public quote page: the token is the only credential. Drafts are not
// visible; sent quotes can be accepted until they expire.
export default async function QuotePage({ params }: Props) {
  const { token, locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  if (!UUID.test(token)) notFound();
  const t = await getTranslations("Quote");
  const date = (value: Date, month?: "long") => formatDate(value, { locale, month });

  const quote = await prisma.quote.findUnique({
    where: { token },
    include: { project: { select: { projectCode: true, accessToken: true } } },
  });
  if (!quote || quote.status === "draft") notFound();

  // First visit: record it without holding up the response
  if (!quote.viewedAt) {
    after(async () => {
      await prisma.quote.updateMany({
        where: { id: quote.id, viewedAt: null },
        data: { viewedAt: new Date() },
      });
    });
  }

  const status = getQuoteDisplayStatus(quote);
  const { deposit, balance } = splitDepositAmount(quote.totalAmount);
  // Sales tax calculated when the customer chose Zelle (0 before, or outside Texas)
  const zelleTax = quote.zelleTaxAmount ?? 0;
  const validUntil = quote.expiresAt ? date(quote.expiresAt, "long") : null;

  return (
    <div className="min-h-screen bg-gray-900 pt-28 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-sm uppercase tracking-wider text-gray-500 font-inter mb-2">
            {t("number", { number: quote.quoteNumber })}
          </p>
          <h1 className="text-4xl text-gold font-iceland mb-2">{quote.planName}</h1>
          <p className="text-gray-400 font-inter">
            {t("preparedFor", { name: quote.name })}
            {validUntil && status === "sent" && ` · ${t("validUntil", { date: validUntil })}`}
          </p>
        </div>

        {/* Status notices */}
        {status === "accepted" && (
          <div className="bg-green-500/10 border border-green-500/40 rounded-xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <CheckCircleIcon className="w-8 h-8 text-green-400 shrink-0" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-white font-semibold font-inter">{t("accepted.title")}</p>
              <p className="text-gray-400 text-sm font-inter">
                {t("accepted.thanks")}
                {quote.acceptedAt && t("accepted.on", { date: date(quote.acceptedAt) })}
                {quote.project && (
                  <>
                    {t("accepted.code")}{" "}
                    <span className="font-mono text-gold">{quote.project.projectCode}</span>
                  </>
                )}
                .
              </p>
            </div>
            {quote.project && (
              <Link
                href={{
                  pathname: "/project/[accessToken]",
                  params: { accessToken: quote.project.accessToken },
                }}
                className="text-gold hover:underline font-inter text-sm whitespace-nowrap"
              >
                {t("accepted.track")}
              </Link>
            )}
          </div>
        )}

        {status === "expired" && (
          <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-6 mb-8 flex gap-4">
            <ClockIcon className="w-8 h-8 text-amber-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-white font-semibold font-inter">{t("expired.title")}</p>
              <p className="text-gray-400 text-sm font-inter">
                {t("expired.text", { date: validUntil ?? "" })}{" "}
                <a href={`mailto:${COMPANY.contactEmail}`} className="text-gold hover:underline">
                  {COMPANY.contactEmail}
                </a>{" "}
                {t("expired.send")}
              </p>
            </div>
          </div>
        )}

        {status === "cancelled" && (
          <div className="bg-gray-700/40 border border-gray-600 rounded-xl p-6 mb-8 flex gap-4">
            <XCircleIcon className="w-8 h-8 text-gray-400 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-white font-semibold font-inter">{t("cancelled.title")}</p>
              <p className="text-gray-400 text-sm font-inter">
                {t("cancelled.text")}{" "}
                <a href={`mailto:${COMPANY.contactEmail}`} className="text-gold hover:underline">
                  {COMPANY.contactEmail}
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">{t("client")}</p>
                <p className="text-white font-inter">{quote.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-purple-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-inter">{t("project")}</p>
                <p className="text-white font-inter">{quote.planName}</p>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-500 font-inter">{t("total")}</p>
              <p className="text-2xl text-gold font-iceland">
                {formatCurrency(quote.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Scope */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl text-white font-iceland mb-4">{t("included")}</h2>
          <ul className="space-y-3">
            {quote.scope.map((item, index) => (
              <li key={index} className="flex gap-3 text-gray-300 font-inter">
                <CheckCircleIcon
                  className="w-5 h-5 text-gold shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {quote.notes ? (
            <>
              <hr className="border-gray-700 my-6" />
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-inter mb-2">
                {t("notes")}
              </h3>
              <p className="text-gray-300 font-inter whitespace-pre-line">{quote.notes}</p>
            </>
          ) : null}
        </div>

        {/* Investment */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <h2 className="text-xl text-white font-iceland mb-4">{t("investment")}</h2>
          <dl className="divide-y divide-gray-700 font-inter">
            <div className="flex justify-between py-3">
              <dt className="text-gray-400">{t("projectTotal")}</dt>
              <dd className="text-white font-semibold">{formatCurrency(quote.totalAmount)}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-400">{t("deposit", { percent: DEPOSIT_PERCENT })}</dt>
              <dd className="text-gold font-semibold">{formatCurrency(deposit)}</dd>
            </div>
            <div className="flex justify-between py-3">
              <dt className="text-gray-400">{t("balance")}</dt>
              <dd className="text-white">{formatCurrency(balance)}</dd>
            </div>
          </dl>
          <p className="text-gray-500 text-sm font-inter mt-4">{t("investmentNote")}</p>
        </div>

        {/* Zelle instructions, once the customer chose it */}
        {status === "sent" && quote.zelleRequestedAt && ZELLE_PAYMENT.contact ? (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gold/40">
            <div className="flex gap-4">
              <BanknotesIcon className="w-8 h-8 text-gold shrink-0" aria-hidden="true" />
              <div className="flex-1 font-inter">
                <h2 className="text-xl text-white font-iceland mb-2">{t("zelle.title")}</h2>
                <p className="text-gray-300 text-sm">
                  {t("zelle.thanks", {
                    date: quote.termsAcceptedAt ? t("zelle.on", { date: date(quote.termsAcceptedAt) }) : "",
                  })}
                </p>
                <dl className="mt-4 divide-y divide-gray-700 text-sm tabular-nums">
                  {zelleTax > 0 ? (
                    <>
                      <div className="flex justify-between gap-4 py-2">
                        <dt className="text-gray-400">{t("zelle.deposit")}</dt>
                        <dd className="text-white">{formatCurrency(deposit)}</dd>
                      </div>
                      <div className="flex justify-between gap-4 py-2">
                        <dt className="text-gray-400">{t("zelle.tax")}</dt>
                        <dd className="text-white">{formatCurrency(zelleTax)}</dd>
                      </div>
                    </>
                  ) : null}
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-gray-400">{t("zelle.amount")}</dt>
                    <dd className="text-gold font-semibold">{formatCurrency(deposit + zelleTax)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-gray-400">{t("zelle.sendTo")}</dt>
                    <dd className="text-white text-right">
                      <span className="font-mono">{ZELLE_PAYMENT.contact}</span>
                      <span className="block text-xs text-gray-400">{ZELLE_PAYMENT.recipient}</span>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-4 py-2">
                    <dt className="text-gray-400">{t("zelle.memo")}</dt>
                    <dd className="text-white font-mono">{quote.quoteNumber}</dd>
                  </div>
                </dl>
                {quote.zelleTaxCalculationId && zelleTax === 0 ? (
                  <p className="text-gray-400 text-xs mt-4">{t("zelle.noTax")}</p>
                ) : null}
                <p className="text-gray-500 text-xs mt-4">{t("zelle.note")}</p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Accept */}
        {status === "sent" && (
          <PageMessages namespaces={["Quote"]}>
            <QuoteAcceptForm
              token={quote.token}
              depositAmount={deposit}
              zelleAvailable={isZelleAvailable()}
              zelleRequested={quote.zelleRequestedAt !== null}
            />
          </PageMessages>
        )}

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm font-inter">
            {t("questions")}{" "}
            <a href={`mailto:${COMPANY.contactEmail}`} className="text-gold hover:underline">
              {t("contact")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
