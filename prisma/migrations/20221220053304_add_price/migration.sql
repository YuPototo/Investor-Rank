-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "assetEntityId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Price_assetEntityId_timestamp_idx" ON "Price"("assetEntityId", "timestamp");

-- AddForeignKey
ALTER TABLE "Price" ADD CONSTRAINT "Price_assetEntityId_fkey" FOREIGN KEY ("assetEntityId") REFERENCES "AssetEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
