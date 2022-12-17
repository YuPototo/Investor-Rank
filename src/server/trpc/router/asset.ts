import { z } from "zod";
import { AssetType } from "@prisma/client";

import { router, publicProcedure } from "../trpc";

// use native enum with Zod
// https://github.com/colinhacks/zod#native-enums
const AssetTypeEnum = z.nativeEnum(AssetType);
type AssetTypeEnum = z.infer<typeof AssetTypeEnum>; // Fr

export const assetRouter = router({
  //   add: publicProcedure
  //     .input(
  //       z.object({
  //         name: z.string(),
  //         code: z.string(),
  //         assetType: AssetTypeEnum,
  //       })
  //     )
  //     .query(async ({ input, ctx }) => {
  //       const asset = await ctx.prisma.asset.create({
  //         data: {
  //           ...input,
  //         },
  //       });
  //       return { asset };
  //     }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.asset.findMany();
  }),
});
