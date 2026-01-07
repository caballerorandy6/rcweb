/**
 * Types for client-related data structures
 * These types represent serialized data from server to client components
 */

export type ClientInvoice = {
  id: string;
  invoiceNumber: string;
  type: string;
  total: number;
  status: string;
  issueDate: Date | string;
  pdfUrl: string | null;
};

export type ClientInvoiceWithProject = ClientInvoice & {
  projectCode: string;
  planName: string;
};

export type ClientMilestone = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  order: number;
  dueDate: Date | string | null;
  completedAt: Date | string | null;
};

export type ClientProject = {
  id: string;
  projectCode: string;
  accessToken: string;
  email: string;
  name: string;
  planName: string;
  totalAmount: number;
  firstPayment: number;
  secondPayment: number;
  firstPaid: boolean;
  secondPaid: boolean;
  projectStatus: string;
  firstPaidAt: Date | string | null;
  secondPaidAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  invoices: ClientInvoice[];
  milestones: ClientMilestone[];
};
