import { TRPCError } from "@trpc/server";
import getDollarId from "../../utils/getDollarId";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import getInitialDollar from "../../utils/getInitialDollar";

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

    // get initial dollar param
    const initialDollar = await getInitialDollar(ctx.prisma);

    // get price and value, and roi
    let totalValue = 0;

    const assets = await Promise.all(
      userAssets.map(async (userAsset) => {
        const price = await ctx.prisma.price.findFirst({
          where: {
            assetEntityId: userAsset.assetEntityId,
          },
          orderBy: {
            priceTimeId: "desc",
          },
        });

        if (!price) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Price for asset ${userAsset.id} not found`,
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
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const dollarId = await getDollarId(ctx.prisma);

    const userAsset = await ctx.prisma.userAsset.findFirst({
      where: {
        userId: ctx.session.user.id,
        assetEntityId: dollarId,
      },
    });

    if (!userAsset) {
      throw new Error("Dollar asset not found");
    }

    return { balance: userAsset.quantity };
  }),
  getOneById: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const userAsset = await ctx.prisma.userAsset.findUnique({
        where: {
          userId_assetEntityId: {
            userId: ctx.session.user.id,
            assetEntityId: input,
          },
        },
      });

      if (!userAsset) {
        throw new Error("User asset not found");
      }

      return userAsset;
    }),
  getRoiByUserId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input;

      const userAssets = await ctx.prisma.userAsset.findMany({
        where: {
          userId,
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

      // get initial dollar param
      const initialDollar = await getInitialDollar(ctx.prisma);

      // get price and value, and roi
      let totalValue = 0;

      await Promise.all(
        userAssets.map(async (userAsset) => {
          const price = await ctx.prisma.price.findFirst({
            where: {
              assetEntityId: userAsset.assetEntityId,
            },
            orderBy: {
              priceTimeId: "desc",
            },
          });

          if (!price) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: `Price for asset ${userAsset.id} not found`,
            });
          }

          // update total value
          totalValue += price.price * userAsset.quantity;
        })
      );

      const roi = Math.round((totalValue / initialDollar) * 1000) / 1000 - 1;

      return roi;
    }),
});
