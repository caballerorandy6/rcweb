import Stripe from "stripe";

/**
 * Centralized Stripe instance
 * Ensures consistent API version and configuration across the application
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

// Create singleton Stripe instance
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
  typescript: true,
});

export default stripe;

// Export type for use in other files
export type { Stripe };
