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

export type PaymentIssueKind = "refund" | "dispute_opened" | "dispute_won" | "dispute_lost";

export interface PaymentIssueAdminEmailProps {
  kind: PaymentIssueKind;
  projectCode: string;
  customerName: string;
  customerEmail: string;
  planName: string;
  /** "Deposit (50%)" or "Final payment (50%)" */
  chargeLabel: string;
  /** Cents the customer paid for this charge, tax included */
  chargeTotal: number;
  /** Cents involved in this event: refunded so far, or disputed */
  amount: number;
  /** Stripe's reason for a dispute (`fraudulent`, `product_not_received`…) */
  reason?: string;
  /** Deadline to submit evidence, for an open dispute */
  respondBy?: Date;
  /** Admin page of the project */
  adminProjectUrl: string;
  /** The payment or dispute in the Stripe dashboard */
  stripeUrl: string;
}

const colors = EMAIL_COLORS;

const COPY: Record<PaymentIssueKind, { title: string; tone: string }> = {
  refund: { title: "Payment refunded", tone: colors.amberDark },
  dispute_opened: { title: "Payment disputed", tone: colors.red },
  dispute_won: { title: "Dispute won", tone: colors.green },
  dispute_lost: { title: "Dispute lost", tone: colors.red },
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

/** To the admin: money went back to a customer, or a bank is asking for it */
export const PaymentIssueAdminEmail = ({
  kind,
  projectCode,
  customerName,
  customerEmail,
  planName,
  chargeLabel,
  chargeTotal,
  amount,
  reason,
  respondBy,
  adminProjectUrl,
  stripeUrl,
}: PaymentIssueAdminEmailProps) => {
  const { title, tone } = COPY[kind];
  const partial = amount < chargeTotal;

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={{ ...styles.headerTitle, color: tone }}>{title}</Heading>
            <Text style={styles.headerSubtitle}>
              Project {projectCode} · {planName}
            </Text>
          </Section>
          <Section style={styles.content}>
            <Text style={styles.paragraph}>
              {kind === "refund" && (
                <>
                  <strong>{formatCurrency(amount)}</strong> of the {chargeLabel.toLowerCase()} (
                  {formatCurrency(chargeTotal)}) paid by <strong>{customerName}</strong> (
                  {customerEmail}) has been refunded
                  {partial ? ", so the charge stays marked as paid" : " in full"}. The revenue
                  figures in the admin already leave it out; Stripe Tax reverses the tax on its
                  own.
                </>
              )}
              {kind === "dispute_opened" && (
                <>
                  <strong>{customerName}</strong> ({customerEmail}) disputed{" "}
                  <strong>{formatCurrency(amount)}</strong> of the {chargeLabel.toLowerCase()} (
                  {formatCurrency(chargeTotal)})
                  {reason ? ` as "${reason.replace(/_/g, " ")}"` : ""}. Stripe has withdrawn the
                  money and the dispute fee while the bank decides.
                </>
              )}
              {kind === "dispute_won" && (
                <>
                  The bank sided with you on the <strong>{formatCurrency(amount)}</strong>{" "}
                  dispute over the {chargeLabel.toLowerCase()} of <strong>{customerName}</strong>{" "}
                  ({customerEmail}). The money is back in the account and the charge stays paid.
                </>
              )}
              {kind === "dispute_lost" && (
                <>
                  The bank sided with the customer: <strong>{formatCurrency(amount)}</strong> of
                  the {chargeLabel.toLowerCase()} of <strong>{customerName}</strong> (
                  {customerEmail}) is gone for good
                  {partial ? " and the charge stays marked as paid for the rest" : ", so the charge is marked as refunded"}
                  . The revenue figures already leave it out.
                </>
              )}
            </Text>
            {kind === "dispute_opened" && respondBy ? (
              <Text style={styles.paragraph}>
                Respond in the Stripe dashboard <strong>before {formatDate(respondBy)}</strong>:
                after that the dispute is lost automatically. The invoice, the signed terms and
                your emails with the customer are the evidence that usually wins.
              </Text>
            ) : null}
            {kind === "refund" || kind === "dispute_lost" ? (
              <Text style={styles.paragraph}>
                The project itself has not been changed: decide from its page whether the work
                goes on, and let the customer know.
              </Text>
            ) : null}
            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Button href={stripeUrl} style={styles.button}>
                Open in Stripe
              </Button>
            </Section>
            <Hr style={styles.hr} />
            <Text style={styles.footer}>
              Project page: <a href={adminProjectUrl} style={styles.link}>{adminProjectUrl}</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PaymentIssueAdminEmail;

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
  headerTitle: { margin: 0, fontSize: "28px", fontWeight: 700 },
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
  link: { color: colors.gray, wordBreak: "break-all" as const },
};
