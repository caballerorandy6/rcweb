// src/lib/email/templates/MaintenanceReportEmail.tsx

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
} from "@react-email/components";
import * as React from "react";
import { EMAIL_COLORS } from "../colors";
import { emailTranslator, formatMonth } from "../i18n";
import { formatMinutes } from "@/lib/maintenanceHours";
import type { MaintenanceReportEmailData } from "@/lib/maintenanceReport/email";

export type MaintenanceReportEmailProps = MaintenanceReportEmailData;

const colors = EMAIL_COLORS;

export const MaintenanceReportEmail = ({
  customerName,
  locale,
  planName,
  month,
  hours,
  errorsResolved,
  updatesApplied,
  backupsVerified,
  uptimePercent,
  visitors,
  pageViews,
  notes,
}: MaintenanceReportEmailProps) => {
  const t = emailTranslator(locale);
  const monthName = formatMonth(month, locale);
  const number = new Intl.NumberFormat(locale === "es" ? "es-US" : "en-US", { maximumFractionDigits: 2 });

  // Only what the admin reported this month; a blank figure is left out
  const figures: [string, string][] = [];
  if (errorsResolved !== null) figures.push([t("maintenanceReport.errorsResolved"), number.format(errorsResolved)]);
  if (updatesApplied !== null) figures.push([t("maintenanceReport.updatesApplied"), number.format(updatesApplied)]);
  if (backupsVerified !== null) {
    figures.push([
      t("maintenanceReport.backups"),
      t(backupsVerified ? "maintenanceReport.backupsVerified" : "maintenanceReport.backupsNotVerified"),
    ]);
  }
  if (uptimePercent !== null) figures.push([t("maintenanceReport.uptime"), `${number.format(uptimePercent)}%`]);
  if (visitors !== null) figures.push([t("maintenanceReport.visitors"), number.format(visitors)]);
  if (pageViews !== null) figures.push([t("maintenanceReport.pageViews"), number.format(pageViews)]);

  return (
    <Html lang={locale}>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Section style={styles.header}>
            <Heading style={styles.headerTitle}>{t("maintenanceReport.heading")}</Heading>
            <Text style={styles.headerSubtitle}>
              {t("maintenanceReport.subheading", { month: monthName, planName })}
            </Text>
          </Section>

          <Section style={styles.content}>
            <Text style={styles.greeting}>
              {t.rich("common.greeting", { name: customerName, b: (chunks) => <strong>{chunks}</strong> })}
            </Text>
            <Text style={styles.paragraph}>{t("maintenanceReport.intro", { month: monthName })}</Text>

            <Text style={styles.sectionTitle}>{t("maintenanceReport.hoursTitle")}</Text>
            <Section style={styles.detailsBox}>
              <Text style={styles.boxText}>
                {hours.used === 0
                  ? t("maintenanceReport.hoursNone")
                  : t.rich("maintenanceReport.hoursUsed", {
                      used: formatMinutes(hours.used),
                      included: formatMinutes(hours.included),
                      b: (chunks) => <strong style={styles.highlight}>{chunks}</strong>,
                    })}
              </Text>
              {hours.extra > 0 ? (
                <Text style={styles.extraText}>
                  {t("maintenanceReport.hoursExtra", { extra: formatMinutes(hours.extra) })}
                </Text>
              ) : null}
            </Section>

            {figures.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>{t("maintenanceReport.figuresTitle")}</Text>
                <Section style={styles.detailsBox}>
                  <table style={styles.detailsTable}>
                    <tbody>
                      {figures.map(([label, value]) => (
                        <tr key={label}>
                          <td style={styles.detailLabel}>{label}</td>
                          <td style={styles.detailValue}>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Section>
              </>
            ) : null}

            {notes ? (
              <>
                <Text style={styles.sectionTitle}>{t("maintenanceReport.notesTitle")}</Text>
                <Text style={styles.notes}>{notes}</Text>
              </>
            ) : null}

            <Text style={styles.paragraph}>{t("maintenanceReport.questions")}</Text>

            <Hr style={styles.divider} />

            <Text style={styles.footerText}>
              {t("common.questionsContact")}{" "}
              <Link href="mailto:contactus@rcweb.dev" style={styles.link}>
                contactus@rcweb.dev
              </Link>
            </Text>
          </Section>

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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
    backgroundColor: colors.lightGray,
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    backgroundColor: colors.dark,
    padding: "48px 32px",
    textAlign: "center" as const,
    borderRadius: "16px 16px 0 0",
    borderBottom: `4px solid ${colors.gold}`,
  },
  headerTitle: {
    color: colors.white,
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
  },
  headerSubtitle: {
    color: colors.gold,
    margin: "12px 0 0 0",
    fontSize: "16px",
    fontWeight: 500,
  },
  content: {
    backgroundColor: colors.white,
    padding: "40px 32px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  greeting: {
    color: colors.dark,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 16px 0",
  },
  paragraph: {
    color: colors.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
  },
  sectionTitle: {
    color: colors.dark,
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    margin: "0 0 8px 0",
  },
  detailsBox: {
    backgroundColor: colors.lightGray,
    borderRadius: "12px",
    padding: "16px 24px",
    margin: "0 0 24px 0",
    border: "1px solid #e5e7eb",
  },
  boxText: {
    color: colors.dark,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: 0,
  },
  highlight: {
    color: colors.goldDark,
  },
  extraText: {
    color: colors.amberDark,
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "8px 0 0 0",
  },
  detailsTable: {
    width: "100%",
    fontSize: "14px",
    borderCollapse: "collapse" as const,
  },
  detailLabel: {
    padding: "10px 0",
    color: colors.gray,
    borderBottom: "1px solid #e5e7eb",
  },
  detailValue: {
    padding: "10px 0",
    textAlign: "right" as const,
    color: colors.dark,
    fontWeight: 600,
    borderBottom: "1px solid #e5e7eb",
  },
  notes: {
    color: colors.gray,
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
    whiteSpace: "pre-line" as const,
  },
  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "32px 0",
  },
  footerText: {
    textAlign: "center" as const,
    color: colors.gray,
    fontSize: "14px",
    margin: 0,
  },
  link: {
    color: colors.gold,
    textDecoration: "none",
    fontWeight: 600,
  },
  footer: {
    backgroundColor: colors.dark,
    padding: "24px 32px",
    textAlign: "center" as const,
    borderRadius: "0 0 16px 16px",
  },
  footerBrand: {
    color: colors.gold,
    fontSize: "16px",
    fontWeight: 700,
    margin: "0 0 4px 0",
  },
  footerInfo: {
    color: colors.grayLight,
    fontSize: "12px",
    margin: 0,
  },
};

export default MaintenanceReportEmail;
