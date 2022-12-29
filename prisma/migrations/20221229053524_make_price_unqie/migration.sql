/*
  Warnings:

  - A unique constraint covering the columns `[assetEntityId,priceTimeId]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Price_assetEntityId_priceTimeId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Price_assetEntityId_priceTimeId_key" ON "Price"("assetEntityId", "priceTimeId");
