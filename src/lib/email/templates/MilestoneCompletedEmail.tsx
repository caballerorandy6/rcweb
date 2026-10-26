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
import { COMPANY } from "@/lib/company";
import { formatDate } from "@/lib/utils";
import type { MilestoneCompletedEmailData } from "@/lib/milestone/completedEmail";

export type MilestoneCompletedEmailProps = MilestoneCompletedEmailData;

const colors = EMAIL_COLORS;

const STATUS_MARK: Record<MilestoneCompletedEmailProps["milestones"][number]["status"], { mark: string; label: string; color: string }> = {
  completed: { mark: "✓", label: "Completed", color: colors.green },
  in_progress: { mark: "▶", label: "In progress", color: colors.blue },
  pending: { mark: "○", label: "Pending", color: colors.grayLight },
};

export const MilestoneCompletedEmail = ({
  customerName,
  projectCode,
  planName,
  milestoneTitle,
  milestoneDescription,
  completedAt,
  completedCount,
  totalCount,
  milestones,
  projectUrl,
}: MilestoneCompletedEmailProps) => {
  const allDone = totalCount > 0 && completedCount === totalCount;

  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>Milestone Completed</Heading>
            <Text style={styles.headerSubtitle}>
              Project {projectCode} · {planName}
            </Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.paragraph}>
              Hi <strong>{customerName}</strong>,
            </Text>

            <Text style={styles.paragraph}>
              A quick update on your project: we just completed{" "}
              <strong>{milestoneTitle}</strong>.
            </Text>

            <Section style={styles.highlight}>
              <Text style={styles.highlightMark}>✓</Text>
              <Text style={styles.highlightTitle}>{milestoneTitle}</Text>
              {milestoneDescription ? (
                <Text style={styles.highlightDescription}>{milestoneDescription}</Text>
              ) : null}
              <Text style={styles.highlightDate}>
                Completed {formatDate(completedAt, { month: "long" })}
              </Text>
            </Section>

            <Section style={styles.box}>
              <Text style={styles.boxTitle}>Where things stand</Text>
              <Text style={styles.progress}>
                <strong>
                  {completedCount} of {totalCount}
                </strong>{" "}
                {totalCount === 1 ? "milestone" : "milestones"} completed
              </Text>
              <table style={{ width: "100%", fontSize: "14px", borderCollapse: "collapse" as const }}>
                <tbody>
                  {milestones.map((m, index) => {
                    const mark = STATUS_MARK[m.status];
                    return (
                      <tr key={index}>
                        <td style={{ ...styles.rowMark, color: mark.color }}>{mark.mark}</td>
                        <td style={styles.rowTitle}>{m.title}</td>
                        <td style={{ ...styles.rowStatus, color: mark.color }}>{mark.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Section>

            <Section style={{ textAlign: "center", margin: "32px 0" }}>
              <Button href={projectUrl} style={styles.button}>
                View Project Progress
              </Button>
            </Section>

            <Text style={styles.paragraph}>
              {allDone
                ? "Every milestone is done. We will be in touch shortly with the next step."
                : "We will send you another note as the next milestone is completed. In the meantime, the progress page above always shows the current status."}
            </Text>

            <Text style={styles.paragraph}>
              Questions or feedback? Just reply to this email.
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
              <Link href={projectUrl} style={styles.link}>
                {projectUrl}
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
  highlight: {
    backgroundColor: colors.greenLight,
    border: `1px solid ${colors.green}`,
    borderRadius: "12px",
    padding: "24px",
    margin: "0 0 20px 0",
    textAlign: "center" as const,
  },
  highlightMark: {
    color: colors.green,
    fontSize: "32px",
    lineHeight: 1,
    margin: "0 0 8px 0",
  },
  highlightTitle: {
    color: colors.greenDark,
    fontSize: "20px",
    fontWeight: 700,
    margin: 0,
  },
  highlightDescription: {
    color: colors.gray,
    fontSize: "15px",
    lineHeight: 1.6,
    margin: "8px 0 0 0",
    whiteSpace: "pre-line" as const,
  },
  highlightDate: {
    color: colors.greenDark,
    fontSize: "13px",
    margin: "12px 0 0 0",
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
    margin: "0 0 4px 0",
  },
  progress: {
    color: colors.gray,
    fontSize: "15px",
    margin: "0 0 16px 0",
  },
  rowMark: {
    width: "24px",
    padding: "6px 0",
    fontWeight: 700,
  },
  rowTitle: {
    padding: "6px 8px",
    color: colors.gray,
  },
  rowStatus: {
    padding: "6px 0",
    textAlign: "right" as const,
    fontSize: "13px",
    fontWeight: 600,
    whiteSpace: "nowrap" as const,
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

export default MilestoneCompletedEmail;
