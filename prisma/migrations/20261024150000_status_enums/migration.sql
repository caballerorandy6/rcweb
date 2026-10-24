-- Status columns become Postgres enums. Existing values are cast in place (no
-- drop/recreate), so nothing is lost. Any lead status outside the known set is
-- folded into NEW.

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'PROPOSAL_SENT', 'WON', 'LOST');
CREATE TYPE "ProjectStatus" AS ENUM ('pending', 'in_progress', 'ready_for_payment', 'completed');
CREATE TYPE "SubscriptionStatus" AS ENUM ('active', 'cancelled', 'past_due', 'unpaid');
CREATE TYPE "InvoiceType" AS ENUM ('initial', 'final', 'summary');
CREATE TYPE "InvoiceStatus" AS ENUM ('paid', 'pending', 'cancelled');

-- Contact.leadStatus
ALTER TABLE "Contact"
  ALTER COLUMN "leadStatus" DROP DEFAULT,
  ALTER COLUMN "leadStatus" TYPE "LeadStatus"
    USING (CASE WHEN "leadStatus" IN ('NEW', 'CONTACTED', 'INTERESTED', 'PROPOSAL_SENT', 'WON', 'LOST')
                THEN "leadStatus" ELSE 'NEW' END)::"LeadStatus",
  ALTER COLUMN "leadStatus" SET DEFAULT 'NEW';

-- Payment.projectStatus
ALTER TABLE "Payment"
  ALTER COLUMN "projectStatus" DROP DEFAULT,
  ALTER COLUMN "projectStatus" TYPE "ProjectStatus" USING "projectStatus"::"ProjectStatus",
  ALTER COLUMN "projectStatus" SET DEFAULT 'pending';

-- Subscription.status
ALTER TABLE "Subscription"
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "SubscriptionStatus" USING "status"::"SubscriptionStatus",
  ALTER COLUMN "status" SET DEFAULT 'active';

-- Invoice.type / Invoice.status
ALTER TABLE "Invoice"
  ALTER COLUMN "type" TYPE "InvoiceType" USING "type"::"InvoiceType",
  ALTER COLUMN "status" DROP DEFAULT,
  ALTER COLUMN "status" TYPE "InvoiceStatus" USING "status"::"InvoiceStatus",
  ALTER COLUMN "status" SET DEFAULT 'paid';

-- Indexes that duplicated a @unique constraint
DROP INDEX "Invoice_invoiceNumber_idx";
DROP INDEX "Payment_accessToken_idx";
DROP INDEX "Payment_projectCode_idx";
DROP INDEX "Subscription_stripeSubscriptionId_idx";

-- New index
CREATE INDEX "Payment_projectStatus_idx" ON "Payment"("projectStatus");
