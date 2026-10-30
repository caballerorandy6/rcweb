import * as Sentry from "@sentry/nextjs";
import type { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { createInvoiceAndSendEmail } from "@/lib/invoice/createInvoiceAndSendEmail";
import { linkProjectToContact } from "@/lib/project/linkToContact";
import { markQuoteAccepted } from "@/lib/quote/markQuoteAccepted";
import { getProjectCharges } from "@/lib/project/charges";
import { isUniqueConstraintError } from "@/lib/prismaErrors";

export type ProjectWithPaymentsAndInvoices = Prisma.ProjectGetPayload<{
  include: { payments: true; invoices: true };
}>;

export interface DepositProjectInput {
  /** Unique 6-char code; also the idempotency key (uniqueProjectCode / Checkout metadata) */
  projectCode: string;
  /** Lowercased: becomes Project.email */
  customerEmail: string;
  customerName: string;
  planName: string;
  totalAmount: number;
  firstPaymentAmount: number;
  secondPaymentAmount: number;
  /** The deposit that was just collected */
  deposit: {
    method: PaymentMethod;
    paidAt: Date;
    /** Checkout Session that paid it (method stripe) */
    stripeSessionId?: string;
  };
  /** Null when the customer never accepted the terms in the app (deposit sent out of band) */
  terms: {
    acceptedAt: Date;
    termsVersion: string;
    ipAddress: string;
    userAgent: string;
  } | null;
  /** Written quote the deposit pays; it is marked accepted and linked */
  quoteId?: string;
}

export interface DepositProjectResult {
  project: ProjectWithPaymentsAndInvoices;
  /** False when the code already had a project (a retry of the same deposit) */
  created: boolean;
  /** Invoice or email problems; the project exists regardless */
  emailErrors: string[];
}

/**
 * The one place a Project is born. Called by the Stripe webhook when a deposit
 * session completes and by the admin when a deposit arrives outside Stripe
 * (createProjectFromQuoteAction). Creates the project with its two charges
 * (deposit paid, balance pending) and the terms acceptance, ties it to the
 * lead and the quote, and emails the initial invoice. Idempotent on
 * projectCode: a second call for the same deposit returns the existing row.
 */
export async function createProjectFromDeposit(
  input: DepositProjectInput,
  resend: Resend
): Promise<DepositProjectResult> {
  const include = { payments: true, invoices: true } as const;

  let project = await prisma.project.findUnique({
    where: { projectCode: input.projectCode },
    include,
  });
  let created = false;

  if (project) {
    // Same code but a different Stripe session: generateProjectCode() collided
    // and this is another customer's deposit. Fail loudly instead of treating
    // it as a retry (which would swallow the payment).
    const { deposit } = getProjectCharges(project.payments);
    if (input.deposit.stripeSessionId && deposit.stripeSessionId !== input.deposit.stripeSessionId) {
      const error = new Error(
        `Project code ${input.projectCode} already belongs to another Checkout Session`
      );
      Sentry.captureException(error, {
        tags: { feature: "project-creation" },
        extra: {
          projectId: project.id,
          existingSessionId: deposit.stripeSessionId,
          sessionId: input.deposit.stripeSessionId,
        },
      });
      throw error;
    }
  } else {
    // Project, its two charges and the terms acceptance in one write
    const data = {
      projectCode: input.projectCode,
      email: input.customerEmail,
      name: input.customerName,
      planName: input.planName,
      totalAmount: input.totalAmount,
      status: "in_progress",
      payments: {
        create: [
          {
            kind: "deposit",
            amount: input.firstPaymentAmount,
            status: "paid",
            method: input.deposit.method,
            paidAt: input.deposit.paidAt,
            stripeSessionId: input.deposit.stripeSessionId,
          },
          { kind: "final", amount: input.secondPaymentAmount },
        ],
      },
      ...(input.terms && {
        termsAcceptance: {
          create: {
            acceptedAt: input.terms.acceptedAt,
            termsVersion: input.terms.termsVersion,
            plan: input.planName,
            ipAddress: input.terms.ipAddress,
            userAgent: input.terms.userAgent,
          },
        },
      }),
    } satisfies Prisma.ProjectCreateInput;

    try {
      project = await prisma.project.create({ data, include });
      created = true;
    } catch (createError) {
      // Two deliveries of the same event raced: keep the row that won
      if (!isUniqueConstraintError(createError)) throw createError;
      project = await prisma.project.findUniqueOrThrow({
        where: { projectCode: input.projectCode },
        include,
      });
    }
  }

  // Revenue attribution: tie the project to the lead with the same email (never throws)
  await linkProjectToContact(project);

  // Sold through a written quote: mark it accepted and link it (never throws)
  if (input.quoteId) {
    await markQuoteAccepted(input.quoteId, project.id);
  }

  const emailErrors: string[] = [];
  if (!project.invoices.some((inv) => inv.type === "initial")) {
    try {
      await createInvoiceAndSendEmail({
        project,
        type: "initial",
        resend,
        stripeSessionId: input.deposit.stripeSessionId,
      });
    } catch (invoiceError) {
      const message = invoiceError instanceof Error ? invoiceError.message : String(invoiceError);
      console.error("❌ Invoice error:", message);
      emailErrors.push(`Error creating invoice: ${message}`);
    }
  }

  return { project, created, emailErrors };
}
