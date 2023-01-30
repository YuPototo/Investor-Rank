import { PrismaClient } from "@prisma/client";
import assetEntityData from "./assetEntity";
import userData from "./user";
import userAssets from "./userAsset";
import parameter from "./parameter";
import rank from "./rank";

const prisma = new PrismaClient();

async function main() {
  await prisma.assetEntity.createMany({ data: assetEntityData });
  await prisma.user.createMany({ data: userData.users });
  await prisma.account.create({ data: userData.account });
  await prisma.session.create({ data: userData.session });
  await prisma.userAsset.createMany({ data: userAssets });
  await prisma.parameter.createMany({ data: parameter });
  await prisma.rank.createMany({ data: rank });
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
