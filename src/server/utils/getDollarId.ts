import type { PrismaClient } from "@prisma/client";

export default async function getDollarId(prisma: PrismaClient) {
  const dollarAssetParam = await prisma.parameter.findFirst({
    where: {
      key: "dollarAssetId",
    },
  });

  if (!dollarAssetParam) {
    throw new Error("dollarAssetId not found");
  }

  return Number(dollarAssetParam.value);
}
