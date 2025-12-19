// src/lib/email/templates/InitialPaymentConfirmationEmail.tsx

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

// Brand colors
const COLORS = {
  gold: "#CBB26A",
  goldDark: "#A89048",
  goldLight: "#f5f0e1",
  dark: "#1a1a1a",
  gray: "#4b5563",
  lightGray: "#f3f4f6",
  white: "#ffffff",
  green: "#059669",
  purple: "#7c3aed",
};

export interface InitialPaymentConfirmationEmailProps {
  customerName: string;
  planName: string;
  projectCode: string;
  firstPaymentAmount: number; // in cents
  secondPaymentAmount: number; // in cents
  totalAmount: number; // in cents
}

export const InitialPaymentConfirmationEmail: React.FC<
  InitialPaymentConfirmationEmailProps
> = ({
  customerName,
  planName,
  projectCode,
  firstPaymentAmount,
  secondPaymentAmount,
  totalAmount,
}) => {
  const formattedFirstPayment = (firstPaymentAmount / 100).toFixed(2);
  const formattedSecondPayment = (secondPaymentAmount / 100).toFixed(2);
  const formattedTotal = (totalAmount / 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Payment Confirmed!</Heading>
            <Text style={styles.headerSubtitle}>
              Your project has been initiated
            </Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi <strong>{customerName}</strong>,
            </Text>
            <Text style={styles.paragraph}>
              Thank you for your initial payment. We&apos;ve started working on your{" "}
              <strong style={{ color: COLORS.gold }}>{planName}</strong> project!
            </Text>

            {/* Project Code Box */}
            <Section style={styles.projectCodeBox}>
              <Text style={styles.projectCodeLabel}>YOUR PROJECT CODE</Text>
              <Text style={styles.projectCode}>{projectCode}</Text>
              <Text style={styles.projectCodeNote}>
                Save this code - Required for final payment
              </Text>
            </Section>

            {/* What Happens Next */}
            <Section style={styles.nextStepsBox}>
              <Heading as="h3" style={styles.nextStepsTitle}>
                What Happens Next?
              </Heading>
              <ol style={styles.nextStepsList}>
                <li style={styles.nextStepItem}>
                  We&apos;ll contact you within <strong>24 hours</strong> to discuss
                  project details
                </li>
                <li style={styles.nextStepItem}>
                  Project development time based on your plan
                </li>
                <li style={styles.nextStepItem}>
                  We&apos;ll notify you when ready for final payment
                </li>
                <li style={styles.nextStepItem}>
                  All deliverables provided after final payment
                </li>
              </ol>
            </Section>

            {/* Payment Summary */}
            <Section style={styles.summaryBox}>
              <Heading as="h3" style={styles.summaryTitle}>
                Payment Summary
              </Heading>
              <table style={styles.summaryTable}>
                <tbody>
                  <tr>
                    <td style={styles.summaryLabel}>Initial Payment (50%):</td>
                    <td style={styles.summaryValuePaid}>
                      ${formattedFirstPayment}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.summaryLabel}>Final Payment (50%):</td>
                    <td style={styles.summaryValuePending}>
                      ${formattedSecondPayment}
                    </td>
                  </tr>
                  <tr style={{ borderTop: "2px solid #e5e7eb" }}>
                    <td style={styles.summaryLabelTotal}>Total Project Cost:</td>
                    <td style={styles.summaryValueTotal}>${formattedTotal}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              Questions? Contact us at{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>RC Web Solutions</Text>
            <Text style={styles.footerInfo}>
              Professional Web Development Services
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles: Record<string, React.CSSProperties> = {
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
    padding: "40px 20px",
  },
  header: {
    backgroundColor: COLORS.dark,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${COLORS.gold}`,
  },
  headerTitle: {
    color: COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: COLORS.gold,
    margin: "12px 0 0 0",
    fontSize: "16px",
    fontWeight: 500,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: "40px 32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  greeting: {
    color: COLORS.dark,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  paragraph: {
    color: COLORS.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 32px 0",
  },
  projectCodeBox: {
    backgroundColor: COLORS.goldLight,
    border: `2px solid ${COLORS.gold}`,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
    textAlign: "center" as const,
  },
  projectCodeLabel: {
    color: COLORS.goldDark,
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 8px 0",
  },
  projectCode: {
    color: COLORS.gold,
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "4px",
    fontFamily: "'Courier New', monospace",
    margin: "8px 0",
  },
  projectCodeNote: {
    color: COLORS.goldDark,
    fontSize: "13px",
    margin: "8px 0 0 0",
  },
  nextStepsBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
    border: "1px solid #e5e7eb",
  },
  nextStepsTitle: {
    color: COLORS.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  nextStepsList: {
    color: COLORS.gray,
    fontSize: "15px",
    lineHeight: "1.8",
    margin: 0,
    paddingLeft: "20px",
  },
  nextStepItem: {
    marginBottom: "8px",
  },
  summaryBox: {
    backgroundColor: COLORS.lightGray,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
    border: "1px solid #e5e7eb",
  },
  summaryTitle: {
    color: COLORS.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  summaryTable: {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse" as const,
  },
  summaryLabel: {
    padding: "10px 0",
    color: COLORS.gray,
    borderBottom: "1px solid #e5e7eb",
  },
  summaryValuePaid: {
    padding: "10px 0",
    textAlign: "right" as const,
    color: COLORS.green,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  summaryValuePending: {
    padding: "10px 0",
    textAlign: "right" as const,
    color: COLORS.gray,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  summaryLabelTotal: {
    padding: "12px 0 0 0",
    color: COLORS.dark,
    fontWeight: 600,
  },
  summaryValueTotal: {
    padding: "12px 0 0 0",
    textAlign: "right" as const,
    color: COLORS.dark,
    fontWeight: 700,
    fontSize: "16px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footerText: {
    textAlign: "center" as const,
    color: COLORS.gray,
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: COLORS.gold,
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    backgroundColor: COLORS.dark,
    padding: "24px 32px",
    textAlign: "center" as const,
    borderRadius: "0 0 16px 16px",
  },
  footerBrand: {
    color: COLORS.gold,
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  footerInfo: {
    color: "#9ca3af",
    fontSize: "12px",
    margin: 0,
  },
};

export default InitialPaymentConfirmationEmail;
