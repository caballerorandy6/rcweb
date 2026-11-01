// lib/invoice/InvoiceTemplate.tsx
// Professional PDF Invoice Template using @react-pdf/renderer

import React from "react";
import { emailTranslator, formatLongDate } from "@/lib/email/i18n";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  InvoiceData,
  InvoiceSummaryData,
  RC_WEB_COMPANY_INFO,
  centsToDollars,
} from "./types";

// Estilos profesionales para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "2px solid #d4af37", // Gold color
    paddingBottom: 15,
  },
  companyInfo: {
    fontSize: 10,
  },
  companyName: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  invoiceTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#d4af37",
    textAlign: "right",
  },
  invoiceDetails: {
    textAlign: "right",
    fontSize: 9,
    color: "#4a4a4a",
  },
  statusBadge: {
    backgroundColor: "#10b981",
    color: "#ffffff",
    padding: "4 12",
    borderRadius: 4,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  billTo: {
    backgroundColor: "#f9fafb",
    padding: 15,
    borderRadius: 4,
    marginBottom: 20,
  },
  table: {
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    padding: 10,
    fontFamily: "Helvetica-Bold",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1px solid #e5e7eb",
  },
  tableCol: {
    flex: 1,
  },
  tableColDescription: {
    flex: 3,
  },
  tableColAmount: {
    flex: 1,
    textAlign: "right",
  },
  totalsSection: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    padding: "5 0",
  },
  totalLabel: {
    fontSize: 10,
    color: "#4a4a4a",
  },
  totalAmount: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  grandTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 200,
    padding: "10 0",
    borderTop: "2px solid #d4af37",
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
  },
  grandTotalAmount: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#d4af37",
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#6b7280",
    borderTop: "1px solid #e5e7eb",
    paddingTop: 15,
  },
  paymentInfo: {
    backgroundColor: "#f0fdf4",
    padding: 15,
    borderRadius: 4,
    marginTop: 20,
    border: "1px solid #10b981",
  },
  paymentInfoText: {
    fontSize: 9,
    color: "#065f46",
    marginBottom: 3,
  },
  projectCode: {
    backgroundColor: "#fef3c7",
    padding: 10,
    borderRadius: 4,
    marginTop: 15,
    textAlign: "center",
    border: "1px solid #f59e0b",
  },
  projectCodeText: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#d97706",
    letterSpacing: 2,
  },
});

interface InvoiceTemplateProps {
  data: InvoiceData;
}

interface InvoiceSummaryTemplateProps {
  data: InvoiceSummaryData;
}

/**
 * Template para invoices individuales (initial, final)
 */
