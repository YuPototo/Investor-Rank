// this is an example to show how to test
import add from "./add";
import { test, expect } from "vitest";

test("add", async () => {
  expect(add(1, 2)).toBe(3);
});
