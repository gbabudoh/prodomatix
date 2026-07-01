-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "businessType" TEXT NOT NULL DEFAULT 'Manufacturer',
ADD COLUMN     "country" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "businesses_businessType_idx" ON "businesses"("businessType");
