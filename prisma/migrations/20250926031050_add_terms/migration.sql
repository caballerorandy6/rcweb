-- CreateTable
CREATE TABLE "public"."TermsAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "paymentId" TEXT,
    "plan" TEXT,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "termsVersion" TEXT NOT NULL,

    CONSTRAINT "TermsAcceptance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TermsAcceptance_paymentId_key" ON "public"."TermsAcceptance"("paymentId");

-- AddForeignKey
ALTER TABLE "public"."TermsAcceptance" ADD CONSTRAINT "TermsAcceptance_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
