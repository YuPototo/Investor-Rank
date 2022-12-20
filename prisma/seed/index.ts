import { PrismaClient } from "@prisma/client";
import assetEntityData from "./assetEntity";
import userData from "./user";
import userAssets from "./userAsset";
import prices from "./price";

const prisma = new PrismaClient();

async function main() {
  await prisma.assetEntity.createMany({ data: assetEntityData });
  await prisma.user.create({ data: userData.user });
  await prisma.account.create({ data: userData.account });
  await prisma.session.create({ data: userData.session });
  await prisma.userAsset.createMany({ data: userAssets });
  await prisma.price.createMany({ data: prices });
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
