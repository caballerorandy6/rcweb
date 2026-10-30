/**
 * Types for project-related data structures
 * Used in both admin and client contexts
 */

import type {
  InvoiceStatus,
  InvoiceType,
  LeadStatus,
  PaymentKind,
  PaymentMethod,
  PaymentStatus,
} from "@/generated/prisma/enums";
import { ProjectStatus } from "@/generated/prisma/enums";
import type { Milestone } from "@/types/milestone";

export { ProjectStatus };

/**
 * Admin project type - simplified version for admin dashboard
 */
export type AdminProject = {
  id: string;
  projectCode: string;
  email: string;
  name: string;
  planName: string;
  totalAmount: number;
  depositPaid: boolean;
  finalPaid: boolean;
  status: ProjectStatus;
  /** ISO string: it crosses the server → client boundary */
  createdAt: string;
};

/** One charge of a 50/50 project as the admin detail page shows it */
export type AdminProjectPayment = {
  id: string;
  kind: PaymentKind;
  /** Cents */
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  paidAt: string | null;
  stripeSessionId: string | null;
};

export type AdminProjectInvoice = {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  /** Cents */
  total: number;
  status: InvoiceStatus;
  issueDate: string;
  pdfUrl: string | null;
};

/**
 * Everything the admin sees on /projects/[id]. Serializable (dates as ISO
 * strings): it crosses the server → client boundary.
 */
export type AdminProjectDetail = {
  id: string;
  projectCode: string;
  accessToken: string;
  email: string;
  name: string;
  planName: string;
  /** Cents */
  totalAmount: number;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  payments: AdminProjectPayment[];
  invoices: AdminProjectInvoice[];
  milestones: Milestone[];
  /** Lead the project is attributed to, when it was linked */
  contact: { id: string; name: string; leadStatus: LeadStatus } | null;
  /** Written quote the project was sold through, if any */
  quote: { id: string; quoteNumber: string } | null;
  termsAcceptedAt: string | null;
  termsVersion: string | null;
};

/**
 * Project status for update operations (excludes pending)
 */
export type UpdateableProjectStatus = Exclude<ProjectStatus, "pending">;

/**
 * Verified project access information
 * Used for final payment verification
 */
export type VerifiedProjectAccess = {
  id: string;
  projectCode: string;
  planName: string;
  /** As stored in the database (lowercased) */
  email: string;
  finalAmount: number;
  accessToken: string;
};

/**
 * What the /payment-success page shows after the deposit is paid.
 * Serializable: it crosses the server → client boundary.
 */
export type PaymentSuccessData = {
  projectCode: string;
  planName: string;
  totalAmount: number;
  depositAmount: number;
  finalAmount: number;
  stripeSessionId: string | null;
};
