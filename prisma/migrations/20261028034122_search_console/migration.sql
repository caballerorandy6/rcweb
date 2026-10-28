-- CreateEnum
CREATE TYPE "SearchConsoleDimension" AS ENUM ('QUERY', 'PAGE');

-- CreateTable
CREATE TABLE "SearchConsoleDaily" (
    "date" DATE NOT NULL,
    "clicks" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsoleDaily_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "SearchConsoleTopItem" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "dimension" "SearchConsoleDimension" NOT NULL,
    "key" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "impressions" INTEGER NOT NULL,
    "ctr" DOUBLE PRECISION NOT NULL,
    "position" DOUBLE PRECISION NOT NULL,
    "syncedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchConsoleTopItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchConsoleTopItem_dimension_date_idx" ON "SearchConsoleTopItem"("dimension", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SearchConsoleTopItem_date_dimension_key_key" ON "SearchConsoleTopItem"("date", "dimension", "key");
