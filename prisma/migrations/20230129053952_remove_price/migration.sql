/*
  Warnings:

  - You are about to drop the `Price` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceTime` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_assetEntityId_fkey";

-- DropForeignKey
ALTER TABLE "Price" DROP CONSTRAINT "Price_priceTimeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_priceId_fkey";

-- DropTable
DROP TABLE "Price";

-- DropTable
DROP TABLE "PriceTime";
