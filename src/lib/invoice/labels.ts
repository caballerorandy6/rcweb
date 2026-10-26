import type { InvoiceType } from "@/generated/prisma/enums";

/** Human labels for the three invoice kinds, shared by the admin list and the project detail */
export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  initial: "Deposit invoice",
  final: "Final invoice",
  summary: "Project summary",
};

/** Badge classes per invoice kind (same palette as the project status badges) */
export const INVOICE_TYPE_CLASSES: Record<InvoiceType, string> = {
  initial: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  final: "bg-green-500/10 text-green-400 border-green-500/40",
  summary: "bg-purple-500/10 text-purple-400 border-purple-500/40",
};
