import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import Stripe from "stripe";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../src/generated/prisma/client";
import { E2E_WEBHOOK_SECRET } from "./env";

// Database access and signed Stripe events for the payment journey. Stripe
// itself is never called: the suite plays its part by delivering the events
// Checkout would send, signed with the secret the test server was started with.

// CI sets DATABASE_URL; locally it comes from .env
config({ quiet: true });

const databaseUrl = process.env.DATABASE_URL ?? "";

/** The suite writes rows by hand: only ever against a local database */
export const hasLocalDatabase = /@(localhost|127\.0\.0\.1)[:/]/.test(databaseUrl);

let client: PrismaClient | undefined;

export function db(): PrismaClient {
  if (!hasLocalDatabase) throw new Error("The payment e2e tests only run against a local database");
  client ??= new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
  return client;
}

export async function disconnect() {
  await client?.$disconnect();
  client = undefined;
}

/** 6 characters from the alphabet of generateProjectCode() */
export function projectCode(): string {
  return randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase();
}

type SessionInput = {
  id: string;
  metadata: Record<string, string>;
  /** Charge before tax, in cents */
  amount: number;
  /** Sales tax Stripe Tax added, in cents */
  tax?: number;
};

/** A paid Checkout Session with the fields the webhook reads */
export function checkoutSession({ id, metadata, amount, tax = 0 }: SessionInput) {
  return {
    id,
    object: "checkout.session",
    status: "complete",
    payment_status: "paid",
    payment_intent: `pi_${id.slice(3)}`,
    amount_subtotal: amount,
    amount_total: amount + tax,
    total_details: { amount_tax: tax, amount_discount: 0, amount_shipping: 0 },
    customer_details: {
      address: {
        line1: "901 Bagby St",
        line2: null,
        city: "Houston",
        state: "TX",
        postal_code: "77002",
        country: "US",
      },
    },
    metadata,
  };
}

/** Delivers `checkout.session.completed` to the test server the way Stripe does */
export async function deliverCheckoutCompleted(
  baseURL: string,
  session: ReturnType<typeof checkoutSession>,
  secret = E2E_WEBHOOK_SECRET
) {
  const payload = JSON.stringify({
    id: `evt_e2e_${randomUUID()}`,
    object: "event",
    type: "checkout.session.completed",
    data: { object: session },
  });
  const response = await fetch(`${baseURL}/api/webhooks/stripe`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "stripe-signature": Stripe.webhooks.generateTestHeaderString({ payload, secret }),
    },
    body: payload,
  });
  return { status: response.status, body: (await response.json()) as Record<string, unknown> };
}
