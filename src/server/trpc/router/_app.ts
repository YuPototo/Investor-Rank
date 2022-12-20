import { router } from "../trpc";
import { authRouter } from "./auth";
import { assetEntityRouter } from "./assetEntity";
import { userRouter } from "./user";
import { userAssetRouter } from "./userAsset";
import { transactionRouter } from "./transaction";

export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  assetEntity: assetEntityRouter,
  userAsset: userAssetRouter,
  transaction: transactionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
