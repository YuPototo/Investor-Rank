import { router, protectedProcedure } from "../trpc";

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

    // flatten data
    const userAssetsFlattened = userAssets.map((userAsset) => ({
      id: userAsset.id,
      quantity: userAsset.quantity,
      symbol: userAsset.assetEntity.symbol,
    }));
    return userAssetsFlattened;
  }),
});
