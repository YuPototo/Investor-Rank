import { router, publicProcedure } from "../trpc";

export const assetEntityRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.assetEntity.findMany();
  }),
  getBuyable: publicProcedure.query(async ({ ctx }) => {
    const assets = await ctx.prisma.assetEntity.findMany({
      where: {
        buyable: true,
      },
    });

    // get asset prices
    const assetOutput = [];

    for (const asset of assets) {
      const price = await ctx.prisma.price.findFirst({
        where: {
          assetEntityId: asset.id,
        },
        orderBy: {
          timestamp: "desc",
        },
      });
      if (!price) {
        throw new Error(`No price found for asset ${asset.id}`);
      }
      assetOutput.push({ ...asset, price: price.price });
    }

    return assetOutput;
  }),
});
