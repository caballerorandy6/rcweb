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

export type InvoiceEmailType = "initial" | "final" | "summary";

export interface InvoiceEmailProps {
  type: InvoiceEmailType;
  customerName: string;
  planName: string;
  invoiceNumber: string;
  firstPayment: number;
  secondPayment: number;
  totalAmount: number;
}

const colors = {
  gold: "#CBB26A",
  dark: "#1a1a1a",
  gray: "#374151",
  grayLight: "#6b7280",
  green: "#10b981",
  greenDark: "#059669",
  purple: "#8b5cf6",
  amber: "#f59e0b",
  amberDark: "#d97706",
  amberLight: "#fef3c7",
};

const headerGradients = {
  initial: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  final: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  summary: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
};

const titles = {
  initial: "Payment Confirmed!",
  final: "Final Payment Received!",
  summary: "Project Complete!",
};

const subtitles = {
  initial: "Your invoice is attached",
  final: "Your project is ready",
  summary: "Full Invoice Summary",
};

export const InvoiceEmail = ({
  type,
  customerName,
  planName,
  invoiceNumber,
  firstPayment,
  secondPayment,
  totalAmount,
}: InvoiceEmailProps) => {
  return (
    <Html>
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
            <Heading style={styles.headerTitle}>{titles[type]}</Heading>
            <Text style={styles.headerSubtitle}>{subtitles[type]}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi <strong>{customerName}</strong>,
            </Text>

            {/* Type-specific message */}
            {type === "initial" && (
              <Text style={styles.message}>
                Thank you for your initial payment. We&apos;ve started working on
                your <strong style={{ color: colors.gold }}>{planName}</strong>{" "}
                project!
              </Text>
            )}

            {type === "final" && (
              <Text style={styles.message}>
                Your final payment of{" "}
                <strong style={{ color: colors.green, fontSize: "18px" }}>
                  ${(secondPayment / 100).toFixed(2)}
                </strong>{" "}
                has been received. Your project is now complete!
              </Text>
            )}

            {type === "summary" && (
              <Text style={styles.message}>
                Here is your complete invoice summary for the{" "}
                <strong>{planName}</strong> project. This invoice shows both
                payments and the total amount paid.
              </Text>
            )}

            {/* Invoice Number Box */}
            <Section style={styles.invoiceBox}>
              <Text style={styles.invoiceLabel}>
                {type === "summary" ? "Summary Invoice Number" : "Invoice Number"}
              </Text>
              <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
              <Text style={styles.invoiceNote}>
                {type === "initial" && "PDF invoice attached to this email"}
                {type === "final" && "PDF invoice attached • Full summary coming next"}
                {type === "summary" && "Complete project invoice attached"}
              </Text>
            </Section>

            {/* Payment Summary - Only for initial and summary */}
            {type === "initial" && (
              <Section style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Payment Summary</Text>
                <table style={{ width: "100%", fontSize: "14px" }}>
                  <tbody>
                    <tr>
                      <td style={styles.summaryLabel}>Initial Payment (50%):</td>
                      <td style={styles.summaryValuePaid}>
                        ${(firstPayment / 100).toFixed(2)} ✓
                      </td>
                    </tr>
                    <tr>
                      <td style={styles.summaryLabel}>Remaining Balance:</td>
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
                        Total Project Cost:
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

            {/* Total Paid - Only for summary */}
            {type === "summary" && (
              <Section style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Total Paid</Text>
                <Text style={styles.totalAmount}>
                  ${(totalAmount / 100).toFixed(2)}
                </Text>
                <Text style={styles.allPaymentsNote}>✓ All payments received</Text>
              </Section>
            )}

            {/* Final Payment Notice */}
            {type === "final" && (
              <Section style={styles.noticeBox}>
                <Text style={styles.noticeText}>
                  ✓ You will receive a complete project summary invoice in a
                  separate email
                </Text>
              </Section>
            )}

            {/* Project Complete Badge - Only for summary */}
            {type === "summary" && (
              <Section style={styles.completeBadge}>
                <Text style={styles.completeBadgeTitle}>✓ PROJECT COMPLETED</Text>
                <Text style={styles.completeBadgeText}>
                  Thank you for choosing RC Web Solutions!
                </Text>
              </Section>
            )}

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Questions? Contact us at{" "}
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
