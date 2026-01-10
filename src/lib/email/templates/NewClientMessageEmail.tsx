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

export interface NewClientMessageEmailProps {
  clientName: string;
  clientEmail: string;
  projectCode: string;
  planName: string;
  message: string;
  adminPanelUrl: string;
}

export const NewClientMessageEmail: React.FC<NewClientMessageEmailProps> = ({
  clientName,
  clientEmail,
  projectCode,
  planName,
  message,
  adminPanelUrl,
}) => {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>New Client Message</Heading>
            <Text style={styles.headerSubtitle}>RC Web Solutions</Text>
          </Section>

          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.greeting}>Hi there,</Text>
            <Text style={styles.paragraph}>
              You have received a new message from <strong>{clientName}</strong>{" "}
              regarding their project.
            </Text>

            {/* Project Info */}
            <Section style={styles.infoBox}>
              <Text style={styles.infoTitle}>Project Information</Text>
              <table style={{ width: "100%", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={styles.infoLabel}>Client:</td>
                    <td style={styles.infoValue}>{clientName}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Email:</td>
                    <td style={styles.infoValue}>{clientEmail}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Project Code:</td>
                    <td style={styles.infoValueCode}>{projectCode}</td>
                  </tr>
                  <tr>
                    <td style={styles.infoLabel}>Plan:</td>
                    <td style={styles.infoValue}>{planName}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Message */}
            <Section style={styles.messageBox}>
              <Text style={styles.messageTitle}>Client Message:</Text>
              <Text style={styles.messageText}>{message}</Text>
            </Section>

            {/* Action Button */}
            <Section style={styles.buttonContainer}>
              <Button href={adminPanelUrl} style={styles.button}>
                View & Reply in Admin Panel
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              This message was sent from the client portal. You can respond
              directly from the admin panel.
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
    backgroundColor: EMAIL_COLORS.blue,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${EMAIL_COLORS.blueDark}`,
  },
  headerTitle: {
    color: EMAIL_COLORS.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: EMAIL_COLORS.blueLight,
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
  infoBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "32px 0",
    border: `1px solid ${EMAIL_COLORS.blueLight}`,
  },
  infoTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 16px 0",
  },
  infoLabel: {
    color: EMAIL_COLORS.gray,
    padding: "8px 0",
    fontWeight: 600,
    width: "35%",
  },
  infoValue: {
    color: EMAIL_COLORS.dark,
    padding: "8px 0",
  },
  infoValueCode: {
    color: EMAIL_COLORS.blue,
    padding: "8px 0",
    fontFamily: "monospace",
    fontWeight: 600,
  },
  messageBox: {
    backgroundColor: "#fef3c7",
    borderRadius: "12px",
    padding: "24px",
    margin: "32px 0",
    border: `1px solid ${EMAIL_COLORS.amber}`,
  },
  messageTitle: {
    color: EMAIL_COLORS.dark,
    fontSize: "16px",
    fontWeight: 600,
    margin: "0 0 12px 0",
  },
  messageText: {
    color: EMAIL_COLORS.dark,
    fontSize: "15px",
    lineHeight: "1.8",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
  },
  buttonContainer: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: EMAIL_COLORS.blue,
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
  footerText: {
    textAlign: "center" as const,
    color: EMAIL_COLORS.gray,
    fontSize: "14px",
    margin: 0,
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

export default NewClientMessageEmail;
