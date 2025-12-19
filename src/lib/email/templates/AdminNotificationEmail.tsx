// src/lib/email/templates/AdminNotificationEmail.tsx
// Unified admin notification template for all payment types

import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
} from "@react-email/components";
import * as React from "react";

// Brand colors
const COLORS = {
  gold: "#CBB26A",
  dark: "#1a1a1a",
  gray: "#4b5563",
  lightGray: "#f3f4f6",
  white: "#ffffff",
  green: "#059669",
  greenLight: "#d1fae5",
  orange: "#f59e0b",
  orangeLight: "#fef3c7",
  red: "#dc2626",
  redLight: "#fee2e2",
};

type NotificationType =
  | "initial_payment"
  | "final_payment"
  | "subscription"
  | "fallback";

export interface AdminNotificationEmailProps {
  type: NotificationType;
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number; // in cents
  projectCode?: string;
  paymentId?: string;
  pendingAmount?: number; // in cents
  totalAmount?: number; // in cents
  stripeSubscriptionId?: string;
  nextBillingDate?: Date;
  subscriptionStatus?: string;
  isFallback?: boolean;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
  type,
  customerName,
  customerEmail,
  planName,
  amount,
  projectCode,
  paymentId,
  pendingAmount,
  totalAmount,
  stripeSubscriptionId,
  nextBillingDate,
  subscriptionStatus,
  isFallback = false,
}) => {
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedPending = pendingAmount ? (pendingAmount / 100).toFixed(2) : "";
  const formattedTotal = totalAmount ? (totalAmount / 100).toFixed(2) : "";
  const formattedDate = nextBillingDate
    ? nextBillingDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const getHeaderInfo = () => {
    switch (type) {
      case "initial_payment":
        return {
          title: isFallback
            ? "New Initial Payment (FALLBACK)"
            : "New Initial Payment Received",
          bgColor: isFallback ? COLORS.orangeLight : COLORS.greenLight,
          borderColor: isFallback ? COLORS.orange : COLORS.green,
          textColor: isFallback ? COLORS.orange : COLORS.green,
        };
      case "final_payment":
        return {
          title: "Final Payment Completed",
          bgColor: COLORS.greenLight,
          borderColor: COLORS.green,
          textColor: COLORS.green,
        };
      case "subscription":
        return {
          title: "New Subscription Activated",
          bgColor: COLORS.greenLight,
          borderColor: COLORS.green,
          textColor: COLORS.green,
        };
      case "fallback":
        return {
          title: "Payment Created via Fallback",
          bgColor: COLORS.orangeLight,
          borderColor: COLORS.orange,
          textColor: COLORS.orange,
        };
      default:
        return {
          title: "Payment Notification",
          bgColor: COLORS.lightGray,
          borderColor: COLORS.gray,
          textColor: COLORS.gray,
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section
            style={{
              ...styles.header,
              backgroundColor: headerInfo.bgColor,
              borderLeft: `4px solid ${headerInfo.borderColor}`,
            }}
          >
            <Heading style={{ ...styles.headerTitle, color: headerInfo.textColor }}>
              {headerInfo.title}
            </Heading>
          </Section>

          {/* Fallback Warning */}
          {isFallback && (
            <Section style={styles.warningBox}>
              <Text style={styles.warningText}>
                <strong>WEBHOOK DID NOT PROCESS IN 30 SECONDS</strong>
              </Text>
              <Text style={styles.warningSubtext}>
                Payment was created from fallback. Please verify webhook configuration.
              </Text>
            </Section>
          )}

          {/* Content */}
          <Section style={styles.content}>
            {/* Client Info */}
            <Section style={styles.infoBox}>
              <Heading as="h3" style={styles.sectionTitle}>
                Client Information
              </Heading>
              <table style={styles.infoTable}>
                <tbody>
                  <tr>
                    <td style={styles.infoLabel}>Client:</td>
                    <td style={styles.infoValue}>{customerName}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Email:</td>
                    <td style={styles.infoValue}>{customerEmail}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Plan:</td>
                    <td style={styles.infoValue}>{planName}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Payment Details */}
            <Section style={styles.infoBox}>
              <Heading as="h3" style={styles.sectionTitle}>
                Payment Details
              </Heading>
              <table style={styles.infoTable}>
                <tbody>
                  {projectCode && (
                    <tr>
                      <td style={styles.infoLabel}>Project Code:</td>
                      <td style={styles.infoValueHighlight}>{projectCode}</td>
                    </tr>
                  )}
                  {type === "subscription" ? (
                    <>
                      <tr>
                        <td style={styles.infoLabel}>Monthly Amount:</td>
                        <td style={styles.infoValue}>${formattedAmount}/month</td>
                      </tr>
                      {subscriptionStatus && (
                        <tr>
                          <td style={styles.infoLabel}>Status:</td>
                          <td style={styles.infoValue}>{subscriptionStatus}</td>
                        </tr>
                      )}
                      {stripeSubscriptionId && (
                        <tr>
                          <td style={styles.infoLabel}>Stripe Subscription ID:</td>
                          <td style={styles.infoValueSmall}>
                            {stripeSubscriptionId}
                          </td>
                        </tr>
                      )}
                      {formattedDate && (
                        <tr>
                          <td style={styles.infoLabel}>Next Billing:</td>
                          <td style={styles.infoValue}>{formattedDate}</td>
                        </tr>
                      )}
                    </>
                  ) : type === "initial_payment" ? (
                    <>
                      <tr>
                        <td style={styles.infoLabel}>Initial Payment:</td>
                        <td style={styles.infoValueGreen}>${formattedAmount}</td>
                      </tr>
                      {formattedPending && (
                        <tr>
                          <td style={styles.infoLabel}>Pending Payment:</td>
                          <td style={styles.infoValue}>${formattedPending}</td>
                        </tr>
                      )}
                    </>
                  ) : type === "final_payment" ? (
                    <>
                      <tr>
                        <td style={styles.infoLabel}>Final Payment:</td>
                        <td style={styles.infoValueGreen}>${formattedAmount}</td>
                      </tr>
                      {formattedTotal && (
                        <tr>
                          <td style={styles.infoLabel}>Total Project Value:</td>
                          <td style={styles.infoValue}>${formattedTotal}</td>
                        </tr>
                      )}
                      <tr>
                        <td style={styles.infoLabel}>Project Status:</td>
                        <td style={styles.infoValueGreen}>
                          <strong>COMPLETED</strong>
                        </td>
                      </tr>
                    </>
                  ) : (
                    <tr>
                      <td style={styles.infoLabel}>Amount:</td>
                      <td style={styles.infoValue}>${formattedAmount}</td>
                    </tr>
                  )}
                  {paymentId && (
                    <tr>
                      <td style={styles.infoLabel}>Payment ID:</td>
                      <td style={styles.infoValueSmall}>{paymentId}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            <Hr style={styles.divider} />

            {/* Action Reminder */}
            {type === "initial_payment" && !isFallback && (
              <Text style={styles.reminderText}>
                Remember to contact the client within 24 hours to discuss project
                details.
              </Text>
            )}

            {type === "subscription" && (
              <Text style={styles.reminderText}>
                The client has been sent a confirmation email with subscription
                details.
              </Text>
            )}

            {isFallback && (
              <Section style={styles.checklistBox}>
                <Text style={styles.checklistTitle}>Verify the following:</Text>
                <ul style={styles.checklistList}>
                  <li>Webhook URL in Stripe Dashboard points to correct endpoint</li>
                  <li>Webhook endpoint secret matches STRIPE_WEBHOOK_SECRET</li>
                  <li>Review webhook logs in Stripe Dashboard for errors</li>
                </ul>
              </Section>
            )}
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>RC Web Solutions - Admin Notification</Text>
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
    padding: "20px",
  },
  header: {
    padding: "20px 24px",
    borderRadius: "8px 8px 0 0",
  },
  headerTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
  },
  warningBox: {
    backgroundColor: COLORS.orangeLight,
    padding: "16px 24px",
    borderLeft: `4px solid ${COLORS.orange}`,
  },
  warningText: {
    color: COLORS.orange,
    fontSize: "14px",
    margin: "0 0 4px 0",
  },
  warningSubtext: {
    color: COLORS.gray,
    fontSize: "13px",
    margin: 0,
  },
  content: {
    backgroundColor: COLORS.white,
    padding: "24px",
  },
  infoBox: {
    marginBottom: "24px",
  },
  sectionTitle: {
    color: COLORS.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 12px 0",
    borderBottom: `2px solid ${COLORS.gold}`,
    paddingBottom: "8px",
  },
  infoTable: {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse" as const,
  },
  infoLabel: {
    padding: "8px 0",
    color: COLORS.gray,
    width: "40%",
    verticalAlign: "top" as const,
  },
  infoValue: {
    padding: "8px 0",
    color: COLORS.dark,
    fontWeight: 500,
  },
  infoValueHighlight: {
    padding: "8px 0",
    color: COLORS.gold,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    letterSpacing: "2px",
  },
  infoValueGreen: {
    padding: "8px 0",
    color: COLORS.green,
    fontWeight: 600,
  },
  infoValueSmall: {
    padding: "8px 0",
    color: COLORS.gray,
    fontSize: "12px",
    wordBreak: "break-all" as const,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "24px 0",
  },
  reminderText: {
    color: COLORS.gray,
    fontSize: "14px",
    fontStyle: "italic" as const,
    textAlign: "center" as const,
    margin: 0,
  },
  checklistBox: {
    backgroundColor: COLORS.orangeLight,
    padding: "16px",
    borderRadius: "8px",
    border: `1px solid ${COLORS.orange}`,
  },
  checklistTitle: {
    color: COLORS.orange,
    fontSize: "14px",
    fontWeight: 600,
    margin: "0 0 8px 0",
  },
  checklistList: {
    color: COLORS.gray,
    fontSize: "13px",
    margin: 0,
    paddingLeft: "20px",
    lineHeight: "1.6",
  },
  footer: {
    backgroundColor: COLORS.dark,
    padding: "16px 24px",
    borderRadius: "0 0 8px 8px",
    textAlign: "center" as const,
  },
  footerText: {
    color: COLORS.gold,
    fontSize: "12px",
    margin: 0,
  },
};

export default AdminNotificationEmail;
