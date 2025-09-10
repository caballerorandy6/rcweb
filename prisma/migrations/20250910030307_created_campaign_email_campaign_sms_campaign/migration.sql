-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "totalEmails" INTEGER NOT NULL DEFAULT 0,
    "totalSms" INTEGER NOT NULL DEFAULT 0,
    "totalEmailCampaigns" INTEGER NOT NULL DEFAULT 0,
    "totalSmsCampaigns" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "emailsSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "smsSent" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SmsCampaign_pkey" PRIMARY KEY ("id")
);
