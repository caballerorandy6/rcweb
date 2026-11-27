-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "paymentFailedInvoiceId" TEXT,
ADD COLUMN     "renewalReminderFor" TIMESTAMP(3);
