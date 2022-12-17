import { router } from "../trpc";
import { authRouter } from "./auth";
import { assetRouter } from "./asset";

export const appRouter = router({
  asset: assetRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
