-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('call', 'whatsapp', 'email');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "preferredChannel" "ContactChannel",
ADD COLUMN     "serviceInterest" TEXT;
