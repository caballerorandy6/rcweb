import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

interface MarkChargePaidParams {
  projectId: string;
  chargeId: string;
  /** How it was paid: date, method, Stripe ids, tax collected */
  charge: Omit<Prisma.PaymentUncheckedUpdateManyInput, "status">;
  /** Written with the charge, only when this call is the one that marks it paid */
  project?: Prisma.ProjectUncheckedUpdateInput;
}

/**
 * Marks a charge as paid, once. Returns false when it was already paid.
 *
 * Stripe can deliver the same event several times at once, and an admin can
 * click twice: reading the charge and then writing it lets all of them through.
 * The condition travels in the UPDATE itself, so the database lets exactly one
 * caller win; that caller is the one that notifies and records the sale.
 */
export async function markChargePaid({
  projectId,
  chargeId,
  charge,
  project,
}: MarkChargePaidParams): Promise<boolean> {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.payment.updateMany({
      where: { id: chargeId, projectId, status: { not: "paid" } },
      data: { ...charge, status: "paid" },
    });
    if (count === 0) return false;

    if (project && Object.keys(project).length > 0) {
      await tx.project.update({ where: { id: projectId }, data: project });
    }
    return true;
  });
}
