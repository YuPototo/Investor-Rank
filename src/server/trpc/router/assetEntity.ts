import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
          priceTimeId: "desc",
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Price for asset ${asset.id} not found`,
        });
      }

      assetOutput.push({ ...asset, price: price.price });
    }

    return assetOutput;
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

      const price = await ctx.prisma.price.findFirst({
        where: {
          assetEntityId: asset.id,
        },
        orderBy: {
          priceTimeId: "desc",
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Price for asset ${asset.id} not found`,
        });
      }

      return { ...asset, price: price.price };
    }),
});
