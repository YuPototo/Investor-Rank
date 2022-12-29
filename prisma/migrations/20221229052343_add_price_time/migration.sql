/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Price` table. All the data in the column will be lost.
  - Added the required column `priceTimeId` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceTimeId` to the `Rank` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Price_assetEntityId_timestamp_idx";

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "timestamp",
ADD COLUMN     "priceTimeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Rank" ADD COLUMN     "priceTimeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "PriceTime" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PriceTime_timestamp_key" ON "PriceTime"("timestamp");

-- CreateIndex
CREATE INDEX "Price_assetEntityId_priceTimeId_idx" ON "Price"("assetEntityId", "priceTimeId");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_priceTimeId_fkey" FOREIGN KEY ("priceTimeId") REFERENCES "PriceTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_priceTimeId_fkey" FOREIGN KEY ("priceTimeId") REFERENCES "PriceTime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
