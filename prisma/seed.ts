import { PrismaClient, AssetType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.assetEntity.createMany({
    data: [
      {
        name: "US Dollar",
        symbol: "USD",
        assetType: AssetType.CASH,
      },
      {
        name: "Bitcoin",
        symbol: "BTC",
        assetType: AssetType.CRYPTO,
      },
      {
        name: "Ethereum",
        symbol: "ETH",
        assetType: AssetType.CRYPTO,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
