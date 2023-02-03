import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const rankRouter = router({
  get: publicProcedure
    .input(
      z.object({
        page: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const take = 20; // get 20 items
      const skip = input.page * take;

      const ranks = await ctx.prisma.rank.findMany({
        select: {
          rank: true,
          roi: true,
          user: {
            select: {
              id: true,
              firstName: true,
              familyName: true,
              uniqueName: true,
            },
          },
        },
        take,
        skip,
      });

      const hasPrevPage = skip > 0;

      const hasNextPage = (await ctx.prisma.rank.count()) > skip + take;

      return { ranks, hasNextPage, hasPrevPage };
    }),
  getPerformanceByUniqueName: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<PerformanceResponse> => {
      const uniqueName = input.toLowerCase();

      const user = await ctx.prisma.user.findUnique({
        where: {
          uniqueName,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User don't exists",
        });
      }

      // user info
      const userName = user.firstName
        ? `${user.firstName} ${user.familyName}`
        : user.uniqueName;

      // format date to yyyy-mm-dd
      const joinDate = user.createdAt.toISOString().split("T")[0] as string;

      const headline = user.headline;

      const twitterLink = user.twitter;

      const rank = await ctx.prisma.rank.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!rank) {
        return {
          status: "unavailable",
          joinDate,
          headline: headline || undefined,
          twitterLink: twitterLink || undefined,
          userId: user.id,
          userName,
        };
      }

      const userCount = await ctx.prisma.rank.count();

      return {
        ...rank,
        userCount,
        userId: user.id,
        userName,
        joinDate,
        headline: headline || undefined,
        twitterLink: twitterLink || undefined,
        status: "success",
      };
    }),
});

type PerformanceResponse =
  | {
      status: "success";
      roi: number;
      rank: number;
      userCount: number;

      userId: string;
      userName: string;
      joinDate: string;
      headline?: string;
      twitterLink?: string;
    }
  | {
      status: "unavailable";
      userId: string;
      userName: string;
      joinDate: string;
      headline?: string;
      twitterLink?: string;
    };
