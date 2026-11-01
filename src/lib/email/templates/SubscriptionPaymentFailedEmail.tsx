// src/lib/email/templates/SubscriptionPaymentFailedEmail.tsx

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
import { emailTranslator } from "../i18n";
import type { Locale } from "@/i18n/routing";

export interface SubscriptionPaymentFailedEmailProps {
  customerName: string;
  locale: Locale;
  planName: string;
  amount: number; // in cents
  updatePaymentUrl: string;
}

export const SubscriptionPaymentFailedEmail: React.FC<
  SubscriptionPaymentFailedEmailProps
> = ({ customerName, locale, planName, amount, updatePaymentUrl }) => {
  const t = emailTranslator(locale);
  const formattedAmount = (amount / 100).toFixed(2);

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>{t("subscription.failedHeading")}</Heading>
            <Text style={styles.headerSubtitle}>{t("subscription.failedSubheading")}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>

            {/* Alert Box */}
            <Section style={styles.alertBox}>
              <Text style={styles.alertText}>
                {t.rich("subscription.failedBody", { amount: `$${formattedAmount}`, planName, b: (chunks) => <strong>{chunks}</strong> })}
              </Text>
            </Section>

            <Text style={styles.paragraph}>
              {t("subscription.failedUpdate")}
            </Text>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={updatePaymentUrl} style={styles.button}>
                {t("subscription.failedCta")}
              </Button>
            </Section>

            <Text style={styles.paragraph}>
              {t("subscription.failedReasons")}
            </Text>
            <ul style={styles.list}>
              {(t.raw("subscription.reasons") as string[]).map((item) => (
                <li style={styles.listItem} key={item}>{item}</li>
              ))}
            </ul>

            <Text style={styles.warningText}>
              {t("subscription.failedDeadline")}
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              {t("common.helpContact")}{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
            <Text style={styles.smallText}>
              {t("subscription.failedBank")}
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
    borderBottom: `4px solid ${EMAIL_COLORS.red}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.red,
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
  alertBox: {
    backgroundColor: EMAIL_COLORS.redLight,
    borderRadius: "12px",
    padding: "20px 24px",
    margin: "0 0 24px 0",
    border: `1px solid ${EMAIL_COLORS.red}`,
  },
  alertText: {
    color: EMAIL_COLORS.redDark,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },
  paragraph: {
    color: EMAIL_COLORS.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  list: {
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    lineHeight: "1.8",
    margin: "0 0 24px 0",
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "4px",
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: EMAIL_COLORS.red,
    color: EMAIL_COLORS.white,
    padding: "16px 32px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    textDecoration: "none",
    display: "inline-block",
  },
  warningText: {
    color: EMAIL_COLORS.redDark,
    fontSize: "14px",
    fontWeight: 600,
    textAlign: "center" as const,
    margin: "0 0 24px 0",
    padding: "12px",
    backgroundColor: EMAIL_COLORS.redLight,
    borderRadius: "8px",
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
    margin: "0 0 8px 0",
  },
  smallText: {
    textAlign: "center" as const,
    color: "#9ca3af",
    fontSize: "12px",
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
    color: "#9ca3af",
    fontSize: "12px",
    margin: 0,
  },
};

export default SubscriptionPaymentFailedEmail;
