import { defineConfig } from "npm:vite@^5";
import { svelte } from "npm:@sveltejs/vite-plugin-svelte@^4";
import { svelteTesting } from "npm:@testing-library/svelte@^5.2.0/vite";

import "npm:svelte@^5";
import "npm:svelte-i18n@^4.0.0";

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
