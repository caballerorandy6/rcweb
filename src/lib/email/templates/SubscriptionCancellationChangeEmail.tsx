// src/lib/email/templates/SubscriptionCancellationChangeEmail.tsx

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
import { emailTranslator, formatLongDate } from "../i18n";
import type { Locale } from "@/i18n/routing";

export interface SubscriptionCancellationChangeEmailProps {
  /** The customer scheduled a cancellation, or took it back */
  kind: "scheduled" | "resumed";
  customerName: string;
  locale: Locale;
  planName: string;
  /** Last day of service when scheduled; next renewal when resumed */
  date: Date;
  manageUrl: string;
}

export const SubscriptionCancellationChangeEmail: React.FC<
  SubscriptionCancellationChangeEmailProps
> = ({ kind, customerName, locale, planName, date, manageUrl }) => {
  const t = emailTranslator(locale);
  const formattedDate = formatLongDate(date, locale);
  const bold = (chunks: React.ReactNode) => <strong>{chunks}</strong>;

  return (
    <Html lang={locale}>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>
              {kind === "scheduled"
                ? t("subscription.scheduledHeading")
                : t("subscription.resumedHeading")}
            </Heading>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", {
                name: customerName,
                b: (chunks) => <strong>{chunks}</strong>,
              })}
            </Text>

            <Text style={styles.paragraph}>
              {kind === "scheduled"
                ? t.rich("subscription.scheduledBody", {
                    planName,
                    date: formattedDate,
                    b: bold,
                  })
                : t.rich("subscription.resumedBody", {
                    planName,
                    date: formattedDate,
                    b: bold,
                  })}
            </Text>

            {kind === "scheduled" && (
              <Text style={styles.paragraph}>
                {t("subscription.scheduledUndo")}
              </Text>
            )}

            <Section style={styles.buttonContainer}>
              <Button href={manageUrl} style={styles.button}>
                {t("subscription.renewalCta")}
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              {t("common.helpContact")}{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>RC Web Solutions</Text>
            <Text style={styles.footerInfo}>{t("common.tagline")}</Text>
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
    margin: "0 0 16px 0",
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0 0 0",
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
    color: "#9ca3af",
    fontSize: "12px",
    margin: 0,
  },
};

export default SubscriptionCancellationChangeEmail;
