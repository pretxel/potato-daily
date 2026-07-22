import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";

import "svelte";
import "svelte-i18n";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(
      process.env.VITEST ? { compilerOptions: { hmr: false } } : {},
    ),
    svelteTesting(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["src/tests/**/*.test.{js,ts}"],
    setupFiles: ["src/tests/setup.js"],
  },
});
