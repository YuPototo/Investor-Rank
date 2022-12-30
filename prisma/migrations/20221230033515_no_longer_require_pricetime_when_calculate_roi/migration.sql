/*
  Warnings:

  - The primary key for the `Rank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `priceTimeId` on the `Rank` table. All the data in the column will be lost.
  - Added the required column `timestamp` to the `Rank` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Rank" DROP CONSTRAINT "Rank_priceTimeId_fkey";

-- AlterTable
ALTER TABLE "Rank" DROP CONSTRAINT "Rank_pkey",
DROP COLUMN "priceTimeId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "rank" DROP DEFAULT,
ADD CONSTRAINT "Rank_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Rank_rank_seq";
