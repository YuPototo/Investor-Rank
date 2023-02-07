import { fileURLToPath } from "url";
import { configDefaults, defineConfig } from "vitest/config";
import { loadEnvConfig } from "@next/env";

/**
 * If we don't do this, we will get an error saying env var not found.
 *
 * Check this link (need channel access):
 * https://discord.com/channels/966627436387266600/1053599021589086260/1072327857168191588
 */
loadEnvConfig(process.cwd());

export default defineConfig({
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, "**/playwright/**"],
    alias: {
      "~/": fileURLToPath(new URL("./src/", import.meta.url)),
    },
  },
});