export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const t = emailTranslator(data.locale);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{RC_WEB_COMPANY_INFO.name}</Text>
            <Text>{RC_WEB_COMPANY_INFO.email}</Text>
            {RC_WEB_COMPANY_INFO.phone && (
              <Text>{RC_WEB_COMPANY_INFO.phone}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>{t("pdf.invoice")}</Text>
            <View style={styles.invoiceDetails}>
              <Text>{t("pdf.invoiceNumber", { number: data.invoiceNumber })}</Text>
              <Text>{t("pdf.issueDate", { date: formatLongDate(data.issueDate, data.locale) })}</Text>
              {data.dueDate && (
                <Text>{t("pdf.dueDate", { date: formatLongDate(data.dueDate, data.locale) })}</Text>
              )}
            </View>
            <View style={styles.statusBadge}>
              <Text>✓ {t(`pdf.status.${data.status}`)}</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("pdf.billTo")}</Text>
          <View style={styles.billTo}>
            <Text
              style={{ fontFamily: "Helvetica-Bold", marginBottom: 3 }}
            >
              {data.customerName}
            </Text>
            <Text>{data.customerEmail}</Text>
            <View style={styles.projectCode}>
              <Text style={{ fontSize: 8, color: "#92400e", marginBottom: 3 }}>
                {t("pdf.projectCode")}
              </Text>
              <Text style={styles.projectCodeText}>{data.projectCode}</Text>
            </View>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("pdf.projectDetails")}</Text>
          <Text style={{ fontSize: 10, color: "#4a4a4a" }}>
            {data.planName}
          </Text>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>{t("pdf.description")}</Text>
            <Text style={styles.tableColAmount}>{t("pdf.amount")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableColDescription}>{data.description}</Text>
            <Text style={styles.tableColAmount}>
              ${centsToDollars(data.subtotal)}
            </Text>
          </View>
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("pdf.subtotal")}</Text>
            <Text style={styles.totalAmount}>
              ${centsToDollars(data.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {t("pdf.tax", { rate: data.taxRate })}
            </Text>
            <Text style={styles.totalAmount}>
              ${centsToDollars(data.taxAmount)}
            </Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>{t("pdf.total")}</Text>
            <Text style={styles.grandTotalAmount}>
              ${centsToDollars(data.total)}
            </Text>
          </View>
        </View>

        {/* Payment Info */}
        {data.status === "paid" && data.paidDate && (
          <View style={styles.paymentInfo}>
            <Text
              style={[
                styles.paymentInfoText,
                { fontFamily: "Helvetica-Bold", marginBottom: 5 },
              ]}
            >
              {t("pdf.received")}
            </Text>
            <Text style={styles.paymentInfoText}>
              {t("pdf.paymentDate", { date: formatLongDate(data.paidDate, data.locale) })}
            </Text>
            <Text style={styles.paymentInfoText}>
              {t("pdf.paymentMethod", { method: t(`pdf.method.${data.paymentMethod}`) })}
            </Text>
            {data.stripeSessionId && (
              <Text style={styles.paymentInfoText}>
                {t("pdf.transaction", { id: data.stripeSessionId.substring(0, 24) })}
              </Text>
            )}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t("pdf.thanks")}</Text>
          <Text style={{ marginTop: 5 }}>
            {t("pdf.questions", { email: RC_WEB_COMPANY_INFO.email })}
          </Text>
          <Text style={{ marginTop: 5 }}>
            {RC_WEB_COMPANY_INFO.website}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

/**
 * Template para invoice summary (muestra ambos pagos)
 */
export const InvoiceSummaryTemplate: React.FC<InvoiceSummaryTemplateProps> = ({
  data,
}) => {
  const t = emailTranslator(data.locale);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>{RC_WEB_COMPANY_INFO.name}</Text>
            <Text>{RC_WEB_COMPANY_INFO.email}</Text>
            {RC_WEB_COMPANY_INFO.phone && (
              <Text>{RC_WEB_COMPANY_INFO.phone}</Text>
            )}
          </View>
          <View>
            <Text style={styles.invoiceTitle}>{t("pdf.invoice")}</Text>
            <Text style={[styles.invoiceTitle, { fontSize: 12, marginTop: 2 }]}>
              {t("pdf.projectSummary")}
            </Text>
            <View style={styles.invoiceDetails}>
              <Text>{t("pdf.invoiceNumber", { number: data.invoiceNumber })}</Text>
              <Text>{t("pdf.issueDate", { date: formatLongDate(data.issueDate, data.locale) })}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text>{t("pdf.paidInFull")}</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("pdf.billTo")}</Text>
          <View style={styles.billTo}>
            <Text
              style={{ fontFamily: "Helvetica-Bold", marginBottom: 3 }}
            >
              {data.customerName}
            </Text>
            <Text>{data.customerEmail}</Text>
            <View style={styles.projectCode}>
              <Text style={{ fontSize: 8, color: "#92400e", marginBottom: 3 }}>
                {t("pdf.projectCode")}
              </Text>
              <Text style={styles.projectCodeText}>{data.projectCode}</Text>
            </View>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("pdf.projectDetails")}</Text>
          <Text style={{ fontSize: 10, color: "#4a4a4a" }}>
            {data.planName}
          </Text>
        </View>

        {/* Payment Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableColDescription}>{t("pdf.paymentDescription")}</Text>
            <Text style={styles.tableCol}>{t("pdf.datePaid")}</Text>
            <Text style={styles.tableColAmount}>{t("pdf.amount")}</Text>
          </View>
          {data.items.map((item) => (
            <View key={`${item.description}-${item.paidDate}`} style={styles.tableRow}>
              <Text style={styles.tableColDescription}>
                {item.description} ({t(`pdf.method.${item.paymentMethod}`)})
              </Text>
              <Text style={styles.tableCol}>
                {formatLongDate(item.paidDate, data.locale)}
              </Text>
              <Text style={styles.tableColAmount}>
                ${centsToDollars(item.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>{t("pdf.subtotal")}</Text>
            <Text style={styles.totalAmount}>
              ${centsToDollars(data.subtotal)}
            </Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              {t("pdf.tax", { rate: data.taxRate })}
            </Text>
            <Text style={styles.totalAmount}>
              ${centsToDollars(data.taxAmount)}
            </Text>
          </View>
          <View style={styles.grandTotal}>
            <Text style={styles.grandTotalLabel}>{t("pdf.totalPaid")}</Text>
            <Text style={styles.grandTotalAmount}>
              ${centsToDollars(data.total)}
            </Text>
          </View>
        </View>

        {/* Payment Complete Badge */}
        <View style={[styles.paymentInfo, { marginTop: 30 }]}>
          <Text
            style={[
              styles.paymentInfoText,
              {
                fontFamily: "Helvetica-Bold",
                fontSize: 12,
                textAlign: "center",
                marginBottom: 8,
              },
            ]}
          >
            {t("pdf.completed")}
          </Text>
          <Text style={[styles.paymentInfoText, { textAlign: "center" }]}>
            {t("pdf.choosing")}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{t("pdf.thanks")}</Text>
          <Text style={{ marginTop: 5 }}>
            {t("pdf.questions", { email: RC_WEB_COMPANY_INFO.email })}
          </Text>
          <Text style={{ marginTop: 5 }}>
            {RC_WEB_COMPANY_INFO.website}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
