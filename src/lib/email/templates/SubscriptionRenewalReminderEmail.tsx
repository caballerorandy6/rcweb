// src/lib/email/templates/SubscriptionRenewalReminderEmail.tsx

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

export interface SubscriptionRenewalReminderEmailProps {
  customerName: string;
  planName: string;
  amount: number; // in cents
  renewalDate: Date;
  manageUrl: string;
}

export const SubscriptionRenewalReminderEmail: React.FC<
  SubscriptionRenewalReminderEmailProps
> = ({ customerName, planName, amount, renewalDate, manageUrl }) => {
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedDate = renewalDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Upcoming Renewal</Heading>
            <Text style={styles.headerSubtitle}>{planName}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi <strong>{customerName}</strong>,
            </Text>
            <Text style={styles.paragraph}>
              This is a friendly reminder that your subscription will
              automatically renew soon.
            </Text>

            {/* Renewal Details */}
            <Section style={styles.detailsBox}>
              <table style={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>Plan:</td>
                    <td style={styles.detailValue}>{planName}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>Amount:</td>
                    <td style={styles.detailValueHighlight}>
                      ${formattedAmount}/month
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>Renewal Date:</td>
                    <td style={styles.detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Text style={styles.paragraph}>
              No action is needed if you wish to continue your subscription. Your
              payment method on file will be charged automatically.
            </Text>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={manageUrl} style={styles.button}>
                Manage Subscription
              </Button>
            </Section>

            <Text style={styles.smallText}>
              If you wish to cancel or update your payment method, click the
              button above before the renewal date.
            </Text>

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
    backgroundColor: EMAIL_COLORS.lightGray,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    backgroundColor: EMAIL_COLORS.dark,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${EMAIL_COLORS.blue}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.blue,
    margin: "12px 0 0 0",
    fontSize: "16px",
    fontWeight: 500,
  },
  content: {
    backgroundColor: EMAIL_COLORS.white,
    padding: "40px 32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  greeting: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  paragraph: {
    color: EMAIL_COLORS.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  detailsBox: {
    backgroundColor: EMAIL_COLORS.lightGray,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 24px 0",
    border: "1px solid #e5e7eb",
  },
  detailsTable: {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse" as const,
  },
  detailLabel: {
    padding: "10px 0",
    color: EMAIL_COLORS.gray,
    borderBottom: "1px solid #e5e7eb",
  },
  detailValue: {
    padding: "10px 0",
    textAlign: "right" as const,
    color: EMAIL_COLORS.dark,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  detailValueHighlight: {
    padding: "10px 0",
    textAlign: "right" as const,
    color: EMAIL_COLORS.blue,
    fontWeight: 700,
    fontSize: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: EMAIL_COLORS.gold,
    color: EMAIL_COLORS.dark,
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
  },
  smallText: {
    color: EMAIL_COLORS.grayLight,
    fontSize: "13px",
    textAlign: "center" as const,
    margin: "0 0 24px 0",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footerText: {
    textAlign: "center" as const,
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: EMAIL_COLORS.gold,
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    backgroundColor: EMAIL_COLORS.dark,
    padding: "24px 32px",
    textAlign: "center" as const,
    borderRadius: "0 0 16px 16px",
  },
  footerBrand: {
    color: EMAIL_COLORS.gold,
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  footerInfo: {
    color: EMAIL_COLORS.grayLight,
    fontSize: "12px",
    margin: 0,
  },
};

export default SubscriptionRenewalReminderEmail;
