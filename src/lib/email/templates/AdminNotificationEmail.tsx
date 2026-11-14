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
import { EMAIL_COLORS } from "../colors";

type NotificationType =
  | "initial_payment"
  | "final_payment"
  | "subscription"
  | "subscription_cancelled"
  | "subscription_cancel_scheduled"
  | "subscription_resumed"
  | "subscription_payment_failed"
  | "subscription_payment_action_required"
  | "fallback";

/**
 * What a maintenance plan needs before the first month starts. GA4 and Search
 * Console belong to every client (set up at delivery); the rest only exists
 * for plan clients, because someone has to act on the alerts.
 */
const ONBOARDING_STEPS = [
  "Dependabot on the site's repo (weekly grouped updates)",
  "Uptime monitor with alerts to your phone",
  "Sentry and Vercel Speed Insights on the site",
  "Nightly database backups, only if the site has a database",
  "GA4 and Search Console owned by the client, with you as admin",
  "Client's privacy policy mentions GA4 and Sentry",
  "Add the client to the monthly report",
];

export interface AdminNotificationEmailProps {
  type: NotificationType;
  customerName: string;
  customerEmail: string;
  planName: string;
  amount: number; // in cents
  projectCode?: string;
  projectId?: string;
  pendingAmount?: number; // in cents
  totalAmount?: number; // in cents
  stripeSubscriptionId?: string;
  nextBillingDate?: Date;
  subscriptionStatus?: string;
  cancellationReason?: string;
}

