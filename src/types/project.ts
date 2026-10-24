/**
 * Types for project-related data structures
 * Used in both admin and client contexts
 */

import { ProjectStatus } from "@/generated/prisma/enums";

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
  createdAt: string | Date;
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
