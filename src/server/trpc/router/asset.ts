import { router, publicProcedure } from "../trpc";

export const assetRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.asset.findMany();
  }),
});
