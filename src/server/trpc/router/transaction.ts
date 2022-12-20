import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const transactionRouter = router({
  // todo: don't allow buy usd
  buy: protectedProcedure
    .input(
      z.object({
        quantity: z.number().min(0.0001),
        assetEntityId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // get dollar asset id
      const dollarAssetParam = await ctx.prisma.parameter.findFirst({
        where: {
          key: "dollarAssetId",
        },
      });

      if (!dollarAssetParam) {
        throw new Error("dollarAssetId not found");
      }

      const dollarAssetId = Number(dollarAssetParam.value);

      // get price
      const price = await ctx.prisma.price.findFirst({
        where: {
          assetEntityId: input.assetEntityId,
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Price for asset ${input.assetEntityId} not found`,
        });
      }

      // get user dollar
      const userDollar = await ctx.prisma.userAsset.findUnique({
        where: {
          userId_assetEntityId: {
            userId,
            assetEntityId: dollarAssetId,
          },
        },
      });

      if (!userDollar) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `userAsset for user ${userId} not found`,
        });
      }

      // check if user has enough dollar
      // todo: if user doesn't have enough money, buy the amount he can afford
      const totalCost = price.price * input.quantity;
      if (userDollar.quantity < totalCost) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `user ${userId} does not have enough dollar`,
        });
      }

      // update asset bought
      const userAsset = await ctx.prisma.userAsset.findUnique({
        where: {
          userId_assetEntityId: {
            userId,
            assetEntityId: input.assetEntityId,
          },
        },
      });

      if (!userAsset) {
        await ctx.prisma.userAsset.create({
          data: {
            userId,
            assetEntityId: input.assetEntityId,
            quantity: input.quantity,
          },
        });
      } else {
        await ctx.prisma.userAsset.update({
          data: {
            quantity: {
              increment: input.quantity,
            },
          },
          where: {
            userId_assetEntityId: {
              userId,
              assetEntityId: input.assetEntityId,
            },
          },
        });
      }

      // update user dollar
      await ctx.prisma.userAsset.update({
        data: {
          quantity: {
            decrement: totalCost,
          },
        },
        where: {
          userId_assetEntityId: {
            userId,
            assetEntityId: dollarAssetId,
          },
        },
      });

      // create transaction
      const transaction = await ctx.prisma.transaction.create({
        data: {
          userId,
          assetEntityId: input.assetEntityId,
          priceId: price.id,
          quantity: input.quantity,
          type: "BUY",
          timestamp: new Date(),
        },
      });

      return { transaction };
    }),
  sell: protectedProcedure
    .input(
      z.object({
        quantity: z.number().min(0.0001),
        assetEntityId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      // get dollar asset id
      const dollarAssetParam = await ctx.prisma.parameter.findFirst({
        where: {
          key: "dollarAssetId",
        },
      });

      if (!dollarAssetParam) {
        throw new Error("dollarAssetId not found");
      }

      const dollarAssetId = Number(dollarAssetParam.value);

      // get price
      const price = await ctx.prisma.price.findFirst({
        where: {
          assetEntityId: input.assetEntityId,
        },
        orderBy: {
          timestamp: "desc",
        },
      });

      if (!price) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Price for asset ${input.assetEntityId} not found`,
        });
      }

      // check if user has enough asset
      const userAsset = await ctx.prisma.userAsset.findUnique({
        where: {
          userId_assetEntityId: {
            userId,
            assetEntityId: input.assetEntityId,
          },
        },
      });

      if (!userAsset) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `userAsset for user ${userId} not found`,
        });
      }

      if (userAsset.quantity < input.quantity) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `user ${userId} does not have enough asset`,
        });
      }

      // update asset sold
      // delete record if quantity is 0
      if (userAsset.quantity === input.quantity) {
        await ctx.prisma.userAsset.delete({
          where: {
            userId_assetEntityId: {
              userId,
              assetEntityId: input.assetEntityId,
            },
          },
        });
      } else {
        await ctx.prisma.userAsset.update({
          data: {
            quantity: {
              decrement: input.quantity,
            },
          },
          where: {
            userId_assetEntityId: {
              userId,
              assetEntityId: input.assetEntityId,
            },
          },
        });
      }

      // update user dollar
      await ctx.prisma.userAsset.update({
        data: {
          quantity: {
            increment: price.price * input.quantity,
          },
        },
        where: {
          userId_assetEntityId: {
            userId,
            assetEntityId: dollarAssetId,
          },
        },
      });

      // create transaction
      const transaction = await ctx.prisma.transaction.create({
        data: {
          userId,
          assetEntityId: input.assetEntityId,
          priceId: price.id,
          quantity: input.quantity,
          type: "SELL",
          timestamp: new Date(),
        },
      });

      return { transaction };
    }),
});