export const AdminNotificationEmail: React.FC<AdminNotificationEmailProps> = ({
  type,
  customerName,
  customerEmail,
  planName,
  amount,
  projectCode,
  projectId,
  pendingAmount,
  totalAmount,
  stripeSubscriptionId,
  nextBillingDate,
  subscriptionStatus,
  cancellationReason,
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
          title: "New Initial Payment Received",
          bgColor: EMAIL_COLORS.greenLight,
          borderColor: EMAIL_COLORS.green,
          textColor: EMAIL_COLORS.green,
        };
      case "final_payment":
        return {
          title: "Final Payment Completed",
          bgColor: EMAIL_COLORS.greenLight,
          borderColor: EMAIL_COLORS.green,
          textColor: EMAIL_COLORS.green,
        };
      case "subscription":
        return {
          title: "New Subscription Activated",
          bgColor: EMAIL_COLORS.greenLight,
          borderColor: EMAIL_COLORS.green,
          textColor: EMAIL_COLORS.green,
        };
      case "subscription_cancelled":
        return {
          title: "Subscription Cancelled",
          bgColor: EMAIL_COLORS.redLight,
          borderColor: EMAIL_COLORS.red,
          textColor: EMAIL_COLORS.redDark,
        };
      case "subscription_cancel_scheduled":
        return {
          title: "Cancellation Scheduled",
          bgColor: EMAIL_COLORS.amberLight,
          borderColor: EMAIL_COLORS.amber,
          textColor: EMAIL_COLORS.amberDark,
        };
      case "subscription_resumed":
        return {
          title: "Subscription Resumed",
          bgColor: EMAIL_COLORS.greenLight,
          borderColor: EMAIL_COLORS.green,
          textColor: EMAIL_COLORS.green,
        };
      case "subscription_payment_action_required":
        return {
          title: "Payment Needs Authentication",
          bgColor: EMAIL_COLORS.blueLight,
          borderColor: EMAIL_COLORS.blue,
          textColor: EMAIL_COLORS.blueDark,
        };
      case "subscription_payment_failed":
        return {
          title: "Subscription Payment Failed",
          bgColor: EMAIL_COLORS.orangeLight,
          borderColor: EMAIL_COLORS.orange,
          textColor: EMAIL_COLORS.orangeDark,
        };
      case "fallback":
        return {
          title: "Payment Created via Fallback",
          bgColor: EMAIL_COLORS.orangeLight,
          borderColor: EMAIL_COLORS.orange,
          textColor: EMAIL_COLORS.orange,
        };
      default:
        return {
          title: "Payment Notification",
          bgColor: EMAIL_COLORS.lightGray,
          borderColor: EMAIL_COLORS.gray,
          textColor: EMAIL_COLORS.gray,
        };
    }
  };

  const headerInfo = getHeaderInfo();
  const isSubscription = type.startsWith("subscription");

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
                  {isSubscription ? (
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
                          <td style={styles.infoLabel}>
                            {type === "subscription_cancel_scheduled"
                              ? "Ends On:"
                              : "Next Billing:"}
                          </td>
                          <td style={styles.infoValue}>{formattedDate}</td>
                        </tr>
                      )}
                      {cancellationReason && (
                        <tr>
                          <td style={styles.infoLabel}>Reason:</td>
                          <td style={styles.infoValue}>{cancellationReason}</td>
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
                  {projectId && (
                    <tr>
                      <td style={styles.infoLabel}>Project ID:</td>
                      <td style={styles.infoValueSmall}>{projectId}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Section>

            <Hr style={styles.divider} />

            {/* Action Reminder */}
            {type === "initial_payment" && (
              <Text style={styles.reminderText}>
                Remember to contact the client within 24 hours to discuss project
                details.
              </Text>
            )}

            {type === "subscription" && (
              <>
                <Section style={styles.infoBox}>
                  <Heading as="h3" style={styles.sectionTitle}>
                    Onboarding checklist
                  </Heading>
                  <ul style={styles.checklist}>
                    {ONBOARDING_STEPS.map((step) => (
                      <li key={step} style={styles.checklistItem}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </Section>
                <Text style={styles.reminderText}>
                  The client has been sent a confirmation email with subscription
                  details.
                </Text>
              </>
            )}

            {type === "subscription_cancelled" && (
              <Text style={styles.reminderText}>
                The client has been sent a cancellation email. Stripe will not
                charge them again.
              </Text>
            )}

            {type === "subscription_cancel_scheduled" && (
              <Text style={styles.reminderText}>
                The plan stays active until the date above and the client was
                sent a confirmation. A good moment to call them before it ends.
              </Text>
            )}

            {type === "subscription_resumed" && (
              <Text style={styles.reminderText}>
                The client took back the cancellation; billing continues as
                usual.
              </Text>
            )}

            {type === "subscription_payment_action_required" && (
              <Text style={styles.reminderText}>
                Not a declined card: the client&apos;s bank asked them to confirm
                this charge (3D Secure). Stripe emailed them a link and reminds
                them on days 3, 5 and 7.
              </Text>
            )}

            {type === "subscription_payment_failed" && (
              <Text style={styles.reminderText}>
                The client has been asked to update their payment method. Stripe
                retries the charge automatically.
              </Text>
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
  content: {
    backgroundColor: EMAIL_COLORS.white,
    padding: "24px",
  },
  infoBox: {
    marginBottom: "24px",
  },
  sectionTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 12px 0",
    borderBottom: `2px solid ${EMAIL_COLORS.gold}`,
    paddingBottom: "8px",
  },
  infoTable: {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse" as const,
  },
  infoLabel: {
    padding: "8px 0",
    color: EMAIL_COLORS.gray,
    width: "40%",
    verticalAlign: "top" as const,
  },
  infoValue: {
    padding: "8px 0",
    color: EMAIL_COLORS.dark,
    fontWeight: 500,
  },
  infoValueHighlight: {
    padding: "8px 0",
    color: EMAIL_COLORS.gold,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    letterSpacing: "2px",
  },
  infoValueGreen: {
    padding: "8px 0",
    color: EMAIL_COLORS.green,
    fontWeight: 600,
  },
  infoValueSmall: {
    padding: "8px 0",
    color: EMAIL_COLORS.gray,
    fontSize: "12px",
    wordBreak: "break-all" as const,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "24px 0",
  },
  checklist: {
    color: EMAIL_COLORS.dark,
    fontSize: "14px",
    lineHeight: "1.8",
    margin: 0,
    paddingLeft: "20px",
  },
  checklistItem: {
    marginBottom: "4px",
  },
  reminderText: {
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    fontStyle: "italic" as const,
    textAlign: "center" as const,
    margin: 0,
  },
  footer: {
    backgroundColor: EMAIL_COLORS.dark,
    padding: "16px 24px",
    borderRadius: "0 0 8px 8px",
    textAlign: "center" as const,
  },
  footerText: {
    color: EMAIL_COLORS.gold,
    fontSize: "12px",
    margin: 0,
  },
};

export default AdminNotificationEmail;
