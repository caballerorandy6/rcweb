-- CreateEnum
CREATE TYPE "CustomerLocale" AS ENUM ('en', 'es');

-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "locale" "CustomerLocale" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "locale" "CustomerLocale" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "locale" "CustomerLocale" NOT NULL DEFAULT 'en';

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "locale" "CustomerLocale" NOT NULL DEFAULT 'en';
