import { router, publicProcedure } from "../trpc";

export const assetEntityRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.assetEntity.findMany();
  }),
});
