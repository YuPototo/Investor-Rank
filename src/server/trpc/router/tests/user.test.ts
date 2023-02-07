import { createContextInner } from "../../context";
import { appRouter } from "../_app";
import { test, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "../../../db/client";

beforeAll(async () => {
  await prisma.user.create({
    data: {
      uniqueName: "test_test",
      email: "test@test.com",
    },
  });
});

afterAll(async () => {
  await prisma.user.deleteMany();
});

test("add and get post", async () => {
  const ctx = await createContextInner({ session: null });
  const caller = appRouter.createCaller(ctx);

  const userCount = await caller.user.count();

  expect(userCount).toBe(1);
});
