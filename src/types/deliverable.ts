/**
 * Deliverable types for client and admin views
 */

export type ClientDeliverable = {
  id: string;
  name: string;
  description: string | null;
  type: string;
  fileUrl: string;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
  updatedAt: string;
  projectCode: string;
  planName: string;
};

export type AdminDeliverable = {
  id: string;
  paymentId: string;
  projectCode: string;
  planName: string;
  clientName: string;
  clientEmail: string;
  name: string;
  description: string | null;
  type: string;
  fileUrl: string;
  blobKey: string | null;
  fileSize: number | null;
  mimeType: string | null;
  uploadedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DeliverableType =
  | "source_code"
  | "documentation"
  | "assets"
  | "credentials"
  | "other";

export type CreateDeliverableData = {
  paymentId: string;
  name: string;
  description?: string;
  type: DeliverableType;
  fileUrl: string;
  blobKey?: string;
  fileSize?: number;
  mimeType?: string;
};
