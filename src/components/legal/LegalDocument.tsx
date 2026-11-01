import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import { getTranslations } from "next-intl/server";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Heading from "@/components/ui/Heading";
import AnalyticsOptOut from "@/components/forms/AnalyticsOptOut";
import LegalMarkdown from "@/components/legal/LegalMarkdown";
import { LEGAL_LAST_UPDATED } from "@/lib/company";
import type { LegalDocument as LegalDocumentData, LegalSlot } from "@/lib/legal";
import { formatDate } from "@/lib/utils";

/** The intro card reads larger than the body, and its bold is the brand gold */
const INTRO_COMPONENTS: Components = {
  p: ({ children }) => <p className="text-white/90 text-lg leading-relaxed font-inter">{children}</p>,
  strong: ({ children }) => <strong className="text-gold font-bold">{children}</strong>,
};

type LegalDocumentProps = {
  doc: LegalDocumentData;
  icon: ReactNode;
  /** Above the title: the back button, or the checkout notice on the terms */
  top?: ReactNode;
  /** Below the text, before the footnote: accept actions, return links */
  bottom?: ReactNode;
};

/**
 * Page body shared by Privacy, Terms and Refund: title, intro card with the
 * "Last updated" date, one card with the Markdown sections (styled by the
 * `legal-prose` utility) and the footnote. Server Component; the only
 * client bits are the slot components and whatever the page passes in.
 */
export default async function LegalDocument({ doc, icon, top, bottom }: LegalDocumentProps) {
  const t = await getTranslations("Legal");
  const lastUpdated = formatDate(LEGAL_LAST_UPDATED.version, {
    month: "long",
    timeZone: "UTC",
    locale: doc.locale,
  });

  const slots: Record<LegalSlot, ReactNode> = {
    "analytics-opt-out": (
      <AnalyticsOptOut
        labels={{
          allow: t("analyticsOptOut.allow"),
          on: t("analyticsOptOut.on"),
          off: t("analyticsOptOut.off"),
        }}
      />
    ),
  };

  return (
    <section
      id={doc.id}
      className="relative isolate overflow-hidden py-24 sm:py-32 bg-linear-to-b from-gray-900 via-gray-900/95 to-gray-900"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
        <div className="absolute bottom-0 -right-4 w-72 h-72 rounded-full bg-radial from-gold/10 to-transparent to-70%"></div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {top}

        <Heading as="h1" icon={icon} text={doc.subtitle}>
          {doc.title}
        </Heading>

        {/* Introduction card */}
        <div className="mt-16 max-w-5xl mx-auto reveal">
          <div className="bg-linear-to-r from-gold/10 to-gold/5 rounded-2xl p-8 border border-gold/20 shadow-xl shadow-black/50">
            <div className="space-y-4">
              {doc.intro.map((paragraph) => (
                <LegalMarkdown key={paragraph} overrides={INTRO_COMPONENTS}>
                  {paragraph}
                </LegalMarkdown>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-gold/70 text-sm">
              <InformationCircleIcon className="w-5 h-5" aria-hidden="true" />
              <span className="font-inter">
                {t.rich("lastUpdated", {
                  date: () => <time dateTime={LEGAL_LAST_UPDATED.version}>{lastUpdated}</time>,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-12 max-w-5xl mx-auto reveal">
          <div className="legal-prose max-w-none">
            <div className="bg-gray-900/60 rounded-2xl border border-gold/20 p-8 space-y-8">
              {doc.sections.map((section) => (
                <section
                  key={section.title}
                  id={section.id}
                  className={section.id ? "scroll-mt-28" : undefined}
                >
                  <h2>{section.title}</h2>
                  {section.parts.map((part, index) =>
                    part.kind === "slot" ? (
                      <div key={index} className="my-4">
                        {slots[part.slot]}
                      </div>
                    ) : (
                      <LegalMarkdown key={index}>{part.markdown}</LegalMarkdown>
                    )
                  )}
                </section>
              ))}
            </div>
          </div>
        </div>

        {bottom}

        {doc.footnote ? (
          <div className="mt-8 text-center flex justify-center items-center reveal">
            <p className="text-white/50 text-sm font-inter">{doc.footnote}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
