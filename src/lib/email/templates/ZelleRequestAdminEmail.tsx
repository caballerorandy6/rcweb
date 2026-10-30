import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Button,
} from "@react-email/components";
import * as React from "react";
import { EMAIL_COLORS } from "../colors";
import { formatCurrency } from "@/lib/utils";

export interface ZelleRequestAdminEmailProps {
  quoteNumber: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  /** Cents */
  depositAmount: number;
  /** Admin page of the quote, where the deposit is confirmed */
  adminQuoteUrl: string;
}

const colors = EMAIL_COLORS;

/** To the admin: a customer accepted a quote and chose to pay the deposit by Zelle */
export const ZelleRequestAdminEmail = ({
  quoteNumber,
  customerName,
  customerEmail,
  planName,
  depositAmount,
  adminQuoteUrl,
}: ZelleRequestAdminEmailProps) => (
  <Html>
    <Head />
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Section style={styles.header}>
          <Heading style={styles.headerTitle}>Zelle deposit on its way</Heading>
          <Text style={styles.headerSubtitle}>
            Quote {quoteNumber} · {planName}
          </Text>
        </Section>
        <Section style={styles.content}>
          <Text style={styles.paragraph}>
            <strong>{customerName}</strong> ({customerEmail}) accepted the terms of
            quote {quoteNumber} and chose to pay the{" "}
            <strong>{formatCurrency(depositAmount)}</strong> deposit by Zelle, with
            the quote number as the memo.
          </Text>
          <Text style={styles.paragraph}>
            When the money shows up, open the quote and press &ldquo;Deposit
            received&rdquo;: that creates the project, sends the customer the
            invoice and their progress link, and marks the lead as won.
          </Text>
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Button href={adminQuoteUrl} style={styles.button}>
              Open quote {quoteNumber}
            </Button>
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Nothing has been charged. The customer can still pay by card from the
            same quote page.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default ZelleRequestAdminEmail;

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    backgroundColor: colors.lightGray,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: colors.white,
    borderRadius: "16px",
    overflow: "hidden" as const,
  },
  header: {
    background: `linear-gradient(135deg, ${colors.dark} 0%, #2d2d2d 100%)`,
    padding: "40px 32px",
    textAlign: "center" as const,
  },
  headerTitle: { color: colors.gold, margin: 0, fontSize: "28px", fontWeight: 700 },
  headerSubtitle: { color: "rgba(255, 255, 255, 0.85)", margin: "8px 0 0 0", fontSize: "16px" },
  content: { padding: "32px" },
  paragraph: { color: colors.gray, fontSize: "16px", lineHeight: 1.6, margin: "0 0 20px 0" },
  button: {
    backgroundColor: colors.gold,
    color: colors.dark,
    padding: "14px 28px",
    borderRadius: "8px",
    fontWeight: 700,
    textDecoration: "none",
    display: "inline-block",
  },
  hr: { borderColor: colors.lightGray, margin: "24px 0" },
  footer: { color: colors.grayLight, fontSize: "13px", lineHeight: 1.5, margin: 0 },
};
