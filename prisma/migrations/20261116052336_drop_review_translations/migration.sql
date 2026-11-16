/*
  Warnings:

  - You are about to drop the column `commentEn` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `commentEs` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `commentLanguage` on the `GoogleReview` table. All the data in the column will be lost.
  - You are about to drop the column `translatedFrom` on the `GoogleReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "GoogleReview" DROP COLUMN "commentEn",
DROP COLUMN "commentEs",
DROP COLUMN "commentLanguage",
DROP COLUMN "translatedFrom";
