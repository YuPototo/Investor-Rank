import { router } from "../trpc";
import { authRouter } from "./auth";
import { assetRouter } from "./asset";
import { userRouter } from "./user";

export const appRouter = router({
  asset: assetRouter,
  auth: authRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
