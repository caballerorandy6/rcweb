import { MilestoneStatus } from "@/generated/prisma/enums";

// Re-export para uso externo
export { MilestoneStatus };

// Tipo serializado para cliente - las fechas son strings porque
// Next.js las serializa automáticamente al pasar de server a client
export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  order: number;
  status: MilestoneStatus;
  dueDate: string | null;
  completedAt: string | null;
  /** When the customer was emailed about the completion */
  notifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
