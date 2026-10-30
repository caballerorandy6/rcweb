-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('stripe', 'zelle', 'cash', 'other');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'stripe';

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "method" "PaymentMethod" NOT NULL DEFAULT 'stripe';
