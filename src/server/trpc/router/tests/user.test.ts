import { createContextInner } from "../../context";
import { appRouter } from "../_app";
import { test, expect } from "vitest";

test("add and get post", async () => {
  const ctx = await createContextInner({ session: null });
  const caller = appRouter.createCaller(ctx);

  const user = await caller.user.getFirst();

  expect(user).not.toBeNull();
});
