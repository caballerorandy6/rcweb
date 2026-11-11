-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('open', 'won', 'lost');

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'refunded';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "disputeId" TEXT,
ADD COLUMN     "disputeStatus" "DisputeStatus",
ADD COLUMN     "refundedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "stripePaymentIntentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripePaymentIntentId_key" ON "Payment"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_disputeId_key" ON "Payment"("disputeId");

-- CreateIndex
CREATE INDEX "Payment_disputeStatus_idx" ON "Payment"("disputeStatus");

