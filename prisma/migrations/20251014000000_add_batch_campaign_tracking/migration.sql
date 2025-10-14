-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN "subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN "htmlContent" TEXT NOT NULL DEFAULT '',
ADD COLUMN "completedAt" TIMESTAMP(3),
ADD COLUMN "totalEmails" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'pending',
ADD COLUMN "lastBatchSentAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "EmailCampaign_status_idx" ON "EmailCampaign"("status");
