import type { LeadStatus } from "@/generated/prisma/enums";

/** Labels for the lead pipeline, shared by the admin list, the project detail and emails */
export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  PROPOSAL_SENT: "Proposal sent",
  WON: "Won",
  LOST: "Lost",
};

/** Pipeline order, used to render the select */
export const LEAD_STATUSES = Object.keys(LEAD_STATUS_LABELS) as LeadStatus[];

/** Badge/select colours per status (same palette as the project status badges) */
export const LEAD_STATUS_CLASSES: Record<LeadStatus, string> = {
  NEW: "bg-gray-500/10 text-gray-300 border-gray-500/40",
  CONTACTED: "bg-blue-500/10 text-blue-400 border-blue-500/40",
  INTERESTED: "bg-purple-500/10 text-purple-400 border-purple-500/40",
  PROPOSAL_SENT: "bg-orange-500/10 text-orange-400 border-orange-500/40",
  WON: "bg-green-500/10 text-green-400 border-green-500/40",
  LOST: "bg-red-500/10 text-red-400 border-red-500/40",
};
