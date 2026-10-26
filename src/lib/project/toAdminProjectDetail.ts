import type { Prisma } from "@/generated/prisma/client";
import { PaymentKind } from "@/generated/prisma/enums";
import { toMilestone } from "@/lib/milestone/toMilestone";
import type { AdminProjectDetail } from "@/types/project";

/** The relations /projects/[id] needs, fetched in a single query */
export const adminProjectDetailInclude = {
  payments: { orderBy: { createdAt: "asc" } },
  invoices: { orderBy: { issueDate: "asc" } },
  milestones: { orderBy: { order: "asc" } },
  contact: { select: { id: true, name: true, leadStatus: true } },
  quote: { select: { id: true, quoteNumber: true } },
  termsAcceptance: { select: { acceptedAt: true, termsVersion: true } },
} satisfies Prisma.ProjectInclude;

export type AdminProjectDetailPayload = Prisma.ProjectGetPayload<{
  include: typeof adminProjectDetailInclude;
}>;

const PAYMENT_ORDER: Record<PaymentKind, number> = { deposit: 0, final: 1 };

/** Prisma row → serializable shape for the admin detail page */
export function toAdminProjectDetail(project: AdminProjectDetailPayload): AdminProjectDetail {
  return {
    id: project.id,
    projectCode: project.projectCode,
    accessToken: project.accessToken,
    email: project.email,
    name: project.name,
    planName: project.planName,
    totalAmount: project.totalAmount,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    payments: [...project.payments]
      .sort((a, b) => PAYMENT_ORDER[a.kind] - PAYMENT_ORDER[b.kind])
      .map((p) => ({
        id: p.id,
        kind: p.kind,
        amount: p.amount,
        status: p.status,
        paidAt: p.paidAt?.toISOString() ?? null,
        stripeSessionId: p.stripeSessionId,
      })),
    invoices: project.invoices.map((i) => ({
      id: i.id,
      invoiceNumber: i.invoiceNumber,
      type: i.type,
      total: i.total,
      status: i.status,
      issueDate: i.issueDate.toISOString(),
      pdfUrl: i.pdfUrl,
    })),
    milestones: project.milestones.map(toMilestone),
    contact: project.contact,
    quote: project.quote,
    termsAcceptedAt: project.termsAcceptance?.acceptedAt.toISOString() ?? null,
    termsVersion: project.termsAcceptance?.termsVersion ?? null,
  };
}
