/**
 * Central export for all types
 * Import types from here for better organization
 */

// Common types
export type { ActionResult, ActionResultSimple } from "./common";

// Project types
export type { AdminProject, ProjectStatus, UpdateableProjectStatus } from "./project";

// Stats types
export type { ProjectStats, NewsletterStats } from "./stats";

// Client types
export type {
  ClientProject,
  ClientInvoice,
  ClientMilestone,
} from "./client";

// Milestone types
export type { Milestone } from "./milestone";
export { MilestoneStatus } from "./milestone";

