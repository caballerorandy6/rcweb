/**
 * Types for project-related data structures
 * Used in both admin and client contexts
 */

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
  firstPaid: boolean;
  secondPaid: boolean;
  projectStatus: string;
  createdAt: string | Date;
};

/**
 * Project status type
 */
export type ProjectStatus =
  | "pending"
  | "in_progress"
  | "ready_for_payment"
  | "completed";

/**
 * Project status for update operations (excludes pending)
 */
export type UpdateableProjectStatus =
  | "in_progress"
  | "ready_for_payment"
  | "completed";

/**
 * Verified project access information
 * Used for final payment verification
 */
export type VerifiedProjectAccess = {
  id: string;
  projectCode: string;
  planName: string;
  secondPayment: number;
  accessToken: string;
};

