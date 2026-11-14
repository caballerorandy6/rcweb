// src/lib/email/templates/SubscriptionPortalLinkEmail.tsx

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

export interface SubscriptionPortalLinkEmailProps {
  customerName: string;
  locale: Locale;
  portalUrl: string;
  planName: string;
}

export const SubscriptionPortalLinkEmail: React.FC<
  SubscriptionPortalLinkEmailProps
> = ({ customerName, locale, portalUrl, planName }) => {
  const t = emailTranslator(locale);
  return (
    <Html lang={locale}>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>{t("subscription.portalHeading")}</Heading>
            <Text style={styles.headerSubtitle}>{planName}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>
            <Text style={styles.paragraph}>
              {t("subscription.portalBody")}
            </Text>

            {/* Features list */}
            <Section style={styles.featuresBox}>
              <ul style={styles.featuresList}>
                {(t.raw("subscription.portalItems") as string[]).map((item) => (
                  <li style={styles.listItem} key={item}>{item}</li>
                ))}
              </ul>
            </Section>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={portalUrl} style={styles.button}>
                {t("subscription.portalCta")}
              </Button>
            </Section>

            <Text style={styles.expiryNote}>
              {t("subscription.portalExpiry")}
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              {t("subscription.portalIgnore")}
            </Text>
            <Text style={styles.smallText}>
              {t("common.questionsContact")}{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
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
    margin: "0 0 24px 0",
  },
  featuresBox: {
    backgroundColor: EMAIL_COLORS.lightGray,
    borderRadius: "12px",
    padding: "20px 24px",
    margin: "0 0 32px 0",
    border: "1px solid #e5e7eb",
  },
  featuresList: {
    color: EMAIL_COLORS.dark,
    fontSize: "14px",
    lineHeight: "1.8",
    margin: 0,
    paddingLeft: "20px",
  },
  listItem: {
    marginBottom: "8px",
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
  expiryNote: {
    color: "#9ca3af",
    fontSize: "13px",
    textAlign: "center" as const,
    margin: "0 0 32px 0",
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

export default SubscriptionPortalLinkEmail;
