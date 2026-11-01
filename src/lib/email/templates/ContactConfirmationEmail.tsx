// src/lib/email/templates/ContactConfirmationEmail.tsx

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
import { localizePathname } from "@/i18n/paths";
import type { Locale } from "@/i18n/routing";

export interface ContactConfirmationEmailProps {
  customerName: string;
  locale: Locale;
  siteUrl: string;
}

export const ContactConfirmationEmail: React.FC<
  ContactConfirmationEmailProps
> = ({ customerName, locale, siteUrl }) => {
  const t = emailTranslator(locale);
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>{t("contact.heading")}</Heading>
            <Text style={styles.headerSubtitle}>{t("contact.subheading")}</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>
            <Text style={styles.paragraph}>
              {t("contact.body")}
            </Text>

            <Section style={styles.infoBox}>
              <Heading as="h3" style={styles.infoTitle}>
                {t("contact.fasterTitle")}
              </Heading>
              <Text style={styles.infoText}>
                {t("contact.callOrText")}{" "}
                <Link href="tel:+13463757534" style={styles.link}>
                  (346) 375-7534
                </Link>
                {t("contact.orReply")}
              </Text>
            </Section>

            <Section style={styles.buttonContainer}>
              <Button href={`${siteUrl}${localizePathname("/projects-portfolio", locale)}`} style={styles.button}>
                {t("contact.cta")}
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.signature}>
              {t("contact.signoff")}
              <br />
              <strong>Randy Caballero</strong>
              <br />
              RC Web Solutions LLC
            </Text>
          </Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerBrand}>RC Web Solutions</Text>
            <Text style={styles.footerInfo}>
              {t("common.taglineHouston")}
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
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
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
  infoBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 32px 0",
  },
  infoTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 8px 0",
  },
  infoText: {
    color: EMAIL_COLORS.gray,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: EMAIL_COLORS.purple,
    color: EMAIL_COLORS.white,
    padding: "14px 32px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "16px",
    display: "inline-block",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  signature: {
    color: EMAIL_COLORS.gray,
    fontSize: "15px",
    lineHeight: "1.6",
    margin: 0,
  },
  link: {
    color: EMAIL_COLORS.purple,
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

export default ContactConfirmationEmail;
