-- AlterTable
ALTER TABLE "public"."Subscription" ADD COLUMN     "portalToken" TEXT,
ADD COLUMN     "portalTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_portalToken_key" ON "public"."Subscription"("portalToken");
