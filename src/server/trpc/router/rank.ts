import { router, publicProcedure } from "../trpc";

export const rankRouter = router({
  get: publicProcedure.query(async ({ ctx }) => {
    const ranks = await ctx.prisma.rank.findMany({
      orderBy: {
        roi: "desc",
      },
    });
    return ranks;
  }),
});
