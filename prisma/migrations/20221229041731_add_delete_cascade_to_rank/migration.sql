-- DropForeignKey
ALTER TABLE "Rank" DROP CONSTRAINT "Rank_userId_fkey";

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
