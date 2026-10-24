-- Split the old "Payment" table (one row per project with first/second payment
-- columns) into "Project" (one row per project) and "Payment" (one row per
-- charge: deposit and final). Existing rows are carried over: Project keeps the
-- old Payment ids, so Invoice, Milestone and TermsAcceptance only rename their
-- foreign key column.

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('deposit', 'final');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid');

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" "ProjectStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactId" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "Project_accessToken_key" ON "Project"("accessToken");

-- CreateIndex
CREATE INDEX "Project_email_idx" ON "Project"("email");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_contactId_idx" ON "Project"("contactId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Copy projects (same ids as the old Payment rows)
INSERT INTO "Project" ("id", "projectCode", "accessToken", "email", "name", "planName", "totalAmount", "status", "createdAt", "updatedAt", "contactId")
SELECT "id", "projectCode", "accessToken", "email", "name", "planName", "totalAmount", "projectStatus", "createdAt", "updatedAt", "contactId"
FROM "Payment";

-- Detach the old Payment table
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_paymentId_fkey";
ALTER TABLE "Milestone" DROP CONSTRAINT "Milestone_paymentId_fkey";
ALTER TABLE "TermsAcceptance" DROP CONSTRAINT "TermsAcceptance_paymentId_fkey";
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_contactId_fkey";

DROP INDEX "Payment_accessToken_key";
DROP INDEX "Payment_contactId_idx";
DROP INDEX "Payment_email_idx";
DROP INDEX "Payment_projectCode_key";
DROP INDEX "Payment_projectStatus_idx";

ALTER TABLE "Payment" RENAME TO "Payment_legacy";
ALTER TABLE "Payment_legacy" RENAME CONSTRAINT "Payment_pkey" TO "Payment_legacy_pkey";

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "stripeSessionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_stripeSessionId_key" ON "Payment"("stripeSessionId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_paidAt_idx" ON "Payment"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_projectId_kind_key" ON "Payment"("projectId", "kind");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- One deposit and one final charge per legacy row
INSERT INTO "Payment" ("id", "projectId", "kind", "amount", "status", "stripeSessionId", "paidAt", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'deposit', "firstPayment",
       CASE WHEN "firstPaid" THEN 'paid' ELSE 'pending' END::"PaymentStatus",
       "firstSessionId", "firstPaidAt", "createdAt", "updatedAt"
FROM "Payment_legacy";

INSERT INTO "Payment" ("id", "projectId", "kind", "amount", "status", "stripeSessionId", "paidAt", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, "id", 'final', "secondPayment",
       CASE WHEN "secondPaid" THEN 'paid' ELSE 'pending' END::"PaymentStatus",
       "secondSessionId", "secondPaidAt", "createdAt", "updatedAt"
FROM "Payment_legacy";

DROP TABLE "Payment_legacy";

-- Re-point Invoice, Milestone and TermsAcceptance to Project
DROP INDEX "Invoice_paymentId_idx";
ALTER TABLE "Invoice" RENAME COLUMN "paymentId" TO "projectId";
CREATE INDEX "Invoice_projectId_idx" ON "Invoice"("projectId");
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "Milestone_paymentId_idx";
ALTER TABLE "Milestone" RENAME COLUMN "paymentId" TO "projectId";
CREATE INDEX "Milestone_projectId_idx" ON "Milestone"("projectId");
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

DROP INDEX "TermsAcceptance_paymentId_key";
ALTER TABLE "TermsAcceptance" RENAME COLUMN "paymentId" TO "projectId";
CREATE UNIQUE INDEX "TermsAcceptance_projectId_key" ON "TermsAcceptance"("projectId");
ALTER TABLE "TermsAcceptance" ADD CONSTRAINT "TermsAcceptance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
