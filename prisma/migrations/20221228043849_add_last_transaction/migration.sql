-- CreateTable
CREATE TABLE "LastTransaction" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "transactionType" "TransactionType" NOT NULL,
    "userId" TEXT,
    "assetEntityId" INTEGER,

    CONSTRAINT "LastTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LastTransaction_userId_assetEntityId_transactionType_key" ON "LastTransaction"("userId", "assetEntityId", "transactionType");

-- AddForeignKey
ALTER TABLE "LastTransaction" ADD CONSTRAINT "LastTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LastTransaction" ADD CONSTRAINT "LastTransaction_assetEntityId_fkey" FOREIGN KEY ("assetEntityId") REFERENCES "AssetEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
