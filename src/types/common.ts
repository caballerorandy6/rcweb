/**
 * Common types used across the application
 * Base types for action results and shared utilities
 */

/**
 * Generic action result type
 * Used for server actions that return success/error patterns
 */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Simple action result without data (for void operations)
 */
export type ActionResultSimple =
  | { success: true }
  | { success: false; error: string };
