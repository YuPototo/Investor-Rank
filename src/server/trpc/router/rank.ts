import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const rankRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const ranks = await ctx.prisma.rank.findMany({
      select: {
        rank: true,
        roi: true,
        User: {
          select: {
            id: true,
            firstName: true,
            familyName: true,
          },
        },
      },
      orderBy: {
        roi: "desc",
      },
    });
    return ranks;
  }),
  getPerformanceByUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input;
      const rank = await ctx.prisma.rank.findUnique({
        where: {
          userId,
        },
      });
      if (!rank) {
        throw new Error("Rank not found");
      }

      const userCount = await ctx.prisma.rank.count();

      return { ...rank, userCount };
    }),
});
