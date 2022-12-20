import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

interface AssetItem {
  id: number;
  quantity: number;
  symbol: string;
  price: number;
  value: number;
}

interface UserAssetOutput {
  assets: AssetItem[];
  roi: number;
}

export const userAssetRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userAssets = await ctx.prisma.userAsset.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      select: {
        id: true,
        quantity: true,
        assetEntityId: true,
        assetEntity: {
          select: {
            symbol: true,
          },
        },
      },
    });

    // get initial dollar amount
    // get initial dollar param
    const initialDollarParam = await ctx.prisma.parameter.findFirst({
      where: {
        key: "initialDollar",
      },
    });

    if (!initialDollarParam) {
      throw new Error("initialDollar not found");
    }

    const initialDollar = Number(initialDollarParam.value);

    // get price and value, and roi
    let totalValue = 0;

    const assets = await Promise.all(
      userAssets.map(async (userAsset) => {
        const price = await ctx.prisma.price.findFirst({
          where: {
            assetEntityId: userAsset.assetEntityId,
          },
          orderBy: {
            timestamp: "desc",
          },
        });

        if (!price) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Price for asset ${userAsset} not found`,
          });
        }

        // update total value
        totalValue += price.price * userAsset.quantity;

        const userAssetOutput: AssetItem = {
          id: userAsset.id,
          quantity: userAsset.quantity,
          symbol: userAsset.assetEntity.symbol,
          price: price.price,
          value: price.price * userAsset.quantity,
        };
        return userAssetOutput;
      })
    );

    const roi = Math.round((totalValue / initialDollar) * 1000) / 1000 - 1;

    const output: UserAssetOutput = { assets, roi };
    return output;
  }),
});
