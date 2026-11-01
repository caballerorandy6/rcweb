import type { Locale } from "@/i18n/routing";
import { COMPANY } from "@/lib/company";
import { InvoiceStatus, InvoiceType, PaymentMethod } from "@/generated/prisma/enums";

export { InvoiceStatus, InvoiceType };

/**
 * Datos para crear un invoice
 */
export interface CreateInvoiceData {
  projectId: string;
  type: InvoiceType;
  customerName: string;
  locale: Locale;
  customerEmail: string;
  projectCode: string;
  planName: string;
  description: string;
  subtotal: number; // En centavos, sin impuesto
  /** Impuesto realmente cobrado en este pago, en centavos */
  taxAmount: number;
  /** How the charge was collected; Stripe unless the admin recorded it by hand */
  paymentMethod: PaymentMethod;
  /** Only for Stripe payments */
  stripeSessionId?: string;
  /** When the money arrived (Stripe: now; manual: the date the admin entered) */
  paidDate: Date;
}

/**
 * Datos completos del invoice para el PDF
 */
export interface InvoiceData {
  invoiceNumber: string;
  type: InvoiceType;
  customerName: string;
  locale: Locale;
  customerEmail: string;
  projectCode: string;
  planName: string;
  description: string;
  subtotal: number; // En centavos
  taxRate: number;
  taxAmount: number; // En centavos
  total: number; // En centavos
  currency: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate?: Date;
  paidDate?: Date;
  paymentMethod: PaymentMethod;
  stripeSessionId?: string;
}

/**
 * Invoice summary data (para el invoice final que muestra ambos pagos)
 */
export interface InvoiceSummaryItem {
  description: string;
  amount: number; // En centavos
  paidDate: Date;
  paymentMethod: PaymentMethod;
}

export interface InvoiceSummaryData
  extends Omit<InvoiceData, "description" | "subtotal"> {
  items: InvoiceSummaryItem[];
  subtotal: number; // Total de todos los items
}

/**
 * Información de la empresa (RC Web Solutions)
 */
export interface CompanyInfo {
  name: string;
  email: string;
  phone?: string;
  website: string;
}

export const RC_WEB_COMPANY_INFO: CompanyInfo = {
  name: COMPANY.name,
  email: COMPANY.email,
  phone: COMPANY.phone,
  website: COMPANY.website,
};

/**
 * Resultado de la generación del invoice
 */
export interface GenerateInvoiceResult {
  invoiceId: string;
  invoiceNumber: string;
  pdfUrl: string;
  pdfBuffer: Buffer;
}

/**
 * Helper para convertir centavos a dólares
 */
export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Helper para convertir dólares a centavos
 */
export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/**
 * Porcentaje efectivo para mostrar en la factura, derivado de lo cobrado.
 * En Texas sale 6.6: 8.25 % sobre el 80 % gravable del diseño web.
 */
export function effectiveTaxRate(subtotal: number, taxAmount: number): number {
  if (subtotal <= 0) return 0;
  return Math.round((taxAmount / subtotal) * 10000) / 100;
}

/**
 * Calcula el total (subtotal + impuestos)
 */
export function calculateTotal(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount;
}

