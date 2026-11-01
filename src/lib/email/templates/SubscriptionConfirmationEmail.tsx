// src/lib/email/templates/SubscriptionConfirmationEmail.tsx

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
import { emailTranslator, formatLongDate } from "../i18n";
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";
import { SITE_BASE_URL } from "@/lib/projectUrl";

export interface SubscriptionConfirmationEmailProps {
  customerName: string;
  locale: Locale;
  planName: string;
  amount: number; // in cents
  nextBillingDate: Date;
}

export const SubscriptionConfirmationEmail: React.FC<
  SubscriptionConfirmationEmailProps
> = ({ customerName, locale, planName, amount, nextBillingDate }) => {
  const t = emailTranslator(locale);
  const managePath = localizePathname("/manage-subscription", locale);
  const formattedAmount = (amount / 100).toFixed(2);
  const formattedDate = formatLongDate(nextBillingDate, locale);

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header - Gold gradient with dark text for readability */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>{t("subscription.confirmHeading")}</Heading>
            <Text style={styles.headerSubtitle}>{planName}</Text>
          </Section>

          {/* Content - White background with dark text */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich("subscription.confirmBody", { planName, b: (chunks) => <strong style={{ color: EMAIL_COLORS.gold }}>{chunks}</strong> })}
            </Text>

            {/* {t("subscription.details")} - Light gray background */}
            <Section style={styles.detailsBox}>
              <Heading as="h3" style={styles.detailsTitle}>
                Subscription Details
              </Heading>
              <table style={styles.detailsTable}>
                <tbody>
                  <tr>
                    <td style={styles.detailLabel}>{t("common.plan")}</td>
                    <td style={styles.detailValue}>{planName}</td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>{t("subscription.monthly")}</td>
                    <td style={styles.detailValueHighlight}>
                      ${formattedAmount}{t("common.perMonth")}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.detailLabel}>{t("subscription.nextBilling")}</td>
                    <td style={styles.detailValue}>{formattedDate}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* What's Included - Green tinted background */}
            <Section style={styles.includedBox}>
              <Heading as="h3" style={styles.includedTitle}>
                {t("subscription.included")}
              </Heading>
              <ul style={styles.includedList}>
                {(t.raw("subscription.items") as string[]).map((item) => (
                  <li style={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              {t("common.questionsContact")}{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
            <Text style={styles.smallText}>
              {t("subscription.manageAnytime")}{" "}
              <Link href={`${SITE_BASE_URL}${managePath}`} style={styles.link}>
                rcweb.dev{managePath}
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>RC Web Solutions</Text>
            <Text style={styles.footerInfo}>
              {t("common.tagline")}
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
    borderBottom: `4px solid ${EMAIL_COLORS.gold}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.gold,
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
    margin: "0 0 32px 0",
  },
  detailsBox: {
    backgroundColor: EMAIL_COLORS.lightGray,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
    border: `1px solid #e5e7eb`,
  },
  detailsTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
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
    color: EMAIL_COLORS.green,
    fontWeight: 700,
    fontSize: "16px",
    borderBottom: "1px solid #e5e7eb",
  },
  includedBox: {
    backgroundColor: EMAIL_COLORS.greenLight,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
    border: `1px solid ${EMAIL_COLORS.green}`,
  },
  includedTitle: {
    color: EMAIL_COLORS.greenDark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  includedList: {
    color: EMAIL_COLORS.greenDark,
    fontSize: "14px",
    lineHeight: "1.8",
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "8px",
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
  smallText: {
    textAlign: "center" as const,
    color: "#9ca3af",
    fontSize: "12px",
    margin: "16px 0 0 0",
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
    color: "#9ca3af",
    fontSize: "12px",
    margin: 0,
  },
};

export default SubscriptionConfirmationEmail;
