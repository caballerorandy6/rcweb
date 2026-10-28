-- CreateTable
CREATE TABLE "GoogleReview" (
    "id" TEXT NOT NULL,
    "reviewerName" TEXT NOT NULL,
    "reviewerPhotoUrl" TEXT,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "replyComment" TEXT,
    "replyTime" TIMESTAMP(3),
    "createTime" TIMESTAMP(3) NOT NULL,
    "updateTime" TIMESTAMP(3) NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "syncedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleReviewSummary" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "averageRating" DOUBLE PRECISION NOT NULL,
    "totalReviewCount" INTEGER NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleReviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GoogleReview_hidden_createTime_idx" ON "GoogleReview"("hidden", "createTime");
