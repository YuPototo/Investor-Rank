import { router, publicProcedure } from "../trpc";
import { z } from "zod";

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
  getPerformanceByUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }): Promise<PerformanceResponse> => {
      const userId = input;

      const rank = await ctx.prisma.rank.findUnique({
        where: {
          userId,
        },
      });

      if (!rank) {
        return { status: "unavailable" };
      }

      const userCount = await ctx.prisma.rank.count();

      return { ...rank, userCount, status: "success" };
    }),
});

type PerformanceResponse =
  | {
      status: "success";
      roi: number;
      rank: number;
      userCount: number;
    }
  | {
      status: "unavailable";
    };
