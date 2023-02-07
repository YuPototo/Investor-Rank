import type { User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = router({
  addName: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        familyName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = (await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      })) as User;

      // Prevent users from changing their name
      if (user.firstName && user.familyName) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "You already have a name",
        });
      }

      // check if unique name exists
      let uniqueName = `${input.firstName}_${input.familyName}`.toLowerCase();

      const uniqueNameExists = await ctx.prisma.user.findUnique({
        where: { uniqueName },
      });

      if (uniqueNameExists) {
        const numberOfSimilarName = await ctx.prisma.user.count({
          where: {
            uniqueName: {
              startsWith: uniqueName,
            },
          },
        });

        uniqueName = `${uniqueName}_${numberOfSimilarName + 1}`;
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          firstName: input.firstName,
          familyName: input.familyName,
          uniqueName,
        },
      });

      return {
        firstName: input.firstName,
        familyName: input.familyName,
        uniqueName,
      };
    }),
  updateProfile: protectedProcedure
    .input(
      z.object({
        // 1000 is picked randomly, should change later
        headline: z.string().max(1000),

        // todo: check is url, check is from twitter
        twitter: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          headline: input.headline,
          twitter: input.twitter,
        },
      });
      return;
    }),
  // this procedure is for showing how to do test with tRPC
  count: publicProcedure.query(async ({ ctx }) => {
    const userCount = await ctx.prisma.user.count();
    return userCount;
  }),
});
