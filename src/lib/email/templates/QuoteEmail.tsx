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
import { COMPANY, isZelleAvailable } from "@/lib/company";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEPOSIT_PERCENT } from "@/lib/project/charges";

export interface QuoteEmailProps {
  customerName: string;
  quoteNumber: string;
  planName: string;
  scope: string[];
  notes: string | null;
  /** Cents */
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  expiresAt: Date;
  /** Link to /quote/[token] */
  quoteUrl: string;
}

const colors = EMAIL_COLORS;

export const QuoteEmail = ({
  customerName,
  quoteNumber,
  planName,
  scope,
  notes,
  totalAmount,
  depositAmount,
  balanceAmount,
  expiresAt,
  quoteUrl,
}: QuoteEmailProps) => {
  const validUntil = formatDate(expiresAt, { month: "long" });

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Your Quote is Ready</Heading>
            <Text style={styles.headerSubtitle}>
              Quote {quoteNumber} · {planName}
            </Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.paragraph}>
              Hi <strong>{customerName}</strong>,
            </Text>

            <Text style={styles.paragraph}>
              Thank you for taking the time to talk through your project. Below
              is the written quote we discussed. Review it at your own pace; the
              link at the bottom has the full scope and lets you get started
              whenever you are ready.
            </Text>

            <Section style={styles.box}>
              <Text style={styles.boxTitle}>What&apos;s included</Text>
              <ul style={styles.list}>
                {scope.map((item, index) => (
                  <li key={index} style={styles.listItem}>
                    {item}
                  </li>
                ))}
              </ul>
              {notes ? (
                <>
                  <Hr style={styles.boxHr} />
                  <Text style={styles.notes}>{notes}</Text>
                </>
              ) : null}
            </Section>

            <Section style={styles.box}>
              <Text style={styles.boxTitle}>Investment</Text>
              <table style={{ width: "100%", fontSize: "14px" }}>
                <tbody>
                  <tr>
                    <td style={styles.rowLabel}>Project total</td>
                    <td style={styles.rowValueStrong}>
                      {formatCurrency(totalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td style={styles.rowLabel}>
                      Deposit to start ({DEPOSIT_PERCENT}%)
                    </td>
                    <td style={styles.rowValue}>{formatCurrency(depositAmount)}</td>
                  </tr>
                  <tr>
                    <td style={styles.rowLabel}>Balance on delivery</td>
                    <td style={styles.rowValue}>{formatCurrency(balanceAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Button href={quoteUrl} style={styles.button}>
                Review and Accept Quote
              </Button>
              <Text style={styles.validity}>
                This quote is valid until <strong>{validUntil}</strong>.
              </Text>
            </Section>

            <Text style={styles.paragraph}>
              Accepting the quote takes you to a secure Stripe checkout for the
              deposit{isZelleAvailable() ? ", or you can choose to pay it by Zelle" : ""}.
              Work starts as soon as it clears, and the balance is only due when
              the project is delivered.
            </Text>

            <Text style={styles.paragraph}>
              Questions or changes? Just reply to this email.
            </Text>

            <Hr style={styles.hr} />

            <Text style={styles.footer}>
              {COMPANY.name} ·{" "}
              <Link href={`mailto:${COMPANY.contactEmail}`} style={styles.link}>
                {COMPANY.contactEmail}
              </Link>{" "}
              · {COMPANY.phoneDisplay}
            </Text>
            <Text style={styles.footerSmall}>
              If the button does not work, copy this link into your browser:{" "}
              <Link href={quoteUrl} style={styles.link}>
                {quoteUrl}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  header: {
    background: `linear-gradient(135deg, ${colors.dark} 0%, #2d2d2d 100%)`,
    padding: "48px 32px",
    textAlign: "center" as const,
  },
  headerTitle: {
    color: colors.gold,
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.85)",
    margin: "8px 0 0 0",
    fontSize: "16px",
  },
  content: {
    padding: "40px 32px",
  },
  paragraph: {
    color: colors.gray,
    fontSize: "16px",
    lineHeight: 1.6,
    margin: "0 0 20px 0",
  },
  box: {
    backgroundColor: "#f9fafb",
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 20px 0",
  },
  boxTitle: {
    color: colors.dark,
    fontSize: "18px",
    fontWeight: 600,
    margin: "0 0 12px 0",
  },
  boxHr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "16px 0",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: colors.gray,
    fontSize: "15px",
    lineHeight: 1.7,
  },
  listItem: {
    margin: "0 0 4px 0",
  },
  notes: {
    color: colors.gray,
    fontSize: "14px",
    lineHeight: 1.6,
    margin: 0,
    whiteSpace: "pre-line" as const,
  },
  rowLabel: {
    padding: "6px 0",
    color: colors.grayLight,
  },
  rowValue: {
    textAlign: "right" as const,
    fontWeight: 600,
    color: colors.gray,
  },
  rowValueStrong: {
    textAlign: "right" as const,
    fontWeight: 700,
    color: colors.dark,
    fontSize: "16px",
  },
  button: {
    background: colors.gold,
    color: colors.dark,
    padding: "14px 28px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "16px",
    display: "inline-block",
  },
  validity: {
    color: colors.grayLight,
    fontSize: "14px",
    margin: "16px 0 0 0",
  },
  hr: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footer: {
    textAlign: "center" as const,
    color: colors.grayLight,
    fontSize: "14px",
    margin: "0 0 8px 0",
  },
  footerSmall: {
    textAlign: "center" as const,
    color: colors.grayLight,
    fontSize: "12px",
    margin: 0,
    wordBreak: "break-all" as const,
  },
  link: {
    color: colors.goldDark,
    textDecoration: "none",
  },
};

export default QuoteEmail;
