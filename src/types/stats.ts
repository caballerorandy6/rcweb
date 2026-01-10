/**
 * Types for statistics and metrics
 */

/**
 * Project statistics for admin dashboard
 */
export type ProjectStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  awaitingPayment: number;
};

/**
 * Newsletter campaign statistics
 */
export type NewsletterStats = {
  total: number;
  sent: number;
  failed: number;
  pending: number;
};
