-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN     "termsIp" TEXT,
ADD COLUMN     "termsUserAgent" TEXT,
ADD COLUMN     "zelleRequestedAt" TIMESTAMP(3);
