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

    const latestPriceTime = await ctx.prisma.priceTime.findFirst({
      orderBy: {
        id: "desc",
      },
    });

    if (!latestPriceTime) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `priceTime not found`,
      });
    }

    for (const asset of assets) {
      const price = await ctx.prisma.price.findUnique({
        where: {
          assetEntityId_priceTimeId: {
            assetEntityId: asset.id,
            priceTimeId: latestPriceTime.id,
          },
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `price not found for ${asset.symbol}`,
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

      const latestPriceTime = await ctx.prisma.priceTime.findFirst({
        orderBy: {
          id: "desc",
        },
      });

      if (!latestPriceTime) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `priceTime not found`,
        });
      }

      const price = await ctx.prisma.price.findUnique({
        where: {
          assetEntityId_priceTimeId: {
            assetEntityId: asset.id,
            priceTimeId: latestPriceTime.id,
          },
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `price not found for ${asset.symbol}`,
        });
      }

      return { ...asset, price: price.price };
    }),
});
