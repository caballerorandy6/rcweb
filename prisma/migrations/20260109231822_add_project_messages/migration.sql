-- CreateTable
CREATE TABLE "public"."ProjectMessage" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,
    "senderName" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ProjectMessageAttachment" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "blobKey" TEXT,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMessageAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectMessage_paymentId_idx" ON "public"."ProjectMessage"("paymentId");

-- CreateIndex
CREATE INDEX "ProjectMessage_senderType_idx" ON "public"."ProjectMessage"("senderType");

-- CreateIndex
CREATE INDEX "ProjectMessage_createdAt_idx" ON "public"."ProjectMessage"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectMessage_isRead_idx" ON "public"."ProjectMessage"("isRead");

-- CreateIndex
CREATE INDEX "ProjectMessageAttachment_messageId_idx" ON "public"."ProjectMessageAttachment"("messageId");

-- AddForeignKey
ALTER TABLE "public"."ProjectMessage" ADD CONSTRAINT "ProjectMessage_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProjectMessageAttachment" ADD CONSTRAINT "ProjectMessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "public"."ProjectMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
