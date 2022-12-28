import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import getDollarId from "../../utils/getDollarId";
import type { PrismaClient } from "@prisma/client";

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

      // check last transaction
      const { isPossible } = await checkTransactionPossibiliy(
        ctx.prisma,
        userId,
        input.assetEntityId,
        "BUY"
      );

      if (!isPossible) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can buy after 30 mins of selling",
        });
      }

      // get dollar asset id
      const dollarAssetId = await getDollarId(ctx.prisma);

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
      // todo: if user doesn't have enough money, buy the amount he can afford?
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

      // upsert last transaction
      await ctx.prisma.lastTransaction.upsert({
        where: {
          userId_assetEntityId_transactionType: {
            userId,
            assetEntityId: input.assetEntityId,
            transactionType: "BUY",
          },
        },
        update: {
          timestamp: new Date(),
        },
        create: {
          userId,
          assetEntityId: input.assetEntityId,
          transactionType: "BUY",
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

      // check last transaction
      const { isPossible } = await checkTransactionPossibiliy(
        ctx.prisma,
        userId,
        input.assetEntityId,
        "SELL"
      );

      if (!isPossible) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You can sell after 30 mins of buying",
        });
      }

      // get dollar asset id
      const dollarAssetId = await getDollarId(ctx.prisma);

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

      // upsert last transaction
      await ctx.prisma.lastTransaction.upsert({
        where: {
          userId_assetEntityId_transactionType: {
            userId,
            assetEntityId: input.assetEntityId,
            transactionType: "SELL",
          },
        },
        update: {
          timestamp: new Date(),
        },
        create: {
          userId,
          assetEntityId: input.assetEntityId,
          transactionType: "SELL",
          timestamp: new Date(),
        },
      });

      return { transaction };
    }),
  getOne: publicProcedure.input(z.string()).query(async ({ input, ctx }) => {
    const transactionId = input;

    const transaction = await ctx.prisma.transaction.findUnique({
      where: {
        id: transactionId,
      },
      select: {
        id: true,
        type: true,
        quantity: true,
        timestamp: true,
        assetEntity: {
          select: {
            symbol: true,
          },
        },
        price: {
          select: {
            price: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new TRPCError({
        code: "BAD_REQUEST", // ? should I use different code?
        message: `transaction ${transactionId} not found`,
      });
    }

    const output = {
      ...transaction,
      assetEntity: transaction.assetEntity.symbol,
      price: transaction.price.price,
    };

    return { transaction: output };
  }),
  isTransactionPossible: protectedProcedure
    .input(
      z.object({
        assetEntityId: z.number(),
        transactionType: z.enum(["BUY", "SELL"]),
      })
    )
    .query(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const { assetEntityId, transactionType } = input;

      const data = await checkTransactionPossibiliy(
        ctx.prisma,
        userId,
        assetEntityId,
        transactionType
      );

      return data;
    }),
});

async function checkTransactionPossibiliy(
  prisma: PrismaClient,
  userId: string,
  assetEntityId: number,
  transactionType: "BUY" | "SELL"
) {
  const lookedUpTransactionType = transactionType === "BUY" ? "SELL" : "BUY";

  const lastTransaction = await prisma.lastTransaction.findUnique({
    where: {
      userId_assetEntityId_transactionType: {
        userId,
        assetEntityId,
        transactionType: lookedUpTransactionType,
      },
    },
  });

  if (!lastTransaction) {
    return { isPossible: true };
  } else {
    // if less than 30 mins ago, return false
    const isPossible =
      lastTransaction.timestamp < new Date(Date.now() - 30 * 60 * 1000);
    const availableInMins =
      30 -
      Math.floor((Date.now() - lastTransaction.timestamp.getTime()) / 60000);

    return { isPossible, availableInMins };
  }
}
