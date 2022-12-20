import type { User } from "@prisma/client";
import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

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
        return {
          error: {
            message: "User already has a name",
          },
        };
      }

      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          firstName: input.firstName,
          familyName: input.familyName,
        },
      });
      return { message: "Name added" };
    }),
});
