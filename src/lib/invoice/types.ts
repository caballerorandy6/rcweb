/**
 * Tipos de invoice
 */
export type InvoiceType = "initial" | "final" | "summary";

/**
 * Estado del invoice
 */
export type InvoiceStatus = "paid" | "pending" | "cancelled";

/**
 * Datos para crear un invoice
 */
export interface CreateInvoiceData {
  paymentId: string;
  type: InvoiceType;
  customerName: string;
  customerEmail: string;
  projectCode: string;
  planName: string;
  description: string;
  subtotal: number; // En centavos
  taxRate: number; // Porcentaje (ej: 8.5 para 8.5%)
  stripeSessionId?: string;
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
  stripeSessionId?: string;
}

/**
 * Invoice summary data (para el invoice final que muestra ambos pagos)
 */
export interface InvoiceSummaryItem {
  description: string;
  amount: number; // En centavos
  paidDate: Date;
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
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone?: string;
  website: string;
}

export const RC_WEB_COMPANY_INFO: CompanyInfo = {
  name: "RC Web Solutions LLC",
  address: "6210 Newquay St",
  city: "Houston",
  state: "TX",
  zip: "77085",
  country: "USA",
  email: "admin@rcweb.dev",
  phone: "+1 (346) 375-7534",
  website: "www.rcweb.dev",
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
