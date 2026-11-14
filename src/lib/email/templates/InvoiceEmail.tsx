import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_COLORS } from "../colors";
import { emailTranslator } from "../i18n";
import type { Locale } from "@/i18n/routing";
import type { InvoiceType } from "@/generated/prisma/enums";

export type InvoiceEmailType = InvoiceType;

export interface InvoiceEmailProps {
  type: InvoiceEmailType;
  customerName: string;
  locale: Locale;
  planName: string;
  invoiceNumber: string;
  firstPayment: number;
  /** Sales tax paid with the deposit, in cents */
  depositTax: number;
  secondPayment: number;
  totalAmount: number;
  /** Public progress page (/project/{accessToken}); replaces the old client portal */
  projectUrl?: string;
}

// Alias for backward compatibility in this file
const colors = EMAIL_COLORS;

const headerGradients = {
  initial: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  final: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  summary: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
};

const titleKeys = {
  initial: "invoice.titleInitial",
  final: "invoice.titleFinal",
  summary: "invoice.titleSummary",
} as const;

const subtitleKeys = {
  initial: "invoice.subtitleInitial",
  final: "invoice.subtitleFinal",
  summary: "invoice.subtitleSummary",
} as const;

export const InvoiceEmail = ({
  type,
  customerName,
  locale,
  planName,
  invoiceNumber,
  firstPayment,
  depositTax,
  secondPayment,
  totalAmount,
  projectUrl,
}: InvoiceEmailProps) => {
  const t = emailTranslator(locale);
  return (
    <Html lang={locale}>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section
            style={{
              ...styles.header,
              background: headerGradients[type],
            }}
          >
            <Heading style={styles.headerTitle}>{t(titleKeys[type])}</Heading>
            <Text style={styles.headerSubtitle}>{t(subtitleKeys[type])}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>

            {/* Type-specific message */}
            {type === "initial" && (
              <Text style={styles.message}>
                {t.rich("invoice.bodyInitial", { planName, b: (chunks) => <strong style={{ color: colors.gold }}>{chunks}</strong> })}
              </Text>
            )}

            {type === "final" && (
              <Text style={styles.message}>
                {t.rich("invoice.bodyFinal", { amount: `$${(secondPayment / 100).toFixed(2)}`, b: (chunks) => <strong style={{ color: colors.green, fontSize: "18px" }}>{chunks}</strong> })}
              </Text>
            )}

            {type === "summary" && (
              <Text style={styles.message}>
                {t.rich("invoice.bodySummary", { planName, b: (chunks) => <strong>{chunks}</strong> })}
              </Text>
            )}

            {/* Invoice Number Box */}
            <Section style={styles.invoiceBox}>
              <Text style={styles.invoiceLabel}>
                {t(type === "summary" ? "invoice.summaryNumber" : "invoice.number")}
              </Text>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.invoiceNote}>
                {type === "initial" && t("invoice.attachedInitial")}
                {type === "final" && t("invoice.attachedFinal")}
                {type === "summary" && t("invoice.attachedSummary")}
              </Text>
            </Section>

            {/* {t("invoice.paymentSummary")} - Only for initial and summary */}
            {type === "initial" && (
              <Section style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <table style={{ width: "100%", fontSize: "14px" }}>
                  <tbody>
                    <tr>
                      <td style={styles.summaryLabel}>{t("invoice.initialPayment")}</td>
                      <td style={styles.summaryValuePaid}>
                        ${(firstPayment / 100).toFixed(2)} ✓
                      </td>
                    </tr>
                    {depositTax > 0 && (
                      <tr>
                        <td style={styles.summaryLabel}>{t("invoice.salesTax")}</td>
                        <td style={styles.summaryValuePaid}>
                          ${(depositTax / 100).toFixed(2)} ✓
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td style={styles.summaryLabel}>{t("invoice.remaining")}</td>
                      <td style={styles.summaryValue}>
                        ${(secondPayment / 100).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          ...styles.summaryLabel,
                          paddingTop: "12px",
                          borderTop: "1px solid #d1d5db",
                          fontWeight: 600,
                          color: colors.gray,
                        }}
                      >
                        {t("invoice.totalCost")}
                      </td>
                      <td
                        style={{
                          ...styles.summaryValue,
                          paddingTop: "12px",
                          borderTop: "1px solid #d1d5db",
                          fontWeight: 600,
                          color: colors.gray,
                        }}
                      >
                        ${(totalAmount / 100).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Section>
            )}

            {/* {t("invoice.totalPaid")} - Only for summary */}
            {type === "summary" && (
              <Section style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Paid</Text>
                <Text style={styles.totalAmount}>
                  ${(totalAmount / 100).toFixed(2)}
                </Text>
                <Text style={styles.allPaymentsNote}>{t("invoice.allReceived")}</Text>
              </Section>
            )}

            {/* Final Payment Notice */}
            {type === "final" && (
              <Section style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  {t("invoice.summaryNext")}
                </Text>
              </Section>
            )}

            {/* Project Complete Badge - Only for summary */}
            {type === "summary" && (
              <Section style={styles.completeBadge}>
                <Text style={styles.completeBadgeTitle}>{t("invoice.completed")}</Text>
                <Text style={styles.completeBadgeText}>
                  {t("invoice.thanks")}
                </Text>
              </Section>
            )}

            {projectUrl && (
              <Section style={styles.projectLinkBox}>
                <Text style={styles.projectLinkText}>
                  {t("invoice.follow")}
                </Text>
                <Link href={projectUrl} style={styles.projectButton}>
                  {t("invoice.viewProject")}
                </Link>
              </Section>
            )}

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              {t("common.questionsContact")}{" "}
              <Link href="mailto:admin@rcweb.dev" style={styles.link}>
                admin@rcweb.dev
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    backgroundColor: "#f3f4f6",
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    overflow: "hidden" as const,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    padding: "48px 32px",
    textAlign: "center" as const,
  },
  headerTitle: {
    color: "#ffffff",
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    margin: "8px 0 0 0",
    fontSize: "16px",
  },
  content: {
    padding: "40px 32px",
  },
  greeting: {
    color: colors.gray,
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 24px 0",
  },
  message: {
    color: colors.gray,
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 32px 0",
  },
  invoiceBox: {
    background: `linear-gradient(135deg, ${colors.amberLight} 0%, #fde68a 100%)`,
    border: `2px solid ${colors.amber}`,
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center" as const,
    margin: "0 0 32px 0",
  },
  invoiceLabel: {
    margin: "0 0 8px 0",
    color: "#92400e",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
  },
  invoiceNumber: {
    margin: "8px 0",
    fontFamily: "'Courier New', monospace",
    fontSize: "28px",
    color: colors.amberDark,
    fontWeight: "bold",
    letterSpacing: "2px",
  },
  invoiceNote: {
    margin: "8px 0 0 0",
    color: "#92400e",
    fontSize: "13px",
  },
  summaryBox: {
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 0 32px 0",
  },
  summaryTitle: {
    color: colors.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 12px 0",
  },
  summaryLabel: {
    padding: "4px 0",
    color: colors.grayLight,
  },
  summaryValue: {
    textAlign: "right" as const,
    color: colors.grayLight,
  },
  summaryValuePaid: {
    textAlign: "right" as const,
    color: colors.green,
    fontWeight: 600,
  },
  totalAmount: {
    margin: 0,
    fontSize: "36px",
    fontWeight: "bold",
    color: colors.green,
  },
  allPaymentsNote: {
    margin: "8px 0 0 0",
    color: colors.grayLight,
    fontSize: "14px",
  },
  noticeBox: {
    backgroundColor: "#f0fdf4",
    padding: "15px",
    borderRadius: "8px",
    textAlign: "center" as const,
  },
  noticeText: {
    color: "#065f46",
    fontSize: "14px",
    margin: 0,
  },
  completeBadge: {
    backgroundColor: "#f0fdf4",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center" as const,
    border: `2px solid ${colors.green}`,
  },
  completeBadgeTitle: {
    color: "#065f46",
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 8px 0",
  },
  completeBadgeText: {
    color: "#065f46",
    fontSize: "14px",
    margin: 0,
  },
  projectLinkBox: {
    textAlign: "center" as const,
    margin: "24px 0 0 0",
  },
  projectLinkText: {
    color: colors.grayLight,
    fontSize: "14px",
    margin: "0 0 12px 0",
  },
  projectButton: {
    display: "inline-block",
    backgroundColor: colors.gold,
    color: colors.dark,
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    textDecoration: "none",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footer: {
    textAlign: "center" as const,
    color: colors.grayLight,
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: colors.gold,
    textDecoration: "none",
  },
};

export default InvoiceEmail;
