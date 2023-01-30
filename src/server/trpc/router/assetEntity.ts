import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const assetEntityRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.assetEntity.findMany();
  }),
  // get all buyable assets
  getBuyable: publicProcedure.query(async ({ ctx }) => {
    const assets = await ctx.prisma.assetEntity.findMany({
      where: {
        buyable: true,
      },
    });

    return assets;
  }),

  getBySymbol: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const symbol = input.toUpperCase();
      const asset = await ctx.prisma.assetEntity.findFirst({
        where: {
          symbol,
        },
      });
      if (!asset) {
        throw new Error(`No asset found for symbol ${symbol}`);
      }

      return asset;
    }),
});
