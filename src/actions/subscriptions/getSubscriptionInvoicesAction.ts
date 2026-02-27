"use server";

import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import stripe from "@/lib/stripe";
import type { ActionResult } from "@/types/common";

export interface InvoiceData {
  id: string;
  number: string | null;
  status: string;
  amount: number;
  currency: string;
  created: string;
  paidAt: string | null;
  invoiceUrl: string | null;
  invoicePdf: string | null;
}

/**
 * Fetches invoices from Stripe for a given subscription
 */
export async function getSubscriptionInvoicesAction(
  subscriptionId: string
): Promise<ActionResult<{ invoices: InvoiceData[] }>> {
  try {
    // Find subscription in database to get Stripe customer ID
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return { success: false, error: "Subscription not found" };
    }

    // Fetch invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: subscription.stripeCustomerId,
      limit: 20,
    });

    const invoiceData: InvoiceData[] = invoices.data
      .filter(
        (invoice): invoice is Stripe.Invoice & { id: string } => !!invoice.id
      )
      .map((invoice) => ({
        id: invoice.id,
        number: invoice.number,
        status: invoice.status || "unknown",
        amount: invoice.amount_paid || invoice.total || 0,
        currency: invoice.currency?.toUpperCase() || "USD",
        created: new Date(invoice.created * 1000).toISOString(),
        paidAt: invoice.status_transitions?.paid_at
          ? new Date(invoice.status_transitions.paid_at * 1000).toISOString()
          : null,
        invoiceUrl: invoice.hosted_invoice_url || null,
        invoicePdf: invoice.invoice_pdf || null,
      }));

    return { success: true, data: { invoices: invoiceData } };
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to fetch invoices",
    };
  }
}
