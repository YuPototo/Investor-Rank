import { PrismaClient, AssetType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.asset.createMany({
    data: [
      {
        name: "US Dollar",
        code: "USD",
        assetType: AssetType.CASH,
      },
      {
        name: "Bitcoin",
        code: "BTC",
        assetType: AssetType.CRYPTO,
      },
      {
        name: "Ethereum",
        code: "ETH",
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
