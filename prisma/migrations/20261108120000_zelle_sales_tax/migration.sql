-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "stripeTaxTransactionId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "billingAddress" JSONB;

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "billingAddress" JSONB,
ADD COLUMN     "zelleTaxAmount" INTEGER,
ADD COLUMN     "zelleTaxCalculationId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeTaxTransactionId_key" ON "Payment"("stripeTaxTransactionId");

