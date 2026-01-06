// src/lib/email/templates/SetupPasswordEmail.tsx

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

export interface SetupPasswordEmailProps {
  customerName: string;
  setupPasswordUrl: string;
  projectCode: string;
  accessToken: string;
}

export const SetupPasswordEmail: React.FC<SetupPasswordEmailProps> = ({
  customerName,
  setupPasswordUrl,
  projectCode,
  accessToken,
}) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>
              Complete Your Account Setup
            </Heading>
            <Text style={styles.headerSubtitle}>
              Set up your password to access your client portal
            </Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>
              Hi <strong>{customerName}</strong>,
            </Text>
            <Text style={styles.paragraph}>
              Thank you for your payment! Your project has been created and your
              client portal account is ready. To access your portal and view
              your project details, please set up your password by clicking the
              button below.
            </Text>

            {/* CTA Button */}
            <Section style={styles.buttonContainer}>
              <Button href={setupPasswordUrl} style={styles.button}>
                Set Up Your Password
              </Button>
            </Section>

            <Text style={styles.paragraph}>
              This link will expire in <strong>30 days</strong>. If you don't
              set up your password within this time, you can request a new link
              from the login page.
            </Text>

            {/* Project Access Info */}
            <Section style={styles.infoBox}>
              <Heading as="h3" style={styles.infoTitle}>
                Your Project Information:
              </Heading>
              <Text style={styles.infoText}>
                <strong>Project Code:</strong> {projectCode}
              </Text>
              <Text style={styles.infoText}>
                <strong>Access Token:</strong> {accessToken}
              </Text>
              <Text style={styles.infoNote}>
                You can use these credentials to access your project directly
                without logging in, or set up your password to use the full
                client portal.
              </Text>
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
    backgroundColor: EMAIL_COLORS.lightGray,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    backgroundColor: EMAIL_COLORS.purple,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${EMAIL_COLORS.purpleDark}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.purpleLight,
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
  infoBox: {
    backgroundColor: EMAIL_COLORS.lightGray,
    borderRadius: "12px",
    padding: "24px",
    margin: "32px 0",
    border: `1px solid #e5e7eb`,
  },
  infoTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  infoText: {
    color: EMAIL_COLORS.gray,
    fontSize: "15px",
    lineHeight: "1.8",
    margin: "8px 0",
    fontFamily: "monospace",
  },
  infoNote: {
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "16px 0 0 0",
    fontStyle: "italic",
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

export default SetupPasswordEmail;

