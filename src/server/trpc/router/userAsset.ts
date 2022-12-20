import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";

interface UserAssetOutput {
  id: number;
  quantity: number;
  symbol: string;
  price: number;
  value: number;
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
        assetEntity: {
          select: {
            symbol: true,
          },
        },
      },
    });

    // get price and value
    const userAssetsOutputs = await Promise.all(
      userAssets.map(async (userAsset) => {
        const price = await ctx.prisma.price.findFirst({
          where: {
            assetEntityId: userAsset.id,
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

        const userAssetOutput: UserAssetOutput = {
          id: userAsset.id,
          quantity: userAsset.quantity,
          symbol: userAsset.assetEntity.symbol,
          price: price.price,
          value: price.price * userAsset.quantity,
        };
        return userAssetOutput;
      })
    );

    return userAssetsOutputs;
  }),
});
