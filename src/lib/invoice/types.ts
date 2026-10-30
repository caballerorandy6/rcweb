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
  customerEmail: string;
  projectCode: string;
  planName: string;
  description: string;
  subtotal: number; // En centavos
  taxRate: number; // Porcentaje (ej: 8.5 para 8.5%)
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
 * Configuración de impuestos por estado/región
 */
export interface TaxConfig {
  state: string;
  rate: number; // Porcentaje
  description: string;
}

// Default tax rate (Florida sales tax)
export const DEFAULT_TAX_RATE = 7.0; // 7% Florida sales tax

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
 * Calcula el monto de impuestos
 */
export function calculateTaxAmount(subtotal: number, taxRate: number): number {
  return Math.round((subtotal * taxRate) / 100);
}

/**
 * Calcula el total (subtotal + impuestos)
 */
export function calculateTotal(subtotal: number, taxAmount: number): number {
  return subtotal + taxAmount;
}

/**
 * Formatea una fecha para mostrar en el invoice
 */
export function formatInvoiceDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
