/*
  Warnings:

  - A unique constraint covering the columns `[uniqueName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_uniqueName_key" ON "User"("uniqueName");
