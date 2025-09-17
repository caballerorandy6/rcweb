-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "planName" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "firstPayment" INTEGER NOT NULL,
    "secondPayment" INTEGER NOT NULL,
    "firstPaid" BOOLEAN NOT NULL DEFAULT false,
    "secondPaid" BOOLEAN NOT NULL DEFAULT false,
    "firstSessionId" TEXT,
    "secondSessionId" TEXT,
    "projectStatus" TEXT NOT NULL DEFAULT 'pending',
    "projectNotes" TEXT,
    "firstPaidAt" TIMESTAMP(3),
    "secondPaidAt" TIMESTAMP(3),
    "projectStarted" TIMESTAMP(3),
    "projectReady" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Payment_projectCode_key" ON "public"."Payment"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_accessToken_key" ON "public"."Payment"("accessToken");

-- CreateIndex
CREATE INDEX "Payment_email_idx" ON "public"."Payment"("email");

-- CreateIndex
CREATE INDEX "Payment_projectCode_idx" ON "public"."Payment"("projectCode");

-- CreateIndex
CREATE INDEX "Payment_accessToken_idx" ON "public"."Payment"("accessToken");
