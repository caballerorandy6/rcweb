-- CreateEnum
CREATE TYPE "MaintenanceReportStatus" AS ENUM ('draft', 'sent');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "onboardingAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "workedOn" DATE NOT NULL,
    "minutes" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceReport" (
    "id" TEXT NOT NULL,
    "subscriptionId" TEXT NOT NULL,
    "month" DATE NOT NULL,
    "status" "MaintenanceReportStatus" NOT NULL DEFAULT 'draft',
    "errorsResolved" INTEGER,
    "updatesApplied" INTEGER,
    "backupsVerified" BOOLEAN,
    "uptimePercent" DECIMAL(5,2),
    "visitors" INTEGER,
    "pageViews" INTEGER,
    "notes" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MaintenanceLog_subscriptionId_workedOn_idx" ON "MaintenanceLog"("subscriptionId", "workedOn");

-- CreateIndex
CREATE INDEX "MaintenanceReport_status_idx" ON "MaintenanceReport"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MaintenanceReport_subscriptionId_month_key" ON "MaintenanceReport"("subscriptionId", "month");

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceReport" ADD CONSTRAINT "MaintenanceReport_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;
