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
  Button,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_COLORS } from "../colors";

export interface ProjectReadyEmailProps {
  customerName: string;
  planName: string;
  projectCode: string;
  finalAmount: number;
  customerEmail: string;
}

// Alias for backward compatibility in this file
const colors = EMAIL_COLORS;

export const ProjectReadyEmail = ({
  customerName,
  planName,
  projectCode,
  finalAmount,
  customerEmail,
}: ProjectReadyEmailProps) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://rcweb.dev";

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Your Project is Ready!</Heading>
            <Text style={styles.headerSubtitle}>
              Final payment required to deliver
            </Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi <strong>{customerName}</strong>,
            </Text>

            <Text style={styles.message}>
              Great news! Your <strong>{planName}</strong> project is complete
              and ready for final review.
            </Text>

            {/* Project Summary */}
            <Section style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Project Summary</Text>
              <table style={{ width: "100%", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={styles.summaryLabel}>Project Code:</td>
                    <td style={styles.summaryValueCode}>{projectCode}</td>
                  </tr>
                  <tr>
                    <td style={styles.summaryLabel}>Plan:</td>
                    <td style={styles.summaryValue}>{planName}</td>
                  </tr>
                  <tr>
                    <td style={styles.summaryLabel}>Final Payment Due:</td>
                    <td style={styles.summaryValueAmount}>
                      ${(finalAmount / 100).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Payment Instructions */}
            <Section style={styles.paymentBox}>
              <Text style={styles.paymentTitle}>Complete Your Final Payment</Text>
              <Text style={styles.paymentText}>
                You can complete your payment directly:
              </Text>
              <Section style={{ textAlign: "center", margin: "20px 0" }}>
                <Button
                  href={`${baseUrl}/final-payment`}
                  style={styles.paymentButton}
                >
                  Complete Final Payment Now
                </Button>
              </Section>
              <Text style={styles.paymentInstructions}>
                Or visit{" "}
                <Link href={`${baseUrl}/final-payment`} style={styles.link}>
                  {baseUrl}/final-payment
                </Link>{" "}
                and use your email <strong>{customerEmail}</strong> and project
                code <strong>{projectCode}</strong>.
              </Text>
            </Section>

            {/* Thank You */}
            <Section style={styles.thankYouBox}>
              <Text style={styles.thankYouTitle}>
                Thank you for choosing RC Web!
              </Text>
              <Text style={styles.thankYouText}>
                We&apos;re excited to deliver your new website once payment is
                completed.
              </Text>
            </Section>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              Questions? Contact us at{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.unsubscribe}>
              You can unsubscribe from marketing emails at any time by clicking{" "}
              <Link
                href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(customerEmail)}`}
                style={styles.link}
              >
                here
              </Link>
              .
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
    background: `linear-gradient(135deg, ${colors.green} 0%, ${colors.greenDark} 100%)`,
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
  summaryBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
  },
  summaryTitle: {
    color: colors.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  summaryLabel: {
    padding: "6px 0",
    color: colors.grayLight,
  },
  summaryValue: {
    textAlign: "right" as const,
    fontWeight: 600,
    color: colors.gray,
  },
  summaryValueCode: {
    textAlign: "right" as const,
    fontWeight: 600,
    color: colors.gray,
    fontFamily: "'Courier New', monospace",
  },
  summaryValueAmount: {
    textAlign: "right" as const,
    fontWeight: 600,
    color: colors.greenDark,
    fontSize: "16px",
  },
  paymentBox: {
    background: "linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)",
    borderLeft: `4px solid ${colors.purple}`,
    borderRadius: "8px",
    padding: "20px",
    margin: "0 0 32px 0",
  },
  paymentTitle: {
    margin: "0 0 12px 0",
    color: "#5b21b6",
    fontWeight: 600,
    fontSize: "16px",
  },
  paymentText: {
    margin: "0 0 8px 0",
    color: colors.gray,
    fontSize: "14px",
  },
  paymentButton: {
    background: colors.purple,
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    display: "inline-block",
  },
  paymentInstructions: {
    margin: 0,
    color: "#4b5563",
    fontSize: "14px",
  },
  thankYouBox: {
    background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center" as const,
    margin: "0 0 32px 0",
  },
  thankYouTitle: {
    color: colors.amberDark,
    fontSize: "18px",
    fontWeight: 600,
    margin: 0,
  },
  thankYouText: {
    color: "#b45309",
    fontSize: "14px",
    margin: "8px 0 0 0",
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
  unsubscribe: {
    textAlign: "center" as const,
    color: colors.grayLight,
    fontSize: "12px",
    margin: 0,
  },
  link: {
    color: colors.purple,
    textDecoration: "none",
  },
};

export default ProjectReadyEmail;
