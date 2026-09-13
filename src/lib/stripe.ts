import Stripe from "stripe";

/**
 * Centralized Stripe instance
 * Ensures consistent API version and configuration across the application
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is not set");
}

// Create singleton Stripe instance.
// La versión de API se fija a la que trae el SDK instalado; al actualizar el SDK
// hay que revisar el changelog de Stripe y actualizar este valor a la par.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-08-26.dahlia",
  typescript: true,
});

export default stripe;

// Export type for use in other files
export type { Stripe };
