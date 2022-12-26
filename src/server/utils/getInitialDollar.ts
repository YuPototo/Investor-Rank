import type { PrismaClient } from "@prisma/client";

export default async function getInitialDollar(prisma: PrismaClient) {
  const initialDollarParam = await prisma.parameter.findFirst({
    where: {
      key: "initialDollar",
    },
  });

  if (!initialDollarParam) {
    throw new Error("initialDollar not found");
  }

  return Number(initialDollarParam.value);
}
